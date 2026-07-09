import styled from 'styled-components'

export const Ring = styled.div<{ $progress: number }>`
  ${({ theme: { colors }, $progress }) => `
    /* Scales with the character area's own container, within bounds. */
    --ring-size: clamp(3.5rem, 9cqi, 5.5rem);
    position: relative;
    width: var(--ring-size);
    height: var(--ring-size);
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: conic-gradient(
      ${colors.layouts.brand.enabled.onSurface.primary.cssVar} ${$progress}%,
      ${colors.layouts.default.enabled.border.tertiary.cssVar} ${$progress}% 100%
    );
  `}
`

export const RingInner = styled.span`
  ${({ theme: { colors } }) => `
    position: absolute;
    inset: 15%;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-size: clamp(1.2rem, 4.4cqi, 1.75rem);
    font-weight: 700;
  `}
`
