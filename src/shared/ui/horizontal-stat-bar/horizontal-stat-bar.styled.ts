import styled, { css, keyframes } from 'styled-components'

const glint = keyframes`
  0% { transform: translateX(-100%); }
  60%, 100% { transform: translateX(100%); }
`

// Diagonal drift by whole tiles (1 across, 2 down) so the loop stays seamless.
const cloudDrift = keyframes`
  from { background-position: 0 0; }
  to { background-position: var(--sky-tile-w) calc(var(--sky-tile-h) * -2); }
`

// Query container so the row's parts scale to its width (cqi) as one piece.
export const BarRow = styled.div`
  ${({ theme: { spacing } }) => `
    container-type: inline-size;
    display: flex;
    align-items: center;
    gap: ${spacing.sm.cssVar};
    width: 100%;
  `}
`

// Wraps the track + riding icon (icon sits outside Track so it isn't clipped).
export const TrackWrap = styled.div<{ $clickable?: boolean }>`
  ${({ $clickable }) => `
    position: relative;
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    cursor: ${$clickable ? 'pointer' : 'default'};
  `}
`

export const Track = styled.div`
  ${({ theme: { colors, radius } }) => `
    position: relative;
    width: 100%;
    height: clamp(0.75rem, 3.2cqi, 1.2rem);
    border-radius: ${radius.full.cssVar};
    background: ${colors.layouts.default.enabled.surface.tertiary.cssVar};
    overflow: hidden;
  `}
`

// Flat accent colour with a moving glint (the normal stat bars).
export const Fill = styled.div<{ $fill: number; $accent: string }>`
  ${({ $fill, $accent }) => css`
    position: absolute;
    inset-block: 0;
    left: 0;
    width: ${$fill}%;
    background: ${$accent};
    border-radius: inherit;
    overflow: hidden;
    transition: width 0.4s ease;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.5) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      animation: ${glint} 2.6s ease-in-out infinite;
      pointer-events: none;
    }
  `}
`

// Textured fill: the texture covers the whole track, revealed left-to-right to
// the fill via clip-path. Size container so the texture can size to the bar length (cqi).
export const Sky = styled.div<{ $fill: number }>`
  ${({ $fill }) => `
    position: absolute;
    inset: 0;
    border-radius: inherit;
    overflow: hidden;
    container-type: size;
    clip-path: inset(0 ${100 - $fill}% 0 0);
    transition: clip-path 0.4s ease;
  `}
`

// Tile width = $scale × bar length (cqi); height keeps the texture aspect ($ratio %).
export const SkyTexture = styled.div<{ $texture: string; $ratio: number; $scale: number }>`
  ${({ $texture, $ratio, $scale }) => css`
    position: absolute;
    inset: 0;
    --sky-tile-w: ${100 * $scale}cqi;
    --sky-tile-h: ${$ratio * $scale}cqi;
    background-image: url(${$texture});
    background-repeat: repeat;
    background-size: var(--sky-tile-w) var(--sky-tile-h);
    animation: ${cloudDrift} 28s linear infinite;
  `}
`

// Icon riding the leading edge of the fill; $scale lets one stat read larger.
export const RidingIcon = styled.img<{ $fill: number; $scale: number }>`
  ${({ $fill, $scale }) => `
    position: absolute;
    left: ${$fill}%;
    top: 50%;
    transform: translate(-50%, -50%) scale(${$scale});
    width: clamp(1.1rem, 7cqi, 1.9rem);
    height: clamp(1.1rem, 7cqi, 1.9rem);
    object-fit: contain;
    pointer-events: none;
    transition: left 0.4s ease;
  `}
`

export const Value = styled.span`
  ${({ theme: { colors } }) => `
    flex: 0 0 auto;
    /* Fixed width so every track ends at the same x — bars stay equal length. */
    min-width: 2.75rem;
    text-align: center;
    font-size: clamp(0.65rem, 3cqi, 0.9rem);
    font-weight: 700;
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  `}
`
