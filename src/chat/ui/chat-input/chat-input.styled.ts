import styled from 'styled-components'

export const InputBar = styled.div`
  ${({ theme: { primitives, spacing } }) => `
    display: flex;
    align-items: flex-end;
    gap: ${spacing.xs.cssVar};
    flex-shrink: 0;
    margin: ${spacing.md.cssVar};
    padding: ${spacing.xs.cssVar} ${spacing.md.cssVar};
    border-radius: 1.25rem;
    background: ${primitives.palette.peach['500'].cssVar};
    border: 2px solid ${primitives.palette.brand['500'].cssVar};
  `}
`

export const Textarea = styled.textarea`
  ${({ theme: { primitives } }) => `
    flex: 1;
    resize: none;
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: 0.95rem;
    line-height: 1.4;
    max-height: 10rem;
    padding: 0.5rem 0;
    color: ${primitives.palette.brand['700'].cssVar};

    /* Height + overflow are driven by JS auto-grow: hidden until the text passes
       the max height, then a thin, subtle scrollbar appears. */
    overflow-y: hidden;
    scrollbar-width: thin;
    scrollbar-color: ${primitives.palette.brand['500'].cssVar} transparent;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${primitives.palette.brand['500'].cssVar};
      border-radius: 999px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::placeholder {
      color: ${primitives.palette.brand['700'].cssVar};
      opacity: 0.7;
    }
  `}
`

export const SendButton = styled.button`
  ${({ theme: { primitives } }) => `
    flex-shrink: 0;
    width: 2.5rem;
    height: 2.5rem;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${primitives.palette.peach['50'].cssVar};
    background: ${primitives.palette.brand['500'].cssVar};
    transition:
      transform 0.2s ease,
      background-color 0.2s ease;

    &:hover:not(:disabled) {
      background: ${primitives.palette.brand['600'].cssVar};
      transform: scale(1.05);
    }

    &:disabled {
      opacity: 0.5;
      cursor: default;
    }
  `}
`
