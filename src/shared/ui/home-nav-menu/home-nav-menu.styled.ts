import styled from 'styled-components'

// The big landscape-home navigation board: fills the content panel and is a
// query container, so its heading and rows size to the panel's own width
// (cqi/cqmin within rem clamp() floors+caps) and survive zoom/resize. Rows
// overflow internally — the shell itself never scrolls.
export const BoardRoot = styled.div`
  ${({ theme: { spacing } }) => `
    container-type: size;
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: ${spacing.md.cssVar};
    padding: ${spacing.lg.cssVar};
    overflow: auto;
  `}
`

export const BoardTitle = styled.h2`
  ${({ theme: { colors } }) => `
    margin: 0;
    font-size: clamp(1rem, 6cqi, 1.6rem);
    font-weight: 700;
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
  `}
`

export const BoardList = styled.div`
  ${({ theme: { spacing } }) => `
    display: flex;
    flex-direction: column;
    gap: ${spacing.sm.cssVar};
  `}
`

// Each destination is a full-width row: icon · label · chevron. The row is its
// own query container so the contents scale to the row width.
export const BoardItem = styled.button`
  ${({ theme: { colors, radius, spacing } }) => `
    container-type: inline-size;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: ${spacing.md.cssVar};
    width: 100%;
    text-align: left;
    padding: clamp(${spacing.sm.cssVar}, 4cqi, ${spacing.lg.cssVar}) ${spacing.md.cssVar};
    border-radius: ${radius.lg.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.tertiary.cssVar};
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;

    &:hover {
      background: ${colors.layouts.brand.enabled.surface.secondary.cssVar};
      border-color: ${colors.layouts.brand.enabled.border.primary.cssVar};
    }
  `}
`

export const ItemIcon = styled.span`
  font-size: clamp(1.1rem, 7cqi, 2rem);
  line-height: 1;
`

export const ItemLabel = styled.span`
  font-size: clamp(0.85rem, 5cqi, 1.25rem);
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ItemChevron = styled.span`
  ${({ theme: { colors } }) => `
    font-size: clamp(0.9rem, 5cqi, 1.4rem);
    line-height: 1;
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
  `}
`
