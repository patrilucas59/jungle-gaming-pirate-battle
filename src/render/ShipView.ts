import { Sprite, type Container, type Texture } from "pixi.js";
import type { ShipState } from "../sim/types";

export class ShipView {
  private readonly sprite: Sprite;
  private readonly rotationOffset: number;

  constructor(parent: Container, texture: Texture, rotationOffset: number) {
    this.sprite = new Sprite({ texture, anchor: 0.5 });
    this.rotationOffset = rotationOffset;
    parent.addChild(this.sprite);
  }

  sync(state: ShipState): void {
    this.sprite.position.set(state.x, state.y);
    this.sprite.rotation = state.angle + this.rotationOffset;
  }

  destroy(): void {
    this.sprite.destroy();
  }
}