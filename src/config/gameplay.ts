export type EnemyKind = "chaser" | "shooter";

export interface ShipConfig {
  maxHealth: number;
  moveSpeed: number;
  turnSpeed: number;
  radius: number;
}

export type PlayerConfig = ShipConfig;

export interface ChaserConfig extends ShipConfig {
  contactDamage: number;
}

export interface ShooterConfig extends ShipConfig {
  attackRange: number;
  preferredDistance: number;
  fireCooldownSeconds: number;
  muzzleOffset: number;
  aimToleranceRadians: number;
}

export interface ProjectileConfig {
  speed: number;
  damage: number;
  radius: number;
  lifetimeSeconds: number;
}

export interface FrontWeaponConfig {
  cooldownSeconds: number;
  muzzleOffset: number;
}

export interface SideWeaponConfig {
  cooldownSeconds: number;
  muzzleOffset: number;
  projectileCount: number;
  spacing: number;
}

export interface SpawnConfig {
  firstDelaySeconds: number;
  intervalSeconds: number;
  minDistanceFromPlayer: number;
  maxAttempts: number;
  pattern: readonly EnemyKind[];
}

export interface MatchConfig {
  durationSeconds: number;
}

export interface GameplayConfig {
  player: PlayerConfig;
  projectile: ProjectileConfig;
  weapons: {
    front: FrontWeaponConfig;
    side: SideWeaponConfig;
  };
  enemies: {
    chaser: ChaserConfig;
    shooter: ShooterConfig
  };
  spawn: SpawnConfig;
  match: MatchConfig;
}

export const GAMEPLAY: GameplayConfig = {
  player: {
    maxHealth: 100,
    moveSpeed: 140,
    turnSpeed: 2.5,
    radius: 28,
  },
  projectile: {
    speed: 420,
    damage: 25,
    radius: 5,
    lifetimeSeconds: 1.4,
  },
    weapons: {
      front: { cooldownSeconds: 0.45, muzzleOffset: 50 },
      side: { cooldownSeconds: 1.6, muzzleOffset: 30, projectileCount: 3, spacing: 24 },
    },
    enemies: {
      chaser: {
        maxHealth: 50,
        moveSpeed: 110,
        turnSpeed: 2.2,
        radius: 26,
        contactDamage: 30,
      },
    shooter: {
      maxHealth: 75,
      moveSpeed: 80,
      turnSpeed: 1.8,
      radius: 28,
      attackRange: 380,
      preferredDistance: 280,
      fireCooldownSeconds: 2,
      muzzleOffset: 50,
      aimToleranceRadians: 0.25,
    },
  },
    spawn: {
      firstDelaySeconds: 1.5,
      intervalSeconds: 4,
      minDistanceFromPlayer: 350,
      maxAttempts: 30,
      pattern: ['chaser', 'shooter', 'chaser'],
    },
    match: {
      durationSeconds: 90,
    },
  };