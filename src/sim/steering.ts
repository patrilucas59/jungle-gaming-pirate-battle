import { clamp } from "./math";

interface Heading {
  x: number;
  y: number;
  angle: number;
}

export function normalizeAngle(angle: number): number {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

export function turnTowards(
  ship: Heading,
  targetX: number,
  targetY: number,
  turnSpeed: number,
  dt: number,
): number {
  const desired = Math.atan2(targetY - ship.y, targetX - ship.x);
  const difference = normalizeAngle(desired - ship.angle);
  const maxTurn = turnSpeed * dt;
  const applied = clamp(difference, -maxTurn, maxTurn);
  ship.angle += applied;
  return Math.abs(difference - applied);
}

export function moveForward(ship: Heading, speed: number, dt: number) {
  ship.x += Math.cos(ship.angle) * speed * dt;
  ship.y += Math.sin(ship.angle) * speed * dt;
}

export function distanceBetween(
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  return Math.hypot(b.x - a.x, b.y -a.y);
}