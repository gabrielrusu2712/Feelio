import styled from 'styled-components'

export const Face = styled.div`
  /* Sizes to its container's smaller dimension (cqmin) so it fills the
     character area without overflowing when the box gets short or narrow.
     Requires a sized query-container ancestor (CharacterRoot / CharacterArea). */
  font-size: clamp(2.5rem, 32cqmin, 9rem);
  line-height: 1;
`

export const Bubble = styled.p`
  ${({ theme: { colors, radius, spacing } }) => `
    margin: 0;
    padding: ${spacing.sm.cssVar} ${spacing.md.cssVar};
    border-radius: ${radius.lg.cssVar};
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.tertiary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-size: clamp(0.7rem, 4cqi, 1rem);
  `}
`
