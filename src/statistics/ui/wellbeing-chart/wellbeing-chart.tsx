import { useMemo } from 'react'
import { useTheme } from 'styled-components'
import { useChartInstance } from '@/statistics/data-access/hooks/use-chart-instance'
import type { ChartTheme } from '@/statistics/data-access/hooks/use-chart-instance'
import { ChartCanvasWrap } from '@/statistics/ui/wellbeing-chart/wellbeing-chart.styled'
import type { ChartData } from '@/statistics/data-access/store/statistics.types'

interface WellbeingChartProps {
  data: ChartData
  datasetLabel: string
  tooltipPrefix: string
  ariaLabel: string
}

// Dumb: the Chart.js line chart of wellbeing % over the selected range. Colors are
// resolved from the theme (canvas can't read CSS vars) and memoized so the chart
// is only recreated on an actual theme/label change, not every render.
const WellbeingChart = (props: WellbeingChartProps) => {
  const { data, datasetLabel, tooltipPrefix, ariaLabel } = props
  const theme = useTheme()

  const chartTheme = useMemo<ChartTheme>(() => {
    const enabled = theme.colors.layouts.default.enabled
    return {
      line: enabled.onSurface.primary.value,
      // Translucent terracotta area fill — alpha isn't expressible as a token.
      fill: 'rgba(196, 74, 58, 0.15)',
      point: enabled.border.primary.value,
      pointBorder: enabled.surface.secondary.value,
      text: enabled.onSurface.secondary.value,
      grid: enabled.border.tertiary.value,
    }
  }, [theme])

  const labels = useMemo(
    () => ({ dataset: datasetLabel, tooltipPrefix }),
    [datasetLabel, tooltipPrefix],
  )

  const canvasRef = useChartInstance(data, chartTheme, labels)

  return (
    <ChartCanvasWrap>
      <canvas ref={canvasRef} role="img" aria-label={ariaLabel} />
    </ChartCanvasWrap>
  )
}

export default WellbeingChart
