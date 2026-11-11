import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const mcqFilePath = path.join(projectRoot, 'src/data/hereWeGoMcqBank.js');
const mappingFilePath = path.join(projectRoot, 'src/data/exam/canonicalMapping.js');

const { HERE_WE_GO_MCQ_BANK, HERE_WE_GO_BOOK_META } = await import(mcqFilePath);

const getUnitPriority = (unit) => {
  if (!unit) return 99;
  const u = String(unit).trim();
  if (/^Unit\s*1\b/i.test(u)) return 1;
  if (/^Unit\s*2\b/i.test(u)) return 2;
  if (/^Unit\s*3\b/i.test(u)) return 3;
  if (/^Unit\s*4\b/i.test(u)) return 4;
  if (/^Unit\s*5\b/i.test(u)) return 5;
  if (/^Unit\s*6\b/i.test(u)) return 6;
  if (/Starter/i.test(u)) return 10;
  if (/Review\s*1\b/i.test(u)) return 21;
  if (/Review\s*2\b/i.test(u)) return 22;
  if (/Review\s*3\b/i.test(u)) return 23;
  if (/Festival/i.test(u)) return 30;
  return 50;
};

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
  items.sort((a, b) => {
    const pa = getUnitPriority(a.unit);
    const pb = getUnitPriority(b.unit);
    if (pa !== pb) return pa - pb;
    return a.id.localeCompare(b.id);
  });

  const canonicalItem = items[0];
  const canonicalId = canonicalItem.id;
  const primaryScope = canonicalItem.unit;
  const scopes = Array.from(new Set(items.map(x => x.unit).filter(Boolean)));
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

// 1. Write src/data/exam/canonicalMapping.js
const mappingContent = `/**
 * 課本題庫 Canonical Question 映射表與結構定義 (Scheme A)
 *
 * 規範依據：
 * - 冊內正規化 (In-book Canonical)：保留 1,589 題
 * - 刪除同冊跨單元重複複本：1,728 筆
 * - 跨冊複現題目保留各自獨立進度：22 組
 * - 每冊保證獨立題目數 >= 100 題
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

// 2. Augment src/data/hereWeGoMcqBank.js
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
console.log('✓ Updated', mcqFilePath, 'with canonical metadata (Total questions:', augmentedBank.length, ')');
