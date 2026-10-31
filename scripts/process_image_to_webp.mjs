import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

/**
 * 將指定圖片轉為 WebP，並可選去除純白或純黑背景為透明
 */
export async function convertToTransparentWebp({
  inputPath,
  outputPath,
  width = 256,
  height = 256,
  removeBackground = 'white', // 'white' | 'black' | 'none'
  threshold = 230
}) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  if (removeBackground === 'none') {
    await image
      .resize(width, height, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(outputPath);
    console.log(`Converted (no bg removal): ${outputPath}`);
    return;
  }

  // 取得原始像素 Buffer 進行色度去背
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels;
  const len = data.length;

  for (let i = 0; i < len; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (removeBackground === 'white') {
      // 若接近白色，將 Alpha 設為 0
      if (r >= threshold && g >= threshold && b >= threshold) {
        data[i + 3] = 0;
      } else {
        // 邊緣抗鋸齒羽化
        const maxVal = Math.min(r, g, b);
        if (maxVal > threshold - 25) {
          const factor = (maxVal - (threshold - 25)) / 25;
          data[i + 3] = Math.max(0, Math.min(255, Math.floor(data[i + 3] * (1 - factor))));
        }
      }
    } else if (removeBackground === 'black') {
      if (r <= threshold && g <= threshold && b <= threshold) {
        data[i + 3] = 0;
      }
    }
  }

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
    .resize(width, height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 85 })
    .toFile(outputPath);

  console.log(`Successfully processed & saved transparent WebP: ${outputPath}`);
}

// 支援命令列執行
const [,, inPath, outPath, w, h, bg, th] = process.argv;
if (inPath && outPath) {
  convertToTransparentWebp({
    inputPath: inPath,
    outputPath: outPath,
    width: w ? parseInt(w) : 256,
    height: h ? parseInt(h) : 256,
    removeBackground: bg || 'white',
    threshold: th ? parseInt(th) : 230
  }).catch(console.error);
}
