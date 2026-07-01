import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/core/store/hooks'
import { selectUid } from '@/shared/data-access/store/current-user.selectors'
import { toDateKey } from '@/user/data-access/utils/date-key'
import { CATEGORIES, DAILY_LEVELS } from '@/wellbeing/data-access/constants/wellbeing.constants'
import type { CategoryKey } from '@/wellbeing/data-access/constants/wellbeing.constants'
import { pickDailyChallengeKeys } from '@/wellbeing/data-access/utils/daily-challenges'
import {
  selectCompletedLevels,
  selectSelectedCategory,
  selectWellbeingStatus,
} from '@/wellbeing/data-access/store'
import { setCategory } from '@/wellbeing/data-access/store/wellbeing.slice'
import {
  awardChallengeThunk,
  loadChallengeProgressThunk,
} from '@/wellbeing/data-access/store/wellbeing.thunks'
import CategoryBar from '@/wellbeing/ui/category-bar/category-bar'
import SkyClimb from '@/wellbeing/ui/sky-climb/sky-climb'
import ChallengeModal from '@/wellbeing/ui/challenge-modal/challenge-modal'
import {
  Header,
  PageRoot,
  ScrollBody,
} from '@/wellbeing/features/wellbeing-page/wellbeing-page.styled'

// Wellbeing/challenges page (Phase 3). Pick a category, walk its level map, and
// complete the active challenge — each completion fills the vibe bar and earns
// XP toward the next level (stars on level-up). Cross-slice economy lives in
// awardChallengeThunk.
const WellbeingPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const uid = useAppSelector(selectUid)
  const status = useAppSelector(selectWellbeingStatus)
  const selectedCategory = useAppSelector(selectSelectedCategory)
  const completedLevels = useAppSelector(selectCompletedLevels)

  const [openLevel, setOpenLevel] = useState<number | null>(null)

  // The day's challenge set for the active category — a date-seeded shuffle, so it
  // rotates daily and never feels repetitive (index 0 = level 1).
  const today = toDateKey()
  const dailyKeys = useMemo(
    () => pickDailyChallengeKeys(selectedCategory, today),
    [selectedCategory, today],
  )

  useEffect(() => {
    if (uid && status === 'idle') {
      void dispatch(loadChallengeProgressThunk({ uid }))
    }
  }, [dispatch, uid, status])

  const handleSelectCategory = (key: string) => {
    dispatch(setCategory(key as CategoryKey))
  }

  const handleOpen = (level: number) => {
    setOpenLevel(level)
  }

  const handleClose = () => {
    setOpenLevel(null)
  }

  // "I did it" awards the challenge and closes the modal — no separate confirmation
  // popup; the filled cloud + climbing bear are the feedback.
  const handleComplete = () => {
    if (!uid || openLevel === null) return
    void (async () => {
      const result = await dispatch(
        awardChallengeThunk({ uid, category: selectedCategory, level: openLevel }),
      )
      if (awardChallengeThunk.fulfilled.match(result)) setOpenLevel(null)
    })()
  }

  const categories = CATEGORIES.map((category) => ({
    key: category.key,
    icon: category.icon,
    label: t(category.labelKey),
  }))

  const modalTitle = openLevel === null ? '' : t('wellbeing.level', { level: openLevel })
  const modalBody = openLevel === null ? '' : t(dailyKeys[openLevel - 1])

  return (
    <PageRoot>
      <Header>
        <CategoryBar
          categories={categories}
          selected={selectedCategory}
          onSelect={handleSelectCategory}
        />
      </Header>

      <ScrollBody>
        <SkyClimb
          key={selectedCategory}
          total={DAILY_LEVELS}
          completed={completedLevels[selectedCategory]}
          lockedLabel={t('wellbeing.locked')}
          onOpen={handleOpen}
        />
      </ScrollBody>

      <ChallengeModal
        open={openLevel !== null}
        title={modalTitle}
        body={modalBody}
        completeLabel={t('wellbeing.complete')}
        closeLabel={t('wellbeing.close')}
        onComplete={handleComplete}
        onClose={handleClose}
      />
    </PageRoot>
  )
}

export default WellbeingPage
