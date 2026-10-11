import { Graphics, Sprite, type Container, type Texture } from "pixi.js";
import type { ShipState } from "../sim/types";

const BAR_WIDTH = 48;
const BAR_HEIGHT = 6;
const BAR_OFFSET_Y = 66;

export class ShipView {
  private readonly sprite: Sprite;
  private readonly healthBar = new Graphics();
  private readonly rotationOffset: number;
  private readonly maxHealth: number;
  private lastRatio = -1;

  constructor(
    parent: Container, 
    texture: Texture, 
    rotationOffset: number,
    maxHealth: number,
  ) {
    this.sprite = new Sprite({ texture, anchor: 0.5 });
    this.rotationOffset = rotationOffset;
    this.maxHealth = maxHealth;
    parent.addChild(this.sprite, this.healthBar);
  }

  sync(state: ShipState): void {
    this.sprite.position.set(state.x, state.y);
    this.sprite.rotation = state.angle + this.rotationOffset;
    this.healthBar.position.set(state.x - BAR_WIDTH / 2, state.y - BAR_OFFSET_Y);

    const ratio = Math.min(Math.max(state.health / this.maxHealth, 0), 1);
    if (ratio !== this.lastRatio) {
      this.drawHealthBar(ratio);
      this.lastRatio = ratio;
    }
  }

  destroy(): void {
    this.sprite.destroy();
    this.healthBar.destroy();
  }

  private drawHealthBar(ratio: number): void {
    let color = 0x4caf50;
    if (ratio <= 0.25) color = 0xe53935;
    else if (ratio <= 0.5) color = 0xf4c430;

    this.healthBar.clear();
    this.healthBar.rect(0, 0, BAR_WIDTH, BAR_HEIGHT).fill(0x1b1b1b);
    this.healthBar.rect(1, 1, (BAR_WIDTH - 2) * ratio, BAR_HEIGHT - 2).fill(color);
  }
}