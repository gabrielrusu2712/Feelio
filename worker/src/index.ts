import { decodeProtectedHeader, importX509, jwtVerify } from 'jose'

// Cloudflare Worker that proxies Feelio's AI chat to the Gemini API. It replaces
// the Firebase Cloud Function (which required the Blaze billing plan) — this runs
// on Cloudflare's free tier with no card. The Gemini key lives as a Worker secret
// and never reaches the browser bundle. Only signed-in Feelio users may call it:
// the caller's Firebase ID token is verified against Google's public certs.

interface Env {
  GEMINI_API_KEY: string
  FIREBASE_PROJECT_ID: string
  // Comma-separated list of allowed browser origins (e.g. localhost + prod).
  ALLOWED_ORIGIN: string
}

const GEMINI_MODEL = 'gemini-2.5-flash-lite'
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

// The Feelio companion persona, identical to the retired Cloud Function.
const FEELIO_SYSTEM_PROMPT =
  'You are Feelio, a friendly and empathetic digital companion. You understand English and Romanian. Reply in the same language the user writes in. If the language is ambiguous, unclear, or a single greeting (for example "salut", which exists in several languages), prefer Romanian or English — never reply in French or other languages unless the user clearly writes a full sentence in that language. Use a warm tone. Your answers should be short (2-4 sentences). Do not use special characters or markdown. You should act as a therapist but tell the user to seek for professional help if they express severe mental health issues. Your main goal is to support the user and give them personalized advice on how to improve their well-being based on their feelings and the information they share with you. You should not give generic advice, but try to tailor it to the user’s specific situation. Always encourage the user to take care of themselves and remind them that you are here to support them. You should answer only well being and emotions related questions, for example you should refuse to answer mathematical questions or questions about general knowledge. Always be empathetic and supportive in your answers.'

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

// Firebase ID tokens are RS256 JWTs signed by Google's securetoken service. The
// signing certs (x509 PEMs keyed by `kid`) rotate; we cache them in-isolate for
// the lifetime the endpoint's Cache-Control allows.
const CERTS_URL =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'

let certCache: { certs: Record<string, string>; expiresAt: number } | null = null

const getGoogleCerts = async (): Promise<Record<string, string>> => {
  if (certCache && certCache.expiresAt > Date.now()) return certCache.certs

  const response = await fetch(CERTS_URL)
  if (!response.ok) throw new Error(`Failed to fetch Google certs (${response.status})`)
  const certs = (await response.json()) as Record<string, string>

  // Respect the endpoint's max-age; fall back to 1h if the header is missing.
  const cacheControl = response.headers.get('cache-control') ?? ''
  const maxAge = Number(/max-age=(\d+)/.exec(cacheControl)?.[1] ?? 3600)
  certCache = { certs, expiresAt: Date.now() + maxAge * 1000 }

  return certs
}

const verifyIdToken = async (token: string, projectId: string): Promise<void> => {
  const { kid } = decodeProtectedHeader(token)
  if (!kid) throw new Error('ID token missing key id')

  const certs = await getGoogleCerts()
  const pem = certs[kid]
  if (!pem) throw new Error('ID token signed by an unknown key')

  const key = await importX509(pem, 'RS256')
  // jwtVerify checks the signature and expiry; issuer/audience must match the project.
  const { payload } = await jwtVerify(token, key, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  })
  if (!payload.sub) throw new Error('ID token missing subject')
}

const allowedOrigin = (request: Request, env: Env): string | null => {
  const origin = request.headers.get('Origin')
  if (!origin) return null
  const allowList = env.ALLOWED_ORIGIN.split(',').map((value) => value.trim())
  return allowList.includes(origin) ? origin : null
}

const corsHeaders = (origin: string): Record<string, string> => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
})

const json = (body: unknown, status: number, headers: Record<string, string>): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  })

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = allowedOrigin(request, env)

    // Preflight: only answer for allowed origins.
    if (request.method === 'OPTIONS') {
      if (!origin) return new Response(null, { status: 403 })
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    if (!origin) return json({ error: 'Origin not allowed.' }, 403, {})
    const cors = corsHeaders(origin)

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed.' }, 405, cors)
    }

    // Only signed-in Feelio users may talk to the assistant.
    const authHeader = request.headers.get('Authorization') ?? ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
    if (!token) {
      return json({ error: 'You must be signed in to chat with Feelio.' }, 401, cors)
    }
    try {
      await verifyIdToken(token, env.FIREBASE_PROJECT_ID)
    } catch {
      return json({ error: 'Your session is invalid. Please sign in again.' }, 401, cors)
    }

    let history: ChatTurn[]
    try {
      const body = (await request.json()) as { history?: unknown }
      history = sanitizeHistory(body?.history)
    } catch {
      return json({ error: 'Invalid request body.' }, 400, cors)
    }
    if (history.length === 0) {
      return json({ error: 'A non-empty conversation history is required.' }, 400, cors)
    }

    let geminiResponse: Response
    try {
      geminiResponse = await fetch(`${GEMINI_ENDPOINT}?key=${env.GEMINI_API_KEY}`, {
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
    } catch {
      return json({ error: 'Could not reach the assistant. Please try again.' }, 503, cors)
    }

    if (!geminiResponse.ok) {
      return json({ error: 'The assistant is unavailable right now.' }, 502, cors)
    }

    const data = (await geminiResponse.json()) as GeminiResponse
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    if (!reply) {
      return json({ error: 'The assistant returned an empty reply.' }, 502, cors)
    }

    return json({ reply }, 200, cors)
  },
}
