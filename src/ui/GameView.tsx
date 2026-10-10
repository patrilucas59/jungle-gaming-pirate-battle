import { useEffect, useRef, useState } from "react";
import { Application, Container } from 'pixi.js';
import { ARENA } from "../config/arena";
import { computeViewportFit } from "../render/viewport";

type MountStatus = 'loading' | 'ready' | 'error';

export function GameView() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<MountStatus>('loading');

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const app = new Application();
    const world = new Container();
    let initialized = false;
    let disposed = false;
    let resizeObserver: ResizeObserver | undefined;

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
          app.destroy(true, { children: true });
          return;
        }
        app.stage.addChild(world);
        host.appendChild(app.canvas);
        resizeObserver = new ResizeObserver(fitToHost);
        resizeObserver.observe(host);
        fitToHost();

        setStatus('ready');
      })
      .catch(() => {
        if (!disposed) setStatus('error');
      });

      return () => {
        disposed = true;
        resizeObserver?.disconnect();
        if (initialized) {
          app.destroy(true, { children: true });
        }
      };
  }, []);

  return (
    <div className="game-view">
      {status === 'loading' && <p role="status">Loading game…</p>}
      {status === 'error' && (
        <p role="alert">The game could not start. Please reload the page.</p>
      )}
      <div ref={hostRef} className="game-view__stage" />
    </div>
  );
}