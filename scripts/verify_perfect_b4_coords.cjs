const targets = [
  { word: 'chair', x: 185, y: 598, rx: 140, ry: 110 },
  { word: 'hat', x: 383, y: 219, rx: 65, ry: 80 },
  { word: 'bus', x: 540, y: 322, rx: 115, ry: 80 },
  { word: 'table', x: 635, y: 620, rx: 80, ry: 90 },
  { word: 'box', x: 885, y: 382, rx: 90, ry: 70 },
  { word: 'bag', x: 890, y: 635, rx: 85, ry: 85 },
  { word: 'clock', x: 1147, y: 153, rx: 75, ry: 75 },
  { word: 'basket', x: 1210, y: 645, rx: 100, ry: 90 }
];

console.log('Testing pairwise elliptical overlaps:');
let overlaps = 0;

for (let i = 0; i < targets.length; i++) {
  for (let j = i + 1; j < targets.length; j++) {
    const a = targets[i];
    const b = targets[j];
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dist = Math.hypot(dx, dy);
    
    const angle = Math.atan2(dy, dx);
    const ra = Math.hypot(a.rx * Math.cos(angle), a.ry * Math.sin(angle));
    const rb = Math.hypot(b.rx * Math.cos(angle), b.ry * Math.sin(angle));
    const gap = dist - (ra + rb);
    
    console.log(`  ${a.word} <-> ${b.word}: dist=${dist.toFixed(1)}px, sumOfRadii=${(ra+rb).toFixed(1)}px, gap=${gap.toFixed(1)}px ${gap < 0 ? '❌ OVERLAP' : '✅ OK'}`);
    if (gap < 0) overlaps++;
  }
}

console.log('\nTotal Overlaps:', overlaps);
if (overlaps === 0) {
  console.log('🎉 PERFECT ZERO OVERLAP VERIFIED!');
} else {
  console.error('❌ Overlap detected!');
}
