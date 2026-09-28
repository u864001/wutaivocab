/**
 * 隕石地球守衛戰：統一物理下墜與動態重力加速度運算引擎
 * 確保 2D 與 3D 的下落動態、反應時間、手感毫秒級同步
 */

/**
 * 依據目前累計題數計算該顆隕石的基礎掉落時長 (秒)
 * 隨題數增加，基礎時間由 5.6 秒平滑收斂至 1.8 秒
 */
export const calculateMeteorDuration = (questionIndex) => {
  const q = Math.max(0, questionIndex || 0);
  // 基礎公式：5.6 / (1 + q * 0.035)，下限 1.75 秒
  const base = 5.6 / (1 + q * 0.035);
  return Math.max(1.75, base);
};

/**
 * 計算兩段式位移進度 (0.0 ~ 1.0)
 * 
 * 1. 平滑巡航段 (L_smooth)：
 *    前期的題目給予平滑等速滑行，讓學生有充足時間看字認題。
 *    平滑距離比例隨題數減少：L_smooth = max(0, 0.60 - q * 0.03)
 *    當 q >= 20 時，平滑段歸零，一出現立即進入自由落體！
 * 
 * 2. 自由落體加速段 (Free Fall)：
 *    在平滑段結束後，套用重力加速度 (y = v0*t + 0.5*g*t^2)。
 *    當平滑段已歸零 (q > 20)，額外增加重力加速度乘數，隕石如砲彈暴扣而下。
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

  // 1. 平滑巡航距離比例 (0 ~ 0.60)
  const lSmooth = Math.max(0, 0.60 - q * 0.03);

  // 2. 超過 20 題後的額外重力加成乘數 (1.0 ~ 2.2)
  const accelBoost = 1.0 + Math.max(0, (q - 20) * 0.06);

  if (lSmooth >= 0.05) {
    // 兩段式混合模式
    const tSmoothEnd = lSmooth; // 時間分配比例對應距離
    if (t <= tSmoothEnd) {
      // 第一段：等速平滑滑行 (0 -> lSmooth)
      return (t / tSmoothEnd) * lSmooth;
    } else {
      // 第二段：自由落體加速逼近 (lSmooth -> 1.0)
      const p = (t - tSmoothEnd) / (1.0 - tSmoothEnd);
      // 結合線性與二次加速曲線
      const ease = Math.pow(p, 1.8 * Math.min(accelBoost, 1.5));
      return lSmooth + ease * (1.0 - lSmooth);
    }
  } else {
    // 平滑段已歸零：純自由落體全速加速模式
    const exponent = 1.5 * accelBoost;
    return Math.pow(t, exponent);
  }
};
