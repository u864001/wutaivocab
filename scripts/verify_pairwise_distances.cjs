const targets = [
  { name: 'bread', x: 65, y: 615, rx: 55, ry: 120 },
  { name: 'guitar', x: 445, y: 530, rx: 40, ry: 90 },
  { name: 'brush', x: 560, y: 620, rx: 65, ry: 42 },
  { name: 'painting', x: 765, y: 415, rx: 78, ry: 115 },
  { name: 'cake', x: 755, y: 625, rx: 60, ry: 45 },
  { name: 'flag', x: 995, y: 60, rx: 55, ry: 35 },
  { name: 'bell', x: 1125, y: 290, rx: 55, ry: 85 },
  { name: 'camera', x: 1120, y: 695, rx: 60, ry: 50 }
];

console.log('=== 28 PAIRWISE DISTANCE & OVERLAP VERIFICATION (ADJUSTED PAINTING) ===');
let overlaps = 0;
let minGap = Infinity;
let minPair = '';

for (let i = 0; i < targets.length; i++) {
  for (let j = i + 1; j < targets.length; j++) {
    const t1 = targets[i];
    const t2 = targets[j];
    const dx = t1.x - t2.x;
    const dy = t1.y - t2.y;
    const centerDist = Math.hypot(dx, dy);

    const angle = Math.atan2(dy, dx);
    const r1 = Math.hypot(t1.rx * Math.cos(angle), t1.ry * Math.sin(angle));
    const r2 = Math.hypot(t2.rx * Math.cos(angle), t2.ry * Math.sin(angle));
    const gap = centerDist - (r1 + r2);

    if (gap < minGap) {
      minGap = gap;
      minPair = `${t1.name} <-> ${t2.name}`;
    }

    if (gap <= 0) overlaps++;
    console.log(`Pair: ${t1.name.padEnd(8)} <-> ${t2.name.padEnd(8)}: CenterDist=${centerDist.toFixed(1)}px, BoundSum=${(r1+r2).toFixed(1)}px, Gap=${gap.toFixed(1)}px ${gap <= 0 ? 'OVERLAP!' : 'OK'}`);
  }
}

console.log(`\nVerification Result: Total Overlaps = ${overlaps} / 28 pairs`);
console.log(`Smallest Gap: ${minGap.toFixed(1)}px (${minPair})`);
