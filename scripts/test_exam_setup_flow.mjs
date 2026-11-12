import assert from 'node:assert/strict';
import {
  applyMistakeAttempt,
  buildMistakeReviewSequence,
  filterMistakesBySource,
  getMistakeAttemptLimit,
  isMistakeSourceCleared,
  simulateMistakeAttempts
} from '../src/games/exam/mistakeReview.js';

const questions = [
  { id: 'c1', sourceTrack: 'curriculum', answer: 0 },
  { id: 's1', sourceTrack: 'ministry-assessment', answer: 1 },
  { id: 't1', sourceTrack: 'tme-preA1', answer: 2 }
];
const mistakeMap = {
  c1: { wrongCount: 3, streak: 0, updatedAt: 1 },
  s1: { wrongCount: 2, streak: 0, updatedAt: 2 },
  t1: { wrongCount: 1, streak: 0, updatedAt: 3 }
};

assert.equal(filterMistakesBySource(questions, 'all').length, 3);
assert.deepEqual(filterMistakesBySource(questions, 'ministry-assessment').map((q) => q.id), ['s1']);
assert.equal(getMistakeAttemptLimit(20, 3), 20);
assert.equal(getMistakeAttemptLimit('all', 3), 6);

const sequence = buildMistakeReviewSequence(questions, mistakeMap, 10);
assert.equal(sequence.length, 10, 'attempt cap should create a retry queue without regular-bank filler');
assert.ok(sequence.every((question) => questions.includes(question)), 'queue must contain only actual mistakes');

let next = applyMistakeAttempt(mistakeMap, questions[0], true, 10);
assert.equal(next.c1.streak, 1);
next = applyMistakeAttempt(next, questions[0], false, 11);
assert.equal(next.c1.streak, 0, 'a wrong answer must reset the per-question streak');
next = applyMistakeAttempt(next, questions[0], true, 12);
next = applyMistakeAttempt(next, questions[0], true, 13);
assert.equal(next.c1, undefined, 'two consecutive correct attempts must remove the mistake');

const eightQuestions = Array.from({ length: 8 }, (_, index) => ({
  id: `q${index + 1}`,
  sourceTrack: 'curriculum',
  answer: 0
}));
const eightMap = Object.fromEntries(eightQuestions.map((q) => [q.id, { wrongCount: 1, streak: 0, updatedAt: 1 }]));
const twentyAttemptQueue = buildMistakeReviewSequence(eightQuestions, eightMap, 20);
const perfectAnswers = Object.fromEntries(twentyAttemptQueue.slice(0, 16).map((_, index) => [index, 0]));
const afterSixteen = simulateMistakeAttempts(eightMap, twentyAttemptQueue, perfectAnswers, 15);
assert.equal(isMistakeSourceCleared(afterSixteen, eightQuestions), true, '8 mistakes should clear after 16 perfect attempts');

console.log('✓ Shared exam setup and adaptive mistake-review contract passed');
