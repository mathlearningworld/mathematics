import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { BV_UI } from "../ui/buildersValleyVisualTokens.js";

const prototype = BuildersValleyScene.prototype;
const originalCreateHotbar = prototype._createHotbar;
const originalCreateInteractionHud = prototype._createInteractionHud;
const originalUpdate = prototype.update;

function addHudBackplate(scene) {
  if (scene.__visualHudBackplate) return;

  const camera = scene.cameras.main;
  const slotSpan = BV_UI.hotbar.slotSize * 5 + BV_UI.hotbar.slotGap * 4;
  const panelWidth = slotSpan + BV_UI.hotbar.panelPaddingX * 2;
  const panelHeight = BV_UI.hotbar.slotSize + BV_UI.hotbar.panelPaddingY * 2;
  const panelY = camera.height - BV_UI.hotbar.yOffset;

  const shadow = scene.add
    .rectangle(camera.width / 2 + 4, panelY + 5, panelWidth + 10, panelHeight + 10, BV_UI.colors.shadow, 0.72)
    .setScrollFactor(0)
    .setDepth(BV_UI.depth.hudBackplate);

  const outer = scene.add
    .rectangle(camera.width / 2, panelY, panelWidth + 8, panelHeight + 8, BV_UI.colors.forgedDark, 0.98)
    .setStrokeStyle(3, BV_UI.colors.metalEdge, 1)
    .setScrollFactor(0)
    .setDepth(BV_UI.depth.hudBackplate + 1);

  const inner = scene.add
    .rectangle(camera.width / 2, panelY, panelWidth, panelHeight, BV_UI.colors.forgedMid, 0.98)
    .setStrokeStyle(1, BV_UI.colors.metalHighlight, 0.55)
    .setScrollFactor(0)
    .setDepth(BV_UI.depth.hudBackplate + 2);

  scene.__visualHudBackplate = { shadow, outer, inner };
}

function styleControlHint(scene) {
  const hint = scene.children.list.find(
    (child) => typeof child?.text === "string" && child.text.startsWith("WASD / ลูกศร"),
  );
  if (!hint) return;

  hint
    .setText("เคลื่อนที่  WASD/ลูกศร   •   วิ่ง  Shift   •   ใช้งาน  Space")
    .setFontFamily(BV_UI.typography.family)
    .setFontSize(BV_UI.typography.hintSize)
    .setColor(BV_UI.colors.textSecondary)
    .setBackgroundColor("#0b1720e6")
    .setPadding(12, 7, 12, 7)
    .setPosition(18, scene.cameras.main.height - 18)
    .setAlpha(0.88);

  scene.__visualControlHint = hint;
}

function styleHotbar(scene) {
  if (!Array.isArray(scene.hotbarSlots)) return;

  scene.hotbarSlots.forEach(({ slot, icon, keyLabel, countLabel, item }, index) => {
    const selected = index === scene.selectedSlot;
    const available = item?.kind !== "BLOCK" || (scene.inventory?.[item.resourceType] ?? 0) > 0;

    slot
      .setSize(BV_UI.hotbar.slotSize, BV_UI.hotbar.slotSize)
      .setFillStyle(
        selected ? BV_UI.colors.forgedRaised : BV_UI.colors.forgedDark,
        selected ? 1 : 0.97,
      )
      .setStrokeStyle(
        selected ? BV_UI.hotbar.selectedStroke : BV_UI.hotbar.idleStroke,
        selected ? BV_UI.colors.gold : BV_UI.colors.metalEdge,
        selected ? 1 : 0.9,
      );

    icon.setScale(selected ? 1.14 : 1).setAlpha(available ? (selected ? 1 : 0.86) : 0.38);

    keyLabel
      .setFontFamily(BV_UI.typography.mono)
      .setFontSize(BV_UI.typography.keySize)
      .setColor(selected ? "#ffe3a1" : BV_UI.colors.textMuted)
      .setPosition(slot.x - 21, -22);

    countLabel
      .setFontFamily(BV_UI.typography.mono)
      .setFontSize(BV_UI.typography.countSize)
      .setColor(available ? BV_UI.colors.textPrimary : BV_UI.colors.textMuted)
      .setStroke("#05090d", 4);
  });
}

prototype._createHotbar = function createHotbarWithVisualFoundation() {
  originalCreateHotbar.call(this);
  addHudBackplate(this);
  styleControlHint(this);
  styleHotbar(this);
};

prototype._createInteractionHud = function createInteractionHudWithVisualFoundation() {
  originalCreateInteractionHud.call(this);

  this.statusLabel
    ?.setFontFamily(BV_UI.typography.family)
    .setFontSize(BV_UI.typography.statusSize)
    .setColor(BV_UI.colors.textPrimary)
    .setBackgroundColor("#0b1720ed")
    .setPadding(13, 8, 13, 8)
    .setStroke("#05090d", 2);
};

prototype.update = function updateWithVisualFoundation(time, delta) {
  originalUpdate.call(this, time, delta);
  styleHotbar(this);
};
