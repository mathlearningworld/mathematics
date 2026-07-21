import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

function configureFourDirectionFacing(scene) {
  const player = scene.player;
  if (!player) return;

  const avatar = player.getData?.("avatar");
  const heldItem = player.getData?.("heldItem");
  const eye = player.getData?.("eye");
  const backpack = player.getData?.("backpack");
  if (!avatar || !heldItem || !eye || !backpack) return;

  const frontSecondEye = scene.add.rectangle(-5, -34, 3, 3, 0x202e32).setOrigin(0.5);
  const backPackWide = scene.add.rectangle(0, -20, 16, 15, 0x865437).setOrigin(0.5);
  const backPackLight = scene.add.rectangle(-4, -22, 4, 10, 0xb87945).setOrigin(0.5);
  const backHeadShade = scene.add.rectangle(0, -35, 16, 13, 0xd18a32).setOrigin(0.5);

  frontSecondEye.setVisible(false);
  backPackWide.setVisible(false);
  backPackLight.setVisible(false);
  backHeadShade.setVisible(false);
  avatar.add([frontSecondEye, backHeadShade, backPackWide, backPackLight]);

  const applyFacing = (direction) => {
    const facing = ["left", "right", "up", "down"].includes(direction) ? direction : "right";
    player.setData("facing", facing);

    const horizontal = facing === "left" || facing === "right";
    avatar.setScale(facing === "left" ? -1 : 1, 1);

    eye.setVisible(facing !== "up");
    backpack.setVisible(horizontal);
    frontSecondEye.setVisible(facing === "down");
    backPackWide.setVisible(facing === "up");
    backPackLight.setVisible(facing === "up");
    backHeadShade.setVisible(facing === "up");

    if (facing === "down") {
      eye.setPosition(5, -34);
      heldItem.setPosition(15, -16);
      heldItem.setAlpha(1);
    } else if (facing === "up") {
      heldItem.setPosition(-13, -18);
      heldItem.setAlpha(0.82);
    } else {
      eye.setPosition(5, -34);
      heldItem.setPosition(15, -16);
      heldItem.setAlpha(1);
    }
  };

  player.setFacing = applyFacing;
  applyFacing(scene.lastFacing ?? "right");
}

prototype.create = function createWithFourDirectionFeedback() {
  originalCreate.call(this);
  configureFourDirectionFacing(this);

  if (window.__BUILDERS_VALLEY__) {
    window.__BUILDERS_VALLEY__.getCharacterDirection = () => ({
      facing: this.lastFacing,
      interactionDirection: { ...this.lastInteractionDirection },
    });
  }
};

prototype._updatePlayerVisual = function updatePlayerVisualWithFourDirections(time, movement) {
  if (movement.moving) {
    if (Math.abs(movement.velocityX) >= Math.abs(movement.velocityY)) {
      this.lastInteractionDirection = {
        x: movement.velocityX < 0 ? -1 : 1,
        y: 0,
      };
      this.lastFacing = movement.velocityX < 0 ? "left" : "right";
    } else {
      this.lastInteractionDirection = {
        x: 0,
        y: movement.velocityY < 0 ? -1 : 1,
      };
      this.lastFacing = movement.velocityY < 0 ? "up" : "down";
    }

    this.player.setFacing(this.lastFacing);
  }

  this.player.setWalkingFrame(time, movement.moving);
};
