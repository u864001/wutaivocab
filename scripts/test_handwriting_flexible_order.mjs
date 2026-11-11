import fs from 'node:fs';
import {
  ALL_STROKES,
  evaluateHandwriting,
  matchTracingStroke
} from '../src/services/alphabetStrokes.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const asUserStroke = (stroke, reverse = false) => {
  const points = (stroke.sample || []).map(([x, y]) => ({ x, y }));
  return reverse ? points.reverse() : points;
};

console.log('HANDWRITING FLEXIBLE ORDER CONTRACT');

const aModel = ALL_STROKES.A;
const reorderedReversedA = [
  asUserStroke(aModel.strokes[2], true),
  asUserStroke(aModel.strokes[1], true),
  asUserStroke(aModel.strokes[0], true)
];
const aResult = evaluateHandwriting({ targetChar: 'A', userStrokes: reorderedReversedA });
assert(aResult.passed && aResult.score >= 80, `Reordered/reversed A must pass, got ${aResult.score}`);
assert(aResult.details.orderRequired === false, 'Stroke order must be diagnostic only');

const zModel = ALL_STROKES.Z;
const continuousZ = zModel.strokes.flatMap((stroke, index) => {
  const points = asUserStroke(stroke);
  return index === 0 ? points : points.slice(1);
});
const zResult = evaluateHandwriting({ targetChar: 'Z', userStrokes: [continuousZ] });
assert(zResult.passed && zResult.score >= 75, `Continuous-stroke Z must pass, got ${zResult.score}`);

const badAResult = evaluateHandwriting({
  targetChar: 'A',
  userStrokes: [[{ x: 10, y: 105 }, { x: 90, y: 105 }]]
});
assert(!badAResult.passed, `Unrelated line must fail A, got ${badAResult.score}`);

const iModel = ALL_STROKES.i;
const dotFirst = matchTracingStroke({
  targetChar: 'i',
  userStroke: asUserStroke(iModel.strokes[1]),
  completedStrokeIndices: []
});
assert(dotFirst.accepted && dotFirst.matchedIndices.includes(1), 'Lowercase i dot must be accepted before the stem');

const tracedContinuousZ = matchTracingStroke({
  targetChar: 'Z',
  userStroke: continuousZ,
  completedStrokeIndices: []
});
assert(tracedContinuousZ.accepted, 'Tracing must accept a clean continuous Z');
assert(tracedContinuousZ.matchedIndices.length === 3, 'Continuous Z must cover all three suggested components');

// 教學模板使用國小正體印刷手寫造形：a/g 為單層圓腹，q 有下降部。
assert(ALL_STROKES.a.strokes.length === 2, 'Lowercase a must use the two-component single-storey manuscript form');
assert(ALL_STROKES.g.strokes.some(stroke => stroke.sample.some(([, y]) => y > 90)), 'Lowercase g must include a descender');
assert(ALL_STROKES.q.strokes.some(stroke => stroke.sample.some(([, y]) => y >= 100)), 'Lowercase q must include a descender');
assert(ALL_STROKES.G.strokes.length === 2 && ALL_STROKES.G.strokes[1].start.y === ALL_STROKES.G.strokes[1].end.y, 'Uppercase G must keep its clear manuscript inner bar');
assert(ALL_STROKES.t.strokes.length === 2 && ALL_STROKES.t.strokes[1].start.y === ALL_STROKES.t.strokes[1].end.y, 'Lowercase t must keep its separate manuscript crossbar');

const handwritingSource = fs.readFileSync(new URL('../src/games/handwriting/HandwritingGame.jsx', import.meta.url), 'utf8');
assert(handwritingSource.includes("['upper', 'lower', 'mixed'].includes(settings?.alphaMode)"), 'Handwriting must honor upper/lower/mixed alphaMode');
assert(handwritingSource.includes('matchTracingStroke'), 'Tracing UI must use geometry matching instead of pen-lift counting');

console.log('✓ Alternative stroke order and reverse direction accepted');
console.log('✓ Reasonable joined/split strokes accepted');
console.log('✓ Unrelated scribbles rejected');
console.log('✓ Primary manuscript a/G/g/q/t forms protected');
console.log('✓ upper/lower/mixed lobby selection honored');
