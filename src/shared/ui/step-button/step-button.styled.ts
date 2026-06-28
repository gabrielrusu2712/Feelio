import styled from 'styled-components'

// Small round +/- control shared by the stat bars. Sizes to the surrounding
// query container (cqi) within rem bounds so it scales with the bar.
export const StepRoot = styled.button`
  ${({ theme: { colors, radius } }) => `
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    width: clamp(1.1rem, 16cqi, 1.6rem);
    height: clamp(1.1rem, 16cqi, 1.6rem);
    padding: 0;
    border-radius: ${radius.full.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.primary.cssVar};
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-size: clamp(0.7rem, 10cqi, 1rem);
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
    transition: background 0.15s, opacity 0.15s;

    &:hover:not(:disabled) {
      background: ${colors.layouts.default.enabled.surface.tertiary.cssVar};
    }

    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  `}
`
