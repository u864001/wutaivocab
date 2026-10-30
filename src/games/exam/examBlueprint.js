/**
 * 課本題庫檢定館：專業語言測驗組卷藍圖 (Exam Blueprint)
 * 規格見 docs/games/QUIZ_SPELLING_HANDWRITING_SPEC.md 第四節第 5 點。
 *
 * - 大題順序固定：字母 → 聽力 → 字彙 → 文法與用法 → 閱讀
 * - 大題內同題型相鄰、由易到難；題組 (groupId) 整組不拆散
 * - 10 題只取 2～3 種題型；20／50 題依題庫現有題型比例分配，缺的題型自動分給其他題型
 * - 只有 reviewed !== false 的題目會進入正式組卷
 */

export const SECTION_ORDER = ['alphabet', 'listening', 'vocabulary', 'grammar', 'reading'];

export const SECTION_LABELS = {
  alphabet: '字母',
  listening: '聽力',
  vocabulary: '字彙',
  grammar: '文法與用法',
  reading: '閱讀'
};

// 題型代碼：依大題內出現順序排列
export const TASK_TYPES = {
  'A-ORDER': { section: 'alphabet', label: '字母順序' },
  'A-MISSING': { section: 'alphabet', label: '字母填空' },
  'A-CASE': { section: 'alphabet', label: '大小寫' },
  'A-SOUND': { section: 'alphabet', label: '聽音選字母', audio: true },
  'L-WORD': { section: 'listening', label: '聽音選字', audio: true },
  'L-PIC': { section: 'listening', label: '聽音選圖', audio: true },
  'L-TF': { section: 'listening', label: '聽句判斷', audio: true },
  'L-RESP': { section: 'listening', label: '聽問句選回應', audio: true },
  'L-DLG': { section: 'listening', label: '聽對話回答', audio: true },
  'V-PIC': { section: 'vocabulary', label: '看圖選字' },
  'V-WORD': { section: 'vocabulary', label: '看字選圖' },
  'V-MEAN': { section: 'vocabulary', label: '字彙選擇' },
  'G-MC': { section: 'grammar', label: '文法選擇' },
  'G-DLG': { section: 'grammar', label: '完成對話' },
  'G-CTX': { section: 'grammar', label: '情境選句' },
  'R-TF': { section: 'reading', label: '看圖判斷' },
  'R-CLOZE': { section: 'reading', label: '短文填空' },
  'R-COMP': { section: 'reading', label: '閱讀理解' },
  'R-MATCH': { section: 'reading', label: '配合題' }
};

const TASK_TYPE_ORDER = Object.keys(TASK_TYPES);

/** 取得題目的題型代碼（相容舊版只有 category 的題目） */
export function getTaskType(q) {
  if (q?.taskType && TASK_TYPES[q.taskType]) return q.taskType;
  if (q?.category === 'dialogue') return 'G-DLG';
  return 'G-MC';
}

export function getTaskLabel(q) {
  return TASK_TYPES[getTaskType(q)]?.label || '選擇題';
}

export function isFormalItem(q) {
  return q?.reviewed !== false;
}

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** 將同一題型的題目切成「抽題單位」：題組整組一單位，其餘一題一單位 */
function toUnits(items) {
  const groups = new Map();
  const units = [];
  for (const q of items) {
    if (q.groupId) {
      if (!groups.has(q.groupId)) {
        const unit = [];
        groups.set(q.groupId, unit);
        units.push(unit);
      }
      groups.get(q.groupId).push(q);
    } else {
      units.push([q]);
    }
  }
  return units;
}

/** 以最大餘數法依權重分配題數，每種至少 1 題，且不超過該題型可用題數 */
function allocate(targetCount, typeKeys, available) {
  const alloc = Object.fromEntries(typeKeys.map((k) => [k, 0]));
  let remaining = Math.min(
    targetCount,
    typeKeys.reduce((s, k) => s + available[k], 0)
  );
  // 先每種保底 1 題
  for (const k of typeKeys) {
    if (remaining <= 0) break;
    alloc[k] = 1;
    remaining--;
  }
  // 依可用題數比例分配剩餘題數，滿額的題型自動讓出
  while (remaining > 0) {
    const open = typeKeys.filter((k) => alloc[k] < available[k]);
    if (open.length === 0) break;
    const totalAvail = open.reduce((s, k) => s + available[k], 0);
    const shares = open.map((k) => ({ k, exact: (remaining * available[k]) / totalAvail }));
    let given = 0;
    for (const s of shares) {
      const add = Math.min(Math.floor(s.exact), available[s.k] - alloc[s.k]);
      alloc[s.k] += add;
      given += add;
    }
    if (given === 0) {
      // 最大餘數補 1 題
      shares.sort((a, b) => (b.exact % 1) - (a.exact % 1));
      const pick = shares.find((s) => alloc[s.k] < available[s.k]);
      if (!pick) break;
      alloc[pick.k] += 1;
      given = 1;
    }
    remaining -= given;
  }
  return alloc;
}

/**
 * 組出正式試卷：回傳依大題／題型排序後的題目陣列
 * @param {Array} pool 可用題目
 * @param {number} targetCount 目標題數 (10/20/50)
 */
export function assembleExamForm(pool, targetCount) {
  const formal = (pool || []).filter(isFormalItem);
  const byType = {};
  for (const q of formal) (byType[getTaskType(q)] ||= []).push(q);

  let typeKeys = Object.keys(byType);
  if (typeKeys.length === 0) return [];

  // 10 題以下只取 2～3 種題型（依題量加權隨機挑選）
  if (targetCount <= 10 && typeKeys.length > 3) {
    const want = Math.random() < 0.5 ? 2 : 3;
    const picked = [];
    let candidates = [...typeKeys];
    while (picked.length < want && candidates.length > 0) {
      const total = candidates.reduce((s, k) => s + byType[k].length, 0);
      let r = Math.random() * total;
      const k = candidates.find((c) => (r -= byType[c].length) < 0) || candidates[0];
      picked.push(k);
      candidates = candidates.filter((c) => c !== k);
    }
    typeKeys = picked;
  }

  const available = Object.fromEntries(typeKeys.map((k) => [k, byType[k].length]));
  const alloc = allocate(targetCount, typeKeys, available);

  const orderedTypes = [...typeKeys].sort(
    (a, b) =>
      SECTION_ORDER.indexOf(TASK_TYPES[a].section) - SECTION_ORDER.indexOf(TASK_TYPES[b].section) ||
      TASK_TYPE_ORDER.indexOf(a) - TASK_TYPE_ORDER.indexOf(b)
  );

  const form = [];
  for (const k of orderedTypes) {
    const units = shuffle(toUnits(byType[k]));
    const chosen = [];
    let count = 0;
    for (const unit of units) {
      if (count >= alloc[k]) break;
      if (count + unit.length > alloc[k] && count > 0) continue;
      chosen.push(unit);
      count += unit.length;
    }
    // 由易到難（題組以組內最低難度排序，組內順序不變）
    chosen.sort(
      (a, b) =>
        Math.min(...a.map((q) => q.difficulty || 2)) - Math.min(...b.map((q) => q.difficulty || 2))
    );
    for (const unit of chosen) form.push(...unit);
  }
  return form;
}

/**
 * 依題目順序產生第 0 頁說明用的題號區間
 * @returns {Array<{ taskType, label, section, sectionLabel, start, end, audio }>}
 */
export function buildFormOutline(questions) {
  const outline = [];
  (questions || []).forEach((q, idx) => {
    const t = getTaskType(q);
    const last = outline[outline.length - 1];
    if (last && last.taskType === t) {
      last.end = idx + 1;
    } else {
      outline.push({
        taskType: t,
        label: TASK_TYPES[t].label,
        section: TASK_TYPES[t].section,
        sectionLabel: SECTION_LABELS[TASK_TYPES[t].section],
        start: idx + 1,
        end: idx + 1,
        audio: !!TASK_TYPES[t].audio
      });
    }
  });
  return outline;
}

/** 依題型統計分項成績 */
export function buildTaskBreakdown(questions, answers) {
  const map = new Map();
  (questions || []).forEach((q, idx) => {
    const t = getTaskType(q);
    if (!map.has(t)) map.set(t, { taskType: t, label: TASK_TYPES[t].label, correct: 0, total: 0 });
    const row = map.get(t);
    row.total++;
    if (answers?.[idx] === q.answer) row.correct++;
  });
  return [...map.values()].sort(
    (a, b) => TASK_TYPE_ORDER.indexOf(a.taskType) - TASK_TYPE_ORDER.indexOf(b.taskType)
  );
}

// ── 作答進度快照（斷線、誤關分頁可續考；超過 6 小時自動刪除）──
export const INPROGRESS_TTL_MS = 6 * 60 * 60 * 1000;

export function getInProgressKey(student) {
  const sid = student?.student_id || student?.id || 'guest';
  return `wutai_mcq_inprogress_${sid}`;
}

export function loadInProgress(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const snap = JSON.parse(raw);
    if (!snap?.startedAt || Date.now() - snap.startedAt > INPROGRESS_TTL_MS || !Array.isArray(snap.questions) || snap.questions.length === 0) {
      localStorage.removeItem(key);
      return null;
    }
    return snap;
  } catch {
    return null;
  }
}

export function saveInProgress(key, snap) {
  try {
    localStorage.setItem(key, JSON.stringify(snap));
  } catch {
    // Ignore storage quota errors
  }
}

export function clearInProgress(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/** 掃描並刪除所有超過 6 小時的作答快照（維護瀏覽器儲存空間） */
export function purgeExpiredInProgress() {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith('wutai_mcq_inprogress_')) continue;
      try {
        const snap = JSON.parse(localStorage.getItem(k));
        if (!snap?.startedAt || Date.now() - snap.startedAt > INPROGRESS_TTL_MS) localStorage.removeItem(k);
      } catch {
        localStorage.removeItem(k);
      }
    }
  } catch {
    // ignore
  }
}
