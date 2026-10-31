import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const MEMORY_DIR = path.resolve('public/assets/memory');

const SLICE_CONFIG = {
  sheet1: {
    inputs: [path.join(MEMORY_DIR, 'olympus_sheet_1.jpg'), path.join(MEMORY_DIR, 'olympus_sheet_1.png')],
    panels: {
      tl: ['god_lightning.jpg', 'god_lightning_zeus.jpg'],
      tr: ['god_peek.jpg', 'god_peek_athena.jpg'],
      bl: ['god_freeze.jpg', 'god_freeze_boreas.jpg'],
      br: ['god_bonus.jpg', 'god_bonus_apollo.jpg']
    }
  },
  sheet2: {
    inputs: [path.join(MEMORY_DIR, 'olympus_sheet_2.jpg'), path.join(MEMORY_DIR, 'olympus_sheet_2.png')],
    panels: {
      tl: ['god_coin.jpg', 'god_coin_plutus.jpg'],
      tr: ['god_lock.jpg', 'god_lock_hephaestus.jpg'],
      bl: ['god_radar.jpg', 'god_radar_helios.jpg'],
      br: ['god_winwin.jpg', 'god_winwin_gemini.jpg']
    }
  },
  sheet3: {
    inputs: [path.join(MEMORY_DIR, 'olympus_sheet_3.jpg'), path.join(MEMORY_DIR, 'olympus_sheet_3.png')],
    panels: {
      tl: ['card_back_rukai_day.jpg'],
      tr: ['card_back_slate_night.jpg'],
      bl: ['board_bg_olympus.jpg'],
      br: ['word_card_frame.jpg']
    }
  }
};

async function sliceSheet(sheetKey) {
  const conf = SLICE_CONFIG[sheetKey];
  const input = conf.inputs.find(p => fs.existsSync(p));
  if (!input) {
    console.log(`Sheet not found yet: ${conf.inputs.join(' or ')}`);
    return false;
  }

  console.log(`Processing ${sheetKey}: ${input}...`);
  const meta = await sharp(input).metadata();
  const W = meta.width;
  const H = meta.height;
  const hw = Math.floor(W / 2);
  const hh = Math.floor(H / 2);

  const panelCoords = {
    tl: { left: 0, top: 0, width: hw, height: hh },
    tr: { left: hw, top: 0, width: W - hw, height: hh },
    bl: { left: 0, top: hh, width: hw, height: H - hh },
    br: { left: hw, top: hh, width: W - hw, height: H - hh }
  };

  for (const [panelKey, fileNames] of Object.entries(conf.panels)) {
    const coord = panelCoords[panelKey];
    const buffer = await sharp(input)
      .extract(coord)
      .jpeg({ quality: 92, mozjpeg: true })
      .toBuffer();

    for (const name of fileNames) {
      const outPath = path.join(MEMORY_DIR, name);
      fs.writeFileSync(outPath, buffer);
      console.log(`  ✓ Sliced panel [${panelKey}] -> ${name} (${coord.width}x${coord.height}, ${Math.round(buffer.length / 1024)} KB)`);
    }
  }
  return true;
}

async function run() {
  const target = process.argv[2] || 'all';
  if (target === 'all') {
    for (const key of ['sheet1', 'sheet2', 'sheet3']) {
      await sliceSheet(key);
    }
  } else {
    await sliceSheet(target);
  }
}

run().catch(err => {
  console.error('Slice failed:', err);
  process.exit(1);
});
