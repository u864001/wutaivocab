const TARGETS = [
  { word: 'chair', x: 175, y: 590, rx: 140, ry: 110 },
  { word: 'hat', x: 430, y: 235, rx: 50, ry: 60 },
  { word: 'bus', x: 510, y: 380, rx: 110, ry: 75 },
  { word: 'table', x: 630, y: 675, rx: 85, ry: 75 },
  { word: 'box', x: 850, y: 365, rx: 75, ry: 65 },
  { word: 'bag', x: 935, y: 655, rx: 80, ry: 80 },
  { word: 'clock', x: 912, y: 175, rx: 55, ry: 55 },
  { word: 'basket', x: 1215, y: 615, rx: 95, ry: 85 }
];

console.log('Testing pairwise elliptical overlaps:');
let totalOverlaps = 0;

for (let i = 0; i < TARGETS.length; i++) {
  for (let j = i + 1; j < TARGETS.length; j++) {
    const a = TARGETS[i];
    const b = TARGETS[j];
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const angle = Math.atan2(dy, dx);
    const rA = (a.rx * a.ry) / Math.sqrt((a.ry * Math.cos(angle)) ** 2 + (a.rx * Math.sin(angle)) ** 2);
    const rB = (b.rx * b.ry) / Math.sqrt((b.ry * Math.cos(angle)) ** 2 + (b.rx * Math.sin(angle)) ** 2);

    const sumRadii = rA + rB;
    const gap = dist - sumRadii;

    const isOverlap = gap < 0;
    if (isOverlap) {
      totalOverlaps++;
      console.log(`  ❌ OVERLAP: ${a.word} <-> ${b.word}: dist=${dist.toFixed(1)}px, sumOfRadii=${sumRadii.toFixed(1)}px, overlap=${(-gap).toFixed(1)}px`);
    } else {
      console.log(`  ${a.word} <-> ${b.word}: dist=${dist.toFixed(1)}px, sumOfRadii=${sumRadii.toFixed(1)}px, gap=${gap.toFixed(1)}px ✅ OK`);
    }
  }
}

console.log(`\nTotal Overlaps: ${totalOverlaps}`);
if (totalOverlaps === 0) {
  console.log('🎉 PERFECT ZERO OVERLAP VERIFIED!');
} else {
  console.log('⚠️ NEED ADJUSTMENT');
}
