import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { logger } from 'firebase-functions'

// The Gemini key lives in Secret Manager, injected only into this function at
// runtime — never in the client bundle. Set it with:
//   firebase functions:secrets:set GEMINI_API_KEY
const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY')

const GEMINI_MODEL = 'gemini-2.5-flash-lite'
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

// The Feelio companion persona, ported verbatim from Feelio-Judeteana's
// getConvoSystemPrompt(): on-topic (well-being/emotions only), short, warm, safe.
const FEELIO_SYSTEM_PROMPT =
  'You are Feelio, a friendly and empathetic digital companion. You speak in English, but if the user writes to you in another language, answer them in that language. Use a warm tone. Your answers should be short (2-4 sentences). Do not use special characters or markdown. You should act as a therapist but tell the user to seek for professional help if they express severe mental health issues. Your main goal is to support the user and give them personalized advice on how to improve their well-being based on their feelings and the information they share with you. You should not give generic advice, but try to tailor it to the user’s specific situation. Always encourage the user to take care of themselves and remind them that you are here to support them. You should answer only well being and emotions related questions, for example you should refuse to answer mathematical questions or questions about general knowledge. Always be empathetic and supportive in your answers.'

// Abuse guardrails: bound how much we ever forward to the model.
const MAX_TURNS = 20
const MAX_CHARS_PER_TURN = 4000

interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
}

interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
}

const sanitizeHistory = (raw: unknown): ChatTurn[] => {
  if (!Array.isArray(raw)) return []
  return raw
    .filter(
      (turn): turn is ChatTurn =>
        !!turn &&
        typeof turn === 'object' &&
        (turn as ChatTurn).role !== undefined &&
        typeof (turn as ChatTurn).content === 'string',
    )
    .map(
      (turn): ChatTurn => ({
        role: turn.role === 'assistant' ? 'assistant' : 'user',
        content: turn.content.slice(0, MAX_CHARS_PER_TURN),
      }),
    )
    .slice(-MAX_TURNS)
}

export const feelioChat = onCall({ secrets: [GEMINI_API_KEY] }, async (request) => {
  // Only signed-in users may talk to the assistant.
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'You must be signed in to chat with Feelio.')
  }

  const history = sanitizeHistory((request.data as { history?: unknown } | undefined)?.history)
  if (history.length === 0) {
    throw new HttpsError('invalid-argument', 'A non-empty conversation history is required.')
  }

  let response: Response
  try {
    response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY.value()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: FEELIO_SYSTEM_PROMPT }] },
        contents: history.map((turn) => ({
          role: turn.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: turn.content }],
        })),
      }),
    })
  } catch (error) {
    logger.error('Gemini request threw', error)
    throw new HttpsError('unavailable', 'Could not reach the assistant. Please try again.')
  }

  if (!response.ok) {
    logger.error('Gemini responded with an error', { status: response.status })
    throw new HttpsError('internal', 'The assistant is unavailable right now.')
  }

  const data = (await response.json()) as GeminiResponse
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
  if (!reply) {
    throw new HttpsError('internal', 'The assistant returned an empty reply.')
  }

  return { reply }
})
