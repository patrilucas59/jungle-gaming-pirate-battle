import { KEY_BINDINGS, type PlayerAction } from "../config/controls";
import type { PlayerIntents } from "./intents";

const ACTIONS = Object.keys(KEY_BINDINGS) as PlayerAction[];
const BOUND_CODES = new Set(ACTIONS.flatMap((action) => KEY_BINDINGS[action]));

export class KeyboardInput {
  private readonly target: Window;
  private readonly pressed = new Set<string>();
  private attached = false;

  constructor(target: Window) {
    this.target = target;
  }

  attach(): void {
    if (this.attached) return;
    this.target.addEventListener('keydown', this.onKeyDown);
    this.target.addEventListener('keyup', this.onKeyUp);
    this.target.addEventListener('blur', this.clear);
    this.attached = true;
  }

  detach(): void {
    if (!this.attached) return;
    this.target.removeEventListener('keydown', this.onKeyDown);
    this.target.removeEventListener('keyup', this.onKeyUp);
    this.target.removeEventListener('blur', this.clear);
    this.clear();
    this.attached = false;
  }

  read(): PlayerIntents {
    const intents = {} as Record<PlayerAction, boolean>;
    for (const action of ACTIONS) {
      intents[action] = KEY_BINDINGS[action].some((code) => this.pressed.has(code));
    }
    return intents;
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (!BOUND_CODES.has(event.code)) return;
    event.preventDefault();
    this.pressed.add(event.code);
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    if (!BOUND_CODES.has(event.code)) return;
    this.pressed.delete(event.code);
  };

  private readonly clear = (): void => {
    this.pressed.clear();
  };
}