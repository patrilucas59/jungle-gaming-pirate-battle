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
import { buildHudSnapshot, hudChanged, type HudSnapshot } from './hud';
import { PAUSE_KEYS } from '../config/controls';

export interface GameSessionOptions {
  config: GameplayConfig;
  seed: number;
  onHudChange: (hud: HudSnapshot) => void;
}

export class GameSession {
  private readonly app: Application;
  private readonly config: GameplayConfig;
  private readonly state: WorldState;
  private readonly loop: FixedStepLoop;
  private readonly keyboard = new KeyboardInput(window);
  private readonly onHudChange: (hud: HudSnapshot) => void;
  private readonly islandViews: IslandView[];
  private readonly enemyLayer: EnemyLayer;
  private readonly playerView: ShipView;
  private readonly projectileLayer: ProjectileLayer;
  private paused = false;
  private lastHud: HudSnapshot | null = null;

  constructor(
    app: Application, 
    layer: Container, 
    textures: GameTextures,
    options: GameSessionOptions,
  ) {
    this.app = app;
    this.config = structuredClone(options.config);
    this.state = createWorld(this.config, options.seed);
    this.onHudChange = options.onHudChange;

    this.islandViews = ISLANDS.map((island) => new IslandView(layer, textures, island));
    this.enemyLayer = new EnemyLayer(
      layer,
      { 
        chaser: { texture: textures.enemyChaser, maxHealth: this.config.enemies.chaser.maxHealth },
        shooter: { texture: textures.enemyShooter, maxHealth: this.config.enemies.shooter.maxHealth },
      },
      SHIP_SPRITE_ROTATION_OFFSET,
    );
    this.playerView = new ShipView(
          layer,
          textures.playerShip,
          SHIP_SPRITE_ROTATION_OFFSET,
          this.config.player.maxHealth,
        );
        this.projectileLayer = new ProjectileLayer(layer, textures.cannonBall);
        this.syncViews();

    this.loop = new FixedStepLoop({
      stepSeconds: SIMULATION.stepSeconds,
      maxFrameSeconds: SIMULATION.maxFrameSeconds,
      step: (dt) => this.update(dt),
    });
    this.app.ticker.add(this.onTick);
    this.keyboard.attach();
    window.addEventListener('keydown', this.onPauseKey);
    window.addEventListener('blur', this.onFocusLost);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    this.publishHud();
  }

  get world(): Readonly<WorldState> {
    return this.state;
  }

  pause(): void {
    if (this.paused || this.state.match.endReason) return;
    this.paused = true;
    this.loop.setPaused(true);
    this.publishHud();
  }

  resume(): void {
    if (!this.paused) return;
    this.paused = false;
    this.loop.setPaused(false);
    this.publishHud();
  }

  destroy(): void {
    this.app.ticker.remove(this.onTick);
    this.keyboard.detach();
    window.removeEventListener('keydown', this.onPauseKey);
    window.removeEventListener('blur', this.onFocusLost);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.projectileLayer.destroy();
    this.playerView.destroy();
    this.enemyLayer.destroy();
    for (const view of this.islandViews) view.destroy();
  }

  private readonly onTick = (ticker: Ticker): void => {
    this.loop.advance(ticker.elapsedMS / 1000);
    this.syncViews();
    this.publishHud();
  };

  private readonly onPauseKey = (event: KeyboardEvent): void => {
    if (event.repeat || !PAUSE_KEYS.includes(event.code)) return;
    event.preventDefault();
    if (this.paused) this.resume();
    else this.pause();
  };

  private readonly onFocusLost = (): void => {
    this.pause();
  };

  private readonly onVisibilityChange = (): void => {
    if (document.hidden) this.pause();
  };

  private syncViews(): void {
    this.playerView.sync(this.state.player);
    this.enemyLayer.sync(this.state.enemies);
    this.projectileLayer.sync(this.state.projectiles);
  }

  private publishHud(): void {
    const hud = buildHudSnapshot(this.state, this.config, this.paused);
    if (hudChanged(this.lastHud, hud)) {
      this.lastHud = hud;
      this.onHudChange(hud);
    }
  }

  private update(dt: number): void {
    stepWorld(this.state, this.keyboard.read(), dt, this.config);
  }
}