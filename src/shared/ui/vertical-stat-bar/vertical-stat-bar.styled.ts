import styled from 'styled-components'

// A query container: the icon + label below size themselves to THIS column's
// width (cqi), so a narrow column shrinks them to fit instead of overflowing.
export const BarColumn = styled.div`
  ${({ theme: { spacing } }) => `
    container-type: inline-size;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${spacing.xxs.cssVar};
    height: 100%;
    min-width: 0;
    flex: 1;
  `}
`

export const Track = styled.div`
  ${({ theme: { colors, radius } }) => `
    position: relative;
    width: 100%;
    flex: 1;
    min-height: 0;
    border-radius: ${radius.full.cssVar};
    background: ${colors.layouts.default.enabled.surface.tertiary.cssVar};
    overflow: hidden;
  `}
`

export const Fill = styled.div<{ $fill: number; $accent: string }>`
  ${({ $fill, $accent }) => `
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    height: ${$fill}%;
    background: ${$accent};
    transition: height 0.4s ease;

    /* Shimmer placeholder — the animated glint/texture lands in Stage 3. */
    background-image: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.35) 0%,
      rgba(255, 255, 255, 0) 35%
    );
  `}
`

export const RidingIcon = styled.span<{ $fill: number }>`
  ${({ $fill }) => `
    position: absolute;
    inset-inline: 0;
    bottom: ${$fill}%;
    text-align: center;
    transform: translateY(50%);
    /* Scales with the column width so it always fits inside the bar. */
    font-size: clamp(0.5rem, 55cqi, 1.15rem);
    line-height: 1;
    pointer-events: none;
    transition: bottom 0.4s ease;
  `}
`

export const BarLabel = styled.span`
  ${({ theme: { colors } }) => `
    /* Scales to the column and is clipped to its width, so neighbouring
       labels can never overlap. */
    font-size: clamp(0.5rem, 35cqi, 0.8rem);
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `}
`
