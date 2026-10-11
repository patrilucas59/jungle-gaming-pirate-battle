import type { PlayerAction } from "../config/controls";

export type PlayerIntents = Readonly<Record<PlayerAction, boolean>>;