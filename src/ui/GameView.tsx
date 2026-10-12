import { useCallback, useEffect, useMemo, useState } from "react";
import { loadGameTextures, type GameTextures } from "../render/textures";
import { MatchScreen } from "./MatchScreen";
import { loadOptions, saveOptions, type GameOptions } from "../storage/options";
import { loadLastResult, saveLastResult, type LastResult } from "../storage/lastResults";
import { buildMatchConfig } from "../game/matchConfig";
import type { HudSnapshot } from "../game/hud";
import { MainMenu } from "./MainMenu";
import { OptionsScreen } from "./OptionsScreen";
import { loadOrCreatePlayer } from "../storage/player";
import type { MatchRecord, SubmitStatus } from "../api/contracts";
import { addPendingMatch, clearPendingMatches, loadPendingMatches, removePendingMatch } from "../storage/pendingMatches";
import { useRegisterMatch } from "../api/queries";
import type { GameplayConfig } from "../config/gameplay";

type LoadState = 
  | { phase: 'loading'; progress: number } 
  | { phase: 'error' } 
  | { phase: 'ready'; textures: GameTextures };

type Screen = "menu" | "options" | "match";

export function GameView() {
  const [attempt, setAttempt] = useState(0);
  const [load, setLoad] = useState<LoadState>({ phase: 'loading', progress: 0 });
  const [screen, setScreen] = useState<Screen>('menu');
  const [matchKey, setMatchKey] = useState(0);
  const [options, setOptions] = useState<GameOptions>(loadOptions);
  const [lastResult, setLastResult] = useState<LastResult | null>(loadLastResult);
  const [player] = useState(loadOrCreatePlayer);
  const [pending, setPending] = useState<MatchRecord[]>(loadPendingMatches);
  const [statuses, setStatuses] = useState<Record<string, SubmitStatus>>({});
  const [lastMatchId, setLastMatchId] = useState<string | null>(null);
  const { mutateAsync: register } = useRegisterMatch();
  const config = useMemo(() => buildMatchConfig(options), [options]);

  useEffect(() => {
    let cancelled = false;
    loadGameTextures((progress) => {
      if (!cancelled) setLoad({ phase: 'loading', progress });
    })
      .then((textures) => {
        if (!cancelled) setLoad({ phase: 'ready', textures });
      })
      .catch(() => {
        if (!cancelled) setLoad({ phase: 'error' });
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const submit = useCallback(
    async (record: MatchRecord) => {
      setStatuses((current) => ({ ...current, [record.matchId]: 'saving' }));
      try {
        await register(record);
        setPending(removePendingMatch(record.matchId));
        setStatuses((current) => ({ ...current, [record.matchId]: 'saved' }));
      } catch {
        setStatuses((current) => ({ ...current, [record.matchId]: 'failed' }));
      }
    },
    [register],
  );

  const handleMatchEnd = useCallback(
    (hud: HudSnapshot, matchConfig: GameplayConfig) => {
      if (!hud.endReason) return;
      const result: LastResult = {
        score: hud.score,
        elapsedSeconds: hud.elapsedSeconds,
        endReason: hud.endReason,
        finishedAt: new Date().toISOString(),
      };
      saveLastResult(result);
      setLastResult(result);

      const record: MatchRecord = {
        matchId: crypto.randomUUID(),
        playerId: player.id,
        playerName: player.name,
        playedAt: result.finishedAt,
        score: hud.score,
        durationSeconds: hud.elapsedSeconds,
        endReason: hud.endReason,
        settings: {
          durationSeconds: matchConfig.match.durationSeconds,
          spawnIntervalSeconds: matchConfig.spawn.intervalSeconds,
        },
      };
      setPending(addPendingMatch(record));
      setLastMatchId(record.matchId);
      void submit(record);
    },
    [player, submit],
  );

  const retryLastMatch = () => {
    const record = pending.find((item) => item.matchId === lastMatchId);
    if (record) void submit(record);
  };

  const retryPending = () => {
    for (const record of pending) void submit(record);
  };

  const resetMocks = () => {
    clearPendingMatches();
    setPending([]);
    setStatuses({});
  };

  const retry = () => {
    setLoad({ phase: 'loading', progress: 0 });
    setAttempt((n) => n + 1);
  };

  const startMatch = () => {
    setMatchKey((key) => key + 1);
    setScreen('match');
  };

  const handleSaveOptions = (next: GameOptions) => {
    saveOptions(next);
    setOptions(next);
  };

  return (
    <div className="game-view">
      {load.phase === 'loading' && (
        <div className="game-view__overlay">
          <p role="status">Loading assets…</p>
          <progress max={1} value={load.progress} aria-label="Asset loading progress" />
        </div>
      )}
      {load.phase === 'error' && (
        <div className="game-view__overlay">
          <p role="alert">Some game assets could not be loaded.</p>
          <button type="button" onClick={retry} autoFocus>
            Retry
          </button>
        </div>
      )}
      {load.phase === 'ready' && screen === 'menu' && (
        <MainMenu
          lastResult={lastResult}
          playerId={player.id}
          settings={options}
          pendingCount={pending.length}
          onPlay={startMatch}
          onOptions={() => setScreen('options')}
          onRetryPending={retryPending}
          onResetMocks={resetMocks}
        />
      )}
      {load.phase === 'ready' && screen === 'options' && (
        <OptionsScreen
          options={options}
          onSave={handleSaveOptions}
          onBack={() => setScreen('menu')}
        />
      )}
      {load.phase === 'ready' && screen === 'match' && (
        <MatchScreen
          key={matchKey}
          textures={load.textures}
          config={config}
          registrationStatus={lastMatchId ? statuses[lastMatchId] : undefined}
          onRetryRegistration={retryLastMatch}
          onPlayAgain={startMatch}
          onMainMenu={() => setScreen('menu')}
          onMatchEnd={handleMatchEnd}
        />
      )}
    </div>
  );
}