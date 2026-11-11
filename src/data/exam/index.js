/**
 * 檢定館題庫與測驗軌道統一中樞 (Exam System Unified Hub)
 * 整合四大測驗軌道：
 * 1. 課本單元進度檢定 (textbook) - 動態綁定 CANONICAL_STATS
 * 2. Test My English Pre-A1 官方模擬 (tme-preA1) - 規劃中
 * 3. 教育部縣市學力檢測 (ministry-assessment) - 規劃中
 * 4. 個人易錯題弱點擊破室 (mistakes)
 */

import { EXAM_TRACKS } from './examTracks.js';
import { TME_PRE_A1_SPEC, TME_PRE_A1_CATEGORIES } from './tmePreA1Meta.js';
import { SAA_EXAM_SPEC, SAA_PASSAGE_SAMPLE_SCHEMA } from './saaExamMeta.js';
import { HERE_WE_GO_BOOK_META, HERE_WE_GO_MCQ_BANK } from '../hereWeGoMcqBank.js';
import { TME_PRE_A1_BANK, TME_PRE_A1_SCRAMBLE_BANK, TME_SCRAMBLE_PATTERNS, TME_PRE_A1_READING_BANK } from './tmePreA1Bank.js';
import { SAA_EXAM_BANK, SAA_OFFICIAL_BANK, SAA_ORIGINAL_BANK, SAA_DRAFT_ORIGINAL_BANK } from './saaExamBank.js';
import {
  SAA_115_G4_QUESTIONS,
  SAA_115_G5_QUESTIONS,
  SAA_115_G6_QUESTIONS,
  SAA_115_ALL_QUESTIONS,
  SAA_115_EXAM_PAPERS,
  SAA_114_G4_QUESTIONS,
  SAA_114_G5_QUESTIONS,
  SAA_114_G6_QUESTIONS,
  SAA_114_ALL_QUESTIONS,
  SAA_114_EXAM_PAPERS,
  SAA_113_G4_QUESTIONS,
  SAA_113_G5_QUESTIONS,
  SAA_113_G6_QUESTIONS,
  SAA_113_ALL_QUESTIONS,
  SAA_113_EXAM_PAPERS,
  SAA_ALL_OFFICIAL_QUESTIONS,
  SAA_ALL_EXAM_PAPERS
} from './saa/index.js';
import {
  CANONICAL_STATS,
  LEGACY_TO_CANONICAL_MAP,
  CANONICAL_META_MAP,
  resolveCanonicalId,
  isCanonicalId
} from './canonicalMapping.js';

export {
  CANONICAL_STATS,
  LEGACY_TO_CANONICAL_MAP,
  CANONICAL_META_MAP,
  resolveCanonicalId,
  isCanonicalId,
  EXAM_TRACKS,
  TME_PRE_A1_SPEC,
  TME_PRE_A1_CATEGORIES,
  SAA_EXAM_SPEC,
  SAA_PASSAGE_SAMPLE_SCHEMA,
  HERE_WE_GO_BOOK_META,
  HERE_WE_GO_MCQ_BANK,
  TME_PRE_A1_BANK,
  TME_PRE_A1_READING_BANK,
  TME_PRE_A1_SCRAMBLE_BANK,
  TME_SCRAMBLE_PATTERNS,
  SAA_EXAM_BANK,
  SAA_OFFICIAL_BANK,
  SAA_ORIGINAL_BANK,
  SAA_DRAFT_ORIGINAL_BANK,
  SAA_115_G4_QUESTIONS,
  SAA_115_G5_QUESTIONS,
  SAA_115_G6_QUESTIONS,
  SAA_115_ALL_QUESTIONS,
  SAA_115_EXAM_PAPERS,
  SAA_114_G4_QUESTIONS,
  SAA_114_G5_QUESTIONS,
  SAA_114_G6_QUESTIONS,
  SAA_114_ALL_QUESTIONS,
  SAA_114_EXAM_PAPERS,
  SAA_113_G4_QUESTIONS,
  SAA_113_G5_QUESTIONS,
  SAA_113_G6_QUESTIONS,
  SAA_113_ALL_QUESTIONS,
  SAA_113_EXAM_PAPERS,
  SAA_ALL_OFFICIAL_QUESTIONS,
  SAA_ALL_EXAM_PAPERS
};

/**
 * 依測驗軌道與篩選條件取得題庫池
 * @param {string} track - 'textbook' | 'tme-preA1' | 'ministry-assessment'
 * @param {object} options - { book, books, grade, unit }
 */
export function getQuestionsByTrack(track = 'textbook', options = {}) {
  if (track === 'tme-preA1') {
    return TME_PRE_A1_BANK;
  }
  if (track === 'ministry-assessment') {
    const grade = options.grade ? Number(options.grade) : null;
    if (grade) {
      return SAA_EXAM_BANK.filter(q => q.targetGrade === grade);
    }
    return SAA_EXAM_BANK;
  }
  // Default: textbook
  let pool = HERE_WE_GO_MCQ_BANK;
  if (options.book !== undefined && options.book !== null) {
    const bStr = String(options.book);
    pool = pool.filter(q => String(q.book) === bStr);
  } else if (Array.isArray(options.books) && options.books.length > 0) {
    const bookSet = new Set(options.books.map(String));
    pool = pool.filter(q => bookSet.has(String(q.book)));
  }
  if (options.unit) {
    pool = pool.filter(q => q.unit === options.unit);
  }
  return pool;
}

/**
 * 取得指定測驗軌道之後設資料
 */
export function getExamTrackInfo(track) {
  return EXAM_TRACKS[track] || EXAM_TRACKS.textbook;
}
