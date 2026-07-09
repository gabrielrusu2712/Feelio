import styled from 'styled-components'

// Sits at the end of a header row (page-menu bars, the home board title) and
// is always pushed to the far right regardless of what precedes it.
export const Button = styled.button`
  ${({ theme: { colors, radius } }) => `
    margin-left: auto;
    flex: 0 0 auto;
    width: clamp(1.75rem, 4.5cqi, 2.5rem);
    height: clamp(1.75rem, 4.5cqi, 2.5rem);
    border-radius: ${radius.full.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.primary.cssVar};
    background: ${colors.layouts.default.enabled.surface.secondary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: background 0.2s;

    &:hover {
      background: ${colors.layouts.default.hover.surface.secondary.cssVar};
    }
  `}
`
