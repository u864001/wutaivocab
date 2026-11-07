import path from 'node:path';
import { sliceGrid } from './slice_grid.mjs';

const outDir = path.resolve('public/assets/exam/preA1');

export async function sliceFood(inputPath) {
  const foodNames = [
    ['cheese', 'tomato', 'carrot'],
    ['sandwich', 'hamburger', 'rice'],
    ['noodles', 'juice', 'tea']
  ];
  return sliceGrid(inputPath, outDir, foodNames);
}

export async function sliceHome(inputPath) {
  const homeNames = [
    ['bed', 'sofa', 'table'],
    ['lamp', 'door', 'window'],
    ['cup', 'plate', 'clock']
  ];
  return sliceGrid(inputPath, outDir, homeNames);
}

export async function sliceNature(inputPath) {
  const natureNames = [
    ['sun', 'moon', 'star'],
    ['cloud', 'rain', 'tree'],
    ['flower', 'grass', 'mountain']
  ];
  return sliceGrid(inputPath, outDir, natureNames);
}

export async function sliceSchool(inputPath) {
  const schoolNames = [
    ['computer', 'blackboard', 'crayon'],
    ['marker', 'glue', 'paper'],
    ['bell', 'box', 'flag']
  ];
  return sliceGrid(inputPath, outDir, schoolNames);
}

export async function sliceBody(inputPath) {
  const bodyNames = [
    ['eye', 'ear', 'nose'],
    ['mouth', 'hand', 'foot'],
    ['arm', 'leg', 'hair']
  ];
  return sliceGrid(inputPath, outDir, bodyNames);
}

export async function sliceToysClothes(inputPath) {
  const toysNames = [
    ['pants', 'dress', 'skirt'],
    ['sock', 'glasses', 'watch'],
    ['kite', 'ball', 'robot']
  ];
  return sliceGrid(inputPath, outDir, toysNames);
}

const batchType = process.argv[2];
const inputImage = process.argv[3];

if (batchType === 'home' && inputImage) {
  sliceHome(inputImage).then(() => console.log('Sliced home batch!'));
} else if (batchType === 'nature' && inputImage) {
  sliceNature(inputImage).then(() => console.log('Sliced nature batch!'));
} else if (batchType === 'school' && inputImage) {
  sliceSchool(inputImage).then(() => console.log('Sliced school batch!'));
} else if (batchType === 'body' && inputImage) {
  sliceBody(inputImage).then(() => console.log('Sliced body batch!'));
} else if (batchType === 'toys' && inputImage) {
  sliceToysClothes(inputImage).then(() => console.log('Sliced toys batch!'));
}
