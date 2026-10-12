import type { MatchSettings } from "../api/contracts";
import type { LastResult } from "../storage/lastResults";
import { ControlsList } from "./ControlsList";
import { formatSeconds } from "./format";
import { END_REASON_LABEL } from "./labels";
import { LeaderboardTabs } from "./LeaderboardTabs";
import { NetworkScenarioPanel } from "./NetworkScenarioPanel";

interface MainMenuProps {
  lastResult: LastResult | null;
  playerId: string;
  settings: MatchSettings;
  pendingCount: number;
  onPlay: () => void;
  onOptions: () => void;
  onRetryPending: () => void;
  onResetMocks: () => void;
}

export function MainMenu({lastResult, playerId, settings, pendingCount, onPlay, onOptions, onRetryPending, onResetMocks,}: MainMenuProps) {
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

      {pendingCount > 0 && (
        <section className="menu__panel" role="status">
          <p>
            {pendingCount} {pendingCount === 1 ? 'match is' : 'matches are'} waiting to be saved.
          </p>
          <button type="button" onClick={onRetryPending}>
            Try again
          </button>
        </section>
      )}

      <LeaderboardTabs playerId={playerId} settings={settings} />

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

      <NetworkScenarioPanel onReset={onResetMocks} />
    </main>
  );
}