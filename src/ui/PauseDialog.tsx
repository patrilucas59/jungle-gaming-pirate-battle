import { ControlsList } from "./ControlsList";

interface PauseDialogProps {
  onResume: () => void;
}

export function PauseDialog({ onResume }: PauseDialogProps) {
  return (
    <div className="dialog-backdrop">
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="pause-title">
        <h2 id="pause-title">Paused</h2>
        <ControlsList />
        <button type="button" onClick={onResume} autoFocus>
          Resume
        </button>
      </div>
    </div>
  );
}