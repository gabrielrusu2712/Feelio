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

// The bear sits on top and takes the larger share; bars fill the rest.
export const CharacterArea = styled.div`
  ${({ theme: { spacing } }) => `
    container-type: size;
    flex: 3 1 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${spacing.sm.cssVar};
  `}
`

export const BarsArea = styled.div`
  ${({ theme: { colors, radius, spacing } }) => `
    flex: 2 1 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: ${spacing.sm.cssVar};
    padding: ${spacing.md.cssVar};
    border-radius: ${radius.lg.cssVar};
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.tertiary.cssVar};
    overflow: auto;
  `}
`
