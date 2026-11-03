import sharp from 'sharp';
import fs from 'fs';

async function processHead() {
  const inputPath = 'C:/Users/user/.gemini/antigravity/brain/6460052f-13cf-43d2-82f1-87adffb86cdb/hundred_pace_snake_head_v2_1793668276628.jpg';
  const outputPath = 'public/assets/snake/snake_head_indigenous.webp';

  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // BFS alpha extraction from borders
  const visited = new Uint8Array(width * height);
  const queue = [];

  function isWhite(x, y) {
    const idx = (y * width + x) * channels;
    const r = data[idx], g = data[idx+1], b = data[idx+2];
    return r >= 238 && g >= 238 && b >= 238;
  }

  for (let x = 0; x < width; x++) {
    if (isWhite(x, 0)) { queue.push(x, 0); visited[x] = 1; }
    if (isWhite(x, height - 1)) { queue.push(x, height - 1); visited[(height - 1) * width + x] = 1; }
  }
  for (let y = 0; y < height; y++) {
    if (isWhite(0, y) && !visited[y * width]) { queue.push(0, y); visited[y * width] = 1; }
    if (isWhite(width - 1, y) && !visited[y * width + (width - 1)]) { queue.push(width - 1, y); visited[y * width + (width - 1)] = 1; }
  }

  let qHead = 0;
  while (qHead < queue.length) {
    const cx = queue[qHead++];
    const cy = queue[qHead++];
    const neighbors = [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]];
    for (let i = 0; i < 4; i++) {
      const nx = neighbors[i][0];
      const ny = neighbors[i][1];
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nidx = ny * width + nx;
        if (!visited[nidx] && isWhite(nx, ny)) {
          visited[nidx] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }

  // Find tight bounds of the head (stop around Y=720 in 1024x1024 space = neck collar)
  // In the original 1024x1024:
  // minY ~ 37 (snout)
  // Max cheek is around Y=580. Neck tapers down to Y=720.
  const neckCutY = 720;
  let minX = width, maxX = 0;

  for (let y = 37; y < neckCutY; y++) {
    for (let x = 0; x < width; x++) {
      if (!visited[y * width + x]) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }
  }

  const centerX = Math.round((minX + maxX) / 2);
  const halfW = Math.max(centerX - minX, maxX - centerX);
  const cropLeft = Math.max(0, centerX - halfW);
  const cropWidth = halfW * 2 + 1;
  const cropTop = 35;
  const cropHeight = neckCutY - cropTop + 1;

  const rgba = Buffer.alloc(cropWidth * cropHeight * 4);

  for (let cy = 0; cy < cropHeight; cy++) {
    const y = cropTop + cy;
    for (let cx = 0; cx < cropWidth; cx++) {
      const x = cropLeft + cx;
      const sidx = (y * width + x) * channels;
      const didx = (cy * cropWidth + cx) * 4;

      rgba[didx] = data[sidx];
      rgba[didx + 1] = data[sidx + 1];
      rgba[didx + 2] = data[sidx + 2];

      const vidx = y * width + x;
      if (visited[vidx]) {
        rgba[didx + 3] = 0;
      } else {
        const r = data[sidx], g = data[sidx + 1], b = data[sidx + 2];
        const brightness = (r + g + b) / 3;
        let alpha = brightness > 242 ? Math.max(0, Math.min(255, Math.round((255 - brightness) * 20))) : 255;

        // Soft curved collar blend at the very bottom (last 50px of neck)
        const distFromBottom = cropHeight - 1 - cy;
        if (distFromBottom < 45) {
          const fade = Math.sin((distFromBottom / 45) * (Math.PI / 2));
          alpha = Math.round(alpha * fade);
        }

        rgba[didx + 3] = alpha;
      }
    }
  }

  await sharp(rgba, { raw: { width: cropWidth, height: cropHeight, channels: 4 } })
    .resize({ width: 256, withoutEnlargement: false })
    .webp({ quality: 95 })
    .toFile(outputPath);

  console.log('Successfully generated snake head:', outputPath);
}

async function processTail() {
  const inputPath = 'C:/Users/user/.gemini/antigravity/brain/6460052f-13cf-43d2-82f1-87adffb86cdb/hundred_pace_snake_tail_1793668377114.jpg';
  const outputPath = 'public/assets/snake/snake_tail_indigenous.webp';

  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const visited = new Uint8Array(width * height);
  const queue = [];

  function isWhite(x, y) {
    const idx = (y * width + x) * channels;
    return data[idx] >= 238 && data[idx+1] >= 238 && data[idx+2] >= 238;
  }

  for (let x = 0; x < width; x++) {
    if (isWhite(x, 0)) { queue.push(x, 0); visited[x] = 1; }
    if (isWhite(x, height - 1)) { queue.push(x, height - 1); visited[(height - 1) * width + x] = 1; }
  }
  for (let y = 0; y < height; y++) {
    if (isWhite(0, y) && !visited[y * width]) { queue.push(0, y); visited[y * width] = 1; }
    if (isWhite(width - 1, y) && !visited[y * width + (width - 1)]) { queue.push(width - 1, y); visited[y * width + (width - 1)] = 1; }
  }

  let qHead = 0;
  while (qHead < queue.length) {
    const cx = queue[qHead++];
    const cy = queue[qHead++];
    const neighbors = [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]];
    for (let i = 0; i < 4; i++) {
      const nx = neighbors[i][0];
      const ny = neighbors[i][1];
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nidx = ny * width + nx;
        if (!visited[nidx] && isWhite(nx, ny)) {
          visited[nidx] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }

  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!visited[y * width + x]) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const centerX = Math.round((minX + maxX) / 2);
  const halfW = Math.max(centerX - minX, maxX - centerX);
  const cropLeft = Math.max(0, centerX - halfW);
  const cropWidth = halfW * 2 + 1;
  const cropTop = minY;
  const cropHeight = maxY - minY + 1;

  const rgba = Buffer.alloc(cropWidth * cropHeight * 4);
  for (let cy = 0; cy < cropHeight; cy++) {
    const y = cropTop + cy;
    for (let cx = 0; cx < cropWidth; cx++) {
      const x = cropLeft + cx;
      const sidx = (y * width + x) * channels;
      const didx = (cy * cropWidth + cx) * 4;

      rgba[didx] = data[sidx];
      rgba[didx + 1] = data[sidx + 1];
      rgba[didx + 2] = data[sidx + 2];

      const vidx = y * width + x;
      if (visited[vidx]) {
        rgba[didx + 3] = 0;
      } else {
        const brightness = (data[sidx] + data[sidx + 1] + data[sidx + 2]) / 3;
        let alpha = brightness > 242 ? Math.max(0, Math.min(255, Math.round((255 - brightness) * 20))) : 255;
        // Soft blend at the top attachment base
        if (cy < 30) {
          alpha = Math.round(alpha * Math.sin((cy / 30) * (Math.PI / 2)));
        }
        rgba[didx + 3] = alpha;
      }
    }
  }

  await sharp(rgba, { raw: { width: cropWidth, height: cropHeight, channels: 4 } })
    .resize({ width: 160, withoutEnlargement: false })
    .webp({ quality: 95 })
    .toFile(outputPath);

  console.log('Successfully generated snake tail:', outputPath);
}

async function main() {
  await processHead();
  await processTail();
}

main().catch(console.error);
