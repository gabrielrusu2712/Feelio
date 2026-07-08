import styled, { css, keyframes } from 'styled-components'

// Diagonal drift by whole tiles (1 across, 2 down) so the loop stays seamless.
const cloudDrift = keyframes`
  from { background-position: 0 0; }
  to { background-position: var(--sky-tile-w) calc(var(--sky-tile-h) * -2); }
`

// Query container so the riding icon scales to the column width (cqi).
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

// Wraps the track + riding icon (icon sits outside Track so it isn't clipped).
export const TrackWrap = styled.div<{ $clickable?: boolean }>`
  ${({ $clickable }) => `
    position: relative;
    width: 100%;
    flex: 1;
    min-height: 0;
    cursor: ${$clickable ? 'pointer' : 'default'};
  `}
`

export const Track = styled.div`
  ${({ theme: { colors, radius } }) => `
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: ${radius.full.cssVar};
    background: ${colors.layouts.default.enabled.surface.tertiary.cssVar};
    overflow: hidden;
  `}
`

// Flat accent colour (the normal stat bars) — no texture, no glint.
export const Fill = styled.div<{ $fill: number; $accent: string }>`
  ${({ $fill, $accent }) => css`
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    height: ${$fill}%;
    background: ${$accent};
    transition: height 0.4s ease;
  `}
`

// Textured fill: the texture covers the whole track, revealed bottom-up to the
// fill via clip-path. Size container so the texture can size to the bar length (cqb).
export const Sky = styled.div<{ $fill: number }>`
  ${({ $fill }) => `
    position: absolute;
    inset: 0;
    overflow: hidden;
    container-type: size;
    clip-path: inset(${100 - $fill}% 0 0 0);
    transition: clip-path 0.4s ease;
  `}
`

// Tile width = $scale × bar length (cqb); height keeps the texture aspect ($ratio %).
export const SkyTexture = styled.div<{ $texture: string; $ratio: number; $scale: number }>`
  ${({ $texture, $ratio, $scale }) => css`
    position: absolute;
    inset: 0;
    --sky-tile-w: ${100 * $scale}cqb;
    --sky-tile-h: ${$ratio * $scale}cqb;
    background-image: url(${$texture});
    background-repeat: repeat;
    background-size: var(--sky-tile-w) var(--sky-tile-h);
    animation: ${cloudDrift} 55s linear infinite;
    opacity: 0.9;
    filter: brightness(0.7) blur(0.4px);
  `}
`

// Icon riding the top edge of the fill; $scale lets one stat read larger.
export const RidingIcon = styled.img<{ $fill: number; $scale: number }>`
  ${({ $fill, $scale }) => `
    position: absolute;
    left: 50%;
    bottom: ${$fill}%;
    transform: translate(-50%, 50%) scale(${$scale});
    width: clamp(1.2rem, 90cqi, 2.6rem);
    height: clamp(1.2rem, 90cqi, 2.6rem);
    object-fit: contain;
    pointer-events: none;
    transition: bottom 0.4s ease;
  `}
`
