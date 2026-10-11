
import { ARENA, ISLAND_COLLECTION_INSET, ISLANDS } from '../config/arena';
import { insetRect } from './collision';
import type { WorldState } from './types';

export function createWorld(): WorldState {
  return {
    player: { x: ARENA.width / 2, y: ARENA.height / 2, angle: -Math.PI / 2 },
    obstacles: ISLANDS.map((island) => insetRect(island, ISLAND_COLLECTION_INSET)),
  };
}