import { ARENA } from "../config/arena";
import type { ProjectileConfig } from "../config/gameplay";
import { circleIntersectsRect } from "./collision";
import type { ProjectileState, WorldState } from "./types";

export function updateProjectiles(
  world: WorldState,
  dt: number,
  config: ProjectileConfig,
): void {
  let kept = 0;
  for (const projectile of world.projectiles) {
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;
    projectile.ageSeconds += dt;
    if (isAlive(projectile, world, config)) {
      world.projectiles[kept] = projectile;
      kept += 1;
    }
  }
  world.projectiles.length = kept;
}

function isAlive(
  projectile: ProjectileState,
  world: WorldState,
  config: ProjectileConfig,
): boolean {
  if (projectile.ageSeconds > config.lifetimeSeconds) return false;

  const { x, y, radius } = projectile;
  if (x < -radius || x > ARENA.width + radius) return false;
  if (y < -radius || y > ARENA.height + radius) return false;

  return !world.obstacles.some((obstacle) =>
    circleIntersectsRect(x, y, radius, obstacle),
  );
}