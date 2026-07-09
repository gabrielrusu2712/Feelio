import type { PropsWithChildren } from 'react'
import { useClickSound } from '@/shared/data-access/hooks/use-click-sound'

// Wires the app-wide click-sound listener; renders nothing of its own.
const ClickSoundProvider = (props: PropsWithChildren) => {
  const { children } = props
  useClickSound()
  return children
}

export default ClickSoundProvider
