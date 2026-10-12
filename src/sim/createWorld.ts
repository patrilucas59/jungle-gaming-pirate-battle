import { ARENA, ISLAND_COLLISION_INSET, ISLANDS } from '../config/arena';
import type { GameplayConfig } from '../config/gameplay';
import { insetRect } from './collision';
import type { WorldState } from './types';

export function createWorld(config: GameplayConfig, seed: number): WorldState {
  return {
    player: {
      x: ARENA.width / 2,
      y: ARENA.height / 2,
      angle: -Math.PI / 2,
      health: config.player.maxHealth,
    },
    playerCooldown: { front: 0, left: 0, right: 0 },
    projectiles: [],
    enemies: [],
    obstacles: ISLANDS.map((island) => insetRect(island, ISLAND_COLLISION_INSET)),
    spawnTimer: config.spawn.firstDelaySeconds,
    spawnCount: 0,
    match: { elapsedSeconds: 0, score: 0, endReason: null },
    nextEntityId: 1,
    rngState: seed | 0,
  };
}