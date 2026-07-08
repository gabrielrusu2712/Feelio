import styled from 'styled-components'

export const ToggleButton = styled.button`
  ${({ theme: { colors, radius } }) => `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.375rem;
    height: 2.375rem;
    border: none;
    border-radius: ${radius.full.cssVar};
    background: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    color: ${colors.layouts.default.enabled.surface.primary.cssVar};
    font-size: 1.1rem;
    line-height: 1;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.9;
    }
  `}
`
