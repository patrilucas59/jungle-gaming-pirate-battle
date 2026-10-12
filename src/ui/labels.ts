import type { MatchEndReason } from '../sim/types';

export const END_REASON_LABEL: Record<MatchEndReason, string> = {
  time: 'Time is up',
  destroyed: 'Your ship was destroyed',
};