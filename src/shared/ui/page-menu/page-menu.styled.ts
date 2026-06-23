import styled from 'styled-components'

export const MenuRoot = styled.div`
  position: relative;
  display: inline-flex;
`

export const MenuButton = styled.button`
  ${({ theme: { colors, radius, typography } }) => `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: ${radius.md.cssVar};
    border: 1px solid ${colors.layouts.brand.enabled.border.primary.cssVar};
    background: ${colors.layouts.brand.enabled.surface.secondary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-size: ${typography.fontSize.text.lg.cssVar};
    line-height: 1;
    cursor: pointer;
  `}
`

export const MenuList = styled.ul`
  ${({ theme: { colors, radius, spacing } }) => `
    position: absolute;
    top: calc(100% + ${spacing.xxs.cssVar});
    left: 0;
    z-index: 50;
    margin: 0;
    padding: ${spacing.xxs.cssVar};
    list-style: none;
    min-width: 11rem;
    display: flex;
    flex-direction: column;
    gap: ${spacing.xxs.cssVar};
    border-radius: ${radius.lg.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.tertiary.cssVar};
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  `}
`

export const MenuItem = styled.button<{ $active: boolean }>`
  ${({ theme: { colors, radius, spacing, typography }, $active }) => `
    width: 100%;
    text-align: left;
    padding: ${spacing.xs.cssVar} ${spacing.sm.cssVar};
    border: none;
    border-radius: ${radius.md.cssVar};
    cursor: pointer;
    font-size: ${typography.fontSize.text.sm.cssVar};
    font-weight: ${$active ? '700' : '500'};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    background: ${$active ? colors.layouts.brand.enabled.surface.secondary.cssVar : 'transparent'};
    transition: background 0.15s;

    &:hover {
      background: ${colors.layouts.default.enabled.surface.secondary.cssVar};
    }
  `}
`
