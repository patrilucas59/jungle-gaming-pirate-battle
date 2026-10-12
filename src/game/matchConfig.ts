import { GAMEPLAY, type GameplayConfig } from '../config/gameplay';
import type { GameOptions } from '../storage/options';

export function buildMatchConfig(options: GameOptions): GameplayConfig {
  return {
    ...GAMEPLAY,
    spawn: { ...GAMEPLAY.spawn, intervalSeconds: options.spawnIntervalSeconds },
    match: { durationSeconds: options.durationSeconds },
  };
}