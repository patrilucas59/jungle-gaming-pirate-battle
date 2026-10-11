import { useEffect, useRef, useState } from 'react';
import { Application, Container, TilingSprite } from 'pixi.js';
import { ARENA } from '../config/arena';
import { GameSession } from '../game/GameSession';
import type { GameTextures } from '../render/textures';
import { computeViewportFit } from '../render/viewport';

interface GameCanvasProps {
  textures: GameTextures;
}

export function GameCanvas({ textures }: GameCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const app = new Application();
    const world = new Container();
    let initialized = false;
    let disposed = false;
    let resizeObserver: ResizeObserver | undefined;
    let session: GameSession | undefined;

    const fitToHost = () => {
      const fit = computeViewportFit(
        host.clientWidth,
        host.clientHeight,
        ARENA.width,
        ARENA.height,
      );
      if (fit.width < 1 || fit.height < 1) return;
      app.renderer.resize(fit.width, fit.height, window.devicePixelRatio);
      world.scale.set(fit.scale);
    };

    app
      .init({
        width: ARENA.width,
        height: ARENA.height,
        background: '#1b4f72',
        antialias: true,
        resolution: window.devicePixelRatio,
        autoDensity: true,
      })
      .then(() => {
        initialized = true;
        if (disposed) {
          app.destroy(true, { children: true, texture: false, textureSource: false });
          return;
        }
        world.addChild(
          new TilingSprite({
            texture: textures.water,
            width: ARENA.width,
            height: ARENA.height,
          }),
        );
        app.stage.addChild(world);
        host.appendChild(app.canvas);
        resizeObserver = new ResizeObserver(fitToHost);
        resizeObserver.observe(host);
        fitToHost();
        session = new GameSession(app, world, textures);
      })
      .catch(() => {
        if (!disposed) setFailed(true);
      });

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      session?.destroy();
      if (initialized) {
        app.destroy(true, { children: true, texture: false, textureSource: false });
      }
    };
  }, [textures]);

    return (
      <>
        {failed && (
          <p role="alert">The game could not start. Please reload the page.</p>
        )}
        <div ref={hostRef} className="game-view__stage" />
      </>
    );
  }