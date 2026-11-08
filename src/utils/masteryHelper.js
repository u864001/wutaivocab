/**
 * 霧臺國小三大英語檢定軌道：動態滾動精熟引擎 (Rolling Mastery Engine)
 * 規格見 docs/exam/THREE_EXAM_TRACKS_MASTERY_AND_LEADERBOARD_SPEC.md
 *
 * 核心原則：
 * 1. 拒絕歷史懲罰：評量學生當前能力，非懲罰歷史錯誤。
 * 2. 成長型思維：錯題後只要累計「連對 2 次」，即翻盤解鎖為精熟（連續猜對機率僅 6.25%）。
 * 3. 分母固定為題庫總試題數（如 Pre-A1 為 300 題），確保數據真實覆蓋。
 */

export const MASTERY_STATES = {
  UNATTEMPTED: 'unattempted', // ⚪ 未挑戰
  MASTERED: 'mastered',       // 🟢 完全精熟
  REMEDIAL: 'remedial',       // 🔴 待加強
  PROBATION: 'probation'      // 🟡 考驗期（錯題後第 1 次答對，需再對 1 次方可解鎖）
};

/**
 * 計算下一動態精熟狀態
 * @param {string} currentState 當前狀態
 * @param {number} consecutiveCorrect 當前連續答對次數
 * @param {boolean} isCorrect 本次是否答對
 * @returns {{ status: string, consecutiveCorrect: number }}
 */
export function nextMasteryState(currentState = MASTERY_STATES.UNATTEMPTED, consecutiveCorrect = 0, isCorrect = false) {
  if (currentState === MASTERY_STATES.UNATTEMPTED) {
    if (isCorrect) {
      return { status: MASTERY_STATES.MASTERED, consecutiveCorrect: 1 };
    }
    return { status: MASTERY_STATES.REMEDIAL, consecutiveCorrect: 0 };
  }

  if (currentState === MASTERY_STATES.MASTERED) {
    if (isCorrect) {
      return { status: MASTERY_STATES.MASTERED, consecutiveCorrect: (consecutiveCorrect || 1) + 1 };
    }
    // 精熟後若答錯，立即扣回待加強
    return { status: MASTERY_STATES.REMEDIAL, consecutiveCorrect: 0 };
  }

  if (currentState === MASTERY_STATES.REMEDIAL) {
    if (isCorrect) {
      // 錯題後首次答對，進入觀察期
      return { status: MASTERY_STATES.PROBATION, consecutiveCorrect: 1 };
    }
    return { status: MASTERY_STATES.REMEDIAL, consecutiveCorrect: 0 };
  }

  if (currentState === MASTERY_STATES.PROBATION) {
    if (isCorrect) {
      // 錯題後連對第 2 次：成功翻盤為完全精熟！
      return { status: MASTERY_STATES.MASTERED, consecutiveCorrect: 2 };
    }
    // 考驗期再錯，退回待加強
    return { status: MASTERY_STATES.REMEDIAL, consecutiveCorrect: 0 };
  }

  return { status: isCorrect ? MASTERY_STATES.MASTERED : MASTERY_STATES.REMEDIAL, consecutiveCorrect: isCorrect ? 1 : 0 };
}

/**
 * 計算精熟度星級（品質指標：以本人做過的題目為分母）
 * 規則（方案 C + 無空星原則）：
 * - 未挑戰 (attemptedCount === 0) 或 答對率 < 50%：0 星（不顯示任何星星，留白乾淨）
 * - 50% ~ 69%：1 顆立體金星 (基礎及格)
 * - 70% ~ 89%：2 顆立體金星 (良等熟練)
 * - 90% ~ 99%：3 顆立體金星 (優等精熟)
 * - 100% 滿分精熟：3 顆立體金星 + isPerfect = true (觸發 45度金屬流光 + 呼吸金光)
 * @param {number} masteryRate 精熟百分比 (0-100)
 * @param {number} attemptedCount 累計挑戰過之題數
 */
export function getMasteryLevel(masteryRate = 0, attemptedCount = 0) {
  if (!attemptedCount || attemptedCount <= 0) {
    return {
      stars: 0,
      isPerfect: false,
      color: 'slate',
      bgClass: 'bg-slate-100 dark:bg-slate-800/60',
      textClass: 'text-slate-500 dark:text-slate-400',
      borderClass: 'border-slate-300 dark:border-slate-700',
      label: '未挑戰'
    };
  }

  if (masteryRate < 50) {
    return {
      stars: 0,
      isPerfect: false,
      color: 'rose',
      bgClass: 'bg-rose-50 dark:bg-rose-950/40',
      textClass: 'text-rose-600 dark:text-rose-400',
      borderClass: 'border-rose-250 dark:border-rose-800',
      label: '待加強'
    };
  }

  if (masteryRate < 70) {
    return {
      stars: 1,
      isPerfect: false,
      color: 'amber',
      bgClass: 'bg-amber-50 dark:bg-amber-950/40',
      textClass: 'text-amber-600 dark:text-amber-400',
      borderClass: 'border-amber-250 dark:border-amber-800',
      label: '基礎'
    };
  }

  if (masteryRate < 90) {
    return {
      stars: 2,
      isPerfect: false,
      color: 'sky',
      bgClass: 'bg-sky-50 dark:bg-sky-950/40',
      textClass: 'text-sky-600 dark:text-sky-400',
      borderClass: 'border-sky-250 dark:border-sky-800',
      label: '熟練'
    };
  }

  if (masteryRate < 100) {
    return {
      stars: 3,
      isPerfect: false,
      color: 'emerald',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
      textClass: 'text-emerald-600 dark:text-emerald-400',
      borderClass: 'border-emerald-250 dark:border-emerald-800',
      label: '精熟'
    };
  }

  // 100% 滿分神級（全數精熟零錯題）
  return {
    stars: 3,
    isPerfect: true,
    color: 'yellow',
    bgClass: 'bg-yellow-50 dark:bg-yellow-950/40',
    textClass: 'text-amber-600 dark:text-amber-300',
    borderClass: 'border-amber-300 dark:border-amber-700',
    label: '滿分精熟'
  };
}

/**
 * 計算莫蘭迪題庫涵蓋率五階層次（底色指標：以題庫總題數為分母）
 * 規則：
 * - < 50%    : 淡霧灰 (Mist Gray) - 採樣起步
 * - 50%~69%  : 淡暖燕麥棕 (Oat Brown) - 初探開拓
 * - 70%~79%  : 淡鼠尾草綠 (Sage Green) - 熟練深造
 * - 80%~89%  : 淡霧霾藍 (Haze Blue) - 黃金廣博
 * - ≥ 90%    : 淡香檳暖金 (Champagne Gold) - 宗師全通
 * @param {number} attemptedCount 學生做過的題數
 * @param {number} totalBank 該題庫/子題型總題數
 */
export function getMorandiCoverageTier(attemptedCount = 0, totalBank = 1) {
  const safeBank = Math.max(1, totalBank || 1);
  const rate = Math.round((attemptedCount / safeBank) * 100);

  if (rate < 50) {
    return {
      tier: 'gray',
      rate,
      label: '採樣起步',
      bgCard: 'bg-slate-50/80 dark:bg-slate-850/60',
      borderCard: 'border-slate-200/80 dark:border-slate-700/60',
      pillBg: 'bg-slate-100 text-slate-600 dark:bg-slate-850 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      barColor: 'bg-slate-400'
    };
  }
  if (rate < 70) {
    return {
      tier: 'brown',
      rate,
      label: '初探開拓',
      bgCard: 'bg-amber-50/40 dark:bg-amber-950/20',
      borderCard: 'border-amber-200/60 dark:border-amber-900/40',
      pillBg: 'bg-amber-100/70 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 border-amber-300/60 dark:border-amber-800/50',
      barColor: 'bg-amber-500'
    };
  }
  if (rate < 80) {
    return {
      tier: 'green',
      rate,
      label: '熟練深造',
      bgCard: 'bg-emerald-50/40 dark:bg-emerald-950/20',
      borderCard: 'border-emerald-200/60 dark:border-emerald-900/40',
      pillBg: 'bg-emerald-100/70 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border-emerald-300/60 dark:border-emerald-800/50',
      barColor: 'bg-emerald-500'
    };
  }
  if (rate < 90) {
    return {
      tier: 'blue',
      rate,
      label: '黃金廣博',
      bgCard: 'bg-sky-50/40 dark:bg-sky-950/20',
      borderCard: 'border-sky-200/60 dark:border-sky-900/40',
      pillBg: 'bg-sky-100/70 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200 border-sky-300/60 dark:border-sky-800/50',
      barColor: 'bg-sky-500'
    };
  }
  return {
    tier: 'gold',
    rate,
    label: '宗師全通',
    bgCard: 'bg-yellow-50/60 dark:bg-yellow-950/25',
    borderCard: 'border-yellow-300/70 dark:border-yellow-800/50',
    pillBg: 'bg-yellow-100/80 text-yellow-900 dark:bg-yellow-900/50 dark:text-yellow-200 border-yellow-300/80 dark:border-yellow-700/60',
    barColor: 'bg-yellow-500'
  };
}

/** 取得學生本機精熟快照鍵名 */
export function getMasteryStorageKey(studentId) {
  const sid = studentId || 'guest';
  return `wutai_exam_mastery_${sid}`;
}

/** 讀取學生本機精熟快照 */
export function loadStudentMastery(studentId) {
  const key = getMasteryStorageKey(studentId);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return createEmptyMasterySnapshot(studentId);
    const snap = JSON.parse(raw);
    if (!snap?.tracks) return createEmptyMasterySnapshot(studentId);
    return snap;
  } catch {
    return createEmptyMasterySnapshot(studentId);
  }
}

/** 建立初始空白快照 */
export function createEmptyMasterySnapshot(studentId) {
  return {
    student_id: studentId || 'guest',
    updated_at: new Date().toISOString(),
    tracks: {
      'tme-preA1': {
        total_items: 300,
        mastered_count: 0,
        attempted_count: 0,
        total_attempts: 0,
        items: {}
      }
    }
  };
}

/** 儲存學生本機精熟快照 */
export function saveStudentMastery(studentId, snapshot) {
  const key = getMasteryStorageKey(studentId);
  try {
    const payload = {
      ...snapshot,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // 忽略 localStorage 空間超出例外
  }
}

/**
 * 作答完成後，記錄作答結果並滾動更新精熟狀態
 * @param {string} studentId 學生 ID
 * @param {string} track 測驗軌道 ('tme-preA1' | 'curriculum' | 'ministry-assessment')
 * @param {Array} questions 試卷題目陣列
 * @param {Array} answers 學生作答選項索引陣列
 * @param {boolean} isFormal 是否為正式施測模式
 * @returns {Object} 更新後的精熟度快照
 */
export function recordExamMasterySession(studentId, track = 'tme-preA1', questions = [], answers = [], isFormal = false) {
  const snap = loadStudentMastery(studentId);
  if (!snap.tracks[track]) {
    snap.tracks[track] = {
      total_items: track === 'tme-preA1' ? 300 : questions.length,
      mastered_count: 0,
      attempted_count: 0,
      total_attempts: 0,
      items: {}
    };
  }

  const trackData = snap.tracks[track];
  const itemsMap = trackData.items || {};
  const now = new Date().toISOString();

  questions.forEach((q, idx) => {
    if (!q?.id) return;
    const isCorrect = answers[idx] === q.answer;
    const current = itemsMap[q.id] || {
      status: MASTERY_STATES.UNATTEMPTED,
      consecutive_correct: 0,
      attempts: 0,
      last_attempt_at: now,
      is_formal: isFormal
    };

    const next = nextMasteryState(current.status, current.consecutive_correct || 0, isCorrect);

    itemsMap[q.id] = {
      ...current,
      status: next.status,
      consecutive_correct: next.consecutiveCorrect,
      attempts: (current.attempts || 0) + 1,
      last_is_correct: isCorrect,
      last_attempt_at: now,
      is_formal: isFormal || current.is_formal || false,
      category: q.category || 'vocab',
      subType: q.subType || q.taskType || 'unknown'
    };

    trackData.total_attempts = (trackData.total_attempts || 0) + 1;
  });

  // 重新統計整體精熟數與挑戰數
  const allItemVals = Object.values(itemsMap);
  trackData.mastered_count = allItemVals.filter((it) => it.status === MASTERY_STATES.MASTERED).length;
  trackData.attempted_count = allItemVals.length;
  trackData.items = itemsMap;

  saveStudentMastery(studentId, snap);
  return snap;
}
