import type { Application, Ticker } from "pixi.js";
import { FixedStepLoop } from "./FixedStepLoop";
import { SIMULATION } from "../config/simulation";
import { KeyboardInput } from "../input/KeyboardInput";

export class GameSession {
  private readonly app: Application;
  private readonly loop: FixedStepLoop;
  private activeSeconds = 0;
  private readonly keyboard = new KeyboardInput(window);

  constructor(app: Application) {
    this.app = app;
    this.loop = new FixedStepLoop({
        stepSeconds: SIMULATION.stepSeconds,
        maxFrameSeconds: SIMULATION.maxFrameSeconds,
        step: (dt) => this.update(dt),
    });
    this.app.ticker.add(this.onTick);
    this.keyboard.attach();
  }

  get activeTimeSeconds(): number {
    return this.activeSeconds;
  }

  destroy(): void {
    this.app.ticker.remove(this.onTick);
    this.keyboard.detach();
  }

  private readonly onTick = (ticker: Ticker): void => {
    this.loop.advance(ticker.elapsedMS / 1000);
  };

  private update(dt: number): void {
    this.activeSeconds += dt;
  }
}