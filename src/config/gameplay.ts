export interface Gameplay {
  session: { durationSeconds: number };
  spawn: { intervalSeconds: number };
  player: { maxHealth: number; moveSpeed: number; turnSpeed: number };
}