import { GAMEPLAY } from '../config/gameplay';
import { readJson, writeJson } from './storage';

export interface GameOptions {
  durationSeconds: number;
  spawnIntervalSeconds: number;
}

export type OptionErrors = Partial<Record<keyof GameOptions, string>>;

export const OPTION_LIMITS = {
  durationSeconds: { min: 60, max: 180, step: 1 },
  spawnIntervalSeconds: { min: 1, max: 10, step: 0.5 },
} as const;

export const DEFAULT_OPTIONS: GameOptions = {
  durationSeconds: GAMEPLAY.match.durationSeconds,
  spawnIntervalSeconds: GAMEPLAY.spawn.intervalSeconds,
};

const STORAGE_KEY = 'pirate-battle:options:v1';

export function validateOptions(options: GameOptions): OptionErrors {
  const errors: OptionErrors = {};
  const duration = OPTION_LIMITS.durationSeconds;
  const spawn = OPTION_LIMITS.spawnIntervalSeconds;

  const d = options.durationSeconds;
  if (!Number.isInteger(d) || d < duration.min || d > duration.max) {
    errors.durationSeconds = `Enter a whole number of seconds between ${duration.min} and ${duration.max}.`;
  }

  const s = options.spawnIntervalSeconds;
  if (!Number.isFinite(s) || s < spawn.min || s > spawn.max) {
    errors.spawnIntervalSeconds = `Enter a number of seconds between ${spawn.min} and ${spawn.max}.`;
  }

  return errors;
}

export function loadOptions(): GameOptions {
  const data = readJson(STORAGE_KEY);
  if (isGameOptions(data) && Object.keys(validateOptions(data)).length === 0) {
    return data;
  }
  return DEFAULT_OPTIONS;
}

export function saveOptions(options: GameOptions): boolean {
  return writeJson(STORAGE_KEY, options);
}

function isGameOptions(value: unknown): value is GameOptions {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.durationSeconds === 'number' &&
    typeof record.spawnIntervalSeconds === 'number'
  );
}