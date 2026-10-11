import type { HudSnapshot } from "../game/hud";
import { formatSeconds } from "./format";

interface HudProps {
  hud: HudSnapshot;
}

export function Hud({ hud }: HudProps) {
  return (
    <section className="hud" aria-label="Match status">
      <dl className="hud__stats">
        <div>
          <dt>Health</dt>
          <dd>
            {hud.health} / {hud.maxHealth}
          </dd>
        </div>
        <div>
          <dt>Score</dt>
          <dd>{hud.score}</dd>
        </div>
        <div>
          <dt>Time left</dt>
          <dd>{formatSeconds(hud.remainingSeconds)}</dd>
        </div>
      </dl>
      <p className="hud__hint">Press ESC or P to PAUSE</p>
    </section>
  )
}