export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ARENA = {
  width: 1280,
  height: 720,
} as const;

export const TILE_SIZE = 64;

export const ISLANDS: readonly Rect[] = [
  { x: 256, y: 192, width: 192, height: 192 },
];

export const ISLAND_COLLISION_INSET = 0;