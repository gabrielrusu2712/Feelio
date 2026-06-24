import styled from 'styled-components'

export const CardRoot = styled.div`
  ${({ theme: { colors, radius, spacing } }) => `
    background: ${colors.layouts.default.enabled.surface.secondary.cssVar};
    border-radius: ${radius['2xl'].cssVar};
    padding: ${spacing['3xl'].cssVar};
    display: flex;
    flex-direction: column;
    gap: ${spacing['3xl'].cssVar};
  `}
`

export const QuestionBox = styled.div`
  ${({ theme: { colors, radius, spacing } }) => `
    background: ${colors.layouts.default.enabled.surface.tertiary.cssVar};
    border-radius: ${radius.xl.cssVar};
    padding: ${spacing['2xl'].cssVar};
    display: flex;
    align-items: flex-start;
    gap: ${spacing.lg.cssVar};
  `}
`

export const Sparkle = styled.span`
  font-size: 1.25rem;
  flex-shrink: 0;
`

export const QuestionText = styled.p`
  ${({ theme: { colors, typography } }) => `
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
    font-size: ${typography.fontSize.text.sm.cssVar};
    font-style: italic;
    margin: 0;
    line-height: 1.5;
  `}
`

export const StyledTextarea = styled.textarea`
  ${({ theme: { colors, radius, spacing } }) => `
    width: 100%;
    min-height: 120px;
    resize: vertical;
    padding: ${spacing.xl.cssVar};
    border-radius: ${radius.xl.cssVar};
    border: 1.5px solid ${colors.layouts.default.enabled.border.primary.cssVar};
    background: ${colors.layouts.default.enabled.surface.tertiary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-size: 0.9rem;
    font-family: inherit;
    box-sizing: border-box;
    outline: none;
    &:focus {
      border-color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    }
    &::placeholder {
      color: ${colors.layouts.default.enabled.onSurface.placeholder.cssVar};
    }
  `}
`

export const SaveButton = styled.button`
  ${({ theme: { colors, radius, spacing } }) => `
    background: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    color: ${colors.layouts.default.enabled.surface.secondary.cssVar};
    border: none;
    border-radius: ${radius.full.cssVar};
    padding: ${spacing.xl.cssVar} ${spacing['4xl'].cssVar};
    font-size: ${spacing.xl.cssVar};
    font-weight: 600;
    cursor: pointer;
    align-self: stretch;
    transition: opacity 0.2s;
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    &:hover:not(:disabled) {
      opacity: 0.88;
    }
  `}
`

export const SaveStatus = styled.p<{ $visible: boolean; $error?: boolean }>`
  ${({ theme: { colors }, $visible, $error }) => `
    margin: 0;
    font-size: 0.85rem;
    font-weight: 500;
    opacity: ${$visible ? 1 : 0};
    color: ${$error ? 'red' : colors.layouts.default.enabled.onSurface.primary.cssVar};
    transition: opacity 0.3s;
  `}
`
