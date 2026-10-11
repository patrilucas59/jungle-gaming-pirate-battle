import { ARENA } from '../config/arena';
import type { ChaserConfig, GameplayConfig, ShooterConfig } from '../config/gameplay';
import { pushCircleOutOfRect } from './collision';
import { clamp } from './math';
import { distanceBetween, moveForward, turnTowards } from './steering';
import type { EnemyState, WorldState } from './types';
import { spawnProjectile } from './weapons';


export function updateEnemies(
  world: WorldState,
  dt: number,
  config: GameplayConfig,
): void {
  for (const enemy of world.enemies) {
    if (enemy.kind === "chaser") {
      updateChaser(enemy, world, dt, config.enemies.chaser);
    } else {
      updateShooter(enemy, world, dt, config.enemies.shooter, config);
    }

    const { radius } = config.enemies[enemy.kind];
    for (const obstacle of world.obstacles) {
      pushCircleOutOfRect(enemy, radius, obstacle);
    }
    enemy.x = clamp(enemy.x, radius, ARENA.width - radius);
    enemy.y = clamp(enemy.y, radius, ARENA.height - radius);
  }
}

function updateChaser(
  enemy: EnemyState,
  world: WorldState,
  dt: number,
  chaser: ChaserConfig,
): void {
  turnTowards(enemy, world.player.x, world.player.y, chaser.turnSpeed, dt);
  moveForward(enemy, chaser.moveSpeed, dt);
}

function updateShooter(
  enemy: EnemyState,
  world: WorldState,
  dt: number,
  shooter: ShooterConfig,
  config: GameplayConfig,
): void {
  const remainingTurn = turnTowards(
    enemy,
    world.player.x,
    world.player.y,
    shooter.turnSpeed,
    dt,
  );
  const distance = distanceBetween(enemy, world.player);
  if (distance > shooter.preferredDistance) {
    moveForward(enemy, shooter.moveSpeed, dt);
  }

  enemy.fireCooldown = Math.max(0, enemy.fireCooldown - dt);
  const inRange = distance <= shooter.attackRange;
  const aimed = remainingTurn <= shooter.aimToleranceRadians;
  if (inRange && aimed && enemy.fireCooldown === 0) {
    const forwardX = Math.cos(enemy.angle);
    const forwardY = Math.sin(enemy.angle);
    spawnProjectile(
      world,
      'enemy',
      enemy.x + forwardX * shooter.muzzleOffset,
      enemy.y + forwardY * shooter.muzzleOffset,
      forwardX,
      forwardY,
      config,
    );
    enemy.fireCooldown = shooter.fireCooldownSeconds;
  }
}