import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve('public/assets/common/loader');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function renderSvgToWebp(svgContent, filename) {
  const targetPath = path.join(OUTPUT_DIR, filename);
  await sharp(Buffer.from(svgContent.trim()))
    .resize(256, 256)
    .webp({ quality: 95, effort: 6 })
    .toFile(targetPath);
  const stat = fs.statSync(targetPath);
  console.log(`✓ Rendered: ${filename} (${(stat.size / 1024).toFixed(1)} KB)`);
}

// ─────────────────────────────────────────────────────────────
// 1. 台灣雲豹 (Clouded Leopard - Likulaw)
// 矯健金褐皮毛、大塊黑色雲斑、靈動長尾、全力向右狂奔
// ─────────────────────────────────────────────────────────────
const cloudedLeopardSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="leopardBody" x1="60" y1="90" x2="200" y2="160" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <linearGradient id="leopardBelly" x1="100" y1="130" x2="160" y2="170" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#fef3c7"/>
      <stop offset="100%" stop-color="#fde68a"/>
    </linearGradient>
  </defs>

  <!-- 長長捲曲平衡尾巴 (Trailing Tail) -->
  <path d="M45 135 C20 120, 10 90, 25 70 C38 52, 60 62, 52 82 C45 98, 48 115, 68 128" stroke="#d97706" stroke-width="14" stroke-linecap="round" fill="none"/>
  <circle cx="25" cy="72" r="5" fill="#1c1917"/>
  <circle cx="36" cy="62" r="4.5" fill="#1c1917"/>
  <circle cx="48" cy="80" r="5" fill="#1c1917"/>
  <circle cx="55" cy="105" r="5.5" fill="#1c1917"/>

  <!-- 後左腿 (Back Left Leg) -->
  <path d="M75 135 C55 155, 42 185, 30 195 C25 200, 35 205, 45 200 C58 190, 75 165, 88 145 Z" fill="#b45309"/>

  <!-- 雲豹身軀流線 (Sleek Torso) -->
  <path d="M65 125 C80 100, 125 105, 175 110 C190 112, 195 128, 175 150 C145 168, 95 165, 65 145 Z" fill="url(#leopardBody)"/>
  <!-- 腹部乳白毛 (Cream Belly) -->
  <path d="M85 142 C110 158, 150 156, 170 142 C155 152, 120 154, 95 146 Z" fill="url(#leopardBelly)"/>

  <!-- 經典雲塊斑紋 (Cloud Blotches) -->
  <path d="M92 118 Q105 110 115 118 Q118 130 105 132 Q90 130 92 118 Z" fill="#78350f" stroke="#1c1917" stroke-width="3"/>
  <path d="M128 116 Q142 108 155 116 Q158 128 145 132 Q130 130 128 116 Z" fill="#78350f" stroke="#1c1917" stroke-width="3"/>
  <path d="M110 136 Q122 130 132 138 Q130 148 118 148 Q108 146 110 136 Z" fill="#78350f" stroke="#1c1917" stroke-width="2.5"/>

  <!-- 後右腿 (Back Right Leg, Forward Stride) -->
  <path d="M90 138 C80 162, 70 188, 85 202 C92 208, 102 202, 102 192 C102 175, 105 155, 110 142 Z" fill="#d97706"/>
  <!-- 前左腿 (Front Left Leg) -->
  <path d="M150 135 C145 160, 138 185, 145 198 C150 204, 160 200, 162 190 C165 172, 168 150, 168 135 Z" fill="#b45309"/>
  <!-- 前右腿 (Front Right Leg, Extended Forward Reach) -->
  <path d="M172 130 C190 145, 215 168, 235 185 C242 190, 248 182, 240 176 C220 160, 195 136, 182 125 Z" fill="#f59e0b"/>

  <!-- 雲豹頭部 (Head Leaning Forward to Right) -->
  <circle cx="195" cy="112" r="24" fill="url(#leopardBody)"/>
  <!-- 雙耳 (Ears) -->
  <path d="M182 92 L192 78 L202 92 Z" fill="#b45309"/>
  <path d="M186 90 L192 82 L198 90 Z" fill="#fef3c7"/>
  <path d="M202 96 L214 84 L220 98 Z" fill="#b45309"/>
  <path d="M206 96 L212 88 L216 96 Z" fill="#fef3c7"/>
  <!-- 吻部與粉黑小鼻 (Muzzle & Nose) -->
  <ellipse cx="212" cy="120" rx="12" ry="8" fill="#fef3c7"/>
  <path d="M216 117 L222 117 L219 122 Z" fill="#ec4899"/>
  <!-- 貓鬚 (Whiskers) -->
  <path d="M218 122 Q235 120 248 124 M218 124 Q234 128 245 134" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
  <!-- 炯炯有神金綠豹眼 (Catchlight Eye) -->
  <ellipse cx="202" cy="108" rx="6.5" ry="7.5" fill="#84cc16"/>
  <circle cx="203" cy="108" r="4" fill="#1c1917"/>
  <circle cx="201" cy="105" r="2" fill="#ffffff"/>
  <circle cx="205" cy="110" r="1" fill="#ffffff"/>
  <!-- 斑點 (Facial Markings) -->
  <path d="M192 102 Q196 100 200 102 M186 112 Q190 114 192 118" stroke="#1c1917" stroke-width="2.5" stroke-linecap="round" fill="none"/>
</svg>
`;

// ─────────────────────────────────────────────────────────────
// 2. 台灣黑熊 (Formosan Black Bear - Cumay)
// 圓滾耳朵、胸前純白 V 字月牙、四蹄奔騰、昂首向前
// ─────────────────────────────────────────────────────────────
const blackBearSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bearFur" x1="70" y1="80" x2="190" y2="180" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="40%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>

  <!-- 圓滾小尾 (Short Tail) -->
  <circle cx="52" cy="122" r="10" fill="#0f172a"/>

  <!-- 後左腿 (Back Left Leg) -->
  <path d="M70 135 C52 155, 40 185, 35 198 C32 205, 45 208, 55 200 C68 188, 82 165, 90 145 Z" fill="#0f172a"/>

  <!-- 渾厚大熊軀幹 (Powerful Body) -->
  <path d="M60 120 C75 90, 130 92, 175 105 C195 110, 200 130, 180 155 C155 178, 90 175, 60 142 Z" fill="url(#bearFur)"/>

  <!-- 胸前標誌純白 V 字月牙領 (White Crescent V Collar) -->
  <path d="M152 125 L168 148 L188 120 Q178 128 168 135 Q158 128 152 125 Z" fill="#ffffff" stroke="#f1f5f9" stroke-width="1.5"/>

  <!-- 後右腿 (Back Right Leg) -->
  <path d="M95 138 C88 162, 85 188, 98 202 C104 208, 115 204, 116 195 C116 178, 118 158, 120 142 Z" fill="#1e293b"/>

  <!-- 前左腿 (Front Left Leg) -->
  <path d="M148 135 C142 160, 138 186, 146 198 C150 205, 162 202, 164 192 C168 175, 170 152, 170 138 Z" fill="#0f172a"/>

  <!-- 前右腿 (Front Right Leg, Thrust Forward) -->
  <path d="M172 130 C190 145, 212 168, 230 184 C238 190, 245 182, 238 174 C218 156, 195 132, 184 122 Z" fill="#1e293b"/>
  <!-- 熊掌爪印 (Claws) -->
  <circle cx="236" cy="180" r="2.5" fill="#94a3b8"/>
  <circle cx="240" cy="176" r="2.5" fill="#94a3b8"/>
  <circle cx="242" cy="172" r="2.5" fill="#94a3b8"/>

  <!-- 圓滾大黑熊頭 (Round Bear Head) -->
  <circle cx="195" cy="108" r="26" fill="url(#bearFur)"/>
  <!-- 大圓黑熊耳 (Round Ears) -->
  <circle cx="180" cy="85" r="11" fill="#0f172a"/>
  <circle cx="180" cy="85" r="6" fill="#475569"/>
  <circle cx="206" cy="88" r="11" fill="#1e293b"/>
  <circle cx="206" cy="88" r="6" fill="#475569"/>

  <!-- 棕色嘴吻與大黑鼻 (Brown Muzzle & Black Nose) -->
  <ellipse cx="214" cy="116" rx="14" ry="10" fill="#b45309"/>
  <ellipse cx="220" cy="113" rx="5" ry="4" fill="#0f172a"/>
  <circle cx="219" cy="112" r="1.5" fill="#ffffff"/>
  <!-- 微笑嘴弧 (Smile) -->
  <path d="M216 119 Q222 124 226 119" stroke="#451a03" stroke-width="2" stroke-linecap="round" fill="none"/>

  <!-- 靈動大熊眼 (Expressive Bear Eye) -->
  <ellipse cx="200" cy="105" rx="6" ry="7" fill="#0f172a"/>
  <circle cx="199" cy="103" r="2.5" fill="#ffffff"/>
  <circle cx="202" cy="107" r="1" fill="#ffffff"/>
</svg>
`;

// ─────────────────────────────────────────────────────────────
// 3. 神山野豬 (Mountain Wild Boar - Babuy)
// 勇猛前衝、純白小獠牙、剛毛鬃背、可愛粉黑小鼻
// ─────────────────────────────────────────────────────────────
const wildBoarSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="boarBody" x1="60" y1="90" x2="190" y2="160" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#854d0e"/>
      <stop offset="50%" stop-color="#713f12"/>
      <stop offset="100%" stop-color="#451a03"/>
    </linearGradient>
  </defs>

  <!-- 捲曲小尾 (Curly Tail) -->
  <path d="M50 120 C35 110, 32 95, 42 90 C50 86, 52 98, 48 108" stroke="#713f12" stroke-width="5" stroke-linecap="round" fill="none"/>

  <!-- 後左腿 (Back Left Hoof) -->
  <path d="M72 135 L50 185 L65 188 L85 145 Z" fill="#451a03"/>
  <path d="M48 185 L65 188 L63 194 L46 191 Z" fill="#1c1917"/>

  <!-- 剛毛鬃背 (Bristly Spine Ridge) -->
  <path d="M75 102 L80 88 L90 100 L98 86 L108 98 L118 84 L128 96 L140 85 L150 98" stroke="#451a03" stroke-width="4" stroke-linecap="round" fill="none"/>

  <!-- 健壯身軀 (Sturdy Barrel Body) -->
  <path d="M60 125 C75 95, 125 95, 175 105 C195 110, 200 135, 175 160 C145 175, 90 172, 60 145 Z" fill="url(#boarBody)"/>

  <!-- 後右腿 (Back Right Hoof) -->
  <path d="M98 140 L85 188 L100 190 L115 145 Z" fill="#713f12"/>
  <path d="M83 188 L100 190 L98 196 L81 194 Z" fill="#1c1917"/>

  <!-- 前左腿 (Front Left Hoof) -->
  <path d="M148 140 L138 188 L152 190 L162 145 Z" fill="#451a03"/>
  <path d="M136 188 L152 190 L150 196 L134 194 Z" fill="#1c1917"/>

  <!-- 前右腿 (Front Right Hoof, Charging Forward) -->
  <path d="M170 135 L195 180 L210 178 L185 128 Z" fill="#854d0e"/>
  <path d="M195 180 L210 178 L212 184 L197 186 Z" fill="#1c1917"/>

  <!-- 野豬頭部 (Wedge-shaped Head Angled Forward) -->
  <path d="M170 102 Q195 95 215 112 Q225 125 210 138 Q185 145 168 128 Z" fill="url(#boarBody)"/>
  <!-- 小野豬耳 (Boar Ears Back) -->
  <path d="M175 98 L168 82 L185 88 Z" fill="#451a03"/>
  <path d="M175 96 L171 86 L182 90 Z" fill="#fbcfe8"/>

  <!-- 野豬鼻盤 (Snout Disc) -->
  <ellipse cx="224" cy="120" rx="9" ry="12" fill="#f472b6" stroke="#db2777" stroke-width="2"/>
  <circle cx="222" cy="118" r="2.5" fill="#451a03"/>
  <circle cx="222" cy="123" r="2.5" fill="#451a03"/>

  <!-- 上揚純白獠牙 (White Tusks) -->
  <path d="M210 128 C215 128, 222 118, 224 108 C218 114, 212 122, 208 126 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>

  <!-- 圓滾大眼 (Determined Eye) -->
  <circle cx="196" cy="110" r="6" fill="#1c1917"/>
  <circle cx="195" cy="108" r="2" fill="#ffffff"/>
  <circle cx="198" cy="112" r="1" fill="#ffffff"/>
</svg>
`;

// ─────────────────────────────────────────────────────────────
// 4. 台灣水鹿 (Formosan Sambar Deer - Venado)
// 枝狀長角、高山輕躍、溫柔大眼、高挑修長四蹄
// ─────────────────────────────────────────────────────────────
const sambarDeerSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="deerBody" x1="60" y1="90" x2="190" y2="160" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#b45309"/>
      <stop offset="50%" stop-color="#92400e"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>
  </defs>

  <!-- 短鹿尾 (Short Deer Tail) -->
  <path d="M48 128 Q38 120 42 112 Q52 118 52 128 Z" fill="#fef3c7"/>

  <!-- 後左腿 (Back Left Leg, Extended High in Leap) -->
  <path d="M68 135 C50 152, 35 178, 28 190 L36 194 C46 182, 62 158, 80 142 Z" fill="#78350f"/>
  <path d="M26 190 L36 194 L34 198 L24 194 Z" fill="#1c1917"/>

  <!-- 修長身軀 (Graceful Torso) -->
  <path d="M62 128 C75 105, 120 110, 165 118 C180 122, 185 138, 168 155 C140 168, 90 165, 62 142 Z" fill="url(#deerBody)"/>
  <!-- 腹部米色毛 (Cream Underbelly) -->
  <path d="M82 142 C110 155, 145 152, 162 142 C148 150, 115 152, 92 145 Z" fill="#fef3c7"/>

  <!-- 後右腿 (Back Right Leg) -->
  <path d="M92 138 C82 165, 75 188, 82 202 L92 200 C88 186, 95 162, 105 145 Z" fill="#92400e"/>
  <path d="M80 202 L92 200 L90 206 L78 206 Z" fill="#1c1917"/>

  <!-- 前左腿 (Front Left Leg) -->
  <path d="M148 135 C142 162, 138 188, 145 200 L155 198 C150 185, 155 160, 162 138 Z" fill="#78350f"/>
  <path d="M143 200 L155 198 L154 204 L141 204 Z" fill="#1c1917"/>

  <!-- 前右腿 (Front Right Leg, Soaring Forward in Leap) -->
  <path d="M168 130 C185 145, 210 168, 235 182 L242 175 C218 160, 192 138, 178 125 Z" fill="#b45309"/>
  <path d="M235 182 L242 175 L246 179 L238 186 Z" fill="#1c1917"/>

  <!-- 雄偉分叉鹿角 (Branching Antlers) -->
  <path d="M182 92 C178 72, 172 50, 165 38 M172 58 C160 52, 152 52, 148 56 M168 45 C158 35, 148 36, 142 42" stroke="#78350f" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M192 90 C195 68, 200 45, 208 32 M198 56 C210 50, 218 52, 222 56 M204 42 C216 34, 225 36, 230 42" stroke="#92400e" stroke-width="4.5" stroke-linecap="round"/>

  <!-- 修長鹿首 (Deer Head) -->
  <path d="M172 120 C175 105, 185 95, 198 95 C212 95, 225 108, 225 120 C220 128, 200 135, 178 130 Z" fill="url(#deerBody)"/>
  <!-- 大長耳 (Alert Ears) -->
  <path d="M178 95 C168 85, 160 88, 162 98 Z" fill="#78350f"/>
  <path d="M176 95 C170 88, 165 90, 166 96 Z" fill="#fef3c7"/>

  <!-- 溫潤小黑鼻 (Black Nose) -->
  <circle cx="225" cy="120" r="4" fill="#1c1917"/>
  <!-- 靈動水鹿溫柔大眼 (Gentle Big Deer Eye) -->
  <ellipse cx="200" cy="108" rx="6.5" ry="7.5" fill="#1c1917"/>
  <circle cx="199" cy="105" r="2.5" fill="#ffffff"/>
  <circle cx="203" cy="110" r="1" fill="#ffffff"/>
</svg>
`;

// ─────────────────────────────────────────────────────────────
// 5. 1月限定：神山晨曦金鷹 (Mountain Crested Eagle)
// 展翅破風翱翔、流暢層次金羽、銳利金喙與鷹眼
// ─────────────────────────────────────────────────────────────
const eagleSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="eagleWing" x1="40" y1="40" x2="180" y2="140" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>
  </defs>

  <!-- 左主羽翼 (Left Upward Soaring Wing) -->
  <path d="M110 115 C85 65, 45 35, 15 45 C32 75, 58 100, 85 120 Z" fill="#92400e"/>
  <path d="M120 105 C100 50, 68 22, 38 18 C58 45, 88 78, 110 100 Z" fill="#b45309"/>
  <!-- 右主羽翼 (Right Sweeping Wing with Feathers) -->
  <path d="M130 95 C160 40, 205 20, 240 25 C215 55, 185 85, 152 105 Z" fill="url(#eagleWing)"/>
  <path d="M142 105 C175 60, 222 52, 245 65 C222 88, 190 115, 158 122 Z" fill="#d97706"/>

  <!-- 鷹身軀幹 (Eagle Torso) -->
  <ellipse cx="132" cy="122" rx="36" ry="20" fill="#78350f"/>
  <path d="M112 122 C130 135, 155 135, 168 124 C158 138, 130 140, 112 122 Z" fill="#fef08a"/>

  <!-- 扇形尾羽 (Fan Tail Feathers) -->
  <path d="M102 126 L48 150 L72 134 L45 138 L98 120 Z" fill="#78350f" stroke="#b45309" stroke-width="2"/>

  <!-- 鷹爪微縮 (Tucked Talons in Flight) -->
  <path d="M125 138 L122 152 M135 138 L135 154" stroke="#ea580c" stroke-width="3.5" stroke-linecap="round"/>

  <!-- 鷹首昂揚 (Head Leaning Forward to Right) -->
  <circle cx="168" cy="112" r="16" fill="#fef08a"/>
  <!-- 金色銳利彎鉤喙 (Hooked Beak) -->
  <path d="M182 110 Q202 112 205 120 Q192 126 182 122 Z" fill="#ea580c" stroke="#c2410c" stroke-width="1.5"/>

  <!-- 銳利鷹眼 (Piercing Raptor Eye) -->
  <circle cx="172" cy="110" r="4.5" fill="#1c1917"/>
  <circle cx="171" cy="108" r="1.5" fill="#ffffff"/>
  <!-- 冠羽 (Crest Feathers) -->
  <path d="M158 98 L168 102 M154 104 L164 108" stroke="#b45309" stroke-width="3" stroke-linecap="round"/>
</svg>
`;

// ─────────────────────────────────────────────────────────────
// 6. 2月限定：西洋情人節 甜心愛心萌兔 (Valentine Sweetheart Bunny)
// 懷抱發光粉紅愛心巧克力、長耳隨風揚起、向前歡快大步跳躍
// ─────────────────────────────────────────────────────────────
const sweetheartBunnySvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bunnyFur" x1="70" y1="80" x2="180" y2="180" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="60%" stop-color="#fce7f3"/>
      <stop offset="100%" stop-color="#fbcfe8"/>
    </linearGradient>
    <linearGradient id="heartGrad" x1="130" y1="100" x2="200" y2="170" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="50%" stop-color="#e11d48"/>
      <stop offset="100%" stop-color="#be123c"/>
    </linearGradient>
  </defs>

  <!-- 圓絨小尾球 (Fluffy Tail) -->
  <circle cx="58" cy="138" r="12" fill="#ffffff" stroke="#fbcfe8" stroke-width="2"/>

  <!-- 後左腿 (Back Left Leg) -->
  <path d="M75 142 C58 162, 45 188, 42 198 C40 205, 52 206, 62 198 C72 188, 85 168, 92 152 Z" fill="#fbcfe8"/>

  <!-- 萌兔身軀 (Bunny Torso) -->
  <ellipse cx="112" cy="142" rx="42" ry="32" fill="url(#bunnyFur)"/>

  <!-- 後右腿 (Back Right Leg) -->
  <path d="M98 152 C90 172, 85 194, 98 204 C105 208, 115 204, 116 195 C116 180, 118 165, 120 152 Z" fill="#ffffff" stroke="#fbcfe8" stroke-width="2"/>

  <!-- 飛揚長雙耳 (Floppy Long Ears Streaming Back) -->
  <path d="M125 90 C105 60, 75 42, 50 48 C65 65, 95 85, 120 98 Z" fill="url(#bunnyFur)"/>
  <path d="M115 88 C100 68, 80 54, 62 58 C72 70, 95 84, 112 92 Z" fill="#f472b6"/>
  <path d="M142 88 C135 55, 118 32, 95 28 C105 50, 125 75, 138 94 Z" fill="url(#bunnyFur)"/>
  <path d="M136 84 C130 60, 118 42, 104 38 C110 52, 124 72, 132 86 Z" fill="#f472b6"/>

  <!-- 萌兔圓臉 (Cute Head) -->
  <circle cx="152" cy="112" r="26" fill="url(#bunnyFur)"/>
  <!-- 粉嫩腮紅 (Blushing Cheeks) -->
  <circle cx="145" cy="122" r="6" fill="#f472b6" opacity="0.6"/>
  <circle cx="170" cy="122" r="6" fill="#f472b6" opacity="0.6"/>

  <!-- 粉紅三叉小鼻與笑唇 (Nose & Smile) -->
  <ellipse cx="162" cy="118" rx="3.5" ry="3" fill="#e11d48"/>
  <path d="M158 122 Q162 126 166 122" stroke="#be123c" stroke-width="2" stroke-linecap="round" fill="none"/>

  <!-- 水汪汪萌兔大眼 (Big Shimmering Bunny Eye) -->
  <ellipse cx="156" cy="108" rx="6.5" ry="8" fill="#1c1917"/>
  <circle cx="154" cy="105" r="2.5" fill="#ffffff"/>
  <circle cx="158" cy="110" r="1" fill="#ffffff"/>

  <!-- 懷抱巨型西洋情人節發光愛心 (Sweetheart Heart) -->
  <path d="M185 125 C175 110, 155 110, 150 125 C145 110, 125 110, 115 125 C100 148, 140 178, 150 188 C160 178, 200 148, 185 125 Z" fill="url(#heartGrad)"/>
  <!-- 愛心高光 (Heart Specular Highlight) -->
  <path d="M125 125 C122 135, 126 145, 132 152" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.7"/>

  <!-- 抱著愛心的小兔前爪 (Paws Hugging the Heart) -->
  <ellipse cx="132" cy="142" rx="7" ry="5" fill="#ffffff" stroke="#fbcfe8" stroke-width="1.5"/>
  <ellipse cx="168" cy="142" rx="7" ry="5" fill="#ffffff" stroke="#fbcfe8" stroke-width="1.5"/>
</svg>
`;

// ─────────────────────────────────────────────────────────────
// 7. 3月限定：魯凱守護百步蛇 (Rukai Hundred-Pace Pit Viper)
// 經典黑白幾何菱格紋、尊貴三角形昂首、靈動向前游動游走
// ─────────────────────────────────────────────────────────────
const rukaiSnakeSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="snakeBody" x1="40" y1="160" x2="220" y2="120" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#7c2d12"/>
      <stop offset="50%" stop-color="#9a3412"/>
      <stop offset="100%" stop-color="#c2410c"/>
    </linearGradient>
  </defs>

  <!-- 蛇身波浪游動 (Serpentine Undulating Body) -->
  <path d="M35 155 Q65 115 100 150 T165 140 T215 120" stroke="#7c2d12" stroke-width="26" stroke-linecap="round" fill="none"/>
  <path d="M35 155 Q65 115 100 150 T165 140 T215 120" stroke="url(#snakeBody)" stroke-width="20" stroke-linecap="round" fill="none"/>

  <!-- 魯凱經典幾何菱形紋 (Rukai Diamond Geometric Patterns) -->
  <!-- 菱形 1 -->
  <polygon points="68,128 76,120 84,128 76,136" fill="#fef08a" stroke="#18181b" stroke-width="2"/>
  <circle cx="76" cy="128" r="2.5" fill="#dc2626"/>
  <!-- 菱形 2 -->
  <polygon points="105,148 114,140 123,148 114,156" fill="#fef08a" stroke="#18181b" stroke-width="2"/>
  <circle cx="114" cy="148" r="2.5" fill="#dc2626"/>
  <!-- 菱形 3 -->
  <polygon points="142,138 152,128 162,138 152,148" fill="#fef08a" stroke="#18181b" stroke-width="2"/>
  <circle cx="152" cy="138" r="2.5" fill="#dc2626"/>
  <!-- 菱形 4 -->
  <polygon points="178,130 188,122 198,130 188,138" fill="#fef08a" stroke="#18181b" stroke-width="2"/>
  <circle cx="188" cy="130" r="2.5" fill="#dc2626"/>

  <!-- 尊貴百步蛇首 (Triangular Viper Head) -->
  <path d="M198 120 Q225 102 238 114 Q244 126 220 134 Q198 132 195 124 Z" fill="#9a3412"/>
  <path d="M208 112 Q225 108 235 115 Q224 124 210 122 Z" fill="#fef08a"/>

  <!-- 百步蛇翹鼻尖角 (Upturned Nose Tip) -->
  <path d="M236 112 Q246 106 248 112 Q244 118 236 116 Z" fill="#ea580c"/>

  <!-- 威嚴靈動金眼 (Golden Viper Eye) -->
  <circle cx="218" cy="114" r="4.5" fill="#facc15"/>
  <ellipse cx="218" cy="114" rx="1.8" ry="4" fill="#18181b"/>
  <circle cx="217" cy="112" r="1" fill="#ffffff"/>

  <!-- 靈動小蛇信 (Flickering Tongue) -->
  <path d="M242 116 L252 114 M248 115 L254 120" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
</svg>
`;

// ─────────────────────────────────────────────────────────────
// 8. 4月限定：復活節彩蛋兔 (Easter Egg Bunny)
// 長耳萌兔、推滾彩色幾何彩蛋、向前歡樂大跳步
// ─────────────────────────────────────────────────────────────
const easterBunnySvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="eggGrad" x1="150" y1="110" x2="230" y2="190" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
  </defs>

  <!-- 圓絨兔尾 (Tail) -->
  <circle cx="48" cy="140" r="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>

  <!-- 後左腿 (Back Left Leg) -->
  <path d="M65 145 C48 165, 38 188, 35 198 C32 205, 45 206, 55 198 C65 188, 75 168, 82 152 Z" fill="#e2e8f0"/>

  <!-- 萌兔身軀 (Body) -->
  <ellipse cx="98" cy="145" rx="36" ry="28" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>

  <!-- 後右腿 (Back Right Leg) -->
  <path d="M85 152 C78 172, 75 194, 88 204 C95 208, 105 204, 106 195 C106 180, 108 165, 110 152 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>

  <!-- 豎直向前長耳 (Ears Leaning Forward) -->
  <path d="M105 95 C98 62, 85 38, 72 32 C78 55, 95 82, 102 102 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <path d="M98 90 C92 68, 84 48, 76 42 C80 58, 92 78, 98 92 Z" fill="#f472b6"/>
  <path d="M125 92 C125 58, 115 32, 102 26 C105 50, 118 76, 122 100 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <path d="M122 88 C120 64, 114 44, 106 38 C108 55, 116 75, 120 90 Z" fill="#f472b6"/>

  <!-- 萌兔頭部 (Head) -->
  <circle cx="128" cy="115" r="22" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <circle cx="122" cy="122" r="5" fill="#f472b6" opacity="0.6"/>
  <circle cx="142" cy="122" r="5" fill="#f472b6" opacity="0.6"/>
  <circle cx="132" cy="112" r="5" fill="#1c1917"/>
  <circle cx="131" cy="110" r="1.8" fill="#ffffff"/>

  <!-- 繽紛彩繪復活節大彩蛋 (Giant Decorated Easter Egg) -->
  <ellipse cx="188" cy="155" rx="38" ry="48" fill="url(#eggGrad)" transform="rotate(15 188 155)"/>
  <!-- 彩蛋波浪紋 (Egg Zigzag Stripes) -->
  <path d="M155 145 Q170 135 185 145 T215 145" stroke="#facc15" stroke-width="4" fill="none"/>
  <path d="M158 162 Q172 152 188 162 T218 162" stroke="#ffffff" stroke-width="4" stroke-dasharray="6 4" fill="none"/>
  <circle cx="178" cy="130" r="4" fill="#ffffff"/>
  <circle cx="198" cy="134" r="3.5" fill="#facc15"/>
  <circle cx="188" cy="178" r="4.5" fill="#ffffff"/>

  <!-- 前爪推彩蛋 (Paws Pushing Egg) -->
  <ellipse cx="152" cy="142" rx="8" ry="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <ellipse cx="162" cy="152" rx="8" ry="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
</svg>
`;

// ─────────────────────────────────────────────────────────────
// 9. 5月限定：溫馨母親節 袋鼠母子 (Mother Kangaroo & Joey)
// 袋鼠媽媽口袋探出萌小袋鼠、戴著粉紅康乃馨、健步躍進
// ─────────────────────────────────────────────────────────────
const motherKangarooSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="rooBody" x1="60" y1="80" x2="190" y2="180" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#d97706"/>
      <stop offset="50%" stop-color="#b45309"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>
  </defs>

  <!-- 強健有力長尾 (Muscular Balancing Tail) -->
  <path d="M85 155 C55 160, 25 180, 15 205 C12 212, 22 215, 30 208 C48 190, 75 175, 95 168 Z" fill="#78350f"/>

  <!-- 後長腿 (Powerful Hind Jumping Leg) -->
  <path d="M95 140 C85 165, 78 192, 60 208 L72 212 C92 195, 108 168, 118 148 Z" fill="#b45309"/>
  <path d="M58 208 L72 212 L70 216 L56 212 Z" fill="#451a03"/>

  <!-- 袋鼠媽媽軀幹 (Mother Kangaroo Torso) -->
  <path d="M88 130 C100 95, 138 98, 165 110 C180 118, 182 145, 165 168 C140 182, 105 175, 88 152 Z" fill="url(#rooBody)"/>

  <!-- 溫馨育兒袋 (Cozy Pouch) -->
  <path d="M142 140 C145 162, 172 165, 175 142 C165 152, 152 152, 142 140 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>

  <!-- 育兒袋中探頭的小袋鼠 (Baby Joey in Pouch) -->
  <circle cx="160" cy="136" r="10" fill="#d97706"/>
  <ellipse cx="165" cy="138" rx="5" ry="4" fill="#fef3c7"/>
  <circle cx="168" cy="137" r="1.5" fill="#1c1917"/>
  <circle cx="162" cy="134" r="2.5" fill="#1c1917"/>
  <circle cx="161" cy="133" r="0.8" fill="#ffffff"/>
  <!-- 小袋鼠耳 (Joey Ears) -->
  <path d="M156 128 L152 120 L158 124 Z" fill="#b45309"/>
  <path d="M162 128 L165 120 L168 126 Z" fill="#b45309"/>
  <!-- 小袋鼠爪 (Joey Paws on Pouch Rim) -->
  <circle cx="152" cy="144" r="3" fill="#fef3c7"/>
  <circle cx="168" cy="144" r="3" fill="#fef3c7"/>

  <!-- 媽媽前爪 (Mother Paws Forward) -->
  <path d="M170 128 C185 132, 202 135, 210 142 L206 146 C198 140, 182 136, 170 134 Z" fill="#b45309"/>

  <!-- 媽媽頭部與長耳 (Mother Head & Long Ears) -->
  <circle cx="178" cy="100" r="18" fill="url(#rooBody)"/>
  <path d="M172 86 C165 65, 155 48, 148 42 C154 60, 168 78, 175 90 Z" fill="#b45309"/>
  <path d="M170 84 C166 68, 158 54, 152 48 C156 62, 166 76, 172 86 Z" fill="#fef3c7"/>
  <path d="M185 86 C188 62, 185 45, 180 38 C184 56, 188 75, 188 90 Z" fill="#d97706"/>

  <!-- 康乃馨花飾 (Pink Carnation on Ear) -->
  <circle cx="182" cy="85" r="7" fill="#ec4899"/>
  <circle cx="180" cy="82" r="5" fill="#f472b6"/>
  <circle cx="184" cy="86" r="4" fill="#fb7185"/>

  <!-- 溫柔慈愛大眼 (Gentle Loving Eye) -->
  <ellipse cx="185" cy="98" rx="5" ry="6" fill="#1c1917"/>
  <circle cx="184" cy="96" r="2" fill="#ffffff"/>
</svg>
`;

// ─────────────────────────────────────────────────────────────
// 10. 6月限定：端午熱血龍舟 (Dragon Boat Racer)
// 威風龍首昂揚噴水、小勇士奮力划槳、破浪衝刺
// ─────────────────────────────────────────────────────────────
const dragonBoatSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 激起白浪花 (Splashing Waves) -->
  <path d="M30 188 Q60 175 90 188 T150 188 T210 188 T250 188" stroke="#38bdf8" stroke-width="8" stroke-linecap="round" fill="none"/>
  <path d="M45 192 Q70 182 95 192 T155 192 T215 192" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none"/>

  <!-- 龍舟船體 (Dragon Boat Hull) -->
  <path d="M40 162 C70 155, 160 155, 215 162 L225 178 C160 185, 70 185, 30 178 Z" fill="#dc2626"/>
  <path d="M40 165 C80 160, 160 160, 215 165" stroke="#facc15" stroke-width="5" stroke-linecap="round"/>

  <!-- 昂首威風龍頭 (Dragon Head Prow) -->
  <path d="M205 165 Q235 142 245 125 Q248 110 238 115 Q225 122 220 135 Z" fill="#dc2626"/>
  <!-- 龍角與龍鬚 (Antlers & Whiskers) -->
  <path d="M232 112 Q240 95 248 92 M236 105 Q245 100 248 95" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
  <path d="M245 120 Q255 118 256 124" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
  <!-- 龍眼 (Dragon Eye) -->
  <circle cx="234" cy="118" r="4" fill="#facc15"/>
  <circle cx="235" cy="118" r="2.5" fill="#1c1917"/>

  <!-- 划槳小勇士 (Cute Chibi Rower) -->
  <circle cx="120" cy="122" r="16" fill="#fcd34d"/>
  <!-- 勇士頭帶 (Red Headband with Tails) -->
  <path d="M104 116 L136 116" stroke="#dc2626" stroke-width="5"/>
  <path d="M104 116 L92 122 M104 116 L90 114" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
  <!-- 專注熱血笑眼 (Determined Eyes) -->
  <path d="M116 122 Q120 118 124 122" stroke="#1c1917" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <circle cx="128" cy="122" r="2.5" fill="#1c1917"/>

  <!-- 划動木槳 (Paddling Oar Sweeping Water) -->
  <path d="M125 138 L160 195" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
  <path d="M152 188 L168 202 L160 205 L146 192 Z" fill="#b45309"/>
</svg>
`;

// ─────────────────────────────────────────────────────────────
// 11. 7月限定：盛夏神山大赤鼯鼠 (Flying Squirrel)
// 展開毛茸茸寬闊飛膜、向前俯衝滑翔、大眼圓亮、速度感十足
// ─────────────────────────────────────────────────────────────
const flyingSquirrelSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="patagium" x1="60" y1="90" x2="200" y2="180" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#b45309"/>
      <stop offset="60%" stop-color="#92400e"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>
  </defs>

  <!-- 向前速度風線 (Wind Speed Lines) -->
  <path d="M20 90 L60 90 M10 130 L55 130 M25 170 L70 170" stroke="#fef08a" stroke-width="3" stroke-linecap="round" opacity="0.6"/>

  <!-- 蓬鬆長長舵尾 (Bushy Rudder Tail Trailing) -->
  <path d="M85 135 C55 142, 25 130, 20 115 C18 105, 32 108, 48 118 C65 128, 78 132, 92 135 Z" fill="#78350f"/>

  <!-- 寬闊滑翔飛膜 (Gliding Membrane - Patagium Cape) -->
  <path d="M85 125 C80 85, 140 70, 185 88 C160 115, 175 145, 195 162 C150 178, 100 165, 85 125 Z" fill="url(#patagium)"/>
  <!-- 腹部米白毛 (Cream Belly) -->
  <path d="M105 118 C125 112, 160 120, 170 142 C145 152, 120 145, 105 118 Z" fill="#fef3c7"/>

  <!-- 伸展前爪 (Front Paws Grasping Wind) -->
  <circle cx="188" cy="88" r="7" fill="#b45309"/>
  <circle cx="198" cy="162" r="7" fill="#b45309"/>

  <!-- 鼯鼠頭部 (Head Leading the Dive) -->
  <circle cx="188" cy="120" r="22" fill="#b45309"/>
  <!-- 圓大耳 (Round Ears) -->
  <circle cx="178" cy="100" r="8" fill="#78350f"/>
  <circle cx="178" cy="100" r="4" fill="#fbcfe8"/>

  <!-- 粉嫩小鼻吻 (Pink Nose & Whiskers) -->
  <ellipse cx="206" cy="122" rx="6" ry="5" fill="#fef3c7"/>
  <circle cx="210" cy="121" r="2" fill="#ec4899"/>
  <path d="M208 124 L220 120 M208 126 L218 128" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>

  <!-- 夜行動物水汪汪特大黑眼 (Giant Glassy Nocturnal Eye) -->
  <ellipse cx="192" cy="116" rx="8" ry="9" fill="#1c1917"/>
  <circle cx="190" cy="112" r="3" fill="#ffffff"/>
  <circle cx="195" cy="118" r="1.5" fill="#ffffff"/>
</svg>
`;

// ─────────────────────────────────────────────────────────────
// 12. 8月限定：霧台豐年祭 魯凱小勇士 (Rukai Young Warrior)
// 純白百合花冠、傳統圖騰肩帶、手持長矛、大步快跑向前
// ─────────────────────────────────────────────────────────────
const rukaiWarriorSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 後長腿 (Back Leg) -->
  <path d="M102 148 L80 195 L95 198 L115 155 Z" fill="#78350f"/>
  <!-- 前長腿 (Front Leg Charging) -->
  <path d="M125 148 L155 190 L170 186 L140 145 Z" fill="#92400e"/>

  <!-- 傳統圖騰短袍 (Tribal Tunic) -->
  <path d="M98 120 L142 120 L148 152 L92 152 Z" fill="#1c1917"/>
  <!-- 紅黃百步蛇菱格織紋 (Embroidered Sash) -->
  <path d="M102 120 L138 152" stroke="#dc2626" stroke-width="8"/>
  <path d="M102 120 L138 152" stroke="#facc15" stroke-width="4" stroke-dasharray="6 4"/>

  <!-- 小勇士頭部 (Chibi Head) -->
  <circle cx="122" cy="95" r="24" fill="#fcd34d"/>
  <!-- 黝黑健康臉龐腮紅 -->
  <circle cx="112" cy="102" r="4" fill="#ea580c" opacity="0.6"/>
  <circle cx="132" cy="102" r="4" fill="#ea580c" opacity="0.6"/>

  <!-- 炯炯有神大眼 (Determined Big Eyes) -->
  <circle cx="118" cy="94" r="4" fill="#1c1917"/>
  <circle cx="117" cy="92" r="1.5" fill="#ffffff"/>
  <circle cx="132" cy="94" r="4" fill="#1c1917"/>
  <circle cx="131" cy="92" r="1.5" fill="#ffffff"/>
  <path d="M120 104 Q125 108 130 104" stroke="#451a03" stroke-width="2" stroke-linecap="round" fill="none"/>

  <!-- 頭戴魯凱純白百合桂冠 (Rukai Lily Crown) -->
  <path d="M100 85 Q122 75 144 85" stroke="#15803d" stroke-width="4" fill="none"/>
  <!-- 百合花瓣盛開 (Blooming Lily) -->
  <path d="M122 75 C115 60, 110 48, 122 42 C134 48, 129 60, 122 75 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
  <path d="M122 68 L108 55 M122 68 L136 55" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
  <!-- 雄鷹羽毛 (Eagle Feather Tucked in Crown) -->
  <path d="M135 78 C155 60, 175 42, 185 35 C178 52, 162 70, 145 82 Z" fill="#18181b"/>
  <path d="M142 80 L180 38" stroke="#ffffff" stroke-width="1.5"/>

  <!-- 手持長矛 (Holding Wooden Spear Forward) -->
  <path d="M85 160 L185 85" stroke="#78350f" stroke-width="5" stroke-linecap="round"/>
  <!-- 矛尖黑曜石 (Spear Tip) -->
  <polygon points="182,88 202,75 192,95" fill="#334155"/>
</svg>
`;

// ─────────────────────────────────────────────────────────────
// 13. 9月限定：中秋奔月玉兔 (Moon Festival Jade Rabbit)
// 踏金色祥雲、仙氣飄帶隨風舞、抱著黃金月餅飛向滿月
// ─────────────────────────────────────────────────────────────
const moonRabbitSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cloudGrad" x1="40" y1="160" x2="200" y2="200" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#fde047"/>
      <stop offset="100%" stop-color="#eab308"/>
    </linearGradient>
  </defs>

  <!-- 金黃祥雲 (Auspicious Flying Cloud) -->
  <path d="M50 185 Q75 165 105 180 Q135 160 165 178 Q195 168 215 188 Q190 205 130 200 Q70 205 50 185 Z" fill="url(#cloudGrad)"/>
  <circle cx="85" cy="180" r="14" fill="#fef08a"/>
  <circle cx="140" cy="175" r="16" fill="#fef08a"/>

  <!-- 仙女紫色仙氣飄帶 (Celestial Silk Ribbon Trailing) -->
  <path d="M60 140 Q95 105 140 120 T210 105" stroke="#c084fc" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.8"/>
  <path d="M45 155 Q85 125 130 135 T195 120" stroke="#f472b6" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8"/>

  <!-- 純白玉兔身軀 (Pure White Jade Rabbit) -->
  <ellipse cx="135" cy="138" rx="36" ry="26" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
  <circle cx="95" cy="142" r="10" fill="#ffffff"/>

  <!-- 向後揚起長萌耳 (Long Ears Flowing in Flight) -->
  <path d="M145 95 C125 65, 95 48, 70 52 C85 70, 115 88, 138 102 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
  <path d="M135 92 C120 72, 100 58, 82 62 C92 74, 115 88, 128 96 Z" fill="#f472b6"/>
  <path d="M162 95 C155 60, 138 38, 115 32 C125 55, 145 78, 158 98 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>

  <!-- 玉兔頭部 (Head) -->
  <circle cx="168" cy="115" r="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
  <circle cx="162" cy="120" r="4.5" fill="#f472b6" opacity="0.6"/>
  <!-- 紅寶石眼 (Ruby Eye) -->
  <circle cx="172" cy="112" r="4.5" fill="#dc2626"/>
  <circle cx="171" cy="110" r="1.5" fill="#ffffff"/>

  <!-- 懷抱金黃中秋月餅 (Golden Mooncake) -->
  <circle cx="192" cy="135" r="16" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
  <circle cx="192" cy="135" r="11" stroke="#fef3c7" stroke-width="1.5" stroke-dasharray="3 2" fill="none"/>
</svg>
`;

// ─────────────────────────────────────────────────────────────
// 14. 10月限定：萬聖魔法南瓜怪 (Halloween Witch Pumpkin)
// 裂嘴歡笑雕刻南瓜、戴紫色巫師尖帽、騎魔帚向前飛衝
// ─────────────────────────────────────────────────────────────
const halloweenPumpkinSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 魔法掃帚 (Magic Broomstick Angled Forward) -->
  <path d="M35 185 L215 110" stroke="#78350f" stroke-width="7" stroke-linecap="round"/>
  <!-- 帚尾草束 (Broom Bristles) -->
  <path d="M42 182 L15 198 L30 180 L10 190 L38 175 Z" fill="#d97706"/>

  <!-- 圓滾大南瓜身 (Carved Jack-o'-Lantern Pumpkin) -->
  <ellipse cx="140" cy="142" rx="42" ry="36" fill="#ea580c"/>
  <ellipse cx="140" cy="142" rx="26" ry="36" fill="#f97316"/>
  <ellipse cx="140" cy="142" rx="12" ry="35" fill="#fb923c"/>

  <!-- 萬聖發光三角雕刻眼 (Carved Glowing Eyes) -->
  <polygon points="125,130 135,130 130,120" fill="#fef08a"/>
  <polygon points="152,130 162,130 157,120" fill="#fef08a"/>

  <!-- 調皮裂嘴大笑 (Carved Grinning Tooth Mouth) -->
  <path d="M122 145 Q142 165 165 145 Q158 152 142 152 Q128 152 122 145 Z" fill="#fef08a"/>
  <rect x="135" y="146" width="4" height="4" fill="#ea580c"/>
  <rect x="148" y="149" width="4" height="3" fill="#ea580c"/>

  <!-- 深紫巫師尖帽 (Purple Witch Hat with Buckle) -->
  <ellipse cx="140" cy="112" rx="42" ry="10" fill="#581c87"/>
  <path d="M120 110 C125 80, 140 60, 168 50 C155 70, 150 95, 155 110 Z" fill="#6b21a8"/>
  <!-- 金色帽帶 (Golden Hat Band) -->
  <path d="M123 108 Q140 114 154 108" stroke="#facc15" stroke-width="4"/>
  <rect x="135" y="105" width="8" height="6" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
</svg>
`;

// ─────────────────────────────────────────────────────────────
// 15. 11月限定：感恩節俏皮火雞 (Thanksgiving Turkey)
// 高頂朝聖黑帽、七彩羽扇尾、雙腿風火輪滑稽前衝
// ─────────────────────────────────────────────────────────────
const harvestTurkeySvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 七彩羽扇尾 (Colorful Tail Fan Feathers) -->
  <path d="M75 145 Q40 100 25 110 Q50 135 80 148 Z" fill="#b91c1c"/>
  <path d="M78 142 Q45 80 35 90 Q60 120 85 142 Z" fill="#ea580c"/>
  <path d="M82 138 Q55 60 48 70 Q70 105 88 136 Z" fill="#eab308"/>
  <path d="M85 135 Q70 45 65 55 Q80 95 92 132 Z" fill="#15803d"/>
  <path d="M88 132 Q90 40 85 50 Q92 90 98 130 Z" fill="#0369a1"/>

  <!-- 雙腿風火輪快跑 (Spinning Runner Legs) -->
  <path d="M110 162 C95 185, 75 198, 65 192 C60 188, 75 175, 95 165 Z" fill="#ea580c"/>
  <path d="M125 162 C145 185, 168 198, 178 192 C182 188, 165 175, 140 165 Z" fill="#ea580c"/>

  <!-- 圓滾火雞身 (Plump Turkey Body) -->
  <ellipse cx="120" cy="142" rx="35" ry="28" fill="#78350f"/>
  <!-- 雙翼後揚 (Flapping Wings) -->
  <path d="M105 135 Q85 125 80 138 Q95 148 112 142 Z" fill="#451a03"/>

  <!-- 火雞脖頸與頭 (Neck & Head) -->
  <path d="M140 138 C155 125, 165 105, 162 92 Z" fill="#78350f"/>
  <circle cx="165" cy="88" r="15" fill="#b91c1c"/>

  <!-- 朝聖者黑高帽 (Pilgrim Top Hat with Buckle) -->
  <rect x="150" y="55" width="28" height="24" fill="#18181b"/>
  <ellipse cx="164" cy="79" rx="20" ry="5" fill="#18181b"/>
  <rect x="150" y="73" width="28" height="4" fill="#facc15"/>
  <rect x="160" y="71" width="8" height="8" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>

  <!-- 金黃鳥喙與紅肉垂 (Beak & Red Wattle) -->
  <polygon points="175,85 192,88 175,94" fill="#facc15"/>
  <path d="M178 88 C185 95, 185 108, 176 108 C172 108, 175 96, 178 88 Z" fill="#dc2626"/>

  <!-- 滑稽大眼 (Funny Eyes) -->
  <circle cx="168" cy="84" r="4.5" fill="#ffffff"/>
  <circle cx="170" cy="84" r="2.5" fill="#1c1917"/>
</svg>
`;

// ─────────────────────────────────────────────────────────────
// 16. 12月限定：聖誕馴鹿雪橇 (Santa & Reindeer Sleigh)
// 紅鼻馴鹿踏空飛馳、拉動紅色禮物雪橇、雪花飛散向前飛翔
// ─────────────────────────────────────────────────────────────
const santaSleighSvg = `
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 聖誕雪橇滑軌 (Curved Golden Sleigh Runners) -->
  <path d="M30 185 C65 188, 110 188, 125 180 C130 176, 125 170, 118 172 C105 176, 65 176, 35 172 Z" fill="#ca8a04"/>
  <path d="M40 172 L45 160 M105 172 L100 160" stroke="#ca8a04" stroke-width="4"/>

  <!-- 鮮紅雪橇車體 (Crimson Sleigh Body) -->
  <path d="M32 160 C55 165, 105 165, 115 150 C118 145, 112 135, 105 138 C90 145, 50 145, 38 135 Z" fill="#dc2626"/>
  <path d="M38 135 Q75 142 110 136" stroke="#facc15" stroke-width="3"/>

  <!-- 滿載禮物包袱 (Gifts Piled in Sleigh) -->
  <rect x="45" y="125" width="20" height="18" fill="#16a34a"/>
  <path d="M55 125 L55 143 M45 134 L65 134" stroke="#facc15" stroke-width="2"/>
  <rect x="68" y="120" width="22" height="22" fill="#eab308"/>
  <path d="M79 120 L79 142 M68 131 L90 131" stroke="#dc2626" stroke-width="2"/>

  <!-- 金色牽引皮繩 (Golden Reins) -->
  <path d="M110 148 Q150 155 185 145" stroke="#facc15" stroke-width="2.5" stroke-dasharray="4 2" fill="none"/>

  <!-- 飛馳紅鼻馴鹿 (Rudolph Reindeer in Mid-Air Gallop) -->
  <ellipse cx="195" cy="142" rx="26" ry="18" fill="#b45309"/>
  <!-- 騰空蹄腿 (Galloping Legs) -->
  <path d="M180 148 L160 175 M210 148 L235 175" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>

  <!-- 雄偉金色鹿角 (Golden Antlers) -->
  <path d="M205 122 C208 102, 212 90, 218 80 M210 98 C218 94, 225 94, 228 98" stroke="#ca8a04" stroke-width="3" stroke-linecap="round"/>

  <!-- 馴鹿首部 (Reindeer Head) -->
  <circle cx="212" cy="130" r="14" fill="#b45309"/>
  <!-- 閃亮大紅鼻 (Glowing Red Nose Rudolph) -->
  <circle cx="226" cy="132" r="5" fill="#ef4444"/>
  <circle cx="225" cy="130" r="1.5" fill="#ffffff"/>
  <!-- 圓大眼 (Friendly Eye) -->
  <circle cx="212" cy="126" r="3.5" fill="#1c1917"/>
  <circle cx="211" cy="124" r="1" fill="#ffffff"/>
</svg>
`;

async function main() {
  console.log('Starting full 16-wildlife picture-book sprite generation...');

  // 4 大常態神獸
  await renderSvgToWebp(cloudedLeopardSvg, 'clouded_leopard.webp');
  await renderSvgToWebp(blackBearSvg, 'black_bear.webp');
  await renderSvgToWebp(wildBoarSvg, 'wild_boar.webp');
  await renderSvgToWebp(sambarDeerSvg, 'sambar_deer.webp');

  // 12 個月份節慶限定 (全新排定，絕不重複，各具文化/節慶與向前動態)
  await renderSvgToWebp(eagleSvg, 'season_01_eagle.webp');
  await renderSvgToWebp(sweetheartBunnySvg, 'season_02_sweetheart.webp');
  await renderSvgToWebp(rukaiSnakeSvg, 'season_03_snake.webp');
  await renderSvgToWebp(easterBunnySvg, 'season_04_bunny.webp');
  await renderSvgToWebp(motherKangarooSvg, 'season_05_mother.webp');
  await renderSvgToWebp(dragonBoatSvg, 'season_06_dragonboat.webp');
  await renderSvgToWebp(flyingSquirrelSvg, 'season_07_squirrel.webp');
  await renderSvgToWebp(rukaiWarriorSvg, 'season_08_warrior.webp');
  await renderSvgToWebp(moonRabbitSvg, 'season_09_moonrabbit.webp');
  await renderSvgToWebp(halloweenPumpkinSvg, 'season_10_pumpkin.webp');
  await renderSvgToWebp(harvestTurkeySvg, 'season_11_turkey.webp');
  await renderSvgToWebp(santaSleighSvg, 'season_12_sleigh.webp');

  console.log('✓ All 16 picture-book sprites generated successfully!');
}

main().catch(err => {
  console.error('Error generating sprites:', err);
  process.exit(1);
});
