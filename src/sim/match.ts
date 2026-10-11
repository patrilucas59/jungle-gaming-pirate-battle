import type { GameplayConfig } from "../config/gameplay";
import type { WorldState } from "./types";

export function updateMatch(world: WorldState, dt: number, config: GameplayConfig): void {
  const { match } = world;
  match.elapsedSeconds = Math.min(match.elapsedSeconds + dt, config.match.durationSeconds);

  if (world.player.health <= 0) {
    match.endReason = 'destroyed';
  } else if (match.elapsedSeconds >= config.match.durationSeconds) {
    match.endReason = 'time';
  }
}