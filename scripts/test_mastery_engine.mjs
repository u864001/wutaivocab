import assert from 'node:assert';
import {
  MASTERY_STATES,
  nextMasteryState,
  getMasteryLevel
} from '../src/utils/masteryHelper.js';

console.log('══════════════════════════════════════════════════════════════');
console.log('  TESTING ROLLING MASTERY ENGINE & STATE MACHINE TRANSITIONS ');
console.log('══════════════════════════════════════════════════════════════\n');

// Test 1: Initial Transitions
console.log('[1/4] Testing Initial Transitions from UNATTEMPTED...');
const r1 = nextMasteryState(MASTERY_STATES.UNATTEMPTED, 0, true);
assert.strictEqual(r1.status, MASTERY_STATES.MASTERED);
assert.strictEqual(r1.consecutiveCorrect, 1);

const r2 = nextMasteryState(MASTERY_STATES.UNATTEMPTED, 0, false);
assert.strictEqual(r2.status, MASTERY_STATES.REMEDIAL);
assert.strictEqual(r2.consecutiveCorrect, 0);
console.log('  ✓ Initial correct -> MASTERED; initial wrong -> REMEDIAL.');

// Test 2: Remedial -> Probation -> Mastered (2 consecutive correct to flip!)
console.log('\n[2/4] Testing Remedial Recovery: 2 Consecutive Correct to Mastered...');
const r3 = nextMasteryState(MASTERY_STATES.REMEDIAL, 0, true);
assert.strictEqual(r3.status, MASTERY_STATES.PROBATION, 'First correct after wrong should enter PROBATION');
assert.strictEqual(r3.consecutiveCorrect, 1);

const r4 = nextMasteryState(MASTERY_STATES.PROBATION, 1, true);
assert.strictEqual(r4.status, MASTERY_STATES.MASTERED, 'Second consecutive correct MUST flip to MASTERED');
assert.strictEqual(r4.consecutiveCorrect, 2);
console.log('  ✓ Remedial -> 1st correct (PROBATION) -> 2nd correct (MASTERED) confirmed.');

// Test 3: Relapse (Wrong when Mastered drops back to Remedial)
console.log('\n[3/4] Testing Relapse on Error...');
const r5 = nextMasteryState(MASTERY_STATES.MASTERED, 3, false);
assert.strictEqual(r5.status, MASTERY_STATES.REMEDIAL, 'Mastered question must drop to Remedial on error');
assert.strictEqual(r5.consecutiveCorrect, 0);

const r6 = nextMasteryState(MASTERY_STATES.PROBATION, 1, false);
assert.strictEqual(r6.status, MASTERY_STATES.REMEDIAL, 'Probation question must drop to Remedial on error');
assert.strictEqual(r6.consecutiveCorrect, 0);
console.log('  ✓ Error while Mastered or in Probation reliably drops back to REMEDIAL.');

// Test 4: Mastery Level and Star Rubrics
console.log('\n[4/4] Validating Mastery Level and Star Rubrics...');
const lvlUnattempted = getMasteryLevel(0, 1);
assert.strictEqual(lvlUnattempted.stars, 0);
assert.strictEqual(lvlUnattempted.color, 'slate');

const lvlGold = getMasteryLevel(85, 20);
assert.strictEqual(lvlGold.stars, 3);
assert.strictEqual(lvlGold.color, 'emerald');

const lvlSilver = getMasteryLevel(72, 20);
assert.strictEqual(lvlSilver.stars, 2);
assert.strictEqual(lvlSilver.color, 'amber');

const lvlBronze = getMasteryLevel(45, 20);
assert.strictEqual(lvlBronze.stars, 1);
assert.strictEqual(lvlBronze.color, 'rose');
console.log('  ✓ 3-tier colors and stars (★★★ 80%+, ★★☆ 60-79%, ★☆☆ <60%) verified.');

console.log('\n🎉 ALL ROLLING MASTERY ENGINE UNIT TESTS PASSED 100%!\n');
