import sharp from 'sharp';
import fs from 'fs';
import { SPOTTER_SCENES_BY_BOOK } from '../src/games/spotter/spotterData.js';

async function analyzeBookIsolatedComponents(bookNum) {
  const scene = SPOTTER_SCENES_BY_BOOK[String(bookNum)];
  if (!scene) return null;

  const bPath = `public${scene.baseImage}`;
  const dPath = `public${scene.diffImage}`;
  const bBuf = await sharp(bPath).raw().toBuffer({ resolveWithObject: true });
  const dBuf = await sharp(dPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = bBuf.info;

  const gw = Math.ceil(width / 8);
  const gh = Math.ceil(height / 8);
  const grid = Array.from({ length: gh }, () => new Int32Array(gw));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const dr = Math.abs(bBuf.data[idx] - dBuf.data[idx]);
      const dg = Math.abs(bBuf.data[idx+1] - dBuf.data[idx+1]);
      const db = Math.abs(bBuf.data[idx+2] - dBuf.data[idx+2]);
      if (dr + dg + db > 65) {
        grid[Math.floor(y / 8)][Math.floor(x / 8)]++;
      }
    }
  }

  // Connected components
  const visited = Array.from({ length: gh }, () => new Uint8Array(gw));
  const rawClusters = [];

  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      if (!visited[gy][gx] && grid[gy][gx] >= 6) {
        const queue = [[gx, gy]];
        visited[gy][gx] = 1;
        let minX = gx * 8, maxX = (gx + 1) * 8;
        let minY = gy * 8, maxY = (gy + 1) * 8;
        let totalWeight = 0;
        let sumX = 0, sumY = 0;

        while (queue.length > 0) {
          const [cx, cy] = queue.shift();
          const w = grid[cy][cx];
          totalWeight += w;
          sumX += cx * 8 * w;
          sumY += cy * 8 * w;
          minX = Math.min(minX, cx * 8);
          maxX = Math.max(maxX, (cx + 1) * 8);
          minY = Math.min(minY, cy * 8);
          maxY = Math.max(maxY, (cy + 1) * 8);

          for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]]) {
            const nx = cx + dx, ny = cy + dy;
            if (nx >= 0 && nx < gw && ny >= 0 && ny < gh && !visited[ny][nx] && grid[ny][nx] >= 6) {
              visited[ny][nx] = 1;
              queue.push([nx, ny]);
            }
          }
        }

        if (totalWeight > 250) {
          rawClusters.push({
            minX, maxX, minY, maxY,
            w: maxX - minX,
            h: maxY - minY,
            centerX: Math.round((minX + maxX) / 2),
            centerY: Math.round((minY + maxY) / 2),
            weightedX: Math.round(sumX / totalWeight),
            weightedY: Math.round(sumY / totalWeight),
            totalWeight
          });
        }
      }
    }
  }

  return {
    bookNum,
    title: scene.titleZh,
    rawClusters,
    targetItems: scene.targetItems
  };
}

async function run() {
  for (let b = 1; b <= 8; b++) {
    const res = await analyzeBookIsolatedComponents(b);
    if (!res) continue;
    console.log(`\n=================== BOOK ${b}: ${res.title} ===================`);
    console.log(`Raw Diff Clusters (${res.rawClusters.length}):`);
    res.rawClusters.sort((a, b) => a.minX - b.minX);
    res.rawClusters.forEach((c, idx) => {
      console.log(`  [C${idx+1}] BBox: [${c.minX}, ${c.minY}] - [${c.maxX}, ${c.maxY}] (${c.w}x${c.h}) Center: (${c.centerX}, ${c.centerY}) Pts: ${c.totalWeight}`);
    });
    console.log(`Current Target Items in Config (${res.targetItems.length}):`);
    res.targetItems.forEach((t, idx) => {
      console.log(`  [T${idx+1}] ${t.word.padEnd(12)} (${t.wordZh}): current=(${t.x}, ${t.y}, r=${t.radius})`);
    });
  }
}
run();
