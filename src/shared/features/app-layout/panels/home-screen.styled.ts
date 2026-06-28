import styled from 'styled-components'

export const HomeRoot = styled.div`
  ${({ theme: { spacing } }) => `
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: ${spacing.md.cssVar};
    padding: ${spacing.md.cssVar};
  `}
`

// The bear takes all the space the bars don't need.
export const CharacterArea = styled.div`
  ${({ theme: { spacing } }) => `
    container-type: size;
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${spacing.sm.cssVar};
  `}
`

// Sizes to its content (the bars + generous padding) and never scrolls — if it
// needs more room it grows and the character area yields the space instead.
export const BarsArea = styled.div`
  ${({ theme: { colors, radius, spacing } }) => `
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: ${spacing.lg.cssVar};
    padding: ${spacing.xl.cssVar};
    border-radius: ${radius.lg.cssVar};
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.tertiary.cssVar};
  `}
`
