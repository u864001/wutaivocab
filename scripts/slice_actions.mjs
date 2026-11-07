import path from 'node:path';
import { sliceGrid } from './slice_grid.mjs';

const outDir = path.resolve('public/assets/exam/preA1');

export async function sliceActions(inputPath) {
  const actionNames = [
    ['action_listen_music', 'action_draw_picture', 'action_jogging', 'action_read_book'],
    ['action_ride_bicycle', 'action_swim', 'action_play_basketball', 'action_sing_song'],
    ['action_eat_breakfast', 'action_drink_water', 'action_brush_teeth', 'action_wash_hands'],
    ['action_sleep', 'action_cook', 'action_fly_kite', 'action_climb_tree']
  ];
  return sliceGrid(inputPath, outDir, actionNames, { targetSize: 400 });
}

const batchType = process.argv[2];
const inputImage = process.argv[3];

if (batchType === 'actions' && inputImage) {
  sliceActions(inputImage).then(res => console.log(`Sliced all ${res.length} action icons successfully!`));
}
