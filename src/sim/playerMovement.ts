import { ARENA } from "../config/arena";
import type { PlayerConfig } from "../config/gameplay";
import type { PlayerIntents } from "../input/intents";
import { clamp } from "./math";
import type { ShipState } from "./types";

export function updatePlayerMovement(
  ship: ShipState,
  intents: PlayerIntents,
  dt: number,
  config: PlayerConfig,
): void {
  let turnDirection = 0;
  if (intents.turnRight) turnDirection += 1;
  if (intents.turnLeft) turnDirection -= 1;
  ship.angle += turnDirection * config.turnSpeed * dt;

  if (intents.forward) {
   const distance = config.moveSpeed * dt;
   ship.x += Math.cos(ship.angle) * distance;    
   ship.y += Math.sin(ship.angle) * distance;
  }

  ship.x = clamp(ship.x, config.radius, ARENA.width - config.radius);
  ship.y = clamp(ship.y, config.radius, ARENA.height - config.radius);
}