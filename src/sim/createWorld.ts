
import { ARENA, ISLAND_COLLECTION_INSET, ISLANDS } from '../config/arena';
import { insetRect } from './collision';
import type { WorldState } from './types';

export function createWorld(): WorldState {
  return {
    player: { x: ARENA.width / 2, y: ARENA.height / 2, angle: -Math.PI / 2 },
    playerCooldown: { front: 0, left: 0, right: 0 },
    projectiles: [],
    obstacles: ISLANDS.map((island) => insetRect(island, ISLAND_COLLECTION_INSET)),
    nextEntityId: 1,
  };
}