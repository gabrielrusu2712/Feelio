import styled from 'styled-components'

export const Backdrop = styled.div`
  ${({ theme: { spacing } }) => `
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: grid;
    place-items: center;
    padding: ${spacing.lg.cssVar};
    background: rgba(0, 0, 0, 0.25);
    /* Blurs the live app behind it; strength is user-controlled via --app-blur. */
    backdrop-filter: blur(var(--app-blur, 6px));
  `}
`

export const Dialog = styled.div`
  ${({ theme: { colors, radius, spacing } }) => `
    width: clamp(280px, 90vw, 420px);
    max-height: 90dvh;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: ${spacing.lg.cssVar};
    padding: ${spacing.xl.cssVar};
    border-radius: ${radius.xl.cssVar};
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.primary.cssVar};
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  `}
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
  }
`

export const Field = styled.div`
  ${({ theme: { spacing } }) => `
    display: flex;
    flex-direction: column;
    gap: ${spacing.xs.cssVar};
  `}
`

export const Row = styled.div`
  ${({ theme: { spacing } }) => `
    display: flex;
    gap: ${spacing.xs.cssVar};
    flex-wrap: wrap;
  `}
`

export const Form = styled.form`
  ${({ theme: { spacing } }) => `
    display: flex;
    flex-direction: column;
    gap: ${spacing.xs.cssVar};
  `}
`

export const Note = styled.span`
  ${({ theme: { colors, typography } }) => `
    font-size: ${typography.fontSize.text.xs.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.tertiary.cssVar};
  `}
`

export const Input = styled.input`
  ${({ theme: { colors, radius, spacing, typography } }) => `
    padding: ${spacing.xs.cssVar} ${spacing.sm.cssVar};
    border-radius: ${radius.md.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.primary.cssVar};
    background: ${colors.layouts.default.enabled.surface.secondary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-size: ${typography.fontSize.text.sm.cssVar};
  `}
`

export const ChoiceButton = styled.button<{ $active: boolean }>`
  ${({ theme: { colors, radius, spacing, typography }, $active }) => `
    padding: ${spacing.xxs.cssVar} ${spacing.md.cssVar};
    border-radius: ${radius.full.cssVar};
    cursor: pointer;
    font-size: ${typography.fontSize.text.sm.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    border: 1px solid ${
      $active
        ? colors.layouts.brand.enabled.border.primary.cssVar
        : colors.layouts.default.enabled.border.tertiary.cssVar
    };
    background: ${
      $active
        ? colors.layouts.brand.enabled.surface.secondary.cssVar
        : colors.layouts.default.enabled.surface.secondary.cssVar
    };
  `}
`

export const PrimaryButton = styled.button`
  ${({ theme: { colors, radius, spacing, typography } }) => `
    padding: ${spacing.xs.cssVar} ${spacing.md.cssVar};
    border-radius: ${radius.md.cssVar};
    border: 1px solid ${colors.layouts.brand.enabled.border.primary.cssVar};
    background: ${colors.layouts.brand.enabled.surface.secondary.cssVar};
    color: ${colors.layouts.brand.enabled.onSurface.primary.cssVar};
    font-size: ${typography.fontSize.text.sm.cssVar};
    cursor: pointer;
  `}
`

export const CloseButton = styled.button`
  ${({ theme: { colors, radius } }) => `
    width: 2rem;
    height: 2rem;
    border-radius: ${radius.full.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.primary.cssVar};
    background: ${colors.layouts.default.enabled.surface.secondary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    cursor: pointer;
  `}
`
