import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.resolve(__dirname, '../src/data/hereWeGoTextbookData.js');

async function translateSingle(line) {
  const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-TW&dt=t&q=' + encodeURIComponent(line);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  const data = await res.json();
  return data[0].map(x => x[0]).join('').trim();
}

async function translateBatch(lines) {
  if (lines.length === 0) return [];
  if (lines.length === 1) {
    const single = await translateSingle(lines[0]);
    return [single];
  }

  try {
    const text = lines.join('\n');
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-TW&dt=t&q=' + encodeURIComponent(text);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    const full = data[0].map(x => x[0]).join('');
    const split = full.split('\n').map(s => s.trim());
    if (split.length === lines.length) {
      return split;
    }
  } catch (err) {
    console.warn('Batch translation failed, falling back to individual:', err.message);
  }

  // Fallback to individual translation
  const results = [];
  for (const line of lines) {
    try {
      const res = await translateSingle(line);
      results.push(res);
    } catch (e) {
      console.error(`Failed to translate single line: "${line}"`, e);
      results.push(line);
    }
    // Small delay to prevent rate limit
    await new Promise(r => setTimeout(r, 100));
  }
  return results;
}

function cleanChinese(zh) {
  if (!zh) return '';
  return zh
    .replace(/\u000b/g, ' ')
    .replace(/琥珀/g, '安珀') // Here We Go textbook character Amber is 安珀
    .trim();
}

async function run() {
  console.log('Loading textbook data from:', DATA_FILE);
  const content = fs.readFileSync(DATA_FILE, 'utf-8');
  
  // Extract JSON part
  const match = content.match(/export const HERE_WE_GO_TEXTBOOKS = (\[[\s\S]*\]);/);
  if (!match) {
    throw new Error('Could not find HERE_WE_GO_TEXTBOOKS array in file!');
  }

  const textbooks = JSON.parse(match[1]);

  // Clean English sentences and collect unique list
  const uniqueSentences = new Set();
  textbooks.forEach(b => {
    b.units.forEach(u => {
      u.dialogues.forEach(d => {
        d.en = d.en.replace(/\u000b/g, ' ').replace(/\s+/g, ' ').trim();
        uniqueSentences.add(d.en);
      });
    });
  });

  const sentenceList = Array.from(uniqueSentences);
  console.log(`Found ${sentenceList.length} unique English dialogue sentences across 9 books.`);

  const translationMap = new Map();
  const BATCH_SIZE = 15;

  for (let i = 0; i < sentenceList.length; i += BATCH_SIZE) {
    const chunk = sentenceList.slice(i, i + BATCH_SIZE);
    process.stdout.write(`Translating chunk ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(sentenceList.length / BATCH_SIZE)} (${chunk.length} items)... `);
    const translations = await translateBatch(chunk);
    chunk.forEach((en, idx) => {
      const rawZh = translations[idx] || en;
      translationMap.set(en, cleanChinese(rawZh));
    });
    console.log('Done.');
    // Short sleep between batches
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('Finished translating all unique sentences! Updating textbook data...');

  // Update all dialogues with clean Google translations
  let updatedCount = 0;
  textbooks.forEach(b => {
    b.units.forEach(u => {
      u.dialogues.forEach(d => {
        const cleanEn = d.en;
        const cleanZh = translationMap.get(cleanEn) || d.zh;
        d.en = cleanEn;
        d.zh = cleanZh;
        d.fullEn = d.speaker ? `${d.speaker}: ${cleanEn}` : cleanEn;
        d.fullZh = d.speaker ? `${d.speaker}：${cleanZh}` : cleanZh;
        updatedCount++;
      });
    });
  });

  console.log(`Updated ${updatedCount} dialogue entries.`);

  // Write back to file
  const newContent = `/**\n * 翰林 Here We Go 1～9 冊 完整課文題庫資料庫\n * 由 Google 官方翻譯全面精準校正\n * 涵蓋全冊單元、情境課文對話、中文對譯與核心單字\n */\n\nexport const HERE_WE_GO_TEXTBOOKS = ${JSON.stringify(textbooks, null, 2)};\n`;

  fs.writeFileSync(DATA_FILE, newContent, 'utf-8');
  console.log('Successfully written updated textbook data to', DATA_FILE);
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
