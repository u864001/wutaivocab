/**
 * 霧臺英語宇宙 2.0 - 學期換日與金幣積分重設管理模組
 *
 * 學期劃分規則 (依臺灣國小學期標準制)：
 * 1. 上學期：每年 8 月 1 日 00:00 至 翌年 1 月 31 日 23:59:59 (跨 1/31 ~ 2/1 換日)
 * 2. 下學期：每年 2 月 1 日 00:00 至 7 月 31 日 23:59:59 (跨 7/31 ~ 8/1 換日)
 *
 * 金幣與積分定位：
 * - 金幣 (Coins)：長期累積保存，反映學生是否認真玩本年級遊戲與商城購買力，至學期換日時清 0 重跑。
 * - 探索積分 (Quest Points)：長期累積保存，反映學生是否認真解英語對話與小鎮任務，至學期換日時清 0 重跑。
 * - 背包資產 (Inventory)：實體收藏道具、家具裝飾、稱號永久保存，換學期不遺失！
 */

/**
 * 取得當前日期的學期識別碼 (格式: 民國學年度-學期，例如 "115-1" 或 "115-2")
 * @param {Date} date
 * @returns {string} e.g. "115-1", "115-2"
 */
export const getCurrentSemesterId = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1 ~ 12

  // 臺灣學年度：以 8 月 1 日為新學年分界點
  // 民國年 = 西元年 - 1911
  let academicYear;
  let semesterNum;

  if (month >= 8) {
    // 8月 ~ 12月：當前民國學年度第 1 學期 (上學期)
    academicYear = year - 1911;
    semesterNum = 1;
  } else if (month === 1) {
    // 1月：仍屬前一年 8 月開始的學年度第 1 學期 (上學期結束於 1/31)
    academicYear = (year - 1) - 1911;
    semesterNum = 1;
  } else {
    // 2月 ~ 7月：前一年 8 月開始的學年度第 2 學期 (下學期，2/1 ~ 7/31)
    academicYear = (year - 1) - 1911;
    semesterNum = 2;
  }

  return `${academicYear}-${semesterNum}`;
};

/**
 * 取得學期的親切繁體中文顯示文字
 * @param {string} semesterId e.g. "115-1"
 * @param {string} lang
 * @returns {string} e.g. "115學年度 第1學期"
 */
export const getSemesterDisplayName = (semesterId = null, lang = 'zh-TW') => {
  const sid = semesterId || getCurrentSemesterId();
  const [yearStr, semStr] = sid.split('-');

  if (lang === 'zh-TW') {
    return `${yearStr}學年度 第${semStr}學期`;
  }
  return `Academic Year ${yearStr} Semester ${semStr}`;
};

/**
 * 檢查學生 Profile：完整守護學生一整學期的金幣與積分，並提供歷史誤歸零自動復原機制
 * @param {Object} profile 學生存檔資料
 * @returns {Object} 處理後的學生存檔資料
 */
export const checkAndApplySemesterReset = (profile) => {
  if (!profile || typeof profile !== 'object') return profile;

  const currentSemesterId = getCurrentSemesterId();
  const historyList = Array.isArray(profile.semester_history) ? [...profile.semester_history] : [];
  let currentCoins = Math.max(0, Number(profile.coins) || 0);
  let currentQP = Math.max(0, Number(profile.quest_points) || 0);

  // ── 🛡️ 歷史金幣/積分安全自動復原機制 (Auto-Recovery) ──
  // 若學生當前金幣為 0，但封存歷史中有累積金幣或積分，自動完整加總還原！
  if (currentCoins === 0 && historyList.length > 0) {
    const recoveredCoins = historyList.reduce((sum, h) => sum + (Number(h.coins) || 0), 0);
    const recoveredQP = historyList.reduce((sum, h) => sum + (Number(h.quest_points) || 0), 0);
    if (recoveredCoins > 0 || recoveredQP > 0) {
      console.log(`[金幣積分守護] 檢測到學生 ${profile.student_id || profile.nickname} 歷史資產，自動復原金幣: +${recoveredCoins}, 探索積分: +${recoveredQP}`);
      currentCoins = Math.max(currentCoins, recoveredCoins);
      currentQP = Math.max(currentQP, recoveredQP);
    }
  }

  // 若學生尚未記錄學期代碼（初次導入學期系統）：初始化為當前學期，保留當前金幣與積分
  if (!profile.semester_id) {
    return {
      ...profile,
      coins: currentCoins,
      quest_points: currentQP,
      semester_id: currentSemesterId,
      semester_history: historyList
    };
  }

  // 若學期相同，保留並回傳已校準之資料
  if (profile.semester_id === currentSemesterId) {
    return {
      ...profile,
      coins: currentCoins,
      quest_points: currentQP,
      semester_history: historyList
    };
  }

  // ── 跨學期平滑過渡 (保留學生整學期辛苦累積成果，絕對不抹除金幣) ──
  console.log(`[學期更新] 學生 ${profile.student_id || profile.nickname} 學期代碼平滑過渡 (${profile.semester_id} -> ${currentSemesterId})，資產 100% 完整保留。`);
  historyList.push({
    semester_id: profile.semester_id,
    coins: currentCoins,
    quest_points: currentQP,
    archived_at: new Date().toISOString()
  });

  return {
    ...profile,
    coins: currentCoins, // 嚴格保留整學期累積金幣！
    quest_points: currentQP, // 嚴格保留探索積分！
    semester_id: currentSemesterId,
    semester_history: historyList
  };
};
