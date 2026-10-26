const fs = require('fs');

// We can dynamic import or require
const fileContent = fs.readFileSync('src/data/hereWeGoTextbookData.js', 'utf8');
// remove export const HERE_WE_GO_TEXTBOOKS =
const jsonStr = fileContent.replace('export const HERE_WE_GO_TEXTBOOKS =', 'module.exports =');
fs.writeFileSync('scripts/temp_tb.cjs', jsonStr);

const textbooks = require('./temp_tb.cjs');
const b4 = textbooks.find(b => b.book === 4);
console.log('Book 4 Title:', b4.title);
console.log('Book 4 Units:');
b4.units.forEach(u => {
  console.log(`\n=== Unit: ${u.title} (${u.unitId}) ===`);
  const words = (u.vocab || []).map(v => `${v.en} (${v.zh})`).join(', ');
  console.log('Vocab:', words);
});

// clean up temp
fs.unlinkSync('scripts/temp_tb.cjs');
