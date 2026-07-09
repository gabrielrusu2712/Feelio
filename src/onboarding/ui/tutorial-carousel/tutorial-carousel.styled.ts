import styled from 'styled-components'

export const CarouselRoot = styled.div`
  ${({ theme: { spacing } }) => `
    container-type: inline-size;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: ${spacing.md.cssVar};
    /* Clears the close/theme buttons pinned to the card's top corners so a
       long title never renders underneath them. */
    margin-top: 2.25rem;
  `}
`

export const SlidesWindow = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: hidden;
`

export const SlidesTrack = styled.div<{ $activeIndex: number }>`
  ${({ $activeIndex }) => `
    display: flex;
    height: 100%;
    transform: translateX(-${$activeIndex * 100}%);
    transition: transform 0.45s cubic-bezier(0.23, 1, 0.32, 1);
  `}
`

export const NavControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const NavButton = styled.button`
  ${({ theme: { colors, radius } }) => `
    width: 2.5rem;
    height: 2.5rem;
    border: none;
    border-radius: ${radius.full.cssVar};
    background: ${colors.layouts.default.enabled.surface.secondary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-size: 1.2rem;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s, opacity 0.15s;

    &:disabled {
      opacity: 0.35;
      cursor: default;
    }

    &:not(:disabled):hover {
      transform: scale(1.08);
    }

    &:not(:disabled):active {
      transform: scale(0.92);
    }
  `}
`

export const Dots = styled.div`
  ${({ theme: { spacing } }) => `
    display: flex;
    align-items: center;
    gap: ${spacing.xs.cssVar};
  `}
`

export const Dot = styled.button<{ $active: boolean }>`
  ${({ theme: { colors }, $active }) => `
    width: ${$active ? '1.1rem' : '0.45rem'};
    height: 0.45rem;
    padding: 0;
    border: none;
    border-radius: 999px;
    background: ${
      $active
        ? colors.layouts.default.enabled.onSurface.primary.cssVar
        : colors.layouts.default.enabled.border.primary.cssVar
    };
    cursor: pointer;
    transition: width 0.3s, background 0.3s;
  `}
`
