import type { MatchRecord, Page } from "../api/contracts";
import { readJson, removeKey, writeJson } from "../storage/storage";
import { FIXTURE_MATCHES } from "./fixtures";
import { setScenario } from "./scenarios";

const STORAGE_KEY = 'pirate-battle:mock-db:v1';

function loadStored(): MatchRecord[] {
  const data = readJson(STORAGE_KEY);
  return Array.isArray(data) ? (data as MatchRecord[]) : [];
}

export function allMatches(): MatchRecord[] {
  return [
    ...FIXTURE_MATCHES, 
    ...loadStored()
  ];
}

export function findMatch(matchId: string): MatchRecord | undefined {
  return allMatches().find((match) => match.matchId === matchId);
}

export function insertMatch(record: MatchRecord): void {
  const stored = loadStored();
  stored.push(record);
  writeJson(STORAGE_KEY, stored);
}

export function resetMockState(): void {
  removeKey(STORAGE_KEY);
  setScenario('success');
}

export function compareRanking(a: MatchRecord, b: MatchRecord): number {
  if (a.score !== b.score) return b.score - a.score;
  if (a.durationSeconds !== b.durationSeconds) return b.durationSeconds - a.durationSeconds;
  if (a.playedAt !== b.playedAt) return a.playedAt < b.playedAt ? -1 : 1;
  return a.matchId < b.matchId ? -1 : 1;
}

export function paginate<T>(items: T[], page: number, pageSize: number): Page<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
  };
}