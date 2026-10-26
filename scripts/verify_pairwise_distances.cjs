const targets = [
  { name: 'bread', x: 65, y: 615, rx: 55, ry: 120 },
  { name: 'guitar', x: 445, y: 530, rx: 40, ry: 90 },
  { name: 'palette', x: 560, y: 620, rx: 65, ry: 42 },
  { name: 'painting', x: 765, y: 385, rx: 70, ry: 100 },
  { name: 'cake', x: 755, y: 625, rx: 60, ry: 45 },
  { name: 'flag', x: 995, y: 60, rx: 55, ry: 35 },
  { name: 'bell', x: 1125, y: 290, rx: 55, ry: 85 },
  { name: 'camera', x: 1120, y: 695, rx: 60, ry: 50 }
];

console.log('=== 28 PAIRWISE DISTANCE & OVERLAP VERIFICATION ===');
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
  }
}

console.log(`Verification Result: Total Overlaps = ${overlaps} / 28 pairs`);
console.log(`Smallest Gap: ${minGap.toFixed(1)}px (${minPair})`);
