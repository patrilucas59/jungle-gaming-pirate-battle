export interface PlayerConfig {
  maxHealth: number;
  moveSpeed: number;
  turnSpeed: number;
  radius: number;
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

export interface GameplayConfig {
  player: PlayerConfig;
  projectile: ProjectileConfig;
  weapons: {
    front: FrontWeaponConfig;
    side: SideWeaponConfig;
  };
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
    front: {
      cooldownSeconds: 0.45,
      muzzleOffset: 50,
    },
    side: {
      cooldownSeconds: 1.6,
      muzzleOffset: 30,
      projectileCount: 3,
      spacing: 24,
    },
  },
};