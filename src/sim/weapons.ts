import type { GameplayConfig } from "../config/gameplay";
import type { PlayerIntents } from "../input/intents";
import type { Team, WorldState } from "./types";

export function updatePlayerWeapons(
  world: WorldState,
  intents: PlayerIntents,
  dt: number,
  config: GameplayConfig,
): void {
  const cooldown = world.playerCooldown;
  cooldown.front = Math.max(0, cooldown.front - dt);
  cooldown.left = Math.max(0, cooldown.left - dt);
  cooldown.right = Math.max(0, cooldown.right - dt);

  const ship = world.player;
  const forwardX = Math.cos(ship.angle);
  const forwardY = Math.sin(ship.angle);
  const { front, side } = config.weapons;

  if (intents.fireFront && cooldown.front === 0) {
    spawnProjectile(
      world,
      'player',
      ship.x + forwardX * front.muzzleOffset,
      ship.y + forwardY * front.muzzleOffset,
      forwardX,
      forwardY,
      config,
    );
    cooldown.front = front.cooldownSeconds;
  }

  if (intents.fireLeft && cooldown.left === 0) {
    fireBroadside(world, forwardX, forwardY, -1, config);
    cooldown.left = side.cooldownSeconds;
  }

  if (intents.fireRight && cooldown.right === 0) {
    fireBroadside(world, forwardX, forwardY, 1, config);
    cooldown.right = side.cooldownSeconds;
  }
}

export function spawnProjectile(
  world: WorldState,
  team: Team,
  x: number,
  y: number,
  directionX: number,
  directionY: number,
  config: GameplayConfig,
): void {
  const { speed, damage, radius } = config.projectile;
  world.projectiles.push({
    id: world.nextEntityId,
    team,
    x,
    y,
    vx: directionX * speed,
    vy: directionY * speed,
    ageSeconds: 0,
    damage,
    radius,
  });
  world.nextEntityId += 1;
}

function fireBroadside(
  world: WorldState,
  forwardX: number,
  forwardY: number,
  sideSign: 1 | -1,
  config: GameplayConfig,
): void {
  const { side } = config.weapons;
  const ship = world.player;
  const sideX = -forwardY * sideSign;
  const sideY = forwardX * sideSign;
  const middle = (side.projectileCount - 1) / 2;

  for (let index = 0; index < side.projectileCount; index += 1) {
    const along = (index - middle) * side.spacing;
    spawnProjectile(
      world,
      'player',
      ship.x + forwardX * along + sideX * side.muzzleOffset,
      ship.y + forwardY * along + sideY * side.muzzleOffset,
      sideX,
      sideY,
      config,
    );
  }
}