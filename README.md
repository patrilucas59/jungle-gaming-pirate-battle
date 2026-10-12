# All Blue Pirate Battle

A 2D top-down naval shooter built with React, TypeScript and PixiJS for the Jungle Gaming front-end game developer challenge.

- **Live demo:** https://all-blue-pirate-battle.vercel.app
- **Repository:** https://github.com/patrilucas59/jungle-gaming-pirate-battle

## Stack

React 19 (menus and UI) · TypeScript (strict) · PixiJS 8 (game rendering) · TanStack Query 5 (ranking and history state) · Axios (HTTP client) · MSW 3 (mocked API, also in the published build) · Playwright (E2E tests) · Vite.

## Setup

Requirements: Node.js (developed with v22.21.0) and npm.

```bash
npm ci
npx playwright install chromium
npm run dev
```

Open http://localhost:5173. No environment variables are required.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Type check and production build |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint (warnings fail the run) |
| `npm run typecheck` | TypeScript project check |
| `npm run test:e2e` | Build, serve the production build and run Playwright |
| `npm run test:e2e:report` | Open the last HTML test report |

## Controls

| Action | Keys |
| --- | --- |
| Move forward | `W` / `↑` |
| Turn left / right | `A` / `←`, `D` / `→` |
| Front cannon | `Space` |
| Left / right broadside | `Q` / `E` |
| Pause / resume | `P` / `Esc` |

Movement and firing can be combined. Keys are only captured during a match. Touch controls are not implemented (see Known limitations).

## Gameplay configuration

All balancing values live in `src/config/gameplay.ts` (health, speeds, turn rates, damage, projectile speed and lifetime, cooldowns, Shooter range, spawn pattern and match duration). Systems read the config, so balancing never requires changes to game logic. Each match copies the configuration when it starts; later changes only affect new matches.

The **Options** screen exposes two values, validated and persisted in `localStorage`:

| Option | Limits |
| --- | --- |
| Game session time | 60–180 seconds (whole numbers) |
| Enemy spawn time | 1–10 seconds |

## Ranking, match history and network scenarios

Ranking and match history use a REST API mocked with MSW. The mock runs in development, in tests and in the published build. Confirmed and pending records are persisted in `localStorage`.

The main menu has a **Network scenario (mock API)** panel:

| Scenario | Effect |
| --- | --- |
| Success | Normal responses with fixture players and pagination |
| Empty lists | Ranking and history return no items |
| Slow network (2 s) | Every request is delayed by 2 seconds |
| Server error (500) | Every request fails with HTTP 500 |
| Timeout after saving a match | The server stores the match but answers after 8 s, longer than the 5 s client timeout |

**Reset mock data** restores the initial state (scenario, stored matches and pending records).

How to reproduce failures:

1. **Unavailable API at the end of a match:** choose *Server error*, play a match. The result shows "Not saved yet" and the menu shows a pending record. Reload the page: it is still pending. Switch to *Success* and press *Try again*: it is saved once.
2. **Timeout after saving:** choose *Timeout after saving a match* and play. The first request times out, the retry finds the stored record, and the match appears only once in the history.
3. **Query failure:** choose *Server error* and open the tabs: an error message with *Try again* is shown.

## Tests

Playwright runs against the production build (`vite preview`) in Chromium desktop and mobile (Pixel 7). Every test starts from a fresh browser context. Coverage:

- Options: validation, saving and persistence after reload
- Match: start, running timer, pause freezing the timer and resume
- Ranking and history: pagination, empty state and error state

The HTML report is in `playwright-report/`; traces are kept for failed tests. Tests run serially (`workers: 1`) because parallel headless Chromium instances rendering WebGL froze on the reference machine.

## Known limitations

- No touch controls; mobile is playable only with a keyboard. Landscape orientation is recommended.
- Visual feedback is limited to health bars: no firing effect, explosions or progressive ship damage.
- No sound.
- Network scenarios cover success, empty, fixed delay, HTTP 500 and timeout after saving. Variable latency, out-of-order responses, connection failures and 4xx are not simulated.
- E2E tests do not yet cover combat, enemies, match end or seeded/clock-controlled runs; no visual regression baselines.
- Performance was not profiled (FPS, frame-time p95, memory over repeated matches).
- Enemies do not collide with each other and slide around the island instead of planning a path.
- Ship collision uses a circle, so the bow can visually touch the island before the ship stops.
- Some membrane keyboards drop a fourth simultaneous key (for example `W` + `A` + `Space` + `Q`); arrow keys avoid this.
- Textures use the 1× assets only; the canvas itself renders at the device pixel ratio.
- The main bundle is about 600 kB minified (about 180 kB gzipped), mostly PixiJS; the mock API is loaded in a separate chunk.

## Use of AI

I used Claude (Anthropic) as a coding assistant due to the short deadline. I made the design and architecture decisions, tested every feature, debugged the issues found and reviewed all the code, and I can explain each part. `ARCHITECTURE.md` documents the design.

## Assets

Game art from the `assets/` folder provided in the challenge repository (https://github.com/junglegaming/game-developer-challenge).