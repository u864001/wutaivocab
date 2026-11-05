import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/assets/exam/preA1');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const SVGS = {
  // 1. Apple (蘋果)
  'apple.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Stem & Leaf -->
  <path d="M 100 55 C 100 35, 115 25, 125 22" fill="none" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M 103 40 C 120 30, 138 35, 142 45 C 132 55, 114 52, 103 40 Z" fill="#f1f5f9" stroke="#1e293b" stroke-width="3.5" stroke-linejoin="round"/>
  <!-- Apple Body -->
  <path d="M 100 62 C 85 50, 48 52, 38 85 C 26 122, 45 172, 85 175 C 96 176, 100 170, 100 170 C 100 170, 104 176, 115 175 C 155 172, 174 122, 162 85 C 152 52, 115 50, 100 62 Z" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <!-- Highlight reflection line -->
  <path d="M 55 85 C 48 105, 52 135, 65 145" fill="none" stroke="#64748b" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 4"/>
</svg>`,

  // 2. Banana (香蕉)
  'banana.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Top stem -->
  <rect x="142" y="38" width="14" height="18" rx="3" fill="#cbd5e1" stroke="#1e293b" stroke-width="4" transform="rotate(25 149 47)"/>
  <!-- Banana 1 -->
  <path d="M 148 50 C 120 75, 75 105, 55 145 C 50 155, 45 160, 40 156 C 36 152, 40 142, 48 132 C 72 90, 115 55, 148 50 Z" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <!-- Banana 2 (Curved underneath) -->
  <path d="M 152 56 C 130 90, 95 130, 60 162 C 54 168, 48 168, 44 162 C 40 156, 45 150, 52 142 C 85 105, 122 68, 152 56 Z" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <!-- Ridge line -->
  <path d="M 142 65 C 115 98, 85 130, 56 155" fill="none" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
  <!-- Tip -->
  <circle cx="43" cy="160" r="3" fill="#1e293b"/>
</svg>`,

  // 3. Orange (柳橙)
  'orange.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Stem & Leaf -->
  <path d="M 100 45 C 98 28, 106 20, 112 18" fill="none" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M 105 32 C 120 22, 140 28, 145 38 C 132 46, 115 42, 105 32 Z" fill="#f1f5f9" stroke="#1e293b" stroke-width="3.5" stroke-linejoin="round"/>
  <!-- Main orange circle -->
  <circle cx="100" cy="110" r="65" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <!-- Dimple texture -->
  <circle cx="100" cy="46" r="3" fill="#1e293b"/>
  <!-- Stippling dots -->
  <circle cx="65" cy="120" r="2" fill="#94a3b8"/>
  <circle cx="75" cy="140" r="2" fill="#94a3b8"/>
  <circle cx="135" cy="125" r="2" fill="#94a3b8"/>
  <circle cx="120" cy="150" r="2" fill="#94a3b8"/>
  <path d="M 60 90 C 50 110, 52 135, 68 155" fill="none" stroke="#64748b" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 6"/>
</svg>`,

  // 4. Grape (葡萄)
  'grape.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Stem & Vine curl -->
  <path d="M 100 50 C 98 32, 108 22, 115 20" fill="none" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
  <path d="M 108 30 C 130 25, 145 35, 140 45 C 135 55, 120 45, 125 35" fill="none" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
  <!-- Grapes cluster circles -->
  <circle cx="78" cy="75" r="18" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <circle cx="102" cy="72" r="18" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <circle cx="126" cy="77" r="18" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <circle cx="68" cy="104" r="18" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <circle cx="92" cy="100" r="18" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <circle cx="116" cy="102" r="18" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <circle cx="138" cy="105" r="18" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <circle cx="80" cy="132" r="18" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <circle cx="104" cy="130" r="18" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <circle cx="126" cy="132" r="18" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <circle cx="92" cy="158" r="17" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <circle cx="114" cy="158" r="17" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <circle cx="103" cy="178" r="14" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
</svg>`,

  // 5. Pencil (鉛筆)
  'pencil.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <g transform="rotate(-40 100 100)">
    <!-- Eraser -->
    <rect x="90" y="25" width="20" height="24" rx="4" fill="#f1f5f9" stroke="#1e293b" stroke-width="4"/>
    <!-- Metal band -->
    <rect x="88" y="49" width="24" height="12" fill="#cbd5e1" stroke="#1e293b" stroke-width="3"/>
    <!-- Pencil body -->
    <rect x="90" y="61" width="20" height="90" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
    <line x1="97" y1="61" x2="97" y2="151" stroke="#1e293b" stroke-width="2.5"/>
    <line x1="103" y1="61" x2="103" y2="151" stroke="#1e293b" stroke-width="2.5"/>
    <!-- Sharpened wood tip -->
    <polygon points="90,151 110,151 100,180" fill="#ffffff" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
    <!-- Graphite lead -->
    <polygon points="96,168 104,168 100,180" fill="#1e293b"/>
  </g>
</svg>`,

  // 6. Ruler (直尺)
  'ruler.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <g transform="rotate(-30 100 100)">
    <!-- Ruler body -->
    <rect x="30" y="80" width="140" height="40" rx="3" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
    <!-- Measurement ticks -->
    <line x1="42" y1="80" x2="42" y2="98" stroke="#1e293b" stroke-width="3"/>
    <line x1="52" y1="80" x2="52" y2="90" stroke="#1e293b" stroke-width="2"/>
    <line x1="62" y1="80" x2="62" y2="98" stroke="#1e293b" stroke-width="3"/>
    <line x1="72" y1="80" x2="72" y2="90" stroke="#1e293b" stroke-width="2"/>
    <line x1="82" y1="80" x2="82" y2="98" stroke="#1e293b" stroke-width="3"/>
    <line x1="92" y1="80" x2="92" y2="90" stroke="#1e293b" stroke-width="2"/>
    <line x1="102" y1="80" x2="102" y2="98" stroke="#1e293b" stroke-width="3"/>
    <line x1="112" y1="80" x2="112" y2="90" stroke="#1e293b" stroke-width="2"/>
    <line x1="122" y1="80" x2="122" y2="98" stroke="#1e293b" stroke-width="3"/>
    <line x1="132" y1="80" x2="132" y2="90" stroke="#1e293b" stroke-width="2"/>
    <line x1="142" y1="80" x2="142" y2="98" stroke="#1e293b" stroke-width="3"/>
    <line x1="152" y1="80" x2="152" y2="90" stroke="#1e293b" stroke-width="2"/>
  </g>
</svg>`,

  // 7. Book (書本)
  'book.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Open book cover & pages -->
  <path d="M 100 155 C 80 148, 50 146, 30 156 L 30 65 C 50 55, 80 57, 100 65 C 120 57, 150 55, 170 65 L 170 156 C 150 146, 120 148, 100 155 Z" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <!-- Center spine line -->
  <line x1="100" y1="65" x2="100" y2="155" stroke="#1e293b" stroke-width="4"/>
  <!-- Left page lines -->
  <line x1="45" y1="85" x2="85" y2="87" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
  <line x1="45" y1="105" x2="85" y2="107" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
  <line x1="45" y1="125" x2="75" y2="127" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
  <!-- Right page lines -->
  <line x1="115" y1="87" x2="155" y2="85" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
  <line x1="115" y1="107" x2="155" y2="105" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
  <line x1="115" y1="127" x2="145" y2="125" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  // 8. Scissors (剪刀)
  'scissors.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Blades crossed -->
  <path d="M 68 152 L 135 48 C 138 42, 145 42, 146 48 L 115 105" fill="none" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="M 132 152 L 65 48 C 62 42, 55 42, 54 48 L 85 105" fill="none" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/>
  <!-- Center rivet -->
  <circle cx="100" cy="100" r="5" fill="#1e293b"/>
  <!-- Handles -->
  <circle cx="62" cy="158" r="18" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <circle cx="62" cy="158" r="9" fill="#f8fafc" stroke="#1e293b" stroke-width="3"/>
  <circle cx="138" cy="158" r="18" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <circle cx="138" cy="158" r="9" fill="#f8fafc" stroke="#1e293b" stroke-width="3"/>
</svg>`,

  // 9. Cat (小貓咪)
  'cat.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Cat Body -->
  <ellipse cx="100" cy="138" rx="42" ry="34" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <!-- Cat Head -->
  <circle cx="100" cy="85" r="35" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <!-- Ears -->
  <polygon points="72,65 65,30 90,54" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <polygon points="128,65 135,30 110,54" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <!-- Eyes -->
  <ellipse cx="88" cy="82" rx="4" ry="6" fill="#1e293b"/>
  <ellipse cx="112" cy="82" rx="4" ry="6" fill="#1e293b"/>
  <!-- Nose & Mouth -->
  <polygon points="98,92 102,92 100,95" fill="#1e293b"/>
  <path d="M 96 97 Q 100 102 104 97" fill="none" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
  <!-- Whiskers -->
  <line x1="65" y1="88" x2="82" y2="92" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="63" y1="98" x2="82" y2="97" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="135" y1="88" x2="118" y2="92" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="137" y1="98" x2="118" y2="97" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Tail -->
  <path d="M 140 148 C 165 145, 172 120, 160 105" fill="none" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"/>
  <!-- Paws -->
  <ellipse cx="88" cy="168" rx="9" ry="6" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <ellipse cx="112" cy="168" rx="9" ry="6" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
</svg>`,

  // 10. Dog (小狗)
  'dog.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Body -->
  <ellipse cx="105" cy="138" rx="42" ry="32" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <!-- Head -->
  <circle cx="82" cy="85" r="32" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <!-- Floppy Ears -->
  <path d="M 60 70 C 45 75, 45 105, 58 115 C 65 110, 68 85, 65 72 Z" fill="#f1f5f9" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
  <!-- Eyes -->
  <circle cx="76" cy="80" r="4.5" fill="#1e293b"/>
  <circle cx="96" cy="80" r="4.5" fill="#1e293b"/>
  <!-- Snout / Nose -->
  <ellipse cx="86" cy="95" rx="14" ry="10" fill="#ffffff" stroke="#1e293b" stroke-width="3.5"/>
  <ellipse cx="86" cy="92" rx="5" ry="3.5" fill="#1e293b"/>
  <path d="M 86 96 L 86 101" stroke="#1e293b" stroke-width="3"/>
  <path d="M 82 101 Q 86 104 90 101" fill="none" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
  <!-- Tail wagging -->
  <path d="M 145 132 C 165 125, 172 105, 168 95" fill="none" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"/>
  <!-- Legs -->
  <rect x="74" y="158" width="14" height="18" rx="6" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <rect x="114" y="158" width="14" height="18" rx="6" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
</svg>`,

  // 11. Pig (小豬)
  'pig.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Body -->
  <ellipse cx="100" cy="115" rx="52" ry="42" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <!-- Ears -->
  <polygon points="62,80 50,55 78,65" fill="#ffffff" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
  <polygon points="138,80 150,55 122,65" fill="#ffffff" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
  <!-- Eyes -->
  <circle cx="82" cy="100" r="4.5" fill="#1e293b"/>
  <circle cx="118" cy="100" r="4.5" fill="#1e293b"/>
  <!-- Snout -->
  <ellipse cx="100" cy="118" rx="18" ry="13" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <ellipse cx="94" cy="118" rx="3.5" ry="5" fill="#1e293b"/>
  <ellipse cx="106" cy="118" rx="3.5" ry="5" fill="#1e293b"/>
  <!-- Curly tail -->
  <path d="M 152 118 C 168 112, 172 128, 162 132 C 158 134, 166 142, 172 136" fill="none" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
  <!-- Trotter Feet -->
  <rect x="74" y="150" width="16" height="18" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <rect x="110" y="150" width="16" height="18" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
</svg>`,

  // 12. Bird (小鳥)
  'bird.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Body & Head in one smooth outline -->
  <path d="M 65 95 C 65 72, 85 58, 105 58 C 122 58, 138 72, 142 92 C 145 110, 138 138, 108 142 C 85 145, 65 128, 65 95 Z" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <!-- Beak -->
  <polygon points="140,82 165,88 138,95" fill="#ffffff" stroke="#1e293b" stroke-width="3.5" stroke-linejoin="round"/>
  <!-- Eye -->
  <circle cx="120" cy="80" r="4.5" fill="#1e293b"/>
  <circle cx="122" cy="78" r="1.5" fill="#ffffff"/>
  <!-- Wing -->
  <path d="M 98 95 C 80 95, 72 115, 88 128 C 105 130, 115 115, 115 102 C 115 95, 108 95, 98 95 Z" fill="#f8fafc" stroke="#1e293b" stroke-width="3.5"/>
  <!-- Tail feathers -->
  <polygon points="68,125 35,145 42,128 32,122 68,110" fill="#ffffff" stroke="#1e293b" stroke-width="3.5" stroke-linejoin="round"/>
  <!-- Legs / Branch -->
  <line x1="95" y1="142" x2="95" y2="165" stroke="#1e293b" stroke-width="3.5"/>
  <line x1="110" y1="142" x2="110" y2="165" stroke="#1e293b" stroke-width="3.5"/>
  <line x1="30" y1="168" x2="170" y2="168" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
</svg>`,

  // 13. Umbrella (雨傘)
  'umbrella.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Top ferrule -->
  <line x1="100" y1="35" x2="100" y2="48" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"/>
  <!-- Umbrella Canopy Dome -->
  <path d="M 32 115 C 32 60, 168 60, 168 115 C 150 108, 132 108, 122 115 C 112 108, 88 108, 78 115 C 68 108, 50 108, 32 115 Z" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <!-- Canopy Rib Lines -->
  <path d="M 100 48 C 88 75, 78 98, 78 115" fill="none" stroke="#1e293b" stroke-width="3"/>
  <path d="M 100 48 C 112 75, 122 98, 122 115" fill="none" stroke="#1e293b" stroke-width="3"/>
  <!-- Shaft and J-Handle -->
  <path d="M 100 112 L 100 160 C 100 172, 85 174, 82 165" fill="none" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"/>
  <!-- Raindrops -->
  <path d="M 45 42 Q 43 48 45 50 Q 47 48 45 42 Z" fill="#1e293b"/>
  <path d="M 155 42 Q 153 48 155 50 Q 157 48 155 42 Z" fill="#1e293b"/>
</svg>`,

  // 14. Cap (帽子)
  'cap.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Dome of baseball cap -->
  <path d="M 50 135 C 50 75, 140 75, 145 135 Z" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <!-- Curved visor / brim -->
  <path d="M 135 135 C 155 134, 182 142, 178 152 C 152 156, 125 152, 50 135" fill="#f1f5f9" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <!-- Top button -->
  <ellipse cx="98" cy="74" rx="6" ry="3.5" fill="#1e293b"/>
  <!-- Seam lines -->
  <path d="M 98 76 C 98 95, 98 120, 98 135" stroke="#1e293b" stroke-width="3"/>
  <path d="M 98 76 C 80 95, 68 115, 62 135" stroke="#1e293b" stroke-width="2.5"/>
  <path d="M 98 76 C 118 95, 130 115, 136 135" stroke="#1e293b" stroke-width="2.5"/>
</svg>`,

  // 15. Shoe (鞋子 / 球鞋)
  'shoe.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Sneaker body outline -->
  <path d="M 45 92 L 72 92 C 78 108, 92 118, 122 122 L 158 128 C 168 132, 170 148, 155 152 L 40 152 C 34 152, 34 105, 45 92 Z" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <!-- Sole bottom -->
  <rect x="35" y="152" width="130" height="14" rx="4" fill="#cbd5e1" stroke="#1e293b" stroke-width="4"/>
  <line x1="35" y1="160" x2="165" y2="160" stroke="#1e293b" stroke-width="2.5"/>
  <!-- Toe cap -->
  <path d="M 135 125 C 145 130, 155 138, 155 152" fill="none" stroke="#1e293b" stroke-width="3"/>
  <!-- Laces -->
  <line x1="78" y1="108" x2="95" y2="114" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="84" y1="116" x2="102" y2="122" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="92" y1="125" x2="110" y2="130" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
</svg>`,

  // 16. Jacket (外套)
  'jacket.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Collar -->
  <path d="M 82 45 L 100 62 L 118 45" fill="none" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
  <!-- Sleeves & Main torso -->
  <path d="M 82 45 L 45 75 L 56 125 L 72 118 L 72 165 L 128 165 L 128 118 L 144 125 L 155 75 L 118 45 Z" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <!-- Center Zipper line -->
  <line x1="100" y1="62" x2="100" y2="165" stroke="#1e293b" stroke-width="3.5" stroke-dasharray="4 2"/>
  <!-- Zipper pull -->
  <circle cx="100" cy="72" r="3.5" fill="#1e293b"/>
  <!-- Pockets -->
  <line x1="78" y1="135" x2="92" y2="135" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
  <line x1="108" y1="135" x2="122" y2="135" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  // 17. Bicycle (腳踏車)
  'bicycle.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Wheels -->
  <circle cx="55" cy="142" r="30" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <circle cx="55" cy="142" r="6" fill="#1e293b"/>
  <circle cx="145" cy="142" r="30" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <circle cx="145" cy="142" r="6" fill="#1e293b"/>
  <!-- Spokes -->
  <line x1="55" y1="112" x2="55" y2="172" stroke="#64748b" stroke-width="1.5"/>
  <line x1="25" y1="142" x2="85" y2="142" stroke="#64748b" stroke-width="1.5"/>
  <line x1="145" y1="112" x2="145" y2="172" stroke="#64748b" stroke-width="1.5"/>
  <line x1="115" y1="142" x2="175" y2="142" stroke="#64748b" stroke-width="1.5"/>
  <!-- Frame Diamond -->
  <polyline points="55,142 90,142 125,98 90,98 55,142" fill="none" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <line x1="90" y1="142" x2="90" y2="90" stroke="#1e293b" stroke-width="4.5"/>
  <!-- Handlebars -->
  <polyline points="145,142 128,85 138,82" fill="none" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Seat / Saddle -->
  <line x1="82" y1="88" x2="102" y2="88" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
  <!-- Pedals -->
  <circle cx="90" cy="142" r="5" fill="#1e293b"/>
</svg>`,

  // 18. Library (圖書館 - 純書本圖騰，移除文字)
  'library.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Triangular Roof Pediment -->
  <polygon points="100,28 28,70 172,70" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <!-- Open Book Emblem on Pediment (純書本圖案，徹底移除文字洩題) -->
  <path d="M 100,43 Q 89,39 78,42 L 78,61 Q 89,58 100,62 Z" fill="#f8fafc" stroke="#1e293b" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M 100,43 Q 111,39 122,42 L 122,61 Q 111,58 100,62 Z" fill="#f8fafc" stroke="#1e293b" stroke-width="2.5" stroke-linejoin="round"/>
  <line x1="100" y1="43" x2="100" y2="62" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="83" y1="48" x2="95" y2="47" stroke="#475569" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="83" y1="54" x2="95" y2="53" stroke="#475569" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="105" y1="47" x2="117" y2="48" stroke="#475569" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="105" y1="53" x2="117" y2="54" stroke="#475569" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Architrave below pediment -->
  <rect x="26" y="70" width="148" height="10" fill="#f8fafc" stroke="#1e293b" stroke-width="3.5"/>
  <!-- Base steps -->
  <rect x="24" y="160" width="152" height="14" fill="#f8fafc" stroke="#1e293b" stroke-width="4"/>
  <line x1="16" y1="174" x2="184" y2="174" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
  <!-- Columns -->
  <rect x="38" y="80" width="18" height="80" fill="#ffffff" stroke="#1e293b" stroke-width="3.5"/>
  <rect x="70" y="80" width="18" height="80" fill="#ffffff" stroke="#1e293b" stroke-width="3.5"/>
  <rect x="112" y="80" width="18" height="80" fill="#ffffff" stroke="#1e293b" stroke-width="3.5"/>
  <rect x="144" y="80" width="18" height="80" fill="#ffffff" stroke="#1e293b" stroke-width="3.5"/>
  <!-- Central Arched Entrance -->
  <path d="M 90,160 L 90,118 Q 100,105 110,118 L 110,160 Z" fill="#e2e8f0" stroke="#1e293b" stroke-width="3"/>
  <line x1="100" y1="109" x2="100" y2="160" stroke="#1e293b" stroke-width="2"/>
  <rect x="43" y="96" width="8" height="44" fill="#f1f5f9" stroke="#1e293b" stroke-width="1.5"/>
  <rect x="149" y="96" width="8" height="44" fill="#f1f5f9" stroke="#1e293b" stroke-width="1.5"/>
</svg>`,

  // 19. Zoo (動物園)
  'zoo.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Zoo Entrance Arch -->
  <path d="M 40 170 L 40 85 C 40 45, 160 45, 160 85 L 160 170" fill="none" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
  <!-- Signboard on top -->
  <rect x="65" y="42" width="70" height="26" rx="5" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <text x="100" y="61" font-family="sans-serif" font-weight="900" font-size="18" text-anchor="middle" fill="#1e293b">ZOO</text>
  <!-- Gate bars -->
  <line x1="60" y1="95" x2="60" y2="170" stroke="#1e293b" stroke-width="3"/>
  <line x1="80" y1="85" x2="80" y2="170" stroke="#1e293b" stroke-width="3"/>
  <line x1="120" y1="85" x2="120" y2="170" stroke="#1e293b" stroke-width="3"/>
  <line x1="140" y1="95" x2="140" y2="170" stroke="#1e293b" stroke-width="3"/>
  <!-- Small cute animal silhouette inside gate -->
  <circle cx="100" cy="148" r="14" fill="#1e293b"/>
  <circle cx="92" cy="136" r="4.5" fill="#1e293b"/>
  <circle cx="108" cy="136" r="4.5" fill="#1e293b"/>
</svg>`,

  // 20. Playground / Running track (操場 / 運動場)
  'playground.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Stadium / Track outer oval -->
  <ellipse cx="100" cy="115" rx="75" ry="48" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <!-- Inner running lane -->
  <ellipse cx="100" cy="115" rx="55" ry="34" fill="#ffffff" stroke="#1e293b" stroke-width="3.5" stroke-dasharray="6 4"/>
  <!-- Center grass pitch / soccer markings -->
  <ellipse cx="100" cy="115" rx="35" ry="20" fill="#f8fafc" stroke="#1e293b" stroke-width="2.5"/>
  <line x1="100" y1="95" x2="100" y2="135" stroke="#1e293b" stroke-width="2.5"/>
  <!-- Running stick figure -->
  <circle cx="100" cy="48" r="7" fill="#1e293b"/>
  <line x1="100" y1="55" x2="100" y2="72" stroke="#1e293b" stroke-width="3.5"/>
  <line x1="90" y1="62" x2="112" y2="58" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
  <polyline points="92,85 100,72 108,82 116,92" fill="none" stroke="#1e293b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,

  // 21. Restaurant (餐廳)
  'restaurant.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Awning (篷子) -->
  <path d="M 35 65 L 165 65 L 155 90 L 45 90 Z" fill="#ffffff" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
  <line x1="65" y1="65" x2="65" y2="90" stroke="#1e293b" stroke-width="3"/>
  <line x1="95" y1="65" x2="95" y2="90" stroke="#1e293b" stroke-width="3"/>
  <line x1="125" y1="65" x2="125" y2="90" stroke="#1e293b" stroke-width="3"/>
  <!-- Building Body -->
  <rect x="45" y="90" width="110" height="78" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <!-- Sign with Fork and Knife -->
  <rect x="68" y="35" width="64" height="24" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="3.5"/>
  <text x="100" y="52" font-family="sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#1e293b">CAFE</text>
  <!-- Fork and Knife on window -->
  <line x1="72" y1="112" x2="72" y2="140" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
  <path d="M 68 112 L 76 112 L 72 122 Z" fill="#1e293b"/>
  <line x1="84" y1="112" x2="84" y2="140" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
  <path d="M 84 112 C 89 112, 89 124, 84 126" fill="none" stroke="#1e293b" stroke-width="3"/>
  <!-- Door -->
  <rect x="105" y="112" width="38" height="56" fill="#cbd5e1" stroke="#1e293b" stroke-width="3"/>
  <circle cx="112" cy="140" r="2.5" fill="#1e293b"/>
</svg>`,

  // 22. Exit Sign (緊急出口告示牌)
  'exit_sign.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Sign Outer Box -->
  <rect x="25" y="55" width="150" height="90" rx="8" fill="#ffffff" stroke="#1e293b" stroke-width="5"/>
  <!-- Inner border -->
  <rect x="33" y="63" width="134" height="74" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="2.5"/>
  <!-- Running figure through open door -->
  <rect x="45" y="73" width="22" height="54" fill="#cbd5e1" stroke="#1e293b" stroke-width="3"/>
  <circle cx="56" cy="85" r="5" fill="#1e293b"/>
  <!-- Running person -->
  <circle cx="68" cy="88" r="4.5" fill="#1e293b"/>
  <line x1="68" y1="93" x2="65" y2="108" stroke="#1e293b" stroke-width="3"/>
  <line x1="65" y1="108" x2="58" y2="120" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
  <line x1="65" y1="108" x2="74" y2="118" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
  <!-- Text EXIT -->
  <text x="120" y="112" font-family="sans-serif" font-weight="900" font-size="30" letter-spacing="2" text-anchor="middle" fill="#1e293b">EXIT</text>
</svg>`,

  // 23. Rainy Girl with Umbrella (下雨天撐傘小女孩)
  'rainy_girl.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Raindrops in sky -->
  <line x1="45" y1="25" x2="35" y2="45" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="85" y1="20" x2="75" y2="40" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="155" y1="25" x2="145" y2="45" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="175" y1="65" x2="165" y2="85" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="30" y1="85" x2="20" y2="105" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Umbrella Canopy -->
  <path d="M 45 78 C 45 32, 155 32, 155 78 C 140 72, 122 72, 115 78 C 105 72, 85 72, 78 78 C 68 72, 52 72, 45 78 Z" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <path d="M 100 35 C 90 55, 78 68, 78 78" fill="none" stroke="#1e293b" stroke-width="3"/>
  <path d="M 100 35 C 110 55, 115 68, 115 78" fill="none" stroke="#1e293b" stroke-width="3"/>
  <!-- Girl Head -->
  <circle cx="100" cy="100" r="16" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <!-- Pigtails -->
  <path d="M 85 96 C 75 92, 72 108, 80 112" fill="none" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M 115 96 C 125 92, 128 108, 120 112" fill="none" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
  <!-- Eyes & Smile -->
  <circle cx="95" cy="98" r="2.5" fill="#1e293b"/>
  <circle cx="105" cy="98" r="2.5" fill="#1e293b"/>
  <path d="M 97 105 Q 100 108 103 105" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Umbrella Handle held by hand -->
  <line x1="100" y1="78" x2="100" y2="125" stroke="#1e293b" stroke-width="4"/>
  <!-- Raincoat Body (Triangle) -->
  <polygon points="100,116 80,158 120,158" fill="#ffffff" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
  <!-- Rain Boots -->
  <rect x="84" y="158" width="10" height="18" rx="3" fill="#cbd5e1" stroke="#1e293b" stroke-width="3.5"/>
  <rect x="106" y="158" width="10" height="18" rx="3" fill="#cbd5e1" stroke="#1e293b" stroke-width="3.5"/>
  <!-- Water Puddle -->
  <ellipse cx="100" cy="178" rx="45" ry="8" fill="none" stroke="#1e293b" stroke-width="3.5"/>
</svg>`
};

for (const [filename, content] of Object.entries(SVGS)) {
  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, content.trim(), 'utf-8');
}

console.log(`Successfully generated ${Object.keys(SVGS).length} high-standard black-and-white line-art SVG files in ${outDir}`);
