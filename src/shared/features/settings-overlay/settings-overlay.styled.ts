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
    width: clamp(280px, 92vw, 440px);
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
    font-family: inherit;
  }
`

// A titled group of related controls, visually separated by a hairline.
export const Section = styled.section`
  ${({ theme: { colors, radius, spacing } }) => `
    display: flex;
    flex-direction: column;
    gap: ${spacing.md.cssVar};
    padding: ${spacing.lg.cssVar};
    border-radius: ${radius.lg.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.tertiary.cssVar};
    background: ${colors.layouts.default.enabled.surface.secondary.cssVar};
  `}
`

export const SectionTitle = styled.h3`
  ${({ theme: { colors, typography } }) => `
    margin: 0;
    font-family: inherit;
    font-size: ${typography.fontSize.text.xs.cssVar};
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${colors.layouts.default.enabled.onSurface.tertiary.cssVar};
  `}
`

export const Field = styled.div`
  ${({ theme: { spacing } }) => `
    display: flex;
    flex-direction: column;
    gap: ${spacing.xs.cssVar};
  `}
`

export const FieldLabel = styled.span`
  ${({ theme: { colors, typography } }) => `
    font-size: ${typography.fontSize.text.sm.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
  `}
`

// Label on the left, value/control on the right — the account rows.
export const ValueRow = styled.div`
  ${({ theme: { spacing } }) => `
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacing.sm.cssVar};

    strong {
      font-family: inherit;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
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

export const Note = styled.span<{ $tone?: 'muted' | 'error' | 'success' }>`
  ${({ theme: { colors, typography }, $tone = 'muted' }) => {
    const tone = {
      muted: colors.layouts.default.enabled.onSurface.tertiary.cssVar,
      error: colors.layouts.brand.enabled.onSurface.primary.cssVar,
      success: colors.layouts.default.enabled.onSurface.secondary.cssVar,
    }[$tone]
    return `
      font-size: ${typography.fontSize.text.xs.cssVar};
      color: ${tone};
    `
  }}
`

export const Input = styled.input`
  ${({ theme: { colors, radius, spacing, typography } }) => `
    flex: 1;
    min-width: 0;
    padding: ${spacing.xs.cssVar} ${spacing.sm.cssVar};
    border-radius: ${radius.md.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.primary.cssVar};
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-family: inherit;
    font-size: ${typography.fontSize.text.sm.cssVar};
  `}
`

export const ChoiceButton = styled.button<{ $active: boolean }>`
  ${({ theme: { colors, radius, spacing, typography }, $active }) => `
    padding: ${spacing.xxs.cssVar} ${spacing.md.cssVar};
    border-radius: ${radius.full.cssVar};
    cursor: pointer;
    font-family: inherit;
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
        : colors.layouts.default.enabled.surface.primary.cssVar
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
    font-family: inherit;
    font-size: ${typography.fontSize.text.sm.cssVar};
    cursor: pointer;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `}
`

// Low-emphasis button for secondary actions (Change / Cancel / Logout).
export const GhostButton = styled.button`
  ${({ theme: { colors, radius, spacing, typography } }) => `
    padding: ${spacing.xxs.cssVar} ${spacing.md.cssVar};
    border-radius: ${radius.md.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.primary.cssVar};
    background: transparent;
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-family: inherit;
    font-size: ${typography.fontSize.text.sm.cssVar};
    cursor: pointer;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `}
`

// The iOS Share glyph, sized to the surrounding text via em, for the install hint.
export const ShareGlyph = styled.svg`
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  margin: 0 0.15em;
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
