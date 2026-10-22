import fs from 'fs';

let code = fs.readFileSync('src/data/hereWeGoTextbookData.js', 'utf8');

// 1. b2_u0_s7
code = code.replace(
  /"id": "b2_u0_s7",\s*"speaker": "Character",\s*"en": "我是 Mia。",\s*"zh": "我是米婭。",\s*"fullEn": "Character: 我是 Mia。",\s*"fullZh": "Character：我是米婭。"/,
  '"id": "b2_u0_s7",\n            "speaker": "Character",\n            "en": "I’m Mia.",\n            "zh": "我是米婭。",\n            "fullEn": "Character: I’m Mia.",\n            "fullZh": "Character：我是米婭。"'
);

// 2. b2_u4_s19 ~ s23
code = code.replace(/"en": "card 卡片",\s*"zh": "卡配"/, '"en": "a card",\n            "zh": "卡片"');
code = code.replace(/"en": "flower 花",\s*"zh": "花 花"/, '"en": "a flower",\n            "zh": "花"');
code = code.replace(/"en": "gift 禮物",\s*"zh": "禮物 禮物"/, '"en": "a gift",\n            "zh": "禮物"');
code = code.replace(/"en": "heart 心",\s*"zh": "心心"/, '"en": "a heart",\n            "zh": "愛心"');
code = code.replace(/"en": "love 愛",\s*"zh": "愛愛"/, '"en": "love",\n            "zh": "愛"');

// 3. b4_u4_s17 ~ s22
code = code.replace(/"en": "看！帽子舞！"/, '"en": "Look! The hat dance!"');
code = code.replace(/"en": "當然可以。"/, '"en": "Sure."');
code = code.replace(/"en": "嗯……。Edison 在哪裡？"/, '"en": "Um... Where is Edison?"');
code = code.replace(/"en": "快來，Edison。"/, '"en": "Come on, Edison."');
code = code.replace(/"en": "Teddy，你的包包在哪裡？"/, '"en": "Teddy, where is your bag?"');
code = code.replace(/"en": "小心！"/, '"en": "Watch out!"');

// 4. b6_u4_s22
code = code.replace(/"en": "a zongzi \(rice dumpling\) 粽子"/, '"en": "a zongzi (rice dumpling)"');

// 5. b9_u3_s25
code = code.replace(/"en": "Teddy，你先走。"/, '"en": "After you, Teddy."');

fs.writeFileSync('src/data/hereWeGoTextbookData.js', code, 'utf8');
console.log('Update finished.');
