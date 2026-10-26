const targets = [
  { word: 'chair', x: 135, y: 665, rx: 135, ry: 95 },
  { word: 'hat', x: 265, y: 275, rx: 45, ry: 65 },
  { word: 'bus', x: 395, y: 425, rx: 95, ry: 75 },
  { word: 'table', x: 482, y: 685, rx: 88, ry: 75 },
  { word: 'box', x: 645, y: 485, rx: 60, ry: 65 },
  { word: 'bag', x: 900, y: 660, rx: 85, ry: 80 },
  { word: 'clock', x: 1135, y: 170, rx: 75, ry: 75 },
  { word: 'basket', x: 1220, y: 650, rx: 95, ry: 85 }
];

console.log('Testing pairwise elliptical overlaps among', targets.length, 'targets for Book 4 Scene 2:');
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
  console.log('🎉 PERFECT ZERO OVERLAP VERIFIED FOR BOOK 4 SCENE 2!');
} else {
  console.error('❌ Overlap detected!');
  process.exit(1);
}
