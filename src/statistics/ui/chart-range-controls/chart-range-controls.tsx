import OptionButton from '@/shared/ui/option-button/option-button'
import {
  CalcNote,
  ControlsRow,
  NavButton,
  PeriodTabs,
  RangeLabel,
} from '@/statistics/ui/chart-range-controls/chart-range-controls.styled'
import type { ChartPeriod } from '@/statistics/data-access/store/statistics.types'

export interface PeriodTab {
  key: ChartPeriod
  label: string
  active: boolean
}

interface ChartRangeControlsProps {
  periods: PeriodTab[]
  rangeLabel: string
  calcNote: string
  canGoOlder: boolean
  canGoNewer: boolean
  prevAriaLabel: string
  nextAriaLabel: string
  onSelectPeriod: (key: ChartPeriod) => void
  onOlder: () => void
  onNewer: () => void
}

// Dumb: the prev/next + week/month/year tabs above the chart, plus the range
// caption and the "how this is calculated" note. Prev pages older, next newer.
const ChartRangeControls = (props: ChartRangeControlsProps) => {
  const {
    periods,
    rangeLabel,
    calcNote,
    canGoOlder,
    canGoNewer,
    prevAriaLabel,
    nextAriaLabel,
    onSelectPeriod,
    onOlder,
    onNewer,
  } = props

  return (
    <>
      <ControlsRow>
        <NavButton
          type="button"
          aria-label={prevAriaLabel}
          disabled={!canGoOlder}
          onClick={onOlder}
        >
          {'‹'}
        </NavButton>
        <PeriodTabs role="tablist">
          {periods.map((tab) => (
            <OptionButton
              key={tab.key}
              active={tab.active}
              ariaLabel={tab.label}
              onSelect={() => onSelectPeriod(tab.key)}
            >
              {tab.label}
            </OptionButton>
          ))}
        </PeriodTabs>
        <NavButton
          type="button"
          aria-label={nextAriaLabel}
          disabled={!canGoNewer}
          onClick={onNewer}
        >
          {'›'}
        </NavButton>
      </ControlsRow>
      {rangeLabel && <RangeLabel>{rangeLabel}</RangeLabel>}
      {calcNote && <CalcNote>{calcNote}</CalcNote>}
    </>
  )
}

export default ChartRangeControls
