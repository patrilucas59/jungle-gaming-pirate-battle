import { Container, Texture } from "pixi.js";
import { ShipView } from "./ShipView";
import type { EnemyKind } from "../config/gameplay";
import type { EnemyState } from "../sim/types";

export interface EnemyVisual {
  texture: Texture;
  maxHealth: number;
}

export class EnemyLayer {
  private readonly container = new Container();
  private readonly views = new Map<number, ShipView>();
  private readonly visuals: Readonly<Record<EnemyKind, EnemyVisual>>;
  private readonly rotationOffset: number;

  constructor(
    parent: Container,
    visuals: Readonly<Record<EnemyKind, EnemyVisual>>,
    rotationOffset: number,
  ) {
    this.visuals = visuals;
    this.rotationOffset = rotationOffset;
    parent.addChild(this.container);
  }

  sync(enemies: readonly EnemyState[]): void {
    const alive = new Set<number>();
    for (const enemy of enemies) {
      let view = this.views.get(enemy.id);
      if (!view) {
        const visual = this.visuals[enemy.kind];
        view = new ShipView(this.container, visual.texture, this.rotationOffset, visual.maxHealth);
        this.views.set(enemy.id, view);
      }
      view.sync(enemy);
      alive.add(enemy.id);
    }

    for (const [id, view] of this.views) {
      if (!alive.has(id)) {
        view.destroy();
        this.views.delete(id);
      }
    }
  }

  destroy(): void {
    this.views.clear();
    this.container.destroy({ children: true });
  }
}