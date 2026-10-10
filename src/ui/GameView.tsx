import { useEffect, useRef, useState } from "react";
import { Application } from 'pixi.js';

type MountStatus = 'loading' | 'ready' | 'error';

const LOGICAL_WIDTH = 1280;
const LOGICAL_HEIGHT = 720;

export function GameView() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<MountStatus>('loading');

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const app = new Application();
    let initialized = false;
    let disposed = false;

    app
      .init({
        width: LOGICAL_WIDTH,
        height: LOGICAL_HEIGHT,
        background: '#1b4f72',
        antialias: true,
      })
      .then(() => {
        initialized = true;
        if (disposed) {
          app.destroy(true, { children: true });
          return;
        }
        host.appendChild(app.canvas);
        setStatus('ready');
      })
      .catch(() => {
        if (!disposed) setStatus('error');
      });

      return () => {
        disposed = true;
        if (initialized) {
          app.destroy(true, { children: true });
        }
      };
  }, []);

  return (
    <div>
      {status === 'loading' && <p role="status">Loading Game...</p>}
      {status === 'error' && (
        <p role="alert">The game could not start. Please, reload the page.</p>
      )}
      <div ref={hostRef} />
    </div>
  );
}