export const GamePhase = {
  START: 'start',
  PLAYING: 'playing',
} as const

export type GamePhaseType = (typeof GamePhase)[keyof typeof GamePhase]

export const ObstacleType = {
  OBSTACLE: 'obstacle',
  STAR: 'star',
} as const

export type ObstacleTypeValue = (typeof ObstacleType)[keyof typeof ObstacleType]

export interface Obstacle {
  x: number
  y: number
  w: number
  h: number
  type: ObstacleTypeValue
  image: HTMLImageElement
  passed: boolean
}

export interface GameResult {
  score: number
  stars: number
}

export interface GameHudState {
  lives: number
  score: number
  stars: number
}

// Canvas' internal drawing resolution — CSS scales it responsively, this stays
// fixed so gameplay math (spawn positions, speed) is resolution-independent.
export const GAME_CANVAS = { width: 800, height: 400 } as const

// Ported 1:1 from Feelio-Judeteana's game.ts.
export const GAME_COST_STARS = 10
export const STARTING_LIVES = 3
export const BASE_SPEED = 7
export const SPEED_SCORE_DIVISOR = 150
export const BG_SCROLL_SPEED = 2
export const SPAWN_CHANCE = 0.02
export const STAR_CHANCE = 0.2
export const OBSTACLE_SIZE = 70
export const STAR_SIZE = 40
export const INVINCIBILITY_FRAMES = 80
export const SCORE_PER_OBSTACLE_PASSED = 10
export const HIT_HITBOX_INSET = 15
export const OFFSCREEN_DESPAWN_X = -100

export interface PlayerState {
  x: number
  y: number
  w: number
  h: number
  speed: number
}

export const PLAYER_START: PlayerState = { x: 80, y: 180, w: 80, h: 60, speed: 8 }

export const ROCKET_DRAW_WIDTH = 72
export const ROCKET_DRAW_HEIGHT_DEFAULT = 90
