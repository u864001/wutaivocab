import React, { useRef } from 'react';

export const SpotterScene = ({
  scene,
  isLeft = true,
  spotlightDiffId = null,
  solvedDiffIds = new Set(),
  onDifferenceClicked,
  onMissClicked,
  missRipples = []
}) => {
  const svgRef = useRef(null);

  // 取得點擊座標轉換為 SVG 內部標準解析度 [0..1000, 0..650]
  const handleClick = (e) => {
    if (!svgRef.current) return;
    // 若聚光燈已鎖定中，雙圖區完全鎖定不接受再次點選，由 Word Bank 接管
    if (spotlightDiffId) return;

    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    const screenCTM = svg.getScreenCTM();
    if (!screenCTM) return;
    const svgPt = pt.matrixTransform(screenCTM.inverse());
    const clickX = svgPt.x;
    const clickY = svgPt.y;

    // 檢查是否命中任何尚未破解的相異目標
    let hitDiff = null;
    for (const diff of scene.differences) {
      if (solvedDiffIds.has(diff.id)) continue; // 已破解的略過

      // 目標座標（支援位移差異左右圖座標不同）
      const targetX = (!isLeft && diff.altX !== undefined) ? diff.altX : diff.x;
      const targetY = (!isLeft && diff.altY !== undefined) ? diff.altY : diff.y;
      const radius = diff.radius || 46;

      const dist = Math.sqrt(Math.pow(clickX - targetX, 2) + Math.pow(clickY - targetY, 2));
      if (dist <= radius) {
        hitDiff = diff;
        break;
      }
    }

    if (hitDiff) {
      if (onDifferenceClicked) {
        onDifferenceClicked(hitDiff.id, {
          x: clickX,
          y: clickY,
          screenX: e.clientX,
          screenY: e.clientY
        });
      }
    } else {
      if (onMissClicked) {
        onMissClicked({
          x: clickX,
          y: clickY,
          screenX: e.clientX,
          screenY: e.clientY
        });
      }
    }
  };

  // 當前聚光燈目標之座標
  const activeSpotlight = scene.differences.find(d => d.id === spotlightDiffId);
  const spotlightPos = activeSpotlight ? {
    x: (!isLeft && activeSpotlight.altX !== undefined) ? activeSpotlight.altX : activeSpotlight.x,
    y: (!isLeft && activeSpotlight.altY !== undefined) ? activeSpotlight.altY : activeSpotlight.y,
    radius: (activeSpotlight.radius || 46) + 4
  } : null;

  const maskId = `spotlight-mask-${isLeft ? 'left' : 'right'}`;

  return (
    <div className="relative w-full aspect-[1000/650] select-none rounded-2xl overflow-hidden shadow-xl border-2 border-slate-300 dark:border-slate-700 bg-sky-100 touch-manipulation">
      {/* 標籤標記 */}
      <div className="absolute top-2.5 left-2.5 z-20 px-2.5 py-1 rounded-xl bg-slate-900/75 backdrop-blur-md text-white text-xs font-black shadow-md flex items-center gap-1.5 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>{isLeft ? '左側視圖 (Left Scene)' : '右側視圖 (Right Scene)'}</span>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 1000 650"
        className={`w-full h-full block ${spotlightDiffId ? 'cursor-not-allowed' : 'cursor-crosshair'}`}
        onClick={handleClick}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 天空漸層 */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bae6fd" />
            <stop offset="60%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>

          {/* 聚光燈金色光芒濾鏡 */}
          <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* 聚光燈遮罩：背景暗化，僅目標孔徑透光 */}
          {spotlightPos && (
            <mask id={maskId}>
              <rect width="1000" height="650" fill="white" />
              <circle cx={spotlightPos.x} cy={spotlightPos.y} r={spotlightPos.radius} fill="black" />
            </mask>
          )}

          {/* 鵝卵石地磚圖案 */}
          <pattern id="cobblePattern" width="40" height="25" patternUnits="userSpaceOnUse">
            <rect width="40" height="25" fill="#e2e8f0" />
            <path d="M 0 12.5 Q 10 10, 20 12.5 Q 30 15, 40 12.5 M 20 0 L 20 25" stroke="#cbd5e1" strokeWidth="1.2" fill="none" />
            <ellipse cx="10" cy="6" rx="6" ry="3.5" fill="#f1f5f9" />
            <ellipse cx="30" cy="18" rx="7" ry="4" fill="#f1f5f9" />
          </pattern>
        </defs>

        {/* ── 1. 天空與遠景 ── */}
        <rect width="1000" height="380" fill="url(#skyGrad)" />

        {/* 遠方歐洲城鎮屋頂剪影 */}
        <path d="M 0 280 L 60 250 L 120 280 L 200 240 L 280 280 L 360 230 L 440 280 L 520 250 L 600 280 L 720 220 L 820 280 L 920 240 L 1000 280 L 1000 380 L 0 380 Z" fill="#cbd5e1" opacity="0.65" />

        {/* 誘答元素：晴朗太陽 (sunny) */}
        <g id="item-sunny" transform="translate(60, 45)">
          <circle cx="25" cy="25" r="18" fill="#f59e0b" filter="drop-shadow(0 0 6px #fbbf24)" />
          <path d="M 25 0 L 25 5 M 25 45 L 25 50 M 0 25 L 5 25 M 45 25 L 50 25 M 7 7 L 11 11 M 39 39 L 43 43 M 7 43 L 11 39 M 39 7 L 43 11" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <circle cx="20" cy="22" r="2" fill="#78350f" />
          <circle cx="30" cy="22" r="2" fill="#78350f" />
          <path d="M 20 28 Q 25 33, 30 28" stroke="#78350f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>

        {/* 誘答元素：多雲雲朵 (cloudy) */}
        <g id="item-cloudy" transform="translate(210, 50)" opacity="0.9">
          <ellipse cx="40" cy="25" rx="25" ry="15" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))" />
          <ellipse cx="60" cy="20" rx="18" ry="16" fill="#ffffff" />
          <ellipse cx="25" cy="22" rx="16" ry="12" fill="#ffffff" />
        </g>

        {/* 誘答元素：微風風車 (windy) */}
        <g id="item-windy" transform="translate(480, 50)">
          <line x1="20" y1="20" x2="20" y2="70" stroke="#64748b" strokeWidth="3" />
          <circle cx="20" cy="20" r="4" fill="#0284c7" />
          <path d="M 20 20 L 5 5 Q 15 15, 20 20 Z" fill="#ef4444" />
          <path d="M 20 20 L 35 5 Q 25 15, 20 20 Z" fill="#eab308" />
          <path d="M 20 20 L 35 35 Q 25 25, 20 20 Z" fill="#10b981" />
          <path d="M 20 20 L 5 35 Q 15 25, 20 20 Z" fill="#3b82f6" />
        </g>

        {/* 誘答元素：遠方小雨雲 (rainy) */}
        <g id="item-rainy" transform="translate(860, 45)" opacity="0.85">
          <ellipse cx="35" cy="20" rx="22" ry="13" fill="#94a3b8" />
          <ellipse cx="50" cy="18" rx="14" ry="12" fill="#94a3b8" />
          <line x1="25" y1="36" x2="20" y2="48" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="38" y1="36" x2="33" y2="48" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="50" y1="36" x2="45" y2="48" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
        </g>

        {/* ── 2. 地面街道鵝卵石廣場 ── */}
        <rect y="330" width="1000" height="320" fill="url(#cobblePattern)" />
        {/* 廣場邊界人行道石 */}
        <line x1="0" y1="330" x2="1000" y2="330" stroke="#94a3b8" strokeWidth="6" />

        {/* ── 3. 背景建築：歐風露天咖啡館店面 ── */}
        {/* 咖啡館石磚主牆面 */}
        <rect x="220" y="110" width="780" height="225" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
        {/* 磚紋線條 */}
        <line x1="220" y1="160" x2="1000" y2="160" stroke="#e2e8f0" strokeWidth="1.5" />
        <line x1="220" y1="210" x2="1000" y2="210" stroke="#e2e8f0" strokeWidth="1.5" />
        <line x1="220" y1="260" x2="1000" y2="260" stroke="#e2e8f0" strokeWidth="1.5" />

        {/* 咖啡館招牌文字看板 */}
        <rect x="360" y="120" width="280" height="32" rx="8" fill="#1e293b" />
        <text x="500" y="142" fill="#f8fafc" fontSize="15" fontWeight="900" textAnchor="middle" letterSpacing="2">
          CAFÉ SUNSHINE PLAZA
        </text>

        {/* 拱形落地窗與內部微光 */}
        <path d="M 720 180 A 40 40 0 0 1 800 180 L 800 280 L 720 280 Z" fill="#0284c7" opacity="0.3" stroke="#0f172a" strokeWidth="4" />
        <path d="M 830 180 A 40 40 0 0 1 910 180 L 910 280 L 830 280 Z" fill="#0284c7" opacity="0.3" stroke="#0f172a" strokeWidth="4" />

        {/* 誘答元素：中秋節嫦娥海報 (Chang-O) 與玉兔 (Jade Rabbit) */}
        <g id="poster-chango" transform="translate(630, 165)">
          <rect width="65" height="95" rx="5" fill="#fffbeb" stroke="#d97706" strokeWidth="2" />
          <circle cx="32" cy="35" r="18" fill="#fef08a" />
          <path d="M 28 30 Q 35 15, 42 32 Q 45 42, 32 45 Z" fill="#f43f5e" />
          <text x="32" y="80" fill="#92400e" fontSize="9" fontWeight="900" textAnchor="middle">Chang-O</text>
        </g>
        <g id="toy-rabbit" transform="translate(660, 245)">
          <ellipse cx="14" cy="18" rx="10" ry="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <ellipse cx="10" cy="5" rx="3.5" ry="8" fill="#ffffff" stroke="#f43f5e" strokeWidth="1" />
          <ellipse cx="18" cy="5" rx="3.5" ry="8" fill="#ffffff" stroke="#f43f5e" strokeWidth="1" />
          <circle cx="11" cy="16" r="1.5" fill="#1e293b" />
          <circle cx="17" cy="16" r="1.5" fill="#1e293b" />
        </g>

        {/* 誘答元素：很累的咖啡師打瞌睡 (tired) */}
        <g id="character-tired" transform="translate(560, 255)">
          <circle cx="20" cy="16" r="12" fill="#fed7aa" />
          <path d="M 12 15 Q 16 19, 18 15 M 22 15 Q 24 19, 28 15" stroke="#7c2d12" strokeWidth="1.5" fill="none" />
          <text x="35" y="10" fill="#64748b" fontSize="13" fontWeight="900">Zzz</text>
          <rect x="8" y="28" width="24" height="22" rx="4" fill="#047857" />
        </g>

        {/* ── 4. 咖啡館遮陽棚與戶外露臺 ── */}
        <g id="awning-cafe">
          <path d="M 240 185 L 680 185 L 660 235 L 220 235 Z" fill="#059669" />
          {/* 白綠相間條紋 */}
          <path d="M 280 185 L 330 185 L 310 235 L 260 235 Z" fill="#ffffff" opacity="0.9" />
          <path d="M 380 185 L 430 185 L 410 235 L 360 235 Z" fill="#ffffff" opacity="0.9" />
          <path d="M 480 185 L 530 185 L 510 235 L 460 235 Z" fill="#ffffff" opacity="0.9" />
          <path d="M 580 185 L 630 185 L 610 235 L 560 235 Z" fill="#ffffff" opacity="0.9" />
          {/* 波浪花邊 */}
          <path d="M 220 235 Q 230 245, 240 235 Q 250 245, 260 235 Q 270 245, 280 235 Q 290 245, 300 235 Q 310 245, 320 235 Q 330 245, 340 235 Q 350 245, 360 235 Q 370 245, 380 235 Q 390 245, 400 235 Q 410 245, 420 235 Q 430 245, 440 235 Q 450 245, 460 235 Q 470 245, 480 235 Q 490 245, 500 235 Q 510 245, 520 235 Q 530 245, 540 235 Q 550 245, 560 235 Q 570 245, 580 235 Q 590 245, 600 235 Q 610 245, 620 235 Q 630 245, 640 235 Q 650 245, 660 235" stroke="#047857" strokeWidth="2" fill="none" />
        </g>

        {/* ── 5. 相異點 10：門牌號碼掛牌 (sixteen) ── */}
        {/* 街角古典歐式鑄鐵路燈 */}
        <g id="diff-target-sixteen" transform="translate(370, 140)">
          <rect x="23" y="0" width="6" height="150" fill="#334155" />
          <circle cx="26" cy="10" r="14" fill="#fef08a" filter="drop-shadow(0 0 8px #facc15)" opacity="0.9" />
          <path d="M 12 0 L 40 0 L 32 20 L 20 20 Z" fill="#1e293b" />
          <path d="M 18 10 Q 0 10, 0 35 L 24 35" stroke="#334155" strokeWidth="3" fill="none" />

          {/* 懸掛之金屬門牌 (差異所在：左圖十六 16 / 右圖二十 20) */}
          <g id="doorplate">
            <rect x="-12" y="32" width="46" height="34" rx="6" fill="#78350f" stroke="#f59e0b" strokeWidth="2.5" />
            <rect x="-8" y="36" width="38" height="26" rx="4" fill="#451a03" />
            <text x="11" y="55" fill="#fef08a" fontSize="17" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              {isLeft ? '16' : '20'}
            </text>
          </g>
        </g>

        {/* ── 6. 左側水果攤 (apple, watermelon, banana, orange, pomelo) ── */}
        {/* 水果攤木遮棚 */}
        <path d="M 20 240 L 220 240 L 200 280 L 10 280 Z" fill="#dc2626" />
        <path d="M 50 240 L 90 240 L 70 280 L 30 280 Z" fill="#ffffff" opacity="0.9" />
        <path d="M 130 240 L 170 240 L 150 280 L 110 280 Z" fill="#ffffff" opacity="0.9" />

        {/* 水果攤木製檯面與箱體 */}
        <rect x="20" y="380" width="180" height="150" rx="6" fill="#78350f" stroke="#451a03" strokeWidth="3" />
        <rect x="25" y="440" width="170" height="8" fill="#451a03" opacity="0.4" />
        <rect x="25" y="480" width="170" height="8" fill="#451a03" opacity="0.4" />

        {/* 相異點 7：木箱蘋果 (apple) ── 數量差異 (左圖 5 顆 / 右圖 2 顆) */}
        <g id="diff-target-apple" transform="translate(60, 380)">
          <rect x="0" y="0" width="55" height="35" rx="4" fill="#a16207" stroke="#713f12" strokeWidth="2" />
          {isLeft ? (
            // 左圖：5 顆紅蘋果疊放
            <g>
              <circle cx="12" cy="18" r="9" fill="#dc2626" />
              <circle cx="27" cy="18" r="9" fill="#ef4444" />
              <circle cx="42" cy="18" r="9" fill="#dc2626" />
              <circle cx="20" cy="8" r="8.5" fill="#f87171" />
              <circle cx="34" cy="8" r="8.5" fill="#ef4444" />
              <path d="M 20 0 Q 23 -3, 22 2" stroke="#15803d" strokeWidth="2" fill="none" />
              <path d="M 34 0 Q 37 -3, 36 2" stroke="#15803d" strokeWidth="2" fill="none" />
            </g>
          ) : (
            // 右圖：僅 2 顆蘋果
            <g>
              <circle cx="18" cy="20" r="9" fill="#dc2626" />
              <circle cx="36" cy="20" r="9" fill="#ef4444" />
              <path d="M 18 11 Q 21 8, 20 13" stroke="#15803d" strokeWidth="2" fill="none" />
            </g>
          )}
        </g>

        {/* 誘答元素：柳橙籃 (orange) */}
        <g id="item-orange" transform="translate(125, 375)">
          <ellipse cx="20" cy="22" rx="18" ry="12" fill="#c2410c" />
          <circle cx="14" cy="14" r="8" fill="#f97316" />
          <circle cx="26" cy="14" r="8" fill="#fb923c" />
          <circle cx="20" cy="8" r="7.5" fill="#f97316" />
        </g>

        {/* 相異點 5：西瓜 (watermelon) ── 大小差異 (左圖超大巨無霸 / 右圖迷你小西瓜) */}
        <g id="diff-target-watermelon" transform="translate(135, 485)">
          {isLeft ? (
            // 左圖：巨無霸大西瓜 (大圓帶黑綠斑紋)
            <g transform="scale(1.2) translate(-25, -25)">
              <circle cx="25" cy="25" r="28" fill="#15803d" stroke="#14532d" strokeWidth="2" />
              <path d="M 12 3 Q 16 25, 12 47" stroke="#052e16" strokeWidth="4" fill="none" />
              <path d="M 25 0 Q 28 25, 25 50" stroke="#052e16" strokeWidth="4" fill="none" />
              <path d="M 38 3 Q 34 25, 38 47" stroke="#052e16" strokeWidth="4" fill="none" />
            </g>
          ) : (
            // 右圖：迷你小西瓜切片
            <g transform="scale(0.7) translate(-20, -15)">
              <circle cx="20" cy="20" r="15" fill="#15803d" stroke="#14532d" strokeWidth="1.5" />
              <path d="M 14 7 Q 16 20, 14 33" stroke="#052e16" strokeWidth="2.5" fill="none" />
              <path d="M 20 5 Q 22 20, 20 35" stroke="#052e16" strokeWidth="2.5" fill="none" />
              <path d="M 26 7 Q 24 20, 26 33" stroke="#052e16" strokeWidth="2.5" fill="none" />
            </g>
          )}
        </g>

        {/* 誘答元素：柚子 (pomelo) */}
        <g id="item-pomelo" transform="translate(45, 475)">
          <path d="M 20 5 C 10 5, 5 20, 5 30 C 5 40, 12 45, 20 45 C 28 45, 35 40, 35 30 C 35 20, 30 5, 20 5 Z" fill="#84cc16" stroke="#4d7c0f" strokeWidth="1.5" />
          <path d="M 20 5 Q 22 1, 20 -2" stroke="#365314" strokeWidth="2" fill="none" />
        </g>

        {/* 相異點 9：香蕉 (banana) ── 位移差異 (左圖平放於桌面 / 右圖高掛於吊鉤) */}
        {isLeft ? (
          // 左圖香蕉：平放在檯面 (x: 180, y: 435)
          <g id="diff-target-banana-left" transform="translate(160, 420)">
            <path d="M 5 20 Q 20 8, 38 18 Q 22 28, 5 20 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
            <path d="M 8 23 Q 22 13, 35 21" stroke="#a16207" strokeWidth="1" fill="none" />
            <circle cx="5" cy="20" r="2" fill="#713f12" />
          </g>
        ) : (
          // 右圖香蕉：高掛在上方黃銅掛鉤 (x: 180, y: 285)
          <g id="diff-target-banana-right" transform="translate(165, 265)">
            {/* 黃銅吊鉤 */}
            <path d="M 18 0 L 18 15 Q 18 22, 10 20" stroke="#d97706" strokeWidth="3" fill="none" />
            {/* 懸掛的整串香蕉 */}
            <path d="M 10 18 Q 5 35, 18 45 Q 24 32, 10 18 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
            <path d="M 10 18 Q 18 35, 30 42 Q 28 28, 10 18 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
            <circle cx="10" cy="18" r="2.5" fill="#713f12" />
          </g>
        )}

        {/* ── 7. 露天咖啡座圓桌 (tea, juice, water, milk, sandwich) ── */}
        {/* 咖啡遮陽大圓傘 */}
        <g id="umbrella-cafe" transform="translate(260, 200)">
          <line x1="30" y1="50" x2="30" y2="280" stroke="#334155" strokeWidth="6" />
          <path d="M -80 50 Q 30 -30, 140 50 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
          <path d="M -25 50 Q 30 -30, 85 50 Z" fill="#ffffff" opacity="0.9" />
        </g>

        {/* 圓形咖啡桌桌面與桌腳 */}
        <ellipse cx="290" cy="480" rx="95" ry="32" fill="#1e293b" opacity="0.25" />
        <line x1="290" y1="465" x2="290" y2="540" stroke="#475569" strokeWidth="8" />
        <ellipse cx="290" cy="540" rx="40" ry="12" fill="#334155" />
        {/* 綠白格子桌布 */}
        <ellipse cx="290" cy="465" rx="88" ry="28" fill="#dcfce7" stroke="#10b981" strokeWidth="3" />

        {/* 相異點 1：果汁 (juice) ── 顏色差異 (左圖綠色奇異果汁 / 右圖鮮紅色西瓜汁) */}
        <g id="diff-target-juice" transform="translate(305, 420)">
          {/* 玻璃杯身 */}
          <path d="M 5 5 L 25 5 L 22 38 L 8 38 Z" fill="none" stroke="#64748b" strokeWidth="1.5" />
          {/* 果汁液體 (顏色差異核心) */}
          <path d="M 6 12 L 24 12 L 21.5 37 L 8.5 37 Z" fill={isLeft ? '#10b981' : '#ef4444'} opacity="0.9" />
          {/* 吸管 */}
          <line x1="12" y1="-2" x2="20" y2="35" stroke={isLeft ? '#facc15' : '#10b981'} strokeWidth="2.5" strokeLinecap="round" />
          {/* 檸檬切片 */}
          <circle cx="7" cy="6" r="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
        </g>

        {/* 相異點 2：茶壺 (tea) ── 顏色差異 (左圖金黃琥珀茶 / 右圖紫羅蘭花果茶) */}
        <g id="diff-target-tea" transform="translate(220, 440)">
          {/* 茶壺壺身 */}
          <ellipse cx="20" cy="22" rx="16" ry="14" fill={isLeft ? '#f59e0b' : '#8b5cf6'} stroke="#78350f" strokeWidth="1.8" />
          {/* 壺蓋 */}
          <ellipse cx="20" cy="8" rx="8" ry="3" fill="#ffffff" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="20" cy="5" r="2" fill={isLeft ? '#d97706' : '#6b21a8'} />
          {/* 壺把手與壺嘴 */}
          <path d="M 5 16 Q -5 20, 5 28" stroke="#78350f" strokeWidth="3" fill="none" />
          <path d="M 33 16 Q 42 12, 38 24" stroke="#78350f" strokeWidth="3" fill="none" />
        </g>

        {/* 誘答元素：水杯壺 (water) */}
        <g id="item-water" transform="translate(265, 435)">
          <path d="M 5 0 L 18 0 L 16 26 L 7 26 Z" fill="#38bdf8" opacity="0.6" stroke="#0284c7" strokeWidth="1.2" />
        </g>

        {/* 誘答元素：三明治 (sandwich) */}
        <g id="item-sandwich" transform="translate(340, 455)">
          <polygon points="5,20 30,5 30,20" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
          <polygon points="5,22 30,7 30,22" fill="#ef4444" />
          <polygon points="5,24 30,9 30,24" fill="#22c55e" />
          <polygon points="5,26 30,11 30,26" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
        </g>

        {/* 誘答元素：客人開心大笑 (happy) */}
        <g id="character-happy" transform="translate(365, 335)">
          <circle cx="20" cy="18" r="14" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.5" />
          <circle cx="15" cy="14" r="2" fill="#1e293b" />
          <circle cx="25" cy="14" r="2" fill="#1e293b" />
          <path d="M 14 20 Q 20 28, 26 20 Z" fill="#dc2626" />
          <rect x="8" y="32" width="24" height="40" rx="6" fill="#3b82f6" />
        </g>

        {/* ── 8. 中央長餐檯 (hamburger, pizza, cake, rice, moon cake) ── */}
        <rect x="440" y="440" width="240" height="110" rx="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="3" />
        <rect x="450" y="450" width="220" height="12" fill="#94a3b8" opacity="0.3" />

        {/* 相異點 6：漢堡 (hamburger) ── 大小差異 (左圖巨無霸特大雙層 / 右圖一口小漢堡) */}
        <g id="diff-target-hamburger" transform="translate(485, 445)">
          {isLeft ? (
            // 左圖：特大巨無霸雙層牛肉堡 (scale 1.3)
            <g transform="scale(1.25) translate(-15, -20)">
              {/* 頂層芝麻麵包 */}
              <ellipse cx="16" cy="6" rx="16" ry="10" fill="#d97706" />
              <ellipse cx="14" cy="4" rx="1.5" ry="0.8" fill="#fef3c7" />
              <ellipse cx="19" cy="5" rx="1.5" ry="0.8" fill="#fef3c7" />
              {/* 生菜、番茄、起司、牛肉雙層 */}
              <rect x="1" y="11" width="30" height="3" fill="#22c55e" rx="1.5" />
              <rect x="2" y="14" width="28" height="4" fill="#78350f" rx="1.5" />
              <polygon points="6,18 26,18 20,22" fill="#facc15" />
              <rect x="2" y="21" width="28" height="4" fill="#78350f" rx="1.5" />
              {/* 底層麵包 */}
              <ellipse cx="16" cy="27" rx="15" ry="5" fill="#d97706" />
            </g>
          ) : (
            // 右圖：迷你精巧小漢堡 (scale 0.7)
            <g transform="scale(0.7) translate(-10, -10)">
              <ellipse cx="14" cy="8" rx="10" ry="6" fill="#d97706" />
              <rect x="5" y="12" width="18" height="2" fill="#22c55e" />
              <rect x="5" y="14" width="18" height="3" fill="#78350f" />
              <ellipse cx="14" cy="18" rx="9" ry="3.5" fill="#d97706" />
            </g>
          )}
        </g>

        {/* 誘答元素：切片披薩 (pizza) */}
        <g id="item-pizza" transform="translate(545, 435)">
          <polygon points="5,5 35,5 20,38" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
          <path d="M 5 5 Q 20 0, 35 5" stroke="#b45309" strokeWidth="4" fill="none" />
          <circle cx="16" cy="14" r="3" fill="#dc2626" />
          <circle cx="24" cy="16" r="2.5" fill="#dc2626" />
          <circle cx="20" cy="24" r="2.5" fill="#dc2626" />
        </g>

        {/* 誘答元素：精緻草莓蛋糕 (cake) */}
        <g id="item-cake" transform="translate(595, 430)">
          <rect x="5" y="12" width="30" height="20" rx="3" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1.5" />
          <rect x="5" y="18" width="30" height="4" fill="#f43f5e" />
          <circle cx="20" cy="9" r="4.5" fill="#dc2626" />
        </g>

        {/* 相異點 4：月餅 (moon cake) ── 存在差異 (左圖盤中有月餅 / 右圖盤子空無一物) */}
        <g id="diff-target-mooncake" transform="translate(645, 450)">
          {/* 白色瓷盤 */}
          <ellipse cx="20" cy="18" rx="22" ry="9" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
          {/* 餐巾紙紋 */}
          <ellipse cx="20" cy="18" rx="16" ry="6" fill="#f8fafc" stroke="#e2e8f0" strokeDasharray="2 2" strokeWidth="1" />

          {isLeft ? (
            // 左圖：金黃烘焙月餅
            <g transform="translate(10, 5)">
              <ellipse cx="10" cy="10" rx="12" ry="8" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
              <ellipse cx="10" cy="9" rx="8" ry="5" fill="#d97706" />
              {/* 祥雲壓印圖紋 */}
              <circle cx="10" cy="9" r="3" stroke="#fef08a" strokeWidth="1" fill="none" />
            </g>
          ) : null /* 右圖空空如也 */}
        </g>

        {/* 誘答元素：米飯 (rice) */}
        <g id="item-rice" transform="translate(515, 475)">
          <ellipse cx="16" cy="18" rx="14" ry="7" fill="#475569" />
          <path d="M 5 16 Q 16 2, 27 16 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          <rect x="13" y="10" width="6" height="5" fill="#0f172a" />
        </g>

        {/* 誘答元素：生氣小貓咪 (angry) */}
        <g id="animal-angry" transform="translate(685, 500)">
          <ellipse cx="16" cy="22" rx="12" ry="10" fill="#1e293b" />
          <polygon points="8,14 12,5 16,14" fill="#1e293b" />
          <polygon points="18,14 22,5 26,14" fill="#1e293b" />
          <circle cx="12" cy="18" r="1.5" fill="#facc15" />
          <circle cx="20" cy="18" r="1.5" fill="#facc15" />
          <path d="M 4 22 Q -5 10, -2 30" stroke="#1e293b" strokeWidth="3" fill="none" />
        </g>

        {/* ── 9. 右側烤架與冰淇淋推車 (hot dog, ice cream) ── */}
        {/* 烤架餐車 (hot dog) */}
        <g id="diff-target-hotdog" transform="translate(710, 415)">
          {/* 金屬烤架底座 */}
          <rect x="10" y="25" width="65" height="30" rx="4" fill="#334155" />
          <line x1="15" y1="25" x2="15" y2="15" stroke="#64748b" strokeWidth="3" />
          <line x1="70" y1="25" x2="70" y2="15" stroke="#64748b" strokeWidth="3" />
          <line x1="10" y1="22" x2="75" y2="22" stroke="#94a3b8" strokeWidth="2.5" />

          {/* 相異點 8：熱狗 (hot dog) ── 數量差異 (左圖 3 份 / 右圖 1 份) */}
          {isLeft ? (
            // 左圖：3 份熱狗堡
            <g>
              <g transform="translate(14, 10)">
                <ellipse cx="10" cy="8" rx="9" ry="5" fill="#d97706" />
                <path d="M 2 8 L 18 8" stroke="#dc2626" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M 4 8 Q 10 5, 16 8" stroke="#facc15" strokeWidth="1.5" fill="none" />
              </g>
              <g transform="translate(34, 10)">
                <ellipse cx="10" cy="8" rx="9" ry="5" fill="#d97706" />
                <path d="M 2 8 L 18 8" stroke="#dc2626" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M 4 8 Q 10 5, 16 8" stroke="#facc15" strokeWidth="1.5" fill="none" />
              </g>
              <g transform="translate(54, 10)">
                <ellipse cx="10" cy="8" rx="9" ry="5" fill="#d97706" />
                <path d="M 2 8 L 18 8" stroke="#dc2626" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M 4 8 Q 10 5, 16 8" stroke="#facc15" strokeWidth="1.5" fill="none" />
              </g>
            </g>
          ) : (
            // 右圖：僅 1 份熱狗堡
            <g transform="translate(34, 10)">
              <ellipse cx="10" cy="8" rx="9" ry="5" fill="#d97706" />
              <path d="M 2 8 L 18 8" stroke="#dc2626" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 4 8 Q 10 5, 16 8" stroke="#facc15" strokeWidth="1.5" fill="none" />
            </g>
          )}
        </g>

        {/* 誘答元素：飢餓的熊熊招牌立牌 (hungry) */}
        <g id="item-hungry" transform="translate(710, 310)">
          <rect x="18" y="45" width="4" height="40" fill="#78350f" />
          <rect x="0" y="0" width="40" height="48" rx="6" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
          <circle cx="20" cy="20" r="12" fill="#78350f" />
          <ellipse cx="20" cy="36" rx="14" ry="8" fill="#451a03" />
          <text x="20" y="44" fill="#ffffff" fontSize="6.5" fontWeight="900" textAnchor="middle">HUNGRY</text>
        </g>

        {/* 浪漫復古粉色冰淇淋推車 (ice cream) */}
        <g id="cart-icecream" transform="translate(790, 310)">
          {/* 推車篷頂 */}
          <path d="M 10 50 L 80 50 L 70 80 L 20 80 Z" fill="#f43f5e" />
          <path d="M 25 50 L 45 50 L 35 80 L 15 80 Z" fill="#ffffff" />
          <path d="M 55 50 L 75 50 L 65 80 L 45 80 Z" fill="#ffffff" />
          {/* 車體 */}
          <rect x="10" y="100" width="80" height="90" rx="8" fill="#fdf2f8" stroke="#f472b6" strokeWidth="3" />
          <circle cx="30" cy="190" r="18" fill="#334155" stroke="#cbd5e1" strokeWidth="3" />
          <circle cx="30" cy="190" r="5" fill="#f43f5e" />

          {/* 相異點 3：冰淇淋 (ice cream) ── 存在差異 (左圖雙球甜筒 / 右圖空金屬托架) */}
          <g id="diff-target-icecream" transform="translate(40, 80)">
            {/* 金屬托架 */}
            <path d="M -5 18 L 15 18 L 10 28 L 0 28 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />

            {isLeft ? (
              // 左圖：雙球冰淇淋脆皮甜筒
              <g transform="translate(5, -5)">
                {/* 脆皮甜筒錐形 */}
                <polygon points="0,22 10,22 5,42" fill="#d97706" stroke="#b45309" strokeWidth="1" />
                {/* 巧克力格紋 */}
                <line x1="2" y1="28" x2="8" y2="34" stroke="#78350f" strokeWidth="0.8" />
                {/* 第一球 香草/薄荷綠 */}
                <circle cx="5" cy="16" r="8" fill="#a7f3d0" />
                {/* 第二球 草莓粉紅 */}
                <circle cx="5" cy="6" r="7" fill="#f472b6" />
                {/* 紅櫻桃 */}
                <circle cx="5" cy="-1" r="2.5" fill="#dc2626" />
                <path d="M 5 -1 Q 8 -6, 12 -4" stroke="#15803d" strokeWidth="1.2" fill="none" />
              </g>
            ) : null /* 右圖空空如也 */}
          </g>
        </g>

        {/* ── 10. 聚光燈遮罩特效 (Phase 2 Spotlight Effect) ── */}
        {spotlightPos && (
          <g id="spotlight-overlay" className="pointer-events-none">
            {/* 深色半透明遮罩背景（中央孔徑簍空） */}
            <rect width="1000" height="650" fill="rgba(10, 15, 30, 0.75)" mask={`url(#${maskId})`} />

            {/* 聚光燈中心外環脈動光波 */}
            <circle
              cx={spotlightPos.x}
              cy={spotlightPos.y}
              r={spotlightPos.radius + 6}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="4"
              opacity="0.8"
              className="animate-ping"
              style={{ transformOrigin: `${spotlightPos.x}px ${spotlightPos.y}px` }}
            />

            {/* 聚光燈金色實體光圈與十字瞄準線 */}
            <circle
              cx={spotlightPos.x}
              cy={spotlightPos.y}
              r={spotlightPos.radius}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3.5"
              filter="url(#glowGold)"
            />

            {/* 瞄準十字線 (Eagle Eye Reticle) */}
            <line x1={spotlightPos.x - spotlightPos.radius - 10} y1={spotlightPos.y} x2={spotlightPos.x - spotlightPos.radius + 4} y2={spotlightPos.y} stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <line x1={spotlightPos.x + spotlightPos.radius - 4} y1={spotlightPos.y} x2={spotlightPos.x + spotlightPos.radius + 10} y2={spotlightPos.y} stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <line x1={spotlightPos.x} y1={spotlightPos.y - spotlightPos.radius - 10} x2={spotlightPos.x} y2={spotlightPos.y - spotlightPos.radius + 4} stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <line x1={spotlightPos.x} y1={spotlightPos.y + spotlightPos.radius - 4} x2={spotlightPos.x} y2={spotlightPos.y + spotlightPos.radius + 10} stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />

            {/* 頂部引導文字膠囊 */}
            <g transform={`translate(${spotlightPos.x}, ${spotlightPos.y - spotlightPos.radius - 24})`}>
              <rect x="-80" y="-14" width="160" height="24" rx="12" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))" />
              <text x="0" y="3" fill="#fef08a" fontSize="11" fontWeight="900" textAnchor="middle">
                🎯 鷹眼鎖定！選出單字
              </text>
            </g>
          </g>
        )}

        {/* ── 11. 已破解目標標記徽章 (永久性金色雄鷹印記) ── */}
        {scene.differences.map(diff => {
          if (!solvedDiffIds.has(diff.id)) return null;
          const markerX = (!isLeft && diff.altX !== undefined) ? diff.altX : diff.x;
          const markerY = (!isLeft && diff.altY !== undefined) ? diff.altY : diff.y;
          const r = diff.radius || 46;

          return (
            <g key={diff.id} id={`solved-marker-${diff.id}`} className="pointer-events-none animate-fadeIn">
              {/* 綠色柔和保護圓環 */}
              <circle
                cx={markerX}
                cy={markerY}
                r={r}
                fill="rgba(16, 185, 129, 0.12)"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />
              {/* 角落勾選標籤 */}
              <g transform={`translate(${markerX + r * 0.65}, ${markerY - r * 0.65})`}>
                <circle cx="0" cy="0" r="10" fill="#10b981" stroke="#ffffff" strokeWidth="2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
                <path d="M -4 0 L -1 3 L 4 -3" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
            </g>
          );
        })}

        {/* ── 12. 點錯失敗漣漪動畫 (Miss Ripple) ── */}
        {missRipples.map(ripple => (
          <g key={ripple.id} className="pointer-events-none">
            <circle
              cx={ripple.x}
              cy={ripple.y}
              r="24"
              fill="rgba(244, 63, 94, 0.3)"
              stroke="#f43f5e"
              strokeWidth="2.5"
              className="animate-ping"
            />
            <circle
              cx={ripple.x}
              cy={ripple.y}
              r="14"
              fill="#f43f5e"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text
              x={ripple.x}
              y={ripple.y + 4}
              fill="#ffffff"
              fontSize="12"
              fontWeight="900"
              textAnchor="middle"
            >
              ✕
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
