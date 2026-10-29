import React, { useEffect, useRef, useState } from 'react';
import { POWER_UP_DEFS } from './powerUpData';

/**
 * 1. 收藏級 TCG 主題卡背 (魯凱百合日之章 / 霧臺古老石板夜之章 / 奧林帕斯聖殿)
 */
export const RukaiCardBackFace = ({ motif = 'rukai_day' }) => {
  const isNight = motif === 'slate_night';
  const isOlympus = motif === 'olympus_gold';
  const isEmerald = motif === 'emerald_totem';

  return (
    <div className="w-full h-full relative overflow-hidden rounded-xl sm:rounded-2xl select-none pointer-events-none">
      <svg
        viewBox="0 0 240 180"
        className="w-full h-full block"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id={`bg_${motif}`} cx="50%" cy="50%" r="70%">
            {isNight ? (
              <>
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="55%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </>
            ) : isOlympus ? (
              <>
                <stop offset="0%" stopColor="#3b0764" />
                <stop offset="55%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#090d16" />
              </>
            ) : isEmerald ? (
              <>
                <stop offset="0%" stopColor="#065f46" />
                <stop offset="55%" stopColor="#064e3b" />
                <stop offset="100%" stopColor="#022c22" />
              </>
            ) : (
              /* ☀️ 魯凱百合日之章：暖陽琥珀皇家金石板底 */
              <>
                <stop offset="0%" stopColor="#78350f" />
                <stop offset="55%" stopColor="#451a03" />
                <stop offset="100%" stopColor="#1c1917" />
              </>
            )}
          </radialGradient>

          <linearGradient id={`gold_${motif}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#f59e0b" />
            <stop offset="75%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>

          <linearGradient id={`cyan_${motif}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>

        {/* 底層材質 */}
        <rect x="0" y="0" width="240" height="180" fill={`url(#bg_${motif})`} />

        {/* 石板天然紋理斜線 (夜之章專屬古老石板肌理) */}
        {isNight && (
          <g stroke="#334155" strokeWidth="0.8" opacity="0.38">
            <path d="M0,35 Q80,28 160,42 T240,30" fill="none" />
            <path d="M0,85 Q90,95 170,78 T240,92" fill="none" />
            <path d="M0,140 Q70,130 150,148 T240,135" fill="none" />
          </g>
        )}

        {/* 外層雙重浮雕金框 */}
        <rect
          x="7"
          y="7"
          width="226"
          height="166"
          rx="12"
          fill="none"
          stroke={isNight ? `url(#cyan_${motif})` : `url(#gold_${motif})`}
          strokeWidth="2.5"
        />
        <rect
          x="13"
          y="13"
          width="214"
          height="154"
          rx="8"
          fill="none"
          stroke={`url(#gold_${motif})`}
          strokeWidth="1.2"
          strokeDasharray={isNight ? '6 3' : 'none'}
          opacity="0.85"
        />

        {/* 上下百步蛇傳統菱形圖騰帶 */}
        <g opacity="0.55" stroke={`url(#gold_${motif})`} strokeWidth="1.2" fill="none">
          {[36, 68, 100, 132, 164, 196].map((cx) => (
            <React.Fragment key={cx}>
              <polygon points={`${cx},15 ${cx + 10},21 ${cx},27 ${cx - 10},21`} fill={isNight ? '#0ea5e930' : '#f59e0b30'} />
              <polygon points={`${cx},153 ${cx + 10},159 ${cx},165 ${cx - 10},159`} fill={isNight ? '#0ea5e930' : '#f59e0b30'} />
            </React.Fragment>
          ))}
        </g>

        {/* 四角魯凱聖潔百合花 / 琉璃珠鑲嵌 */}
        {[
          { x: 26, y: 30, rot: -35 },
          { x: 214, y: 30, rot: 35 },
          { x: 26, y: 150, rot: -145 },
          { x: 214, y: 150, rot: 145 }
        ].map((c, i) => (
          <g key={i} transform={`translate(${c.x}, ${c.y}) rotate(${c.rot})`}>
            {isNight ? (
              /* 夜之章：三色原民琉璃珠 */
              <>
                <circle cx="0" cy="0" r="6.5" fill="#0284c7" stroke="#fde047" strokeWidth="1.3" />
                <circle cx="0" cy="0" r="2.8" fill="#f43f5e" />
                <circle cx="-2" cy="-2" r="1" fill="#ffffff" />
              </>
            ) : (
              /* 日之章：純白魯凱族百合花瓣與金蕊 */
              <>
                <path d="M0,-10 C4,-3 5,4 0,8 C-5,4 -4,-3 0,-10 Z" fill="#fffbeb" stroke="#f59e0b" strokeWidth="0.8" />
                <path d="M0,-9 C7,-5 8,2 0,7" fill="#fef3c7" opacity="0.85" />
                <path d="M0,-9 C-7,-5 -8,2 0,7" fill="#fef3c7" opacity="0.85" />
                <circle cx="0" cy="-2" r="1.8" fill="#f59e0b" />
              </>
            )}
          </g>
        ))}

        {/* 中央核心神聖紋章 */}
        <g transform="translate(120, 90)">
          {/* 外環神聖幾何光輪 */}
          <circle r="42" fill="none" stroke={`url(#gold_${motif})`} strokeWidth="1.5" opacity="0.65" />
          <circle r="35" fill={isNight ? '#090d16' : '#291002'} stroke={`url(#gold_${motif})`} strokeWidth="2.2" />

          {/* 12 道太陽芒刺 / 星芒 */}
          {Array.from({ length: 12 }).map((_, idx) => {
            const angle = idx * 30;
            return (
              <polygon
                key={idx}
                points="0,-43 -3,-35 3,-35"
                fill={`url(#gold_${motif})`}
                transform={`rotate(${angle})`}
              />
            );
          })}

          {isNight ? (
            /* 🌙 夜之章中央：古老石板雲豹與雙月秘紋 */
            <g>
              {/* 新月光弧 */}
              <path d="M-18,-12 A22,22 0 1,0 18,14 A18,18 0 1,1 -18,-12 Z" fill="#38bdf8" opacity="0.35" />
              {/* 台灣雲豹霸氣幾何圖騰 */}
              <polygon points="0,-20 15,-8 18,10 0,22 -18,10 -15,-8" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.8" />
              {/* 雲豹雙耳 */}
              <polygon points="-14,-7 -18,-19 -6,-14" fill="#fbbf24" />
              <polygon points="14,-7 18,-19 6,-14" fill="#fbbf24" />
              {/* 雲豹發光雙眼 */}
              <polygon points="-9,-2 -3,-4 -4,1" fill="#38bdf8" />
              <polygon points="9,-2 3,-4 4,1" fill="#38bdf8" />
              {/* 額頭百步蛇菱紋 */}
              <polygon points="0,-13 4,-8 0,-3 -4,-8" fill="#f43f5e" stroke="#fde047" strokeWidth="0.8" />
              {/* 鼻吻紋 */}
              <polygon points="-3,6 3,6 0,11" fill="#fde047" />
            </g>
          ) : (
            /* ☀️ 日之章中央：盛開雙百合與太陽神徽 */
            <g>
              <circle r="22" fill="#b45309" opacity="0.35" />
              {/* 盛開六瓣魯凱百合 */}
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <path
                  key={deg}
                  d="M0,0 C-5,-10 -4,-22 0,-26 C4,-22 5,-10 0,0 Z"
                  fill="#ffffff"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  transform={`rotate(${deg})`}
                />
              ))}
              {/* 核心太陽金輪 */}
              <circle r="8.5" fill={`url(#gold_${motif})`} stroke="#ffffff" strokeWidth="1.2" />
              <circle r="3.5" fill="#b45309" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

/**
 * 2. 精緻希臘古典金框單字卡面 (Ornate Word Card Face)
 * - 確保文字 100% 清晰易讀，長單字自動無段縮放，翻開時閃過一道柔和金光即完全靜止
 */
export const OrnateWordCardFace = ({ text = '', type = 'en' }) => {
  const len = (text || '').length;
  // 依據單字長度智慧調節字級，保證絕不爆框、絕不截斷
  let fontSizeClass = 'text-base sm:text-xl';
  if (len >= 14) {
    fontSizeClass = 'text-[11px] sm:text-xs leading-tight';
  } else if (len >= 10) {
    fontSizeClass = 'text-xs sm:text-sm leading-tight';
  } else if (len >= 7) {
    fontSizeClass = 'text-sm sm:text-base leading-snug';
  }

  return (
    <div className="w-full h-full relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#fffdf7] via-[#fef9e7] to-[#f9eebc] flex flex-col items-center justify-center p-2 select-none">
      {/* 古典希臘月桂與回紋金框 SVG */}
      <svg
        viewBox="0 0 240 180"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <rect
          x="5"
          y="5"
          width="230"
          height="170"
          rx="12"
          fill="none"
          stroke="#d97706"
          strokeWidth="2.5"
        />
        <rect
          x="10"
          y="10"
          width="220"
          height="160"
          rx="8"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1"
          opacity="0.65"
        />
        {/* 四角古典金花角飾 */}
        <path d="M12,26 L12,12 L26,12" fill="none" stroke="#b45309" strokeWidth="2.5" />
        <path d="M228,26 L228,12 L214,12" fill="none" stroke="#b45309" strokeWidth="2.5" />
        <path d="M12,154 L12,168 L26,168" fill="none" stroke="#b45309" strokeWidth="2.5" />
        <path d="M228,154 L228,168 L214,168" fill="none" stroke="#b45309" strokeWidth="2.5" />
        <circle cx="16" cy="16" r="2.2" fill="#d97706" />
        <circle cx="224" cy="16" r="2.2" fill="#d97706" />
        <circle cx="16" cy="164" r="2.2" fill="#d97706" />
        <circle cx="224" cy="164" r="2.2" fill="#d97706" />
      </svg>

      {/* 單字主體（超高對比深石板黑，零花紋干擾） */}
      <span
        className={`relative z-10 font-black tracking-tight text-stone-900 break-words max-w-[92%] text-center drop-shadow-[0_1px_0_rgba(255,255,255,0.9)] ${fontSizeClass}`}
      >
        {text}
      </span>

      {/* 底部精緻語種綬帶角標 */}
      <span
        className={`relative z-10 mt-1 px-2 py-0.2 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest uppercase border ${
          type === 'en'
            ? 'bg-amber-500/20 text-amber-900 border-amber-500/40'
            : 'bg-indigo-500/15 text-indigo-900 border-indigo-500/35'
        }`}
      >
        {type === 'en' ? 'ENGLISH' : '中文釋義'}
      </span>
    </div>
  );
};

/**
 * 3. 奧林帕斯八大希臘眾神史詩卡面 (Olympian Deity Card Face)
 * - 翻開瞬間觸發一次 1.2 秒神力爆發動畫 (animate-once)，隨後定格於精緻神話插畫！
 */
export const OlympianDeityCardFace = ({ powerId, size = 'normal' }) => {
  const [justFlipped, setJustFlipped] = useState(true);
  const def = POWER_UP_DEFS[powerId] || POWER_UP_DEFS.lightning;

  useEffect(() => {
    setJustFlipped(true);
    const timer = setTimeout(() => setJustFlipped(false), 1350);
    return () => clearTimeout(timer);
  }, [powerId]);

  const isLarge = size === 'large';

  return (
    <div className="w-full h-full relative overflow-hidden rounded-xl sm:rounded-2xl select-none flex flex-col justify-between p-1.5 sm:p-2">
      {/* 各神專屬神話場景與神力插畫 SVG */}
      <svg
        viewBox="0 0 240 180"
        className="absolute inset-0 w-full h-full block"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="olympus_frame" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <radialGradient id="zeus_sky" cx="50%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="40%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#090d16" />
          </radialGradient>
          <radialGradient id="athena_sky" cx="50%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="45%" stopColor="#3b0764" />
            <stop offset="100%" stopColor="#090d16" />
          </radialGradient>
          <radialGradient id="boreas_sky" cx="50%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="45%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#082f49" />
          </radialGradient>
          <radialGradient id="plutus_sky" cx="50%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#291002" />
          </radialGradient>
          <radialGradient id="hephaestus_sky" cx="50%" cy="40%" r="75%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="50%" stopColor="#9a3412" />
            <stop offset="100%" stopColor="#1c1917" />
          </radialGradient>
          <radialGradient id="apollo_sky" cx="50%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#059669" />
            <stop offset="100%" stopColor="#022c22" />
          </radialGradient>
          <radialGradient id="helios_sky" cx="50%" cy="40%" r="75%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="50%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#052e16" />
          </radialGradient>
          <radialGradient id="winwin_sky" cx="50%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="50%" stopColor="#831843" />
            <stop offset="100%" stopColor="#1f091d" />
          </radialGradient>
        </defs>

        {/* ─── 1. 宙斯 (Zeus • 雷霆閃電) ─── */}
        {powerId === 'lightning' && (
          <g>
            <rect width="240" height="180" fill="url(#zeus_sky)" />
            {/* 奧林帕斯翻湧雷雲 */}
            <circle cx="45" cy="35" r="42" fill="#1e1b4b" opacity="0.85" />
            <circle cx="195" cy="30" r="48" fill="#1e1b4b" opacity="0.85" />
            <circle cx="120" cy="20" r="50" fill="#312e81" opacity="0.7" />
            {/* 宙斯神殿石柱剪影 */}
            <rect x="16" y="70" width="14" height="110" fill="#1e293b" opacity="0.6" />
            <rect x="210" y="70" width="14" height="110" fill="#1e293b" opacity="0.6" />
            {/* 宙斯威嚴半身與高舉雷霆之手 */}
            <path d="M75,155 C80,115 100,102 120,102 C140,102 160,115 165,155 Z" fill="#1e3a8a" stroke="#fbbf24" strokeWidth="2" />
            <path d="M92,155 L145,105 L162,118 L120,155 Z" fill="#f59e0b" />
            {/* 宙斯皇冠與白髯頭像 */}
            <circle cx="116" cy="82" r="18" fill="#fde68a" />
            <path d="M96,84 Q116,112 136,84 Q126,105 116,108 Q106,105 96,84 Z" fill="#f8fafc" />
            <polygon points="98,68 106,56 116,65 126,56 134,68" fill="#fde047" stroke="#b45309" strokeWidth="1" />
            {/* 高舉的右手與萬鈞黃金閃電矛 (翻開瞬間劇烈劈閃一次！) */}
            <g className={justFlipped ? 'animate-pulse' : ''}>
              <polygon
                points="148,18 118,62 142,64 106,122 166,56 138,54 176,18"
                fill="#fef08a"
                stroke="#f59e0b"
                strokeWidth="2"
              />
              {/* 裂空分支電弧 */}
              <polyline
                points="120,12 95,45 110,52 72,95"
                fill="none"
                stroke="#ffffff"
                strokeWidth={justFlipped ? '3.5' : '1.8'}
                opacity={justFlipped ? '1' : '0.75'}
              />
              <polyline
                points="155,35 185,62 170,72 205,110"
                fill="none"
                stroke="#fde047"
                strokeWidth={justFlipped ? '3' : '1.5'}
                opacity={justFlipped ? '1' : '0.75'}
              />
            </g>
          </g>
        )}

        {/* ─── 2. 雅典娜 (Athena • 智慧神眸與黃金貓頭鷹) ─── */}
        {powerId === 'peek' && (
          <g>
            <rect width="240" height="180" fill="url(#athena_sky)" />
            {/* 星空帕德嫩神殿圓拱 */}
            <circle cx="120" cy="82" r="56" fill="none" stroke="#e9d5ff" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            {/* 雅典娜黃金頭盔羽冠與神聖貓頭鷹 */}
            <path d="M85,55 Q120,18 155,55 Q120,40 85,55 Z" fill="#fbbf24" />
            {/* 智慧貓頭鷹立像 */}
            <ellipse cx="120" cy="92" rx="34" ry="38" fill="#7e22ce" stroke="#fde047" strokeWidth="2.2" />
            <polygon points="88,62 106,72 94,82" fill="#fbbf24" />
            <polygon points="152,62 134,72 146,82" fill="#fbbf24" />
            {/* 貓頭鷹全知雙瞳 (翻開時射出透視神光) */}
            <circle cx="105" cy="84" r="11" fill="#fef08a" stroke="#581c87" strokeWidth="2" />
            <circle cx="135" cy="84" r="11" fill="#fef08a" stroke="#581c87" strokeWidth="2" />
            <circle cx="105" cy="84" r={justFlipped ? '6' : '4.5'} fill="#9333ea" />
            <circle cx="135" cy="84" r={justFlipped ? '6' : '4.5'} fill="#9333ea" />
            <circle cx="103" cy="82" r="2" fill="#ffffff" />
            <circle cx="133" cy="82" r="2" fill="#ffffff" />
            {/* 黃金鷹喙 */}
            <polygon points="115,92 125,92 120,104" fill="#f59e0b" />
            {/* 透視光束 */}
            {justFlipped && (
              <g opacity="0.85">
                <polygon points="105,84 25,165 65,165" fill="#e879f9" opacity="0.45" />
                <polygon points="135,84 175,165 215,165" fill="#e879f9" opacity="0.45" />
              </g>
            )}
          </g>
        )}

        {/* ─── 3. 博雷阿斯 (Boreas • 極北寒霜之神) ─── */}
        {powerId === 'freeze' && (
          <g>
            <rect width="240" height="180" fill="url(#boreas_sky)" />
            {/* 極地冰峰與寒霜巨翼 */}
            <polygon points="15,145 55,65 95,145" fill="#0284c7" opacity="0.5" />
            <polygon points="145,145 185,60 225,145" fill="#0284c7" opacity="0.5" />
            {/* 冰神寒霜雙翼 */}
            <path d="M120,88 L35,42 L55,78 L28,95 L72,108 L120,98 Z" fill="#bae6fd" stroke="#38bdf8" strokeWidth="1.5" />
            <path d="M120,88 L205,42 L185,78 L212,95 L168,108 L120,98 Z" fill="#bae6fd" stroke="#38bdf8" strokeWidth="1.5" />
            {/* 中心六角神聖冰晶結界 */}
            <g transform="translate(120, 84)" className={justFlipped ? 'animate-spin' : ''}>
              <polygon points="0,-42 12,-14 40,-20 18,4 36,28 8,18 0,44 -8,18 -36,28 -18,4 -40,-20 -12,-14" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" />
              <circle r="12" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
            </g>
          </g>
        )}

        {/* ─── 4. 普路托斯 (Plutus • 豐饒之角天界金幣雨) ─── */}
        {powerId === 'coin' && (
          <g>
            <rect width="240" height="180" fill="url(#plutus_sky)" />
            {/* 黃金豐饒之角 (Cornucopia) */}
            <path
              d="M55,95 C45,55 85,32 115,48 C135,58 145,35 162,25 C168,45 152,85 115,108 C82,125 62,115 55,95 Z"
              fill="url(#olympus_frame)"
              stroke="#fef08a"
              strokeWidth="2.2"
            />
            <ellipse cx="72" cy="92" rx="22" ry="26" fill="#78350f" stroke="#fde047" strokeWidth="2.5" />
            {/* 傾瀉而出的古希臘貓頭鷹金幣瀑布 */}
            {[
              { cx: 88, cy: 86, r: 12 },
              { cx: 112, cy: 96, r: 13 },
              { cx: 95, cy: 114, r: 14 },
              { cx: 135, cy: 112, r: 12 },
              { cx: 158, cy: 92, r: 11 },
              { cx: 68, cy: 120, r: 11 }
            ].map((c, idx) => (
              <g key={idx} className={justFlipped ? 'animate-bounce' : ''}>
                <circle cx={c.cx} cy={c.cy} r={c.r} fill="#facc15" stroke="#fef08a" strokeWidth="2" />
                <circle cx={c.cx} cy={c.cy} r={c.r - 3.5} fill="none" stroke="#b45309" strokeWidth="1" />
                <polygon points={`${c.cx},${c.cy - 4} ${c.cx + 4},${c.cy} ${c.cx},${c.cy + 4} ${c.cx - 4},${c.cy}`} fill="#b45309" />
              </g>
            ))}
          </g>
        )}

        {/* ─── 5. 赫菲斯托斯 (Hephaestus • 鍛造神匠與不滅金鎖) ─── */}
        {powerId === 'lock' && (
          <g>
            <rect width="240" height="180" fill="url(#hephaestus_sky)" />
            {/* 交叉神界黃金鎖鏈 */}
            <line x1="20" y1="25" x2="220" y2="145" stroke="#fbbf24" strokeWidth="7" strokeDasharray="12 6" />
            <line x1="220" y1="25" x2="20" y2="145" stroke="#fbbf24" strokeWidth="7" strokeDasharray="12 6" />
            {/* 赫菲斯托斯神聖符文巨鎖 */}
            <path d="M96,72 L96,48 A24,24 0 0,1 144,48 L144,72" fill="none" stroke="#fef08a" strokeWidth="9" strokeLinecap="round" />
            <rect x="84" y="68" width="72" height="58" rx="12" fill="url(#olympus_frame)" stroke="#fef08a" strokeWidth="2.5" />
            <circle cx="120" cy="92" r="8" fill="#451a03" />
            <polygon points="116,96 124,96 126,114 114,114" fill="#451a03" />
          </g>
        )}

        {/* ─── 6. 阿波羅 (Apollo • 太陽神日輪與金豎琴 +30) ─── */}
        {powerId === 'bonus' && (
          <g>
            <rect width="240" height="180" fill="url(#apollo_sky)" />
            {/* 太陽神萬丈光芒日輪 */}
            <g transform="translate(120, 82)">
              {Array.from({ length: 16 }).map((_, idx) => (
                <polygon
                  key={idx}
                  points="0,-64 -5,-32 5,-32"
                  fill="#fde047"
                  opacity="0.75"
                  transform={`rotate(${idx * 22.5})`}
                />
              ))}
              <circle r="36" fill="url(#olympus_frame)" stroke="#ffffff" strokeWidth="2.5" />
              {/* 太陽神黃金豎琴與翡翠聖石 */}
              <polygon points="0,-24 20,-4 12,22 -12,22 -20,-4" fill="#10b981" stroke="#fef08a" strokeWidth="2" />
              <text x="0" y="6" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="900">+30</text>
            </g>
          </g>
        )}

        {/* ─── 7. 赫利奧斯 (Helios • 全視天眼星盤) ─── */}
        {powerId === 'radar' && (
          <g>
            <rect width="240" height="180" fill="url(#helios_sky)" />
            <g transform="translate(120, 82)">
              <circle r="54" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="6 4" />
              <circle r="38" fill="none" stroke="#fde047" strokeWidth="2" />
              {/* 全視太陽之眼 */}
              <path d="M-42,0 Q0,-34 42,0 Q0,34 -42,0 Z" fill="#064e3b" stroke="#4ade80" strokeWidth="2.5" />
              <circle r="15" fill="#fde047" />
              <circle r="7" fill="#022c22" />
              <circle cx="-4" cy="-4" r="2.5" fill="#ffffff" />
            </g>
          </g>
        )}

        {/* ─── 8. 雙子神 (Castor & Pollux • 雙子座星辰契約) ─── */}
        {powerId === 'winwin' && (
          <g>
            <rect width="240" height="180" fill="url(#winwin_sky)" />
            {/* 雙子座交織黃金聖環 */}
            <circle cx="98" cy="82" r="30" fill="none" stroke="#fde047" strokeWidth="4" />
            <circle cx="142" cy="82" r="30" fill="none" stroke="#f9a8d4" strokeWidth="4" />
            {/* 雙子星芒 */}
            <polygon points="98,42 103,54 115,59 103,64 98,76 93,64 81,59 93,54" fill="#fef08a" />
            <polygon points="142,42 147,54 159,59 147,64 142,76 137,64 125,59 137,54" fill="#fbcfe8" />
          </g>
        )}

        {/* 希臘眾神卡面外層神殿金框 */}
        <rect
          x="4"
          y="4"
          width="232"
          height="172"
          rx="12"
          fill="none"
          stroke="url(#olympus_frame)"
          strokeWidth="3"
        />
      </svg>

      {/* 頂部奧林帕斯神祇冠冕標籤 */}
      <div className="relative z-10 flex items-center justify-between px-1">
        <span className="px-1.5 py-0.5 rounded bg-black/65 border border-amber-400/60 text-[8px] sm:text-[9px] font-black text-amber-300 tracking-wider uppercase truncate max-w-[100%]">
          {def.deity?.split(' ')[0] || 'OLYMPIAN GOD'}
        </span>
      </div>

      {/* 底部神話卡牌名牌 */}
      <div className="relative z-10 w-full py-1 px-1.5 rounded-lg bg-slate-950/85 border border-amber-400/70 backdrop-blur-sm text-center shadow-lg">
        <div className={`${isLarge ? 'text-base sm:text-lg' : 'text-[10px] sm:text-xs'} font-black text-amber-200 leading-tight truncate`}>
          {def.name}
        </div>
      </div>
    </div>
  );
};

/**
 * 4. 翻開神卡瞬間的 1.3 秒全場希臘眾神神力覺醒演出 (Olympian Awakening Stage)
 * - pointer-events-none，不遮蓋底盤記憶，演繹一次驚心動魄神力後自動消散！
 */
export const OlympianAwakeningStage = ({ activeAwakening, onComplete }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!activeAwakening) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const startTime = performance.now();
    const duration = 1350; // 1.35 秒震撼演出後立即回歸靜止

    const render = (now) => {
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / duration);
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const fadeOut = p > 0.72 ? 1 - (p - 0.72) / 0.28 : 1;
      const id = activeAwakening.cardId;

      ctx.save();
      ctx.globalAlpha = fadeOut;

      if (id === 'lightning') {
        // ⚡ 宙斯萬鈞雷霆：自天頂劈落兩道巨型裂空黃金閃電！
        const flash = Math.sin(p * Math.PI * 6) > 0 ? 0.22 : 0.05;
        ctx.fillStyle = `rgba(254, 240, 138, ${flash})`;
        ctx.fillRect(0, 0, w, h);

        const drawBolt = (startX, endX, endY) => {
          ctx.strokeStyle = '#fef08a';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 28;
          ctx.lineWidth = 7;
          ctx.beginPath();
          let cx = startX;
          let cy = 0;
          ctx.moveTo(cx, cy);
          const steps = 9;
          for (let i = 1; i <= steps; i++) {
            cx = startX + ((endX - startX) * i) / steps + (Math.random() - 0.5) * 65;
            cy = (endY * i) / steps;
            ctx.lineTo(cx, cy);
          }
          ctx.stroke();
        };
        drawBolt(w * 0.45, w * 0.32, h * 0.78);
        drawBolt(w * 0.55, w * 0.68, h * 0.78);
      } else if (id === 'peek') {
        // 👁️ 雅典娜智慧貓頭鷹：天穹張開黃金巨眸並投射雙道紫金透視神光
        const r = 60 + p * 35;
        const grad = ctx.createRadialGradient(w / 2, h * 0.35, 10, w / 2, h * 0.35, r * 3);
        grad.addColorStop(0, 'rgba(232, 121, 249, 0.55)');
        grad.addColorStop(1, 'rgba(88, 28, 135, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // 雙道智慧光束
        ctx.fillStyle = 'rgba(192, 132, 252, 0.28)';
        ctx.beginPath();
        ctx.moveTo(w * 0.44, h * 0.3);
        ctx.lineTo(w * 0.18, h * 0.9);
        ctx.lineTo(w * 0.38, h * 0.9);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(w * 0.56, h * 0.3);
        ctx.lineTo(w * 0.62, h * 0.9);
        ctx.lineTo(w * 0.82, h * 0.9);
        ctx.closePath();
        ctx.fill();
      } else if (id === 'freeze') {
        // ❄️ 博雷阿斯極北暴風雪：四周瞬間凝結冰晶結界
        ctx.strokeStyle = 'rgba(103, 232, 249, 0.75)';
        ctx.lineWidth = 18;
        ctx.strokeRect(9, 9, w - 18, h - 18);
        for (let i = 0; i < 16; i++) {
          const angle = (i / 16) * Math.PI * 2 + p * 2;
          const dist = p * Math.min(w, h) * 0.48;
          const sx = w / 2 + Math.cos(angle) * dist;
          const sy = h / 2 + Math.sin(angle) * dist;
          ctx.fillStyle = '#e0f2fe';
          ctx.beginPath();
          ctx.arc(sx, sy, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (id === 'radar') {
        // 📡 赫利奧斯全視天眼：360 度翠綠黃金星盤掃描波擴散全場
        const radius = p * Math.max(w, h) * 0.75;
        ctx.strokeStyle = '#4ade80';
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 24;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (id === 'bonus' || id === 'coin' || id === 'lock' || id === 'winwin') {
        // ☀️ 阿波羅 / 普路托斯 / 赫菲斯托斯 / 雙子神：神聖金色能量光環爆發
        const radius = p * Math.min(w, h) * 0.55;
        ctx.strokeStyle = id === 'winwin' ? '#f472b6' : '#fbbf24';
        ctx.shadowColor = '#fef08a';
        ctx.shadowBlur = 25;
        ctx.lineWidth = 8 * (1 - p * 0.5);
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      if (elapsed < duration) {
        animId = requestAnimationFrame(render);
      } else if (onComplete) {
        onComplete();
      }
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [activeAwakening, onComplete]);

  if (!activeAwakening) return null;

  const def = POWER_UP_DEFS[activeAwakening.cardId] || POWER_UP_DEFS.lightning;

  return (
    <div className="fixed inset-0 z-[95] pointer-events-none flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        width={1200}
        height={800}
        className="absolute inset-0 w-full h-full"
      />
      {/* 中央浮現 1.3 秒的巨幅神祇法相召喚徽章 */}
      <div className="relative z-10 w-56 sm:w-64 aspect-[4/3] rounded-3xl shadow-[0_0_60px_rgba(251,191,36,0.75)] border-2 border-amber-300 animate-bounce overflow-hidden">
        <OlympianDeityCardFace powerId={activeAwakening.cardId} size="large" />
      </div>
    </div>
  );
};
