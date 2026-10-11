import type { Rect } from '../config/arena';

export type Team = "player" | "enemy";

export interface ShipState {
  x: number;
  y: number;
  angle: number;
}

export interface ProjectileState {
  id: number;
  team: Team;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ageSeconds: number;
  damage: number;
  radius: number;
}


export interface WeaponCooldown {
  front: number;
  left: number;
  right: number;
}

export interface WorldState {
  player: ShipState;
  playerCooldown: WeaponCooldown;
  projectiles: ProjectileState[];
  obstacles: readonly Rect[];
  nextEntityId: number;
}