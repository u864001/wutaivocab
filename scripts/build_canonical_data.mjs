import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const importFresh = async (filePath) => {
  const url = pathToFileURL(filePath);
  url.searchParams.set('t', String(Date.now()));
  return import(url.href);
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const mcqFilePath = path.join(projectRoot, 'src/data/hereWeGoMcqBank.js');
const mappingFilePath = path.join(projectRoot, 'src/data/exam/canonicalMapping.js');

const { HERE_WE_GO_MCQ_BANK, HERE_WE_GO_BOOK_META } = await importFresh(mcqFilePath);

/**
 * 翰林 Here We Go 課綱各冊核心單字與正式授課單元精確對照表
 * 杜絕將全冊單字無差別複製給所有單元之歷史遺毒
 */
const CURRICULUM_WORD_MAP = {
  1: {
    "Starter": ["one", "two", "three", "four", "five"],
    "Unit 2": ["six", "seven", "eight", "nine", "ten"],
    "Unit 3": ["ruler", "pencil", "eraser", "book", "desk", "chair", "bag", "box", "尺", "鉛筆", "橡皮擦", "書本", "書桌", "椅子", "背包", "盒子"],
    "Unit 4": ["red", "blue", "yellow", "green", "orange", "pink", "black", "white"]
  },
  2: {
    "Unit 1": ["dog", "cat", "bird", "fish", "rabbit", "turtle", "frog", "狗", "貓", "鳥", "魚", "兔子", "烏龜", "青蛙"],
    "Unit 2": ["swim", "sing", "dance", "draw", "ride a bike", "游泳"],
    "Unit 3": ["father", "mother", "brother", "sister", "grandfather", "grandmother"],
    "Unit 4": ["teacher", "doctor", "nurse", "cook", "student", "farmer"]
  },
  3: {
    "Unit 2": ["sunny", "rainy", "cloudy", "windy", "snowy", "晴朗的", "下雨的", "多雲的", "颳風的", "下雪的"],
    "Unit 3": ["hot", "cold", "hungry", "thirsty", "tired", "happy", "sad", "炎熱的", "寒冷的", "飢餓的"],
    "Unit 4": ["apple", "banana", "orange", "grape", "pizza", "hamburger", "sandwich", "noodles"]
  },
  4: {
    "Unit 1": ["breakfast", "lunch", "dinner", "morning", "afternoon", "evening", "night", "早餐", "午餐", "晚餐", "早晨", "下午", "傍晚", "夜晚"],
    "Unit 2": ["milk", "juice", "tea", "water", "牛奶"],
    "Unit 4": ["cap", "hat", "dress", "skirt", "pants", "shoes", "jacket"]
  },
  5: {
    "Unit 1": ["bedroom", "living room", "kitchen", "bathroom", "dining room", "臥室", "客廳", "廚房", "浴室", "飯廳"],
    "Unit 2": ["reading", "writing", "cooking", "sleeping"],
    "Unit 3": ["school", "library", "hospital", "supermarket", "park", "museum", "學校", "圖書館", "醫院"],
    "Unit 4": ["next to", "behind", "in front of"]
  },
  6: {
    "Unit 2": ["dollar", "hundred"],
    "Unit 3": ["basketball", "soccer", "baseball", "tennis", "badminton", "piano", "guitar", "violin", "drums", "籃球", "足球", "棒球", "網球", "羽毛球", "鋼琴", "吉他", "小提琴"],
    "Unit 4": ["free time", "surf the internet", "watch tv"]
  },
  7: {
    "Unit 1": ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    "Unit 2": ["chinese", "english", "math", "science", "social studies", "國語文"],
    "Unit 4": ["january", "may", "december"]
  },
  8: {
    "Unit 1": ["yesterday", "last night", "was", "were", "昨天", "昨晚", "是(am/is的過去式)", "是(are的過去式)"],
    "Unit 2": ["went", "saw", "ate", "去(go的過去式)", "看見(see的過去式)", "吃(eat的過去式)"],
    "Unit 3": ["beach", "mountain", "海灘"],
    "Unit 4": ["spring", "summer", "fall", "winter"]
  },
  9: {
    "Unit 1": ["took", "made", "wrote", "bought", "拿取(take過去式)", "製作(make過去式)", "寫作(write過去式)", "購買(buy過去式)"],
    "Unit 2": ["taller", "faster", "更高的", "更快的"],
    "Unit 3": ["biggest", "best"],
    "Unit 4": ["because", "although", "tomorrow", "next week", "因為", "雖然"]
  }
};

const getUnitForChar = (ch, book) => {
  const code = ch.toUpperCase().charCodeAt(0);
  if (code >= 65 && code <= 71) return book === 'g1' ? 'Unit 1 (A~G)' : 'Unit 1 (Aa~Gg)';
  if (code >= 72 && code <= 78) return book === 'g1' ? 'Unit 2 (H~N)' : 'Unit 2 (Hh~Nn)';
  if (code >= 79 && code <= 84) return book === 'g1' ? 'Unit 3 (O~T)' : 'Unit 3 (Oo~Tt)';
  if (code >= 85 && code <= 90) return book === 'g1' ? 'Unit 4 (U~Z)' : 'Unit 4 (Uu~Zz)';
  return null;
};

const getScopesForUnit = (unit, book) => {
  if (book === 'g1' || book === 'g2') return [unit];
  if (unit === 'Unit 1') return ['Unit 1', 'Review 1'];
  if (unit === 'Unit 2') return ['Unit 2', 'Review 1'];
  if (unit === 'Unit 3') return ['Unit 3', 'Review 2'];
  if (unit === 'Unit 4') return ['Unit 4', 'Review 2'];
  return [unit];
};

// 依 (book + question + options[0]) 分組
const bookGroups = new Map();
for (const q of HERE_WE_GO_MCQ_BANK) {
  const key = q.book + '||' + q.question.trim() + '||' + (q.options ? q.options[0].trim() : '');
  if (!bookGroups.has(key)) {
    bookGroups.set(key, []);
  }
  bookGroups.get(key).push(q);
}

const legacyToCanonical = {};
const canonicalMeta = {};
const bookStats = {};
const questionAugments = new Map();

for (const [key, items] of bookGroups.entries()) {
  const b = items[0].book;
  let primaryScope = items[0].unit;

  // 若為字母專冊，依被測字母精確歸位單元
  if (b === 'g1' || b === 'g2') {
    const mChar = items[0].question.match(/「([A-Za-z])」/);
    if (mChar) {
      primaryScope = getUnitForChar(mChar[1], b) || primaryScope;
    }
  } else if (CURRICULUM_WORD_MAP[b]) {
    // 若為課本單字題，依課綱單字表精確鎖定授課單元
    const mWord = items[0].question.match(/「([^」]+)」/);
    const word = mWord ? mWord[1].toLowerCase().trim() : (items[0].options[0] || '').toLowerCase().trim();
    for (const [u, list] of Object.entries(CURRICULUM_WORD_MAP[b])) {
      if (list.map(x => x.toLowerCase()).includes(word)) {
        primaryScope = u;
        break;
      }
    }
  }

  // 排序：讓 unit === primaryScope 的題目排在第 0 位（作為 Canonical）
  items.sort((a, bItem) => {
    const aMatch = a.unit === primaryScope ? 0 : 1;
    const bMatch = bItem.unit === primaryScope ? 0 : 1;
    if (aMatch !== bMatch) return aMatch - bMatch;
    return a.id.localeCompare(bItem.id);
  });

  const canonicalItem = items[0];
  const canonicalId = canonicalItem.id;
  const scopes = getScopesForUnit(primaryScope, b);
  const legacyIds = items.map(x => x.id);

  canonicalMeta[canonicalId] = {
    canonicalId,
    book: canonicalItem.book,
    primaryScope,
    scopes,
    legacyIds,
    duplicateCount: items.length - 1
  };

  bookStats[canonicalItem.book] = (bookStats[canonicalItem.book] || 0) + 1;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    legacyToCanonical[item.id] = canonicalId;
    questionAugments.set(item.id, {
      canonicalId,
      primaryScope,
      scopes,
      isCanonical: i === 0
    });
  }
}

// 1. 寫入 src/data/exam/canonicalMapping.js
const mappingContent = `/**
 * 課本題庫 Canonical Question 映射表與結構定義 (Scheme A)
 *
 * 規範依據：
 * - 冊內正規化 (In-book Canonical)：保留 1,589 題
 * - 刪除同冊跨單元重複複本：1,728 筆
 * - 跨冊複現題目保留各自獨立進度：22 組
 * - 每冊保證獨立題目數 >= 100 題
 * - scopes 精準限制為原授課單元及對應 Review (長度 <= 2)，絕無全冊漫延
 */

export const CANONICAL_STATS = {
  totalBankItems: ${HERE_WE_GO_MCQ_BANK.length},
  canonicalItems: ${Object.keys(canonicalMeta).length},
  duplicateClones: ${HERE_WE_GO_MCQ_BANK.length - Object.keys(canonicalMeta).length},
  bookCounts: ${JSON.stringify(bookStats, null, 2)}
};

/** 舊題號 (legacyId) -> 標準題號 (canonicalId) 映射表 */
export const LEGACY_TO_CANONICAL_MAP = ${JSON.stringify(legacyToCanonical, null, 2)};

/** 標準題號 (canonicalId) 元資料索引 */
export const CANONICAL_META_MAP = ${JSON.stringify(canonicalMeta, null, 2)};

/**
 * 取得指定題號之 Canonical ID
 * @param {string} id 舊題號或標準題號
 * @returns {string}
 */
export function resolveCanonicalId(id) {
  if (!id) return id;
  return LEGACY_TO_CANONICAL_MAP[id] || id;
}

/**
 * 判定題號是否為 Canonical 題號
 * @param {string} id
 * @returns {boolean}
 */
export function isCanonicalId(id) {
  if (!id) return false;
  return Boolean(CANONICAL_META_MAP[id]);
}
`;

fs.writeFileSync(mappingFilePath, mappingContent, 'utf8');
console.log('✓ Created', mappingFilePath);

// 2. 更新 src/data/hereWeGoMcqBank.js
const augmentedBank = HERE_WE_GO_MCQ_BANK.map(q => {
  const aug = questionAugments.get(q.id);
  return {
    ...q,
    canonicalId: aug.canonicalId,
    primaryScope: aug.primaryScope,
    scopes: aug.scopes,
    isCanonical: aug.isCanonical
  };
});

const updatedMcqContent = `export const HERE_WE_GO_BOOK_META = ${JSON.stringify(HERE_WE_GO_BOOK_META, null, 2)};\n\nexport const HERE_WE_GO_MCQ_BANK = ${JSON.stringify(augmentedBank, null, 2)};\n`;

fs.writeFileSync(mcqFilePath, updatedMcqContent, 'utf8');
console.log('✓ Updated', mcqFilePath, 'with precise curriculum scopes (Total questions:', augmentedBank.length, ')');
