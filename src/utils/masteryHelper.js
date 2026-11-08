/**
 * 霧臺國小三大英語檢定軌道：動態滾動精熟引擎 (Rolling Mastery Engine)
 * 規格見 docs/exam/THREE_EXAM_TRACKS_MASTERY_AND_LEADERBOARD_SPEC.md
 *
 * 核心原則：
 * 1. 拒絕歷史懲罰：評量學生當前能力，非懲罰歷史錯誤。
 * 2. 成長型思維：錯題後只要累計「連對 2 次」，即翻盤解鎖為精熟（連續猜對機率僅 6.25%）。
 * 3. 分母固定為題庫總試題數（如 Pre-A1 為 250 題），確保數據真實覆蓋。
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
 * 計算精熟度星級與三色燈指標
 * @param {number} masteryRate 精熟百分比 (0-100)
 * @param {number} attemptedCount 累計挑戰過之題數
 */
export function getMasteryLevel(masteryRate = 0, attemptedCount = 0) {
  if (attemptedCount < 3 && masteryRate === 0) {
    return {
      stars: 0,
      color: 'slate',
      bgClass: 'bg-slate-100 dark:bg-slate-800/60',
      textClass: 'text-slate-500 dark:text-slate-400',
      borderClass: 'border-slate-300 dark:border-slate-700',
      badge: '☆☆☆',
      label: '未挑戰'
    };
  }
  if (masteryRate >= 80) {
    return {
      stars: 3,
      color: 'emerald',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
      textClass: 'text-emerald-600 dark:text-emerald-400',
      borderClass: 'border-emerald-300 dark:border-emerald-700',
      badge: '★★★',
      label: '精熟'
    };
  }
  if (masteryRate >= 60) {
    return {
      stars: 2,
      color: 'amber',
      bgClass: 'bg-amber-50 dark:bg-amber-950/40',
      textClass: 'text-amber-600 dark:text-amber-400',
      borderClass: 'border-amber-300 dark:border-amber-700',
      badge: '★★☆',
      label: '掌握'
    };
  }
  return {
    stars: 1,
    color: 'rose',
    bgClass: 'bg-rose-50 dark:bg-rose-950/40',
    textClass: 'text-rose-600 dark:text-rose-400',
    borderClass: 'border-rose-300 dark:border-rose-700',
    badge: '★☆☆',
    label: '待加強'
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
        total_items: 250,
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
      total_items: track === 'tme-preA1' ? 250 : questions.length,
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
