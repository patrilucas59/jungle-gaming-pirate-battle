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