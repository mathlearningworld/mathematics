/**
 * Pure movement model. Phaser and keyboard details stay outside this module.
 */
export function resolveMovement(intent, speed) {
  const x = Number(intent?.x ?? 0);
  const y = Number(intent?.y ?? 0);
  const magnitude = Math.hypot(x, y);

  if (magnitude === 0) {
    return { velocityX: 0, velocityY: 0, moving: false };
  }

  return {
    velocityX: (x / magnitude) * speed,
    velocityY: (y / magnitude) * speed,
    moving: true,
  };
}
