import path from 'node:path';
import { sliceGrid } from './slice_grid.mjs';

const outDir = path.resolve('public/assets/exam/preA1');

export async function sliceUpgradeBatch1(inputPath) {
  const names = [
    ['apple', 'banana', 'orange', 'grape'],
    ['cake', 'bread', 'cookie', 'pizza'],
    ['milk', 'water', 'egg', 'ice_cream'],
    ['pencil', 'pen', 'ruler', 'eraser']
  ];
  return sliceGrid(inputPath, outDir, names, { targetSize: 400, inset: 32 });
}

export async function sliceUpgradeBatch2(inputPath) {
  const names = [
    ['book', 'scissors', 'bag', 'desk'],
    ['chair', 'cap', 'hat', 'jacket'],
    ['tshirt', 'shoe', 'umbrella', 'bicycle'],
    ['car', 'bus', 'train', 'boat']
  ];
  return sliceGrid(inputPath, outDir, names, { targetSize: 400, inset: 32 });
}

export async function sliceUpgradeBatch3(inputPath) {
  const names = [
    ['cat', 'dog', 'pig', 'bird'],
    ['rabbit', 'duck', 'fish', 'bear'],
    ['elephant', 'monkey', 'library', 'zoo'],
    ['school', 'park', 'playground', 'restaurant']
  ];
  return sliceGrid(inputPath, outDir, names, { targetSize: 400, inset: 32 });
}

const batchNum = process.argv[2];
const inputImage = process.argv[3];

if (batchNum === '1' && inputImage) {
  sliceUpgradeBatch1(inputImage).then(res => console.log(`Sliced Upgrade Batch 1 (${res.length} items)`));
} else if (batchNum === '2' && inputImage) {
  sliceUpgradeBatch2(inputImage).then(res => console.log(`Sliced Upgrade Batch 2 (${res.length} items)`));
} else if (batchNum === '3' && inputImage) {
  sliceUpgradeBatch3(inputImage).then(res => console.log(`Sliced Upgrade Batch 3 (${res.length} items)`));
}
