import { Assets, type Texture } from 'pixi.js'

const TEXTURE_ROOT = `${import.meta.env.BASE_URL}assets/png/default`;

export const TEXTURE_PATHS = {
  water: `${TEXTURE_ROOT}/tiles/tile_73.png`,
} as const satisfies Record<string, string>;

export type TextureKey = keyof typeof TEXTURE_PATHS;
export type GameTextures = Readonly<Record<TextureKey, Texture>>;

export async function loadGameTextures(
  onProgress: (progress: number) => void,
): Promise<GameTextures> {
  const keys = Object.keys(TEXTURE_PATHS) as TextureKey[];
  const urls = keys.map((key ) => TEXTURE_PATHS[key]);
  const loaded = await Assets.load<Texture>(urls, onProgress);

  const textures = {} as Record<TextureKey, Texture>;
  for (const key of keys) {
    textures[key] = loaded[TEXTURE_PATHS[key]];
  }
  return textures;
}