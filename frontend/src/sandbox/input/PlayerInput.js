/**
 * Keyboard adapter. Scenes consume semantic intent, not physical key codes.
 */
export class PlayerInput {
  constructor(scene) {
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys("W,A,S,D,SHIFT");
  }

  read() {
    return {
      x: Number(this.cursors.right.isDown || this.keys.D.isDown)
        - Number(this.cursors.left.isDown || this.keys.A.isDown),
      y: Number(this.cursors.down.isDown || this.keys.S.isDown)
        - Number(this.cursors.up.isDown || this.keys.W.isDown),
      running: this.cursors.shift.isDown || this.keys.SHIFT.isDown,
    };
  }
}
