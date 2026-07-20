/**
 * Visual feedback utilities.
 * Animations, glow effects, and celebration sequences.
 */

/**
 * Create a gentle shake/bounce tween on a game object.
 * @param {Phaser.Scene} scene
 * @param {Phaser.GameObjects.GameObject} target
 * @param {Function} [onComplete]
 */
export function shakeObject(scene, target, onComplete) {
  scene.tweens.add({
    targets: target,
    x: target.x - 8,
    duration: 50,
    yoyo: true,
    repeat: 3,
    ease: "Sine.easeInOut",
    onComplete: () => {
      target.x = target.getData("originalX") ?? target.x;
      if (onComplete) onComplete();
    },
  });
}

/**
 * Create a glow pulse effect on a game object.
 * @param {Phaser.Scene} scene
 * @param {Phaser.GameObjects.GameObject} target
 */
export function glowPulse(scene, target) {
  scene.tweens.add({
    targets: target,
    alpha: { from: 1, to: 0.6 },
    scaleX: { from: 1, to: 1.05 },
    scaleY: { from: 1, to: 1.05 },
    duration: 600,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut",
  });
}

/**
 * Create a celebration animation (hero jump + sparkle).
 * @param {Phaser.Scene} scene
 * @param {Phaser.GameObjects.GameObject} hero
 * @param {Function} [onComplete]
 */
export function celebrate(scene, hero, onComplete) {
  scene.tweens.add({
    targets: hero,
    y: hero.y - 40,
    duration: 300,
    yoyo: true,
    repeat: 2,
    ease: "Bounce.easeOut",
    onComplete: () => {
      // Sparkle burst
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        const sparkle = scene.add.circle(hero.x, hero.y, 4, 0xffd700);
        scene.tweens.add({
          targets: sparkle,
          x: hero.x + Math.cos(angle) * 60,
          y: hero.y + Math.sin(angle) * 60,
          alpha: 0,
          scaleX: 0,
          scaleY: 0,
          duration: 500,
          ease: "Cubic.easeOut",
          onComplete: () => sparkle.destroy(),
        });
      }
      if (onComplete) onComplete();
    },
  });
}

/**
 * Light up a progress stone.
 * @param {Phaser.Scene} scene
 * @param {Phaser.GameObjects.GameObject} stone
 */
export function lightStone(scene, stone) {
  scene.tweens.add({
    targets: stone,
    alpha: 1,
    scaleX: 1.2,
    scaleY: 1.2,
    duration: 300,
    yoyo: true,
    ease: "Back.easeOut",
  });
}

/**
 * Animate a hand/pointer cue at a target.
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @returns {Phaser.GameObjects.Arc}
 */
export function showPointerCue(scene, x, y) {
  const cue = scene.add.circle(x, y, 12, 0xffffff, 0.6);
  cue.setStrokeStyle(2, 0xffffff);
  scene.tweens.add({
    targets: cue,
    y: y + 20,
    alpha: 0,
    duration: 1000,
    repeat: -1,
    ease: "Sine.easeInOut",
  });
  return cue;
}
