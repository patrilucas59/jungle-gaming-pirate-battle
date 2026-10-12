import type { MatchRecord, MatchSettings } from '../api/contracts';
import { GAMEPLAY } from '../config/gameplay';

const CAPTAINS = [
  'Jewerly Bonnie',
  'Blackbeard',
  'Eustass Kid',
  'Trafalgar D. Water Law',
  'Dies Drake',
  "Capone Bege",
  'Roronoa Zoro',
  'Monkey D. Luffy',
];

const DEFAULT_SETTINGS: MatchSettings = {
  durationSeconds: GAMEPLAY.match.durationSeconds,
  spawnIntervalSeconds: GAMEPLAY.spawn.intervalSeconds,
};

const OTHER_SETTINGS: MatchSettings = { durationSeconds: 120, spawnIntervalSeconds: 3 };

export const FIXTURE_MATCHES: readonly MatchRecord[] = Array.from({ length: 16 }, (_, index) => {
  const settings = index < 13 ? DEFAULT_SETTINGS : OTHER_SETTINGS;
  const destroyed = index % 3 === 0;
  return {
    matchId: `fixture-${index + 1}`,
    playerId: `fixture-player-${index % CAPTAINS.length}`,
    playerName: CAPTAINS[index % CAPTAINS.length],
    playedAt: new Date(Date.UTC(2026, 9, 1 + (index % 9), 12, index)).toISOString(),
    score: 4 + ((index * 7) % 17),
    durationSeconds: destroyed ? 30 + index * 3 : settings.durationSeconds,
    endReason: destroyed ? 'destroyed' : 'time',
    settings,
  };
});