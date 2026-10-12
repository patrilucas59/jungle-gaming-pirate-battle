import type { MatchEndReason } from "../sim/types";

export interface MatchSettings {
  durationSeconds: number;
  spawnIntervalSeconds: number;
}

export interface MatchRecord {
  matchId: string;
  playerId: string;
  playerName: string;
  playedAt: string;
  score: number;
  durationSeconds: number;
  endReason: MatchEndReason;
  settings: MatchSettings;
}

export interface RankingEntry extends MatchRecord {
  rank: number;
}

export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export type SubmitStatus = 'saving' | 'saved' | 'failed';

export const PAGE_SIZE = 5;