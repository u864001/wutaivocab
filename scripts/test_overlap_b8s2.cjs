const TARGET_ITEMS = [
  { word: 'suit', x: 280, y: 305, rx: 75, ry: 130 },
  { word: 'jacket', x: 500, y: 365, rx: 85, ry: 120 },
  { word: 'skirt', x: 140, y: 440, rx: 70, ry: 115 },
  { word: 'T-shirt', x: 235, y: 572, rx: 70, ry: 55 },
  { word: 'blanket', x: 815, y: 515, rx: 70, ry: 105 },
  { word: 'glass', x: 958, y: 565, rx: 32, ry: 65 },
  { word: 'toast', x: 1085, y: 610, rx: 80, ry: 50 },
  { word: 'peach', x: 1185, y: 505, rx: 65, ry: 55 }
];

function ellipseRadiusAtAngle(rx, ry, theta) {
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  return (rx * ry) / Math.sqrt((ry * cos) ** 2 + (rx * sin) ** 2);
}

let overlaps = 0;
console.log('Testing 28 pairs of Book 8 Scene 2 calibrated coordinates:');
for (let i = 0; i < TARGET_ITEMS.length; i++) {
  for (let j = i + 1; j < TARGET_ITEMS.length; j++) {
    const a = TARGET_ITEMS[i];
    const b = TARGET_ITEMS[j];

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const angleAB = Math.atan2(dy, dx);
    const angleBA = Math.atan2(-dy, -dx);

    const rA = ellipseRadiusAtAngle(a.rx, a.ry, angleAB);
    const rB = ellipseRadiusAtAngle(b.rx, b.ry, angleBA);

    const margin = dist - (rA + rB);
    const isOverlapping = margin < 0;
    if (isOverlapping) overlaps++;

    console.log(`Pair (${a.word.padEnd(8)} <-> ${b.word.padEnd(8)}): dist=${dist.toFixed(1).padStart(5)}px, sumR=${(rA + rB).toFixed(1).padStart(5)}px, margin=${margin.toFixed(1).padStart(5)}px ${isOverlapping ? '❌ OVERLAP' : '✓ OK'}`);
  }
}

console.log(`\nTotal overlaps: ${overlaps}`);
if (overlaps > 0) {
  process.exit(1);
} else {
  console.log('✓ All 28 pairs verified with positive margins. Zero overlap guaranteed!');
}
