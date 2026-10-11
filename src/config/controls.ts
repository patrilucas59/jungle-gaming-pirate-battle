export type PlayerAction =
  | 'forward'
  | 'turnLeft'
  | 'turnRight'
  | 'fireFront'
  | 'fireLeft'
  | 'fireRight';

export const KEY_BINDINGS: Readonly<Record<PlayerAction, readonly string[]>> = {
  forward: ['KeyW', 'ArrowUp'],
  turnLeft: ['KeyA', 'ArrowLeft'],
  turnRight: ['KeyD', 'ArrowRight'],
  fireFront: ['Space'],
  fireLeft: ['KeyQ'],
  fireRight: ['KeyE'],
};

export const PAUSE_KEYS: readonly string[] = ['KeyP', 'Escape'];

export interface ControlHint {
  action: string;
  keys: string;
}

export const CONTROL_HINTS: readonly ControlHint[] = [
  { action: 'Move forward', keys: 'W / ↑' },
  { action: 'Turn left', keys: 'A / ←' },
  { action: 'Turn right', keys: 'D / →' },
  { action: 'Fire front cannon', keys: 'Space' },
  { action: 'Fire left broadside', keys: 'Q' },
  { action: 'Fire right broadside', keys: 'E' },
  { action: 'Pause / resume', keys: 'P / Esc' },
];