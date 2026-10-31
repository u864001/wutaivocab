import sharp from 'sharp';

async function generateSvgWebp(svgString, outputPath, width = 256, height = 256) {
  await sharp(Buffer.from(svgString))
    .resize(width, height)
    .webp({ quality: 92 })
    .toFile(outputPath);
  console.log(`Generated: ${outputPath}`);
}

// 1. 一月：元旦神山金鷹 (Golden Eagle)
const eagleSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 展翅側飛 (Spread Wings in Flight) -->
  <path d="M110 110 C80 60, 40 40, 20 50 C35 75, 55 95, 80 115 Z" fill="#b45309"/>
  <path d="M120 100 C100 45, 70 20, 45 15 C60 40, 85 70, 105 95 Z" fill="#d97706"/>
  <path d="M130 90 C155 35, 195 20, 225 25 C205 50, 180 75, 150 95 Z" fill="#f59e0b"/>
  <path d="M140 100 C170 55, 215 50, 235 60 C215 80, 185 105, 155 115 Z" fill="#d97706"/>
  <!-- 鷹身與鷹首 -->
  <ellipse cx="128" cy="120" rx="36" ry="22" fill="#78350f"/>
  <path d="M148 112 Q175 110 185 118 Q175 128 152 125 Z" fill="#fef08a"/>
  <!-- 金色尖銳鷹喙 (Hooked Beak) -->
  <path d="M182 114 Q196 116 198 122 Q188 126 182 122 Z" fill="#ea580c"/>
  <!-- 鷹眼銳利黑瞳 -->
  <circle cx="168" cy="116" r="3.5" fill="#1c1917"/>
  <circle cx="169" cy="115" r="1" fill="#ffffff"/>
  <!-- 尾羽扇形 -->
  <path d="M95 125 L45 145 L65 130 L40 135 L92 118 Z" fill="#78350f"/>
  <!-- 金色鋒利鷹爪微縮 (Claws) -->
  <path d="M120 136 L115 152 M128 138 L126 154 M136 136 L138 152" stroke="#ea580c" stroke-width="3" stroke-linecap="round"/>
</svg>
`;

// 2. 二月：吉祥祥龍 / 靈蛇獻瑞 (Lucky Golden Snake / Dragon)
const snakeDragonSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 騰雲駕霧波浪身軀 (Wavy Serpentine Body) -->
  <path d="M40 160 Q70 120 100 150 T160 140 T210 120" stroke="#dc2626" stroke-width="20" stroke-linecap="round" fill="none"/>
  <path d="M40 160 Q70 120 100 150 T160 140 T210 120" stroke="#facc15" stroke-width="12" stroke-linecap="round" fill="none"/>
  <path d="M40 160 Q70 120 100 150 T160 140 T210 120" stroke="#ea580c" stroke-width="4" stroke-linecap="round" stroke-dasharray="6 6" fill="none"/>
  <!-- 龍首 / 金蛇首 (Dragon/Snake Head) -->
  <path d="M195 120 Q225 105 235 118 Q238 132 215 135 Q195 132 190 125 Z" fill="#b91c1c"/>
  <path d="M205 112 Q220 110 230 118 Q218 126 205 124 Z" fill="#fef08a"/>
  <!-- 金眼 -->
  <circle cx="216" cy="116" r="3.5" fill="#1c1917"/>
  <!-- 龍鬚 / 靈動信子 -->
  <path d="M232 120 Q250 112 254 118 M232 124 Q248 130 252 124" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <!-- 鹿角龍茸 -->
  <path d="M202 110 Q205 92 215 88 M208 100 Q218 96 220 90" stroke="#ea580c" stroke-width="3" stroke-linecap="round" fill="none"/>
  <!-- 祥雲底座 -->
  <ellipse cx="80" cy="175" rx="20" ry="10" fill="#fef08a" opacity="0.8"/>
  <ellipse cx="140" cy="165" rx="24" ry="12" fill="#fef08a" opacity="0.8"/>
</svg>
`;

// 3. 三月：春暖花鹿 (Spring Blossom Deer)
const blossomDeerSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 鹿身與四肢踏櫻 -->
  <path d="M70 135 Q100 120 135 118 Q160 125 170 142 Q150 155 120 152 Q85 152 70 135 Z" fill="#f97316"/>
  <!-- 頸部與頭部 -->
  <path d="M145 122 Q160 95 178 82 Q190 88 185 96 Q168 108 155 130 Z" fill="#ea580c"/>
  <circle cx="178" cy="88" r="3" fill="#1c1917"/>
  <!-- 花冠 (Blossom Flower Crown) -->
  <circle cx="165" cy="80" r="5" fill="#ec4899"/>
  <circle cx="175" cy="76" r="6" fill="#f43f5e"/>
  <circle cx="185" cy="80" r="5" fill="#fb7185"/>
  <circle cx="175" cy="76" r="2" fill="#fef08a"/>
  <!-- 前後躍動腿部 -->
  <path d="M152 142 L172 185 M160 138 L180 178" stroke="#c2410c" stroke-width="6" stroke-linecap="round"/>
  <path d="M82 145 L62 188 M95 148 L78 182" stroke="#c2410c" stroke-width="6" stroke-linecap="round"/>
  <!-- 飄散櫻花瓣 -->
  <circle cx="50" cy="140" r="4" fill="#fbcfe8"/>
  <circle cx="40" cy="165" r="3.5" fill="#fda4af"/>
</svg>
`;

// 4. 四月：復活節彩蛋兔 (Easter Egg Bunny)
const easterBunnySvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 滾動的彩繪巨蛋 (Painted Easter Egg in Front) -->
  <ellipse cx="185" cy="148" rx="35" ry="46" fill="#38bdf8" transform="rotate(18 185 148)"/>
  <path d="M155 135 Q185 160 215 135" stroke="#facc15" stroke-width="6" fill="none"/>
  <path d="M158 152 Q188 175 218 152" stroke="#ec4899" stroke-width="6" fill="none"/>
  <circle cx="185" cy="120" r="5" fill="#ffffff"/>
  <!-- 狂奔小兔 (Sprinting Bunny Behind) -->
  <ellipse cx="105" cy="140" rx="32" ry="24" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
  <circle cx="132" cy="122" r="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="2.5"/>
  <!-- 長耳後甩 -->
  <ellipse cx="98" cy="98" rx="8" ry="28" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" transform="rotate(-40 98 98)"/>
  <ellipse cx="98" cy="98" rx="4" ry="20" fill="#f472b6" transform="rotate(-40 98 98)"/>
  <!-- 兔眼 -->
  <circle cx="138" cy="118" r="3" fill="#ec4899"/>
  <!-- 飛奔小短腿與圓尾 -->
  <circle cx="72" cy="142" r="9" fill="#ffffff"/>
  <path d="M115 160 L135 185 M85 155 L65 180" stroke="#cbd5e1" stroke-width="6" stroke-linecap="round"/>
</svg>
`;

// 5. 五月：霧台純白百合精靈 (Lily Fairy)
const lilyFairySvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 透光精靈之翼 (Glowing Fairy Wings) -->
  <ellipse cx="100" cy="100" rx="40" ry="22" fill="#a7f3d0" opacity="0.6" transform="rotate(-30 100 100)"/>
  <ellipse cx="90" cy="125" rx="30" ry="16" fill="#6ee7b7" opacity="0.5" transform="rotate(-15 90 125)"/>
  <!-- 精靈嬌小身軀飛行姿態 -->
  <path d="M115 118 Q140 125 168 135 Q145 142 125 138 Z" fill="#10b981"/>
  <circle cx="160" cy="115" r="12" fill="#fde047"/>
  <!-- 手捧綻放純白百合 (Blooming Pure White Lily) -->
  <path d="M175 110 C185 85, 205 90, 210 105 C215 120, 195 125, 175 110 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
  <path d="M178 115 C195 105, 220 115, 212 130 C202 140, 185 125, 178 115 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
  <circle cx="192" cy="116" r="3" fill="#eab308"/>
  <!-- 金色花粉星塵軌跡 -->
  <circle cx="70" cy="120" r="2.5" fill="#fde047"/>
  <circle cx="50" cy="110" r="1.5" fill="#fef08a"/>
  <circle cx="35" cy="128" r="2" fill="#fef08a"/>
</svg>
`;

// 6. 六月：熱血端午龍舟 (Dragon Boat)
const dragonBoatSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 龍舟舟身 (Streamlined Dragon Boat Hull) -->
  <path d="M30 145 Q80 170 160 165 Q210 158 235 125 Q215 175 140 180 Q60 180 20 150 Z" fill="#b91c1c"/>
  <path d="M35 152 Q90 170 160 166 Q200 162 220 138" stroke="#facc15" stroke-width="4" fill="none"/>
  <!-- 威猛龍頭 (Fierce Dragon Head Bow) -->
  <path d="M215 135 Q235 95 245 105 Q252 118 238 128 Q222 138 215 135 Z" fill="#15803d"/>
  <path d="M232 98 Q242 82 248 88" stroke="#ea580c" stroke-width="3" stroke-linecap="round"/>
  <!-- 龍眼 -->
  <circle cx="236" cy="108" r="3" fill="#facc15"/>
  <circle cx="237" cy="108" r="1.5" fill="#1c1917"/>
  <!-- 整齊飛划船槳 (Rowing Oars) -->
  <line x1="80" y1="140" x2="65" y2="188" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
  <line x1="120" y1="140" x2="105" y2="188" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
  <line x1="160" y1="140" x2="145" y2="188" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
  <!-- 水花四濺浪花 (Splashing Waves) -->
  <path d="M15 165 Q35 155 55 175 Q75 155 95 175 Q115 155 135 175" stroke="#38bdf8" stroke-width="3.5" fill="none"/>
</svg>
`;

// 7. 七月：仲夏神山飛鼠 (Flying Squirrel)
const flyingSquirrelSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 展開之滑翔皮膜 (Gliding Patagium Membrane) -->
  <path d="M60 100 Q128 85 195 100 Q180 150 160 165 Q128 155 95 165 Q75 150 60 100 Z" fill="#9a3412"/>
  <path d="M75 105 Q128 95 180 105 Q165 142 128 145 Q90 142 75 105 Z" fill="#fed7aa"/>
  <!-- 飛鼠首級與大黑瞳 (Giant Round Night Eyes) -->
  <ellipse cx="128" cy="85" rx="18" ry="15" fill="#7c2d12"/>
  <circle cx="120" cy="82" r="5" fill="#1c1917"/>
  <circle cx="121" cy="80.5" r="1.5" fill="#ffffff"/>
  <circle cx="136" cy="82" r="5" fill="#1c1917"/>
  <circle cx="137" cy="80.5" r="1.5" fill="#ffffff"/>
  <!-- 毛茸茸大蓬尾 (Fluffy Gliding Tail) -->
  <path d="M128 155 Q135 195 115 215 Q105 190 120 160 Z" fill="#7c2d12"/>
</svg>
`;

// 8. 八月：神山豐年祭勇士 (Harvest Warrior)
const warriorSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 勇士大步奔馳身軀 -->
  <path d="M115 100 L138 100 L145 150 L110 150 Z" fill="#78350f"/>
  <!-- 傳統黑紅刺繡獵人背心 -->
  <path d="M115 100 L140 100 L136 135 L118 135 Z" fill="#1c1917"/>
  <line x1="128" y1="100" x2="128" y2="135" stroke="#dc2626" stroke-width="2.5"/>
  <!-- 勇士頭部與純白百合桂冠 (Lily Headband) -->
  <circle cx="128" cy="82" r="14" fill="#a16207"/>
  <!-- 百合飾冠 -->
  <path d="M122 68 L128 58 L134 68 Z" fill="#ffffff"/>
  <circle cx="128" cy="70" r="3" fill="#facc15"/>
  <!-- 雙腿奔馳飛躍 -->
  <path d="M120 150 L145 190 M135 150 L110 185" stroke="#78350f" stroke-width="7" stroke-linecap="round"/>
  <!-- 手持長矛 (Spear with Feather) -->
  <line x1="165" y1="65" x2="95" y2="185" stroke="#451a03" stroke-width="3.5"/>
  <polygon points="165,65 174,52 168,72" fill="#94a3b8"/>
  <circle cx="166" cy="72" r="4" fill="#dc2626"/>
</svg>
`;

// 9. 九月：中秋奔月玉兔 (Moon Rabbit)
const moonRabbitSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 金黃滿月背景 (Glowing Full Moon) -->
  <circle cx="195" cy="75" r="38" fill="#fef08a" opacity="0.85"/>
  <!-- 踏祥雲躍起之白兔 -->
  <ellipse cx="110" cy="135" rx="36" ry="24" fill="#ffffff" stroke="#f1f5f9" stroke-width="2"/>
  <circle cx="145" cy="115" r="18" fill="#ffffff"/>
  <!-- 飛天雙長耳 -->
  <ellipse cx="122" cy="82" rx="7" ry="26" fill="#ffffff" transform="rotate(-35 122 82)"/>
  <ellipse cx="122" cy="82" rx="3.5" ry="18" fill="#f472b6" transform="rotate(-35 122 82)"/>
  <ellipse cx="138" cy="78" rx="7" ry="26" fill="#ffffff" transform="rotate(-25 138 78)"/>
  <ellipse cx="138" cy="78" rx="3.5" ry="18" fill="#f472b6" transform="rotate(-25 138 78)"/>
  <!-- 靈動紅眼 (Ruby Red Eyes) -->
  <circle cx="152" cy="112" r="3.5" fill="#ef4444"/>
  <!-- 懷抱玉杵 (Moon Mortar Pestle) -->
  <line x1="140" y1="125" x2="165" y2="145" stroke="#a7f3d0" stroke-width="5" stroke-linecap="round"/>
  <!-- 祥雲軌跡 -->
  <ellipse cx="65" cy="165" rx="22" ry="10" fill="#e0f2fe" opacity="0.8"/>
  <ellipse cx="90" cy="168" rx="18" ry="8" fill="#bae6fd" opacity="0.8"/>
</svg>
`;

// 11. 十一月：感恩節火雞 (Thanksgiving Turkey)
const turkeySvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 繽紛開屏扇形尾羽 (Fanned Feathers) -->
  <path d="M100 130 C60 90, 45 60, 55 50 C70 45, 95 80, 110 115" fill="#ea580c"/>
  <path d="M105 125 C80 80, 75 45, 90 40 C105 40, 115 75, 120 115" fill="#ca8a04"/>
  <path d="M115 125 C105 75, 115 40, 130 40 C145 45, 135 80, 125 120" fill="#dc2626"/>
  <!-- 圓滾火雞身軀與頭部 -->
  <circle cx="135" cy="140" r="30" fill="#78350f"/>
  <circle cx="165" cy="120" r="15" fill="#9a3412"/>
  <!-- 紳士朝聖黑禮帽 (Pilgrim Hat) -->
  <rect x="150" y="92" width="28" height="20" fill="#1c1917"/>
  <rect x="142" y="110" width="44" height="4" fill="#1c1917"/>
  <rect x="150" y="106" width="28" height="4" fill="#facc15"/>
  <!-- 尖喙與肉垂 (Beak & Red Wattle) -->
  <polygon points="178,122 192,125 178,128" fill="#f59e0b"/>
  <path d="M182 126 Q188 135 184 142 Q178 140 180 130 Z" fill="#ef4444"/>
  <!-- 火雞快步細爪 (Sprinting Feet) -->
  <path d="M125 168 L110 195 M145 168 L160 195" stroke="#f59e0b" stroke-width="4.5" stroke-linecap="round"/>
</svg>
`;

// 12. 十二月：聖誕老人駕馴鹿雪橇 (Santa Sleigh)
const santaSleighSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 領頭紅鼻馴鹿飛躍 (Reindeer in Mid-Air) -->
  <path d="M165 105 Q195 95 215 110 Q200 125 170 120 Z" fill="#9a3412"/>
  <circle cx="218" cy="110" r="4" fill="#ef4444"/> <!-- 魯道夫閃耀紅鼻 -->
  <!-- 鹿角 -->
  <path d="M192 98 Q198 80 205 75 M198 88 Q210 85 214 78" stroke="#ca8a04" stroke-width="2.5" stroke-linecap="round"/>
  <!-- 躍空鹿腿 -->
  <path d="M172 120 L195 142 M205 115 L225 138 M165 118 L152 145" stroke="#7c2d12" stroke-width="3.5" stroke-linecap="round"/>
  <!-- 金韁繩 (Gold Reins) -->
  <line x1="120" y1="120" x2="175" y2="112" stroke="#facc15" stroke-width="2"/>
  <!-- 聖誕雪橇 (Santa's Sleigh) -->
  <path d="M45 130 Q70 155 125 150 Q135 140 120 125 Q80 120 45 130 Z" fill="#b91c1c"/>
  <path d="M35 155 Q80 162 135 155 L145 148" stroke="#ca8a04" stroke-width="4" stroke-linecap="round" fill="none"/>
  <!-- 慈祥聖誕老人 (Santa Claus) -->
  <circle cx="95" cy="115" r="11" fill="#fecaca"/>
  <!-- 白鬍子與紅帽 -->
  <path d="M88 118 Q98 135 108 118 Z" fill="#ffffff"/>
  <path d="M86 110 Q98 90 108 110 Z" fill="#dc2626"/>
  <circle cx="106" cy="98" r="3" fill="#ffffff"/>
  <!-- 雪花點綴 -->
  <circle cx="65" cy="100" r="2" fill="#ffffff"/>
  <circle cx="145" cy="90" r="2.5" fill="#ffffff"/>
</svg>
`;

async function main() {
  await generateSvgWebp(eagleSvg, 'public/assets/common/loader/season_01_eagle.webp');
  await generateSvgWebp(snakeDragonSvg, 'public/assets/common/loader/season_02_snake.webp');
  await generateSvgWebp(blossomDeerSvg, 'public/assets/common/loader/season_03_deer.webp');
  await generateSvgWebp(easterBunnySvg, 'public/assets/common/loader/season_04_bunny.webp');
  await generateSvgWebp(lilyFairySvg, 'public/assets/common/loader/season_05_lily.webp');
  await generateSvgWebp(dragonBoatSvg, 'public/assets/common/loader/season_06_dragonboat.webp');
  await generateSvgWebp(flyingSquirrelSvg, 'public/assets/common/loader/season_07_squirrel.webp');
  await generateSvgWebp(warriorSvg, 'public/assets/common/loader/season_08_warrior.webp');
  await generateSvgWebp(moonRabbitSvg, 'public/assets/common/loader/season_09_moonrabbit.webp');
  await generateSvgWebp(turkeySvg, 'public/assets/common/loader/season_11_turkey.webp');
  await generateSvgWebp(santaSleighSvg, 'public/assets/common/loader/season_12_sleigh.webp');
  console.log('All 16 Wildlife and Seasonal Sprites have been generated successfully!');
}

main().catch(console.error);
