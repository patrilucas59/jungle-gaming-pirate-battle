import type { Rect } from '../config/arena';
export interface ShipState {
  x: number;
  y: number;
  angle: number;
}

export interface WorldState {
  player: ShipState;
  obstacles: readonly Rect[];
}