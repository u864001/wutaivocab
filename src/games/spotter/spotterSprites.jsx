import React from 'react';

// ── 《鷹眼神探 • 單字找不同》 20 大目標單字向量精靈圖庫 (Sprite Atlas) ──
// 每個單字包含：default（未被抽中時，左右完全一致）與多元 variants（抽中為相異處時，依據 isLeft 呈現差異）

// 1. 果汁 (juice) - 位置: (320, 435)
export const renderJuiceSprite = (variantKey, isLeft) => {
  // 差異樣態：
  // 'color': 左綠奇異果汁 / 右紅西瓜汁
  // 'size': 左大杯巨無霸 / 右小迷你杯
  // 'presence': 左滿杯帶吸管 / 右空杯
  // 'quantity': 左2杯 / 右1杯
  if (variantKey === 'color') {
    const liquidColor = isLeft ? '#10b981' : '#ef4444';
    const strawColor = isLeft ? '#facc15' : '#10b981';
    return (
      <g transform="translate(308, 420)">
        <path d="M 5 5 L 25 5 L 22 38 L 8 38 Z" fill="none" stroke="#64748b" strokeWidth="1.5" />
        <path d="M 6 12 L 24 12 L 21.5 37 L 8.5 37 Z" fill={liquidColor} opacity="0.9" />
        <line x1="12" y1="-2" x2="20" y2="35" stroke={strawColor} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="7" cy="6" r="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
      </g>
    );
  }
  if (variantKey === 'size') {
    const scale = isLeft ? 1.3 : 0.7;
    return (
      <g transform={`translate(310, 422) scale(${scale})`}>
        <path d="M 5 5 L 25 5 L 22 38 L 8 38 Z" fill="none" stroke="#64748b" strokeWidth="1.5" />
        <path d="M 6 12 L 24 12 L 21.5 37 L 8.5 37 Z" fill="#f97316" opacity="0.9" />
        <line x1="12" y1="-2" x2="20" y2="35" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    );
  }
  if (variantKey === 'presence') {
    return (
      <g transform="translate(308, 420)">
        <path d="M 5 5 L 25 5 L 22 38 L 8 38 Z" fill="none" stroke="#64748b" strokeWidth="1.5" />
        {isLeft ? (
          <>
            <path d="M 6 12 L 24 12 L 21.5 37 L 8.5 37 Z" fill="#06b6d4" opacity="0.9" />
            <line x1="12" y1="-2" x2="20" y2="35" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : null}
      </g>
    );
  }
  // Default (未抽中：左右均為經典柳橙汁)
  return (
    <g transform="translate(308, 420)">
      <path d="M 5 5 L 25 5 L 22 38 L 8 38 Z" fill="none" stroke="#64748b" strokeWidth="1.5" />
      <path d="M 6 12 L 24 12 L 21.5 37 L 8.5 37 Z" fill="#f59e0b" opacity="0.9" />
      <line x1="12" y1="-2" x2="20" y2="35" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="7" cy="6" r="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
    </g>
  );
};

// 2. 茶壺 (tea) - 位置: (235, 460)
export const renderTeaSprite = (variantKey, isLeft) => {
  if (variantKey === 'color') {
    const potColor = isLeft ? '#f59e0b' : '#8b5cf6';
    return (
      <g transform="translate(220, 442)">
        <ellipse cx="20" cy="22" rx="16" ry="14" fill={potColor} stroke="#78350f" strokeWidth="1.8" />
        <ellipse cx="20" cy="8" rx="8" ry="3" fill="#ffffff" stroke="#78350f" strokeWidth="1.5" />
        <circle cx="20" cy="5" r="2" fill={potColor} />
        <path d="M 5 16 Q -5 20, 5 28" stroke="#78350f" strokeWidth="3" fill="none" />
        <path d="M 33 16 Q 42 12, 38 24" stroke="#78350f" strokeWidth="3" fill="none" />
      </g>
    );
  }
  if (variantKey === 'size') {
    const scale = isLeft ? 1.3 : 0.75;
    return (
      <g transform={`translate(222, 445) scale(${scale})`}>
        <ellipse cx="20" cy="22" rx="16" ry="14" fill="#0d9488" stroke="#134e4a" strokeWidth="1.8" />
        <ellipse cx="20" cy="8" rx="8" ry="3" fill="#ffffff" stroke="#134e4a" strokeWidth="1.5" />
        <path d="M 5 16 Q -5 20, 5 28" stroke="#134e4a" strokeWidth="3" fill="none" />
        <path d="M 33 16 Q 42 12, 38 24" stroke="#134e4a" strokeWidth="3" fill="none" />
      </g>
    );
  }
  if (variantKey === 'presence') {
    return (
      <g transform="translate(220, 442)">
        {isLeft ? (
          <>
            <ellipse cx="20" cy="22" rx="16" ry="14" fill="#d97706" stroke="#78350f" strokeWidth="1.8" />
            <ellipse cx="20" cy="8" rx="8" ry="3" fill="#ffffff" stroke="#78350f" strokeWidth="1.5" />
            <path d="M 5 16 Q -5 20, 5 28" stroke="#78350f" strokeWidth="3" fill="none" />
            <path d="M 33 16 Q 42 12, 38 24" stroke="#78350f" strokeWidth="3" fill="none" />
          </>
        ) : (
          <ellipse cx="20" cy="26" rx="8" ry="5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
        )}
      </g>
    );
  }
  // Default
  return (
    <g transform="translate(220, 442)">
      <ellipse cx="20" cy="22" rx="16" ry="14" fill="#b45309" stroke="#78350f" strokeWidth="1.8" />
      <ellipse cx="20" cy="8" rx="8" ry="3" fill="#ffffff" stroke="#78350f" strokeWidth="1.5" />
      <circle cx="20" cy="5" r="2" fill="#d97706" />
      <path d="M 5 16 Q -5 20, 5 28" stroke="#78350f" strokeWidth="3" fill="none" />
      <path d="M 33 16 Q 42 12, 38 24" stroke="#78350f" strokeWidth="3" fill="none" />
    </g>
  );
};

// 3. 冰淇淋 (ice cream) - 位置: (830, 395)
export const renderIceCreamSprite = (variantKey, isLeft) => {
  if (variantKey === 'presence') {
    return (
      <g transform="translate(820, 375)">
        <path d="M -5 18 L 15 18 L 10 28 L 0 28 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
        {isLeft && (
          <g transform="translate(5, -5)">
            <polygon points="0,22 10,22 5,42" fill="#d97706" stroke="#b45309" strokeWidth="1" />
            <circle cx="5" cy="16" r="8" fill="#a7f3d0" />
            <circle cx="5" cy="6" r="7" fill="#f472b6" />
            <circle cx="5" cy="-1" r="2.5" fill="#dc2626" />
          </g>
        )}
      </g>
    );
  }
  if (variantKey === 'color') {
    const scoop1 = isLeft ? '#a7f3d0' : '#fde047';
    const scoop2 = isLeft ? '#f472b6' : '#60a5fa';
    return (
      <g transform="translate(825, 370)">
        <polygon points="0,22 10,22 5,42" fill="#d97706" stroke="#b45309" strokeWidth="1" />
        <circle cx="5" cy="16" r="8" fill={scoop1} />
        <circle cx="5" cy="6" r="7" fill={scoop2} />
        <circle cx="5" cy="-1" r="2.5" fill="#dc2626" />
      </g>
    );
  }
  if (variantKey === 'size') {
    const scale = isLeft ? 1.3 : 0.7;
    return (
      <g transform={`translate(825, 375) scale(${scale})`}>
        <polygon points="0,22 10,22 5,42" fill="#d97706" stroke="#b45309" strokeWidth="1" />
        <circle cx="5" cy="16" r="8" fill="#fed7aa" />
        <circle cx="5" cy="6" r="7" fill="#f472b6" />
      </g>
    );
  }
  // Default
  return (
    <g transform="translate(825, 370)">
      <polygon points="0,22 10,22 5,42" fill="#d97706" stroke="#b45309" strokeWidth="1" />
      <circle cx="5" cy="16" r="8" fill="#fef08a" />
      <circle cx="5" cy="6" r="7" fill="#f472b6" />
      <circle cx="5" cy="-1" r="2.5" fill="#dc2626" />
    </g>
  );
};

// 4. 月餅 (moon cake) - 位置: (645, 450)
export const renderMoonCakeSprite = (variantKey, isLeft) => {
  if (variantKey === 'presence') {
    return (
      <g transform="translate(625, 440)">
        <ellipse cx="20" cy="18" rx="22" ry="9" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
        {isLeft && (
          <g transform="translate(10, 5)">
            <ellipse cx="10" cy="10" rx="12" ry="8" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
            <circle cx="10" cy="9" r="3" stroke="#fef08a" strokeWidth="1" fill="none" />
          </g>
        )}
      </g>
    );
  }
  if (variantKey === 'quantity') {
    return (
      <g transform="translate(625, 440)">
        <ellipse cx="20" cy="18" rx="22" ry="9" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
        <g transform="translate(6, 5)">
          <ellipse cx="10" cy="10" rx="9" ry="6" fill="#b45309" />
        </g>
        {isLeft && (
          <g transform="translate(18, 5)">
            <ellipse cx="10" cy="10" rx="9" ry="6" fill="#b45309" />
          </g>
        )}
      </g>
    );
  }
  // Default
  return (
    <g transform="translate(625, 440)">
      <ellipse cx="20" cy="18" rx="22" ry="9" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
      <g transform="translate(10, 5)">
        <ellipse cx="10" cy="10" rx="12" ry="8" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
        <circle cx="10" cy="9" r="3" stroke="#fef08a" strokeWidth="1" fill="none" />
      </g>
    </g>
  );
};

// 5. 西瓜 (watermelon) - 位置: (135, 485)
export const renderWatermelonSprite = (variantKey, isLeft) => {
  if (variantKey === 'size') {
    const scale = isLeft ? 1.25 : 0.65;
    return (
      <g transform={`translate(135, 485) scale(${scale})`}>
        <circle cx="0" cy="0" r="26" fill="#15803d" stroke="#14532d" strokeWidth="2" />
        <path d="M -13 -22 Q -9 0, -13 22" stroke="#052e16" strokeWidth="3.5" fill="none" />
        <path d="M 0 -26 Q 3 0, 0 26" stroke="#052e16" strokeWidth="3.5" fill="none" />
        <path d="M 13 -22 Q 9 0, 13 22" stroke="#052e16" strokeWidth="3.5" fill="none" />
      </g>
    );
  }
  if (variantKey === 'color') {
    const fleshColor = isLeft ? '#ef4444' : '#facc15';
    return (
      <g transform="translate(135, 485)">
        <path d="M -22 10 A 22 22 0 0 0 22 10 Z" fill="#15803d" />
        <path d="M -19 8 A 19 19 0 0 0 19 8 Z" fill={fleshColor} />
        <circle cx="-6" cy="4" r="1.5" fill="#000" />
        <circle cx="6" cy="4" r="1.5" fill="#000" />
      </g>
    );
  }
  // Default
  return (
    <g transform="translate(135, 485)">
      <circle cx="0" cy="0" r="22" fill="#15803d" stroke="#14532d" strokeWidth="2" />
      <path d="M -11 -18 Q -8 0, -11 18" stroke="#052e16" strokeWidth="3" fill="none" />
      <path d="M 0 -22 Q 2 0, 0 22" stroke="#052e16" strokeWidth="3" fill="none" />
      <path d="M 11 -18 Q 8 0, 11 18" stroke="#052e16" strokeWidth="3" fill="none" />
    </g>
  );
};

// 6. 漢堡 (hamburger) - 位置: (485, 445)
export const renderHamburgerSprite = (variantKey, isLeft) => {
  if (variantKey === 'size') {
    const scale = isLeft ? 1.25 : 0.7;
    return (
      <g transform={`translate(485, 445) scale(${scale})`}>
        <ellipse cx="0" cy="-12" rx="16" ry="10" fill="#d97706" />
        <ellipse cx="-3" cy="-14" rx="1.5" ry="0.8" fill="#fef3c7" />
        <ellipse cx="3" cy="-13" rx="1.5" ry="0.8" fill="#fef3c7" />
        <rect x="-14" y="-4" width="28" height="3" fill="#22c55e" rx="1.5" />
        <rect x="-13" y="-1" width="26" height="4" fill="#78350f" rx="1.5" />
        <polygon points="-8,3 8,3 4,7" fill="#facc15" />
        <rect x="-13" y="5" width="26" height="4" fill="#78350f" rx="1.5" />
        <ellipse cx="0" cy="11" rx="15" ry="5" fill="#d97706" />
      </g>
    );
  }
  if (variantKey === 'presence') {
    return (
      <g transform="translate(485, 445)">
        {isLeft ? (
          <>
            <ellipse cx="0" cy="-8" rx="14" ry="8" fill="#d97706" />
            <rect x="-12" y="-1" width="24" height="3" fill="#22c55e" />
            <rect x="-12" y="2" width="24" height="4" fill="#78350f" />
            <ellipse cx="0" cy="8" rx="13" ry="5" fill="#d97706" />
          </>
        ) : (
          <ellipse cx="0" cy="8" rx="16" ry="4" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
        )}
      </g>
    );
  }
  // Default
  return (
    <g transform="translate(485, 445)">
      <ellipse cx="0" cy="-8" rx="14" ry="8" fill="#d97706" />
      <rect x="-12" y="-1" width="24" height="3" fill="#22c55e" />
      <rect x="-12" y="2" width="24" height="4" fill="#78350f" />
      <ellipse cx="0" cy="8" rx="13" ry="5" fill="#d97706" />
    </g>
  );
};

// 7. 蘋果 (apple) - 位置: (85, 410)
export const renderAppleSprite = (variantKey, isLeft) => {
  if (variantKey === 'quantity') {
    return (
      <g transform="translate(60, 395)">
        <rect x="0" y="0" width="55" height="32" rx="4" fill="#a16207" stroke="#713f12" strokeWidth="2" />
        {isLeft ? (
          <g>
            <circle cx="12" cy="16" r="8" fill="#dc2626" />
            <circle cx="27" cy="16" r="8" fill="#ef4444" />
            <circle cx="42" cy="16" r="8" fill="#dc2626" />
            <circle cx="20" cy="7" r="7.5" fill="#f87171" />
            <circle cx="34" cy="7" r="7.5" fill="#ef4444" />
          </g>
        ) : (
          <g>
            <circle cx="18" cy="18" r="8" fill="#dc2626" />
            <circle cx="36" cy="18" r="8" fill="#ef4444" />
          </g>
        )}
      </g>
    );
  }
  if (variantKey === 'color') {
    const appleColor = isLeft ? '#dc2626' : '#22c55e';
    return (
      <g transform="translate(60, 395)">
        <rect x="0" y="0" width="55" height="32" rx="4" fill="#a16207" stroke="#713f12" strokeWidth="2" />
        <circle cx="16" cy="16" r="8" fill={appleColor} />
        <circle cx="38" cy="16" r="8" fill={appleColor} />
        <circle cx="27" cy="8" r="7.5" fill={appleColor} />
      </g>
    );
  }
  // Default
  return (
    <g transform="translate(60, 395)">
      <rect x="0" y="0" width="55" height="32" rx="4" fill="#a16207" stroke="#713f12" strokeWidth="2" />
      <circle cx="16" cy="16" r="8" fill="#dc2626" />
      <circle cx="38" cy="16" r="8" fill="#ef4444" />
      <circle cx="27" cy="8" r="7.5" fill="#dc2626" />
    </g>
  );
};

// 8. 熱狗 (hot dog) - 位置: (745, 450)
export const renderHotDogSprite = (variantKey, isLeft) => {
  if (variantKey === 'quantity') {
    return (
      <g transform="translate(715, 430)">
        <rect x="0" y="15" width="60" height="25" rx="3" fill="#334155" />
        {isLeft ? (
          <g>
            <ellipse cx="12" cy="10" rx="8" ry="4" fill="#d97706" />
            <rect x="5" y="8" width="14" height="4" fill="#dc2626" rx="2" />
            <ellipse cx="30" cy="10" rx="8" ry="4" fill="#d97706" />
            <rect x="23" y="8" width="14" height="4" fill="#dc2626" rx="2" />
            <ellipse cx="48" cy="10" rx="8" ry="4" fill="#d97706" />
            <rect x="41" y="8" width="14" height="4" fill="#dc2626" rx="2" />
          </g>
        ) : (
          <g>
            <ellipse cx="30" cy="10" rx="8" ry="4" fill="#d97706" />
            <rect x="23" y="8" width="14" height="4" fill="#dc2626" rx="2" />
          </g>
        )}
      </g>
    );
  }
  if (variantKey === 'presence') {
    return (
      <g transform="translate(715, 430)">
        <rect x="0" y="15" width="60" height="25" rx="3" fill="#334155" />
        {isLeft && (
          <g>
            <ellipse cx="20" cy="10" rx="8" ry="4" fill="#d97706" />
            <rect x="13" y="8" width="14" height="4" fill="#dc2626" rx="2" />
            <ellipse cx="40" cy="10" rx="8" ry="4" fill="#d97706" />
            <rect x="33" y="8" width="14" height="4" fill="#dc2626" rx="2" />
          </g>
        )}
      </g>
    );
  }
  // Default
  return (
    <g transform="translate(715, 430)">
      <rect x="0" y="15" width="60" height="25" rx="3" fill="#334155" />
      <ellipse cx="20" cy="10" rx="8" ry="4" fill="#d97706" />
      <rect x="13" y="8" width="14" height="4" fill="#dc2626" rx="2" />
      <ellipse cx="40" cy="10" rx="8" ry="4" fill="#d97706" />
      <rect x="33" y="8" width="14" height="4" fill="#dc2626" rx="2" />
    </g>
  );
};

// 9. 香蕉 (banana) - 位置: (180, 435) 或懸掛 (180, 285)
export const renderBananaSprite = (variantKey, isLeft) => {
  if (variantKey === 'displacement') {
    if (isLeft) {
      // 左圖：平放在檯面 (x: 180, y: 435)
      return (
        <g transform="translate(160, 420)">
          <path d="M 5 20 Q 20 8, 38 18 Q 22 28, 5 20 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
          <circle cx="5" cy="20" r="2" fill="#713f12" />
        </g>
      );
    } else {
      // 右圖：高掛在上方黃銅掛鉤 (x: 180, y: 285)
      return (
        <g transform="translate(165, 265)">
          <path d="M 18 0 L 18 15 Q 18 22, 10 20" stroke="#d97706" strokeWidth="3" fill="none" />
          <path d="M 10 18 Q 5 35, 18 45 Q 24 32, 10 18 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
          <circle cx="10" cy="18" r="2.5" fill="#713f12" />
        </g>
      );
    }
  }
  if (variantKey === 'color') {
    const bananaFill = isLeft ? '#eab308' : '#84cc16';
    return (
      <g transform="translate(160, 420)">
        <path d="M 5 20 Q 20 8, 38 18 Q 22 28, 5 20 Z" fill={bananaFill} stroke="#ca8a04" strokeWidth="1.5" />
      </g>
    );
  }
  // Default
  return (
    <g transform="translate(160, 420)">
      <path d="M 5 20 Q 20 8, 38 18 Q 22 28, 5 20 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
      <circle cx="5" cy="20" r="2" fill="#713f12" />
    </g>
  );
};

// 10. 十六 (sixteen) - 位置: (395, 195)
export const renderSixteenSprite = (variantKey, isLeft) => {
  if (variantKey === 'text') {
    const numText = isLeft ? '16' : '20';
    return (
      <g transform="translate(370, 165)">
        <rect x="0" y="0" width="46" height="34" rx="6" fill="#78350f" stroke="#f59e0b" strokeWidth="2.5" />
        <rect x="4" y="4" width="38" height="26" rx="4" fill="#451a03" />
        <text x="23" y="23" fill="#fef08a" fontSize="17" fontWeight="900" textAnchor="middle" fontFamily="monospace">
          {numText}
        </text>
      </g>
    );
  }
  if (variantKey === 'color') {
    const bgCol = isLeft ? '#78350f' : '#1e3a8a';
    return (
      <g transform="translate(370, 165)">
        <rect x="0" y="0" width="46" height="34" rx="6" fill={bgCol} stroke="#f59e0b" strokeWidth="2.5" />
        <rect x="4" y="4" width="38" height="26" rx="4" fill="#0f172a" />
        <text x="23" y="23" fill="#fef08a" fontSize="17" fontWeight="900" textAnchor="middle" fontFamily="monospace">
          16
        </text>
      </g>
    );
  }
  // Default
  return (
    <g transform="translate(370, 165)">
      <rect x="0" y="0" width="46" height="34" rx="6" fill="#78350f" stroke="#f59e0b" strokeWidth="2.5" />
      <rect x="4" y="4" width="38" height="26" rx="4" fill="#451a03" />
      <text x="23" y="23" fill="#fef08a" fontSize="17" fontWeight="900" textAnchor="middle" fontFamily="monospace">
        16
      </text>
    </g>
  );
};

// 11. 披薩 (pizza) - 位置: (545, 435)
export const renderPizzaSprite = (variantKey, isLeft) => {
  if (variantKey === 'quantity') {
    return (
      <g transform="translate(535, 425)">
        <polygon points="5,5 35,5 20,35" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
        <circle cx="16" cy="14" r="3" fill="#dc2626" />
        {isLeft && (
          <polygon points="25,10 50,10 38,38" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
        )}
      </g>
    );
  }
  if (variantKey === 'presence') {
    return (
      <g transform="translate(535, 425)">
        <ellipse cx="20" cy="20" rx="22" ry="8" fill="#cbd5e1" opacity="0.4" />
        {isLeft && (
          <polygon points="5,5 35,5 20,35" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
        )}
      </g>
    );
  }
  // Default
  return (
    <g transform="translate(535, 425)">
      <polygon points="5,5 35,5 20,35" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
      <circle cx="16" cy="14" r="3" fill="#dc2626" />
      <circle cx="24" cy="16" r="2.5" fill="#dc2626" />
    </g>
  );
};

// 12. 蛋糕 (cake) - 位置: (595, 430)
export const renderCakeSprite = (variantKey, isLeft) => {
  if (variantKey === 'color') {
    const cakeColor = isLeft ? '#fbcfe8' : '#78350f';
    return (
      <g transform="translate(585, 415)">
        <rect x="5" y="12" width="28" height="18" rx="3" fill={cakeColor} stroke="#94a3b8" strokeWidth="1" />
        <circle cx="19" cy="8" r="4" fill="#dc2626" />
      </g>
    );
  }
  if (variantKey === 'presence') {
    return (
      <g transform="translate(585, 415)">
        <ellipse cx="19" cy="30" rx="18" ry="6" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
        {isLeft && (
          <>
            <rect x="5" y="12" width="28" height="18" rx="3" fill="#fbcfe8" />
            <circle cx="19" cy="8" r="4" fill="#dc2626" />
          </>
        )}
      </g>
    );
  }
  // Default
  return (
    <g transform="translate(585, 415)">
      <rect x="5" y="12" width="28" height="18" rx="3" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1.5" />
      <rect x="5" y="18" width="28" height="4" fill="#f43f5e" />
      <circle cx="19" cy="8" r="4" fill="#dc2626" />
    </g>
  );
};

// 13. 三明治 (sandwich) - 位置: (340, 455)
export const renderSandwichSprite = (variantKey, isLeft) => {
  if (variantKey === 'quantity') {
    return (
      <g transform="translate(330, 445)">
        <polygon points="5,20 28,5 28,20" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
        {isLeft && (
          <polygon points="15,22 38,7 38,22" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
        )}
      </g>
    );
  }
  if (variantKey === 'presence') {
    return (
      <g transform="translate(330, 445)">
        {isLeft ? (
          <polygon points="5,20 28,5 28,20" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
        ) : (
          <ellipse cx="18" cy="22" rx="14" ry="5" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
        )}
      </g>
    );
  }
  // Default
  return (
    <g transform="translate(330, 445)">
      <polygon points="5,20 28,5 28,20" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
      <polygon points="5,22 28,7 28,22" fill="#ef4444" />
      <polygon points="5,24 28,9 28,24" fill="#22c55e" />
    </g>
  );
};

// 14. 牛奶 (milk) - 位置: (360, 465)
export const renderMilkSprite = (variantKey, isLeft) => {
  if (variantKey === 'presence') {
    return (
      <g transform="translate(352, 450)">
        <rect x="5" y="8" width="14" height="24" rx="3" fill={isLeft ? '#ffffff' : 'none'} stroke="#94a3b8" strokeWidth="1.5" />
        <ellipse cx="12" cy="8" rx="5" ry="2" fill="#3b82f6" />
      </g>
    );
  }
  if (variantKey === 'color') {
    const milkColor = isLeft ? '#ffffff' : '#fbcfe8';
    return (
      <g transform="translate(352, 450)">
        <rect x="5" y="8" width="14" height="24" rx="3" fill={milkColor} stroke="#94a3b8" strokeWidth="1.5" />
        <ellipse cx="12" cy="8" rx="5" ry="2" fill="#3b82f6" />
      </g>
    );
  }
  // Default
  return (
    <g transform="translate(352, 450)">
      <rect x="5" y="8" width="14" height="24" rx="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
      <ellipse cx="12" cy="8" rx="5" ry="2" fill="#3b82f6" />
    </g>
  );
};

// 15. 水 (water) - 位置: (265, 435)
export const renderWaterSprite = (variantKey, isLeft) => {
  if (variantKey === 'presence') {
    return (
      <g transform="translate(258, 420)">
        <path d="M 5 0 L 18 0 L 16 26 L 7 26 Z" fill={isLeft ? '#38bdf8' : 'none'} opacity="0.6" stroke="#0284c7" strokeWidth="1.2" />
      </g>
    );
  }
  if (variantKey === 'color') {
    const waterColor = isLeft ? '#38bdf8' : '#c084fc';
    return (
      <g transform="translate(258, 420)">
        <path d="M 5 0 L 18 0 L 16 26 L 7 26 Z" fill={waterColor} opacity="0.7" stroke="#0284c7" strokeWidth="1.2" />
      </g>
    );
  }
  // Default
  return (
    <g transform="translate(258, 420)">
      <path d="M 5 0 L 18 0 L 16 26 L 7 26 Z" fill="#38bdf8" opacity="0.6" stroke="#0284c7" strokeWidth="1.2" />
    </g>
  );
};

// 16. 柳橙 (orange) - 位置: (125, 375)
export const renderOrangeSprite = (variantKey, isLeft) => {
  if (variantKey === 'quantity') {
    return (
      <g transform="translate(115, 365)">
        <ellipse cx="20" cy="22" rx="18" ry="12" fill="#c2410c" />
        <circle cx="14" cy="14" r="8" fill="#f97316" />
        <circle cx="26" cy="14" r="8" fill="#fb923c" />
        {isLeft && <circle cx="20" cy="7" r="7.5" fill="#f97316" />}
      </g>
    );
  }
  if (variantKey === 'presence') {
    return (
      <g transform="translate(115, 365)">
        <ellipse cx="20" cy="22" rx="18" ry="12" fill="#c2410c" />
        {isLeft && (
          <>
            <circle cx="14" cy="14" r="8" fill="#f97316" />
            <circle cx="26" cy="14" r="8" fill="#fb923c" />
          </>
        )}
      </g>
    );
  }
  // Default
  return (
    <g transform="translate(115, 365)">
      <ellipse cx="20" cy="22" rx="18" ry="12" fill="#c2410c" />
      <circle cx="14" cy="14" r="8" fill="#f97316" />
      <circle cx="26" cy="14" r="8" fill="#fb923c" />
      <circle cx="20" cy="7" r="7.5" fill="#f97316" />
    </g>
  );
};

// 17. 柚子 (pomelo) - 位置: (45, 475)
export const renderPomeloSprite = (variantKey, isLeft) => {
  if (variantKey === 'presence') {
    return (
      <g transform="translate(35, 465)">
        {isLeft && (
          <path d="M 20 5 C 10 5, 5 20, 5 30 C 5 40, 12 45, 20 45 C 28 45, 35 40, 35 30 C 35 20, 30 5, 20 5 Z" fill="#84cc16" stroke="#4d7c0f" strokeWidth="1.5" />
        )}
      </g>
    );
  }
  if (variantKey === 'size') {
    const scale = isLeft ? 1.3 : 0.7;
    return (
      <g transform={`translate(35, 465) scale(${scale})`}>
        <path d="M 20 5 C 10 5, 5 20, 5 30 C 5 40, 12 45, 20 45 C 28 45, 35 40, 35 30 C 35 20, 30 5, 20 5 Z" fill="#84cc16" stroke="#4d7c0f" strokeWidth="1.5" />
      </g>
    );
  }
  // Default
  return (
    <g transform="translate(35, 465)">
      <path d="M 20 5 C 10 5, 5 20, 5 30 C 5 40, 12 45, 20 45 C 28 45, 35 40, 35 30 C 35 20, 30 5, 20 5 Z" fill="#84cc16" stroke="#4d7c0f" strokeWidth="1.5" />
    </g>
  );
};

// 18. 米飯 (rice) - 位置: (515, 475)
export const renderRiceSprite = (variantKey, isLeft) => {
  if (variantKey === 'presence') {
    return (
      <g transform="translate(505, 465)">
        <ellipse cx="16" cy="18" rx="14" ry="7" fill="#475569" />
        {isLeft && (
          <path d="M 5 16 Q 16 2, 27 16 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
        )}
      </g>
    );
  }
  if (variantKey === 'quantity') {
    return (
      <g transform="translate(505, 465)">
        <ellipse cx="16" cy="18" rx="14" ry="7" fill="#475569" />
        <path d="M 5 16 Q 12 2, 18 16 Z" fill="#ffffff" />
        {isLeft && <path d="M 14 16 Q 22 2, 28 16 Z" fill="#ffffff" />}
      </g>
    );
  }
  // Default
  return (
    <g transform="translate(505, 465)">
      <ellipse cx="16" cy="18" rx="14" ry="7" fill="#475569" />
      <path d="M 5 16 Q 16 2, 27 16 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="13" y="10" width="6" height="5" fill="#0f172a" />
    </g>
  );
};

// 19. 晴朗太陽 (sunny) - 位置: (80, 75)
export const renderSunnySprite = (variantKey, isLeft) => {
  if (variantKey === 'symbol') {
    // 符號文字/表情差異：左笑臉 / 右酷墨鏡
    return (
      <g transform="translate(60, 50)">
        <circle cx="25" cy="25" r="18" fill="#f59e0b" filter="drop-shadow(0 0 6px #fbbf24)" />
        {isLeft ? (
          <>
            <circle cx="20" cy="22" r="2" fill="#78350f" />
            <circle cx="30" cy="22" r="2" fill="#78350f" />
            <path d="M 20 28 Q 25 33, 30 28" stroke="#78350f" strokeWidth="1.8" fill="none" />
          </>
        ) : (
          <rect x="15" y="20" width="20" height="6" rx="2" fill="#0f172a" />
        )}
      </g>
    );
  }
  if (variantKey === 'color') {
    const sunColor = isLeft ? '#f59e0b' : '#ef4444';
    return (
      <g transform="translate(60, 50)">
        <circle cx="25" cy="25" r="18" fill={sunColor} filter="drop-shadow(0 0 6px #fbbf24)" />
      </g>
    );
  }
  // Default
  return (
    <g transform="translate(60, 50)">
      <circle cx="25" cy="25" r="18" fill="#f59e0b" filter="drop-shadow(0 0 6px #fbbf24)" />
      <circle cx="20" cy="22" r="2" fill="#78350f" />
      <circle cx="30" cy="22" r="2" fill="#78350f" />
      <path d="M 20 28 Q 25 33, 30 28" stroke="#78350f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </g>
  );
};

// 20. 雲朵 (cloudy) - 位置: (240, 70)
export const renderCloudySprite = (variantKey, isLeft) => {
  if (variantKey === 'quantity') {
    return (
      <g transform="translate(210, 50)" opacity="0.9">
        <ellipse cx="40" cy="25" rx="25" ry="15" fill="#ffffff" />
        {isLeft && (
          <ellipse cx="80" cy="20" rx="18" ry="12" fill="#ffffff" />
        )}
      </g>
    );
  }
  if (variantKey === 'color') {
    const cloudColor = isLeft ? '#ffffff' : '#94a3b8';
    return (
      <g transform="translate(210, 50)" opacity="0.9">
        <ellipse cx="40" cy="25" rx="25" ry="15" fill={cloudColor} />
      </g>
    );
  }
  // Default
  return (
    <g transform="translate(210, 50)" opacity="0.9">
      <ellipse cx="40" cy="25" rx="25" ry="15" fill="#ffffff" />
      <ellipse cx="60" cy="20" rx="18" ry="16" fill="#ffffff" />
      <ellipse cx="25" cy="22" rx="16" ry="12" fill="#ffffff" />
    </g>
  );
};

// ── 匯出精靈圖註冊表 ──
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
