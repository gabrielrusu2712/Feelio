import styled from 'styled-components'

export const SearchRoot = styled.div`
  ${({ theme: { spacing } }) => `
    position: relative;
    margin: ${spacing.xl.cssVar} ${spacing['3xl'].cssVar} ${spacing.md.cssVar};
  `}
`

export const SearchIcon = styled.span`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-style: normal;
  font-size: 1rem;
`

export const SearchInput = styled.input`
  ${({ theme: { colors, radius } }) => `
    width: 100%;
    padding: 12px 20px 12px 45px;
    border-radius: ${radius.full.cssVar};
    border: 2px solid ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    background: ${colors.layouts.default.enabled.border.primary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-size: 1rem;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s;
    &::placeholder {
      color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
      opacity: 0.7;
    }
    &:focus {
      border-color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
    }
  `}
`
