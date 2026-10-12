import { ControlsList } from "./ControlsList";

interface PauseDialogProps {
  onResume: () => void;
  onQuit: () => void;
}

export function PauseDialog({ onResume, onQuit }: PauseDialogProps) {
  return (
    <div className="dialog-backdrop">
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="pause-title">
        <h2 id="pause-title">Paused</h2>
        <ControlsList />
        <div className="dialog__actions">
          <button type="button" onClick={onResume} autoFocus>
            Resume
          </button>
          <button type="button" className="button--secondary" onClick={onQuit}>
            Quit to menu
          </button>
        </div>
      </div>
    </div>
  );
}