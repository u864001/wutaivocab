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
 * 檢查學生 Profile 是否經歷學期換日，若跨學期則自動歸零金幣與積分並封存歷史
 * @param {Object} profile 學生存檔資料
 * @returns {Object} 處理後的學生存檔資料
 */
export const checkAndApplySemesterReset = (profile) => {
  if (!profile || typeof profile !== 'object') return profile;

  const currentSemesterId = getCurrentSemesterId();

  // 若學生尚未記錄學期代碼（初次導入學期系統）：初始化為當前學期，保留當前金幣與積分
  if (!profile.semester_id) {
    return {
      ...profile,
      semester_id: currentSemesterId,
      semester_history: Array.isArray(profile.semester_history) ? profile.semester_history : []
    };
  }

  // 若學期相同，無需重置
  if (profile.semester_id === currentSemesterId) {
    return profile;
  }

  // ── 跨越學期換日 (1/31 -> 2/1 或 7/31 -> 8/1) ──
  console.log(`[學期換日] 學生 ${profile.student_id || profile.nickname} 迎來新學期 (${profile.semester_id} -> ${currentSemesterId})，金幣與積分結算重置。`);

  const prevCoins = Number(profile.coins) || 0;
  const prevQuestPoints = Number(profile.quest_points) || 0;

  const history = Array.isArray(profile.semester_history) ? [...profile.semester_history] : [];
  history.push({
    semester_id: profile.semester_id,
    coins: prevCoins,
    quest_points: prevQuestPoints,
    archived_at: new Date().toISOString()
  });

  return {
    ...profile,
    coins: 0,
    quest_points: 0,
    semester_id: currentSemesterId,
    semester_history: history,
    has_just_reset_semester: true, // 標記以利前端彈出恭賀新學期廣播
    last_reset_notice: `🎉 歡迎進入${getSemesterDisplayName(currentSemesterId)}！全新學期競賽已開跑，金幣與探索積分重新啟程！`
  };
};
