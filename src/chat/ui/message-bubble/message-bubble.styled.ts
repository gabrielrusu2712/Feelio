import styled, { css, keyframes } from 'styled-components'

export const BubbleRow = styled.div<{ $isUser: boolean }>`
  ${({ $isUser }) => `
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
    justify-content: ${$isUser ? 'flex-end' : 'flex-start'};
  `}
`

export const Avatar = styled.img`
  ${({ theme: { primitives } }) => `
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    object-fit: cover;
    background: ${primitives.palette.peach['300'].cssVar};
    border: 2px solid ${primitives.palette.brand['500'].cssVar};
  `}
`

export const Bubble = styled.p<{ $isUser: boolean }>`
  ${({ theme: { primitives }, $isUser }) => `
    margin: 0;
    max-width: 78%;
    padding: 0.75rem 1rem;
    font-size: 0.92rem;
    line-height: 1.5;
    white-space: pre-wrap;
    color: ${primitives.palette.brand['700'].cssVar};
    background: ${primitives.palette.peach['500'].cssVar};
    border: 2px solid ${primitives.palette.brand['500'].cssVar};
    border-radius: ${$isUser ? '1.25rem 1.25rem 0.25rem 1.25rem' : '1.25rem 1.25rem 1.25rem 0.25rem'};
  `}
`

const blink = keyframes`
  0%, 80%, 100% { opacity: 0.3; transform: translateY(0); }
  40% { opacity: 1; transform: translateY(-0.15rem); }
`

// The "Feelio is typing" bubble: three dots bouncing in sequence while awaiting
// the model reply (ported from the source's convo-typing dots).
export const TypingBubble = styled.div`
  ${({ theme: { primitives } }) => `
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.85rem 1rem;
    background: ${primitives.palette.peach['500'].cssVar};
    border: 2px solid ${primitives.palette.brand['500'].cssVar};
    border-radius: 1.25rem 1.25rem 1.25rem 0.25rem;
  `}
`

export const Dot = styled.span`
  ${({ theme: { primitives } }) => css`
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    background: ${primitives.palette.brand['500'].cssVar};
    animation: ${blink} 1.2s infinite ease-in-out both;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  `}
`
