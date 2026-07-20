/**
 * FractionBridgeScene — Main game scene.
 * Implements the 3-round fraction equivalence discovery flow.
 *
 * Lifecycle:
 *   ROUND_1_ACTIVE → ROUND_1_COMPLETED → ROUND_2_ACTIVE
 *   → ROUND_2_COMPLETED → ROUND_3_ACTIVE → GAME_COMPLETED
 *
 * Visual ownership:
 *   worldLayer    — persistent scenery (sky, hills, ground, river, trees, clouds)
 *   hudLayer      — persistent HUD (round label, progress stones, reset button)
 *   roundLayer    — destroyed before each new round (bridge, inventory, pieces, equations)
 *   completionLayer — exists only in GAME_COMPLETED (message, replay button)
 */

import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../gameConfig.js";
import {
  createRoundState,
  placePiece,
  evaluateVisualChoice,
  UNDERFILLED,
  EXACT,
  OVERFILLED,
} from "../domain/fractionBridgeRules.js";
import { recordEvent } from "../domain/evidenceRecorder.js";
import { createFractionPiece, createFractionModel } from "../ui/fractionPiece.js";
import {
  drawBridge,
  drawPlacedPieces,
  drawGhostOverlay,
  WHOLE_BRIDGE_WIDTH,
  HALF_WIDTH,
  BRIDGE_Y,
  LAND_HEIGHT,
  GAP_Y_OFFSET,
} from "../ui/bridgeRenderer.js";
import {
  shakeObject,
  glowPulse,
  celebrate,
  lightStone,
  showPointerCue,
} from "../ui/visualFeedback.js";

// ── Constants ──────────────────────────────────────────────
const PIECE_COLORS = [0x6a4e9c, 0xe67e22, 0x27ae60, 0x2980b9, 0xc0392b];
const BRIDGE_COLOR = 0x8e44ad;
const INVENTORY_Y = 580;
const HERO_X_START = 80;
const HERO_Y = BRIDGE_Y + LAND_HEIGHT / 2 + GAP_Y_OFFSET;

// Phase constants
const PHASE = {
  ROUND_1_ACTIVE: "ROUND_1_ACTIVE",
  ROUND_1_COMPLETED: "ROUND_1_COMPLETED",
  ROUND_2_ACTIVE: "ROUND_2_ACTIVE",
  ROUND_2_COMPLETED: "ROUND_2_COMPLETED",
  ROUND_3_ACTIVE: "ROUND_3_ACTIVE",
  GAME_COMPLETED: "GAME_COMPLETED",
};

export class FractionBridgeScene extends Phaser.Scene {
  constructor() {
    super({ key: "FractionBridgeScene" });
    this.gameState = null;
    this.phase = null;
    this.currentRound = 0;
    this._pendingTransition = null;
    this.hero = null;
    this.progressStones = [];
    this.bridgeBgGraphics = null;
    this.placedGraphics = null;
    this.ghostGraphics = null;
    this.inventoryPieces = [];
    this.choiceButtons = [];
    this.roundTweens = [];
    this.pointerCues = [];
    this.isAnimating = false;

    // Layer containers
    this.worldLayer = null;
    this.hudLayer = null;
    this.roundLayer = null;
    this.completionLayer = null;

    // Reusable HUD elements
    this.roundLabel = null;
    this.resetBtn = null;
  }

  // ── Layer helpers ─────────────────────────────────────────
  _addToLayer(layer, objectOrObjects) {
    const candidates = Array.isArray(objectOrObjects)
      ? objectOrObjects.flat(Infinity)
      : [objectOrObjects];

    const validObjects = candidates.filter(
      (obj) =>
        obj &&
        typeof obj === "object" &&
        obj.scene &&
        typeof obj.once === "function" &&
        obj.active !== false,
    );

    if (validObjects.length > 0) {
      layer.add(validObjects);
    }

    return objectOrObjects;
  }


  // ── Scene lifecycle ──────────────────────────────────────
  create() {
    this.cameras.main.setBackgroundColor("#87CEEB");

    // Create persistent layers
    this.worldLayer = this.add.container(0, 0);
    this.worldLayer.setDepth(0);
    this.hudLayer = this.add.container(0, 0);
    this.hudLayer.setDepth(40);
    this.roundLayer = this.add.container(0, 0);
    this.roundLayer.setDepth(10);
    this.completionLayer = this.add.container(0, 0);
    this.completionLayer.setDepth(50);

    this.drawScenery();
    this.hero = this.createHero(HERO_X_START, HERO_Y);
    this.hero.setDepth(30);
    this.createHud();

    this.startRound(1);
  }

  // ── Transition scheduling ─────────────────────────────────
  _scheduleTransition(expectedPhase, delay, action) {
    this._cancelPendingTransition();
    this._pendingTransition = this.time.delayedCall(delay, () => {
      if (this.phase !== expectedPhase) return;
      this._pendingTransition = null;
      action();
    });
  }

  _cancelPendingTransition() {
    if (this._pendingTransition) {
      this._pendingTransition.remove();
      this._pendingTransition = null;
    }
  }

  // ── Round lifecycle ──────────────────────────────────────
  _clearRoundLayer() {
    // Cancel round-owned tweens
    this.roundTweens.forEach((t) => {
      if (t && t.stop) t.stop();
    });
    this.roundTweens = [];

    // Destroy all children in roundLayer
    if (this.roundLayer) {
      this.roundLayer.removeAll(true);
    }

    // Clear round-owned references
    this.bridgeBgGraphics = null;
    this.placedGraphics = null;
    this.ghostGraphics = null;
    this.inventoryPieces = [];
    this.choiceButtons = [];
    this.pointerCues = [];
    this._refModel = null;
  }

  _clearCompletionLayer() {
    if (this.completionLayer) {
      this.completionLayer.removeAll(true);
    }
  }

  startRound(roundNumber) {
    this._cancelPendingTransition();
    this._clearRoundLayer();

    this.currentRound = roundNumber;
    this.gameState = createRoundState(roundNumber);
    this.isAnimating = false;

    // Set phase
    if (roundNumber === 1) this.phase = PHASE.ROUND_1_ACTIVE;
    else if (roundNumber === 2) this.phase = PHASE.ROUND_2_ACTIVE;
    else if (roundNumber === 3) this.phase = PHASE.ROUND_3_ACTIVE;

    // Update HUD round label
    if (this.roundLabel) {
      this.roundLabel.setText(`รอบที่ ${roundNumber}`);
    }

    // Draw bridge background into roundLayer
    this._drawBridgeBg();

    // Draw inventory (Rounds 1-2 only)
    if (roundNumber <= 2) {
      this._createInventory();
    }

    // Record event
    recordEvent("ROUND_STARTED", roundNumber, {
      target: { ...this.gameState.target },
      pieces: this.gameState.availablePieces.map((p) => ({
        numerator: p.numerator,
        denominator: p.denominator,
      })),
    });

    // Pointer cue after delay
    const cueTimer = this.time.delayedCall(800, () => {
      if (this.phase !== PHASE.ROUND_1_ACTIVE && this.phase !== PHASE.ROUND_2_ACTIVE) return;
      if (this.inventoryPieces.length > 0) {
        const firstPiece = this.inventoryPieces[0];
        if (firstPiece && firstPiece.active) {
          const cue = showPointerCue(this, firstPiece.x, firstPiece.y - 40);
          this.pointerCues.push(cue);
          this._addToLayer(this.roundLayer, cue);
        }
      }
    });
    this.roundTweens.push(cueTimer);
  }

  // ── Bridge background ────────────────────────────────────
  _drawBridgeBg() {
    const bg = drawBridge(this, GAME_WIDTH);
    this.bridgeBgGraphics = bg;
    this._addToLayer(this.roundLayer, bg);
  }

  // ── Inventory ────────────────────────────────────────────
  _createInventory() {
    this.inventoryPieces = [];
    const startX = GAME_WIDTH / 2 - 150;
    const spacing = 120;

    this.gameState.availablePieces.forEach((piece, index) => {
      const x = startX + index * spacing;
      const color = PIECE_COLORS[index % PIECE_COLORS.length];
      const pieceObj = createFractionPiece(this, x, INVENTORY_Y, piece, color);
      pieceObj.setDepth(20);
      pieceObj.setData("originalX", x);
      pieceObj.setData("originalY", INVENTORY_Y);
      pieceObj.setData("color", color);
      pieceObj.setData("pieceData", { ...piece });

      pieceObj.on("dragstart", () => {
        if (this.phase !== PHASE.ROUND_1_ACTIVE && this.phase !== PHASE.ROUND_2_ACTIVE) return;
        pieceObj.setDepth(100);
        pieceObj.setScale(1.1);
        recordEvent("PIECE_PICKED", this.currentRound, {
          pieceId: piece.id,
          numerator: piece.numerator,
          denominator: piece.denominator,
        });
      });

      pieceObj.on("drag", (_pointer, dragX, dragY) => {
        if (this.phase !== PHASE.ROUND_1_ACTIVE && this.phase !== PHASE.ROUND_2_ACTIVE) return;
        pieceObj.x = dragX;
        pieceObj.y = dragY;
      });

      pieceObj.on("dragend", () => {
        if (this.phase !== PHASE.ROUND_1_ACTIVE && this.phase !== PHASE.ROUND_2_ACTIVE) return;
        pieceObj.setDepth(20);
        pieceObj.setScale(1);
        this._handlePieceDrop(pieceObj, piece);
      });

      this._addToLayer(this.roundLayer, pieceObj);
      this.inventoryPieces.push(pieceObj);
    });
  }

  // ── Piece drop handling ──────────────────────────────────
  _handlePieceDrop(pieceObj, pieceData) {
    if (this.phase !== PHASE.ROUND_1_ACTIVE && this.phase !== PHASE.ROUND_2_ACTIVE) return;

    const bridgeLeft = GAME_WIDTH / 2 + 2;
    const bridgeRight = GAME_WIDTH / 2 + HALF_WIDTH - 2;
    const bridgeTop = BRIDGE_Y + GAP_Y_OFFSET;
    const bridgeBottom = BRIDGE_Y + GAP_Y_OFFSET + LAND_HEIGHT;

    if (
      pieceObj.x >= bridgeLeft &&
      pieceObj.x <= bridgeRight &&
      pieceObj.y >= bridgeTop &&
      pieceObj.y <= bridgeBottom
    ) {
      const newState = placePiece(this.gameState, pieceData);
      this.gameState = newState;

      recordEvent("PIECE_PLACED", this.currentRound, {
        pieceId: pieceData.id,
        numerator: pieceData.numerator,
        denominator: pieceData.denominator,
        status: newState.status,
      });

      pieceObj.destroy();
      this.inventoryPieces = this.inventoryPieces.filter((p) => p !== pieceObj);

      this._redrawPlacedPieces();

      if (newState.status === EXACT) {
        this._handleExactFill();
      } else if (newState.status === OVERFILLED) {
        this._handleOverfill(pieceObj, pieceData);
      }
    } else {
      this.tweens.add({
        targets: pieceObj,
        x: pieceObj.getData("originalX"),
        y: pieceObj.getData("originalY"),
        duration: 300,
        ease: "Back.easeOut",
      });
    }
  }

  _redrawPlacedPieces() {
    if (this.placedGraphics) {
      this.placedGraphics.destroy();
    }
    this.placedGraphics = drawPlacedPieces(this, this.gameState.placedPieces, GAME_WIDTH, BRIDGE_COLOR);
    if (this.placedGraphics) {
      this.placedGraphics.setDepth(15);
      this._addToLayer(this.roundLayer, this.placedGraphics);
    }
  }

  // ── Exact fill ───────────────────────────────────────────
  _handleExactFill() {
    if (this.phase !== PHASE.ROUND_1_ACTIVE && this.phase !== PHASE.ROUND_2_ACTIVE) return;

    if (this.currentRound === 1) this.phase = PHASE.ROUND_1_COMPLETED;
    else if (this.currentRound === 2) this.phase = PHASE.ROUND_2_COMPLETED;

    recordEvent("ROUND_COMPLETED", this.currentRound, {
      target: { ...this.gameState.target },
      placedPieces: this.gameState.placedPieces.map((p) => ({
        numerator: p.numerator,
        denominator: p.denominator,
      })),
    });

    this._disableRemainingInventory();

    if (this.currentRound <= 3) {
      lightStone(this, this.progressStones[this.currentRound - 1]);
    }

    this.isAnimating = true;
    const targetX = GAME_WIDTH / 2 + WHOLE_BRIDGE_WIDTH / 2 + 60;
    this.tweens.add({
      targets: this.hero,
      x: targetX,
      duration: 1000,
      ease: "Sine.easeInOut",
      onComplete: () => {
        celebrate(this, this.hero, () => {
          this.isAnimating = false;

          if (this.currentRound === 1) {
            this._showRound1Complete();
          } else if (this.currentRound === 2) {
            this._showRound2Revelation();
          }
        });
      },
    });
  }

  _disableRemainingInventory() {
    for (const p of this.inventoryPieces) {
      if (p && p.active) {
        p.disableInteractive();
        p.setAlpha(0.45);
      }
    }
  }

  // ── Round 1 completion ───────────────────────────────────
  _showRound1Complete() {
    const msg = this.add.text(GAME_WIDTH / 2, 200, "สะพานเสร็จแล้ว! 🎉", {
      fontSize: "32px",
      fontFamily: "Arial, sans-serif",
      color: "#ffd700",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 3,
    });
    msg.setOrigin(0.5, 0.5);
    msg.setAlpha(0);
    msg.setDepth(30);
    this._addToLayer(this.roundLayer, msg);

    this.tweens.add({
      targets: msg,
      alpha: 1,
      y: 180,
      duration: 500,
      ease: "Back.easeOut",
    });

    this._createAdvanceCue();

    this._scheduleTransition(PHASE.ROUND_1_COMPLETED, 3000, () => {
      this.startRound(2);
    });
  }

  // ── Round 2 revelation ───────────────────────────────────
  _showRound2Revelation() {
    if (this.phase !== PHASE.ROUND_2_COMPLETED) return;

    // Ghost overlay
    const ghost = drawGhostOverlay(this, GAME_WIDTH);
    ghost.setDepth(16);
    ghost.setAlpha(0);
    this.ghostGraphics = ghost;
    this._addToLayer(this.roundLayer, ghost);

    this.tweens.add({
      targets: ghost,
      alpha: 1,
      duration: 800,
      ease: "Sine.easeInOut",
      onComplete: () => {
        // Main equation: 1/2 = 2/4 at fixed position
        const eqMsg = this.add.text(GAME_WIDTH / 2, 200, "1/2 = 2/4", {
          fontSize: "36px",
          fontFamily: "Arial, sans-serif",
          color: "#ffd700",
          fontStyle: "bold",
          stroke: "#000000",
          strokeThickness: 4,
        });
        eqMsg.setOrigin(0.5, 0.5);
        eqMsg.setAlpha(0);
        eqMsg.setDepth(30);
        this._addToLayer(this.roundLayer, eqMsg);

        this.tweens.add({
          targets: eqMsg,
          alpha: 1,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 500,
          ease: "Back.easeOut",
          onComplete: () => {
            // Supporting equation: 1/4 + 1/4 at fixed non-overlapping position
            const sumMsg = this.add.text(GAME_WIDTH / 2, 240, "1/4 + 1/4", {
              fontSize: "24px",
              fontFamily: "Arial, sans-serif",
              color: "#ffffff",
              fontStyle: "bold",
              stroke: "#000000",
              strokeThickness: 3,
            });
            sumMsg.setOrigin(0.5, 0.5);
            sumMsg.setAlpha(0);
            sumMsg.setDepth(30);
            this._addToLayer(this.roundLayer, sumMsg);

            this.tweens.add({
              targets: sumMsg,
              alpha: 1,
              duration: 400,
            });

            this._createAdvanceCue();

            this._scheduleTransition(PHASE.ROUND_2_COMPLETED, 3500, () => {
              this.startRoundThree();
            });
          },
        });
      },
    });
  }

  /** Create a small glow/pulse cue for tap-to-advance. */
  _createAdvanceCue() {
    const cue = this.add.circle(GAME_WIDTH / 2, BRIDGE_Y + LAND_HEIGHT + GAP_Y_OFFSET + 30, 10, 0xffffff, 0.4);
    cue.setDepth(30);
    cue.setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: cue,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      duration: 1200,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    cue.on("pointerdown", () => {
      if (this.phase === PHASE.ROUND_1_COMPLETED) {
        this._cancelPendingTransition();
        this.startRound(2);
      } else if (this.phase === PHASE.ROUND_2_COMPLETED) {
        this._cancelPendingTransition();
        this.startRoundThree();
      }
    });

    this._addToLayer(this.roundLayer, cue);
  }

  // ── Overfill handling ────────────────────────────────────
  _handleOverfill(pieceObj, pieceData) {
    if (this.phase !== PHASE.ROUND_1_ACTIVE && this.phase !== PHASE.ROUND_2_ACTIVE) return;

    recordEvent("BRIDGE_OVERFILLED", this.currentRound, {
      pieceId: pieceData.id,
      numerator: pieceData.numerator,
      denominator: pieceData.denominator,
    });

    this.gameState = {
      ...this.gameState,
      placedPieces: this.gameState.placedPieces.slice(0, -1),
      availablePieces: [
        ...this.gameState.availablePieces,
        { ...pieceData, id: pieceData.id },
      ],
      status: UNDERFILLED,
    };

    const returnX = GAME_WIDTH / 2 - 150 + this.inventoryPieces.length * 120;
    const returnPiece = createFractionPiece(
      this,
      pieceObj.x,
      pieceObj.y,
      pieceData,
      pieceObj.getData("color"),
    );
    returnPiece.setDepth(20);
    returnPiece.setData("originalX", returnX);
    returnPiece.setData("originalY", INVENTORY_Y);
    returnPiece.setData("color", pieceObj.getData("color"));
    returnPiece.setData("pieceData", { ...pieceData });
    this._addToLayer(this.roundLayer, returnPiece);

    shakeObject(this, returnPiece, () => {
      this.tweens.add({
        targets: returnPiece,
        x: returnX,
        y: INVENTORY_Y,
        duration: 300,
        ease: "Back.easeOut",
        onComplete: () => {
          this._setupInventoryPiece(returnPiece, pieceData);
          this.inventoryPieces.push(returnPiece);
        },
      });
    });

    this._redrawPlacedPieces();
  }

  _setupInventoryPiece(pieceObj, pieceData) {
    pieceObj.setInteractive({ draggable: true, useHandCursor: true });
    pieceObj.on("dragstart", () => {
      if (this.phase !== PHASE.ROUND_1_ACTIVE && this.phase !== PHASE.ROUND_2_ACTIVE) return;
      pieceObj.setDepth(100);
      pieceObj.setScale(1.1);
      recordEvent("PIECE_PICKED", this.currentRound, {
        pieceId: pieceData.id,
        numerator: pieceData.numerator,
        denominator: pieceData.denominator,
      });
    });
    pieceObj.on("drag", (_pointer, dragX, dragY) => {
      if (this.phase !== PHASE.ROUND_1_ACTIVE && this.phase !== PHASE.ROUND_2_ACTIVE) return;
      pieceObj.x = dragX;
      pieceObj.y = dragY;
    });
    pieceObj.on("dragend", () => {
      if (this.phase !== PHASE.ROUND_1_ACTIVE && this.phase !== PHASE.ROUND_2_ACTIVE) return;
      pieceObj.setDepth(20);
      pieceObj.setScale(1);
      this._handlePieceDrop(pieceObj, pieceData);
    });
  }

  // ── Round 3: Visual choice ───────────────────────────────
  startRoundThree() {
    this._cancelPendingTransition();
    this._clearRoundLayer();

    this.currentRound = 3;
    this.gameState = createRoundState(3);
    this.phase = PHASE.ROUND_3_ACTIVE;
    this.isAnimating = false;

    if (this.roundLabel) {
      this.roundLabel.setText("รอบที่ 3");
    }

    // Round 3 has no gameplay bridge — only reference + candidate models

    // Hide progress stones (they are positioned relative to the bridge, which is absent in Round 3)
    for (const stone of this.progressStones) {
      if (stone && stone.active) {
        stone.setAlpha(0);
      }
    }
    for (const num of this._stoneLabels || []) {
      if (num && num.active) {
        num.setAlpha(0);
      }
    }

    // Instruction label (minimal)
    const refLabel = this.add.text(GAME_WIDTH / 2, 125, "เลือกสะพานที่เท่ากัน", {
      fontSize: "22px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 3,
      align: "center",
    });
    refLabel.setOrigin(0.5, 0.5);
    refLabel.setDepth(5);
    this._addToLayer(this.roundLayer, refLabel);

    // Reference model: 1/2 — centered, upper learning area
    const refModel = createFractionModel(
      this,
      GAME_WIDTH / 2,
      220,
      { numerator: 1, denominator: 2, id: "ref-1/2" },
      WHOLE_BRIDGE_WIDTH,
      BRIDGE_COLOR,
    );
    refModel.setDepth(12);
    this._addToLayer(this.roundLayer, refModel);
    this._refModel = refModel;

    // Choice models
    this._createChoiceButtons();

    // Move hero away from learning area (bottom-left)
    if (this.hero) {
      this.hero.setPosition(80, 650);
    }

    recordEvent("ROUND_STARTED", 3, {
      target: { ...this.gameState.target },
      choices: this.gameState.choices.map((c) => ({
        numerator: c.numerator,
        denominator: c.denominator,
      })),
    });
  }

  _createChoiceButtons() {
    this.choiceButtons = [];
    const choices = this.gameState.choices;
    // All Wholes use identical width for visual invariant
    const wholeWidth = WHOLE_BRIDGE_WIDTH * 0.5;
    const gap = 60;
    const totalWidth = choices.length * wholeWidth + (choices.length - 1) * gap;
    const startX = (GAME_WIDTH - totalWidth) / 2 + wholeWidth / 2;
    const y = 440;

    choices.forEach((choice, index) => {
      const x = startX + index * (wholeWidth + gap);

      const model = createFractionModel(
        this,
        x,
        y,
        choice,
        wholeWidth,
        0x8e44ad,
      );
      model.setDepth(12);

      model.on("pointerdown", () => {
        if (this.isAnimating) return;
        if (this.phase !== PHASE.ROUND_3_ACTIVE) return;
        this._handleChoiceSelected(choice, model);
      });

      model.on("pointerover", () => {
        model.setScale(1.05);
      });
      model.on("pointerout", () => {
        model.setScale(1);
      });

      this._addToLayer(this.roundLayer, model);
      this.choiceButtons.push(model);
    });
  }

  _handleChoiceSelected(choice, container) {
    if (this.phase !== PHASE.ROUND_3_ACTIVE) return;

    recordEvent("VISUAL_CHOICE_SELECTED", 3, {
      numerator: choice.numerator,
      denominator: choice.denominator,
    });

    const isCorrect = evaluateVisualChoice(
      { numerator: 1, denominator: 2 },
      { numerator: choice.numerator, denominator: choice.denominator },
    );

    if (isCorrect) {
      this._handleCorrectChoice(choice, container);
    } else {
      this._handleWrongChoice(container);
    }
  }

  _handleCorrectChoice(choice, container) {
    if (this.phase !== PHASE.ROUND_3_ACTIVE) return;
    this.isAnimating = true;

    recordEvent("EQUIVALENCE_DISCOVERED", 3, {
      reference: { numerator: 1, denominator: 2 },
      selected: { numerator: choice.numerator, denominator: choice.denominator },
    });

    // Highlight both reference and candidate
    glowPulse(this, container);
    if (this._refModel) {
      glowPulse(this, this._refModel);
    }

    const eqMsg = this.add.text(GAME_WIDTH / 2, 300, "✨ 1/2 = 2/4 ✨", {
      fontSize: "36px",
      fontFamily: "Arial, sans-serif",
      color: "#ffd700",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 4,
    });
    eqMsg.setOrigin(0.5, 0.5);
    eqMsg.setAlpha(0);
    eqMsg.setDepth(30);
    this._addToLayer(this.roundLayer, eqMsg);

    this.tweens.add({
      targets: eqMsg,
      alpha: 1,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 500,
      yoyo: true,
      ease: "Back.easeOut",
    });

    celebrate(this, this.hero, () => {
      this.isAnimating = false;
      this.phase = PHASE.GAME_COMPLETED;
      this._showGameComplete();
    });
  }

  _handleWrongChoice(container) {
    // Gentle shake — no text, child can try again
    this.tweens.add({
      targets: container,
      x: container.x - 6,
      duration: 40,
      yoyo: true,
      repeat: 2,
      ease: "Sine.easeInOut",
    });
  }

  // ── Game complete ────────────────────────────────────────
  _showGameComplete() {
    if (this.phase !== PHASE.GAME_COMPLETED) return;

    // Clear round layer and completion layer
    this._clearRoundLayer();
    this._clearCompletionLayer();

    const msg = this.add.text(GAME_WIDTH / 2, 250, "🎉 เก่งมาก! เศษส่วนเท่ากัน! 🎉", {
      fontSize: "36px",
      fontFamily: "Arial, sans-serif",
      color: "#ffd700",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 4,
      align: "center",
    });
    msg.setOrigin(0.5, 0.5);
    msg.setAlpha(0);
    msg.setDepth(30);
    this._addToLayer(this.completionLayer, msg);

    this.tweens.add({
      targets: msg,
      alpha: 1,
      duration: 500,
    });

    // Replay button
    const replayBtn = this.add.text(GAME_WIDTH / 2, 320, "▶ เล่นอีกครั้ง", {
      fontSize: "28px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 3,
      backgroundColor: "#8e44ad",
      padding: { x: 20, y: 10 },
    });
    replayBtn.setOrigin(0.5, 0.5);
    replayBtn.setDepth(30);
    replayBtn.setInteractive({ useHandCursor: true });
    this._addToLayer(this.completionLayer, replayBtn);

    replayBtn.on("pointerdown", () => {
      this._cancelPendingTransition();
      this._clearRoundLayer();
      this._clearCompletionLayer();
      this.phase = null;
      this.currentRound = 0;
      this.isAnimating = false;
      this.hero.destroy();
      this.progressStones = [];
      this.scene.restart();
      recordEvent("SESSION_REPLAYED", null, {});
    });

    replayBtn.on("pointerover", () => replayBtn.setScale(1.1));
    replayBtn.on("pointerout", () => replayBtn.setScale(1));
  }

  // ── HUD ──────────────────────────────────────────────────
  createHud() {
    // Round label (reused, not recreated)
    this.roundLabel = this.add.text(GAME_WIDTH / 2, 70, "รอบที่ 1", {
      fontSize: "20px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 2,
    });
    this.roundLabel.setOrigin(0.5, 0.5);
    this._addToLayer(this.hudLayer, this.roundLabel);

    // Reset button (reused, not recreated)
    this.resetBtn = this.add.text(GAME_WIDTH - 20, 20, "↺", {
      fontSize: "28px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 2,
    });
    this.resetBtn.setOrigin(1, 0);
    this.resetBtn.setInteractive({ useHandCursor: true });
    this._addToLayer(this.hudLayer, this.resetBtn);

    this.resetBtn.on("pointerdown", () => {
      if (this.currentRound === 3) {
        this._cancelPendingTransition();
        this.startRoundThree();
      } else {
        this._cancelPendingTransition();
        this.startRound(this.currentRound);
      }
    });

    this.resetBtn.on("pointerover", () => this.resetBtn.setScale(1.2));
    this.resetBtn.on("pointerout", () => this.resetBtn.setScale(1));

    // Progress stones
    this.progressStones = [];
    this._stoneLabels = [];
    const stoneX = GAME_WIDTH / 2 + WHOLE_BRIDGE_WIDTH / 2 + 60;
    const stoneY = BRIDGE_Y + LAND_HEIGHT + GAP_Y_OFFSET + 50;
    const spacing = 40;

    for (let i = 0; i < 3; i++) {
      const stone = this.add.graphics();
      stone.setDepth(8);
      stone.fillStyle(0x7f8c8d, 1);
      stone.fillRoundedRect(stoneX + i * spacing - 10, stoneY - 10, 20, 20, 5);
      stone.lineStyle(2, 0x95a5a6, 1);
      stone.strokeRoundedRect(stoneX + i * spacing - 10, stoneY - 10, 20, 20, 5);
      this._addToLayer(this.hudLayer, stone);

      const num = this.add.text(stoneX + i * spacing, stoneY, `${i + 1}`, {
        fontSize: "14px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        fontStyle: "bold",
      });
      num.setOrigin(0.5, 0.5);
      num.setDepth(9);
      this._addToLayer(this.hudLayer, num);

      this.progressStones.push(stone);
      this._stoneLabels.push(num);
    }
  }

  // ── Scenery ───────────────────────────────────────────────
  drawScenery() {
    // Sky gradient
    const skyGradient = this.add.graphics();
    skyGradient.setDepth(0);
    const skyColors = [0x87ceeb, 0xb0e0e6, 0xf0f8ff];
    for (let i = 0; i < GAME_HEIGHT; i++) {
      const t = i / GAME_HEIGHT;
      const colorIdx = t < 0.5 ? 0 : t < 0.8 ? 1 : 2;
      skyGradient.fillStyle(skyColors[colorIdx], 1);
      skyGradient.fillRect(0, i, GAME_WIDTH, 1);
    }
    this._addToLayer(this.worldLayer, skyGradient);

    // Distant hills
    const hills = this.add.graphics();
    hills.setDepth(1);
    hills.fillStyle(0x7ec850, 0.3);
    hills.beginPath();
    hills.moveTo(0, GAME_HEIGHT);
    for (let x = 0; x <= GAME_WIDTH; x += 20) {
      const y = GAME_HEIGHT - 80 - Math.sin(x * 0.003) * 40 - Math.sin(x * 0.007) * 20;
      hills.lineTo(x, y);
    }
    hills.lineTo(GAME_WIDTH, GAME_HEIGHT);
    hills.closePath();
    hills.fill();
    this._addToLayer(this.worldLayer, hills);

    // Closer hills
    const hills2 = this.add.graphics();
    hills2.setDepth(2);
    hills2.fillStyle(0x6abf4b, 0.5);
    hills2.beginPath();
    hills2.moveTo(0, GAME_HEIGHT);
    for (let x = 0; x <= GAME_WIDTH; x += 20) {
      const y = GAME_HEIGHT - 50 - Math.sin(x * 0.005 + 1) * 30 - Math.sin(x * 0.01 + 2) * 15;
      hills2.lineTo(x, y);
    }
    hills2.lineTo(GAME_WIDTH, GAME_HEIGHT);
    hills2.closePath();
    hills2.fill();
    this._addToLayer(this.worldLayer, hills2);

    // Ground
    const ground = this.add.graphics();
    ground.setDepth(3);
    ground.fillStyle(0x5da130, 1);
    ground.fillRect(0, GAME_HEIGHT - 30, GAME_WIDTH, 30);
    ground.fillStyle(0x4a8c28, 1);
    ground.fillRect(0, GAME_HEIGHT - 30, GAME_WIDTH, 3);
    this._addToLayer(this.worldLayer, ground);

    // River
    const river = this.add.graphics();
    river.setDepth(4);
    river.fillStyle(0x3498db, 0.6);
    river.fillRect(0, GAME_HEIGHT - 18, GAME_WIDTH, 12);
    this._addToLayer(this.worldLayer, river);

    // River highlight
    const riverHighlight = this.add.graphics();
    riverHighlight.setDepth(5);
    riverHighlight.fillStyle(0x85c1e9, 0.4);
    riverHighlight.fillRect(0, GAME_HEIGHT - 15, GAME_WIDTH, 3);
    this._addToLayer(this.worldLayer, riverHighlight);

    // Trees
    const treePositions = [100, 300, 500, 700, 900, 1100];
    treePositions.forEach((tx) => {
      const tree = this.add.graphics();
      tree.setDepth(6);
      tree.fillStyle(0x8b4513, 1);
      tree.fillRect(tx - 4, GAME_HEIGHT - 55, 8, 25);
      tree.fillStyle(0x228b22, 1);
      tree.fillTriangle(tx - 20, GAME_HEIGHT - 35, tx + 20, GAME_HEIGHT - 35, tx, GAME_HEIGHT - 70);
      tree.fillStyle(0x2ecc71, 0.7);
      tree.fillTriangle(tx - 15, GAME_HEIGHT - 45, tx + 15, GAME_HEIGHT - 45, tx, GAME_HEIGHT - 75);
      this._addToLayer(this.worldLayer, tree);
    });

    // Flowers
    const flowerPositions = [150, 400, 600, 850, 1050];
    flowerPositions.forEach((fx) => {
      const flower = this.add.graphics();
      flower.setDepth(7);
      const colors = [0xff69b4, 0xff6347, 0xffd700, 0xff1493];
      const fc = colors[Math.floor(Math.random() * colors.length)];
      flower.fillStyle(0x228b22, 1);
      flower.fillRect(fx - 1, GAME_HEIGHT - 38, 2, 8);
      flower.fillStyle(fc, 1);
      flower.fillCircle(fx, GAME_HEIGHT - 40, 4);
      this._addToLayer(this.worldLayer, flower);
    });

    // Clouds
    const cloudPositions = [
      { x: 200, y: 60 },
      { x: 600, y: 40 },
      { x: 1000, y: 70 },
    ];
    cloudPositions.forEach(({ x, y }) => {
      const cloud = this.add.graphics();
      cloud.setDepth(1);
      cloud.fillStyle(0xffffff, 0.7);
      cloud.fillCircle(x, y, 25);
      cloud.fillCircle(x + 20, y - 5, 20);
      cloud.fillCircle(x - 15, y + 5, 18);
      cloud.fillCircle(x + 30, y + 3, 15);
      this._addToLayer(this.worldLayer, cloud);
    });
  }

  // ── Hero ──────────────────────────────────────────────────
  createHero(x, y) {
    const hero = this.add.container(x, y);
    hero.setDepth(50);

    const body = this.add.graphics();
    body.fillStyle(0xf39c12, 1);
    body.fillCircle(0, 0, 18);
    hero.add(body);

    const leftEye = this.add.graphics();
    leftEye.fillStyle(0xffffff, 1);
    leftEye.fillCircle(-6, -4, 5);
    leftEye.fillStyle(0x000000, 1);
    leftEye.fillCircle(-5, -4, 2.5);
    hero.add(leftEye);

    const rightEye = this.add.graphics();
    rightEye.fillStyle(0xffffff, 1);
    rightEye.fillCircle(6, -4, 5);
    rightEye.fillStyle(0x000000, 1);
    rightEye.fillCircle(7, -4, 2.5);
    hero.add(rightEye);

    const smile = this.add.graphics();
    smile.lineStyle(2, 0x000000, 1);
    smile.beginPath();
    smile.arc(0, 2, 8, 0.2, Math.PI - 0.2, false);
    smile.strokePath();
    hero.add(smile);

    const backpack = this.add.graphics();
    backpack.fillStyle(0xe74c3c, 1);
    backpack.fillRoundedRect(10, -8, 10, 14, 3);
    hero.add(backpack);

    this.tweens.add({
      targets: hero,
      y: y - 3,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    return hero;
  }

  // ── Shutdown ──────────────────────────────────────────────
  shutdown() {
    this._cancelPendingTransition();
    this._clearRoundLayer();
    this._clearCompletionLayer();
  }
}


