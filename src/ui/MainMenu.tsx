import type { LastResult } from "../storage/lastResults";
import { ControlsList } from "./ControlsList";
import { formatSeconds } from "./format";
import { END_REASON_LABEL } from "./labels";

interface MainMenusProps {
  lastResult: LastResult | null;
  onPlay: () => void;
  onOptions: () => void;
}

export function MainMenu({ lastResult, onPlay, onOptions }: MainMenusProps) {
  return (
    <main className="menu">
      <h1 className="menu__title">All Blue Pirate Battle</h1>
      <nav className="menu__actions" aria-label="Main menu">
        <button type="button" onClick={onPlay} autoFocus>
          Play
        </button>
        <button type="button" className="button--secondary" onClick={onOptions}>
          Options
        </button>
      </nav>

      <section className="menu__panel" aria-labelledby="controls-title">
        <h2 id="controls-title">Controls</h2>
        <ControlsList />
      </section>

      {lastResult && (
        <section className="menu__panel" aria-labelledby="last-match-title">
          <h2 id="last-match-title">Last match</h2>
          <dl className="dialog__stats">
            <dt>Score</dt>
            <dd>{lastResult.score}</dd>
            <dt>Time played</dt>
            <dd>{formatSeconds(lastResult.elapsedSeconds)}</dd>
            <dt>Reason</dt>
            <dd>{END_REASON_LABEL[lastResult.endReason]}</dd>
          </dl>
        </section>
      )}
    </main>
  );
}