import { Container, Sprite } from "pixi.js";
import type { GameTextures, TextureKey } from "./textures";
import { TILE_SIZE, type Rect } from "../config/arena";

const ISLAND_LAYOUT: readonly (readonly TextureKey[])[] = [
  ['islandTopLeft', 'islandTop', 'islandTopRight'],
  ['islandLeft', 'islandCenter', 'islandRight'],
  ['islandBottomLeft', 'islandBottom', 'islandBottomRight'],
];

export class IslandView {
  private readonly container = new Container();

  constructor(parent: Container, textures: GameTextures, island: Rect) {
    ISLAND_LAYOUT.forEach((row, rowIndex) => {
      row.forEach((key, columnIndex) => {
        const tile = new Sprite(textures[key]);
        tile.position.set(columnIndex * TILE_SIZE, rowIndex * TILE_SIZE);
        this.container.addChild(tile);
      });
    });
    this.container.position.set(island.x, island.y);
    parent.addChild(this.container);
  }

  destroy(): void {
    this.container.destroy({ children: true });
  }

}