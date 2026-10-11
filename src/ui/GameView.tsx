import { useEffect, useState } from "react";
import { loadGameTextures, type GameTextures } from "../render/textures";
import { MatchScreen } from "./MatchScreen";

type LoadState = 
  | { phase: 'loading'; progress: number } 
  | { phase: 'error' } 
  | { phase: 'ready'; textures: GameTextures };


export function GameView() {
  const [attempt, setAttempt] = useState(0);
  const [matchKey, setMatchKey] = useState(0);
  const [load, setLoad] = useState<LoadState>({ phase: 'loading', progress: 0 });

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
      {load.phase === 'ready' && (
        <MatchScreen
          key={matchKey}
          textures={load.textures}
          onPlayAgain={() => setMatchKey((key) => key + 1)}
        />
      )}
    </div>
  );
}