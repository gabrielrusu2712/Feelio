import styled from 'styled-components'

export const CharacterRoot = styled.section`
  ${({ theme: { colors, radius, spacing } }) => `
    container-type: size;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${spacing.md.cssVar};
    padding: ${spacing.lg.cssVar};
    border-radius: ${radius.lg.cssVar};
    background: ${colors.layouts.default.enabled.surface.secondary.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.tertiary.cssVar};
  `}
`
