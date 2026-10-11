import { ARENA } from "../config/arena";
import type { WorldState } from "./types";

export function createWorld(): WorldState {
  return {
    player: { x: ARENA.width / 2, y: ARENA.height / 2, angle: -Math.PI / 2 },
  };
}