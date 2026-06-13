import styled from 'styled-components'

export const ThemeModeButton = styled.button`
  ${({ theme: { typography, spacing, radius, colors } }) => `
    font-size: ${typography.fontSize.text.sm.cssVar};
    padding: ${spacing.xs.cssVar} ${spacing.sm.cssVar};
    border-radius: ${radius.sm.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    background: ${colors.layouts.default.enabled.surface.secondary.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.primary.cssVar};
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: ${colors.layouts.default.hover.surface.secondary.cssVar};
    }
  `}
`

export const Counter = styled.button`
  ${({ theme: { typography, spacing, radius, colors } }) => `
    font-size: ${typography.fontSize.text.md.cssVar};
    padding: ${spacing.xs.cssVar} ${spacing.sm.cssVar};
    border-radius: ${radius.sm.cssVar};
    color: ${colors.layouts.brand.enabled.onSurface.primary.cssVar};
    background: ${colors.layouts.brand.enabled.surface.secondary.cssVar};
    border: 2px solid transparent;
    transition: border-color 0.3s;
    margin-bottom: ${spacing.lg.cssVar};

    &:hover {
      border-color: ${colors.layouts.brand.enabled.border.primary.cssVar};
    }

    &:focus-visible {
      outline: 2px solid ${colors.layouts.default.focused.border.primary.cssVar};
      outline-offset: 2px;
    }
  `}
`

export const Hero = styled.div`
  position: relative;

  .base,
  .framework,
  .vite {
    inset-inline: 0;
    margin: 0 auto;
  }

  .base {
    width: 170px;
    position: relative;
    z-index: 0;
  }

  .framework,
  .vite {
    position: absolute;
  }

  .framework {
    z-index: 1;
    top: 34px;
    height: 28px;
    transform: perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg) scale(1.4);
  }

  .vite {
    z-index: 0;
    top: 107px;
    height: 26px;
    width: auto;
    transform: perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg) scale(0.8);
  }
`

export const Center = styled.section`
  ${({ theme: { spacing } }) => `
    display: flex;
    flex-direction: column;
    gap: ${spacing.lg.cssVar};
    place-content: center;
    place-items: center;
    flex-grow: 1;

    @media (max-width: 1024px) {
      padding: ${spacing['2xl'].cssVar} ${spacing.md.cssVar} ${spacing.lg.cssVar};
      gap: ${spacing.md.cssVar};
    }
  `}
`

export const NextSteps = styled.section`
  ${({ theme: { spacing, colors } }) => `
    display: flex;
    border-top: 1px solid ${colors.layouts.default.enabled.border.primary.cssVar};
    text-align: left;

    & > div {
      flex: 1 1 0;
      padding: ${spacing['2xl'].cssVar};

      @media (max-width: 1024px) {
        padding: ${spacing.lg.cssVar} ${spacing.md.cssVar};
      }
    }

    .icon {
      margin-bottom: ${spacing.md.cssVar};
      width: 22px;
      height: 22px;
    }

    @media (max-width: 1024px) {
      flex-direction: column;
      text-align: center;
    }
  `}
`

export const Docs = styled.div`
  ${({ theme: { colors } }) => `
    border-right: 1px solid ${colors.layouts.default.enabled.border.primary.cssVar};

    @media (max-width: 1024px) {
      border-right: none;
      border-bottom: 1px solid ${colors.layouts.default.enabled.border.primary.cssVar};
    }
  `}
`

export const NextStepsList = styled.ul`
  ${({ theme: { spacing, radius, colors, typography } }) => `
    list-style: none;
    padding: 0;
    display: flex;
    gap: ${spacing.xs.cssVar};
    margin: ${spacing['2xl'].cssVar} 0 0;

    .logo {
      height: 18px;
    }

    a {
      color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
      font-size: ${typography.fontSize.text.md.cssVar};
      border-radius: ${radius.md.cssVar};
      background: ${colors.layouts.default.enabled.surface.secondary.cssVar};
      display: flex;
      padding: ${spacing.xs.cssVar} ${spacing.sm.cssVar};
      align-items: center;
      gap: ${spacing.xs.cssVar};
      text-decoration: none;
      transition: box-shadow 0.3s;

      &:hover {
        background: ${colors.layouts.default.hover.surface.secondary.cssVar};
      }

      .button-icon {
        height: 18px;
        width: 18px;
      }
    }

    @media (max-width: 1024px) {
      margin-top: ${spacing.md.cssVar};
      flex-wrap: wrap;
      justify-content: center;

      li {
        flex: 1 1 calc(50% - ${spacing.xs.cssVar});
      }

      a {
        width: 100%;
        justify-content: center;
        box-sizing: border-box;
      }
    }
  `}
`

export const Spacer = styled.section`
  ${({ theme: { spacing, colors } }) => `
    height: ${spacing['6xl'].cssVar};
    border-top: 1px solid ${colors.layouts.default.enabled.border.primary.cssVar};

    @media (max-width: 1024px) {
      height: ${spacing['3xl'].cssVar};
    }
  `}
`

export const Ticks = styled.div`
  ${({ theme: { colors } }) => `
    position: relative;
    width: 100%;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: -4.5px;
      border: 5px solid transparent;
    }

    &::before {
      left: 0;
      border-left-color: ${colors.layouts.default.enabled.border.primary.cssVar};
    }

    &::after {
      right: 0;
      border-right-color: ${colors.layouts.default.enabled.border.primary.cssVar};
    }
  `}
`
