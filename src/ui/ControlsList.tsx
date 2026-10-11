import { CONTROL_HINTS } from '../config/controls';

export function ControlsList() {
  return (
    <dl className="controls-list">
      {CONTROL_HINTS.map((hint) => (
        <div key={hint.action}>
          <dt>{hint.action}</dt>
          <dd>
            <kbd>{hint.keys}</kbd>
          </dd>
        </div>
      ))}
    </dl>
  );
}