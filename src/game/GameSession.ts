import type { Application, Container, Ticker } from "pixi.js";
import { FixedStepLoop } from "./FixedStepLoop";
import { SIMULATION } from "../config/simulation";
import { KeyboardInput } from "../input/KeyboardInput";
import type { WorldState } from "../sim/types";
import { createWorld } from "../sim/createWorld";
import { ShipView } from "../render/ShipView";
import type { GameTextures } from "../render/textures";
import { SHIP_SPRITE_ROTATION_OFFSET } from "../render/orientation";
import { GAMEPLAY } from "../config/gameplay";
import { updatePlayerMovement } from "../sim/playerMovement";

export class GameSession {
  private readonly app: Application;
  private readonly loop: FixedStepLoop;
  private readonly keyboard = new KeyboardInput(window);
  private readonly state: WorldState = createWorld();
  private readonly playerView: ShipView;
  private activeSeconds = 0;

  constructor(app: Application, layer: Container, textures: GameTextures) {
    this.app = app;
    this.playerView = new ShipView(
      layer,
      textures.playerShip,
      SHIP_SPRITE_ROTATION_OFFSET,
    );
    this.playerView.sync(this.state.player);
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
    this.playerView.destroy();
  }

  private readonly onTick = (ticker: Ticker): void => {
    this.loop.advance(ticker.elapsedMS / 1000);
    this.playerView.sync(this.state.player);
  };

  private update(dt: number): void {
    const intents = this.keyboard.read();
    updatePlayerMovement(this.state.player, intents, dt, GAMEPLAY.player);
    this.activeSeconds += dt;
  }
}