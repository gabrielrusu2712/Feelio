import styled from 'styled-components'

// Header sizes scale to the shell width (cqi) within bounds, so zoom keeps the
// bar proportional instead of letting it eat the screen.
export const Bar = styled.header`
  ${({ theme: { colors } }) => `
    flex: 0 0 auto;
    /* Sit above panel content (e.g. the map) so it never paints over the bar. */
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(0.5rem, 2.5cqi, 1.5rem);
    padding: clamp(0.25rem, 1.2cqi, 0.6rem) clamp(0.5rem, 2cqi, 1rem);
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
    border-bottom: 1px solid ${colors.layouts.default.enabled.border.tertiary.cssVar};
  `}
`

export const Identity = styled.div`
  ${({ theme: { colors, spacing } }) => `
    display: flex;
    align-items: center;
    gap: ${spacing.sm.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-size: clamp(0.8rem, 2cqi, 1.1rem);
    font-weight: 600;
  `}
`

export const Stars = styled.div`
  ${({ theme: { colors, spacing } }) => `
    display: flex;
    align-items: center;
    gap: ${spacing.xs.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-size: clamp(0.75rem, 1.9cqi, 1.05rem);
    font-weight: 800;
  `}
`

export const StarIcon = styled.img`
  width: clamp(0.9rem, 2.6cqi, 1.4rem);
  height: auto;
`

export const DayCounter = styled.span`
  ${({ theme: { colors } }) => `
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
    font-size: clamp(0.7rem, 1.8cqi, 1rem);
  `}
`

export const SettingsButton = styled.button`
  ${({ theme: { colors, radius } }) => `
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
