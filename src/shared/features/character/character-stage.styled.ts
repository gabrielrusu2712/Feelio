import styled from 'styled-components'

// The bear fills the whole area; level+name (right) and stars (left) float as
// separate HUD badges over its top corners, past either side of the character.
export const Stage = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  height: 100%;
  display: flex;
`

export const CharacterSlot = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const LevelBadge = styled.div`
  ${({ theme: { colors, spacing } }) => `
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${spacing.xs.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
  `}
`

export const Username = styled.span`
  font-size: clamp(0.75rem, 2.4cqi, 1.1rem);
  font-weight: 700;
`

// Same color as the level number inside the ring, not the muted body color.
export const StarsBadge = styled.div`
  ${({ theme: { colors, spacing } }) => `
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    gap: ${spacing.xs.cssVar};
    font-size: clamp(0.9rem, 3cqi, 1.4rem);
    font-weight: 800;
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
  `}
`

export const StarIcon = styled.img`
  width: clamp(1.4rem, 4cqi, 2.2rem);
  height: auto;
`
