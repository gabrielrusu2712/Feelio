import styled from 'styled-components'

// The whole start menu is sized in container-query units against its own box, so
// it scales down to fit any panel — short, small, or fullscreen — with no
// scrollbar. clamp() caps each size so it never gets oversized on a big screen.
export const StartRoot = styled.div`
  container-type: size;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(0.2rem, 2.5cqh, 0.9rem);
  padding: clamp(0.5rem, 4cqh, 1.75rem) clamp(0.75rem, 5cqw, 2rem);
  text-align: center;
`

// Sits just below the play button; toggles the fullscreen layout.
export const FullscreenButton = styled.button`
  ${({ theme: { colors, radius } }) => `
    display: inline-flex;
    align-items: center;
    gap: 0.4em;
    padding: clamp(0.2rem, 1.6cqh, 0.5rem) clamp(0.5rem, 4cqw, 1rem);
    border-radius: ${radius.full.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.primary.cssVar};
    background: ${colors.layouts.default.enabled.surface.secondary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-size: clamp(0.65rem, 3cqh, 0.85rem);
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;

    @media (hover: hover) {
      &:hover {
        background: ${colors.layouts.default.enabled.surface.tertiary.cssVar};
      }
    }
  `}
`

export const Title = styled.h2`
  ${({ theme: { primitives } }) => `
    margin: 0;
    font-size: clamp(1rem, 7cqh, 1.6rem);
    font-weight: 800;
    line-height: 1.1;
    color: ${primitives.palette.brand['500'].cssVar};
  `}
`

export const CostText = styled.p`
  ${({ theme: { colors } }) => `
    margin: 0;
    font-size: clamp(0.7rem, 3.5cqh, 1rem);
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
  `}
`

export const TutorialBox = styled.div`
  ${({ theme: { colors, radius } }) => `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(0.15rem, 1.5cqh, 0.5rem);
    padding: clamp(0.4rem, 3cqh, 1rem);
    border-radius: ${radius.lg.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.tertiary.cssVar};
    background: ${colors.layouts.default.enabled.surface.tertiary.cssVar};
    font-size: clamp(0.65rem, 3cqh, 0.9rem);

    & > p {
      margin: 0;
    }
  `}
`

export const TutorialRow = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(0.4rem, 3cqw, 0.75rem);
`

export const TutorialIcon = styled.img`
  width: clamp(18px, 7cqmin, 32px);
  height: clamp(18px, 7cqmin, 32px);
  object-fit: contain;
`

export const PlayButton = styled.button`
  ${({ theme: { primitives, radius } }) => `
    padding: clamp(0.4rem, 2.5cqh, 0.75rem) clamp(1rem, 6cqw, 2rem);
    border: none;
    border-radius: ${radius.full.cssVar};
    background: ${primitives.palette.brand['500'].cssVar};
    color: ${primitives.palette.peach['50'].cssVar};
    font-size: clamp(0.8rem, 4cqh, 1rem);
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;

    &:disabled {
      opacity: 0.5;
      cursor: default;
    }
  `}
`

export const ErrorText = styled.p`
  ${({ theme: { primitives } }) => `
    margin: 0;
    font-size: clamp(0.65rem, 3cqh, 0.85rem);
    font-weight: 700;
    color: ${primitives.palette.red['500'].cssVar};
  `}
`
