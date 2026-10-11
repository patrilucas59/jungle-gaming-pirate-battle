import { Container, Sprite, Texture } from "pixi.js";
import type { ProjectileState } from "../sim/types";

export class ProjectileLayer {
  private readonly container = new Container();
  private readonly sprites = new Map<number, Sprite>();
  private readonly texture: Texture;

  constructor(parent: Container, texture: Texture) {
    this.texture = texture;
    parent.addChild(this.container);
  }

  sync(projectiles: readonly ProjectileState[]): void {
    const alive = new Set<number>();
    for (const projectile of projectiles) {
      let sprite = this.sprites.get(projectile.id);
      if (!sprite) {
        sprite = new Sprite({ texture: this.texture, anchor: 0.5 });
        this.container.addChild(sprite);
        this.sprites.set(projectile.id, sprite);
      }
      sprite.position.set(projectile.x, projectile.y);
      alive.add(projectile.id);
  }

  for (const [id, sprite] of this.sprites) {
    if (!alive.has(id)) {
      sprite.destroy();
      this.sprites.delete(id);
    }
  }
}

  destroy(): void {
    this.sprites.clear();
    this.container.destroy({ children: true });
  }
}