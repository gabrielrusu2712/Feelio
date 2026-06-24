import styled from 'styled-components'

export const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  padding: 10px 15px 12px;
  overflow-x: auto;
  justify-content: center;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

export const FilterPill = styled.button<{ $active: boolean }>`
  ${({ theme: { colors, radius }, $active }) => `
    background: ${colors.layouts.default.enabled.border.primary.cssVar};
    border: 3px solid ${$active ? colors.layouts.default.enabled.onSurface.primary.cssVar : colors.layouts.default.enabled.border.secondary.cssVar};
    color: ${$active ? colors.layouts.default.enabled.onSurface.primary.cssVar : colors.layouts.default.enabled.onSurface.secondary.cssVar};
    padding: 6px 14px;
    border-radius: ${radius.full.cssVar};
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: border-color 0.2s, color 0.2s;
  `}
`
