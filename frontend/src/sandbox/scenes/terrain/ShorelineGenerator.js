function offsetEdge(edge, distance, direction) {
  return edge.map((point, index) => {
    const previous = edge[Math.max(0, index - 1)];
    const next = edge[Math.min(edge.length - 1, index + 1)];
    const tangentX = next.x - previous.x;
    const tangentY = next.y - previous.y;
    const length = Math.max(1, Math.hypot(tangentX, tangentY));
    const normalX = (-tangentY / length) * direction;
    const normalY = (tangentX / length) * direction;

    return {
      x: point.x + normalX * distance,
      y: point.y + normalY * distance,
    };
  });
}

function drawBand(graphics, innerEdge, outerEdge, color, alpha) {
  graphics.fillStyle(color, alpha);
  graphics.fillPoints([...innerEdge, ...outerEdge.slice().reverse()], true);
}

function pointAt(edge, index) {
  return edge[Math.max(0, Math.min(edge.length - 1, index))];
}

export function createShorelines(scene, geometry, depth = -9) {
  const container = scene.add.container(0, 0).setDepth(depth);
  const cliffFaces = scene.add.graphics();
  const wetEdges = scene.add.graphics();
  const grassCaps = scene.add.graphics();
  const stones = scene.add.graphics();

  const leftWetOuter = offsetEdge(geometry.leftEdge, 7, -1);
  const rightWetOuter = offsetEdge(geometry.rightEdge, 7, 1);
  const leftRockOuter = offsetEdge(geometry.leftEdge, 27, -1);
  const rightRockOuter = offsetEdge(geometry.rightEdge, 25, 1);
  const leftGrassOuter = offsetEdge(geometry.leftEdge, 34, -1);
  const rightGrassOuter = offsetEdge(geometry.rightEdge, 32, 1);

  drawBand(cliffFaces, leftWetOuter, leftRockOuter, 0x455353, 0.98);
  drawBand(cliffFaces, rightWetOuter, rightRockOuter, 0x4b5957, 0.98);
  drawBand(wetEdges, geometry.leftEdge, leftWetOuter, 0x789d94, 0.78);
  drawBand(wetEdges, geometry.rightEdge, rightWetOuter, 0x73968e, 0.74);
  drawBand(grassCaps, leftRockOuter, leftGrassOuter, 0x667a5b, 0.94);
  drawBand(grassCaps, rightRockOuter, rightGrassOuter, 0x70825f, 0.92);

  const crossingTop = geometry.crossingProtectionZone.y;
  const crossingBottom = crossingTop + geometry.crossingProtectionZone.height;
  const stoneRows = [3, 6, 9, 19, 23, 27, 30];

  stoneRows.forEach((edgeIndex, index) => {
    const left = pointAt(leftRockOuter, edgeIndex);
    const right = pointAt(rightRockOuter, edgeIndex + (index % 2));
    const inCrossing = left.y >= crossingTop && left.y <= crossingBottom;
    if (inCrossing) return;

    stones.fillStyle(index % 2 === 0 ? 0x7f8c86 : 0x687572, 0.96);
    stones.fillEllipse(left.x - 3, left.y + 4, 13 + (index % 3) * 3, 9 + (index % 2) * 3);
    if (index % 3 !== 1) {
      stones.fillEllipse(right.x + 3, right.y - 5, 11 + ((index + 1) % 3) * 3, 8 + (index % 2) * 2);
    }
  });

  const ledgeRows = [5, 20, 28];
  ledgeRows.forEach((edgeIndex, index) => {
    const left = pointAt(leftGrassOuter, edgeIndex);
    const right = pointAt(rightGrassOuter, edgeIndex + 1);
    grassCaps.fillStyle(index % 2 === 0 ? 0x7d915f : 0x72865a, 0.96);
    grassCaps.fillEllipse(left.x - 8, left.y, 32, 17);
    grassCaps.fillEllipse(right.x + 8, right.y + 5, 28, 15);
  });

  container.add([cliffFaces, wetEdges, grassCaps, stones]);
  return container;
}
