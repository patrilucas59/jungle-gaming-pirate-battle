import type { GameplayConfig } from '../config/gameplay';
import { circlesOverlap } from './collision';
import type { ProjectileState, WorldState } from './types';

export function resolveCombat(world: WorldState, config: GameplayConfig): void {
  resolveProjectileHits(world, config);
  resolveChaserRams(world, config);
  removeDestroyedEnemies(world);
  world.player.health = Math.max(0, world.player.health);
}

function resolveProjectileHits(world: WorldState, config: GameplayConfig): void {
  let kept = 0;
  for (const projectile of world.projectiles) {
    if (!applyHit(projectile, world, config)) {
      world.projectiles[kept] = projectile;
      kept += 1;
    }
  }
  world.projectiles.length = kept;
}

function applyHit(
  projectile: ProjectileState,
  world: WorldState,
  config: GameplayConfig,
): boolean {
  if (projectile.team === 'player') {
    for (const enemy of world.enemies) {
      if (enemy.health <= 0) continue;
      const { radius } = config.enemies[enemy.kind];
      if (circlesOverlap(projectile.x, projectile.y, projectile.radius, enemy.x, enemy.y, radius)) {
        enemy.health -= projectile.damage;
        if (enemy.health <= 0) world.match.score += 1;
        return true;
      }
    }
    return false;
  }

  const { player } = world;
  if (circlesOverlap(projectile.x, projectile.y, projectile.radius, player.x, player.y, config.player.radius)) {
    player.health -= projectile.damage;
    return true;
  }
  return false;
}

function resolveChaserRams(world: WorldState, config: GameplayConfig): void {
  const { player } = world;
  const chaser = config.enemies.chaser;
  for (const enemy of world.enemies) {
    if (enemy.kind !== 'chaser' || enemy.health <= 0) continue;
    if (circlesOverlap(enemy.x, enemy.y, chaser.radius, player.x, player.y, config.player.radius)) {
      player.health -= chaser.contactDamage;
      enemy.health = 0;
    }
  }
}

function removeDestroyedEnemies(world: WorldState): void {
  let kept = 0;
  for (const enemy of world.enemies) {
    if (enemy.health > 0) {
      world.enemies[kept] = enemy;
      kept += 1;
    }
  }
  world.enemies.length = kept;
}