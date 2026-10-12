# Architecture

## Layers

```
src/
├── config/        Typed configuration: arena, gameplay balancing, controls, simulation
├── sim/           Game rules as plain data and functions. No PixiJS, no DOM
├── render/        PixiJS views that read simulation state and never modify it
├── input/         Keyboard → player intents
├── game/          GameSession: wires simulation, rendering, input and the ticker
├── ui/            React screens, HUD and dialogs
├── api/           Contracts, Axios client, TanStack Query hooks
├── mocks/         MSW handlers, fixtures, scenarios and mock database
└── storage/       Validated localStorage access
```

Dependency rule: `sim/` depends only on `config/` and type-only contracts. `render/` reads state. `game/` is the only place that knows every layer.

## React and PixiJS integration

`GameView` holds the screen state (`menu`, `options`, `match`) and loads textures before anything else. `MatchScreen` mounts `GameCanvas`, which creates the PixiJS `Application` and a `GameSession`.

- **Strict Mode:** `app.init()` is asynchronous and Strict Mode mounts twice. Two flags (`initialized`, `disposed`) decide who destroys the application, so a cancelled mount never leaves a canvas or WebGL context behind.
- **Cleanup:** on unmount the session removes its ticker callback and listeners, then the application is destroyed with `{ children: true, texture: false, textureSource: false }`. Textures belong to the `Assets` cache and are reused across matches.
- **Restart:** "Play again" changes the `key` of `MatchScreen`, so React unmounts everything and builds a fresh world.
- **HUD without per-frame renders:** the session builds a small `HudSnapshot` (status, health, score, whole seconds) and only calls React when a value changes, about once per second.

## Viewport

The arena has a fixed logical size of 1280×720. On every resize a `ResizeObserver` computes the largest 16:9 size that fits, resizes the renderer with the current `devicePixelRatio`, and scales a `world` container. Game rules never see screen pixels.

## Simulation loop

- Fixed timestep of 1/60 s with an accumulator (`FixedStepLoop`), fed by the ticker's raw `elapsedMS`.
- Frame time is capped at 0.25 s, so a stalled tab never makes ships jump.
- Pausing stops the loop and clears the accumulator: timer, cooldowns and movement freeze, and nothing accumulates while paused.
- Automatic pause on window `blur` and on `visibilitychange`; resuming always requires a player action.

Order inside `stepWorld`: player movement → island push-out → projectiles → player weapons → enemies → spawning → combat → match timer. When the match has ended, `stepWorld` returns immediately, which stops movement, attacks, damage, spawns and scoring.

## Gameplay systems

- **Movement:** heading vector `(cos, sin)`; rotation and forward speed are multiplied by `dt`; position is clamped to the arena using the ship radius.
- **Weapons:** front cannon (1 projectile) and two broadsides (3 parallel projectiles each). The side direction is the forward vector rotated 90°, and projectiles are offset along the hull. Each weapon has its own cooldown, reduced by `dt`.
- **Projectiles:** team, velocity, damage, radius and lifetime. Removed when they expire, leave the arena, hit the island or hit a target. Removal compacts the array in place.
- **Enemies:** both turn towards the player at a limited rate (`turnTowards` with angle normalization). The Chaser always advances and is destroyed on contact, damaging the player without scoring. The Shooter advances to a preferred distance and fires when in range and aimed.
- **Spawning:** a configurable pattern (`chaser, shooter, chaser`) guarantees both types appear. Spawn points are chosen with a seeded generator (mulberry32) and must be away from the player, outside the island and not overlapping other enemies.
- **Scoring:** +1 only when a player projectile destroys an enemy.

## Collisions

- **Circle vs rectangle (ships vs island, projectiles vs island):** clamp the circle centre to the rectangle to get the closest point; compare squared distances. Ships are pushed out along the normal by the overlap, which lets them slide along the shore. The island collision rectangle is inset (`ISLAND_COLLISION_INSET`) to follow the rounded sand.
- **Circle vs circle (projectiles vs ships, Chaser vs player):** squared distance against the sum of radii.
- **Single damage:** a projectile is removed in the same step it hits, and only hits the first target found.

## Rendering and resources

- Textures are listed in a typed manifest and loaded with `Assets.load`, with visible progress, an error state and a Retry button.
- Views are keyed by entity id: new ids create sprites, missing ids destroy them.
- Health bars are `Graphics` objects redrawn only when the health ratio changes.
- Ship sprites face down in the asset pack, compensated by a single rotation offset.

## Local persistence

| Key | Content |
| --- | --- |
| `pirate-battle:options:v1` | Session time and spawn time |
| `pirate-battle:last-result:v1` | Last completed match |
| `pirate-battle:player:v1` | Local player id and name |
| `pirate-battle:pending-matches:v1` | Matches not yet confirmed by the API |
| `pirate-battle:mock-db:v1` | Matches stored by the mock API |
| `pirate-battle:mock-scenario:v1` | Selected network scenario |

All reads are validated, and all access is wrapped in `try/catch`, so blocked storage never breaks the game. Abandoned matches (quit or reload) are never saved.

## Ranking and history

**Contracts** (`src/api/contracts.ts`): `MatchRecord` with match id, player id and name, date, score, effective duration, end reason and the settings used.

| Endpoint | Purpose |
| --- | --- |
| `GET /api/ranking?page&pageSize&durationSeconds&spawnIntervalSeconds` | Ranking for the same settings |
| `GET /api/players/:playerId/matches?page&pageSize` | Player history, newest first |
| `PUT /api/matches/:matchId` | Idempotent registration |

- **Fair ranking:** only matches with the same duration and spawn interval. Tie-break: higher score, then longer survival, then earlier date, then match id.
- **Idempotency:** the match id is generated on the client when the match ends. The server returns the existing record for a known id, so retries and repeated clicks never duplicate.
- **Pending records:** saved to `localStorage` before the request and removed only after confirmation. They survive failures and reloads; the menu offers *Try again*, and new matches can start meanwhile.
- **Cache:** TanStack Query with one key per page and settings, `keepPreviousData` while paginating, one retry, background refetch indicator. After a registration both tabs are invalidated; switching tabs remounts the list and refetches.
- **Late responses:** the query `signal` is passed to Axios, so changing page or tab cancels the previous request, and each page has its own cache key.
- **Failures:** API errors never block the game, the options or a running match.
- **MSW 3:** the worker is started before rendering and loaded in a separate chunk. MSW 3 renamed `onUnhandledRequest` to `onUnhandledFrame`; this was confirmed in the installed type definitions.

## Testing strategy

Playwright against the production build, Chromium desktop and mobile, accessible selectors (`getByRole`, `getByLabel`), network scenarios set through `localStorage` before the page loads, HTML report and traces on failure. Tests run serially because of WebGL instability in parallel headless browsers on the reference machine.

## Balancing decisions

| Parameter | Value |
| --- | --- |
| Match duration | 90 s |
| Player | 100 HP, 140 units/s, 2.5 rad/s |
| Projectile | 25 damage, 420 units/s, 1.4 s lifetime |
| Front cannon cooldown | 0.45 s |
| Broadside cooldown | 1.6 s per side |
| Chaser | 50 HP (2 hits), 110 units/s, 30 contact damage |
| Shooter | 75 HP (3 hits), 80 units/s, 380 range, 280 preferred distance, 2 s cooldown |
| Spawn | first after 1.5 s, then every 4 s |

Projectiles do not inherit ship velocity, to keep aiming predictable.

## Known limitations

See the README for the full list.