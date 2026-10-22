/**
 * 均勻點雲重取樣：將任意長度或稀疏之筆劃重取樣為固定 N 個等距點
 */
export const resamplePoints = (pts, targetCount = 16) => {
  if (!pts || pts.length === 0) return [];
  if (pts.length === 1) return Array(targetCount).fill(pts[0]);
  const res = [];
  let totalLen = 0;
  for (let i = 1; i < pts.length; i++) {
    totalLen += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  }
  if (totalLen <= 0) return Array(targetCount).fill(pts[0]);
  const step = totalLen / (targetCount - 1);
  res.push({ x: pts[0].x, y: pts[0].y });
  let accumulated = 0;
  let currIdx = 0;
  for (let i = 1; i < targetCount - 1; i++) {
    const targetDist = i * step;
    while (currIdx < pts.length - 1) {
      const p1 = pts[currIdx];
      const p2 = pts[currIdx + 1];
      const segLen = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      if (accumulated + segLen >= targetDist) {
        const t = (targetDist - accumulated) / (segLen || 1);
        res.push({
          x: Math.round(p1.x + (p2.x - p1.x) * t),
          y: Math.round(p1.y + (p2.y - p1.y) * t)
        });
        break;
      }
      accumulated += segLen;
      currIdx++;
    }
  }
  res.push({ x: pts[pts.length - 1].x, y: pts[pts.length - 1].y });
  return res;
};
// ═══════════════════════════════════════════════════════════════════════════
// 霧臺英語宇宙：26 字母標準四線三格筆順數據庫與手寫評分引擎 (Alphabet Strokes Engine)
// 依據教育部/臺灣國小英語課綱標準：四線三格、起筆方向、筆劃順序 ①②③
// ═══════════════════════════════════════════════════════════════════════════

export const FOUR_LINES = {
  top: 15,     // 頂線 (Ascender / Headline)
  mid: 45,     // 中線 (Midline / Waistline - 虛線)
  base: 75,    // 基線 (Baseline - 實線主基底)
  bottom: 105, // 底線 (Descender / Bottom line)
  width: 100,
  height: 120
};

/**
 * 輔助取樣點生成器：將線段或三次貝茲曲線離散取樣成點座標集合
 */
const sampleLine = (x1, y1, x2, y2, steps = 10) => {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push([Math.round(x1 + (x2 - x1) * t), Math.round(y1 + (y2 - y1) * t)]);
  }
  return pts;
};

const sampleCubic = (p0, p1, p2, p3, steps = 16) => {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const inv = 1 - t;
    const x = Math.round(inv * inv * inv * p0[0] + 3 * inv * inv * t * p1[0] + 3 * inv * t * t * p2[0] + t * t * t * p3[0]);
    const y = Math.round(inv * inv * inv * p0[1] + 3 * inv * inv * t * p1[1] + 3 * inv * t * t * p2[1] + t * t * t * p3[1]);
    pts.push([x, y]);
  }
  return pts;
};

// ── 26 大寫字母筆順標準庫 (A ~ Z) ──
const UPPER_STROKES = {
  A: {
    char: 'A', case: 'upper', sound: 'A is for Apple',
    strokes: [
      { id: 1, path: 'M 50 15 L 20 75', start: { x: 50, y: 15 }, end: { x: 20, y: 75 }, labelPos: { x: 30, y: 40 }, hint: '由頂點往左下斜畫', sample: sampleLine(50, 15, 20, 75) },
      { id: 2, path: 'M 50 15 L 80 75', start: { x: 50, y: 15 }, end: { x: 80, y: 75 }, labelPos: { x: 70, y: 40 }, hint: '由頂點往右下斜畫', sample: sampleLine(50, 15, 80, 75) },
      { id: 3, path: 'M 32 52 L 68 52', start: { x: 32, y: 52 }, end: { x: 68, y: 52 }, labelPos: { x: 50, y: 58 }, hint: '從左至右畫中間橫線', sample: sampleLine(32, 52, 68, 52) }
    ]
  },
  B: {
    char: 'B', case: 'upper', sound: 'B is for Book',
    strokes: [
      { id: 1, path: 'M 28 15 L 28 75', start: { x: 28, y: 15 }, end: { x: 28, y: 75 }, labelPos: { x: 20, y: 45 }, hint: '由上往下垂直筆劃', sample: sampleLine(28, 15, 28, 75) },
      { id: 2, path: 'M 28 15 C 65 15, 65 45, 28 45', start: { x: 28, y: 15 }, end: { x: 28, y: 45 }, labelPos: { x: 60, y: 28 }, hint: '由頂點向右環抱至中線', sample: sampleCubic([28, 15], [65, 15], [65, 45], [28, 45]) },
      { id: 3, path: 'M 28 45 C 70 45, 70 75, 28 75', start: { x: 28, y: 45 }, end: { x: 28, y: 75 }, labelPos: { x: 64, y: 62 }, hint: '從中線向右環抱至基線', sample: sampleCubic([28, 45], [70, 45], [70, 75], [28, 75]) }
    ]
  },
  C: {
    char: 'C', case: 'upper', sound: 'C is for Cat',
    strokes: [
      { id: 1, path: 'M 75 28 C 30 15, 18 55, 35 72 C 52 82, 72 75, 75 64', start: { x: 75, y: 28 }, end: { x: 75, y: 64 }, labelPos: { x: 50, y: 22 }, hint: '由右上逆時針畫圓弧至右下', sample: [...sampleCubic([75, 28], [30, 15], [18, 55], [35, 72]), ...sampleCubic([35, 72], [52, 82], [72, 75], [75, 64])] }
    ]
  },
  D: {
    char: 'D', case: 'upper', sound: 'D is for Dog',
    strokes: [
      { id: 1, path: 'M 28 15 L 28 75', start: { x: 28, y: 15 }, end: { x: 28, y: 75 }, labelPos: { x: 20, y: 45 }, hint: '由上往下垂直筆劃', sample: sampleLine(28, 15, 28, 75) },
      { id: 2, path: 'M 28 15 C 75 15, 75 75, 28 75', start: { x: 28, y: 15 }, end: { x: 28, y: 75 }, labelPos: { x: 68, y: 45 }, hint: '由頂點畫大半圓至基線', sample: sampleCubic([28, 15], [75, 15], [75, 75], [28, 75]) }
    ]
  },
  E: {
    char: 'E', case: 'upper', sound: 'E is for Elephant',
    strokes: [
      { id: 1, path: 'M 30 15 L 30 75', start: { x: 30, y: 15 }, end: { x: 30, y: 75 }, labelPos: { x: 22, y: 45 }, hint: '垂直主幹由上往下', sample: sampleLine(30, 15, 30, 75) },
      { id: 2, path: 'M 30 15 L 72 15', start: { x: 30, y: 15 }, end: { x: 72, y: 15 }, labelPos: { x: 50, y: 22 }, hint: '頂端橫線向右', sample: sampleLine(30, 15, 72, 15) },
      { id: 3, path: 'M 30 45 L 65 45', start: { x: 30, y: 45 }, end: { x: 65, y: 45 }, labelPos: { x: 48, y: 52 }, hint: '中線橫線向右', sample: sampleLine(30, 45, 65, 45) },
      { id: 4, path: 'M 30 75 L 72 75', start: { x: 30, y: 75 }, end: { x: 72, y: 75 }, labelPos: { x: 50, y: 82 }, hint: '底線橫線向右', sample: sampleLine(30, 75, 72, 75) }
    ]
  },
  F: {
    char: 'F', case: 'upper', sound: 'F is for Fish',
    strokes: [
      { id: 1, path: 'M 30 15 L 30 75', start: { x: 30, y: 15 }, end: { x: 30, y: 75 }, labelPos: { x: 22, y: 45 }, hint: '垂直主幹由上往下', sample: sampleLine(30, 15, 30, 75) },
      { id: 2, path: 'M 30 15 L 72 15', start: { x: 30, y: 15 }, end: { x: 72, y: 15 }, labelPos: { x: 50, y: 22 }, hint: '頂端橫線向右', sample: sampleLine(30, 15, 72, 15) },
      { id: 3, path: 'M 30 45 L 65 45', start: { x: 30, y: 45 }, end: { x: 65, y: 45 }, labelPos: { x: 48, y: 52 }, hint: '中線橫線向右', sample: sampleLine(30, 45, 65, 45) }
    ]
  },
  G: {
    char: 'G', case: 'upper', sound: 'G is for Girl',
    strokes: [
      { id: 1, path: 'M 75 28 C 30 15, 18 55, 35 72 C 52 82, 72 75, 72 52', start: { x: 75, y: 28 }, end: { x: 72, y: 52 }, labelPos: { x: 50, y: 22 }, hint: '由右上畫大圓弧到右側中線', sample: [...sampleCubic([75, 28], [30, 15], [18, 55], [35, 72]), ...sampleCubic([35, 72], [52, 82], [72, 75], [72, 52])] },
      { id: 2, path: 'M 72 52 L 52 52', start: { x: 72, y: 52 }, end: { x: 52, y: 52 }, labelPos: { x: 62, y: 44 }, hint: '從右向內水平畫橫線', sample: sampleLine(72, 52, 52, 52) }
    ]
  },
  H: {
    char: 'H', case: 'upper', sound: 'H is for Hat',
    strokes: [
      { id: 1, path: 'M 28 15 L 28 75', start: { x: 28, y: 15 }, end: { x: 28, y: 75 }, labelPos: { x: 20, y: 45 }, hint: '左側垂直線由上往下', sample: sampleLine(28, 15, 28, 75) },
      { id: 2, path: 'M 72 15 L 72 75', start: { x: 72, y: 15 }, end: { x: 72, y: 75 }, labelPos: { x: 80, y: 45 }, hint: '右側垂直線由上往下', sample: sampleLine(72, 15, 72, 75) },
      { id: 3, path: 'M 28 45 L 72 45', start: { x: 28, y: 45 }, end: { x: 72, y: 45 }, labelPos: { x: 50, y: 52 }, hint: '中線水平連接左右', sample: sampleLine(28, 45, 72, 45) }
    ]
  },
  I: {
    char: 'I', case: 'upper', sound: 'I is for Ice',
    strokes: [
      { id: 1, path: 'M 50 15 L 50 75', start: { x: 50, y: 15 }, end: { x: 50, y: 75 }, labelPos: { x: 42, y: 45 }, hint: '中央垂直筆劃由上往下', sample: sampleLine(50, 15, 50, 75) },
      { id: 2, path: 'M 32 15 L 68 15', start: { x: 32, y: 15 }, end: { x: 68, y: 15 }, labelPos: { x: 50, y: 22 }, hint: '頂端水平橫線', sample: sampleLine(32, 15, 68, 15) },
      { id: 3, path: 'M 32 75 L 68 75', start: { x: 32, y: 75 }, end: { x: 68, y: 75 }, labelPos: { x: 50, y: 82 }, hint: '基線水平橫線', sample: sampleLine(32, 75, 68, 75) }
    ]
  },
  J: {
    char: 'J', case: 'upper', sound: 'J is for Juice',
    strokes: [
      { id: 1, path: 'M 40 15 L 80 15', start: { x: 40, y: 15 }, end: { x: 80, y: 15 }, labelPos: { x: 60, y: 22 }, hint: '頂端橫線向右', sample: sampleLine(40, 15, 80, 15) },
      { id: 2, path: 'M 62 15 L 62 60 C 62 76, 36 76, 36 62', start: { x: 62, y: 15 }, end: { x: 36, y: 62 }, labelPos: { x: 70, y: 45 }, hint: '由上往下並向左彎起鉤', sample: [...sampleLine(62, 15, 62, 60), ...sampleCubic([62, 60], [62, 76], [36, 76], [36, 62])] }
    ]
  },
  K: {
    char: 'K', case: 'upper', sound: 'K is for Kite',
    strokes: [
      { id: 1, path: 'M 28 15 L 28 75', start: { x: 28, y: 15 }, end: { x: 28, y: 75 }, labelPos: { x: 20, y: 45 }, hint: '左側主幹由上往下', sample: sampleLine(28, 15, 28, 75) },
      { id: 2, path: 'M 72 18 L 30 48', start: { x: 72, y: 18 }, end: { x: 30, y: 48 }, labelPos: { x: 56, y: 30 }, hint: '由右上往主幹斜畫', sample: sampleLine(72, 18, 30, 48) },
      { id: 3, path: 'M 30 48 L 74 75', start: { x: 30, y: 48 }, end: { x: 74, y: 75 }, labelPos: { x: 58, y: 66 }, hint: '由中點往右下斜畫', sample: sampleLine(30, 48, 74, 75) }
    ]
  },
  L: {
    char: 'L', case: 'upper', sound: 'L is for Lion',
    strokes: [
      { id: 1, path: 'M 30 15 L 30 75', start: { x: 30, y: 15 }, end: { x: 30, y: 75 }, labelPos: { x: 22, y: 45 }, hint: '垂直直線由上往下', sample: sampleLine(30, 15, 30, 75) },
      { id: 2, path: 'M 30 75 L 72 75', start: { x: 30, y: 75 }, end: { x: 72, y: 75 }, labelPos: { x: 52, y: 82 }, hint: '底端橫線向右', sample: sampleLine(30, 75, 72, 75) }
    ]
  },
  M: {
    char: 'M', case: 'upper', sound: 'M is for Monkey',
    strokes: [
      { id: 1, path: 'M 22 75 L 22 15', start: { x: 22, y: 75 }, end: { x: 22, y: 15 }, labelPos: { x: 14, y: 45 }, hint: '左側立柱自下而上', sample: sampleLine(22, 75, 22, 15) },
      { id: 2, path: 'M 22 15 L 50 60', start: { x: 22, y: 15 }, end: { x: 50, y: 60 }, labelPos: { x: 34, y: 34 }, hint: '由左頂點向中斜下', sample: sampleLine(22, 15, 50, 60) },
      { id: 3, path: 'M 50 60 L 78 15', start: { x: 50, y: 60 }, end: { x: 78, y: 15 }, labelPos: { x: 66, y: 34 }, hint: '由中央向右頂斜上', sample: sampleLine(50, 60, 78, 15) },
      { id: 4, path: 'M 78 15 L 78 75', start: { x: 78, y: 15 }, end: { x: 78, y: 75 }, labelPos: { x: 86, y: 45 }, hint: '右側立柱自上而下', sample: sampleLine(78, 15, 78, 75) }
    ]
  },
  N: {
    char: 'N', case: 'upper', sound: 'N is for Nose',
    strokes: [
      { id: 1, path: 'M 25 75 L 25 15', start: { x: 25, y: 75 }, end: { x: 25, y: 15 }, labelPos: { x: 17, y: 45 }, hint: '左側立柱自下而上', sample: sampleLine(25, 75, 25, 15) },
      { id: 2, path: 'M 25 15 L 75 75', start: { x: 25, y: 15 }, end: { x: 75, y: 75 }, labelPos: { x: 50, y: 45 }, hint: '對角斜線從左上到右下', sample: sampleLine(25, 15, 75, 75) },
      { id: 3, path: 'M 75 75 L 75 15', start: { x: 75, y: 75 }, end: { x: 75, y: 15 }, labelPos: { x: 83, y: 45 }, hint: '右側立柱自下而上', sample: sampleLine(75, 75, 75, 15) }
    ]
  },
  O: {
    char: 'O', case: 'upper', sound: 'O is for Orange',
    strokes: [
      { id: 1, path: 'M 50 15 C 22 15, 22 75, 50 75 C 78 75, 78 15, 50 15', start: { x: 50, y: 15 }, end: { x: 50, y: 15 }, labelPos: { x: 50, y: 24 }, hint: '由頂點逆時針畫完整大橢圓', sample: [...sampleCubic([50, 15], [22, 15], [22, 75], [50, 75]), ...sampleCubic([50, 75], [78, 75], [78, 15], [50, 15])] }
    ]
  },
  P: {
    char: 'P', case: 'upper', sound: 'P is for Pen',
    strokes: [
      { id: 1, path: 'M 28 15 L 28 75', start: { x: 28, y: 15 }, end: { x: 28, y: 75 }, labelPos: { x: 20, y: 45 }, hint: '垂直主幹由上往下', sample: sampleLine(28, 15, 28, 75) },
      { id: 2, path: 'M 28 15 C 70 15, 70 45, 28 45', start: { x: 28, y: 15 }, end: { x: 28, y: 45 }, labelPos: { x: 62, y: 28 }, hint: '由頂點向右環抱至中線', sample: sampleCubic([28, 15], [70, 15], [70, 45], [28, 45]) }
    ]
  },
  Q: {
    char: 'Q', case: 'upper', sound: 'Q is for Queen',
    strokes: [
      { id: 1, path: 'M 50 15 C 22 15, 22 75, 50 75 C 78 75, 78 15, 50 15', start: { x: 50, y: 15 }, end: { x: 50, y: 15 }, labelPos: { x: 50, y: 24 }, hint: '逆時針畫完整大橢圓', sample: [...sampleCubic([50, 15], [22, 15], [22, 75], [50, 75]), ...sampleCubic([50, 75], [78, 75], [78, 15], [50, 15])] },
      { id: 2, path: 'M 55 60 L 80 80', start: { x: 55, y: 60 }, end: { x: 80, y: 80 }, labelPos: { x: 74, y: 68 }, hint: '右下短斜尾巴筆劃', sample: sampleLine(55, 60, 80, 80) }
    ]
  },
  R: {
    char: 'R', case: 'upper', sound: 'R is for Red',
    strokes: [
      { id: 1, path: 'M 28 15 L 28 75', start: { x: 28, y: 15 }, end: { x: 28, y: 75 }, labelPos: { x: 20, y: 45 }, hint: '垂直主幹由上往下', sample: sampleLine(28, 15, 28, 75) },
      { id: 2, path: 'M 28 15 C 70 15, 70 45, 28 45', start: { x: 28, y: 15 }, end: { x: 28, y: 45 }, labelPos: { x: 62, y: 28 }, hint: '上半部圓弧環抱至中線', sample: sampleCubic([28, 15], [70, 15], [70, 45], [28, 45]) },
      { id: 3, path: 'M 48 45 L 74 75', start: { x: 48, y: 45 }, end: { x: 74, y: 75 }, labelPos: { x: 64, y: 62 }, hint: '由中線往右下斜畫支柱', sample: sampleLine(48, 45, 74, 75) }
    ]
  },
  S: {
    char: 'S', case: 'upper', sound: 'S is for Sun',
    strokes: [
      { id: 1, path: 'M 72 28 C 50 15, 28 22, 35 38 C 40 48, 65 48, 68 58 C 72 70, 48 78, 28 66', start: { x: 72, y: 28 }, end: { x: 28, y: 66 }, labelPos: { x: 50, y: 20 }, hint: '連續 S 形蛇形曲線', sample: [...sampleCubic([72, 28], [50, 15], [28, 22], [35, 38]), ...sampleCubic([35, 38], [40, 48], [65, 48], [68, 58]), ...sampleCubic([68, 58], [72, 70], [48, 78], [28, 66])] }
    ]
  },
  T: {
    char: 'T', case: 'upper', sound: 'T is for Tiger',
    strokes: [
      { id: 1, path: 'M 24 15 L 76 15', start: { x: 24, y: 15 }, end: { x: 76, y: 15 }, labelPos: { x: 50, y: 22 }, hint: '頂端橫梁從左向右', sample: sampleLine(24, 15, 76, 15) },
      { id: 2, path: 'M 50 15 L 50 75', start: { x: 50, y: 15 }, end: { x: 50, y: 75 }, labelPos: { x: 42, y: 45 }, hint: '中央垂直大柱由上往下', sample: sampleLine(50, 15, 50, 75) }
    ]
  },
  U: {
    char: 'U', case: 'upper', sound: 'U is for Umbrella',
    strokes: [
      { id: 1, path: 'M 28 15 L 28 60 C 28 76, 72 76, 72 60 L 72 15', start: { x: 28, y: 15 }, end: { x: 72, y: 15 }, labelPos: { x: 22, y: 35 }, hint: '左降向下環抱右升至頂點', sample: [...sampleLine(28, 15, 28, 60), ...sampleCubic([28, 60], [28, 76], [72, 76], [72, 60]), ...sampleLine(72, 60, 72, 15)] }
    ]
  },
  V: {
    char: 'V', case: 'upper', sound: 'V is for Van',
    strokes: [
      { id: 1, path: 'M 25 15 L 50 75', start: { x: 25, y: 15 }, end: { x: 50, y: 75 }, labelPos: { x: 34, y: 42 }, hint: '由左頂點向中央底端斜畫', sample: sampleLine(25, 15, 50, 75) },
      { id: 2, path: 'M 50 75 L 75 15', start: { x: 50, y: 75 }, end: { x: 75, y: 15 }, labelPos: { x: 66, y: 42 }, hint: '由中央底端向右頂點斜畫', sample: sampleLine(50, 75, 75, 15) }
    ]
  },
  W: {
    char: 'W', case: 'upper', sound: 'W is for Water',
    strokes: [
      { id: 1, path: 'M 18 15 L 32 75', start: { x: 18, y: 15 }, end: { x: 32, y: 75 }, labelPos: { x: 22, y: 45 }, hint: '第 1 劃向底端斜畫', sample: sampleLine(18, 15, 32, 75) },
      { id: 2, path: 'M 32 75 L 50 35', start: { x: 32, y: 75 }, end: { x: 50, y: 35 }, labelPos: { x: 42, y: 55 }, hint: '第 2 劃向中間波峰斜上', sample: sampleLine(32, 75, 50, 35) },
      { id: 3, path: 'M 50 35 L 68 75', start: { x: 50, y: 35 }, end: { x: 68, y: 75 }, labelPos: { x: 58, y: 55 }, hint: '第 3 劃向底端斜下', sample: sampleLine(50, 35, 68, 75) },
      { id: 4, path: 'M 68 75 L 82 15', start: { x: 68, y: 75 }, end: { x: 82, y: 15 }, labelPos: { x: 78, y: 45 }, hint: '第 4 劃向右頂點斜上', sample: sampleLine(68, 75, 82, 15) }
    ]
  },
  X: {
    char: 'X', case: 'upper', sound: 'X is for Box',
    strokes: [
      { id: 1, path: 'M 25 15 L 75 75', start: { x: 25, y: 15 }, end: { x: 75, y: 75 }, labelPos: { x: 35, y: 30 }, hint: '左上往右下對角交叉', sample: sampleLine(25, 15, 75, 75) },
      { id: 2, path: 'M 75 15 L 25 75', start: { x: 75, y: 15 }, end: { x: 25, y: 75 }, labelPos: { x: 65, y: 30 }, hint: '右上往左下對角交叉', sample: sampleLine(75, 15, 25, 75) }
    ]
  },
  Y: {
    char: 'Y', case: 'upper', sound: 'Y is for Yellow',
    strokes: [
      { id: 1, path: 'M 24 15 L 50 45', start: { x: 24, y: 15 }, end: { x: 50, y: 45 }, labelPos: { x: 34, y: 28 }, hint: '左上往中點斜畫', sample: sampleLine(24, 15, 50, 45) },
      { id: 2, path: 'M 76 15 L 50 45', start: { x: 76, y: 15 }, end: { x: 50, y: 45 }, labelPos: { x: 66, y: 28 }, hint: '右上往中點斜畫', sample: sampleLine(76, 15, 50, 45) },
      { id: 3, path: 'M 50 45 L 50 75', start: { x: 50, y: 45 }, end: { x: 50, y: 75 }, labelPos: { x: 42, y: 60 }, hint: '中點往下畫垂直柄', sample: sampleLine(50, 45, 50, 75) }
    ]
  },
  Z: {
    char: 'Z', case: 'upper', sound: 'Z is for Zebra',
    strokes: [
      { id: 1, path: 'M 26 18 L 74 18', start: { x: 26, y: 18 }, end: { x: 74, y: 18 }, labelPos: { x: 50, y: 24 }, hint: '頂端橫線向右', sample: sampleLine(26, 18, 74, 18) },
      { id: 2, path: 'M 74 18 L 26 72', start: { x: 74, y: 18 }, end: { x: 26, y: 72 }, labelPos: { x: 52, y: 45 }, hint: '對角斜線往左下', sample: sampleLine(74, 18, 26, 72) },
      { id: 3, path: 'M 26 72 L 74 72', start: { x: 26, y: 72 }, end: { x: 74, y: 72 }, labelPos: { x: 50, y: 78 }, hint: '基底橫線向右', sample: sampleLine(26, 72, 74, 72) }
    ]
  }
};

// ── 26 小寫字母筆順標準庫 (a ~ z) ──
const LOWER_STROKES = {
  a: {
    char: 'a', case: 'lower', sound: 'a is for ant',
    strokes: [
      { id: 1, path: 'M 68 55 C 68 45, 32 45, 32 60 C 32 75, 68 75, 68 62', start: { x: 68, y: 55 }, end: { x: 68, y: 62 }, labelPos: { x: 50, y: 48 }, hint: '逆時針畫圓圈 (在中線與基線間)', sample: [...sampleCubic([68, 55], [68, 45], [32, 45], [32, 60]), ...sampleCubic([32, 60], [32, 75], [68, 75], [68, 62])] },
      { id: 2, path: 'M 68 45 L 68 75', start: { x: 68, y: 45 }, end: { x: 68, y: 75 }, labelPos: { x: 76, y: 60 }, hint: '右側垂直線由上往下', sample: sampleLine(68, 45, 68, 75) }
    ]
  },
  b: {
    char: 'b', case: 'lower', sound: 'b is for ball',
    strokes: [
      { id: 1, path: 'M 32 15 L 32 75', start: { x: 32, y: 15 }, end: { x: 32, y: 75 }, labelPos: { x: 24, y: 45 }, hint: '長頸由頂線直線向下至基線', sample: sampleLine(32, 15, 32, 75) },
      { id: 2, path: 'M 32 55 C 32 45, 68 45, 68 60 C 68 75, 32 75, 32 68', start: { x: 32, y: 55 }, end: { x: 32, y: 68 }, labelPos: { x: 52, y: 48 }, hint: '順時針畫出右邊肚肚', sample: [...sampleCubic([32, 55], [32, 45], [68, 45], [68, 60]), ...sampleCubic([68, 60], [68, 75], [32, 75], [32, 68])] }
    ]
  },
  c: {
    char: 'c', case: 'lower', sound: 'c is for cup',
    strokes: [
      { id: 1, path: 'M 66 52 C 45 44, 34 52, 34 60 C 34 68, 48 76, 66 70', start: { x: 66, y: 52 }, end: { x: 66, y: 70 }, labelPos: { x: 50, y: 48 }, hint: '在中線與基線間逆時針畫圓弧', sample: [...sampleCubic([66, 52], [45, 44], [34, 52], [34, 60]), ...sampleCubic([34, 60], [34, 68], [48, 76], [66, 70])] }
    ]
  },
  d: {
    char: 'd', case: 'lower', sound: 'd is for duck',
    strokes: [
      { id: 1, path: 'M 68 58 C 68 45, 32 45, 32 60 C 32 75, 68 75, 68 64', start: { x: 68, y: 58 }, end: { x: 68, y: 64 }, labelPos: { x: 48, y: 48 }, hint: '逆時針畫左邊肚肚', sample: [...sampleCubic([68, 58], [68, 45], [32, 45], [32, 60]), ...sampleCubic([32, 60], [32, 75], [68, 75], [68, 64])] },
      { id: 2, path: 'M 68 15 L 68 75', start: { x: 68, y: 15 }, end: { x: 68, y: 75 }, labelPos: { x: 76, y: 40 }, hint: '從頂線垂直向下貫穿至基線', sample: sampleLine(68, 15, 68, 75) }
    ]
  },
  e: {
    char: 'e', case: 'lower', sound: 'e is for egg',
    strokes: [
      { id: 1, path: 'M 32 60 L 68 60 C 68 45, 32 45, 32 60 C 32 75, 68 75, 68 68', start: { x: 32, y: 60 }, end: { x: 68, y: 68 }, labelPos: { x: 45, y: 55 }, hint: '水平橫線向右，接著逆時針環繞', sample: [...sampleLine(32, 60, 68, 60), ...sampleCubic([68, 60], [68, 45], [32, 45], [32, 60]), ...sampleCubic([32, 60], [32, 75], [68, 75], [68, 68])] }
    ]
  },
  f: {
    char: 'f', case: 'lower', sound: 'f is for fox',
    strokes: [
      { id: 1, path: 'M 62 20 C 52 15, 45 15, 45 28 L 45 75', start: { x: 62, y: 20 }, end: { x: 45, y: 75 }, labelPos: { x: 55, y: 16 }, hint: '由頂點向左拐彎，垂直下伸至基線', sample: [...sampleCubic([62, 20], [52, 15], [45, 15], [45, 28]), ...sampleLine(45, 28, 45, 75)] },
      { id: 2, path: 'M 32 45 L 62 45', start: { x: 32, y: 45 }, end: { x: 62, y: 45 }, labelPos: { x: 48, y: 52 }, hint: '在中線上畫水平短橫線', sample: sampleLine(32, 45, 62, 45) }
    ]
  },
  g: {
    char: 'g', case: 'lower', sound: 'g is for goat',
    strokes: [
      { id: 1, path: 'M 68 55 C 68 45, 32 45, 32 60 C 32 75, 68 75, 68 62', start: { x: 68, y: 55 }, end: { x: 68, y: 62 }, labelPos: { x: 50, y: 48 }, hint: '中線與基線間逆時針圓圈', sample: [...sampleCubic([68, 55], [68, 45], [32, 45], [32, 60]), ...sampleCubic([32, 60], [32, 75], [68, 75], [68, 62])] },
      { id: 2, path: 'M 68 45 L 68 95 C 68 106, 38 106, 38 95', start: { x: 68, y: 45 }, end: { x: 38, y: 95 }, labelPos: { x: 76, y: 75 }, hint: '垂直直衝底線並向左勾起', sample: [...sampleLine(68, 45, 68, 95), ...sampleCubic([68, 95], [68, 106], [38, 106], [38, 95])] }
    ]
  },
  h: {
    char: 'h', case: 'lower', sound: 'h is for hen',
    strokes: [
      { id: 1, path: 'M 32 15 L 32 75', start: { x: 32, y: 15 }, end: { x: 32, y: 75 }, labelPos: { x: 24, y: 45 }, hint: '從頂線垂直下伸至基線', sample: sampleLine(32, 15, 32, 75) },
      { id: 2, path: 'M 32 55 C 32 45, 68 45, 68 60 L 68 75', start: { x: 32, y: 55 }, end: { x: 68, y: 75 }, labelPos: { x: 50, y: 48 }, hint: '由主幹往右拱起並下落基線', sample: [...sampleCubic([32, 55], [32, 45], [68, 45], [68, 60]), ...sampleLine(68, 60, 68, 75)] }
    ]
  },
  i: {
    char: 'i', case: 'lower', sound: 'i is for ink',
    strokes: [
      { id: 1, path: 'M 50 45 L 50 75', start: { x: 50, y: 45 }, end: { x: 50, y: 75 }, labelPos: { x: 42, y: 60 }, hint: '中線到基線垂直短棒', sample: sampleLine(50, 45, 50, 75) },
      { id: 2, path: 'M 50 28 L 50 29', start: { x: 50, y: 28 }, end: { x: 50, y: 29 }, labelPos: { x: 50, y: 20 }, hint: '在頂線與中線中央輕點一點', sample: [[50, 28], [50, 29]] }
    ]
  },
  j: {
    char: 'j', case: 'lower', sound: 'j is for jar',
    strokes: [
      { id: 1, path: 'M 58 45 L 58 95 C 58 106, 36 106, 36 95', start: { x: 58, y: 45 }, end: { x: 36, y: 95 }, labelPos: { x: 66, y: 70 }, hint: '中線下穿底線並向左勾起', sample: [...sampleLine(58, 45, 58, 95), ...sampleCubic([58, 95], [58, 106], [36, 106], [36, 95])] },
      { id: 2, path: 'M 58 28 L 58 29', start: { x: 58, y: 28 }, end: { x: 58, y: 29 }, labelPos: { x: 58, y: 20 }, hint: '在上方輕點一點', sample: [[58, 28], [58, 29]] }
    ]
  },
  k: {
    char: 'k', case: 'lower', sound: 'k is for key',
    strokes: [
      { id: 1, path: 'M 32 15 L 32 75', start: { x: 32, y: 15 }, end: { x: 32, y: 75 }, labelPos: { x: 24, y: 45 }, hint: '長幹從頂線直達基線', sample: sampleLine(32, 15, 32, 75) },
      { id: 2, path: 'M 66 48 L 36 62', start: { x: 66, y: 48 }, end: { x: 36, y: 62 }, labelPos: { x: 56, y: 50 }, hint: '向主幹中點斜畫', sample: sampleLine(66, 48, 36, 62) },
      { id: 3, path: 'M 36 62 L 68 75', start: { x: 36, y: 62 }, end: { x: 68, y: 75 }, labelPos: { x: 58, y: 72 }, hint: '向右下基線斜畫', sample: sampleLine(36, 62, 68, 75) }
    ]
  },
  l: {
    char: 'l', case: 'lower', sound: 'l is for leg',
    strokes: [
      { id: 1, path: 'M 50 15 L 50 75', start: { x: 50, y: 15 }, end: { x: 50, y: 75 }, labelPos: { x: 42, y: 45 }, hint: '從頂線垂直直落基線', sample: sampleLine(50, 15, 50, 75) }
    ]
  },
  m: {
    char: 'm', case: 'lower', sound: 'm is for milk',
    strokes: [
      { id: 1, path: 'M 24 45 L 24 75', start: { x: 24, y: 45 }, end: { x: 24, y: 75 }, labelPos: { x: 16, y: 60 }, hint: '左側短立柱由中線到基線', sample: sampleLine(24, 45, 24, 75) },
      { id: 2, path: 'M 24 55 C 24 45, 50 45, 50 60 L 50 75', start: { x: 24, y: 55 }, end: { x: 50, y: 75 }, labelPos: { x: 38, y: 48 }, hint: '第 1 個拱門落到基線', sample: [...sampleCubic([24, 55], [24, 45], [50, 45], [50, 60]), ...sampleLine(50, 60, 50, 75)] },
      { id: 3, path: 'M 50 55 C 50 45, 76 45, 76 60 L 76 75', start: { x: 50, y: 55 }, end: { x: 76, y: 75 }, labelPos: { x: 64, y: 48 }, hint: '第 2 個拱門落到基線', sample: [...sampleCubic([50, 55], [50, 45], [76, 45], [76, 60]), ...sampleLine(76, 60, 76, 75)] }
    ]
  },
  n: {
    char: 'n', case: 'lower', sound: 'n is for nut',
    strokes: [
      { id: 1, path: 'M 32 45 L 32 75', start: { x: 32, y: 45 }, end: { x: 32, y: 75 }, labelPos: { x: 24, y: 60 }, hint: '短立柱由中線到基線', sample: sampleLine(32, 45, 32, 75) },
      { id: 2, path: 'M 32 55 C 32 45, 68 45, 68 60 L 68 75', start: { x: 32, y: 55 }, end: { x: 68, y: 75 }, labelPos: { x: 50, y: 48 }, hint: '向右拱起並落到基線', sample: [...sampleCubic([32, 55], [32, 45], [68, 45], [68, 60]), ...sampleLine(68, 60, 68, 75)] }
    ]
  },
  o: {
    char: 'o', case: 'lower', sound: 'o is for ox',
    strokes: [
      { id: 1, path: 'M 50 45 C 28 45, 28 75, 50 75 C 72 75, 72 45, 50 45', start: { x: 50, y: 45 }, end: { x: 50, y: 45 }, labelPos: { x: 50, y: 52 }, hint: '在中線與基線間逆時針畫圓', sample: [...sampleCubic([50, 45], [28, 45], [28, 75], [50, 75]), ...sampleCubic([50, 75], [72, 75], [72, 45], [50, 45])] }
    ]
  },
  p: {
    char: 'p', case: 'lower', sound: 'p is for pig',
    strokes: [
      { id: 1, path: 'M 32 45 L 32 105', start: { x: 32, y: 45 }, end: { x: 32, y: 105 }, labelPos: { x: 24, y: 75 }, hint: '由中線下伸貫穿至底線', sample: sampleLine(32, 45, 32, 105) },
      { id: 2, path: 'M 32 55 C 32 45, 68 45, 68 60 C 68 75, 32 75, 32 68', start: { x: 32, y: 55 }, end: { x: 32, y: 68 }, labelPos: { x: 52, y: 48 }, hint: '在右側畫出飽滿圓肚', sample: [...sampleCubic([32, 55], [32, 45], [68, 45], [68, 60]), ...sampleCubic([68, 60], [68, 75], [32, 75], [32, 68])] }
    ]
  },
  q: {
    char: 'q', case: 'lower', sound: 'q is for quiet',
    strokes: [
      { id: 1, path: 'M 68 55 C 68 45, 32 45, 32 60 C 32 75, 68 75, 68 62', start: { x: 68, y: 55 }, end: { x: 68, y: 62 }, labelPos: { x: 50, y: 48 }, hint: '逆時針畫出左邊圓肚', sample: [...sampleCubic([68, 55], [68, 45], [32, 45], [32, 60]), ...sampleCubic([32, 60], [32, 75], [68, 75], [68, 62])] },
      { id: 2, path: 'M 68 45 L 68 105', start: { x: 68, y: 45 }, end: { x: 68, y: 105 }, labelPos: { x: 76, y: 75 }, hint: '由中線垂直貫穿直達底線', sample: sampleLine(68, 45, 68, 105) }
    ]
  },
  r: {
    char: 'r', case: 'lower', sound: 'r is for run',
    strokes: [
      { id: 1, path: 'M 35 45 L 35 75', start: { x: 35, y: 45 }, end: { x: 35, y: 75 }, labelPos: { x: 27, y: 60 }, hint: '垂直短幹由中線至基線', sample: sampleLine(35, 45, 35, 75) },
      { id: 2, path: 'M 35 55 C 35 46, 58 45, 66 50', start: { x: 35, y: 55 }, end: { x: 66, y: 50 }, labelPos: { x: 50, y: 44 }, hint: '向右上畫出小枝芽弧線', sample: sampleCubic([35, 55], [35, 46], [58, 45], [66, 50]) }
    ]
  },
  s: {
    char: 's', case: 'lower', sound: 's is for six',
    strokes: [
      { id: 1, path: 'M 64 52 C 50 45, 35 49, 40 58 C 45 64, 65 62, 62 68 C 58 75, 42 75, 34 68', start: { x: 64, y: 52 }, end: { x: 34, y: 68 }, labelPos: { x: 50, y: 46 }, hint: '在中線與基線間寫小 S', sample: [...sampleCubic([64, 52], [50, 45], [35, 49], [40, 58]), ...sampleCubic([40, 58], [45, 64], [65, 62], [62, 68]), ...sampleCubic([62, 68], [58, 75], [42, 75], [34, 68])] }
    ]
  },
  t: {
    char: 't', case: 'lower', sound: 't is for top',
    strokes: [
      { id: 1, path: 'M 48 22 L 48 68 C 48 75, 62 75, 62 68', start: { x: 48, y: 22 }, end: { x: 62, y: 68 }, labelPos: { x: 40, y: 45 }, hint: '自接近頂線處下行並向右微勾', sample: [...sampleLine(48, 22, 48, 68), ...sampleCubic([48, 68], [48, 75], [62, 75], [62, 68])] },
      { id: 2, path: 'M 34 45 L 62 45', start: { x: 34, y: 45 }, end: { x: 62, y: 45 }, labelPos: { x: 48, y: 52 }, hint: '在中線上畫水平橫線', sample: sampleLine(34, 45, 62, 45) }
    ]
  },
  u: {
    char: 'u', case: 'lower', sound: 'u is for under',
    strokes: [
      { id: 1, path: 'M 32 45 L 32 64 C 32 75, 68 75, 68 64 L 68 45', start: { x: 32, y: 45 }, end: { x: 68, y: 45 }, labelPos: { x: 24, y: 55 }, hint: '中線下行環抱回中線', sample: [...sampleLine(32, 45, 32, 64), ...sampleCubic([32, 64], [32, 75], [68, 75], [68, 64]), ...sampleLine(68, 64, 68, 45)] },
      { id: 2, path: 'M 68 45 L 68 75', start: { x: 68, y: 45 }, end: { x: 68, y: 75 }, labelPos: { x: 76, y: 60 }, hint: '右側垂直靠攏至基線', sample: sampleLine(68, 45, 68, 75) }
    ]
  },
  v: {
    char: 'v', case: 'lower', sound: 'v is for vet',
    strokes: [
      { id: 1, path: 'M 30 45 L 50 75', start: { x: 30, y: 45 }, end: { x: 50, y: 75 }, labelPos: { x: 38, y: 58 }, hint: '由中線向基線中央斜下', sample: sampleLine(30, 45, 50, 75) },
      { id: 2, path: 'M 50 75 L 70 45', start: { x: 50, y: 75 }, end: { x: 70, y: 45 }, labelPos: { x: 62, y: 58 }, hint: '由基線中央向右頂斜上', sample: sampleLine(50, 75, 70, 45) }
    ]
  },
  w: {
    char: 'w', case: 'lower', sound: 'w is for win',
    strokes: [
      { id: 1, path: 'M 20 45 L 32 75', start: { x: 20, y: 45 }, end: { x: 32, y: 75 }, labelPos: { x: 24, y: 60 }, hint: '第 1 劃向基線斜下', sample: sampleLine(20, 45, 32, 75) },
      { id: 2, path: 'M 32 75 L 48 55', start: { x: 32, y: 75 }, end: { x: 48, y: 55 }, labelPos: { x: 40, y: 66 }, hint: '第 2 劃向中線斜上', sample: sampleLine(32, 75, 48, 55) },
      { id: 3, path: 'M 48 55 L 64 75', start: { x: 48, y: 55 }, end: { x: 64, y: 75 }, labelPos: { x: 56, y: 66 }, hint: '第 3 劃向基線斜下', sample: sampleLine(48, 55, 64, 75) },
      { id: 4, path: 'M 64 75 L 78 45', start: { x: 64, y: 75 }, end: { x: 78, y: 45 }, labelPos: { x: 72, y: 60 }, hint: '第 4 劃向中線斜上', sample: sampleLine(64, 75, 78, 45) }
    ]
  },
  x: {
    char: 'x', case: 'lower', sound: 'x is for box',
    strokes: [
      { id: 1, path: 'M 32 45 L 68 75', start: { x: 32, y: 45 }, end: { x: 68, y: 75 }, labelPos: { x: 42, y: 54 }, hint: '左上往右下對角交叉', sample: sampleLine(32, 45, 68, 75) },
      { id: 2, path: 'M 68 45 L 32 75', start: { x: 68, y: 45 }, end: { x: 32, y: 75 }, labelPos: { x: 58, y: 54 }, hint: '右上往左下對角交叉', sample: sampleLine(68, 45, 32, 75) }
    ]
  },
  y: {
    char: 'y', case: 'lower', sound: 'y is for yo-yo',
    strokes: [
      { id: 1, path: 'M 30 45 L 50 75', start: { x: 30, y: 45 }, end: { x: 50, y: 75 }, labelPos: { x: 38, y: 58 }, hint: '中線向基線斜下短筆', sample: sampleLine(30, 45, 50, 75) },
      { id: 2, path: 'M 70 45 L 34 105', start: { x: 70, y: 45 }, end: { x: 34, y: 105 }, labelPos: { x: 58, y: 70 }, hint: '右中線向下長斜貫穿至底線', sample: sampleLine(70, 45, 34, 105) }
    ]
  },
  z: {
    char: 'z', case: 'lower', sound: 'z is for zoo',
    strokes: [
      { id: 1, path: 'M 32 48 L 68 48', start: { x: 32, y: 48 }, end: { x: 68, y: 48 }, labelPos: { x: 50, y: 44 }, hint: '中線橫線向右', sample: sampleLine(32, 48, 68, 48) },
      { id: 2, path: 'M 68 48 L 32 72', start: { x: 68, y: 48 }, end: { x: 32, y: 72 }, labelPos: { x: 50, y: 60 }, hint: '對角斜線往左下', sample: sampleLine(68, 48, 32, 72) },
      { id: 3, path: 'M 32 72 L 68 72', start: { x: 32, y: 72 }, end: { x: 68, y: 72 }, labelPos: { x: 50, y: 78 }, hint: '基底橫線向右', sample: sampleLine(32, 72, 68, 72) }
    ]
  }
};

export const ALL_STROKES = { ...UPPER_STROKES, ...LOWER_STROKES };

/**
 * 取得指定字元的筆劃定義
 */
export const getLetterStrokes = (char) => {
  if (!char) return null;
  return ALL_STROKES[char] || null;
};

/**
 * 點雲幾何比對演算法 ($P Point-Cloud Recognizer 輕量化純前端實作)
 * 評定學生在 Freehand Challenge 下書寫的筆順與形狀分數 (0 ~ 100)
 */
export const evaluateHandwriting = ({
  targetChar,
  userStrokes = [], // Array of stroke point arrays: [ [{x, y}, ...], [{x, y}, ...] ]
  isGuidedTracing = false
}) => {
  const model = getLetterStrokes(targetChar);
  if (!model) {
    return { score: 100, stars: 3, passed: true, feedback: '書寫完成！' };
  }

  // 描寫版：只要各劃皆有描寫即 100% 滿分
  if (isGuidedTracing) {
    return {
      score: 100,
      stars: 3,
      passed: true,
      feedback: '🎉 筆順引導描紅完成！標準握筆與順序全對！',
      details: { strokeCountOk: true, directionOk: true, accuracy: 100 }
    };
  }

  const expectedStrokes = model.strokes;
  const expCount = expectedStrokes.length;
  const userCount = userStrokes.length;

  if (userCount === 0) {
    return {
      score: 0,
      stars: 1,
      passed: false,
      feedback: '畫布上未檢測到筆劃，請在四線三格內書寫！',
      details: { strokeCountOk: false, directionOk: false, accuracy: 0 }
    };
  }

  // 1. 筆劃數判定 (容許 ±1 劃)
  const countDiff = Math.abs(userCount - expCount);
  let countScore = 30;
  if (countDiff === 0) countScore = 30;
  else if (countDiff === 1) countScore = 20;
  else countScore = 10;

  // 2. 向量方向與起終點判定 (起筆與落筆方位是否正確)
  let directionScore = 35;
  let dirMatches = 0;
  const pairLimit = Math.min(userCount, expCount);

  for (let i = 0; i < pairLimit; i++) {
    const uStroke = userStrokes[i];
    const eStroke = expectedStrokes[i];
    if (!uStroke || uStroke.length < 2) continue;

    const uStart = uStroke[0];
    const uEnd = uStroke[uStroke.length - 1];
    const uDx = uEnd.x - uStart.x;
    const uDy = uEnd.y - uStart.y;

    const eDx = eStroke.end.x - eStroke.start.x;
    const eDy = eStroke.end.y - eStroke.start.y;

    // 向量點積判定方向相似度
    const dot = uDx * eDx + uDy * eDy;
    const magU = Math.sqrt(uDx * uDx + uDy * uDy) || 1;
    const magE = Math.sqrt(eDx * eDx + eDy * eDy) || 1;
    const cosTheta = dot / (magU * magE);

    if (cosTheta > 0.4) {
      dirMatches++;
    }
  }

  directionScore = Math.round((dirMatches / Math.max(1, expCount)) * 35);

  // 3. 點雲幾何重疊度 (取樣平均距離)
  let shapeScore = 35;
  let totalDist = 0;
  let sampleCount = 0;

  for (let i = 0; i < pairLimit; i++) {
    const uStroke = userStrokes[i];
    const eSamples = expectedStrokes[i].sample || [];
    if (!uStroke || uStroke.length === 0 || eSamples.length === 0) continue;

    // 均勻重取樣平滑比對
    const uDense = resamplePoints(uStroke, 16);
    for (let k = 0; k < eSamples.length; k++) {
      const targetPt = eSamples[k];
      let minDist = 999;
      for (let j = 0; j < uDense.length; j++) {
        const d = Math.hypot(uDense[j].x - targetPt[0], uDense[j].y - targetPt[1]);
        if (d < minDist) minDist = d;
      }
      totalDist += minDist;
      sampleCount++;
    }
  }

  const avgDist = sampleCount > 0 ? totalDist / sampleCount : 30;
  shapeScore = Math.max(5, Math.min(35, Math.round(35 - Math.max(0, avgDist - 8) * 1.5)));

  const totalScore = Math.min(100, Math.max(30, countScore + directionScore + shapeScore));
  const stars = totalScore >= 80 ? 3 : (totalScore >= 60 ? 2 : 1);
  const passed = totalScore >= 60;

  let feedback = '字形與筆順非常標準！大武山神筆勇士！';
  if (totalScore < 60) {
    feedback = '請注意四線三格位置與筆劃順序，再試一次一定能成功！';
  } else if (totalScore < 80) {
    feedback = '書寫良好！若注意第 1 劃起筆位置，就能衝上三星！';
  }

  return {
    score: totalScore,
    stars,
    passed,
    feedback,
    details: {
      countScore,
      directionScore,
      shapeScore,
      userCount,
      expCount
    }
  };
};
