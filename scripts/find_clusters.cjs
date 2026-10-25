const sharp = require('sharp');
const fs = require('fs');

async function findClusters() {
  const maskFile = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_diff_mask.jpg';
  const meta = await sharp(maskFile).metadata();
  const raw = await sharp(maskFile).raw().toBuffer();
  const w = meta.width;
  const h = meta.height;

  // Grid binning: 16x16 blocks
  const blockSize = 16;
  const gw = Math.ceil(w / blockSize);
  const gh = Math.ceil(h / blockSize);
  const grid = new Int32Array(gw * gh);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (raw[y * w + x] > 128) {
        const gx = Math.floor(x / blockSize);
        const gy = Math.floor(y / blockSize);
        grid[gy * gw + gx]++;
      }
    }
  }

  // Find blocks with significant diff
  const activeBlocks = [];
  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      if (grid[gy * gw + gx] > 15) {
        activeBlocks.push({ gx, gy, count: grid[gy * gw + gx], x: gx * blockSize + blockSize/2, y: gy * blockSize + blockSize/2 });
      }
    }
  }

  // Simple cluster grouping with distance threshold
  const clusters = [];
  const visited = new Set();
  for (let i = 0; i < activeBlocks.length; i++) {
    if (visited.has(i)) continue;
    const cluster = [activeBlocks[i]];
    visited.add(i);

    for (let j = 0; j < cluster.length; j++) {
      const b1 = cluster[j];
      for (let k = 0; k < activeBlocks.length; k++) {
        if (visited.has(k)) continue;
        const b2 = activeBlocks[k];
        const dx = b1.gx - b2.gx;
        const dy = b1.gy - b2.gy;
        if (Math.abs(dx) <= 2 && Math.abs(dy) <= 2) {
          visited.add(k);
          cluster.push(b2);
        }
      }
    }
    if (cluster.length >= 4) {
      clusters.push(cluster);
    }
  }

  console.log('Total clusters found:', clusters.length);
  clusters.sort((a, b) => b.length - a.length);

  clusters.forEach((c, idx) => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    let sumX = 0, sumY = 0, totalCount = 0;
    c.forEach(b => {
      minX = Math.min(minX, b.gx * blockSize);
      maxX = Math.max(maxX, (b.gx + 1) * blockSize);
      minY = Math.min(minY, b.gy * blockSize);
      maxY = Math.max(maxY, (b.gy + 1) * blockSize);
      sumX += b.x * b.count;
      sumY += b.y * b.count;
      totalCount += b.count;
    });
    const cx = Math.round(sumX / totalCount);
    const cy = Math.round(sumY / totalCount);
    const rx = Math.round((maxX - minX) / 2);
    const ry = Math.round((maxY - minY) / 2);
    console.log(`Cluster ${idx+1}: center=(${cx}, ${cy}), rx=${rx}, ry=${ry}, bounds=[${minX},${minY} - ${maxX},${maxY}], pixels=${totalCount}`);
  });
}

findClusters().catch(console.error);
