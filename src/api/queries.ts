import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchHistory, fetchRanking, registerMatch } from './client';
import type { MatchSettings } from './contracts';

export function useRanking(page: number, settings: MatchSettings) {
  return useQuery({
    queryKey: ['ranking', settings.durationSeconds, settings.spawnIntervalSeconds, page],
    queryFn: ({ signal }) => fetchRanking(page, settings, signal),
    placeholderData: keepPreviousData,
    retry: 1,
  });
}

export function useHistory(playerId: string, page: number) {
  return useQuery({
    queryKey: ['history', playerId, page],
    queryFn: ({ signal }) => fetchHistory(playerId, page, signal),
    placeholderData: keepPreviousData,
    retry: 1,
  });
}

export function useRegisterMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerMatch,
    retry: 1,
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['ranking'] }),
        queryClient.invalidateQueries({ queryKey: ['history'] }),
      ]);
    },
  });
}