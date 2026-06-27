import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/core/store/hooks'
import { selectUid } from '@/shared/data-access/store/current-user.selectors'
import {
  selectDiaryEntries,
  selectDiarySaveStatus,
  selectDiaryStatus,
} from '@/diary/data-access/store'
import { loadEntriesThunk, saveEntryThunk } from '@/diary/data-access/store/diary.thunks'
import { resetSaveStatus } from '@/diary/data-access/store/diary.slice'
import {
  DIARY_QUESTION_KEYS,
  MOOD_LABEL_KEYS,
  MOOD_LIST,
  Moods,
} from '@/diary/data-access/constants/diary.constants'
import type { MoodId } from '@/diary/data-access/constants/diary.constants'
import MoodSelector from '@/diary/ui/mood-selector/mood-selector'
import DailyQuestionCard from '@/diary/ui/daily-question-card/daily-question-card'
import EntryList from '@/diary/ui/entry-list/entry-list'
import { DiaryPageRoot, DiaryScrollBody } from '@/diary/features/diary-page/diary-page.styled'

type QuestionKey = (typeof DIARY_QUESTION_KEYS)[number]

const pickRandomQuestionKey = (): QuestionKey => {
  const idx = Math.floor(Math.random() * DIARY_QUESTION_KEYS.length)
  return DIARY_QUESTION_KEYS[idx]
}

const DiaryPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const uid = useAppSelector(selectUid)
  const entries = useAppSelector(selectDiaryEntries)
  const status = useAppSelector(selectDiaryStatus)
  const saveStatus = useAppSelector(selectDiarySaveStatus)

  const [selectedMood, setSelectedMood] = useState<MoodId>(Moods.NEUTRAL.id)
  const [selectedMoodEmoji, setSelectedMoodEmoji] = useState<string>(Moods.NEUTRAL.emoji)
  const [text, setText] = useState('')
  // Store the key, not the translated text, so the prompt re-translates live
  // when the language changes instead of freezing in the language it was picked.
  const [questionKey, setQuestionKey] = useState<QuestionKey>(pickRandomQuestionKey)
  const question = t(questionKey)

  useEffect(() => {
    if (uid && status === 'idle') {
      void dispatch(loadEntriesThunk({ uid }))
    }
  }, [dispatch, uid, status])

  // Once saved, revert the "saved" placeholder confirmation back to idle after a
  // beat (the text itself is cleared in handleSave on success).
  useEffect(() => {
    if (saveStatus !== 'saved') return
    const timer = setTimeout(() => dispatch(resetSaveStatus()), 3000)
    return () => clearTimeout(timer)
  }, [saveStatus, dispatch])

  const handleMoodSelect = useCallback((id: MoodId, emoji: string) => {
    setSelectedMood(id)
    setSelectedMoodEmoji(emoji)
  }, [])

  const handleSave = useCallback(() => {
    if (!text.trim() || !uid) return
    void (async () => {
      const result = await dispatch(
        saveEntryThunk({
          uid,
          payload: {
            entry: text.trim(),
            question,
            mood: selectedMood,
            moodEmoji: selectedMoodEmoji,
          },
        }),
      )
      // Clear on success so the confirmation shows in the now-empty textarea's
      // placeholder, and surface a fresh prompt for the next entry.
      if (saveEntryThunk.fulfilled.match(result)) {
        setText('')
        setQuestionKey(pickRandomQuestionKey())
      }
    })()
  }, [dispatch, uid, text, question, selectedMood, selectedMoodEmoji])

  const moodLabels = MOOD_LIST.reduce(
    (labels, mood) => {
      labels[mood.id] = t(MOOD_LABEL_KEYS[mood.id])
      return labels
    },
    {} as Record<MoodId, string>,
  )

  return (
    <DiaryPageRoot>
      <DiaryScrollBody>
        <MoodSelector
          label={t('diary.moodLabel')}
          moodLabels={moodLabels}
          selected={selectedMood}
          onSelect={handleMoodSelect}
        />

        <DailyQuestionCard
          question={question}
          value={text}
          placeholder={t('diary.placeholder')}
          buttonLabel={t('diary.btnSave')}
          saveStatus={saveStatus}
          savedMessage={t('diary.saved')}
          errorMessage={t('diary.error.saveFailed')}
          onChange={setText}
          onSave={handleSave}
        />

        <EntryList
          entries={entries}
          title={t('diary.historyTitle')}
          emptyMessage={t('diary.empty')}
          expandLabel={t('diary.showMore')}
          collapseLabel={t('diary.showLess')}
        />
      </DiaryScrollBody>
    </DiaryPageRoot>
  )
}

export default DiaryPage
