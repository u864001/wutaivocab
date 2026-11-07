/**
 * 檢定館題庫與測驗軌道統一中樞 (Exam System Unified Hub)
 * 整合四大測驗軌道：
 * 1. 課本單元進度檢定 (textbook) - 1,289 題
 * 2. Test My English Pre-A1 官方模擬 (tme-preA1) - 規劃中
 * 3. 教育部縣市學力檢測 (ministry-assessment) - 規劃中
 * 4. 個人易錯題弱點擊破室 (mistakes)
 */

import { EXAM_TRACKS } from './examTracks';
import { TME_PRE_A1_SPEC, TME_PRE_A1_CATEGORIES } from './tmePreA1Meta';
import { SAA_EXAM_SPEC, SAA_PASSAGE_SAMPLE_SCHEMA } from './saaExamMeta';
import { HERE_WE_GO_BOOK_META, HERE_WE_GO_MCQ_BANK } from '../hereWeGoMcqBank';
import { TME_PRE_A1_BANK, TME_PRE_A1_SCRAMBLE_BANK, TME_SCRAMBLE_PATTERNS, TME_PRE_A1_READING_BANK, TME_PRE_A1_LISTENING_BANK } from './tmePreA1Bank';
import { SAA_EXAM_BANK } from './saaExamBank';
import {
  SAA_115_G4_QUESTIONS,
  SAA_115_G5_QUESTIONS,
  SAA_115_G6_QUESTIONS,
  SAA_115_ALL_QUESTIONS,
  SAA_115_EXAM_PAPERS
} from './saa/index.js';

export {
  EXAM_TRACKS,
  TME_PRE_A1_SPEC,
  TME_PRE_A1_CATEGORIES,
  SAA_EXAM_SPEC,
  SAA_PASSAGE_SAMPLE_SCHEMA,
  HERE_WE_GO_BOOK_META,
  HERE_WE_GO_MCQ_BANK,
  TME_PRE_A1_BANK,
  TME_PRE_A1_READING_BANK,
  TME_PRE_A1_LISTENING_BANK,
  TME_PRE_A1_SCRAMBLE_BANK,
  TME_SCRAMBLE_PATTERNS,
  SAA_EXAM_BANK,
  SAA_115_G4_QUESTIONS,
  SAA_115_G5_QUESTIONS,
  SAA_115_G6_QUESTIONS,
  SAA_115_ALL_QUESTIONS,
  SAA_115_EXAM_PAPERS
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
