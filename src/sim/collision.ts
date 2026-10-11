import type { Rect } from '../config/arena';
import { clamp } from './math';

interface Position {
  x: number;
  y: number;
}

export function insetRect(rect: Rect, inset: number): Rect {
  return {
    x: rect.x + inset,
    y: rect.y + inset,
    width: rect.width - inset * 2,
    height: rect.height - inset * 2,
  };
}

export function pushCircleOutOfRect(
  body: Position,
  radius: number,
  rect: Rect,
): boolean {
  const closestX = clamp(body.x, rect.x, rect.x + rect.width);
  const closestY = clamp(body.y, rect.y, rect.y + rect.height);
  const dx = body.x - closestX;
  const dy = body.y - closestY;
  const distanceSquared = dx * dx + dy * dy;

  if (distanceSquared >= radius * radius) return false;

  if (distanceSquared > 0) {
    const distance = Math.sqrt(distanceSquared);
    const overlap = radius - distance;
    body.x += (dx / distance) * overlap;
    body.y += (dy / distance) * overlap;
    return true;
  }

  const toLeft = body.x - rect.x;
  const toRight = rect.x + rect.width - body.x;
  const toTop = body.y - rect.y;
  const toBottom = rect.y + rect.height - body.y;
  const nearest = Math.min(toLeft, toRight, toTop, toBottom);

  if (nearest === toLeft) body.x = rect.x - radius;
  else if (nearest === toRight) body.x = rect.x + rect.width + radius;
  else if (nearest === toTop) body.y = rect.y - radius;
  else body.y = rect.y + rect.height + radius;
  return true;
}