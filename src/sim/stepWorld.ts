import type { GameplayConfig } from '../config/gameplay';
import type { PlayerIntents } from '../input/intents';
import { pushCircleOutOfRect } from './collision';
import { updatePlayerMovement } from './playerMovement';
import type { WorldState } from './types';

export function stepWorld(
  world: WorldState,
  intents: PlayerIntents,
  dt: number,
  config: GameplayConfig,
): void {
  updatePlayerMovement(world.player, intents, dt, config.player);
  for (const obstacle of world.obstacles) {
    pushCircleOutOfRect(world.player, config.player.radius, obstacle);
  }
}