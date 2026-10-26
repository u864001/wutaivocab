const targets = [
  { word: 'cloud', x: 410, y: 100, rx: 110, ry: 65 },
  { word: 'milk', x: 124, y: 493, rx: 50, ry: 75 },
  { word: 'tea', x: 440, y: 584, rx: 75, ry: 58 },
  { word: 'sandwich', x: 648, y: 553, rx: 72, ry: 52 },
  { word: 'rice', x: 820, y: 553, rx: 58, ry: 52 },
  { word: 'watermelon', x: 980, y: 625, rx: 90, ry: 80 },
  { word: 'water', x: 1228, y: 468, rx: 48, ry: 80 },
  { word: 'orange', x: 1240, y: 680, rx: 90, ry: 60 }
];

console.log('Testing pairwise elliptical overlaps among', targets.length, 'targets:');
let overlaps = 0;

for (let i = 0; i < targets.length; i++) {
  for (let j = i + 1; j < targets.length; j++) {
    const a = targets[i];
    const b = targets[j];
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dist = Math.hypot(dx, dy);
    
    // Approximate collision distance along angle
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
  process.exit(1);
}
