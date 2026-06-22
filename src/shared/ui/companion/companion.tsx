import { Bubble, Face } from '@/shared/ui/companion/companion.styled'

interface CompanionProps {
  /** Already-translated greeting text (dumb component — no i18n here). */
  greeting: string
  /** The mascot glyph; defaults to the panda. */
  emoji?: string
}

// Dumb: the mascot face + a speech bubble. Renders a fragment so the parent
// (a flex/sized query container) lays the two out and drives their scaling.
const Companion = (props: CompanionProps) => {
  const { greeting, emoji = '🐼' } = props

  return (
    <>
      <Face aria-hidden="true">{emoji}</Face>
      <Bubble>{greeting}</Bubble>
    </>
  )
}

export default Companion
