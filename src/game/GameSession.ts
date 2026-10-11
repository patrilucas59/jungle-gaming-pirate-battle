import type { Application, Container, Ticker } from 'pixi.js';
import { ISLANDS } from '../config/arena';
import type { GameplayConfig } from '../config/gameplay';
import { SIMULATION } from '../config/simulation';
import { KeyboardInput } from '../input/KeyboardInput';
import { EnemyLayer } from '../render/EnemyLayer';
import { IslandView } from '../render/IslandView';
import { SHIP_SPRITE_ROTATION_OFFSET } from '../render/orientation';
import { ProjectileLayer } from '../render/ProjectileLayer';
import { ShipView } from '../render/ShipView';
import type { GameTextures } from '../render/textures';
import { createWorld } from '../sim/createWorld';
import { stepWorld } from '../sim/stepWorld';
import type { WorldState } from '../sim/types';
import { FixedStepLoop } from './FixedStepLoop';

export class GameSession {
  private readonly app: Application;
  private readonly config: GameplayConfig;
  private readonly state: WorldState;
  private readonly loop: FixedStepLoop;
  private readonly keyboard = new KeyboardInput(window);
  private readonly islandViews: IslandView[];
  private readonly enemyLayer: EnemyLayer;
  private readonly playerView: ShipView;
  private readonly projectileLayer: ProjectileLayer;

  constructor(app: Application, layer: Container, textures: GameTextures, config: GameplayConfig, seed: number,
  ) {
    this.app = app;
    this.config = structuredClone(config);
    this.state = createWorld(this.config, seed);

    this.islandViews = ISLANDS.map((island) => new IslandView(layer, textures, island));
    this.enemyLayer = new EnemyLayer(
      layer,
      { chaser: textures.enemyChaser, shooter: textures.enemyShooter },
      SHIP_SPRITE_ROTATION_OFFSET,
    );
    this.playerView = new ShipView(layer, textures.playerShip, SHIP_SPRITE_ROTATION_OFFSET);
    this.projectileLayer = new ProjectileLayer(layer, textures.cannonBall);
    this.syncViews();

    this.loop = new FixedStepLoop({
      stepSeconds: SIMULATION.stepSeconds,
      maxFrameSeconds: SIMULATION.maxFrameSeconds,
      step: (dt) => this.update(dt),
    });
    this.app.ticker.add(this.onTick);
    this.keyboard.attach();
  }

  get world(): Readonly<WorldState> {
    return this.state;
  }

  destroy(): void {
    this.app.ticker.remove(this.onTick);
    this.keyboard.detach();
    this.projectileLayer.destroy();
    this.playerView.destroy();
    this.enemyLayer.destroy();
    for (const view of this.islandViews) view.destroy();
  }

  private readonly onTick = (ticker: Ticker): void => {
    this.loop.advance(ticker.elapsedMS / 1000);
    this.syncViews();
  };

  private syncViews(): void {
    this.playerView.sync(this.state.player);
    this.enemyLayer.sync(this.state.enemies);
    this.projectileLayer.sync(this.state.projectiles);
  }

  private update(dt: number): void {
    stepWorld(this.state, this.keyboard.read(), dt, this.config);
  }
}