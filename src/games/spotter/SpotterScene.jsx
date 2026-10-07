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
  missRipples = [],
  isInspectMode = false,
  zoomLevel = 2.0,
  pan = { x: 0, y: 0 },
  onPanChange,
  hintDiffId = null
}) => {
  const svgRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // 放大鏡檢視：視口與邊界平移計算
  const effectiveZoom = isInspectMode ? (zoomLevel || 2.0) : 1.0;
  const viewW = 1376 / effectiveZoom;
  const viewH = 768 / effectiveZoom;
  const maxPanX = 1376 - viewW;
  const maxPanY = 768 - viewH;
  const curPanX = isInspectMode ? Math.max(0, Math.min(pan.x, maxPanX)) : 0;
  const curPanY = isInspectMode ? Math.max(0, Math.min(pan.y, maxPanY)) : 0;
  const currentViewBox = `${curPanX} ${curPanY} ${viewW} ${viewH}`;

  // 放大鏡拖曳事件處理（雙圖同步聯動）
  const handlePointerDown = (e) => {
    if (!isInspectMode) return;
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: curPanX,
      panY: curPanY
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handlePointerMove = (e) => {
    if (!isInspectMode || !isDraggingRef.current || !onPanChange) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = viewW / rect.width;
    const scaleY = viewH / rect.height;

    const nextPanX = Math.max(0, Math.min(maxPanX, dragStartRef.current.panX - dx * scaleX));
    const nextPanY = Math.max(0, Math.min(maxPanY, dragStartRef.current.panY - dy * scaleY));

    onPanChange({ x: nextPanX, y: nextPanY });
  };

  const handlePointerUp = (e) => {
    if (!isInspectMode) return;
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  // 取得點擊座標並轉換為 SVG 標準解析度 [0..1376, 0..768]
  const handleClick = (e) => {
    if (!svgRef.current) return;
    // 放大鏡檢視模式下純粹檢視用，絕不觸發任何點擊作答！
    if (isInspectMode) return;
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

    // 檢查是否命中本局 5 個相異目標
    let hitDiff = null;
    let hitSolved = false;
    for (const diff of activeDifferences) {
      // 目標座標（支援位移差異左右圖座標不同）
      const targetX = (!isLeft && diff.altX !== undefined) ? diff.altX : diff.x;
      const targetY = (!isLeft && diff.altY !== undefined) ? diff.altY : diff.y;
      const radius = (diff.radius || 40) + 6; // 稍微加大命中容錯率，方便 iPad 觸控

      const dist = Math.sqrt(Math.pow(clickX - targetX, 2) + Math.pow(clickY - targetY, 2));
      if (dist <= radius) {
        if (solvedDiffIds.has(diff.id)) {
          hitSolved = true;
          break;
        } else {
          hitDiff = diff;
          break;
        }
      }
    }

    if (hitSolved) {
      // 點擊已破解之相異點：無害略過，絕不扣心！
      return;
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
    <div className={`relative w-full aspect-[1376/768] select-none rounded-2xl overflow-hidden shadow-xl border-2 border-slate-300 dark:border-slate-700 bg-sky-100 ${isInspectMode ? 'touch-none cursor-grab active:cursor-grabbing' : 'touch-manipulation'}`}>
      {/* 標籤標記 */}
      <div className="absolute top-2.5 left-2.5 z-20 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-xs font-black shadow-md flex items-center gap-1.5 pointer-events-none">
        <span className={`w-2 h-2 rounded-full ${isInspectMode ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
        <span>
          {isInspectMode
            ? `${isLeft ? '左圖' : '右圖'} 🔍 放大鏡檢視中 (支援拖曳)`
            : (isLeft ? '左側視圖 (Left Scene)' : '右側視圖 (Right Scene)')}
        </span>
      </div>

      <svg
        ref={svgRef}
        viewBox={currentViewBox}
        className={`w-full h-full block ${isInspectMode ? 'cursor-grab active:cursor-grabbing' : (spotlightDiffId ? 'cursor-not-allowed' : 'cursor-crosshair')}`}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 聚光燈金色光芒濾鏡 */}
          <filter id="glowGold" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* 提示光圈高對比霓虹青光濾鏡 */}
          <filter id="glowNeon" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 聚光燈遮罩：背景暗化，僅目標孔徑透光 */}
          {spotlightPos && (
            <mask id={maskId}>
              <rect width="1376" height="768" fill="white" />
              <circle cx={spotlightPos.x} cy={spotlightPos.y} r={spotlightPos.radius} fill="black" />
            </mask>
          )}
        </defs>

        {/* ── 1. 3D 立體紙雕基底全景圖（左右圖共用乾淨無瑕底圖，保證非相異物 100% 相同） ── */}
        <image
          href="/assets/spotter/scene_papercraft_left.webp"
          x="0"
          y="0"
          width="1376"
          height="768"
          preserveAspectRatio="xMidYMid slice"
        />

        {/* ── 2. 動態相異點局部圖層（僅在右側圖、且僅渲染本局隨機選中之 5 處相異目標，其餘未選中物件左右圖完全相同） ── */}
        {!isLeft && activeDifferences.map(diff => {
          if (!diff.patch) return null;
          return (
            <image
              key={diff.id}
              href={diff.patch.url}
              x={diff.patch.x}
              y={diff.patch.y}
              width={diff.patch.width}
              height={diff.patch.height}
              preserveAspectRatio="none"
            />
          );
        })}

        {/* ── 5. 聚光燈遮罩特效 (Phase 2 Spotlight Effect) ── */}
        {spotlightPos && (
          <g id="spotlight-overlay" className="pointer-events-none">
            <rect width="1376" height="768" fill="rgba(10, 15, 30, 0.75)" mask={`url(#${maskId})`} />

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

        {/* ── 6.5 鷹眼提示霓虹光環 (Hint Ring: 消耗 1 心換取之顯著提示，直至點擊作答後消失) ── */}
        {hintDiffId && (
          (() => {
            const hintDiff = activeDifferences.find(d => d.id === hintDiffId);
            if (!hintDiff) return null;
            const hx = (!isLeft && hintDiff.altX !== undefined) ? hintDiff.altX : hintDiff.x;
            const hy = (!isLeft && hintDiff.altY !== undefined) ? hintDiff.altY : hintDiff.y;
            const hr = (hintDiff.radius || 50) + 8;

            return (
              <g key="hint-neon-marker" className="pointer-events-none">
                {/* 外部旋轉金色破折光圈 */}
                <circle
                  cx={hx}
                  cy={hy}
                  r={hr + 14}
                  fill="rgba(251, 191, 36, 0.22)"
                  stroke="#fbbf24"
                  strokeWidth="3.5"
                  strokeDasharray="10 6"
                  className="animate-spin"
                  style={{ transformOrigin: `${hx}px ${hy}px`, animationDuration: '6s' }}
                />

                {/* 內部高亮度青藍霓虹脈動圈 */}
                <circle
                  cx={hx}
                  cy={hy}
                  r={hr}
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="4"
                  filter="url(#glowNeon)"
                  className="animate-pulse"
                />

                {/* 頂部顯著提示膠囊標籤 */}
                <g transform={`translate(${hx}, ${hy - hr - 16})`}>
                  <rect
                    x="-50"
                    y="-13"
                    width="100"
                    height="26"
                    rx="13"
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    filter="drop-shadow(0 4px 8px rgba(0,0,0,0.4))"
                  />
                  <text
                    x="0"
                    y="4"
                    fill="#ffffff"
                    fontSize="12"
                    fontWeight="900"
                    textAnchor="middle"
                  >
                    💡 線索在此！
                  </text>
                </g>
              </g>
            );
          })()
        )}

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
