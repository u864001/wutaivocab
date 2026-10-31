import sharp from 'sharp';

async function generateSvgWebp(svgString, outputPath, width = 256, height = 256) {
  await sharp(Buffer.from(svgString))
    .resize(width, height)
    .webp({ quality: 90 })
    .toFile(outputPath);
  console.log(`Generated illustrated WebP: ${outputPath}`);
}

// 台灣水鹿 (Formosan Sambar Deer) 雄偉長角奔馳姿態
const sambarDeerSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 鹿角 (Majestic Multi-point Antlers) -->
  <path d="M140 60 C135 40, 115 25, 110 15 C108 12, 114 10, 118 16 C124 25, 138 35, 142 50 C146 32, 158 20, 165 14 C168 12, 172 15, 169 20 C162 30, 152 45, 148 62" stroke="#d97706" stroke-width="5" stroke-linecap="round"/>
  <path d="M146 45 C155 35, 170 30, 180 25 C184 23, 186 28, 182 31 C172 38, 160 48, 152 56" stroke="#b45309" stroke-width="4" stroke-linecap="round"/>
  <path d="M125 35 C118 28, 105 25, 96 22 C92 20, 91 25, 94 28 C102 34, 114 40, 122 46" stroke="#b45309" stroke-width="4" stroke-linecap="round"/>

  <!-- 鹿耳 -->
  <ellipse cx="128" cy="68" rx="8" ry="16" transform="rotate(-30 128 68)" fill="#b45309"/>
  <ellipse cx="128" cy="68" rx="5" ry="11" transform="rotate(-30 128 68)" fill="#fde68a"/>

  <!-- 鹿首 (Head & Snout) -->
  <path d="M136 65 Q165 70 178 82 Q185 88 182 94 Q175 100 158 96 Q145 92 135 85 Z" fill="#92400e"/>
  <!-- 黑鼻吻端與口線 -->
  <ellipse cx="180" cy="88" rx="5" ry="4" fill="#1c1917"/>
  <!-- 靈動黑眼眸與金光 -->
  <circle cx="152" cy="76" r="4.5" fill="#1c1917"/>
  <circle cx="153.5" cy="74.5" r="1.5" fill="#fef08a"/>

  <!-- 鹿頸與修長身軀 (Athletic Galloping Body) -->
  <path d="M138 82 Q120 95 105 105 Q70 110 50 125 Q40 135 48 145 Q65 150 95 140 Q130 130 148 105 Q145 92 138 82 Z" fill="#b45309"/>
  <!-- 腹部米黃漸層 -->
  <path d="M60 138 Q85 146 115 138 Q100 148 70 146 Z" fill="#fde68a" opacity="0.85"/>

  <!-- 前腿 (躍起飛奔 前足騰空) -->
  <!-- 左前腿 -->
  <path d="M135 118 Q150 135 168 152 Q174 158 182 165" stroke="#92400e" stroke-width="8" stroke-linecap="round"/>
  <path d="M182 165 L188 172" stroke="#1c1917" stroke-width="7" stroke-linecap="round"/>
  <!-- 右前腿 -->
  <path d="M128 122 Q140 142 152 162 Q158 170 162 178" stroke="#78350f" stroke-width="7" stroke-linecap="round"/>
  <path d="M162 178 L166 185" stroke="#1c1917" stroke-width="6.5" stroke-linecap="round"/>

  <!-- 後腿 (後蹬發力 彈跳凌空) -->
  <!-- 左後腿 -->
  <path d="M65 132 Q45 150 32 172 Q25 182 18 195" stroke="#92400e" stroke-width="9" stroke-linecap="round"/>
  <path d="M18 195 L12 202" stroke="#1c1917" stroke-width="7.5" stroke-linecap="round"/>
  <!-- 右後腿 -->
  <path d="M52 135 Q38 155 28 175 Q22 185 15 198" stroke="#78350f" stroke-width="7.5" stroke-linecap="round"/>

  <!-- 尾巴 (小短尾微翹) -->
  <path d="M48 126 Q35 125 32 132 Q35 138 46 136 Z" fill="#78350f"/>
  <path d="M34 130 Q33 135 40 136 Z" fill="#fde68a"/>
</svg>
`;

// 萬聖南瓜怪 (Halloween Rolling Pumpkin)
const pumpkinSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 彈跳滾動微傾角 -->
  <g transform="rotate(12 128 128)">
    <!-- 綠色瓜藤與捲鬚 -->
    <path d="M128 58 Q132 40 145 32 Q150 28 152 32 Q145 42 136 60 Z" fill="#15803d"/>
    <path d="M142 38 Q158 35 162 45" stroke="#22c55e" stroke-width="3" stroke-linecap="round" fill="none"/>

    <!-- 南瓜主體立體瓣紋 (Carved Pumpkin Body) -->
    <!-- 外側陰影瓣 -->
    <ellipse cx="80" cy="138" rx="42" ry="60" fill="#c2410c"/>
    <ellipse cx="176" cy="138" rx="42" ry="60" fill="#c2410c"/>
    <!-- 中間瓣 -->
    <ellipse cx="102" cy="138" rx="45" ry="66" fill="#ea580c"/>
    <ellipse cx="154" cy="138" rx="45" ry="66" fill="#ea580c"/>
    <!-- 中央主瓣 -->
    <ellipse cx="128" cy="138" rx="46" ry="70" fill="#f97316"/>

    <!-- 刻刀雕刻發光五官 (Luminescent Jack-o-Lantern Eyes & Grin) -->
    <!-- 發光三角左眼 -->
    <polygon points="100,115 118,128 96,132" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <polygon points="102,118 114,127 99,130" fill="#ffffff"/>

    <!-- 發光三角右眼 -->
    <polygon points="156,115 138,128 160,132" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
    <polygon points="154,118 142,127 157,130" fill="#ffffff"/>

    <!-- 俏皮三角鼻 -->
    <polygon points="128,134 135,145 121,145" fill="#fef08a"/>

    <!-- 萬聖咧嘴邪笑與獠牙鋸齒 -->
    <path d="M88 156 Q128 190 168 156 Q158 172 148 165 Q140 178 132 165 Q125 178 116 166 Q108 174 98 164 Z" fill="#fef08a" stroke="#a16207" stroke-width="2"/>
    <path d="M96 159 Q128 185 160 159" stroke="#ffffff" stroke-width="2" fill="none"/>
  </g>
</svg>
`;

async function main() {
  await generateSvgWebp(sambarDeerSvg, 'public/assets/common/loader/sambar_deer.webp', 256, 256);
  await generateSvgWebp(pumpkinSvg, 'public/assets/common/loader/season_10_pumpkin.webp', 256, 256);
}

main().catch(console.error);
