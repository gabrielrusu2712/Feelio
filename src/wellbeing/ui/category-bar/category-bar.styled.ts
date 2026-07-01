import styled from 'styled-components'

// Below this container width the pills can no longer sit side by side with text,
// so they collapse to emoji-only and the selected caption appears instead.
const COLLAPSE_WIDTH = '520px'

export const CategoryWrap = styled.div`
  container-type: inline-size;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
`

export const CategoryRow = styled.div`
  ${({ theme: { spacing } }) => `
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    gap: ${spacing.sm.cssVar};
    max-width: 100%;
  `}
`

export const CategoryIcon = styled.span`
  font-size: 1.1em;
  line-height: 1;
`

// Hidden once the row is too narrow for text — the pills become emoji-only.
export const CategoryLabel = styled.span`
  @container (max-width: ${COLLAPSE_WIDTH}) {
    display: none;
  }
`

// The counterpart to CategoryLabel: a tiny caption naming the selected category,
// shown only once the pills have collapsed to emoji-only.
export const SelectedTitle = styled.span`
  ${({ theme: { colors, typography } }) => `
    display: none;
    font-size: ${typography.fontSize.text.sm.cssVar};
    font-weight: 700;
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};

    @container (max-width: ${COLLAPSE_WIDTH}) {
      display: block;
    }
  `}
`
