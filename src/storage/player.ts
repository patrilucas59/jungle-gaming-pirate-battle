import { readJson, writeJson } from "./storage";

export interface PlayerProfile {
  id: string;
  name: string;
}

const STORAGE_KEY = "pirate-battle:player:v1";

export function loadOrCreatePlayer(): PlayerProfile {
  const data = readJson(STORAGE_KEY);
  if (isPlayerProfile(data)) return data;
  const profile: PlayerProfile = { id: crypto.randomUUID(), name: 'You' };
  writeJson(STORAGE_KEY, profile);
  return profile;
}

function isPlayerProfile(value: unknown): value is PlayerProfile {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.id === 'string' && typeof record.name === 'string';
}