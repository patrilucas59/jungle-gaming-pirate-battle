export interface PlayerConfig {
  maxHealth: number;
  moveSpeed: number;
  turnSpeed: number;
  radius: number;
}

export interface GameplayConfig {
  player: PlayerConfig;
}

export const GAMEPLAY: GameplayConfig = {
  player: {
    maxHealth: 100,
    moveSpeed: 140,
    turnSpeed: 2.5,
    radius: 28,
  },
};