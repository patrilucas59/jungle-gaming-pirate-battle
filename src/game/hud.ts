import type { GameplayConfig } from "../config/gameplay";
import type { MatchEndReason, WorldState } from "../sim/types";

export type MatchStatus = "playing" | "paused" | "ended";

export interface HudSnapshot {
  status: MatchStatus;
  health: number;
  maxHealth: number;
  score: number;
  remainingSeconds: number;
  elapsedSeconds: number;
  endReason: MatchEndReason | null;
}

export function buildHudSnapshot(
  world: WorldState,
  config: GameplayConfig,
  paused: boolean,
): HudSnapshot {
  const { match } = world;
  let status: MatchStatus = "playing";
  if (match.endReason) status = "ended";
  else if (paused) status = "paused";

  return {
    status,
    health: Math.ceil(world.player.health),
    maxHealth: config.player.maxHealth,
    score: match.score,
    remainingSeconds: Math.ceil(config.match.durationSeconds - match.elapsedSeconds),
    elapsedSeconds: Math.floor(match.elapsedSeconds),
    endReason: match.endReason,
  };
}

export function hudChanged(previous: HudSnapshot | null, next: HudSnapshot): boolean {
  return (
    !previous ||
    previous.status !== next.status ||
    previous.health !== next.health ||
    previous.score !== next.score ||
    previous.remainingSeconds !== next.remainingSeconds ||
    previous.endReason !== next.endReason
  )
}