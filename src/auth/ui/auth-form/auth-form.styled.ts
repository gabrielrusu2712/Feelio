import styled from 'styled-components'

export const Form = styled.form`
  ${({ theme: { spacing } }) => `
    display: flex;
    flex-direction: column;
    gap: ${spacing.md.cssVar};
    width: 100%;
  `}
`

export const Field = styled.label`
  ${({ theme: { colors, spacing, typography } }) => `
    display: flex;
    flex-direction: column;
    gap: ${spacing.xs.cssVar};
    font-size: ${typography.fontSize.text.md.cssVar};
    font-weight: 700;
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
  `}
`

export const Input = styled.input`
  ${({ theme: { colors, radius, spacing, typography } }) => `
    padding: ${spacing.md.cssVar} ${spacing.lg.cssVar};
    border-radius: ${radius.lg.cssVar};
    border: 2px solid ${colors.layouts.default.enabled.border.secondary.cssVar};
    background: ${colors.layouts.default.enabled.surface.secondary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-family: inherit;
    font-size: ${typography.fontSize.text.lg.cssVar};
    font-weight: 500;
    transition: border-color 0.2s;

    &::placeholder {
      color: ${colors.layouts.default.enabled.onSurface.placeholder.cssVar};
    }
    &:focus {
      outline: none;
      border-color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    }
  `}
`

export const ErrorText = styled.p`
  ${({ theme: { colors, radius, typography, spacing } }) => `
    margin: 0;
    padding: ${spacing.xs.cssVar} ${spacing.sm.cssVar};
    border-radius: ${radius.sm.cssVar};
    background: ${colors.functional.danger.enabled.surface.primary.cssVar};
    color: ${colors.functional.danger.enabled.onSurface.primary.cssVar};
    font-size: ${typography.fontSize.text.sm.cssVar};
    font-weight: 600;
    text-align: center;
  `}
`

export const SubmitButton = styled.button`
  ${({ theme: { colors, radius, spacing, typography } }) => `
    margin-top: ${spacing.xs.cssVar};
    padding: ${spacing.md.cssVar} ${spacing.lg.cssVar};
    border: none;
    border-radius: ${radius.full.cssVar};
    background: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    color: ${colors.layouts.default.enabled.surface.primary.cssVar};
    font-family: inherit;
    font-size: ${typography.fontSize.text.lg.cssVar};
    font-weight: 800;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;

    &:hover:not(:disabled) {
      opacity: 0.92;
    }
    &:active:not(:disabled) {
      transform: translateY(1px);
    }
    &:disabled {
      opacity: 0.55;
      cursor: default;
    }
  `}
`

export const ToggleButton = styled.button`
  ${({ theme: { colors, typography } }) => `
    background: none;
    border: none;
    padding: 0;
    color: ${colors.layouts.default.enabled.onSurface.tertiary.cssVar};
    font-family: inherit;
    font-size: ${typography.fontSize.text.md.cssVar};
    font-weight: 600;
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    }
  `}
`
