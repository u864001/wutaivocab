import sharp from 'sharp';

async function generateSvgWebp(svgString, outputPath, width = 256, height = 256) {
  await sharp(Buffer.from(svgString))
    .resize(width, height)
    .webp({ quality: 95 })
    .toFile(outputPath);
  console.log(`Generated Snake Sprite: ${outputPath}`);
}

// 2D 正俯視神聖百步蛇頭 (Hundred-Pace Viper Head - Facing UP / North)
const snakeHeadSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 蛇頸銜接底座 -->
  <path d="M96 220 C96 185 102 165 106 150 L150 150 C154 165 160 185 160 220 Z" fill="#7c2d12"/>
  <path d="M106 150 L128 175 L150 150 Z" fill="#431407"/>

  <!-- 百步蛇獨特寬三角箭頭型頭部輪廓 (Broad Triangular Arrow Head) -->
  <path d="M128 35 
           C134 45, 148 68, 172 105 
           C188 128, 185 152, 168 162 
           C152 170, 138 165, 128 160 
           C118 165, 104 170, 88 162 
           C71 152, 68 128, 84 105 
           C108 68, 122 45, 128 35 Z" 
        fill="#9a3412" stroke="#431407" stroke-width="5" stroke-linejoin="round"/>

  <!-- 蛇頭背部百步蛇神聖幾何菱紋 (Sacred Tribal Diamond Markings) -->
  <!-- 額頭主菱形 -->
  <polygon points="128,65 146,95 128,122 110,95" fill="#431407"/>
  <polygon points="128,73 140,95 128,114 116,95" fill="#f59e0b"/>
  <polygon points="128,82 134,95 128,106 122,95" fill="#1c1917"/>

  <!-- 兩側對稱幾何三角紋 -->
  <polygon points="148,102 170,126 142,130" fill="#431407"/>
  <polygon points="108,102 86,126 114,130" fill="#431407"/>

  <!-- 翹鼻尖特徵 (Upturned Snout Tip) -->
  <path d="M124 38 Q128 26 132 38 Z" fill="#f59e0b" stroke="#431407" stroke-width="2"/>

  <!-- 兩側銳利金色蛇瞳 (Golden Slit Viper Eyes) -->
  <!-- 左眼 -->
  <ellipse cx="98" cy="115" rx="9" ry="6" transform="rotate(-25 98 115)" fill="#fef08a" stroke="#78350f" stroke-width="2"/>
  <ellipse cx="98" cy="115" rx="2.5" ry="5.5" transform="rotate(-25 98 115)" fill="#1c1917"/>
  <circle cx="96" cy="113" r="1.5" fill="#ffffff"/>

  <!-- 右眼 -->
  <ellipse cx="158" cy="115" rx="9" ry="6" transform="rotate(25 158 115)" fill="#fef08a" stroke="#78350f" stroke-width="2"/>
  <ellipse cx="158" cy="115" rx="2.5" ry="5.5" transform="rotate(25 158 115)" fill="#1c1917"/>
  <circle cx="160" cy="113" r="1.5" fill="#ffffff"/>

  <!-- 眉脊立體陰影 (Supraocular Scales) -->
  <path d="M88 108 Q100 105 108 112" stroke="#431407" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M168 108 Q156 105 148 112" stroke="#431407" stroke-width="3" stroke-linecap="round" fill="none"/>

  <!-- 吻部外緣高光 -->
  <path d="M128 42 L162 98" stroke="#fdba74" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
  <path d="M128 42 L94 98" stroke="#fdba74" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
</svg>
`;

// 2D 正俯視神聖百步蛇尾 (Tapered Viper Tail - Facing UP / North)
const snakeTailSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 寬身段過渡到收細尾尖 -->
  <path d="M110 30 
           C110 80, 118 140, 124 200 
           C126 215, 127 228, 128 235 
           C129 228, 130 215, 132 200 
           C138 140, 146 80, 146 30 Z" 
        fill="#7c2d12" stroke="#431407" stroke-width="3.5"/>

  <!-- 尾端深色環紋節段 (Segmented Rings) -->
  <path d="M116 80 Q128 90 140 80" stroke="#f59e0b" stroke-width="4" fill="none"/>
  <path d="M119 120 Q128 128 137 120" stroke="#431407" stroke-width="4" fill="none"/>
  <path d="M122 160 Q128 166 134 160" stroke="#f59e0b" stroke-width="3.5" fill="none"/>
  <path d="M124 195 Q128 200 132 195" stroke="#431407" stroke-width="3" fill="none"/>

  <!-- 尾尖黑曜石色微針 (Fine Tapered Tip) -->
  <path d="M126 215 L128 238 L130 215 Z" fill="#1c1917"/>
</svg>
`;

async function main() {
  await generateSvgWebp(snakeHeadSvg, 'public/assets/snake/snake_head_indigenous.webp', 256, 256);
  await generateSvgWebp(snakeTailSvg, 'public/assets/snake/snake_tail_indigenous.webp', 256, 256);
}

main().catch(console.error);
