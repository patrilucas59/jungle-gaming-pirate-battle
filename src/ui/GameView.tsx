import { useCallback, useEffect, useMemo, useState } from "react";
import { loadGameTextures, type GameTextures } from "../render/textures";
import { MatchScreen } from "./MatchScreen";
import { loadOptions, saveOptions, type GameOptions } from "../storage/options";
import { loadLastResult, saveLastResult, type LastResult } from "../storage/lastResults";
import { buildMatchConfig } from "../game/matchConfig";
import type { HudSnapshot } from "../game/hud";
import { MainMenu } from "./MainMenu";
import { OptionsScreen } from "./OptionsScreen";

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

  const retry = () => {
    setLoad({ phase: 'loading', progress: 0 });
    setAttempt((n) => n + 1);
  }

  const startMatch = () => {
    setMatchKey((key) => key + 1)
    setScreen("match");
  };

  const handleSaveOptions = (next: GameOptions) => {
    saveOptions(next);
    setOptions(next);
  };

  const handleMatchEnd = useCallback((hud: HudSnapshot) => {
    if (!hud.endReason) return;
    const result: LastResult = {
      score: hud.score,
      elapsedSeconds: hud.elapsedSeconds,
      endReason: hud.endReason,
      finishedAt: new Date().toISOString(),
    };
    saveLastResult(result);
    setLastResult(result);
  }, []);

  return (
    <div className="game-view">
      {load.phase === 'loading' && (
        <div className="game-view__overlay">
          <p role="status">Loading...</p>
          <progress 
            max={1}
            value={load.progress}
            aria-label="Asset loading progress"
          />
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
          onPlay={startMatch}
          onOptions={() => setScreen('options')}
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
          onPlayAgain={startMatch}
          onMainMenu={() => setScreen('menu')}
          onMatchEnd={handleMatchEnd}
        />
      )}
    </div>
  );
}