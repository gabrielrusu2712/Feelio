import { useEffect } from 'react'

const COLORS = ['#70a288', '#fab1a0', '#ffd700', '#C44A3A', '#FFB38E']
const PARTICLE_COUNT = 30

interface ConfettiProps {
  active: boolean
}

const Confetti = (props: ConfettiProps) => {
  const { active } = props

  useEffect(() => {
    if (!active) return

    const particles: HTMLDivElement[] = []

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const el = document.createElement('div')
      el.style.cssText = `
        position: fixed;
        top: -10px;
        left: ${Math.random() * 100}vw;
        width: 10px;
        height: 10px;
        border-radius: 2px;
        background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
        z-index: 9999;
        animation: confetti-fall ${Math.random() * 2 + 1}s linear forwards;
        pointer-events: none;
      `
      document.body.appendChild(el)
      particles.push(el)
    }

    const timer = setTimeout(() => {
      particles.forEach((p) => p.remove())
    }, 3000)

    return () => {
      clearTimeout(timer)
      particles.forEach((p) => p.remove())
    }
  }, [active])

  return null
}

export default Confetti
