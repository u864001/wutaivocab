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
          {/* 吉卜力物件投影濾鏡 */}
          <filter id="ghibliShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.45" />
          </filter>

          {/* 聚光燈金色光芒濾鏡 */}
          <filter id="glowGold" x="-30%" y="-30%" width="160%" height="160%">
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

          {/* 午後陽光金黃微暈濾鏡 */}
          <linearGradient id="sunlightGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.12" />
            <stop offset="60%" stopColor="#fde047" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* ── 1. 吉卜力大師級手繪陽光露天咖啡市集底圖 ── */}
        <image
          href="/assets/spotter/bg_plaza_cafe.webp"
          x="0"
          y="0"
          width="1000"
          height="650"
          preserveAspectRatio="xMidYMid slice"
        />

        {/* 陽光午後暖色氛圍圖層 */}
        <rect width="1000" height="650" fill="url(#sunlightGlow)" pointerEvents="none" />

        {/* 誘答背景單字元素：輕撫微風風向計 (windy) */}
        <g id="item-windy" transform="translate(515, 120)" className="pointer-events-none" opacity="0.85">
          <line x1="15" y1="15" x2="15" y2="45" stroke="#475569" strokeWidth="2.5" />
          <circle cx="15" cy="15" r="3.5" fill="#f59e0b" />
          <path d="M 15 15 L 5 5 Q 12 12, 15 15 Z" fill="#ef4444" />
          <path d="M 15 15 L 25 5 Q 18 12, 15 15 Z" fill="#3b82f6" />
          <path d="M 15 15 L 25 25 Q 18 18, 15 15 Z" fill="#10b981" />
        </g>

        {/* 誘答背景單字元素：遠方晴雨小雲朵 (rainy) */}
        <g id="item-rainy" transform="translate(860, 45)" className="pointer-events-none" opacity="0.65">
          <ellipse cx="25" cy="18" rx="16" ry="10" fill="#94a3b8" />
          <ellipse cx="38" cy="16" rx="12" ry="9" fill="#94a3b8" />
          <line x1="20" y1="28" x2="16" y2="38" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="2 2" />
          <line x1="28" y1="28" x2="24" y2="38" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="2 2" />
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
