import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

const worker = setupWorker(...handlers);

export async function startMockApi(): Promise<void> {
  await worker.start({
    onUnhandledFrame: 'bypass',
    quiet: true,
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
  });
}