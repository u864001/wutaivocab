import { SAA_115_G4_QUESTIONS } from './saa115G4.js';
import { SAA_115_G5_QUESTIONS } from './saa115G5.js';
import { SAA_115_G6_QUESTIONS } from './saa115G6.js';
import { SAA_114_G4_QUESTIONS } from './saa114G4.js';
import { SAA_114_G5_QUESTIONS } from './saa114G5.js';
import { SAA_114_G6_QUESTIONS } from './saa114G6.js';
import { SAA_113_G4_QUESTIONS } from './saa113G4.js';
import { SAA_113_G5_QUESTIONS } from './saa113G5.js';
import { SAA_113_G6_QUESTIONS } from './saa113G6.js';

export {
  SAA_115_G4_QUESTIONS,
  SAA_115_G5_QUESTIONS,
  SAA_115_G6_QUESTIONS,
  SAA_114_G4_QUESTIONS,
  SAA_114_G5_QUESTIONS,
  SAA_114_G6_QUESTIONS,
  SAA_113_G4_QUESTIONS,
  SAA_113_G5_QUESTIONS,
  SAA_113_G6_QUESTIONS
};

export const SAA_115_ALL_QUESTIONS = [
  ...SAA_115_G4_QUESTIONS,
  ...SAA_115_G5_QUESTIONS,
  ...SAA_115_G6_QUESTIONS
];

export const SAA_114_ALL_QUESTIONS = [
  ...SAA_114_G4_QUESTIONS,
  ...SAA_114_G5_QUESTIONS,
  ...SAA_114_G6_QUESTIONS
];

export const SAA_113_ALL_QUESTIONS = [
  ...SAA_113_G4_QUESTIONS,
  ...SAA_113_G5_QUESTIONS,
  ...SAA_113_G6_QUESTIONS
];

export const SAA_ALL_OFFICIAL_QUESTIONS = [
  ...SAA_115_ALL_QUESTIONS,
  ...SAA_114_ALL_QUESTIONS,
  ...SAA_113_ALL_QUESTIONS
];

export const SAA_115_EXAM_PAPERS = {
  4: {
    year: 115,
    grade: 4,
    title: '115 年度國小四年級學力檢測全真試卷 (35題)',
    questions: SAA_115_G4_QUESTIONS
  },
  5: {
    year: 115,
    grade: 5,
    title: '115 年度國小五年級學力檢測全真試卷 (35題)',
    questions: SAA_115_G5_QUESTIONS
  },
  6: {
    year: 115,
    grade: 6,
    title: '115 年度國小六年級學力檢測全真試卷 (35題)',
    questions: SAA_115_G6_QUESTIONS
  }
};

export const SAA_114_EXAM_PAPERS = {
  4: {
    year: 114,
    grade: 4,
    title: '114 年度國小四年級學力檢測全真試卷 (35題)',
    questions: SAA_114_G4_QUESTIONS
  },
  5: {
    year: 114,
    grade: 5,
    title: '114 年度國小五年級學力檢測全真試卷 (35題)',
    questions: SAA_114_G5_QUESTIONS
  },
  6: {
    year: 114,
    grade: 6,
    title: '114 年度國小六年級學力檢測全真試卷 (35題)',
    questions: SAA_114_G6_QUESTIONS
  }
};

export const SAA_113_EXAM_PAPERS = {
  4: {
    year: 113,
    grade: 4,
    title: '113 年度國小四年級學力檢測官方試卷 (35題)',
    questions: SAA_113_G4_QUESTIONS
  },
  5: {
    year: 113,
    grade: 5,
    title: '113 年度國小五年級學力檢測官方試卷 (35題)',
    questions: SAA_113_G5_QUESTIONS
  },
  6: {
    year: 113,
    grade: 6,
    title: '113 年度國小六年級學力檢測官方試卷 (35題)',
    questions: SAA_113_G6_QUESTIONS
  }
};

export const SAA_ALL_EXAM_PAPERS = {
  115: SAA_115_EXAM_PAPERS,
  114: SAA_114_EXAM_PAPERS,
  113: SAA_113_EXAM_PAPERS
};
