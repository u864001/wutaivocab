import React, { useState, useEffect, useRef } from 'react';

/**
 * 右側太空空白區：階梯式正增強氣球灌氣連擊 (Combo/Streak) 顯示器
 * - 位置：牢牢固定於右上角空域 (絕對不阻擋中央隕石掉落與題目名牌)
 * - 門檻：3 連對以上開始顯現
 * - 灌氣膨脹：題數每增加一次，字體像被灌氣球一樣爆衝膨脹再縮回當前最大比例
 * - 階梯正增強：隨連對遞增依序解鎖 藍光 ➔ 烈焰 ➔ 閃電狂暴 ➔ 弒神金冠與高頻劇烈震顫
 */
export const RightComboDisplay = ({ combo = 0 }) => {
  const [isPumping, setIsPumping] = useState(false);
  const prevComboRef = useRef(combo);

  // 監聽 combo 變化觸發灌氣膨脹動畫
  useEffect(() => {
    if (combo >= 3 && combo > prevComboRef.current) {
      setIsPumping(true);
      const timer = setTimeout(() => setIsPumping(false), 420);
      prevComboRef.current = combo;
      return () => clearTimeout(timer);
    }
    prevComboRef.current = combo;
  }, [combo]);

  // 3 連對以下隱藏，保持畫面乾淨
  if (combo < 3) return null;

  // 階梯式基礎縮放比例 (氣球充氣基底)
  // combo 3: 1.0x -> combo 5: 1.25x -> combo 8+: 1.55x (上限保護，絕不侵犯中央隕石區)
  const baseScale = Math.min(1.55, 1.0 + (combo - 3) * 0.11);

  // 四階正增強等級配置
  let tierConfig = {
    title: `${combo}x COMBO`,
    sub: `${combo} in a streak! (+${combo})`,
    textColor: 'text-cyan-300',
    borderColor: 'border-cyan-400/80',
    bgGlow: 'bg-cyan-950/70',
    shadowGlow: 'shadow-[0_0_25px_rgba(6,182,212,0.6)]',
    textShadow: 'drop-shadow-[0_0_12px_rgba(56,189,248,0.9)]',
    hasJitter: false,
    badgeIcon: '⚡'
  };

  if (combo >= 5 && combo < 7) {
    // 第二階：烈焰燃燒
    tierConfig = {
      title: `${combo}x STREAK 🔥`,
      sub: `ON FIRE! (+${combo} BONUS)`,
      textColor: 'text-amber-300',
      borderColor: 'border-amber-400',
      bgGlow: 'bg-amber-950/80',
      shadowGlow: 'shadow-[0_0_35px_rgba(245,158,11,0.8)]',
      textShadow: 'drop-shadow-[0_0_16px_rgba(251,191,36,1.0)]',
      hasJitter: false,
      badgeIcon: '🔥'
    };
  } else if (combo >= 7 && combo < 10) {
    // 第三階：霓虹電弧狂暴 (開始劇烈抖動)
    tierConfig = {
      title: `${combo}x MEGA ⚡`,
      sub: `UNSTOPPABLE! (+${combo})`,
      textColor: 'text-fuchsia-300',
      borderColor: 'border-fuchsia-400',
      bgGlow: 'bg-fuchsia-950/80',
      shadowGlow: 'shadow-[0_0_45px_rgba(217,70,239,0.9)]',
      textShadow: 'drop-shadow-[0_0_20px_rgba(236,72,153,1.0)]',
      hasJitter: true,
      badgeIcon: '💥'
    };
  } else if (combo >= 10) {
    // 第四階：弒神極限光環 (強烈霓虹與最高抖動)
    tierConfig = {
      title: `${combo}x GODLIKE 👑`,
      sub: `LEGENDARY! (+${combo})`,
      textColor: 'text-rose-300',
      borderColor: 'border-rose-400',
      bgGlow: 'bg-rose-950/90',
      shadowGlow: 'shadow-[0_0_55px_rgba(244,63,94,1.0)]',
      textShadow: 'drop-shadow-[0_0_25px_rgba(239,68,68,1.0)]',
      hasJitter: true,
      badgeIcon: '👑'
    };
  }

  return (
    <div
      className={`absolute right-2 sm:right-6 top-8 sm:top-14 pointer-events-none z-30 flex flex-col items-end select-none transition-transform duration-200 origin-right ${
        tierConfig.hasJitter ? 'animate-combo-jitter' : ''
      }`}
      style={{
        transform: `perspective(600px) rotateY(-16deg) rotateX(6deg) scale(${baseScale})`
      }}
    >
      <div
        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border-2 backdrop-blur-md transition-all duration-150 ${tierConfig.borderColor} ${tierConfig.bgGlow} ${tierConfig.shadowGlow} ${
          isPumping ? 'animate-balloon-pump' : ''
        }`}
      >
        <div className="flex items-center gap-1.5 justify-end">
          <span className="text-base sm:text-lg animate-bounce">{tierConfig.badgeIcon}</span>
          <span
            className={`font-black text-sm sm:text-lg tracking-wider font-heading uppercase whitespace-nowrap ${tierConfig.textColor} ${tierConfig.textShadow}`}
          >
            {tierConfig.title}
          </span>
        </div>

        <div className="text-[10px] sm:text-xs font-black tracking-wide text-white/90 text-right whitespace-nowrap mt-0.5">
          {tierConfig.sub}
        </div>
      </div>
    </div>
  );
};
