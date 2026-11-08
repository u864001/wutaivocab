/**
 * 課本題庫檢定館：專業語言測驗組卷藍圖 (Exam Blueprint)
 * 規格見 docs/games/QUIZ_SPELLING_HANDWRITING_SPEC.md 第四節第 5 點。
 *
 * - 大題順序固定：字母 → 聽力 → 字彙 → 文法與用法 → 閱讀
 * - 大題內同題型相鄰、由易到難；題組 (groupId) 整組不拆散
 * - 10 題只取 2～3 種題型；20／50 題依題庫現有題型比例分配，缺的題型自動分給其他題型
 * - 只有 reviewed !== false 的題目會進入正式組卷
 */

export const SECTION_ORDER = ['alphabet', 'listening', 'vocabulary', 'grammar', 'reading', 'writing', 'speaking'];

export const SECTION_LABELS = {
  alphabet: '字母',
  listening: '聽力',
  vocabulary: '字彙',
  grammar: '文法與用法',
  reading: '閱讀',
  writing: '寫作',
  speaking: '口說'
};

// 題型代碼：依大題內出現順序排列
export const TASK_TYPES = {
  'A-ORDER': { section: 'alphabet', label: '字母順序' },
  'A-MISSING': { section: 'alphabet', label: '字母填空' },
  'A-CASE': { section: 'alphabet', label: '大小寫' },
  'A-SOUND': { section: 'alphabet', label: '聽音選字母', audio: true },
  'L-WORD': { section: 'listening', label: '聽音選字', audio: true },
  'L-PIC': { section: 'listening', label: '聽音選圖', audio: true },
  'L-SENT': { section: 'listening', label: '辨識句意', audio: true },
  'L-QA': { section: 'listening', label: '基本問答', audio: true },
  'L-TF': { section: 'listening', label: '聽句判斷', audio: true },
  'L-RESP': { section: 'listening', label: '聽問句選回應', audio: true },
  'L-DLG': { section: 'listening', label: '聽對話回答', audio: true },
  'L-CONV': { section: 'listening', label: '言談理解', audio: true },
  'V-PIC': { section: 'vocabulary', label: '看圖選字' },
  'V-WORD': { section: 'vocabulary', label: '看字選圖' },
  'V-MEAN': { section: 'vocabulary', label: '字彙選擇' },
  'G-MC': { section: 'grammar', label: '文法選擇' },
  'G-DLG': { section: 'grammar', label: '完成對話' },
  'G-CTX': { section: 'grammar', label: '情境選句' },
  'R-TF': { section: 'reading', label: '看圖判斷' },
  'R-MATCH': { section: 'reading', label: '配合題' },
  'R-CLOZE': { section: 'reading', label: '短文填空' },
  'R-COMP': { section: 'reading', label: '閱讀理解' },
  'R-PASSAGE': { section: 'reading', label: '篇章閱讀' },
  'W-SCRAMBLE': { section: 'writing', label: '重組句子' },
  'S-READ': { section: 'speaking', label: '口說朗讀', audio: true }
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

/**
 * 擷取題目的核心詞彙／評量標的（用於防撞去重，防止同卷一字多出）
 */
export function extractTargetToken(q) {
  if (!q) return null;
  if (q.targetToken) return String(q.targetToken).toLowerCase().trim();
  if (q.targetWord) return String(q.targetWord).toLowerCase().trim();
  if (q.word) return String(q.word).toLowerCase().trim();

  // 1. 從題目主圖檔名推導（如 /assets/exam/preA1/banana.png -> banana）
  if (q.image && typeof q.image === 'string') {
    const m = q.image.match(/\/([^/.]+)\.(png|svg|jpg|jpeg|webp)$/i);
    if (m) {
      return m[1].toLowerCase().replace(/^action_/, '').replace(/^rainy_/, '').trim();
    }
  }

  // 2. 從看字選圖 (vocab-word2pic) 題幹關鍵字推導（如「看單字選出相符的物品線稿插圖：apple」）
  if (q.subType === 'vocab-word2pic' && q.question) {
    const m = q.question.match(/[：:]\s*([a-zA-Z\s]+)$/);
    if (m) return m[1].toLowerCase().trim();
  }

  // 3. 從聽音選圖 (vocab-audio2pic) 與聽音選字 (vocab-audio2word) 之語音文本推導
  if ((q.subType === 'vocab-audio2pic' || q.subType === 'vocab-audio2word') && q.media?.audioText) {
    return String(q.media.audioText).toLowerCase().trim();
  }

  // 4. 從圖片選項正解圖檔名推導
  if (Array.isArray(q.optionImages) && q.optionImages[q.answer]) {
    const m = q.optionImages[q.answer].match(/\/([^/.]+)\.(png|svg|jpg|jpeg|webp)$/i);
    if (m) {
      return m[1].toLowerCase().replace(/^action_/, '').replace(/^rainy_/, '').trim();
    }
  }

  // 5. 從看圖選字 (vocab-pic2word, read-pic2word) 正解單字推導（字數 <= 2 且非圖片標籤）
  if (
    (q.subType === 'vocab-pic2word' || q.subType === 'read-pic2word' || q.taskType === 'V-PIC' || q.taskType === 'V-WORD' || q.section === 'vocabulary') &&
    Array.isArray(q.options) &&
    q.options[q.answer]
  ) {
    const opt = String(q.options[q.answer]).trim();
    if (!opt.startsWith('圖片') && !opt.startsWith('選項') && opt.split(/\s+/).length <= 2 && !opt.includes('?')) {
      return opt.toLowerCase().trim();
    }
  }

  return null;
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

  // 若為寫作重組專題目（W-SCRAMBLE）且具備十大句型標籤，跨句型均衡抽樣
  if (typeKeys.length === 1 && typeKeys[0] === 'W-SCRAMBLE') {
    const scrambleItems = byType['W-SCRAMBLE'];
    const hasPatterns = scrambleItems.some((q) => q.patternIndex);
    if (hasPatterns) {
      const byPattern = {};
      for (const q of scrambleItems) {
        const pKey = q.patternIndex || 1;
        (byPattern[pKey] ||= []).push(q);
      }
      const pKeys = Object.keys(byPattern).sort((a, b) => Number(a) - Number(b));
      const perPatternCount = Math.floor(targetCount / pKeys.length);
      const remainder = targetCount % pKeys.length;
      const picked = [];
      pKeys.forEach((pk, idx) => {
        const need = perPatternCount + (idx < remainder ? 1 : 0);
        const shuffled = shuffle(byPattern[pk]);
        picked.push(...shuffled.slice(0, need));
      });
      return picked.sort((a, b) => (a.patternIndex || 0) - (b.patternIndex || 0));
    }
  }

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
  const seenTargetTokens = new Set();

  for (const k of orderedTypes) {
    const rawUnits = toUnits(byType[k]);
    if (rawUnits.length === 0) continue;

    // 分層分桶：依冊次 (book) 與單元 (unit) 分群
    const byStratum = new Map();
    for (const unit of rawUnits) {
      const sample = unit[0];
      const stratumKey = sample?.book != null ? `b${sample.book}_${sample.unit || 'u'}` : (sample?.unit || sample?.subType || 'default');
      if (!byStratum.has(stratumKey)) byStratum.set(stratumKey, []);
      byStratum.get(stratumKey).push(unit);
    }

    // 各分層內隨機打散，並按 Round-Robin 輪巡交錯排布（確保各冊次/單元均勻抽樣，避免偏重單一冊次或單元）
    const stratumKeys = shuffle([...byStratum.keys()]);
    for (const sk of stratumKeys) {
      byStratum.set(sk, shuffle(byStratum.get(sk)));
    }

    const interleavedUnits = [];
    let hasMore = true;
    while (hasMore) {
      hasMore = false;
      for (const sk of stratumKeys) {
        const list = byStratum.get(sk);
        if (list && list.length > 0) {
          interleavedUnits.push(list.shift());
          if (list.length > 0) hasMore = true;
        }
      }
    }

    // 核心標的去重防撞：優先挑選無衝突的題目 (Clean Units)，衝突題退至後備 (Collision Fallback)
    const cleanUnits = [];
    const collisionUnits = [];
    for (const unit of interleavedUnits) {
      const tokens = unit.map(extractTargetToken).filter(Boolean);
      const hasCollision = tokens.some((t) => seenTargetTokens.has(t));
      if (hasCollision) {
        collisionUnits.push(unit);
      } else {
        cleanUnits.push(unit);
      }
    }

    const candidateQueue = [...cleanUnits, ...collisionUnits];
    const chosen = [];
    let count = 0;
    for (const unit of candidateQueue) {
      if (count >= alloc[k]) break;
      if (count + unit.length > alloc[k] && count > 0) continue;
      chosen.push(unit);
      count += unit.length;
      unit.map(extractTargetToken).filter(Boolean).forEach((t) => seenTargetTokens.add(t));
    }

    // 由易到難（題組以組內最低難度排序，組內順序不變）
    chosen.sort(
      (a, b) =>
        Math.min(...a.map((q) => q.difficulty || 2)) - Math.min(...b.map((q) => q.difficulty || 2))
    );
    for (const unit of chosen) form.push(...unit);
  }

  // 精準校準總題數：若因題組 (groupId) 不可拆散導致總題數超出 targetCount，自單題題型末端精確微調
  while (form.length > targetCount) {
    const singleIdx = form.findLastIndex((q) => !q.groupId);
    if (singleIdx === -1) break;
    form.splice(singleIdx, 1);
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
