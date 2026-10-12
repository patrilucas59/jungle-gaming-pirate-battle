import type { MatchRecord } from "../api/contracts";
import { readJson, removeKey, writeJson } from "./storage";

const STORAGE_KEY = 'pirate-battle:pending-matches:v1';

export function loadPendingMatches(): MatchRecord[] {
  const data = readJson(STORAGE_KEY);
  return Array.isArray(data) ? (data as MatchRecord[]) : [];
}

export function addPendingMatch(record: MatchRecord): MatchRecord[] {
  const list = loadPendingMatches().filter((item) => item.matchId !== record.matchId);
  list.push(record);
  writeJson(STORAGE_KEY, list);
  return list;
}

export function removePendingMatch(matchId: string): MatchRecord[] {
  const list = loadPendingMatches().filter((item) => item.matchId !== matchId);
  writeJson(STORAGE_KEY, list);
  return list;
}

export function clearPendingMatches(): void {
  removeKey(STORAGE_KEY);
}