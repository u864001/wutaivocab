import { HERE_WE_GO_TEXTBOOKS } from '../data/hereWeGoTextbookData.js';
import { getSentenceListeningQuestions } from './listeningQuestionBank.js';

function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 嚴格過濾合法英文句子：嚴禁任何中文穿插、必須包含實質英文字母
 */
export function isValidEnglishSentence(item) {
  if (!item || typeof item.en !== 'string') return false;
  const en = item.en.trim();
  if (en.length < 2) return false;
  if (/[\u4e00-\u9fa5]/.test(en)) return false; // 絕對不可包含漢字
  if (!/[a-zA-Z]{2,}/.test(en)) return false;
  return true;
}


/**
 * 取得 1~9 冊書本與單元總覽
 */
export function getBooksSummary() {
  return HERE_WE_GO_TEXTBOOKS.map(b => ({
    book: b.book,
    title: b.title,
    units: b.units.map((u, idx) => ({
      unitId: u.unitId || `b${b.book}_u${idx}`,
      title: u.title,
      dialogueCount: u.dialogues.length,
      vocabCount: u.vocab.length
    }))
  }));
}

/**
 * 取得指定冊次與單元的聽力測驗題庫 (4 選 1 觸控卡片)
 */
export function getUnitListeningQuestions(bookNum = 1, unitId = null, count = 15) {
  const book = HERE_WE_GO_TEXTBOOKS.find(b => b.book === Number(bookNum)) || HERE_WE_GO_TEXTBOOKS[0];
  
  let targetUnit = null;
  if (unitId) {
    targetUnit = book.units.find(u => u.unitId === unitId);
  }
  if (!targetUnit) {
    targetUnit = book.units[1] || book.units[0]; // 預設 Unit 1
  }

  // 收集該單元句型
  let pool = [...(targetUnit.dialogues || []).filter(isValidEnglishSentence)];

  // 若題數不足，混合本冊其他單元句型擴充
  if (pool.length < count) {
    const otherBookSentences = book.units.filter(u => u.unitId !== targetUnit.unitId).flatMap(u => (u.dialogues || []).filter(isValidEnglishSentence));
    pool = [...pool, ...shuffle(otherBookSentences)];
  }

  // 若依然不足，混合全冊句型
  if (pool.length < 5) {
    return getSentenceListeningQuestions(count);
  }

  const selected = shuffle(pool).slice(0, Math.min(count, pool.length));

  // 全域干擾池 (從全部冊次挑選其他句子做為干擾項)
  const allSentences = HERE_WE_GO_TEXTBOOKS.flatMap(b => b.units.flatMap(u => (u.dialogues || []).filter(isValidEnglishSentence)));

  return selected.map((item, idx) => {
    const others = allSentences.filter(s => s.en.toLowerCase() !== item.en.toLowerCase());
    // 改為三選一 (1 個正確選項 + 2 個干擾選項，大幅節省畫面空間並呈現精美半透明卡牌)
    const distractors = shuffle(others).slice(0, 2);

    const rawOptions = [
      { textEn: item.en, textZh: item.zh, isCorrect: true },
      ...distractors.map(d => ({ textEn: d.en, textZh: d.zh, isCorrect: false }))
    ];

    const shuffledOptions = shuffle(rawOptions).map((opt, optIdx) => ({
      ...opt,
      key: String.fromCharCode(65 + optIdx)
    }));

    return {
      id: `hwg_${book.book}_${targetUnit.unitId}_${idx}`,
      book: book.book,
      unitTitle: targetUnit.title,
      speaker: item.speaker || 'Teacher',
      audioText: item.en,
      correctEn: item.en,
      correctZh: item.zh,
      promptZh: `${item.speaker && item.speaker !== 'Character' ? item.speaker + '：' : ''}請聆聽發音，選出正確句子`,
      options: shuffledOptions
    };
  });
}

/**
 * 取得指定冊次與單元的口說跟讀 / 對話題目
 */
export function getUnitSpeakingQuestions(bookNum = 1, unitId = null, count = 10) {
  const book = HERE_WE_GO_TEXTBOOKS.find(b => b.book === Number(bookNum)) || HERE_WE_GO_TEXTBOOKS[0];

  let targetUnit = null;
  if (unitId) {
    targetUnit = book.units.find(u => u.unitId === unitId);
  }
  if (!targetUnit) {
    targetUnit = book.units[1] || book.units[0];
  }

  let pool = [...(targetUnit.dialogues || []).filter(isValidEnglishSentence)];
  if (pool.length < count) {
    const otherBookSentences = book.units
      .filter(u => u.unitId !== targetUnit.unitId)
      .flatMap(u => u.dialogues || []);
    pool = [...pool, ...shuffle(otherBookSentences)];
  }

  const selected = shuffle(pool).slice(0, Math.min(count, pool.length));

  return selected.map((item, idx) => ({
    id: `spk_${book.book}_${targetUnit.unitId}_${idx}`,
    book: book.book,
    unitTitle: targetUnit.title,
    speaker: item.speaker || 'Teacher',
    targetEn: item.en,
    targetZh: item.zh,
    audioText: item.en
  }));
}

// ── 🔤 低年級字母題庫（大寫、小寫、大小寫混合） ──
const UPPERCASE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * 取得低年級字母聽力測驗題庫 (15 題)
 * 防呆保證：同一題中同一字母的大小寫絕對不重複出現，干擾項嚴格取自不同字母
 */
export function getAlphabetListeningQuestions(mode = 'upper', count = 15) {
  // mode: 'upper' | 'lower' | 'mixed'
  const chosenRoots = shuffle(UPPERCASE_ALPHABET).slice(0, Math.min(count, UPPERCASE_ALPHABET.length));

  return chosenRoots.map((root, idx) => {
    let targetChar = root;
    if (mode === 'lower') {
      targetChar = root.toLowerCase();
    } else if (mode === 'mixed') {
      targetChar = Math.random() < 0.5 ? root : root.toLowerCase();
    }

    // 關鍵防呆：從其餘 25 個不同字母挑選 2 個干擾項根字母
    const otherRoots = UPPERCASE_ALPHABET.filter(r => r !== root);
    const distractorRoots = shuffle(otherRoots).slice(0, 2);

    const distractorChars = distractorRoots.map(dRoot => {
      if (mode === 'upper') return dRoot;
      if (mode === 'lower') return dRoot.toLowerCase();
      // mixed 模式：干擾項各 50% 機率為大寫或小寫，但根字母必不同於 targetChar
      return Math.random() < 0.5 ? dRoot : dRoot.toLowerCase();
    });

    const rawOptions = [
      { textEn: targetChar, textZh: `字母 ${targetChar}`, isCorrect: true },
      { textEn: distractorChars[0], textZh: `字母 ${distractorChars[0]}`, isCorrect: false },
      { textEn: distractorChars[1], textZh: `字母 ${distractorChars[1]}`, isCorrect: false }
    ];

    const shuffledOptions = shuffle(rawOptions).map((opt, optIdx) => ({
      ...opt,
      key: String.fromCharCode(65 + optIdx)
    }));

    const modeLabels = {
      upper: '低年級 • 大寫字母',
      lower: '低年級 • 小寫字母',
      mixed: '低年級 • 大小寫混合'
    };

    return {
      id: `alpha_list_${mode}_${idx}`,
      isAlphabet: true,
      alphabetMode: mode,
      gradeTitle: modeLabels[mode] || '低年級 • 字母辨析',
      unitTitle: `Letter ${root}`,
      speaker: 'Owl Mentor',
      audioText: root,
      correctEn: targetChar,
      correctZh: `字母 ${targetChar}`,
      promptZh: `請聆聽字母發音，選出正確的字母卡片：`,
      options: shuffledOptions
    };
  });
}

/**
 * 取得低年級字母口說測驗題庫 (15 題)
 */
export function getAlphabetSpeakingQuestions(mode = 'upper', count = 15) {
  const chosenRoots = shuffle(UPPERCASE_ALPHABET).slice(0, Math.min(count, UPPERCASE_ALPHABET.length));

  return chosenRoots.map((root, idx) => {
    let targetChar = root;
    if (mode === 'lower') {
      targetChar = root.toLowerCase();
    } else if (mode === 'mixed') {
      targetChar = Math.random() < 0.5 ? root : root.toLowerCase();
    }

    const modeLabels = {
      upper: '低年級 • 大寫字母',
      lower: '低年級 • 小寫字母',
      mixed: '低年級 • 大小寫混合'
    };

    return {
      id: `alpha_spk_${mode}_${idx}`,
      isAlphabet: true,
      alphabetMode: mode,
      gradeTitle: modeLabels[mode] || '低年級 • 字母發音',
      unitTitle: `Letter ${root}`,
      speaker: 'Owl Mentor',
      targetEn: targetChar,
      targetZh: `字母 ${targetChar}`,
      audioText: root,
      promptZh: `請大聲開口念出字母：`
    };
  });
}

// ── 🏫 中年級與高年級快速年級題庫 (15 題隨機抽題) ──
const GRADE_CONFIG = {
  g3: { books: [1, 2], title: '三年級 (Book 1 & 2)' },
  g4: { books: [3, 4], title: '四年級 (Book 3 & 4)' },
  g5: { books: [5, 6], title: '五年級 (Book 5 & 6)' },
  g6: { books: [7, 8], title: '六年級 (Book 7 & 8)' },
  jh: { books: [9], title: '國一先修 (Book 9)' }
};

/**
 * 取得指定年級群組的隨機 15 題聽力測驗
 */
export function getGradeListeningQuestions(gradeId = 'g3', count = 15) {
  const cfg = GRADE_CONFIG[gradeId] || GRADE_CONFIG.g3;
  const books = HERE_WE_GO_TEXTBOOKS.filter(b => cfg.books.includes(b.book));
  const pool = books.flatMap(b =>
    b.units.flatMap(u => (u.dialogues || []).filter(isValidEnglishSentence).map(d => ({
        ...d,
        book: b.book,
        unitTitle: u.title
      }))
    )
  );

  const allSentences = HERE_WE_GO_TEXTBOOKS.flatMap(b => b.units.flatMap(u => u.dialogues || []));
  const selected = shuffle(pool).slice(0, Math.min(count, pool.length));

  return selected.map((item, idx) => {
    const others = allSentences.filter(s => s.en.toLowerCase() !== item.en.toLowerCase());
    const distractors = shuffle(others).slice(0, 2);

    const rawOptions = [
      { textEn: item.en, textZh: item.zh, isCorrect: true },
      ...distractors.map(d => ({ textEn: d.en, textZh: d.zh, isCorrect: false }))
    ];

    const shuffledOptions = shuffle(rawOptions).map((opt, optIdx) => ({
      ...opt,
      key: String.fromCharCode(65 + optIdx)
    }));

    return {
      id: `grade_list_${gradeId}_${idx}`,
      book: item.book,
      gradeTitle: cfg.title,
      unitTitle: item.unitTitle,
      speaker: item.speaker || 'Teacher',
      audioText: item.en,
      correctEn: item.en,
      correctZh: item.zh,
      promptZh: `${item.speaker && item.speaker !== 'Character' ? item.speaker + '：' : ''}請聆聽發音，選出正確句子`,
      options: shuffledOptions
    };
  });
}

/**
 * 取得指定年級群組的隨機 15 題口說測驗
 */
export function getGradeSpeakingQuestions(gradeId = 'g3', count = 15) {
  const cfg = GRADE_CONFIG[gradeId] || GRADE_CONFIG.g3;
  const books = HERE_WE_GO_TEXTBOOKS.filter(b => cfg.books.includes(b.book));
  const pool = books.flatMap(b =>
    b.units.flatMap(u => (u.dialogues || []).filter(isValidEnglishSentence).map(d => ({
        ...d,
        book: b.book,
        unitTitle: u.title
      }))
    )
  );

  const selected = shuffle(pool).slice(0, Math.min(count, pool.length));

  return selected.map((item, idx) => ({
    id: `grade_spk_${gradeId}_${idx}`,
    book: item.book,
    gradeTitle: cfg.title,
    unitTitle: item.unitTitle,
    speaker: item.speaker || 'Teacher',
    targetEn: item.en,
    targetZh: item.zh,
    audioText: item.en,
    promptZh: `請大聲開口念出句子：`
  }));
}
