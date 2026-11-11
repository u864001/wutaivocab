/**
 * 鷹眼神探 單一座標真實來源 (Single Source of Truth, SSOT) 幾何解算器 (spotterGeometry.js)
 *
 * 規範依據 (鐵律 7)：
 * 1. 動態 Slot 場景一律以 `slot` ({ x, y, w, h, rx }) 為唯一座標真實來源。
 *    - 點擊判定：採用矩形全覆蓋（含觸控寬容 padding），徹底解決內接橢圓削掉長方形補丁四角的痛點。
 *    - 視覺呈現：聚光燈孔徑、提示光圈、已破解印記全數以對齊 slot 之圓角矩形繪製，100% 幾何連動。
 * 2. 舊版靜態場景（無 slot）平滑降級（fallback）至傳統橢圓幾何 (`x, y, radiusX, radiusY, rotate`)。
 */

export function getDiffGeometry(diff, isLeft = false) {
  if (!diff) return null;

  if (diff.slot) {
    const x = Number(diff.slot.x) || 0;
    const y = Number(diff.slot.y) || 0;
    const w = Number(diff.slot.w) || 40;
    const h = Number(diff.slot.h) || 40;
    const cornerRadius = Number(diff.slot.rx) || 16;
    const cx = x + w / 2;
    const cy = y + h / 2;
    const rx = w / 2;
    const ry = h / 2;

    return {
      isSlot: true,
      x,
      y,
      w,
      h,
      cx,
      cy,
      rx,
      ry,
      cornerRadius,
      containsPoint(clickX, clickY, touchMargin = 8) {
        return (
          clickX >= x - touchMargin &&
          clickX <= x + w + touchMargin &&
          clickY >= y - touchMargin &&
          clickY <= y + h + touchMargin
        );
      }
    };
  }

  // 舊版靜態場景 fallback (無 slot)
  const cx = (!isLeft && diff.altX !== undefined) ? Number(diff.altX) : (Number(diff.x) || 0);
  const cy = (!isLeft && diff.altY !== undefined) ? Number(diff.altY) : (Number(diff.y) || 0);
  const rx = Number(diff.radiusX || diff.radius) || 46;
  const ry = Number(diff.radiusY || diff.radius) || 46;
  const rotate = Number(diff.rotate) || 0;

  return {
    isSlot: false,
    x: cx - rx,
    y: cy - ry,
    w: rx * 2,
    h: ry * 2,
    cx,
    cy,
    rx,
    ry,
    rotate,
    cornerRadius: Math.min(rx, ry),
    containsPoint(clickX, clickY, touchMargin = 8) {
      const effRx = rx + touchMargin;
      const effRy = ry + touchMargin;
      let dx = clickX - cx;
      let dy = clickY - cy;

      if (rotate) {
        const rad = (-rotate * Math.PI) / 180;
        const nx = dx * Math.cos(rad) - dy * Math.sin(rad);
        const ny = dx * Math.sin(rad) + dy * Math.cos(rad);
        dx = nx;
        dy = ny;
      }

      return Math.pow(dx / effRx, 2) + Math.pow(dy / effRy, 2) <= 1.0;
    }
  };
}
