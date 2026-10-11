import type { Rect } from '../config/arena';
import type { EnemyKind } from '../config/gameplay';

export type Team = 'player' | 'enemy';
export type MatchEndReason = 'time' | 'destroyed';

export interface ShipState {
  x: number;
  y: number;
  angle: number;
  health: number;
}

export interface EnemyState extends ShipState {
  id: number;
  kind: EnemyKind;
  fireCooldown: number;
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

export interface MatchState {
  elapsedSeconds: number;
  score: number;
  endReason: MatchEndReason | null;
}

export interface WorldState {
  player: ShipState;
  playerCooldown: WeaponCooldown;
  projectiles: ProjectileState[];
  enemies: EnemyState[];
  obstacles: readonly Rect[];
  spawnTimer: number;
  spawnCount: number;
  match: MatchState;
  nextEntityId: number;
  rngState: number;
}