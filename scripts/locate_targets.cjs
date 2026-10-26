const sharp = require('sharp');

async function locateEachTarget() {
  const baseImg = await sharp('public/assets/spotter/book4_scene2_base.jpg').raw().toBuffer({ resolveWithObject: true });
  const diffAImg = await sharp('public/assets/spotter/book4_scene2_diff.jpg').raw().toBuffer({ resolveWithObject: true });
  
  const w = baseImg.info.width, h = baseImg.info.height;
  const bData = baseImg.data;
  const aData = diffAImg.data;

  // Compute pixel diffs > 35
  const diffMap = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 3;
      const dr = Math.abs(bData[idx] - aData[idx]);
      const dg = Math.abs(bData[idx+1] - aData[idx+1]);
      const db = Math.abs(bData[idx+2] - aData[idx+2]);
      if (Math.max(dr, dg, db) > 35) {
        diffMap[y * w + x] = 1;
      }
    }
  }

  // Find clusters using 16x16 grid
  const gSize = 16;
  const gw = Math.ceil(w / gSize);
  const gh = Math.ceil(h / gSize);
  const gDiff = new Int32Array(gw * gh);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (diffMap[y * w + x]) {
        gDiff[Math.floor(y/gSize) * gw + Math.floor(x/gSize)]++;
      }
    }
  }

  const gActive = new Uint8Array(gw * gh);
  for (let i = 0; i < gw * gh; i++) {
    if (gDiff[i] > 15) gActive[i] = 1;
  }

  const clusters = [];
  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      const gidx = gy * gw + gx;
      if (!gActive[gidx]) continue;

      let minGx = gx, maxGx = gx, minGy = gy, maxGy = gy;
      let count = 0;
      const queue = [{gx, gy}];
      gActive[gidx] = 0;

      while (queue.length > 0) {
        const curr = queue.shift();
        count += gDiff[curr.gy * gw + curr.gx];
        minGx = Math.min(minGx, curr.gx);
        maxGx = Math.max(maxGx, curr.gx);
        minGy = Math.min(minGy, curr.gy);
        maxGy = Math.max(maxGy, curr.gy);

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = curr.gy + dy, nx = curr.gx + dx;
            if (nx >= 0 && nx < gw && ny >= 0 && ny < gh) {
              const nidx = ny * gw + nx;
              if (gActive[nidx]) {
                gActive[nidx] = 0;
                queue.push({gx: nx, gy: ny});
              }
            }
          }
        }
      }

      if (count > 80) {
        const minX = minGx * gSize;
        const maxX = Math.min(w, (maxGx + 1) * gSize);
        const minY = minGy * gSize;
        const maxY = Math.min(h, (maxGy + 1) * gSize);
        const cx = Math.round((minX + maxX) / 2);
        const cy = Math.round((minY + maxY) / 2);
        clusters.push({ minX, maxX, minY, maxY, cx, cy, count });
      }
    }
  }

  clusters.sort((a, b) => a.minX - b.minX);
  console.log('=== CLUSTERS FOUND (Base vs Diff A) ===');
  clusters.forEach((c, idx) => {
    console.log(`Cluster ${idx+1}: Center=(${c.cx}, ${c.cy}) BBox=[x: ${c.minX}..${c.maxX}, y: ${c.minY}..${c.maxY}] count=${c.count}`);
  });
}

locateEachTarget().catch(console.error);
