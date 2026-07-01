import styled from 'styled-components'

export const PageRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`

export const ScrollBody = styled.div`
  ${({ theme: { spacing } }) => `
    container-type: inline-size;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    display: flex;
    flex-direction: column;
    gap: ${spacing['2xl'].cssVar};
    padding: ${spacing.lg.cssVar};

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
    }
  `}
`

export const Section = styled.section`
  ${({ theme: { spacing } }) => `
    display: flex;
    flex-direction: column;
    gap: ${spacing.md.cssVar};
  `}
`

export const SectionTitle = styled.h3`
  ${({ theme: { colors, typography } }) => `
    margin: 0;
    text-align: center;
    font-size: ${typography.fontSize.text.md.cssVar};
    font-weight: 800;
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
  `}
`
