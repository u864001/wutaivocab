import React, { useRef } from 'react';
import { SPRITE_RENDERERS } from './spotterSprites';
import { TARGET_ITEMS_POOL } from './spotterData';

export const SpotterScene = ({
  itemStateMap = {},
  activeDifferences = [],
  isLeft = true,
  spotlightDiffId = null,
  solvedDiffIds = new Set(),
  onDifferenceClicked,
  onMissClicked,
  missRipples = []
}) => {
  const svgRef = useRef(null);

  // 取得點擊座標並轉換為 SVG 標準解析度 [0..1000, 0..650]
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

    // 檢查是否命中本局 5 個相異目標中「尚未破解」者
    let hitDiff = null;
    for (const diff of activeDifferences) {
      if (solvedDiffIds.has(diff.id)) continue; // 已破解者略過

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
  const activeSpotlight = activeDifferences.find(d => d.id === spotlightDiffId);
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
        <line x1="0" y1="330" x2="1000" y2="330" stroke="#94a3b8" strokeWidth="6" />

        {/* ── 3. 背景建築：歐風露天咖啡館店面 ── */}
        <rect x="220" y="110" width="780" height="225" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
        <line x1="220" y1="160" x2="1000" y2="160" stroke="#e2e8f0" strokeWidth="1.5" />
        <line x1="220" y1="210" x2="1000" y2="210" stroke="#e2e8f0" strokeWidth="1.5" />
        <line x1="220" y1="260" x2="1000" y2="260" stroke="#e2e8f0" strokeWidth="1.5" />

        {/* 咖啡館招牌 */}
        <rect x="360" y="120" width="280" height="32" rx="8" fill="#1e293b" />
        <text x="500" y="142" fill="#f8fafc" fontSize="15" fontWeight="900" textAnchor="middle" letterSpacing="2">
          CAFÉ SUNSHINE PLAZA
        </text>

        {/* 拱形落地窗 */}
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

        {/* 誘答元素：很累的咖啡師 (tired) */}
        <g id="character-tired" transform="translate(560, 255)">
          <circle cx="20" cy="16" r="12" fill="#fed7aa" />
          <path d="M 12 15 Q 16 19, 18 15 M 22 15 Q 24 19, 28 15" stroke="#7c2d12" strokeWidth="1.5" fill="none" />
          <text x="35" y="10" fill="#64748b" fontSize="13" fontWeight="900">Zzz</text>
          <rect x="8" y="28" width="24" height="22" rx="4" fill="#047857" />
        </g>

        {/* 咖啡館條紋遮陽棚 */}
        <g id="awning-cafe">
          <path d="M 240 185 L 680 185 L 660 235 L 220 235 Z" fill="#059669" />
          <path d="M 280 185 L 330 185 L 310 235 L 260 235 Z" fill="#ffffff" opacity="0.9" />
          <path d="M 380 185 L 430 185 L 410 235 L 360 235 Z" fill="#ffffff" opacity="0.9" />
          <path d="M 480 185 L 530 185 L 510 235 L 460 235 Z" fill="#ffffff" opacity="0.9" />
          <path d="M 580 185 L 630 185 L 610 235 L 560 235 Z" fill="#ffffff" opacity="0.9" />
        </g>

        {/* 歐式古典街燈支架 */}
        <g id="lamp-structure" transform="translate(370, 140)">
          <rect x="23" y="0" width="6" height="150" fill="#334155" />
          <circle cx="26" cy="10" r="14" fill="#fef08a" filter="drop-shadow(0 0 8px #facc15)" opacity="0.9" />
          <path d="M 12 0 L 40 0 L 32 20 L 20 20 Z" fill="#1e293b" />
          <path d="M 18 10 Q 0 10, 0 35 L 24 35" stroke="#334155" strokeWidth="3" fill="none" />
        </g>

        {/* 水果攤遮陽棚與木製檯面基座 */}
        <path d="M 20 240 L 220 240 L 200 280 L 10 280 Z" fill="#dc2626" />
        <path d="M 50 240 L 90 240 L 70 280 L 30 280 Z" fill="#ffffff" opacity="0.9" />
        <path d="M 130 240 L 170 240 L 150 280 L 110 280 Z" fill="#ffffff" opacity="0.9" />
        <rect x="20" y="380" width="180" height="150" rx="6" fill="#78350f" stroke="#451a03" strokeWidth="3" />
        <rect x="25" y="440" width="170" height="8" fill="#451a03" opacity="0.4" />
        <rect x="25" y="480" width="170" height="8" fill="#451a03" opacity="0.4" />

        {/* 咖啡露天遮陽傘與圓桌基座 */}
        <g id="umbrella-cafe" transform="translate(260, 200)">
          <line x1="30" y1="50" x2="30" y2="280" stroke="#334155" strokeWidth="6" />
          <path d="M -80 50 Q 30 -30, 140 50 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
          <path d="M -25 50 Q 30 -30, 85 50 Z" fill="#ffffff" opacity="0.9" />
        </g>
        <ellipse cx="290" cy="480" rx="95" ry="32" fill="#1e293b" opacity="0.25" />
        <line x1="290" y1="465" x2="290" y2="540" stroke="#475569" strokeWidth="8" />
        <ellipse cx="290" cy="540" rx="40" ry="12" fill="#334155" />
        <ellipse cx="290" cy="465" rx="88" ry="28" fill="#dcfce7" stroke="#10b981" strokeWidth="3" />

        {/* 中央餐檯基座 */}
        <rect x="440" y="440" width="240" height="110" rx="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="3" />

        {/* 誘答元素：開心的客人 (happy) */}
        <g id="character-happy" transform="translate(365, 335)">
          <circle cx="20" cy="18" r="14" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.5" />
          <circle cx="15" cy="14" r="2" fill="#1e293b" />
          <circle cx="25" cy="14" r="2" fill="#1e293b" />
          <path d="M 14 20 Q 20 28, 26 20 Z" fill="#dc2626" />
          <rect x="8" y="32" width="24" height="40" rx="6" fill="#3b82f6" />
        </g>

        {/* 誘答元素：生氣小黑貓 (angry) */}
        <g id="animal-angry" transform="translate(685, 500)">
          <ellipse cx="16" cy="22" rx="12" ry="10" fill="#1e293b" />
          <polygon points="8,14 12,5 16,14" fill="#1e293b" />
          <polygon points="18,14 22,5 26,14" fill="#1e293b" />
          <circle cx="12" cy="18" r="1.5" fill="#facc15" />
          <circle cx="20" cy="18" r="1.5" fill="#facc15" />
          <path d="M 4 22 Q -5 10, -2 30" stroke="#1e293b" strokeWidth="3" fill="none" />
        </g>

        {/* 誘答元素：飢餓小熊立牌 (hungry) */}
        <g id="item-hungry" transform="translate(710, 310)">
          <rect x="18" y="45" width="4" height="40" fill="#78350f" />
          <rect x="0" y="0" width="40" height="48" rx="6" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
          <circle cx="20" cy="20" r="12" fill="#78350f" />
          <ellipse cx="20" cy="36" rx="14" ry="8" fill="#451a03" />
          <text x="20" y="44" fill="#ffffff" fontSize="6.5" fontWeight="900" textAnchor="middle">HUNGRY</text>
        </g>

        {/* 右側冰淇淋推車基座 */}
        <g id="cart-icecream" transform="translate(790, 310)">
          <path d="M 10 50 L 80 50 L 70 80 L 20 80 Z" fill="#f43f5e" />
          <path d="M 25 50 L 45 50 L 35 80 L 15 80 Z" fill="#ffffff" />
          <path d="M 55 50 L 75 50 L 65 80 L 45 80 Z" fill="#ffffff" />
          <rect x="10" y="100" width="80" height="90" rx="8" fill="#fdf2f8" stroke="#f472b6" strokeWidth="3" />
          <circle cx="30" cy="190" r="18" fill="#334155" stroke="#cbd5e1" strokeWidth="3" />
          <circle cx="30" cy="190" r="5" fill="#f43f5e" />
        </g>

        {/* ── 4. 動態調用 20 大目標單字之向量精靈圖庫 (Sprite Atlas) ── */}
        {/* 未抽中者使用 'default'（左右保證 100% 相同）；抽中者使用相異 variantKey（呈現生動差異） */}
        {TARGET_ITEMS_POOL.map(item => {
          const renderer = SPRITE_RENDERERS[item.word];
          if (!renderer) return null;
          const variantKey = itemStateMap[item.word] || 'default';
          return (
            <g key={item.word} id={`sprite-${item.word}`}>
              {renderer(variantKey, isLeft)}
            </g>
          );
        })}

        {/* ── 5. 聚光燈遮罩特效 (Phase 2 Spotlight Effect) ── */}
        {spotlightPos && (
          <g id="spotlight-overlay" className="pointer-events-none">
            <rect width="1000" height="650" fill="rgba(10, 15, 30, 0.75)" mask={`url(#${maskId})`} />

            {/* 聚光燈外環脈動光波 */}
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

            {/* 聚光燈金色實體光圈 */}
            <circle
              cx={spotlightPos.x}
              cy={spotlightPos.y}
              r={spotlightPos.radius}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3.5"
              filter="url(#glowGold)"
            />

            {/* 瞄準十字線 */}
            <line x1={spotlightPos.x - spotlightPos.radius - 10} y1={spotlightPos.y} x2={spotlightPos.x - spotlightPos.radius + 4} y2={spotlightPos.y} stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <line x1={spotlightPos.x + spotlightPos.radius - 4} y1={spotlightPos.y} x2={spotlightPos.x + spotlightPos.radius + 10} y2={spotlightPos.y} stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <line x1={spotlightPos.x} y1={spotlightPos.y - spotlightPos.radius - 10} x2={spotlightPos.x} y2={spotlightPos.y - spotlightPos.radius + 4} stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <line x1={spotlightPos.x} y1={spotlightPos.y + spotlightPos.radius - 4} x2={spotlightPos.x} y2={spotlightPos.y + spotlightPos.radius + 10} stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />

            {/* 頂部引導膠囊 */}
            <g transform={`translate(${spotlightPos.x}, ${spotlightPos.y - spotlightPos.radius - 24})`}>
              <rect x="-80" y="-14" width="160" height="24" rx="12" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))" />
              <text x="0" y="3" fill="#fef08a" fontSize="11" fontWeight="900" textAnchor="middle">
                🎯 鷹眼鎖定！選出單字
              </text>
            </g>
          </g>
        )}

        {/* ── 6. 已破解相異點標記徽章 (永久性綠色勾選印記) ── */}
        {activeDifferences.map(diff => {
          if (!solvedDiffIds.has(diff.id)) return null;
          const markerX = (!isLeft && diff.altX !== undefined) ? diff.altX : diff.x;
          const markerY = (!isLeft && diff.altY !== undefined) ? diff.altY : diff.y;
          const r = diff.radius || 46;

          return (
            <g key={diff.id} id={`solved-marker-${diff.id}`} className="pointer-events-none animate-fadeIn">
              <circle
                cx={markerX}
                cy={markerY}
                r={r}
                fill="rgba(16, 185, 129, 0.12)"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />
              <g transform={`translate(${markerX + r * 0.65}, ${markerY - r * 0.65})`}>
                <circle cx="0" cy="0" r="10" fill="#10b981" stroke="#ffffff" strokeWidth="2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
                <path d="M -4 0 L -1 3 L 4 -3" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
            </g>
          );
        })}

        {/* ── 7. 點錯失敗漣漪動畫 (Miss Ripple) ── */}
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
