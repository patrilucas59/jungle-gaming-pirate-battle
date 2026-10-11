import type { HudSnapshot } from "../game/hud";
import type { MatchEndReason } from "../sim/types";
import { formatSeconds } from "./format";


const END_REASON_LABEL: Record<MatchEndReason, string> = {
  time: 'Time is up',
  destroyed: 'Your ship was destroyed',
};

interface ResultDialogProps {
  hud: HudSnapshot;
  onPlayAgain: () => void;
}

export function ResultDialog({ hud, onPlayAgain }: ResultDialogProps) {
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
        <button type="button" onClick={onPlayAgain} autoFocus>
          Play again
        </button>
      </div>
    </div>
  );
}