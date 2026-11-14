import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, 'public', 'assets', 'exam', 'saa', '114');
const OUTPUT_DIR = path.join(SOURCE_DIR, 'options');
const CONTACT_SHEET_DIR = path.join(ROOT, 'tmp', 'saa114', 'contact_sheets');

// Independent per-option bounding boxes ({ left, top, width, height }) for all 36 sets (144 cards).
// Irregular layouts (g4_q20, g4_q35, g5_q3, g5_q4, g5_q6, g5_q15) and 2x2 grids all exclude
// question stems, circled option markers (①②③④), and page footer notices.
export const SLICE_SPECS = {
  g4_q20: {
    type: 'custom',
    regions: {
      a: { left: 96, top: 110, width: 140, height: 140 },
      b: { left: 337, top: 110, width: 158, height: 393 },
      c: { left: 556, top: 110, width: 158, height: 265 },
      d: { left: 800, top: 110, width: 136, height: 123 },
    },
  },
  g5_q3: {
    type: 'custom',
    regions: {
      a: { left: 92, top: 56, width: 194, height: 153 },
      b: { left: 378, top: 59, width: 165, height: 179 },
      c: { left: 601, top: 59, width: 136, height: 182 },
      d: { left: 833, top: 56, width: 143, height: 178 },
    },
  },
  g5_q4: {
    type: 'custom',
    regions: {
      a: { left: 109, top: 65, width: 209, height: 99 },
      b: { left: 382, top: 60, width: 114, height: 159 },
      c: { left: 594, top: 45, width: 167, height: 173 },
      d: { left: 838, top: 45, width: 181, height: 164 },
    },
  },
  g5_q6: {
    type: 'custom',
    regions: {
      a: { left: 100, top: 52, width: 175, height: 218 },
      b: { left: 336, top: 52, width: 177, height: 218 },
      c: { left: 562, top: 52, width: 175, height: 218 },
      d: { left: 805, top: 52, width: 173, height: 217 },
    },
  },
  g5_q15: {
    type: 'custom',
    regions: {
      a: { left: 112, top: 65, width: 195, height: 179 },
      b: { left: 354, top: 66, width: 217, height: 131 },
      c: { left: 587, top: 66, width: 180, height: 168 },
      d: { left: 814, top: 71, width: 216, height: 131 },
    },
  },
  g4_q8: {
    type: 'custom',
    regions: {
      a: { left: 115, top: 72, width: 332, height: 484 },
      b: { left: 585, top: 72, width: 332, height: 484 },
      c: { left: 117, top: 598, width: 330, height: 483 },
      d: { left: 588, top: 598, width: 331, height: 483 },
    },
  },
  g4_q9: {
    type: 'custom',
    regions: {
      a: { left: 129, top: 68, width: 356, height: 270 },
      b: { left: 609, top: 89, width: 329, height: 246 },
      c: { left: 119, top: 407, width: 371, height: 258 },
      d: { left: 624, top: 411, width: 313, height: 259 },
    },
  },
  g4_q10: {
    type: 'custom',
    regions: {
      a: { left: 114, top: 62, width: 365, height: 247 },
      b: { left: 580, top: 63, width: 423, height: 245 },
      c: { left: 110, top: 425, width: 218, height: 295 },
      d: { left: 568, top: 434, width: 422, height: 242 },
    },
  },
  g4_q11: {
    type: 'custom',
    regions: {
      a: { left: 116, top: 78, width: 320, height: 263 },
      b: { left: 559, top: 80, width: 320, height: 255 },
      c: { left: 114, top: 396, width: 318, height: 274 },
      d: { left: 558, top: 395, width: 317, height: 270 },
    },
  },
  g4_q12: {
    type: 'custom',
    regions: {
      a: { left: 119, top: 64, width: 342, height: 277 },
      b: { left: 599, top: 64, width: 266, height: 277 },
      c: { left: 122, top: 382, width: 317, height: 284 },
      d: { left: 580, top: 383, width: 307, height: 280 },
    },
  },
  g4_q13: {
    type: 'custom',
    regions: {
      a: { left: 132, top: 64, width: 362, height: 235 },
      b: { left: 577, top: 64, width: 402, height: 242 },
      c: { left: 130, top: 352, width: 314, height: 249 },
      d: { left: 562, top: 353, width: 310, height: 249 },
    },
  },
  g4_q14: {
    type: 'custom',
    regions: {
      a: { left: 121, top: 62, width: 318, height: 235 },
      b: { left: 606, top: 62, width: 318, height: 235 },
      c: { left: 121, top: 340, width: 318, height: 235 },
      d: { left: 613, top: 340, width: 317, height: 235 },
    },
  },
  g4_q15: {
    type: 'custom',
    regions: {
      a: { left: 143, top: 78, width: 373, height: 354 },
      b: { left: 603, top: 80, width: 389, height: 346 },
      c: { left: 122, top: 522, width: 352, height: 348 },
      d: { left: 617, top: 541, width: 358, height: 322 },
    },
  },
  g4_q26: {
    type: 'custom',
    regions: {
      a: { left: 96, top: 114, width: 245, height: 235 },
      b: { left: 548, top: 114, width: 260, height: 235 },
      c: { left: 96, top: 394, width: 245, height: 237 },
      d: { left: 558, top: 394, width: 246, height: 237 },
    },
  },
  g4_q31: {
    type: 'custom',
    regions: {
      a: { left: 102, top: 105, width: 191, height: 177 },
      b: { left: 555, top: 106, width: 228, height: 177 },
      c: { left: 102, top: 335, width: 231, height: 182 },
      d: { left: 538, top: 334, width: 207, height: 190 },
    },
  },
  g4_q33: {
    type: 'custom',
    regions: {
      a: { left: 124, top: 136, width: 312, height: 267 },
      b: { left: 609, top: 120, width: 311, height: 260 },
      c: { left: 130, top: 452, width: 310, height: 273 },
      d: { left: 615, top: 453, width: 328, height: 259 },
    },
  },
  g4_q35: {
    type: 'custom',
    regions: {
      a: { left: 84, top: 110, width: 265, height: 249 },
      b: { left: 526, top: 134, width: 265, height: 232 },
      c: { left: 84, top: 442, width: 265, height: 250 },
      d: { left: 526, top: 450, width: 265, height: 229 },
    },
  },
  g5_q7: {
    type: 'custom',
    regions: {
      a: { left: 110, top: 65, width: 275, height: 261 },
      b: { left: 581, top: 75, width: 281, height: 256 },
      c: { left: 98, top: 398, width: 301, height: 301 },
      d: { left: 616, top: 370, width: 219, height: 282 },
    },
  },
  g5_q9: {
    type: 'custom',
    regions: {
      a: { left: 88, top: 50, width: 300, height: 285 },
      b: { left: 597, top: 60, width: 298, height: 276 },
      c: { left: 92, top: 406, width: 318, height: 278 },
      d: { left: 601, top: 403, width: 295, height: 285 },
    },
  },
  g5_q10: {
    type: 'custom',
    regions: {
      a: { left: 127, top: 66, width: 274, height: 253 },
      b: { left: 603, top: 75, width: 292, height: 256 },
      c: { left: 129, top: 372, width: 277, height: 267 },
      d: { left: 594, top: 372, width: 269, height: 273 },
    },
  },
  g5_q11: {
    type: 'custom',
    regions: {
      a: { left: 131, top: 48, width: 254, height: 276 },
      b: { left: 589, top: 48, width: 254, height: 277 },
      c: { left: 130, top: 405, width: 255, height: 278 },
      d: { left: 589, top: 412, width: 256, height: 272 },
    },
  },
  g5_q13: {
    type: 'custom',
    regions: {
      a: { left: 144, top: 54, width: 274, height: 305 },
      b: { left: 579, top: 68, width: 313, height: 275 },
      c: { left: 113, top: 431, width: 324, height: 310 },
      d: { left: 598, top: 430, width: 259, height: 300 },
    },
  },
  g5_q14: {
    type: 'custom',
    regions: {
      a: { left: 112, top: 50, width: 458, height: 296 },
      b: { left: 590, top: 50, width: 453, height: 294 },
      c: { left: 114, top: 422, width: 463, height: 303 },
      d: { left: 586, top: 424, width: 456, height: 300 },
    },
  },
  g5_q18: {
    type: 'custom',
    regions: {
      a: { left: 110, top: 116, width: 302, height: 249 },
      b: { left: 572, top: 96, width: 212, height: 279 },
      c: { left: 130, top: 421, width: 198, height: 269 },
      d: { left: 567, top: 418, width: 223, height: 282 },
    },
  },
  g5_q25: {
    type: 'custom',
    regions: {
      a: { left: 98, top: 110, width: 258, height: 296 },
      b: { left: 579, top: 110, width: 167, height: 293 },
      c: { left: 129, top: 450, width: 145, height: 299 },
      d: { left: 588, top: 452, width: 153, height: 317 },
    },
  },
  g6_q3: {
    type: 'custom',
    regions: {
      a: { left: 116, top: 52, width: 435, height: 224 },
      b: { left: 582, top: 52, width: 435, height: 226 },
      c: { left: 116, top: 348, width: 430, height: 224 },
      d: { left: 582, top: 362, width: 407, height: 231 },
    },
  },
  g6_q4: {
    type: 'custom',
    regions: {
      a: { left: 107, top: 52, width: 263, height: 260 },
      b: { left: 574, top: 53, width: 279, height: 259 },
      c: { left: 115, top: 350, width: 247, height: 272 },
      d: { left: 586, top: 350, width: 257, height: 264 },
    },
  },
  g6_q5: {
    type: 'custom',
    regions: {
      a: { left: 115, top: 52, width: 282, height: 341 },
      b: { left: 617, top: 174, width: 298, height: 219 },
      c: { left: 143, top: 445, width: 261, height: 335 },
      d: { left: 629, top: 529, width: 317, height: 241 },
    },
  },
  g6_q6: {
    type: 'custom',
    regions: {
      a: { left: 131, top: 49, width: 284, height: 320 },
      b: { left: 583, top: 49, width: 326, height: 326 },
      c: { left: 106, top: 435, width: 306, height: 319 },
      d: { left: 579, top: 441, width: 302, height: 310 },
    },
  },
  g6_q7: {
    type: 'custom',
    regions: {
      a: { left: 99, top: 77, width: 354, height: 245 },
      b: { left: 579, top: 74, width: 351, height: 248 },
      c: { left: 104, top: 391, width: 355, height: 249 },
      d: { left: 578, top: 386, width: 365, height: 260 },
    },
  },
  g6_q8: {
    type: 'custom',
    regions: {
      a: { left: 99, top: 58, width: 296, height: 262 },
      b: { left: 579, top: 58, width: 296, height: 262 },
      c: { left: 99, top: 378, width: 296, height: 261 },
      d: { left: 579, top: 378, width: 296, height: 261 },
    },
  },
  g6_q9: {
    type: 'custom',
    regions: {
      a: { left: 105, top: 63, width: 376, height: 259 },
      b: { left: 625, top: 52, width: 147, height: 297 },
      c: { left: 127, top: 400, width: 155, height: 303 },
      d: { left: 574, top: 400, width: 266, height: 313 },
    },
  },
  g6_q10: {
    type: 'custom',
    regions: {
      a: { left: 135, top: 80, width: 315, height: 265 },
      b: { left: 612, top: 67, width: 245, height: 293 },
      c: { left: 125, top: 424, width: 329, height: 269 },
      d: { left: 639, top: 429, width: 215, height: 273 },
    },
  },
  g6_q16: {
    type: 'custom',
    regions: {
      a: { left: 93, top: 112, width: 302, height: 258 },
      b: { left: 567, top: 124, width: 332, height: 246 },
      c: { left: 99, top: 412, width: 259, height: 258 },
      d: { left: 564, top: 412, width: 304, height: 267 },
    },
  },
  g6_q17: {
    type: 'custom',
    regions: {
      a: { left: 90, top: 126, width: 370, height: 176 },
      b: { left: 552, top: 130, width: 359, height: 175 },
      c: { left: 86, top: 414, width: 395, height: 197 },
      d: { left: 552, top: 414, width: 363, height: 186 },
    },
  },
  g6_q27: {
    type: 'custom',
    regions: {
      a: { left: 113, top: 187, width: 325, height: 198 },
      b: { left: 562, top: 180, width: 316, height: 203 },
      c: { left: 113, top: 433, width: 342, height: 210 },
      d: { left: 562, top: 434, width: 307, height: 208 },
    },
  },
};

export async function generateContactSheets(names = Object.keys(SLICE_SPECS)) {
  fs.mkdirSync(CONTACT_SHEET_DIR, { recursive: true });
  const cellW = 240;
  const cellH = 200;
  const cols = 8;
  const rows = 6;
  const sheetPaths = [];

  for (let sheetIdx = 0; sheetIdx < Math.ceil(names.length / 12); sheetIdx++) {
    const batch = names.slice(sheetIdx * 12, (sheetIdx + 1) * 12);
    const composites = [];
    for (let i = 0; i < batch.length; i++) {
      const name = batch[i];
      const baseCol = (i % 2) * 4;
      const row = Math.floor(i / 2);
      for (let j = 0; j < 4; j++) {
        const label = ['a', 'b', 'c', 'd'][j];
        const filePath = path.join(OUTPUT_DIR, `${name}_${label}.webp`);
        const meta = await sharp(filePath).metadata();
        const cropBuf = await sharp(filePath)
          .resize({
            width: cellW - 20,
            height: cellH - 42,
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 1 },
          })
          .png()
          .toBuffer();
        const badgeSvg = Buffer.from(`<svg width="${cellW - 8}" height="${cellH - 8}" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="${cellW - 8}" height="${cellH - 8}" fill="white" stroke="#cbd5e1" stroke-width="2" rx="8"/>
          <rect x="0" y="0" width="${cellW - 8}" height="24" fill="#0f172a" rx="4"/>
          <text x="8" y="17" fill="#f8fafc" font-size="14" font-weight="bold">${name}_${label} (${meta.width}x${meta.height})</text>
        </svg>`);
        const tile = await sharp(badgeSvg)
          .composite([{ input: cropBuf, left: 6, top: 28 }])
          .png()
          .toBuffer();
        composites.push({
          input: tile,
          left: (baseCol + j) * cellW + 4,
          top: row * cellH + 4,
        });
      }
    }

    const sheetPath = path.join(CONTACT_SHEET_DIR, `saa_114_options_sheet_${sheetIdx + 1}.png`);
    await sharp({
      create: {
        width: cols * cellW,
        height: rows * cellH,
        channels: 3,
        background: { r: 241, g: 245, b: 249 },
      },
    })
      .composite(composites)
      .png()
      .toFile(sheetPath);
    sheetPaths.push(sheetPath);
  }
  return sheetPaths;
}

export async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  let totalSlices = 0;
  console.log(`Starting SAA 114 option image splitting for ${Object.keys(SLICE_SPECS).length} sets...`);

  for (const [name, spec] of Object.entries(SLICE_SPECS)) {
    const srcFile = path.join(SOURCE_DIR, `${name}.webp`);
    if (!fs.existsSync(srcFile)) {
      throw new Error(`Missing source composite image: ${srcFile}`);
    }

    const meta = await sharp(srcFile).metadata();
    const { width, height } = meta;

    let slices = [];
    if (spec.type === 'custom' && spec.regions) {
      slices = ['a', 'b', 'c', 'd'].map((label) => {
        const region = spec.regions[label];
        if (!region) {
          throw new Error(`Missing custom region "${label}" for ${name}`);
        }
        return { label, ...region };
      });
    } else if (spec.type === '2x2') {
      const { col, row } = spec;
      slices = [
        { label: 'a', left: 0, top: 0, width: col, height: row },
        { label: 'b', left: col, top: 0, width: width - col, height: row },
        { label: 'c', left: 0, top: row, width: col, height: height - row },
        { label: 'd', left: col, top: row, width: width - col, height: height - row },
      ];
    } else if (spec.type === '1x4') {
      const [c1, c2, c3] = spec.cols;
      slices = [
        { label: 'a', left: 0, top: 0, width: c1, height },
        { label: 'b', left: c1, top: 0, width: c2 - c1, height },
        { label: 'c', left: c2, top: 0, width: c3 - c2, height },
        { label: 'd', left: c3, top: 0, width: width - c3, height },
      ];
    }

    for (const s of slices) {
      if (s.left < 0 || s.top < 0 || s.width <= 0 || s.height <= 0 || s.left + s.width > width || s.top + s.height > height) {
        throw new Error(`Out-of-bounds region for ${name}_${s.label}: ${JSON.stringify(s)} in ${width}x${height}`);
      }
      const outPath = path.join(OUTPUT_DIR, `${name}_${s.label}.webp`);
      await sharp(srcFile)
        .extract({ left: s.left, top: s.top, width: s.width, height: s.height })
        .webp({ quality: 92, effort: 6 })
        .toFile(outPath);
      totalSlices++;
    }
    console.log(`  [OK] ${name} -> ${slices.map((s) => `${name}_${s.label}.webp`).join(', ')}`);
  }

  const sheetPaths = await generateContactSheets();
  console.log(`\nSuccessfully created ${totalSlices} option images in ${path.relative(ROOT, OUTPUT_DIR)}/`);
  console.log(`Generated ${sheetPaths.length} contact sheets in ${path.relative(ROOT, CONTACT_SHEET_DIR)}/`);
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
