import type { MatchEndReason } from '../sim/types';
import { readJson, writeJson } from './storage';

export interface LastResult {
  score: number;
  elapsedSeconds: number;
  endReason: MatchEndReason;
  finishedAt: string;
}

const STORAGE_KEY = 'pirate-battle:last-result:v1';

export function loadLastResult(): LastResult | null {
  const data = readJson(STORAGE_KEY);
  return isLastResult(data) ? data : null;
}

export function saveLastResult(result: LastResult): boolean {
  return writeJson(STORAGE_KEY, result);
}

function isLastResult(value: unknown): value is LastResult {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.score === 'number' &&
    typeof record.elapsedSeconds === 'number' &&
    (record.endReason === 'time' || record.endReason === 'destroyed') &&
    typeof record.finishedAt === 'string'
  );
}