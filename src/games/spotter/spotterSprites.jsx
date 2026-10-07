import React from 'react';

// ── 《鷹眼神探 • 單字找不同》 20 大目標單字吉卜力動漫手繪精靈圖庫 (Ghibli Cel Art Atlas) ──
// 完美契合陽光歐風露天咖啡廣場底圖，精準座標定位、賽璐珞陰影與生動差異樣態

// 1. 果汁 (juice) - 咖啡桌 (840, 460)
export const renderJuiceSprite = (variantKey, isLeft) => {
  const x = 840;
  const y = 460;

  if (variantKey === 'color') {
    const liquidColor = isLeft ? '#10b981' : '#ef4444'; // 左奇異果綠 / 右西瓜紅
    const fruitSlice = isLeft ? '#86efac' : '#fca5a5';
    return (
      <g transform={`translate(${x - 14}, ${y - 25})`} filter="url(#ghibliShadow)">
        {/* 玻璃杯身 */}
        <path d="M 4 4 L 24 4 L 20 44 L 8 44 Z" fill="rgba(255,255,255,0.3)" stroke="#475569" strokeWidth="1.6" />
        {/* 果汁液體 */}
        <path d="M 5.5 12 L 22.5 12 L 19.5 43 L 8.5 43 Z" fill={liquidColor} opacity="0.92" />
        {/* 冰塊 */}
        <rect x="9" y="16" width="6" height="6" rx="1.5" fill="#ffffff" opacity="0.75" />
        <rect x="13" y="24" width="5.5" height="5.5" rx="1.5" fill="#ffffff" opacity="0.75" />
        {/* 吸管 */}
        <path d="M 14 -4 L 14 6 L 19 40" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* 杯緣水果切片 */}
        <circle cx="6" cy="6" r="6" fill={fruitSlice} stroke="#059669" strokeWidth="1" />
      </g>
    );
  }

  if (variantKey === 'size') {
    const scale = isLeft ? 1.25 : 0.65;
    const dy = isLeft ? -5 : 10;
    return (
      <g transform={`translate(${x - 14}, ${y - 25 + dy}) scale(${scale})`} filter="url(#ghibliShadow)">
        <path d="M 4 4 L 24 4 L 20 44 L 8 44 Z" fill="rgba(255,255,255,0.3)" stroke="#475569" strokeWidth="1.6" />
        <path d="M 5.5 12 L 22.5 12 L 19.5 43 L 8.5 43 Z" fill="#f97316" opacity="0.92" />
        <path d="M 14 -4 L 14 6 L 19 40" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </g>
    );
  }

  if (variantKey === 'presence') {
    return (
      <g transform={`translate(${x - 14}, ${y - 25})`} filter="url(#ghibliShadow)">
        <path d="M 4 4 L 24 4 L 20 44 L 8 44 Z" fill="rgba(255,255,255,0.3)" stroke="#475569" strokeWidth="1.6" />
        {isLeft ? (
          <>
            <path d="M 5.5 12 L 22.5 12 L 19.5 43 L 8.5 43 Z" fill="#06b6d4" opacity="0.92" />
            <rect x="9" y="16" width="6" height="6" rx="1.5" fill="#ffffff" opacity="0.75" />
            <path d="M 14 -4 L 14 6 L 19 40" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <ellipse cx="14" cy="40" rx="4" ry="2" fill="#cbd5e1" opacity="0.8" />
        )}
      </g>
    );
  }

  // Default: 金黃柳橙汁
  return (
    <g transform={`translate(${x - 14}, ${y - 25})`} filter="url(#ghibliShadow)">
      <path d="M 4 4 L 24 4 L 20 44 L 8 44 Z" fill="rgba(255,255,255,0.3)" stroke="#475569" strokeWidth="1.6" />
      <path d="M 5.5 12 L 22.5 12 L 19.5 43 L 8.5 43 Z" fill="#f59e0b" opacity="0.92" />
      <rect x="9" y="16" width="6" height="6" rx="1.5" fill="#ffffff" opacity="0.75" />
      <path d="M 14 -4 L 14 6 L 19 40" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="6" cy="6" r="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
    </g>
  );
};

// 2. 茶壺 (tea) - 咖啡桌 (895, 455)
export const renderTeaSprite = (variantKey, isLeft) => {
  const x = 895;
  const y = 455;

  if (variantKey === 'color') {
    const potColor = isLeft ? '#f59e0b' : '#a855f7'; // 左琥珀花草茶 / 右紫羅蘭花茶
    return (
      <g transform={`translate(${x - 18}, ${y - 18})`} filter="url(#ghibliShadow)">
        <ellipse cx="18" cy="20" rx="14" ry="12" fill={potColor} stroke="#78350f" strokeWidth="1.8" />
        <ellipse cx="18" cy="8" rx="8" ry="3" fill="#ffffff" stroke="#78350f" strokeWidth="1.5" />
        <circle cx="18" cy="5" r="2.5" fill={potColor} />
        <path d="M 5 15 Q -4 19, 5 26" stroke="#78350f" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <path d="M 30 15 Q 38 12, 35 22" stroke="#78350f" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      </g>
    );
  }

  if (variantKey === 'size') {
    const scale = isLeft ? 1.3 : 0.7;
    const dy = isLeft ? -4 : 8;
    return (
      <g transform={`translate(${x - 18}, ${y - 18 + dy}) scale(${scale})`} filter="url(#ghibliShadow)">
        <ellipse cx="18" cy="20" rx="14" ry="12" fill="#0d9488" stroke="#134e4a" strokeWidth="1.8" />
        <ellipse cx="18" cy="8" rx="8" ry="3" fill="#ffffff" stroke="#134e4a" strokeWidth="1.5" />
        <path d="M 5 15 Q -4 19, 5 26" stroke="#134e4a" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <path d="M 30 15 Q 38 12, 35 22" stroke="#134e4a" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      </g>
    );
  }

  if (variantKey === 'presence') {
    return (
      <g transform={`translate(${x - 18}, ${y - 18})`} filter="url(#ghibliShadow)">
        {isLeft ? (
          <>
            <ellipse cx="18" cy="20" rx="14" ry="12" fill="#d97706" stroke="#78350f" strokeWidth="1.8" />
            <ellipse cx="18" cy="8" rx="8" ry="3" fill="#ffffff" stroke="#78350f" strokeWidth="1.5" />
            <path d="M 5 15 Q -4 19, 5 26" stroke="#78350f" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <path d="M 30 15 Q 38 12, 35 22" stroke="#78350f" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <g transform="translate(10, 10)">
            <ellipse cx="10" cy="14" rx="8" ry="4" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.4" />
            <ellipse cx="10" cy="13" rx="5" ry="2.5" fill="#fef08a" />
          </g>
        )}
      </g>
    );
  }

  // Default: 古典瓷英式茶壺
  return (
    <g transform={`translate(${x - 18}, ${y - 18})`} filter="url(#ghibliShadow)">
      <ellipse cx="18" cy="20" rx="14" ry="12" fill="#b45309" stroke="#78350f" strokeWidth="1.8" />
      <ellipse cx="18" cy="8" rx="8" ry="3" fill="#ffffff" stroke="#78350f" strokeWidth="1.5" />
      <circle cx="18" cy="5" r="2.5" fill="#d97706" />
      <path d="M 5 15 Q -4 19, 5 26" stroke="#78350f" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M 30 15 Q 38 12, 35 22" stroke="#78350f" strokeWidth="2.8" fill="none" strokeLinecap="round" />
    </g>
  );
};

// 3. 冰淇淋 (ice cream) - 咖啡桌 (890, 510)
export const renderIceCreamSprite = (variantKey, isLeft) => {
  const x = 890;
  const y = 510;

  if (variantKey === 'presence') {
    return (
      <g transform={`translate(${x - 12}, ${y - 25})`} filter="url(#ghibliShadow)">
        <ellipse cx="12" cy="38" rx="12" ry="4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
        {isLeft && (
          <g>
            <polygon points="6,20 18,20 12,38" fill="#d97706" stroke="#b45309" strokeWidth="1.2" />
            <circle cx="12" cy="15" r="9" fill="#6ee7b7" stroke="#059669" strokeWidth="1.2" />
            <circle cx="12" cy="5" r="8" fill="#f472b6" stroke="#db2777" strokeWidth="1.2" />
            <circle cx="12" cy="-2" r="3" fill="#dc2626" />
          </g>
        )}
      </g>
    );
  }

  if (variantKey === 'color') {
    const scoop1 = isLeft ? '#6ee7b7' : '#fde047'; // 左薄荷綠 / 右芒果黃
    const scoop2 = isLeft ? '#f472b6' : '#60a5fa'; // 左草莓粉 / 右藍莓藍
    return (
      <g transform={`translate(${x - 12}, ${y - 25})`} filter="url(#ghibliShadow)">
        <polygon points="6,20 18,20 12,38" fill="#d97706" stroke="#b45309" strokeWidth="1.2" />
        <circle cx="12" cy="15" r="9" fill={scoop1} stroke="#78350f" strokeWidth="1.2" />
        <circle cx="12" cy="5" r="8" fill={scoop2} stroke="#78350f" strokeWidth="1.2" />
        <circle cx="12" cy="-2" r="3" fill="#dc2626" />
      </g>
    );
  }

  if (variantKey === 'size') {
    const scale = isLeft ? 1.3 : 0.65;
    const dy = isLeft ? -6 : 10;
    return (
      <g transform={`translate(${x - 12}, ${y - 25 + dy}) scale(${scale})`} filter="url(#ghibliShadow)">
        <polygon points="6,20 18,20 12,38" fill="#d97706" stroke="#b45309" strokeWidth="1.2" />
        <circle cx="12" cy="15" r="9" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.2" />
        <circle cx="12" cy="5" r="8" fill="#f472b6" stroke="#db2777" strokeWidth="1.2" />
        <circle cx="12" cy="-2" r="3" fill="#dc2626" />
      </g>
    );
  }

  // Default
  return (
    <g transform={`translate(${x - 12}, ${y - 25})`} filter="url(#ghibliShadow)">
      <polygon points="6,20 18,20 12,38" fill="#d97706" stroke="#b45309" strokeWidth="1.2" />
      <circle cx="12" cy="15" r="9" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.2" />
      <circle cx="12" cy="5" r="8" fill="#f472b6" stroke="#db2777" strokeWidth="1.2" />
      <circle cx="12" cy="-2" r="3" fill="#dc2626" />
    </g>
  );
};

// 4. 月餅 (moon cake) - 咖啡桌 (765, 495)
export const renderMoonCakeSprite = (variantKey, isLeft) => {
  const x = 765;
  const y = 495;

  if (variantKey === 'presence') {
    return (
      <g transform={`translate(${x - 18}, ${y - 12})`} filter="url(#ghibliShadow)">
        <ellipse cx="18" cy="16" rx="18" ry="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        {isLeft && (
          <g transform="translate(6, 2)">
            <ellipse cx="12" cy="10" rx="12" ry="7" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
            <circle cx="12" cy="9" r="4.5" fill="#f59e0b" />
          </g>
        )}
      </g>
    );
  }

  if (variantKey === 'quantity') {
    return (
      <g transform={`translate(${x - 22}, ${y - 14})`} filter="url(#ghibliShadow)">
        <ellipse cx="22" cy="18" rx="22" ry="9" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <g transform="translate(4, 4)">
          <ellipse cx="10" cy="10" rx="10" ry="6" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="10" cy="9" r="4" fill="#f59e0b" />
        </g>
        {isLeft && (
          <g transform="translate(18, 4)">
            <ellipse cx="10" cy="10" rx="10" ry="6" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
            <circle cx="10" cy="9" r="4" fill="#f59e0b" />
          </g>
        )}
      </g>
    );
  }

  // Default
  return (
    <g transform={`translate(${x - 18}, ${y - 12})`} filter="url(#ghibliShadow)">
      <ellipse cx="18" cy="16" rx="18" ry="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      <g transform="translate(6, 2)">
        <ellipse cx="12" cy="10" rx="12" ry="7" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
        <circle cx="12" cy="9" r="4.5" fill="#f59e0b" />
      </g>
    </g>
  );
};

// 5. 西瓜 (watermelon) - 水果攤木箱 (315, 470)
export const renderWatermelonSprite = (variantKey, isLeft) => {
  const x = 315;
  const y = 470;

  if (variantKey === 'size') {
    const scale = isLeft ? 1.35 : 0.65;
    const dy = isLeft ? -6 : 8;
    return (
      <g transform={`translate(${x - 20}, ${y - 20 + dy}) scale(${scale})`} filter="url(#ghibliShadow)">
        <path d="M 4 28 A 20 20 0 0 0 36 28 Z" fill="#15803d" stroke="#14532d" strokeWidth="1.5" />
        <path d="M 6 26 A 18 18 0 0 0 34 26 Z" fill="#ffffff" />
        <path d="M 7 24 A 16 16 0 0 0 33 24 Z" fill="#ef4444" />
        <circle cx="16" cy="28" r="1.2" fill="#0f172a" />
        <circle cx="24" cy="28" r="1.2" fill="#0f172a" />
        <circle cx="20" cy="32" r="1.2" fill="#0f172a" />
      </g>
    );
  }

  if (variantKey === 'color') {
    const fleshColor = isLeft ? '#ef4444' : '#facc15'; // 左紅西瓜 / 右小玉黃西瓜
    return (
      <g transform={`translate(${x - 20}, ${y - 20})`} filter="url(#ghibliShadow)">
        <path d="M 4 28 A 20 20 0 0 0 36 28 Z" fill="#15803d" stroke="#14532d" strokeWidth="1.5" />
        <path d="M 6 26 A 18 18 0 0 0 34 26 Z" fill="#ffffff" />
        <path d="M 7 24 A 16 16 0 0 0 33 24 Z" fill={fleshColor} />
        <circle cx="16" cy="28" r="1.2" fill="#0f172a" />
        <circle cx="24" cy="28" r="1.2" fill="#0f172a" />
        <circle cx="20" cy="32" r="1.2" fill="#0f172a" />
      </g>
    );
  }

  // Default
  return (
    <g transform={`translate(${x - 20}, ${y - 20})`} filter="url(#ghibliShadow)">
      <path d="M 4 28 A 20 20 0 0 0 36 28 Z" fill="#15803d" stroke="#14532d" strokeWidth="1.5" />
      <path d="M 6 26 A 18 18 0 0 0 34 26 Z" fill="#ffffff" />
      <path d="M 7 24 A 16 16 0 0 0 33 24 Z" fill="#ef4444" />
      <circle cx="16" cy="28" r="1.2" fill="#0f172a" />
      <circle cx="24" cy="28" r="1.2" fill="#0f172a" />
      <circle cx="20" cy="32" r="1.2" fill="#0f172a" />
    </g>
  );
};

// 6. 漢堡 (hamburger) - 咖啡桌 (830, 510)
export const renderHamburgerSprite = (variantKey, isLeft) => {
  const x = 830;
  const y = 510;

  if (variantKey === 'presence') {
    return (
      <g transform={`translate(${x - 18}, ${y - 18})`} filter="url(#ghibliShadow)">
        <ellipse cx="18" cy="24" rx="20" ry="7" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        {isLeft && (
          <g transform="translate(3, 2)">
            <ellipse cx="15" cy="18" rx="13" ry="4" fill="#d97706" />
            <rect x="4" y="14" width="22" height="3.5" rx="1" fill="#451a03" />
            <polygon points="5,14 25,14 22,17 7,17" fill="#eab308" />
            <rect x="3" y="11" width="24" height="2.5" rx="1" fill="#22c55e" />
            <path d="M 3 11 A 12 9 0 0 1 27 11 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.2" />
            <circle cx="10" cy="6" r="0.8" fill="#ffffff" />
            <circle cx="16" cy="5" r="0.8" fill="#ffffff" />
            <circle cx="21" cy="7" r="0.8" fill="#ffffff" />
          </g>
        )}
      </g>
    );
  }

  if (variantKey === 'size') {
    const scale = isLeft ? 1.3 : 0.65;
    const dy = isLeft ? -6 : 8;
    return (
      <g transform={`translate(${x - 18}, ${y - 18 + dy}) scale(${scale})`} filter="url(#ghibliShadow)">
        <ellipse cx="18" cy="24" rx="20" ry="7" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <g transform="translate(3, 2)">
          <ellipse cx="15" cy="18" rx="13" ry="4" fill="#d97706" />
          <rect x="4" y="14" width="22" height="3.5" rx="1" fill="#451a03" />
          <polygon points="5,14 25,14 22,17 7,17" fill="#eab308" />
          <rect x="3" y="11" width="24" height="2.5" rx="1" fill="#22c55e" />
          <path d="M 3 11 A 12 9 0 0 1 27 11 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.2" />
        </g>
      </g>
    );
  }

  // Default
  return (
    <g transform={`translate(${x - 18}, ${y - 18})`} filter="url(#ghibliShadow)">
      <ellipse cx="18" cy="24" rx="20" ry="7" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      <g transform="translate(3, 2)">
        <ellipse cx="15" cy="18" rx="13" ry="4" fill="#d97706" />
        <rect x="4" y="14" width="22" height="3.5" rx="1" fill="#451a03" />
        <polygon points="5,14 25,14 22,17 7,17" fill="#eab308" />
        <rect x="3" y="11" width="24" height="2.5" rx="1" fill="#22c55e" />
        <path d="M 3 11 A 12 9 0 0 1 27 11 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.2" />
        <circle cx="10" cy="6" r="0.8" fill="#ffffff" />
        <circle cx="16" cy="5" r="0.8" fill="#ffffff" />
        <circle cx="21" cy="7" r="0.8" fill="#ffffff" />
      </g>
    </g>
  );
};

// 7. 蘋果 (apple) - 水果攤木箱 (345, 420)
export const renderAppleSprite = (variantKey, isLeft) => {
  const x = 345;
  const y = 420;

  if (variantKey === 'color') {
    const appleColor = isLeft ? '#ef4444' : '#22c55e'; // 左紅蘋果 / 右青蘋果
    return (
      <g transform={`translate(${x - 14}, ${y - 14})`} filter="url(#ghibliShadow)">
        <circle cx="14" cy="16" r="12" fill={appleColor} stroke="#7f1d1d" strokeWidth="1.2" />
        <path d="M 14 5 Q 16 0, 19 2" stroke="#78350f" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 15 5 Q 20 4, 18 8 Z" fill="#4ade80" />
      </g>
    );
  }

  if (variantKey === 'quantity') {
    return (
      <g transform={`translate(${x - 18}, ${y - 16})`} filter="url(#ghibliShadow)">
        <circle cx="12" cy="16" r="8" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.2" />
        <circle cx="24" cy="16" r="8" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.2" />
        {isLeft && (
          <>
            <circle cx="18" cy="8" r="8" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.2" />
            <circle cx="8" cy="24" r="6" fill="#ef4444" />
          </>
        )}
      </g>
    );
  }

  // Default: 紅蘋果
  return (
    <g transform={`translate(${x - 14}, ${y - 14})`} filter="url(#ghibliShadow)">
      <circle cx="14" cy="16" r="12" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.2" />
      <path d="M 14 5 Q 16 0, 19 2" stroke="#78350f" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 15 5 Q 20 4, 18 8 Z" fill="#4ade80" />
    </g>
  );
};

// 8. 熱狗 (hot dog) - 烘焙坊托盤 (85, 535)
export const renderHotDogSprite = (variantKey, isLeft) => {
  const x = 85;
  const y = 535;

  if (variantKey === 'presence') {
    return (
      <g transform={`translate(${x - 18}, ${y - 12})`} filter="url(#ghibliShadow)">
        <ellipse cx="18" cy="16" rx="18" ry="7" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
        {isLeft && (
          <g transform="translate(3, 4)">
            <rect x="0" y="4" width="28" height="9" rx="4.5" fill="#f59e0b" stroke="#b45309" strokeWidth="1.2" />
            <rect x="2" y="6" width="26" height="5" rx="2.5" fill="#dc2626" />
            <path d="M 4 8.5 Q 10 7, 16 9 T 26 8" stroke="#facc15" strokeWidth="1.8" fill="none" />
          </g>
        )}
      </g>
    );
  }

  if (variantKey === 'quantity') {
    return (
      <g transform={`translate(${x - 22}, ${y - 14})`} filter="url(#ghibliShadow)">
        <ellipse cx="22" cy="18" rx="22" ry="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
        <rect x="6" y="8" width="22" height="7" rx="3.5" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
        <rect x="8" y="9.5" width="20" height="4" rx="2" fill="#dc2626" />
        {isLeft && (
          <g transform="translate(14, -6)">
            <rect x="0" y="8" width="20" height="6" rx="3" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
            <rect x="2" y="9" width="18" height="3.5" rx="1.5" fill="#dc2626" />
          </g>
        )}
      </g>
    );
  }

  // Default
  return (
    <g transform={`translate(${x - 18}, ${y - 12})`} filter="url(#ghibliShadow)">
      <ellipse cx="18" cy="16" rx="18" ry="7" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
      <g transform="translate(3, 4)">
        <rect x="0" y="4" width="28" height="9" rx="4.5" fill="#f59e0b" stroke="#b45309" strokeWidth="1.2" />
        <rect x="2" y="6" width="26" height="5" rx="2.5" fill="#dc2626" />
        <path d="M 4 8.5 Q 10 7, 16 9 T 26 8" stroke="#facc15" strokeWidth="1.8" fill="none" />
      </g>
    </g>
  );
};

// 9. 香蕉 (banana) - 水果架 (415, 380) 或吊鉤 (415, 310)
export const renderBananaSprite = (variantKey, isLeft) => {
  const isMoved = variantKey === 'displacement' && !isLeft;
  const x = 415;
  const y = isMoved ? 310 : 380;

  if (variantKey === 'color') {
    const bananaColor = isLeft ? '#facc15' : '#84cc16'; // 左成熟黃 / 右青綠未熟
    return (
      <g transform={`translate(${x - 15}, ${y - 15})`} filter="url(#ghibliShadow)">
        <path d="M 5 6 Q 16 12, 26 5 Q 20 22, 6 18 Z" fill={bananaColor} stroke="#65a30d" strokeWidth="1.4" />
        <circle cx="5" cy="6" r="1.5" fill="#451a03" />
        <circle cx="26" cy="5" r="1.2" fill="#451a03" />
      </g>
    );
  }

  // Default & displacement
  return (
    <g transform={`translate(${x - 15}, ${y - 15})`} filter="url(#ghibliShadow)">
      {isMoved && (
        <line x1="15" y1="-15" x2="15" y2="4" stroke="#78350f" strokeWidth="2" strokeDasharray="2 2" />
      )}
      <path d="M 5 6 Q 16 12, 26 5 Q 20 22, 6 18 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1.4" />
      <circle cx="5" cy="6" r="1.5" fill="#451a03" />
      <circle cx="26" cy="5" r="1.2" fill="#451a03" />
    </g>
  );
};

// 10. 十六 (sixteen) - 烘焙坊門牌 (200, 250)
export const renderSixteenSprite = (variantKey, isLeft) => {
  const x = 200;
  const y = 250;

  if (variantKey === 'text') {
    const textNum = isLeft ? '16' : '20';
    return (
      <g transform={`translate(${x - 16}, ${y - 12})`} filter="url(#ghibliShadow)">
        <rect width="32" height="24" rx="5" fill="#fef08a" stroke="#b45309" strokeWidth="2" />
        <text x="16" y="17" fill="#78350f" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          {textNum}
        </text>
      </g>
    );
  }

  if (variantKey === 'color') {
    const bgColor = isLeft ? '#fef08a' : '#1e3a8a';
    const textColor = isLeft ? '#78350f' : '#ffffff';
    const borderColor = isLeft ? '#b45309' : '#3b82f6';
    return (
      <g transform={`translate(${x - 16}, ${y - 12})`} filter="url(#ghibliShadow)">
        <rect width="32" height="24" rx="5" fill={bgColor} stroke={borderColor} strokeWidth="2" />
        <text x="16" y="17" fill={textColor} fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          16
        </text>
      </g>
    );
  }

  // Default
  return (
    <g transform={`translate(${x - 16}, ${y - 12})`} filter="url(#ghibliShadow)">
      <rect width="32" height="24" rx="5" fill="#fef08a" stroke="#b45309" strokeWidth="2" />
      <text x="16" y="17" fill="#78350f" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        16
      </text>
    </g>
  );
};

// 11. 披薩 (pizza) - 廣場餐桌 (570, 450)
export const renderPizzaSprite = (variantKey, isLeft) => {
  const x = 570;
  const y = 450;

  if (variantKey === 'presence') {
    return (
      <g transform={`translate(${x - 18}, ${y - 16})`} filter="url(#ghibliShadow)">
        <ellipse cx="18" cy="20" rx="18" ry="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
        {isLeft && (
          <path d="M 6 18 L 28 8 A 14 14 0 0 1 28 26 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.4" />
        )}
      </g>
    );
  }

  if (variantKey === 'quantity') {
    return (
      <g transform={`translate(${x - 20}, ${y - 18})`} filter="url(#ghibliShadow)">
        <ellipse cx="20" cy="22" rx="20" ry="9" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
        <path d="M 8 20 L 28 10 A 12 12 0 0 1 28 24 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.2" />
        {isLeft && (
          <path d="M 6 14 L 22 4 A 12 12 0 0 1 22 18 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.2" />
        )}
      </g>
    );
  }

  // Default
  return (
    <g transform={`translate(${x - 18}, ${y - 16})`} filter="url(#ghibliShadow)">
      <ellipse cx="18" cy="20" rx="18" ry="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
      <path d="M 6 18 L 28 8 A 14 14 0 0 1 28 26 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.4" />
      <circle cx="18" cy="17" r="2.5" fill="#dc2626" />
      <circle cx="23" cy="14" r="2" fill="#dc2626" />
    </g>
  );
};

// 12. 蛋糕 (cake) - 烘焙坊展櫃 (195, 425)
export const renderCakeSprite = (variantKey, isLeft) => {
  const x = 195;
  const y = 425;

  if (variantKey === 'color') {
    const cakeColor = isLeft ? '#f472b6' : '#451a03'; // 左粉紅草莓奶油 / 右黑巧克力
    const frostColor = isLeft ? '#ffffff' : '#78350f';
    return (
      <g transform={`translate(${x - 18}, ${y - 20})`} filter="url(#ghibliShadow)">
        <rect x="4" y="16" width="28" height="18" rx="3" fill={cakeColor} stroke="#78350f" strokeWidth="1.5" />
        <rect x="2" y="13" width="32" height="5" rx="2" fill={frostColor} />
        <circle cx="10" cy="10" r="3" fill="#dc2626" />
        <circle cx="18" cy="9" r="3" fill="#dc2626" />
        <circle cx="26" cy="10" r="3" fill="#dc2626" />
      </g>
    );
  }

  if (variantKey === 'presence') {
    return (
      <g transform={`translate(${x - 18}, ${y - 20})`} filter="url(#ghibliShadow)">
        <ellipse cx="18" cy="34" rx="18" ry="5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.4" />
        {isLeft && (
          <g>
            <rect x="4" y="16" width="28" height="18" rx="3" fill="#f472b6" stroke="#db2777" strokeWidth="1.5" />
            <rect x="2" y="13" width="32" height="5" rx="2" fill="#ffffff" />
            <circle cx="18" cy="9" r="3.5" fill="#dc2626" />
          </g>
        )}
      </g>
    );
  }

  // Default
  return (
    <g transform={`translate(${x - 18}, ${y - 20})`} filter="url(#ghibliShadow)">
      <rect x="4" y="16" width="28" height="18" rx="3" fill="#f472b6" stroke="#db2777" strokeWidth="1.5" />
      <rect x="2" y="13" width="32" height="5" rx="2" fill="#ffffff" />
      <circle cx="10" cy="10" r="3" fill="#dc2626" />
      <circle cx="18" cy="9" r="3" fill="#dc2626" />
      <circle cx="26" cy="10" r="3" fill="#dc2626" />
    </g>
  );
};

// 13. 三明治 (sandwich) - 烘焙坊櫃台 (130, 455)
export const renderSandwichSprite = (variantKey, isLeft) => {
  const x = 130;
  const y = 455;

  if (variantKey === 'presence') {
    return (
      <g transform={`translate(${x - 16}, ${y - 14})`} filter="url(#ghibliShadow)">
        <ellipse cx="16" cy="18" rx="16" ry="6" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.2" />
        {isLeft && (
          <g>
            <polygon points="4,18 28,18 16,4" fill="#fde68a" stroke="#d97706" strokeWidth="1.4" />
            <polygon points="7,17 25,17 16,6" fill="#22c55e" opacity="0.8" />
            <polygon points="8,16 23,16 16,8" fill="#ef4444" opacity="0.8" />
          </g>
        )}
      </g>
    );
  }

  if (variantKey === 'quantity') {
    return (
      <g transform={`translate(${x - 18}, ${y - 16})`} filter="url(#ghibliShadow)">
        <ellipse cx="18" cy="20" rx="18" ry="7" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.2" />
        <polygon points="4,20 24,20 14,7" fill="#fde68a" stroke="#d97706" strokeWidth="1.2" />
        {isLeft && (
          <polygon points="12,18 32,18 22,5" fill="#fde68a" stroke="#d97706" strokeWidth="1.2" />
        )}
      </g>
    );
  }

  // Default
  return (
    <g transform={`translate(${x - 16}, ${y - 14})`} filter="url(#ghibliShadow)">
      <ellipse cx="16" cy="18" rx="16" ry="6" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.2" />
      <polygon points="4,18 28,18 16,4" fill="#fde68a" stroke="#d97706" strokeWidth="1.4" />
      <polygon points="7,17 25,17 16,6" fill="#22c55e" opacity="0.8" />
      <polygon points="8,16 23,16 16,8" fill="#ef4444" opacity="0.8" />
    </g>
  );
};

// 14. 牛奶 (milk) - 咖啡邊桌 (735, 450)
export const renderMilkSprite = (variantKey, isLeft) => {
  const x = 735;
  const y = 450;

  if (variantKey === 'color') {
    const milkColor = isLeft ? '#ffffff' : '#f472b6'; // 左純白鮮乳 / 右粉紅草莓調味乳
    return (
      <g transform={`translate(${x - 10}, ${y - 20})`} filter="url(#ghibliShadow)">
        <path d="M 6 8 L 14 8 L 17 14 L 17 38 L 3 38 L 3 14 Z" fill={milkColor} stroke="#64748b" strokeWidth="1.5" />
        <rect x="7" y="4" width="6" height="4" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
        <rect x="5" y="20" width="10" height="10" rx="1" fill="#3b82f6" opacity="0.75" />
      </g>
    );
  }

  if (variantKey === 'presence') {
    return (
      <g transform={`translate(${x - 10}, ${y - 20})`} filter="url(#ghibliShadow)">
        <path d="M 6 8 L 14 8 L 17 14 L 17 38 L 3 38 L 3 14 Z" fill={isLeft ? '#ffffff' : 'rgba(255,255,255,0.2)'} stroke="#64748b" strokeWidth="1.5" />
        <rect x="7" y="4" width="6" height="4" fill={isLeft ? '#ef4444' : '#94a3b8'} />
        {isLeft && <rect x="5" y="20" width="10" height="10" rx="1" fill="#3b82f6" opacity="0.75" />}
      </g>
    );
  }

  // Default: 純白鮮乳
  return (
    <g transform={`translate(${x - 10}, ${y - 20})`} filter="url(#ghibliShadow)">
      <path d="M 6 8 L 14 8 L 17 14 L 17 38 L 3 38 L 3 14 Z" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
      <rect x="7" y="4" width="6" height="4" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
      <rect x="5" y="20" width="10" height="10" rx="1" fill="#3b82f6" opacity="0.75" />
    </g>
  );
};

// 15. 水 (water) - 咖啡桌 (795, 460)
export const renderWaterSprite = (variantKey, isLeft) => {
  const x = 795;
  const y = 460;

  if (variantKey === 'color') {
    const waterColor = isLeft ? '#38bdf8' : '#a855f7'; // 左清澈純水 / 右蝶豆花紫水
    return (
      <g transform={`translate(${x - 11}, ${y - 18})`} filter="url(#ghibliShadow)">
        <path d="M 3 2 L 19 2 L 17 32 L 5 32 Z" fill="rgba(255,255,255,0.3)" stroke="#64748b" strokeWidth="1.4" />
        <path d="M 4 8 L 18 8 L 16.5 31 L 5.5 31 Z" fill={waterColor} opacity="0.8" />
        <circle cx="11" cy="18" r="3.5" fill="#fde047" stroke="#ca8a04" strokeWidth="0.8" />
      </g>
    );
  }

  if (variantKey === 'presence') {
    return (
      <g transform={`translate(${x - 11}, ${y - 18})`} filter="url(#ghibliShadow)">
        <path d="M 3 2 L 19 2 L 17 32 L 5 32 Z" fill="rgba(255,255,255,0.3)" stroke="#64748b" strokeWidth="1.4" />
        {isLeft && (
          <>
            <path d="M 4 8 L 18 8 L 16.5 31 L 5.5 31 Z" fill="#38bdf8" opacity="0.8" />
            <circle cx="11" cy="18" r="3.5" fill="#fde047" stroke="#ca8a04" strokeWidth="0.8" />
          </>
        )}
      </g>
    );
  }

  // Default
  return (
    <g transform={`translate(${x - 11}, ${y - 18})`} filter="url(#ghibliShadow)">
      <path d="M 3 2 L 19 2 L 17 32 L 5 32 Z" fill="rgba(255,255,255,0.3)" stroke="#64748b" strokeWidth="1.4" />
      <path d="M 4 8 L 18 8 L 16.5 31 L 5.5 31 Z" fill="#38bdf8" opacity="0.8" />
      <circle cx="11" cy="18" r="3.5" fill="#fde047" stroke="#ca8a04" strokeWidth="0.8" />
    </g>
  );
};

// 16. 柳橙 (orange) - 水果攤編織籃 (385, 455)
export const renderOrangeSprite = (variantKey, isLeft) => {
  const x = 385;
  const y = 455;

  if (variantKey === 'presence') {
    return (
      <g transform={`translate(${x - 16}, ${y - 14})`} filter="url(#ghibliShadow)">
        <ellipse cx="16" cy="18" rx="16" ry="8" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
        {isLeft && (
          <circle cx="16" cy="12" r="10" fill="#f97316" stroke="#c2410c" strokeWidth="1.2" />
        )}
      </g>
    );
  }

  if (variantKey === 'quantity') {
    return (
      <g transform={`translate(${x - 18}, ${y - 16})`} filter="url(#ghibliShadow)">
        <ellipse cx="18" cy="20" rx="18" ry="8" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
        <circle cx="12" cy="14" r="8" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
        {isLeft && (
          <>
            <circle cx="24" cy="14" r="8" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
            <circle cx="18" cy="7" r="7.5" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
          </>
        )}
      </g>
    );
  }

  // Default
  return (
    <g transform={`translate(${x - 16}, ${y - 14})`} filter="url(#ghibliShadow)">
      <ellipse cx="16" cy="18" rx="16" ry="8" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
      <circle cx="16" cy="12" r="10" fill="#f97316" stroke="#c2410c" strokeWidth="1.2" />
      <circle cx="16" cy="5" r="1.5" fill="#15803d" />
    </g>
  );
};

// 17. 柚子 (pomelo) - 水果攤木箱旁 (415, 490)
export const renderPomeloSprite = (variantKey, isLeft) => {
  const x = 415;
  const y = 490;

  if (variantKey === 'size') {
    const scale = isLeft ? 1.35 : 0.65;
    const dy = isLeft ? -5 : 8;
    return (
      <g transform={`translate(${x - 14}, ${y - 18 + dy}) scale(${scale})`} filter="url(#ghibliShadow)">
        <path d="M 14 3 C 24 3, 27 28, 14 28 C 1 28, 4 3, 14 3 Z" fill="#84cc16" stroke="#4d7c0f" strokeWidth="1.4" />
        <circle cx="14" cy="4" r="1.5" fill="#365314" />
      </g>
    );
  }

  if (variantKey === 'presence') {
    return (
      <g transform={`translate(${x - 14}, ${y - 18})`} filter="url(#ghibliShadow)">
        {isLeft && (
          <>
            <path d="M 14 3 C 24 3, 27 28, 14 28 C 1 28, 4 3, 14 3 Z" fill="#84cc16" stroke="#4d7c0f" strokeWidth="1.4" />
            <circle cx="14" cy="4" r="1.5" fill="#365314" />
          </>
        )}
      </g>
    );
  }

  // Default
  return (
    <g transform={`translate(${x - 14}, ${y - 18})`} filter="url(#ghibliShadow)">
      <path d="M 14 3 C 24 3, 27 28, 14 28 C 1 28, 4 3, 14 3 Z" fill="#84cc16" stroke="#4d7c0f" strokeWidth="1.4" />
      <circle cx="14" cy="4" r="1.5" fill="#365314" />
    </g>
  );
};

// 18. 米飯 (rice) - 廣場餐桌 (520, 465)
export const renderRiceSprite = (variantKey, isLeft) => {
  const x = 520;
  const y = 465;

  if (variantKey === 'presence') {
    return (
      <g transform={`translate(${x - 16}, ${y - 14})`} filter="url(#ghibliShadow)">
        <path d="M 4 14 C 4 28, 28 28, 28 14 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
        {isLeft && (
          <ellipse cx="16" cy="12" rx="11" ry="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
        )}
      </g>
    );
  }

  if (variantKey === 'quantity') {
    return (
      <g transform={`translate(${x - 18}, ${y - 16})`} filter="url(#ghibliShadow)">
        <polygon points="4,20 18,20 11,8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.4" />
        <rect x="8" y="14" width="6" height="6" fill="#0f172a" />
        {isLeft && (
          <g transform="translate(14, 0)">
            <polygon points="4,20 18,20 11,8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.4" />
            <rect x="8" y="14" width="6" height="6" fill="#0f172a" />
          </g>
        )}
      </g>
    );
  }

  // Default
  return (
    <g transform={`translate(${x - 16}, ${y - 14})`} filter="url(#ghibliShadow)">
      <path d="M 4 14 C 4 28, 28 28, 28 14 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
      <ellipse cx="16" cy="12" rx="11" ry="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
      <rect x="13" y="9" width="6" height="3" fill="#0f172a" />
    </g>
  );
};

// 19. 晴天太陽 (sunny) - 天空 (440, 65)
export const renderSunnySprite = (variantKey, isLeft) => {
  const x = 440;
  const y = 65;

  if (variantKey === 'symbol') {
    const isSunglasses = !isLeft; // 右圖戴墨鏡
    return (
      <g transform={`translate(${x}, ${y})`}>
        {/* 光芒 */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
          <line
            key={deg}
            x1="0"
            y1="0"
            x2="0"
            y2="-26"
            stroke="#f59e0b"
            strokeWidth="3.5"
            strokeLinecap="round"
            transform={`rotate(${deg})`}
          />
        ))}
        {/* 太陽本體 */}
        <circle cx="0" cy="0" r="17" fill="#facc15" stroke="#d97706" strokeWidth="2" />
        {isSunglasses ? (
          /* 黑色酷墨鏡 */
          <g transform="translate(-10, -5)">
            <rect x="0" y="0" width="8" height="6" rx="1.5" fill="#0f172a" />
            <rect x="12" y="0" width="8" height="6" rx="1.5" fill="#0f172a" />
            <line x1="8" y1="2" x2="12" y2="2" stroke="#0f172a" strokeWidth="2" />
            <path d="M 5 8 Q 10 13, 15 8" stroke="#78350f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </g>
        ) : (
          /* 露齒微笑 */
          <g>
            <circle cx="-5" cy="-3" r="2" fill="#78350f" />
            <circle cx="5" cy="-3" r="2" fill="#78350f" />
            <circle cx="-9" cy="2" r="2.5" fill="#f87171" opacity="0.8" />
            <circle cx="9" cy="2" r="2.5" fill="#f87171" opacity="0.8" />
            <path d="M -6 4 Q 0 11, 6 4 Z" fill="#ef4444" stroke="#78350f" strokeWidth="1" />
          </g>
        )}
      </g>
    );
  }

  if (variantKey === 'color') {
    const sunColor = isLeft ? '#facc15' : '#ef4444'; // 左金黃 / 右火紅夕陽
    const beamColor = isLeft ? '#f59e0b' : '#b91c1c';
    return (
      <g transform={`translate(${x}, ${y})`}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
          <line
            key={deg}
            x1="0"
            y1="0"
            x2="0"
            y2="-26"
            stroke={beamColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle cx="0" cy="0" r="17" fill={sunColor} stroke={beamColor} strokeWidth="2" />
      </g>
    );
  }

  // Default
  return (
    <g transform={`translate(${x}, ${y})`}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
        <line
          key={deg}
          x1="0"
          y1="0"
          x2="0"
          y2="-26"
          stroke="#f59e0b"
          strokeWidth="3.5"
          strokeLinecap="round"
          transform={`rotate(${deg})`}
        />
      ))}
      <circle cx="0" cy="0" r="17" fill="#facc15" stroke="#d97706" strokeWidth="2" />
      <circle cx="-5" cy="-3" r="2" fill="#78350f" />
      <circle cx="5" cy="-3" r="2" fill="#78350f" />
      <path d="M -6 4 Q 0 11, 6 4 Z" fill="#ef4444" stroke="#78350f" strokeWidth="1" />
    </g>
  );
};

// 20. 多雲 (cloudy) - 天空 (630, 75)
export const renderCloudySprite = (variantKey, isLeft) => {
  const x = 630;
  const y = 75;

  if (variantKey === 'quantity') {
    return (
      <g transform={`translate(${x - 25}, ${y - 18})`}>
        <path d="M 10 20 A 10 10 0 0 1 28 12 A 14 14 0 0 1 48 16 A 10 10 0 0 1 48 28 L 10 28 Z" fill="#ffffff" opacity="0.9" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
        {isLeft && (
          <path d="M 35 10 A 7 7 0 0 1 48 4 A 10 10 0 0 1 62 8 A 7 7 0 0 1 62 18 L 35 18 Z" fill="#ffffff" opacity="0.85" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
        )}
      </g>
    );
  }

  if (variantKey === 'color') {
    const cloudColor = isLeft ? '#ffffff' : '#64748b'; // 左白雲 / 右暗灰雨雲
    return (
      <g transform={`translate(${x - 25}, ${y - 18})`}>
        <path d="M 10 20 A 10 10 0 0 1 28 12 A 14 14 0 0 1 48 16 A 10 10 0 0 1 48 28 L 10 28 Z" fill={cloudColor} opacity="0.92" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
      </g>
    );
  }

  // Default
  return (
    <g transform={`translate(${x - 25}, ${y - 18})`}>
      <path d="M 10 20 A 10 10 0 0 1 28 12 A 14 14 0 0 1 48 16 A 10 10 0 0 1 48 28 L 10 28 Z" fill="#ffffff" opacity="0.9" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
      <path d="M 35 10 A 7 7 0 0 1 48 4 A 10 10 0 0 1 62 8 A 7 7 0 0 1 62 18 L 35 18 Z" fill="#ffffff" opacity="0.85" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
    </g>
  );
};

// ── 20 大目標單字繪製映射表 ──
export const SPRITE_RENDERERS = {
  juice: renderJuiceSprite,
  tea: renderTeaSprite,
  'ice cream': renderIceCreamSprite,
  'moon cake': renderMoonCakeSprite,
  watermelon: renderWatermelonSprite,
  hamburger: renderHamburgerSprite,
  apple: renderAppleSprite,
  'hot dog': renderHotDogSprite,
  banana: renderBananaSprite,
  sixteen: renderSixteenSprite,
  pizza: renderPizzaSprite,
  cake: renderCakeSprite,
  sandwich: renderSandwichSprite,
  milk: renderMilkSprite,
  water: renderWaterSprite,
  orange: renderOrangeSprite,
  pomelo: renderPomeloSprite,
  rice: renderRiceSprite,
  sunny: renderSunnySprite,
  cloudy: renderCloudySprite
};
