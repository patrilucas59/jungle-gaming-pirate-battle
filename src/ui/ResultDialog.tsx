import type { HudSnapshot } from "../game/hud";
import { formatSeconds } from "./format";
import { END_REASON_LABEL } from "./labels";

interface ResultDialogProps {
  hud: HudSnapshot;
  onPlayAgain: () => void;
  onMainMenu: () => void;
 }

export function ResultDialog({ hud, onPlayAgain, onMainMenu }: ResultDialogProps) {
  return (
    <div className="dialog-backdrop">
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="result-title">
        <h2 id="result-title">Match over</h2>
        <dl className="dialog__stats">
          <dt>Score</dt>
          <dd>{hud.score}</dd>
          <dt>Time played</dt>
          <dd>{formatSeconds(hud.elapsedSeconds)}</dd>
          <dt>Reason</dt>
          <dd>{hud.endReason ? END_REASON_LABEL[hud.endReason] : ''}</dd>
        </dl>
        <div className="dialog__actions">
          <button type="button" onClick={onPlayAgain} autoFocus>
            Play again
          </button>
          <button type="button" className="button--secondary" onClick={onMainMenu}>
            Main menu
          </button>
        </div>
      </div>
    </div>
  );
}