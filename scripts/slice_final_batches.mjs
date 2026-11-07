import path from 'node:path';
import { sliceGrid } from './slice_grid.mjs';

const outDir = path.resolve('public/assets/exam/preA1');

export async function sliceFinalBatch1(inputPath) {
  const names = [
    ['teacher', 'doctor', 'nurse', 'student'],
    ['police_officer', 'farmer', 'cook', 'pilot'],
    ['computer', 'blackboard', 'crayon', 'glue'],
    ['paper', 'bell', 'box', 'flag']
  ];
  return sliceGrid(inputPath, outDir, names, { targetSize: 400 });
}

export async function sliceFinalBatch2(inputPath) {
  const names = [
    ['hospital', 'supermarket', 'bookstore', 'beach'],
    ['farm', 'cinema', 'plane', 'truck'],
    ['motorcycle', 'taxi', 'soccer', 'baseball'],
    ['tennis', 'guitar', 'piano', 'doll']
  ];
  return sliceGrid(inputPath, outDir, names, { targetSize: 400 });
}

export async function sliceFinalBatch3(inputPath) {
  const names = [
    ['mouse', 'spider', 'hippo', 'bat'],
    ['rainbow', 'snowman', 'river', 'sea'],
    ['candy', 'chocolate', 'chicken', 'potato'],
    ['face', 'teeth', 'smile', 'head']
  ];
  return sliceGrid(inputPath, outDir, names, { targetSize: 400 });
}

const batchNum = process.argv[2];
const inputImage = process.argv[3];

if (batchNum === '1' && inputImage) {
  sliceFinalBatch1(inputImage).then(res => console.log(`Sliced Batch 1 (${res.length} items)`));
} else if (batchNum === '2' && inputImage) {
  sliceFinalBatch2(inputImage).then(res => console.log(`Sliced Batch 2 (${res.length} items)`));
} else if (batchNum === '3' && inputImage) {
  sliceFinalBatch3(inputImage).then(res => console.log(`Sliced Batch 3 (${res.length} items)`));
}
