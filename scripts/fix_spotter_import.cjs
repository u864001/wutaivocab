const fs = require('fs');

let lines = fs.readFileSync('src/games/spotter/VocabSpotterGame.jsx', 'utf8').split('\n');
let seen = false;
let newLines = [];
for (let l of lines) {
  if (l.includes("import { generateSpotterAlphabetRound }")) {
    if (seen) continue;
    seen = true;
  }
  newLines.push(l);
}
fs.writeFileSync('src/games/spotter/VocabSpotterGame.jsx', newLines.join('\n'), 'utf8');
console.log('VocabSpotterGame duplicate import removed.');
