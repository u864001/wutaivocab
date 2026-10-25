const sharp = require('sharp');
const fs = require('fs');

async function findDiffClusters(baseFile, diffFile, threshold = 25) {
  const baseBuf = await sharp(baseFile).raw().toBuffer();
  const diffBuf = await sharp(diffFile).raw().toBuffer();
  const meta = await sharp(baseFile).metadata();
  const { width, height, channels } = meta;

  const diffPixels = [];
  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      const idx = (y * width + x) * channels;
      const dr = Math.abs(baseBuf[idx] - diffBuf[idx]);
      const dg = Math.abs(baseBuf[idx + 1] - diffBuf[idx + 1]);
      const db = Math.abs(baseBuf[idx + 2] - diffBuf[idx + 2]);
      const diffVal = (dr + dg + db) / 3;
      if (diffVal > threshold) {
        diffPixels.push({ x, y, diffVal });
      }
    }
  }

  // Simple grid clustering (32x32 blocks)
  const blockSize = 48;
  const grid = {};
  for (const p of diffPixels) {
    const gx = Math.floor(p.x / blockSize);
    const gy = Math.floor(p.y / blockSize);
    const key = `${gx},${gy}`;
    grid[key] = (grid[key] || 0) + 1;
  }

  // Find connected components
  const visited = new Set();
  const clusters = [];

  for (const key of Object.keys(grid)) {
    if (visited.has(key)) continue;
    if (grid[key] < 5) continue; // ignore noise

    const clusterKeys = [];
    const queue = [key];
    visited.add(key);

    while (queue.length > 0) {
      const cur = queue.shift();
      clusterKeys.push(cur);
      const [gx, gy] = cur.split(',').map(Number);
      const neighbors = [
        `${gx+1},${gy}`, `${gx-1},${gy}`, `${gx},${gy+1}`, `${gx},${gy-1}`,
        `${gx+1},${gy+1}`, `${gx-1},${gy-1}`, `${gx+1},${gy-1}`, `${gx-1},${gy+1}`
      ];
      for (const n of neighbors) {
        if (!visited.has(n) && (grid[n] || 0) >= 4) {
          visited.add(n);
          queue.push(n);
        }
      }
    }

    // Compute bounding box and centroid of cluster
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    let sumX = 0, sumY = 0, totalPts = 0;

    for (const ck of clusterKeys) {
      const [gx, gy] = ck.split(',').map(Number);
      const bx = gx * blockSize;
      const by = gy * blockSize;
      minX = Math.min(minX, bx);
      maxX = Math.max(maxX, bx + blockSize);
      minY = Math.min(minY, by);
      maxY = Math.max(maxY, by + blockSize);
      sumX += (bx + blockSize / 2) * grid[ck];
      sumY += (by + blockSize / 2) * grid[ck];
      totalPts += grid[ck];
    }

    if (totalPts > 15) {
      clusters.push({
        cx: Math.round(sumX / totalPts),
        cy: Math.round(sumY / totalPts),
        minX, maxX, minY, maxY,
        w: maxX - minX,
        h: maxY - minY,
        totalPts
      });
    }
  }

  // Sort clusters from left to right (by cx)
  clusters.sort((a, b) => a.cx - b.cx);
  return clusters;
}

async function inspectAllBooks() {
  for (let b = 2; b <= 8; b++) {
    const baseFile = `public/assets/spotter/book${b}_base.jpg`;
    const diffFile = `public/assets/spotter/book${b}_diff.jpg`;
    if (!fs.existsSync(baseFile) || !fs.existsSync(diffFile)) continue;
    console.log(`\n=================== BOOK ${b} ===================`);
    const clusters = await findDiffClusters(baseFile, diffFile);
    console.log(`Found ${clusters.length} difference clusters:`);
    clusters.forEach((c, i) => {
      console.log(`  Cluster ${i+1}: Center (${c.cx}, ${c.cy}), Box [${c.minX}, ${c.minY}, ${c.w}x${c.h}], pts: ${c.totalPts}`);
    });
  }
}

inspectAllBooks().catch(console.error);
