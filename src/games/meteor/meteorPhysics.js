/**
 * 隕石地球守衛戰：統一物理下墜與動態重力加速度運算引擎
 * 確保 2D 與 3D 的下落動態、反應時間、手感毫秒級同步
 */

/**
 * 依據目前累計題數計算該顆隕石的基礎掉落時長 (秒)
 * - 0 ~ 30 題：由 5.4 秒平滑收斂至 1.8 秒
 * - 31 題以上：進入極速超頻模式，由 1.8 秒持續陡降至 0.85 秒！
 */
export const calculateMeteorDuration = (questionIndex) => {
  const q = Math.max(0, questionIndex || 0);

  if (q <= 30) {
    // 0 ~ 30 題：給予足夠反應學習期，每題遞減約 0.12 秒，下限 1.8 秒
    return Math.max(1.8, 5.4 - q * 0.12);
  } else {
    // 31 題以上：大幅縮短留空時間，每題縮短 0.055 秒，極限逼近 0.85 秒
    const over = q - 30;
    return Math.max(0.85, 1.8 - over * 0.055);
  }
};

/**
 * 計算兩段式位移進度 (0.0 ~ 1.0)
 * 
 * 1. 平滑巡航段 (0 ~ 20 題)：
 *    L_smooth = max(0, 0.60 - q * 0.03)，前段等速、後段加速。
 * 
 * 2. 純自由落體段 (21 ~ 30 題)：
 *    平滑段歸零，一出現就開始重力自由加速。
 * 
 * 3. 初速度灌注 + 末段暴扣段 (31 題以上)：
 *    隕石不再從 0 速度開始下落，而是帶有極高的初始垂直初速度 (v0)，
 *    一進場就像被軌道砲直射一樣全速衝撞，保證 35~45 題內必定自然完結！
 * 
 * @param {number} elapsed 經過時間 (秒)
 * @param {number} duration 總時長 (秒)
 * @param {number} questionIndex 題數累計 (答對數)
 * @returns {number} motionProgress 0.0 到 1.0 的空間位移進度
 */
export const calculateMeteorMotionProgress = (elapsed, duration, questionIndex) => {
  if (duration <= 0) return 1.0;
  const t = Math.min(Math.max(elapsed / duration, 0), 1.0);
  const q = Math.max(0, questionIndex || 0);

  // 1. 前 20 題：平滑等速巡航縮減階段
  if (q <= 20) {
    const lSmooth = Math.max(0, 0.60 - q * 0.03);
    const tSmoothEnd = lSmooth;

    if (t <= tSmoothEnd && tSmoothEnd > 0) {
      // 等速巡航
      return (t / tSmoothEnd) * lSmooth;
    } else {
      // 自由加速
      const p = (t - tSmoothEnd) / (1.0 - tSmoothEnd);
      const ease = Math.pow(p, 1.8);
      return lSmooth + ease * (1.0 - lSmooth);
    }
  }

  // 2. 21 ~ 30 題：無巡航，純自由落體加速度遞增
  if (q <= 30) {
    const accelBoost = 1.0 + (q - 20) * 0.08;
    const exponent = 1.5 * accelBoost;
    return Math.pow(t, exponent);
  }

  // 3. 31 題以上：逐題注入極高「下落初速度 (v0)」
  // 讓隕石在畫面最頂端就已經是高速衝刺狀態，大幅削減頂部反應時間
  const over = q - 30;
  const initialV = Math.min(0.85, over * 0.055); // 0.055 ~ 0.85 初速度權重
  const exponent = 2.2 + over * 0.05; // 隨題數加速度持續變陡

  // 結合初速度位移與二次暴扣重力
  const linearPortion = initialV * t;
  const accelPortion = (1.0 - initialV) * Math.pow(t, exponent);
  return Math.min(1.0, linearPortion + accelPortion);
};
