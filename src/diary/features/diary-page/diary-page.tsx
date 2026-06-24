import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/core/store/hooks'
import { selectAuthUser } from '@/auth/data-access/store/auth.selectors'
import {
  selectDiaryEntries,
  selectDiarySaveStatus,
  selectDiaryStatus,
} from '@/diary/data-access/store'
import { loadEntriesThunk, saveEntryThunk } from '@/diary/data-access/store/diary.thunks'
import { resetSaveStatus } from '@/diary/data-access/store/diary.slice'
import { DIARY_QUESTION_KEYS } from '@/diary/data-access/constants/diary.constants'
import type { MoodId } from '@/diary/data-access/constants/diary.constants'
import { Moods } from '@/diary/data-access/constants/diary.constants'
import MoodSelector from '@/diary/ui/mood-selector/mood-selector'
import DailyQuestionCard from '@/diary/ui/daily-question-card/daily-question-card'
import EntryList from '@/diary/ui/entry-list/entry-list'
import { DiaryPageRoot, DiaryScrollBody } from '@/diary/features/diary-page/diary-page.styled'

const pickRandomQuestion = (keys: readonly string[], t: (key: string) => string): string => {
  const idx = Math.floor(Math.random() * keys.length)
  return t(keys[idx])
}

const DiaryPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const user = useAppSelector(selectAuthUser)
  const entries = useAppSelector(selectDiaryEntries)
  const status = useAppSelector(selectDiaryStatus)
  const saveStatus = useAppSelector(selectDiarySaveStatus)

  const uid = user?.uid

  const [selectedMood, setSelectedMood] = useState<MoodId>(Moods.NEUTRAL.id as MoodId)
  const [selectedMoodEmoji, setSelectedMoodEmoji] = useState<string>(Moods.NEUTRAL.emoji)
  const [text, setText] = useState('')
  const [question, setQuestion] = useState(() =>
    pickRandomQuestion(DIARY_QUESTION_KEYS, t as (key: string) => string),
  )

  useEffect(() => {
    if (uid && status === 'idle') {
      void dispatch(loadEntriesThunk({ uid }))
    }
  }, [dispatch, uid, status])

  useEffect(() => {
    if (saveStatus === 'saved') {
      const timer = setTimeout(() => {
        setText('')
        setQuestion(pickRandomQuestion(DIARY_QUESTION_KEYS, t as (key: string) => string))
        dispatch(resetSaveStatus())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [saveStatus, dispatch, t])

  const handleMoodSelect = useCallback((id: MoodId, emoji: string) => {
    setSelectedMood(id)
    setSelectedMoodEmoji(emoji)
  }, [])

  const handleSave = useCallback(() => {
    if (!text.trim() || !uid) return
    void dispatch(
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
  }, [dispatch, uid, text, question, selectedMood, selectedMoodEmoji])

  const translatedEntries = useMemo(() => entries, [entries])

  return (
    <DiaryPageRoot>
      <DiaryScrollBody>
        <MoodSelector
          label={t('diary.moodLabel')}
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
          onChange={setText}
          onSave={handleSave}
        />

        <EntryList
          entries={translatedEntries}
          title={t('diary.historyTitle')}
          emptyMessage={t('diary.empty')}
        />
      </DiaryScrollBody>
    </DiaryPageRoot>
  )
}

export default DiaryPage
