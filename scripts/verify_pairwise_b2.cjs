const TARGET_ITEMS = [
  { word: 'heart', wordZh: '愛心', x: 190, y: 243, rx: 110, ry: 142, rotate: 10 },
  { word: 'cat', wordZh: '貓咪', x: 270, y: 615, rx: 105, ry: 60 },
  { word: 'dog', wordZh: '小狗', x: 410, y: 480, rx: 78, ry: 92 },
  { word: 'fish', wordZh: '魚', x: 684, y: 508, rx: 150, ry: 52 },
  { word: 'card', wordZh: '卡片', x: 948, y: 612, rx: 65, ry: 95 },
  { word: 'gift', wordZh: '禮物', x: 1150, y: 430, rx: 78, ry: 85 },
  { word: 'flower', wordZh: '花朵', x: 1270, y: 630, rx: 105, ry: 125 },
  { word: 'bird', wordZh: '小鳥', x: 1265, y: 120, rx: 70, ry: 50 }
];

function ellipseRadiusAtAngle(rx, ry, theta, rot = 0) {
  const phi = theta - (rot * Math.PI) / 180;
  const cos = Math.cos(phi);
  const sin = Math.sin(phi);
  return (rx * ry) / Math.sqrt((ry * cos) ** 2 + (rx * sin) ** 2);
}

console.log('Testing 28 pairs of Book 2 Scene 1 coordinates (Wider Right Heart):');
let overlaps = 0;
for (let i = 0; i < TARGET_ITEMS.length; i++) {
  for (let j = i + 1; j < TARGET_ITEMS.length; j++) {
    const a = TARGET_ITEMS[i];
    const b = TARGET_ITEMS[j];

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.hypot(dx, dy);

    const angleAB = Math.atan2(dy, dx);
    const angleBA = Math.atan2(-dy, -dx);

    const rA = ellipseRadiusAtAngle(a.rx, a.ry, angleAB, a.rotate || 0);
    const rB = ellipseRadiusAtAngle(b.rx, b.ry, angleBA, b.rotate || 0);

    const margin = dist - (rA + rB);
    const isOverlapping = margin < 0;
    if (isOverlapping) overlaps++;

    console.log(`Pair (${a.word.padEnd(8)} <-> ${b.word.padEnd(8)}): dist=${dist.toFixed(1).padStart(5)}px, sumR=${(rA + rB).toFixed(1).padStart(5)}px, margin=${margin.toFixed(1).padStart(5)}px ${isOverlapping ? '❌ OVERLAP' : '✓ OK'}`);
  }
}
console.log('\nTotal overlaps:', overlaps);
