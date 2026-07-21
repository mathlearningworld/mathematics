function isCrossingSegment(segment, zone) {
  return segment.centerY >= zone.y && segment.centerY <= zone.y + zone.height;
}

function addBankFace(graphics, segment, side, width, color) {
  const leftSide = side === "left";
  const topEdge = leftSide ? segment.topLeft : segment.topRight;
  const bottomEdge = leftSide ? segment.bottomLeft : segment.bottomRight;
  const direction = leftSide ? -1 : 1;

  graphics.fillStyle(color, 0.98);
  graphics.fillPoints([
    { x: topEdge, y: segment.top - 1 },
    { x: topEdge + direction * width, y: segment.top - 1 },
    { x: bottomEdge + direction * (width + (segment.index % 2 === 0 ? 6 : -4)), y: segment.top + segment.height + 1 },
    { x: bottomEdge, y: segment.top + segment.height + 1 },
  ], true);
}

export function createShorelines(scene, geometry, depth = -9) {
  const container = scene.add.container(0, 0).setDepth(depth);
  const cliffFaces = scene.add.graphics();
  const wetEdges = scene.add.graphics();
  const caps = scene.add.graphics();
  const stones = scene.add.graphics();

  geometry.segments.forEach((segment, index) => {
    const crossing = isCrossingSegment(segment, geometry.crossingProtectionZone);
    const leftWidth = crossing ? 10 : 25 + ((index * 7) % 19);
    const rightWidth = crossing ? 10 : 23 + ((index * 11) % 22);

    addBankFace(cliffFaces, segment, "left", leftWidth, index % 3 === 0 ? 0x3e4d4d : 0x485657);
    addBankFace(cliffFaces, segment, "right", rightWidth, index % 4 === 0 ? 0x53605c : 0x455454);

    wetEdges.lineStyle(crossing ? 4 : 7, 0x75978d, crossing ? 0.56 : 0.76);
    wetEdges.lineBetween(segment.topLeft, segment.top, segment.bottomLeft, segment.top + segment.height);
    wetEdges.lineBetween(segment.topRight, segment.top, segment.bottomRight, segment.top + segment.height);

    if (!crossing && index % 2 === 0) {
      const leftX = segment.left - leftWidth * 0.55;
      const rightX = segment.right + rightWidth * 0.55;
      caps.fillStyle(index % 4 === 0 ? 0x708262 : 0x65775d, 0.94);
      caps.fillRoundedRect(leftX - 15, segment.centerY - 12, 30, 20, 7);
      if (index % 4 !== 2) caps.fillRoundedRect(rightX - 14, segment.centerY + 4, 28, 18, 6);
    }

    if (!crossing && index % 3 === 1) {
      stones.fillStyle(index % 2 === 0 ? 0x82908a : 0x6b7775, 0.92);
      stones.fillCircle(segment.left - 7, segment.centerY + 13, 6 + (index % 3));
      stones.fillCircle(segment.right + 8, segment.centerY - 10, 5 + ((index + 1) % 3));
    }
  });

  container.add([cliffFaces, wetEdges, caps, stones]);
  return container;
}
