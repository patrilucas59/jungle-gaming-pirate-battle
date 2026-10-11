import { ARENA } from '../config/arena';
import type { GameplayConfig } from '../config/gameplay';
import { circleIntersectsRect, circlesOverlap } from './collision';
import { nextRandom } from './random';
import type { WorldState } from './types';

export function updateSpawning(
  world: WorldState,
  dt: number,
  config: GameplayConfig,
): void {
  world.spawnTimer -= dt;
  if (world.spawnTimer > 0) return;
  world.spawnTimer += config.spawn.intervalSeconds;

  const { pattern } = config.spawn;
  const kind = pattern[world.spawnCount % pattern.length];
  const enemyConfig = config.enemies[kind];
  const point = findSpawnPoint(world, enemyConfig.radius, config);
  if (!point) return;

  world.enemies.push({
    id: world.nextEntityId,
    kind,
    x: point.x,
    y: point.y,
    angle: Math.atan2(world.player.y - point.y, world.player.x - point.x),
    health: enemyConfig.maxHealth,
    fireCooldown: config.enemies.shooter.fireCooldownSeconds,
  });
  world.nextEntityId += 1;
  world.spawnCount += 1;
}

function findSpawnPoint(
  world: WorldState,
  radius: number,
  config: GameplayConfig,
): { x: number; y: number } | null {
  const { minDistanceFromPlayer, maxAttempts } = config.spawn;
  const { player } = world;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const x = radius + nextRandom(world) * (ARENA.width - radius * 2);
    const y = radius + nextRandom(world) * (ARENA.height - radius * 2);

    if (Math.hypot(x - player.x, y - player.y) < minDistanceFromPlayer) continue;
    if (world.obstacles.some((rect) => circleIntersectsRect(x, y, radius, rect))) continue;
    const blocked = world.enemies.some((enemy) =>
      circlesOverlap(x, y, radius, enemy.x, enemy.y, config.enemies[enemy.kind].radius),
    );
    if (blocked) continue;

    return { x, y };
  }
  return null;
}