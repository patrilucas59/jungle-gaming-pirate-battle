import { ProjectileLayer } from './../render/ProjectileLayer';
import { IslandView } from './../render/IslandView';
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
import { stepWorld  } from "../sim/stepWorld";
import { ISLANDS } from '../config/arena';

export class GameSession {
  private readonly app: Application;
  private readonly loop: FixedStepLoop;
  private readonly keyboard = new KeyboardInput(window);
  private readonly state: WorldState = createWorld();
  private readonly playerView: ShipView;
  private activeSeconds = 0;
  private readonly islandViews: IslandView[];
  private readonly projectileLayer: ProjectileLayer;

  constructor(app: Application, layer: Container, textures: GameTextures) {
    this.app = app;
    this.islandViews = ISLANDS.map(
    (island) => new IslandView(layer, textures, island),
    );
    this.playerView = new ShipView(
      layer,
      textures.playerShip,
      SHIP_SPRITE_ROTATION_OFFSET,
    );
    this.playerView.sync(this.state.player);
    this.projectileLayer = new ProjectileLayer(layer, textures.cannonBall);
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
    this.projectileLayer.destroy();
    for (const view of this.islandViews) view.destroy();
  }

  private readonly onTick = (ticker: Ticker): void => {
    this.loop.advance(ticker.elapsedMS / 1000);
    this.playerView.sync(this.state.player);
    this.projectileLayer.sync(this.state.projectiles);
  };

  private update(dt: number): void {
    const intents = this.keyboard.read();
    stepWorld(this.state, intents, dt, GAMEPLAY);
    this.activeSeconds += dt;
  }
}