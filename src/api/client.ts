import axios from "axios";
import { PAGE_SIZE, type MatchRecord, type MatchSettings, type Page, type RankingEntry } from "./contracts";

export const apiClient = axios.create({
  baseURL: `${import.meta.env.BASE_URL}api`,
  timeout: 5000,
});

export async function fetchRanking(
  page: number,
  settings: MatchSettings,
  signal?: AbortSignal,
): Promise<Page<RankingEntry>> {
  const { data } = await apiClient.get<Page<RankingEntry>>('/ranking', {
    params: { page, pageSize: PAGE_SIZE, ...settings },
    signal,
  });
  return data;
}

export async function fetchHistory(
  playerId: string,
  page: number,
  signal?: AbortSignal,
): Promise<Page<MatchRecord>> {
  const { data } = await apiClient.get<Page<MatchRecord>>(
    `/players/${encodeURIComponent(playerId)}/matches`,
    { params: { page, pageSize: PAGE_SIZE }, signal },
  );
  return data;
}

export async function registerMatch(record: MatchRecord): Promise<MatchRecord> {
  const { data } = await apiClient.put<MatchRecord>(
    `/matches/${encodeURIComponent(record.matchId)}`,
    record,
  );
  return data;
}