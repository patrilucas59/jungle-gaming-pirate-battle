import type { GameplayConfig } from '../config/gameplay';
import type { PlayerIntents } from '../input/intents';
import { pushCircleOutOfRect } from './collision';
import { resolveCombat } from './combat';
import { updateEnemies } from './enemies';
import { updateMatch } from './match';
import { updatePlayerMovement } from './playerMovement';
import { updateProjectiles } from './projectiles';
import { updateSpawning } from './spawn';
import type { WorldState } from './types';
import { updatePlayerWeapons } from './weapons';

export function stepWorld(
  world: WorldState,
  intents: PlayerIntents,
  dt: number,
  config: GameplayConfig,
): void {
  if (world.match.endReason) return;

  updatePlayerMovement(world.player, intents, dt, config.player);
  for (const obstacle of world.obstacles) {
    pushCircleOutOfRect(world.player, config.player.radius, obstacle);
  }
  updateProjectiles(world, dt, config.projectile);
  updatePlayerWeapons(world, intents, dt, config);
  updateEnemies(world, dt, config);
  updateSpawning(world, dt, config);
  resolveCombat(world, config);
  updateMatch(world, dt, config);
}