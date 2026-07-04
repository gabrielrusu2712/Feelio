export interface Box {
  x: number
  y: number
  w: number
  h: number
}

// AABB overlap with a shared inset on both boxes, forgiving sprite padding so
// hitboxes feel tighter than the drawn art (ported from the source's collision
// check verbatim).
export const intersects = (a: Box, b: Box, inset: number): boolean =>
  a.x < b.x + b.w - inset &&
  a.x + a.w - inset > b.x &&
  a.y < b.y + b.h - inset &&
  a.y + a.h - inset > b.y

// Obstacles/background scroll faster as the score climbs, in fixed steps of
// `divisor` score points per +1 speed.
export const computeSpeed = (score: number, base: number, divisor: number): number =>
  base + Math.floor(score / divisor)

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))
