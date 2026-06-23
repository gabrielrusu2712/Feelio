import styled from 'styled-components'

// A query container: the icon, label, value and track height all size to THIS
// row's width (cqi), so the whole row scales as one piece and never overlaps.
export const BarRow = styled.div`
  ${({ theme: { spacing } }) => `
    container-type: inline-size;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: ${spacing.sm.cssVar};
    width: 100%;
  `}
`

export const Leading = styled.div`
  ${({ theme: { spacing } }) => `
    display: flex;
    align-items: center;
    gap: ${spacing.xs.cssVar};
    font-size: clamp(0.7rem, 4cqi, 1rem);
    min-width: 0;
    white-space: nowrap;
  `}
`

export const Icon = styled.span`
  font-size: clamp(0.9rem, 5cqi, 1.4rem);
  line-height: 1;
`

export const Label = styled.span`
  ${({ theme: { colors } }) => `
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
    overflow: hidden;
    text-overflow: ellipsis;
  `}
`

export const Track = styled.div`
  ${({ theme: { colors, radius } }) => `
    position: relative;
    width: 100%;
    height: clamp(0.55rem, 2.5cqi, 0.9rem);
    border-radius: ${radius.full.cssVar};
    background: ${colors.layouts.default.enabled.surface.tertiary.cssVar};
    overflow: hidden;
  `}
`

export const Fill = styled.div<{ $fill: number; $accent: string }>`
  ${({ $fill, $accent }) => `
    position: absolute;
    inset-block: 0;
    left: 0;
    width: ${$fill}%;
    background: ${$accent};
    border-radius: inherit;
    transition: width 0.4s ease;

    /* Shimmer placeholder — the animated glint/texture lands in Stage 3. */
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.35) 0%,
      rgba(255, 255, 255, 0) 35%
    );
  `}
`

export const Value = styled.span`
  ${({ theme: { colors } }) => `
    font-size: clamp(0.65rem, 3cqi, 0.9rem);
    font-weight: 700;
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  `}
`
