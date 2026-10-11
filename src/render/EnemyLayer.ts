import { Container, Texture } from "pixi.js";
import { ShipView } from "./ShipView";
import type { EnemyKind } from "../config/gameplay";
import type { EnemyState } from "../sim/types";

export class EnemyLayer {
  private readonly container = new Container();
  private readonly views = new Map<number, ShipView>();
  private readonly textures: Readonly<Record<EnemyKind, Texture>>
  private readonly rotationOffset: number;

  constructor(
    parent: Container,
    textures: Readonly<Record<EnemyKind, Texture>>,
    rotationOffset: number,
  ) {
    this.textures = textures;
    this.rotationOffset = rotationOffset;
    parent.addChild(this.container);
  }

  sync(enemies: readonly EnemyState[]): void {
    const alive = new Set<number>();
    for (const enemy of enemies) {
      let view = this.views.get(enemy.id);
      if (!view) {
        view = new ShipView(this.container, this.textures[enemy.kind], this.rotationOffset);
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