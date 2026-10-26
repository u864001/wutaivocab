const fs = require('fs');

const fileContent = fs.readFileSync('src/data/hereWeGoTextbookData.js', 'utf8');
const jsonStr = fileContent.replace('export const HERE_WE_GO_TEXTBOOKS =', 'module.exports =');
fs.writeFileSync('scripts/temp_tb.cjs', jsonStr);

const textbooks = require('./temp_tb.cjs');
const b4 = textbooks.find(b => b.book === 4);
b4.units.forEach(u => {
  console.log(`\n=== Unit: ${u.title} ===`);
  (u.dialogues || []).forEach(d => {
    console.log(`  ${d.speaker || ''}: ${d.en} (${d.zh})`);
  });
});

fs.unlinkSync('scripts/temp_tb.cjs');
