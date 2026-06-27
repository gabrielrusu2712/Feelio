import styled from 'styled-components'

// The shared pill for "pick from a set of options" controls (map category
// filters, journal mood selector, …). One look so every such control reads as
// the same family; only the content (text vs emoji) differs.
export const OptionButton = styled.button<{ $active: boolean }>`
  ${({ theme: { colors, radius }, $active }) => `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    padding: 0.4rem 0.9rem;
    border-radius: ${radius.full.cssVar};
    border: 3px solid ${
      $active
        ? colors.layouts.default.enabled.onSurface.primary.cssVar
        : colors.layouts.default.enabled.border.secondary.cssVar
    };
    background: ${colors.layouts.default.enabled.border.primary.cssVar};
    color: ${
      $active
        ? colors.layouts.default.enabled.onSurface.primary.cssVar
        : colors.layouts.default.enabled.onSurface.secondary.cssVar
    };
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;

    &:hover {
      border-color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    }
  `}
`
