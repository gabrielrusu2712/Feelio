import styled from 'styled-components'

// Flat composer (no surrounding card) so the textarea and save button line up
// with the mood row and the entry cards at the same full width. `relative` lets
// the error chip float without shifting the layout.
export const Composer = styled.div`
  ${({ theme: { spacing } }) => `
    position: relative;
    display: flex;
    flex-direction: column;
    gap: ${spacing.lg.cssVar};
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

// Floats just below the composer (in the gap to the next section) so a save
// error is visible without pushing anything down.
export const ErrorChip = styled.p`
  ${({ theme: { colors, radius, spacing } }) => `
    position: absolute;
    top: calc(100% + ${spacing.xs.cssVar});
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    padding: ${spacing.xs.cssVar} ${spacing.lg.cssVar};
    border-radius: ${radius.full.cssVar};
    background: ${colors.functional.danger.enabled.surface.primary.cssVar};
    color: ${colors.functional.danger.enabled.onSurface.primary.cssVar};
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  `}
`
