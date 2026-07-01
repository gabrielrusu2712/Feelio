import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/core/store/hooks'
import { selectUid } from '@/shared/data-access/store/current-user.selectors'
import {
  CHART_PERIODS,
  MOOD_SUMMARY,
} from '@/statistics/data-access/constants/statistics.constants'
import { useChartData } from '@/statistics/data-access/hooks/use-chart-data'
import { useMonthlyProgress } from '@/statistics/data-access/hooks/use-monthly-progress'
import {
  formatMonthLong,
  localeFor,
  mondayWeekdayLabels,
} from '@/statistics/data-access/utils/format'
import { summarizeMoods } from '@/statistics/data-access/utils/mood-stats'
import MoodSummary from '@/statistics/ui/mood-summary/mood-summary'
import ChartRangeControls from '@/statistics/ui/chart-range-controls/chart-range-controls'
import WellbeingChart from '@/statistics/ui/wellbeing-chart/wellbeing-chart'
import MonthlyCalendar from '@/statistics/ui/monthly-calendar/monthly-calendar'
import {
  PageRoot,
  ScrollBody,
  Section,
  SectionTitle,
} from '@/statistics/features/statistics-page/statistics-page.styled'

// Statistics dashboard (Phase 4): a mood summary + wellbeing evolution chart
// (week/month/year) + monthly progress calendar, all reading the per-day
// dailyMoods snapshots written by saveStatsThunk. No Redux slice — page-local
// hook state, mirroring the source's page-scoped module.
const StatisticsPage = () => {
  const { t, i18n } = useTranslation()
  const uid = useAppSelector(selectUid)
  const language = i18n.language
  const locale = localeFor(language)

  const chart = useChartData(uid, language)
  const calendar = useMonthlyProgress(uid)

  const counts = summarizeMoods(chart.data.moods)
  const summaryItems = MOOD_SUMMARY.map((item) => ({
    key: item.key,
    emoji: item.emoji,
    label: t(item.labelKey),
    count: counts[item.key],
    unit: t('stats.unitDays'),
  }))

  const periods = CHART_PERIODS.map((period) => ({
    key: period.key,
    label: t(period.labelKey),
    active: period.key === chart.period,
  }))

  return (
    <PageRoot>
      <ScrollBody>
        <Section>
          <SectionTitle>{t('stats.summaryTitle')}</SectionTitle>
          <MoodSummary items={summaryItems} />
        </Section>

        <Section>
          <SectionTitle>{t('stats.evolutionTitle')}</SectionTitle>
          <ChartRangeControls
            periods={periods}
            rangeLabel={chart.rangeLabel}
            calcNote={t(`stats.calcNote.${chart.period}`)}
            canGoOlder={chart.canGoOlder}
            canGoNewer={chart.canGoNewer}
            prevAriaLabel={t('stats.aria.prevRange')}
            nextAriaLabel={t('stats.aria.nextRange')}
            onSelectPeriod={chart.setPeriod}
            onOlder={chart.goOlder}
            onNewer={chart.goNewer}
          />
          <WellbeingChart
            data={chart.data}
            datasetLabel={t('stats.chartLabel')}
            tooltipPrefix={t('stats.progressPrefix')}
            ariaLabel={t('stats.chartAria')}
          />
        </Section>

        <Section>
          <SectionTitle>{t('stats.calendarTitle')}</SectionTitle>
          <MonthlyCalendar
            monthDate={calendar.monthDate}
            monthLabel={formatMonthLong(calendar.monthDate, locale)}
            weekdayLabels={mondayWeekdayLabels(locale)}
            progress={calendar.progress}
            hints={{ progress: t('stats.progressPrefix'), noActivity: t('stats.noActivity') }}
            prevAriaLabel={t('stats.aria.prevMonth')}
            nextAriaLabel={t('stats.aria.nextMonth')}
            onPrev={calendar.goPrev}
            onNext={calendar.goNext}
          />
        </Section>
      </ScrollBody>
    </PageRoot>
  )
}

export default StatisticsPage
