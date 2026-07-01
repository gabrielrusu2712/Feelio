import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import type { ChartData } from '@/statistics/data-access/store/statistics.types'

// Theme-derived chart colors, passed in from the page (via styled-components'
// useTheme) — replaces the source's getComputedStyle(--text-color) hack.
export interface ChartTheme {
  line: string
  fill: string
  point: string
  pointBorder: string
  text: string
  grid: string
}

interface ChartLabels {
  dataset: string
  tooltipPrefix: string
}

// Owns the Chart.js instance in a ref (never in React state — that would re-render
// on every mutation). The chart is created once per theme/label change and reads
// the latest data via a ref so a recreate never flashes empty; data updates mutate
// the existing instance. The cleanup destroy makes it StrictMode double-invoke safe.
export const useChartInstance = (
  data: ChartData,
  theme: ChartTheme,
  labels: ChartLabels,
): React.RefObject<HTMLCanvasElement | null> => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)
  const dataRef = useRef(data)

  // Keep the latest data in a ref (updated in an effect, never during render) so a
  // theme/label-driven recreate can seed the fresh chart without flashing empty.
  useEffect(() => {
    dataRef.current = data
  }, [data])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // No 2D context (e.g. jsdom in tests) — skip charting rather than crash.
    if (!canvas.getContext('2d')) return

    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: dataRef.current.labels,
        datasets: [
          {
            label: labels.dataset,
            data: dataRef.current.values,
            borderColor: theme.line,
            backgroundColor: theme.fill,
            pointBackgroundColor: theme.point,
            pointBorderColor: theme.pointBorder,
            borderWidth: 3,
            pointRadius: 6,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: theme.text } },
          tooltip: {
            callbacks: { label: (ctx) => `${labels.tooltipPrefix}: ${ctx.raw}%` },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { color: theme.text },
            grid: { color: theme.grid },
          },
          x: { ticks: { color: theme.text }, grid: { color: theme.grid } },
        },
      },
    })
    chartRef.current = chart

    return () => {
      chart.destroy()
      chartRef.current = null
    }
  }, [theme, labels.dataset, labels.tooltipPrefix])

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return
    chart.data.labels = data.labels
    chart.data.datasets[0].data = data.values
    chart.update()
  }, [data])

  return canvasRef
}
