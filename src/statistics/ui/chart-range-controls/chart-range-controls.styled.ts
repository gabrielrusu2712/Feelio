import styled from 'styled-components'

export const ControlsRow = styled.div`
  ${({ theme: { spacing } }) => `
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${spacing.sm.cssVar};
    flex-wrap: wrap;
  `}
`

export const NavButton = styled.button`
  ${({ theme: { colors, radius } }) => `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: ${radius.full.cssVar};
    border: 2px solid ${colors.layouts.default.enabled.border.secondary.cssVar};
    background: transparent;
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-size: 1rem;
    font-weight: 800;
    cursor: pointer;
    transition: border-color 0.2s, opacity 0.2s;

    &:hover:not(:disabled) {
      border-color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    }

    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  `}
`

export const PeriodTabs = styled.div`
  ${({ theme: { spacing } }) => `
    display: flex;
    gap: ${spacing.xs.cssVar};
  `}
`

export const RangeLabel = styled.p`
  ${({ theme: { colors, typography } }) => `
    margin: 0;
    text-align: center;
    font-size: ${typography.fontSize.text.sm.cssVar};
    font-weight: 700;
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
  `}
`

export const CalcNote = styled.p`
  ${({ theme: { colors, typography } }) => `
    margin: 0;
    text-align: center;
    font-size: ${typography.fontSize.text.xs.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
  `}
`
