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
,

  // 24. Eraser (橡皮擦)
  'eraser.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Eraser Sleeve (Cardboard) -->
  <polygon points="65,115 125,75 165,100 105,140" fill="#cbd5e1" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
  <!-- Sleeve decoration band -->
  <polygon points="80,105 115,82 135,95 100,118" fill="#94a3b8" stroke="#1e293b" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- Rubber Exposed Head -->
  <polygon points="35,135 65,115 105,140 75,160" fill="#ffffff" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
  <!-- Beveled Tip -->
  <polygon points="35,135 75,160 55,165 20,140" fill="#f8fafc" stroke="#1e293b" stroke-width="3.5" stroke-linejoin="round"/>
  <!-- Eraser Back -->
  <polygon points="125,75 165,100 175,92 135,68" fill="#f1f5f9" stroke="#1e293b" stroke-width="3.5" stroke-linejoin="round"/>
</svg>`,

  // 25. Backpack / School Bag (書包)
  'bag.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Top Handle -->
  <path d="M 85 45 C 85 30, 115 30, 115 45" fill="none" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"/>
  <!-- Main Bag Body -->
  <rect x="52" y="45" width="96" height="120" rx="20" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <!-- Front Zipper Pocket -->
  <rect x="62" y="105" width="76" height="52" rx="12" fill="#f8fafc" stroke="#1e293b" stroke-width="3.5"/>
  <!-- Zipper Lines -->
  <path d="M 66 118 L 134 118" stroke="#1e293b" stroke-width="2.5" stroke-dasharray="4 3"/>
  <circle cx="100" cy="118" r="3.5" fill="#1e293b"/>
  <!-- Side Drink Pockets -->
  <rect x="42" y="100" width="10" height="42" rx="4" fill="#e2e8f0" stroke="#1e293b" stroke-width="3"/>
  <rect x="148" y="100" width="10" height="42" rx="4" fill="#e2e8f0" stroke="#1e293b" stroke-width="3"/>
  <!-- Shoulder Straps Outline at Top -->
  <path d="M 68 46 C 58 35, 48 55, 52 75" fill="none" stroke="#1e293b" stroke-width="3.5"/>
  <path d="M 132 46 C 142 35, 152 55, 148 75" fill="none" stroke="#1e293b" stroke-width="3.5"/>
</svg>`,

  // 26. Desk (課桌)
  'desk.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Table Top (Perspective) -->
  <polygon points="30,75 140,75 170,105 50,105" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <polygon points="50,105 170,105 170,113 50,113" fill="#cbd5e1" stroke="#1e293b" stroke-width="3.5" stroke-linejoin="round"/>
  <!-- Drawer Box below top -->
  <rect x="58" y="113" width="94" height="20" fill="#f8fafc" stroke="#1e293b" stroke-width="3.5"/>
  <circle cx="105" cy="123" r="3" fill="#1e293b"/>
  <!-- 4 Metal Legs -->
  <line x1="56" y1="113" x2="48" y2="175" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
  <line x1="72" y1="105" x2="68" y2="155" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="152" y1="113" x2="148" y2="175" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
  <line x1="165" y1="105" x2="162" y2="155" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
  <!-- Leg Stretcher Bar -->
  <line x1="50" y1="158" x2="149" y2="158" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  // 27. Chair (椅子)
  'chair.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Chair Backrest -->
  <rect x="68" y="35" width="64" height="40" rx="6" fill="#f8fafc" stroke="#1e293b" stroke-width="4"/>
  <line x1="84" y1="35" x2="84" y2="75" stroke="#1e293b" stroke-width="2.5"/>
  <line x1="100" y1="35" x2="100" y2="75" stroke="#1e293b" stroke-width="2.5"/>
  <line x1="116" y1="35" x2="116" y2="75" stroke="#1e293b" stroke-width="2.5"/>
  <!-- Back Uprights -->
  <line x1="74" y1="75" x2="74" y2="110" stroke="#1e293b" stroke-width="4"/>
  <line x1="126" y1="75" x2="126" y2="110" stroke="#1e293b" stroke-width="4"/>
  <!-- Seat Cushion (Perspective) -->
  <polygon points="62,110 138,110 148,130 52,130" fill="#ffffff" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
  <polygon points="52,130 148,130 148,136 52,136" fill="#cbd5e1" stroke="#1e293b" stroke-width="3" stroke-linejoin="round"/>
  <!-- 4 Legs -->
  <line x1="58" y1="136" x2="52" y2="175" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
  <line x1="142" y1="136" x2="148" y2="175" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
  <line x1="72" y1="130" x2="68" y2="165" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
  <line x1="130" y1="130" x2="134" y2="165" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  // 28. Pen (原子筆)
  'pen.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Pen Cap with Clip (Diagonal) -->
  <g transform="rotate(-40 100 100)">
    <!-- Pen Barrel -->
    <rect x="92" y="70" width="16" height="85" rx="3" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
    <!-- Grip section -->
    <rect x="92" y="125" width="16" height="20" fill="#e2e8f0" stroke="#1e293b" stroke-width="3"/>
    <!-- Pen Tip -->
    <polygon points="92,155 108,155 100,175" fill="#cbd5e1" stroke="#1e293b" stroke-width="3.5" stroke-linejoin="round"/>
    <circle cx="100" cy="176" r="2" fill="#1e293b"/>
    <!-- Pen Cap on Top -->
    <rect x="90" y="32" width="20" height="42" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="4"/>
    <!-- Clip -->
    <path d="M 110 40 L 116 40 L 116 65 L 110 65" fill="#cbd5e1" stroke="#1e293b" stroke-width="3" stroke-linejoin="round"/>
  </g>
</svg>`,

  // 29. Birthday Cake (蛋糕)
  'cake.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Plate -->
  <ellipse cx="100" cy="172" rx="72" ry="12" fill="#f1f5f9" stroke="#1e293b" stroke-width="4"/>
  <!-- Bottom Tier -->
  <rect x="42" y="112" width="116" height="50" rx="8" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <!-- Frosting Drippings on Bottom Tier -->
  <path d="M 42 124 Q 56 136 71 124 Q 86 136 100 124 Q 115 136 129 124 Q 144 136 158 124" fill="none" stroke="#1e293b" stroke-width="3"/>
  <!-- Top Tier -->
  <rect x="62" y="78" width="76" height="34" rx="6" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <path d="M 62 88 Q 74 96 87 88 Q 100 96 113 88 Q 126 96 138 88" fill="none" stroke="#1e293b" stroke-width="2.5"/>
  <!-- 3 Candles -->
  <rect x="78" y="52" width="6" height="26" fill="#cbd5e1" stroke="#1e293b" stroke-width="2"/>
  <rect x="97" y="48" width="6" height="30" fill="#cbd5e1" stroke="#1e293b" stroke-width="2"/>
  <rect x="116" y="52" width="6" height="26" fill="#cbd5e1" stroke="#1e293b" stroke-width="2"/>
  <!-- Candle Flames -->
  <path d="M 81 44 C 76 48, 86 48, 81 52 C 78 48, 84 48, 81 44 Z" fill="#1e293b"/>
  <path d="M 100 40 C 95 44, 105 44, 100 48 C 97 44, 103 44, 100 40 Z" fill="#1e293b"/>
  <path d="M 119 44 C 114 48, 124 48, 119 52 C 116 48, 122 48, 119 44 Z" fill="#1e293b"/>
</svg>`,

  // 30. Milk Carton & Glass (牛奶)
  'milk.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Milk Carton Gable Top -->
  <polygon points="45,65 95,65 85,42 55,42" fill="#f8fafc" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
  <line x1="70" y1="42" x2="70" y2="34" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
  <!-- Milk Carton Body -->
  <rect x="42" y="65" width="56" height="105" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <!-- Carton Drop Emblem -->
  <path d="M 70 95 C 62 108, 62 118, 70 120 C 78 118, 78 108, 70 95 Z" fill="#cbd5e1" stroke="#1e293b" stroke-width="3"/>
  <!-- Glass of Milk beside -->
  <polygon points="120,95 160,95 152,168 128,168" fill="#ffffff" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
  <!-- Milk level inside glass -->
  <polygon points="122,110 158,110 151,165 129,165" fill="#f1f5f9" stroke="#1e293b" stroke-width="2" stroke-dasharray="3 3"/>
  <!-- Straw -->
  <line x1="145" y1="80" x2="135" y2="155" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="145" y1="80" x2="160" y2="68" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
</svg>`,

  // 31. Egg (雞蛋)
  'egg.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Whole Egg (Back) -->
  <path d="M 68 155 C 45 155, 38 105, 58 75 C 72 52, 92 52, 102 75 C 118 105, 105 155, 68 155 Z" fill="#f8fafc" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
  <!-- Fried Egg / Sunny Side Up (Front) -->
  <path d="M 125 105 C 145 95, 175 105, 172 130 C 170 155, 145 168, 120 165 C 95 162, 85 145, 95 125 C 102 110, 115 110, 125 105 Z" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <!-- Egg Yolk in Center -->
  <circle cx="132" cy="135" r="18" fill="#cbd5e1" stroke="#1e293b" stroke-width="3.5"/>
  <ellipse cx="127" cy="130" rx="4" ry="2" fill="#ffffff"/>
</svg>`,

  // 32. Bread (麵包/吐司)
  'bread.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Back Toast Slice -->
  <path d="M 65 65 C 50 65, 48 45, 68 45 C 80 45, 88 52, 100 52 C 112 52, 120 45, 132 45 C 152 45, 150 65, 135 65 L 140 135 L 60 135 Z" fill="#f1f5f9" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
  <!-- Front Toast Slice -->
  <path d="M 75 85 C 60 85, 58 65, 78 65 C 90 65, 98 72, 110 72 C 122 72, 130 65, 142 65 C 162 65, 160 85, 145 85 L 150 155 L 70 155 Z" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <!-- Crust inner border -->
  <path d="M 80 92 C 70 92, 68 76, 82 76 C 92 76, 100 81, 110 81 C 120 81, 128 76, 138 76 C 152 76, 150 92, 140 92 L 143 148 L 77 148 Z" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="4 3"/>
</svg>`,

  // 33. Glass of Water (水杯)
  'water.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Glass Outline -->
  <polygon points="60,45 140,45 125,168 75,168" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <!-- Glass Rim Ellipse -->
  <ellipse cx="100" cy="45" rx="40" ry="8" fill="#f8fafc" stroke="#1e293b" stroke-width="3"/>
  <!-- Water Surface -->
  <path d="M 68 85 Q 85 92 100 85 Q 115 78 132 85" fill="none" stroke="#1e293b" stroke-width="3.5"/>
  <!-- Water body filling -->
  <polygon points="68,85 132,85 123,164 77,164" fill="#f1f5f9" stroke="none"/>
  <!-- Ice Cubes floating -->
  <rect x="78" y="98" width="20" height="20" rx="3" fill="#ffffff" stroke="#1e293b" stroke-width="2.5" transform="rotate(15 88 108)"/>
  <rect x="105" y="112" width="18" height="18" rx="3" fill="#ffffff" stroke="#1e293b" stroke-width="2.5" transform="rotate(-10 114 121)"/>
  <!-- Splash / reflection lines -->
  <line x1="82" y1="140" x2="82" y2="155" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
</svg>`,

  // 34. Cookie (餅乾)
  'cookie.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Round Cookie Body with Bite mark on right -->
  <path d="M 100 35 C 55 35, 35 65, 35 105 C 35 145, 65 170, 105 170 C 145 170, 170 145, 170 110 C 160 112, 148 105, 150 95 C 142 90, 145 78, 158 75 C 158 60, 140 35, 100 35 Z" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <!-- Chocolate Chips -->
  <circle cx="75" cy="75" r="6" fill="#1e293b"/>
  <circle cx="115" cy="65" r="5" fill="#1e293b"/>
  <circle cx="85" cy="115" r="7" fill="#1e293b"/>
  <circle cx="125" cy="125" r="6" fill="#1e293b"/>
  <circle cx="65" cy="140" r="5" fill="#1e293b"/>
  <circle cx="102" cy="148" r="5" fill="#1e293b"/>
  <!-- Crumb details -->
  <circle cx="172" cy="85" r="2.5" fill="#1e293b"/>
  <circle cx="168" cy="100" r="2" fill="#1e293b"/>
</svg>`,

  // 35. Pizza Slice (披薩)
  'pizza.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Pizza Slice Body (Triangle with curved top) -->
  <path d="M 100 172 L 45 60 C 75 45, 125 45, 155 60 Z" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <!-- Pizza Crust Rim -->
  <path d="M 45 60 C 75 45, 125 45, 155 60 C 150 72, 125 60, 100 62 C 75 60, 50 72, 45 60 Z" fill="#cbd5e1" stroke="#1e293b" stroke-width="3.5" stroke-linejoin="round"/>
  <!-- Pepperoni Slices -->
  <circle cx="88" cy="90" r="10" fill="#f1f5f9" stroke="#1e293b" stroke-width="3"/>
  <circle cx="118" cy="105" r="10" fill="#f1f5f9" stroke="#1e293b" stroke-width="3"/>
  <circle cx="98" cy="135" r="8" fill="#f1f5f9" stroke="#1e293b" stroke-width="3"/>
  <!-- Cheese Dripping Line -->
  <path d="M 96 172 Q 100 185 104 172" fill="none" stroke="#1e293b" stroke-width="3"/>
</svg>`,

  // 36. Ice Cream Cone (冰淇淋)
  'ice_cream.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Waffle Cone (Triangle) -->
  <polygon points="100,180 65,105 135,105" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <!-- Waffle Grid Pattern -->
  <line x1="88" y1="105" x2="112" y2="155" stroke="#94a3b8" stroke-width="2.5"/>
  <line x1="112" y1="105" x2="88" y2="155" stroke="#94a3b8" stroke-width="2.5"/>
  <line x1="75" y1="125" x2="115" y2="135" stroke="#94a3b8" stroke-width="2.5"/>
  <!-- Lower Scoop -->
  <circle cx="100" cy="90" r="32" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <!-- Top Scoop -->
  <circle cx="100" cy="55" r="26" fill="#f8fafc" stroke="#1e293b" stroke-width="4"/>
  <!-- Cherry on Top -->
  <circle cx="100" cy="28" r="8" fill="#1e293b"/>
  <path d="M 100 22 C 105 12, 118 10, 122 15" fill="none" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  // 37. Rabbit (兔子)
  'rabbit.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Long Ears -->
  <ellipse cx="80" cy="50" rx="12" ry="38" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" transform="rotate(-10 80 50)"/>
  <ellipse cx="80" cy="50" rx="6" ry="26" fill="#f1f5f9" stroke="#1e293b" stroke-width="2"/>
  <ellipse cx="120" cy="50" rx="12" ry="38" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" transform="rotate(10 120 50)"/>
  <ellipse cx="120" cy="50" rx="6" ry="26" fill="#f1f5f9" stroke="#1e293b" stroke-width="2"/>
  <!-- Head -->
  <ellipse cx="100" cy="115" rx="42" ry="36" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <!-- Eyes -->
  <circle cx="85" cy="110" r="4.5" fill="#1e293b"/>
  <circle cx="115" cy="110" r="4.5" fill="#1e293b"/>
  <!-- Nose & Mouth -->
  <polygon points="100,120 95,126 105,126" fill="#1e293b"/>
  <path d="M 100 126 C 96 132, 90 132, 88 128" fill="none" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
  <path d="M 100 126 C 104 132, 110 132, 112 128" fill="none" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
  <!-- Whiskers -->
  <line x1="65" y1="120" x2="45" y2="116" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="65" y1="126" x2="45" y2="130" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="135" y1="120" x2="155" y2="116" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="135" y1="126" x2="155" y2="130" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Front Paws -->
  <ellipse cx="85" cy="155" rx="12" ry="10" fill="#ffffff" stroke="#1e293b" stroke-width="3.5"/>
  <ellipse cx="115" cy="155" rx="12" ry="10" fill="#ffffff" stroke="#1e293b" stroke-width="3.5"/>
</svg>`,

  // 38. Fish (小魚)
  'fish.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Tail Fin -->
  <polygon points="175,70 175,130 130,100" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <line x1="170" y1="85" x2="140" y2="100" stroke="#1e293b" stroke-width="2.5"/>
  <line x1="170" y1="115" x2="140" y2="100" stroke="#1e293b" stroke-width="2.5"/>
  <!-- Fish Body -->
  <path d="M 45 100 C 65 60, 120 60, 145 100 C 120 140, 65 140, 45 100 Z" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <!-- Dorsal & Ventral Fins -->
  <path d="M 85 70 C 95 50, 115 50, 120 72" fill="#ffffff" stroke="#1e293b" stroke-width="3.5"/>
  <path d="M 95 130 C 105 145, 115 145, 118 128" fill="#ffffff" stroke="#1e293b" stroke-width="3.5"/>
  <!-- Eye -->
  <circle cx="68" cy="94" r="5" fill="#1e293b"/>
  <circle cx="70" cy="92" r="1.5" fill="#ffffff"/>
  <!-- Gill Line -->
  <path d="M 82 82 C 90 92, 90 108, 82 118" fill="none" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
  <!-- Bubbles -->
  <circle cx="32" cy="85" r="4" fill="none" stroke="#1e293b" stroke-width="2.5"/>
  <circle cx="22" cy="72" r="6" fill="none" stroke="#1e293b" stroke-width="2.5"/>
</svg>`,

  // 39. Elephant (大象)
  'elephant.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Main Body -->
  <rect x="75" y="70" width="90" height="75" rx="25" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <!-- 4 Legs -->
  <rect x="85" y="130" width="18" height="42" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <rect x="110" y="130" width="16" height="38" rx="4" fill="#cbd5e1" stroke="#1e293b" stroke-width="3.5"/>
  <rect x="135" y="130" width="18" height="42" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <!-- Head & Trunk -->
  <circle cx="65" cy="95" r="32" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <!-- Trunk curving up -->
  <path d="M 45 105 C 32 115, 25 140, 36 148 C 45 152, 48 135, 42 125 L 50 115" fill="#ffffff" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
  <!-- Big Ear -->
  <path d="M 65 75 C 90 75, 95 125, 70 125 Z" fill="#f8fafc" stroke="#1e293b" stroke-width="3.5"/>
  <!-- Eye -->
  <circle cx="52" cy="88" r="3" fill="#1e293b"/>
  <!-- Small Tail -->
  <path d="M 165 95 C 172 105, 172 115, 168 122" fill="none" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  // 40. Monkey (猴子)
  'monkey.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Big Ears -->
  <circle cx="58" cy="92" r="16" fill="#f8fafc" stroke="#1e293b" stroke-width="4"/>
  <circle cx="142" cy="92" r="16" fill="#f8fafc" stroke="#1e293b" stroke-width="4"/>
  <!-- Head -->
  <circle cx="100" cy="95" r="38" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <!-- Inner Face (Heart/M shape) -->
  <path d="M 100 82 C 90 68, 70 70, 72 90 C 72 112, 100 124, 100 124 C 100 124, 128 112, 128 90 C 130 70, 110 68, 100 82 Z" fill="#f1f5f9" stroke="#1e293b" stroke-width="3"/>
  <!-- Eyes -->
  <circle cx="88" cy="92" r="4" fill="#1e293b"/>
  <circle cx="112" cy="92" r="4" fill="#1e293b"/>
  <!-- Snout & Mouth -->
  <ellipse cx="100" cy="112" rx="14" ry="10" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
  <circle cx="96" cy="110" r="1.5" fill="#1e293b"/>
  <circle cx="104" cy="110" r="1.5" fill="#1e293b"/>
  <path d="M 94 116 Q 100 120 106 116" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Body & Long Curly Tail -->
  <path d="M 85 133 L 75 175 L 125 175 L 115 133" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <path d="M 125 160 C 155 165, 170 140, 155 125 C 145 115, 148 105, 155 105" fill="none" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
</svg>`,

  // 41. Bear (小熊)
  'bear.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Round Ears -->
  <circle cx="68" cy="62" r="16" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <circle cx="68" cy="62" r="8" fill="#cbd5e1"/>
  <circle cx="132" cy="62" r="16" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <circle cx="132" cy="62" r="8" fill="#cbd5e1"/>
  <!-- Head -->
  <circle cx="100" cy="100" r="42" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <!-- Eyes -->
  <circle cx="85" cy="94" r="4" fill="#1e293b"/>
  <circle cx="115" cy="94" r="4" fill="#1e293b"/>
  <!-- Muzzle -->
  <ellipse cx="100" cy="115" rx="18" ry="14" fill="#f8fafc" stroke="#1e293b" stroke-width="3"/>
  <ellipse cx="100" cy="110" rx="6" ry="4" fill="#1e293b"/>
  <path d="M 100 114 L 100 122" stroke="#1e293b" stroke-width="3"/>
  <path d="M 94 121 Q 100 126 106 121" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Body paws -->
  <ellipse cx="75" cy="155" rx="14" ry="18" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <ellipse cx="125" cy="155" rx="14" ry="18" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
</svg>`,

  // 42. Duck (小鴨)
  'duck.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Duck Body -->
  <path d="M 65 110 C 65 80, 110 80, 130 95 C 150 95, 168 110, 162 135 C 155 155, 110 162, 75 155 C 55 150, 48 135, 65 110 Z" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <!-- Duck Head -->
  <circle cx="70" cy="82" r="22" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <!-- Eye -->
  <circle cx="64" cy="78" r="3.5" fill="#1e293b"/>
  <!-- Flat Beak -->
  <path d="M 52 82 C 35 80, 32 90, 50 94 Z" fill="#cbd5e1" stroke="#1e293b" stroke-width="3.5" stroke-linejoin="round"/>
  <!-- Wing -->
  <path d="M 95 115 C 120 112, 135 125, 125 138 C 112 142, 95 132, 95 115 Z" fill="#f8fafc" stroke="#1e293b" stroke-width="3"/>
  <!-- Water Waves -->
  <path d="M 35 165 Q 55 160 75 165 Q 95 170 115 165 Q 135 160 155 165 Q 175 170 185 165" fill="none" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
</svg>`,

  // 43. Car (汽車)
  'car.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Car Roof & Windows -->
  <path d="M 55 105 L 75 65 L 135 65 L 155 105 Z" fill="#f8fafc" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <line x1="105" y1="65" x2="105" y2="105" stroke="#1e293b" stroke-width="3.5"/>
  <!-- Car Body Base -->
  <rect x="30" y="105" width="145" height="38" rx="8" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <!-- Headlights & Taillights -->
  <rect x="26" y="115" width="6" height="12" rx="2" fill="#1e293b"/>
  <rect x="173" y="115" width="6" height="12" rx="2" fill="#1e293b"/>
  <!-- Wheels -->
  <circle cx="65" cy="145" r="18" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <circle cx="65" cy="145" r="7" fill="#cbd5e1" stroke="#1e293b" stroke-width="3"/>
  <circle cx="140" cy="145" r="18" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <circle cx="140" cy="145" r="7" fill="#cbd5e1" stroke="#1e293b" stroke-width="3"/>
</svg>`,

  // 44. Bus (公車/校車)
  'bus.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Bus Main Body -->
  <rect x="30" y="55" width="145" height="92" rx="14" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <!-- Driver windshield -->
  <rect x="38" y="66" width="30" height="32" rx="3" fill="#f1f5f9" stroke="#1e293b" stroke-width="3"/>
  <!-- Passenger Windows -->
  <rect x="76" y="66" width="26" height="32" rx="3" fill="#f1f5f9" stroke="#1e293b" stroke-width="3"/>
  <rect x="110" y="66" width="26" height="32" rx="3" fill="#f1f5f9" stroke="#1e293b" stroke-width="3"/>
  <rect x="144" y="66" width="24" height="32" rx="3" fill="#f1f5f9" stroke="#1e293b" stroke-width="3"/>
  <!-- Passenger Door Line -->
  <rect x="42" y="105" width="22" height="42" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>
  <line x1="53" y1="105" x2="53" y2="147" stroke="#1e293b" stroke-width="2"/>
  <!-- Wheels -->
  <circle cx="68" cy="150" r="16" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <circle cx="68" cy="150" r="6" fill="#1e293b"/>
  <circle cx="145" cy="150" r="16" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <circle cx="145" cy="150" r="6" fill="#1e293b"/>
</svg>`,

  // 45. Train (火車)
  'train.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Chimney & Steam -->
  <rect x="48" y="50" width="16" height="25" fill="#cbd5e1" stroke="#1e293b" stroke-width="3.5"/>
  <ellipse cx="56" cy="35" rx="14" ry="8" fill="#f8fafc" stroke="#1e293b" stroke-width="2.5"/>
  <ellipse cx="68" cy="22" rx="18" ry="10" fill="#f8fafc" stroke="#1e293b" stroke-width="2.5"/>
  <!-- Cabin (Back) -->
  <rect x="100" y="65" width="65" height="75" rx="5" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <rect x="110" y="75" width="22" height="25" fill="#f1f5f9" stroke="#1e293b" stroke-width="3"/>
  <!-- Engine Boiler (Front) -->
  <rect x="35" y="75" width="65" height="65" rx="6" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <!-- Cowcatcher (Front wedge) -->
  <polygon points="35,140 18,155 35,155" fill="#cbd5e1" stroke="#1e293b" stroke-width="3.5" stroke-linejoin="round"/>
  <!-- Wheels -->
  <circle cx="55" cy="152" r="14" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <circle cx="85" cy="152" r="14" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <circle cx="135" cy="152" r="16" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <line x1="55" y1="152" x2="85" y2="152" stroke="#1e293b" stroke-width="3.5"/>
</svg>`,

  // 46. Boat / Sailboat (小帆船)
  'boat.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Mast -->
  <line x1="100" y1="35" x2="100" y2="140" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"/>
  <!-- Big Sail (Right) -->
  <polygon points="105,42 165,128 105,128" fill="#ffffff" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
  <!-- Small Sail (Left) -->
  <polygon points="95,55 50,128 95,128" fill="#f8fafc" stroke="#1e293b" stroke-width="3.5" stroke-linejoin="round"/>
  <!-- Flag on top -->
  <polygon points="100,35 118,40 100,46" fill="#1e293b"/>
  <!-- Boat Hull -->
  <polygon points="35,140 170,140 150,165 55,165" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <!-- Water Wave lines -->
  <path d="M 25 172 Q 45 166 65 172 Q 85 178 105 172 Q 125 166 145 172 Q 165 178 185 172" fill="none" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
</svg>`,

  // 47. Hat (帽子)
  'hat.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Wide Brim -->
  <ellipse cx="100" cy="140" rx="75" ry="22" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <!-- Hat Crown -->
  <path d="M 60 135 C 60 70, 140 70, 140 135" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <!-- Ribbon Band -->
  <path d="M 60 126 C 60 115, 140 115, 140 126 L 140 135 C 140 145, 60 145, 60 135 Z" fill="#cbd5e1" stroke="#1e293b" stroke-width="3"/>
  <!-- Ribbon Bow knot -->
  <circle cx="132" cy="128" r="4" fill="#1e293b"/>
</svg>`,

  // 48. T-Shirt (T恤)
  'tshirt.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- T-shirt Outline -->
  <path d="M 72 45 C 85 55, 115 55, 128 45 L 165 65 L 150 95 L 132 88 L 132 165 L 68 165 L 68 88 L 50 95 L 35 65 Z" fill="#ffffff" stroke="#1e293b" stroke-width="4.5" stroke-linejoin="round"/>
  <!-- Collar Curve -->
  <path d="M 72 45 C 85 62, 115 62, 128 45" fill="none" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
  <!-- Sleeve Stitch Lines -->
  <line x1="56" y1="83" x2="68" y2="88" stroke="#94a3b8" stroke-width="2.5"/>
  <line x1="144" y1="83" x2="132" y2="88" stroke="#94a3b8" stroke-width="2.5"/>
</svg>`,

  // 49. Park (公園)
  'park.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Park Tree (Left) -->
  <rect x="58" y="105" width="12" height="55" fill="#cbd5e1" stroke="#1e293b" stroke-width="3.5"/>
  <circle cx="64" cy="80" r="32" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <circle cx="48" cy="72" r="18" fill="#f8fafc" stroke="#1e293b" stroke-width="3"/>
  <circle cx="80" cy="72" r="18" fill="#f8fafc" stroke="#1e293b" stroke-width="3"/>
  <!-- Park Bench (Center/Right) -->
  <rect x="95" y="125" width="65" height="15" rx="3" fill="#ffffff" stroke="#1e293b" stroke-width="3.5"/>
  <rect x="95" y="108" width="65" height="12" rx="3" fill="#ffffff" stroke="#1e293b" stroke-width="3.5"/>
  <!-- Bench Legs -->
  <line x1="102" y1="140" x2="98" y2="160" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="152" y1="140" x2="156" y2="160" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
  <!-- Ground Line -->
  <line x1="25" y1="160" x2="175" y2="160" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
</svg>`,

  // 50. School (學校)
  'school.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#ffffff"/>
  <!-- Main School Building -->
  <rect x="35" y="85" width="130" height="80" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="4.5"/>
  <!-- Clock Tower on Center Roof -->
  <polygon points="100,28 80,55 120,55" fill="#ffffff" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
  <rect x="85" y="55" width="30" height="30" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <!-- Clock Face -->
  <circle cx="100" cy="70" r="10" fill="#f8fafc" stroke="#1e293b" stroke-width="2.5"/>
  <line x1="100" y1="70" x2="100" y2="64" stroke="#1e293b" stroke-width="2" stroke-linecap="round"/>
  <line x1="100" y1="70" x2="104" y2="70" stroke="#1e293b" stroke-width="2" stroke-linecap="round"/>
  <!-- Double Entrance Doors -->
  <rect x="88" y="125" width="24" height="40" fill="#cbd5e1" stroke="#1e293b" stroke-width="3"/>
  <line x1="100" y1="125" x2="100" y2="165" stroke="#1e293b" stroke-width="2"/>
  <!-- Windows on Classroom Wings -->
  <rect x="46" y="98" width="16" height="18" fill="#f1f5f9" stroke="#1e293b" stroke-width="2.5"/>
  <rect x="68" y="98" width="16" height="18" fill="#f1f5f9" stroke="#1e293b" stroke-width="2.5"/>
  <rect x="116" y="98" width="16" height="18" fill="#f1f5f9" stroke="#1e293b" stroke-width="2.5"/>
  <rect x="138" y="98" width="16" height="18" fill="#f1f5f9" stroke="#1e293b" stroke-width="2.5"/>
  <!-- Ground Line -->
  <line x1="20" y1="165" x2="180" y2="165" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
</svg>`
};


for (const [filename, content] of Object.entries(SVGS)) {
  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, content.trim(), 'utf-8');
}

console.log(`Successfully generated ${Object.keys(SVGS).length} high-standard black-and-white line-art SVG files in ${outDir}`);
