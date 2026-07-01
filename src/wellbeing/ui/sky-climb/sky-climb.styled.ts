import styled, { css, keyframes } from 'styled-components'

export type NodeState = 'completed' | 'active' | 'locked'

// The climb sits in a sky: lighter near the sun (top), deeper blue toward the
// ground (bottom). A query container so the clouds/sun/panda scale to its width.
export const Sky = styled.div`
  container-type: inline-size;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.75rem, 4cqi, 1.75rem);
  min-height: 100%;
  padding: clamp(1rem, 5cqi, 2.5rem) 0 clamp(1.5rem, 6cqi, 3rem);
  background: linear-gradient(180deg, #bfe9ff 0%, #8fd6ff 45%, #5ec1ff 100%);
`

// CSS sun (no asset): a warm disc with a soft glow and radiating rays.
export const Sun = styled.div`
  position: relative;
  width: clamp(3rem, 24cqi, 6rem);
  height: clamp(3rem, 24cqi, 6rem);
  border-radius: 50%;
  background: radial-gradient(circle at 50% 45%, #fff4b0 0%, #ffd84d 55%, #ffb838 100%);
  box-shadow:
    0 0 clamp(1rem, 6cqi, 2.5rem) rgba(255, 200, 60, 0.85),
    0 0 0 clamp(0.4rem, 2cqi, 0.9rem) rgba(255, 220, 120, 0.35);

  &::before {
    content: '';
    position: absolute;
    inset: clamp(-0.8rem, -4cqi, -1.6rem);
    border-radius: 50%;
    background: repeating-conic-gradient(
      rgba(255, 220, 120, 0.5) 0deg 6deg,
      transparent 6deg 18deg
    );
    -webkit-mask: radial-gradient(circle, transparent 58%, #000 60%);
    mask: radial-gradient(circle, transparent 58%, #000 60%);
  }
`

export const Track = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: clamp(0.75rem, 4cqi, 1.75rem);
`

// Clouds zig-zag up the sky: odd levels sit left of centre, even levels right.
// The shift is a container-relative offset so it scales with the panel width.
export const CloudNode = styled.button<{ $state: NodeState; $side: 'left' | 'right' }>`
  ${({ $state, $side }) => {
    const shift = $side === 'left' ? '-24cqi' : '24cqi'
    const scale = $state === 'active' ? 1.08 : 1
    return `
    position: relative;
    width: clamp(4.5rem, 40cqi, 8rem);
    aspect-ratio: 1.7 / 1;
    border: none;
    background: transparent;
    padding: 0;
    cursor: ${$state === 'locked' ? 'default' : 'pointer'};
    transform: translateX(${shift}) scale(${scale});
    transition: transform 0.2s;

    &:hover {
      transform: translateX(${shift}) scale(${$state === 'locked' ? scale : 1.12});
    }
  `
  }}
`

// The cloud texture. Two supplied assets carry the look — white for completed,
// dark/rainy for incomplete — so the component branches the src; no recolor here.
export const CloudImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`

export const CloudNum = styled.span<{ $state: NodeState }>`
  ${({ $state }) => `
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    /* Nudge onto the cloud body, below its top puffs. */
    padding-top: 8%;
    font-family: inherit;
    font-weight: 800;
    font-size: clamp(0.9rem, 9cqi, 1.6rem);
    color: ${$state === 'completed' ? '#5a3a1a' : '#ffffff'};
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
    pointer-events: none;
  `}
`

const fall = keyframes`
  0% { transform: translateY(0); opacity: 0; }
  20% { opacity: 0.9; }
  100% { transform: translateY(140%); opacity: 0; }
`

// Rain drizzles from beneath the cloud (starting at its base and falling into the
// gap below) rather than over the cloud face.
export const Rain = styled.span`
  position: absolute;
  left: 18%;
  right: 18%;
  top: 88%;
  height: clamp(1rem, 7cqi, 2.25rem);
  pointer-events: none;
`

export const Drop = styled.span<{ $left: number; $delay: number }>`
  ${({ $left, $delay }) => css`
    position: absolute;
    top: 0;
    left: ${$left}%;
    width: clamp(1px, 0.6cqi, 2px);
    height: clamp(5px, 3cqi, 9px);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.8);
    animation: ${fall} 1.1s linear ${$delay}s infinite;
  `}
`

// The bear rides the current cloud. It's a single element positioned over the
// track at the target cloud's measured centre ($x) / perch ($y); when the active
// level changes we just update those coords and the transition glides it there —
// so it climbs cloud-to-cloud smoothly instead of teleporting. The trailing
// translate(-50%, -100%) anchors the bear's feet to the perch point.
export const Bear = styled.img<{ $x: number; $y: number }>`
  ${({ $x, $y }) => `
    position: absolute;
    left: 0;
    top: 0;
    width: clamp(3.25rem, 34cqi, 5.75rem);
    height: auto;
    transform: translate(${$x}px, ${$y}px) translate(-50%, -100%);
    transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
    z-index: 2;
    filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.25));
  `}
`
