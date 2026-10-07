import React, { useState, useEffect } from 'react';
import { escapeAudio } from './escapeAudio';

/**
 * 密室逃脫：沉浸式擬真環境彩蛋層 (Chamber Ambience Layer)
 * 規格要求：
 * 1. 絕不干擾主視覺與解謎互動 (pointer-events-none, 外圍/深度背景活動)
 * 2. 每張房間底圖僅啟用 1 種專屬微小彩蛋，避免充斥
 * 3. temple2：火星起點提升至火堆，大部分消於煙道，少部分飄出煙道
 * 4. temple3：流星改至左側窗戶，受窗戶建物嚴格遮蔽，流星本體亮、尾跡迅疾細短暗
 * 5. dungeon2：移除蜘蛛網，改為偶發頻率稍高的聽覺老鼠叫聲
 * 6. tomb1：聖甲蟲進關 3.5 秒即出現巡行，位於地面石縫明確可見
 * 7. tomb2：人影縮小 50%，連續人形黑影，腳著門檻地面，嚴格限於兩門片之間的門縫，速度再快 30%
 * 8. asylum1 & 2：無蜘蛛，改為 10 處光線隨機落塵斑 (同時僅 1~3 處)
 * 9. asylum3：左雨滴在門框之下；右雨滴嚴格以巨型圓鐘窗戶 (borderRadius 50%) 遮蔽，不浸入室內
 */
export const ChamberAmbience = ({ themeId = 'temple', isMuted = false }) => {
  const tid = String(themeId).toLowerCase();

  // 嚴格判定當前房間對應之單一專屬彩蛋類型
  const ambienceType = (() => {
    // ── 主題一：大武山石板遺跡 ──
    if (tid === 'temple' || tid === 'temple_1') return 'falling_pebbles';       // 第一室：石板天頂偶爾崩落的碎石頭
    if (tid === 'library' || tid === 'temple_2') return 'hearth_embers';        // 第二室：火堆中升起之火燼 (大部分熄於煙道，少部分飄出)
    if (tid === 'observatory' || tid === 'temple_3') return 'shooting_star';    // 第三室：左側窗戶內迅疾逼真的真實流星

    // ── 主題二：地底黑曜地下城 ──
    if (tid.startsWith('dungeon_1')) return 'photorealistic_mouse';             // 第一室：底層擬真不透明黑曜小老鼠 (嗅聞＋吱聲)
    if (tid.startsWith('dungeon_2')) return 'dungeon_auditory_mouse';           // 第二室：移除蜘蛛，改為暗處老鼠聲
    if (tid.startsWith('dungeon_3')) return 'lava_embers';                      // 第三室：深處熔岩峽谷飄升自然熄滅的金橙火星

    // ── 主題三：法老秘境古墓探險 ──
    if (tid.startsWith('tomb_1')) return 'scarab';                              // 第一室：地面石板爬行黑金聖甲蟲 (3.5秒內即現行)
    if (tid.startsWith('tomb_2')) return 'shadow_intruder';                     // 第二室：中央兩門片門縫後方閃過之連續縮小人形黑影 (著地、加速)
    if (tid.startsWith('tomb_3')) return 'sunbeam_motes';                       // 第三室：天頂太陽神天光束中 9 處微金塵斑

    // ── 主題四：殘破時鐘廢棄建築 ──
    if (tid.startsWith('asylum_1') || tid.startsWith('asylum_2')) return 'daylight_motes'; // 第一、二室：光線灑落區隨機落塵斑 (10處選1~3處)
    if (tid.startsWith('asylum_3')) return 'masked_storm_rain';                 // 第三室：左門框下＋右圓鐘窗戶嚴格遮蔽暴雨

    return 'hearth_embers';
  })();

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {ambienceType === 'falling_pebbles' && <FallingPebbles />}
      {ambienceType === 'hearth_embers' && <HearthEmbers />}
      {ambienceType === 'shooting_star' && <ShootingStarMasked />}
      {ambienceType === 'photorealistic_mouse' && <PhotorealisticMouse isMuted={isMuted} />}
      {ambienceType === 'dungeon_auditory_mouse' && <DungeonAuditoryMouse isMuted={isMuted} />}
      {ambienceType === 'lava_embers' && <LavaEmbers />}
      {ambienceType === 'scarab' && <ScarabCritter />}
      {ambienceType === 'shadow_intruder' && <ShadowIntruder />}
      {ambienceType === 'sunbeam_motes' && <SunbeamMotes />}
      {ambienceType === 'daylight_motes' && <DaylightMotes />}
      {ambienceType === 'masked_storm_rain' && <MaskedStormRain isMuted={isMuted} />}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 1. 典籍知識庫 (temple_2)：火堆中產生之火燼 (大部分熄於煙道，少部分飄出煙道)
// ══════════════════════════════════════════════════════════════
const HearthEmbers = () => {
  return (
    // 起點提升至火堆實體位置 (left: 23%~33%, bottom: 27%~35%)
    <div
      className="absolute pointer-events-none overflow-visible"
      style={{
        left: '23%',
        bottom: '28%',
        width: '10%',
        height: '35%'
      }}
    >
      {/* 大部分火星：在煙道內部逐漸冷卻熄滅 (位移 -70px ~ -90px) */}
      <div className="hearth-ember e-flue-1" />
      <div className="hearth-ember e-flue-2" />
      <div className="hearth-ember e-flue-3" />
      <div className="hearth-ember e-flue-4" />

      {/* 少部分火星：超越煙道罩，像自然飄出一樣 (位移 -140px ~ -170px) */}
      <div className="hearth-ember e-high-1" />
      <div className="hearth-ember e-high-2" />

      <style>{`
        .hearth-ember {
          position: absolute;
          bottom: 2px;
          border-radius: 50%;
          background: #fb923c;
          box-shadow: 0 0 5px #f97316, 0 0 2px #fff;
          opacity: 0;
        }
        /* 煙道內熄滅的火星 */
        .e-flue-1 { left: 25%; width: 2.5px; height: 2.5px; animation: emberFlue 3.4s infinite ease-out; animation-delay: 0.2s; }
        .e-flue-2 { left: 50%; width: 3.0px; height: 3.0px; animation: emberFlue 3.8s infinite ease-out; animation-delay: 1.4s; background: #fde047; }
        .e-flue-3 { left: 68%; width: 2.2px; height: 2.2px; animation: emberFlue 3.2s infinite ease-out; animation-delay: 2.6s; }
        .e-flue-4 { left: 38%; width: 2.8px; height: 2.8px; animation: emberFlue 4.0s infinite ease-out; animation-delay: 3.6s; background: #ea580c; }

        /* 飄出煙道的少部分高飛火星 */
        .e-high-1 { left: 42%; width: 3.2px; height: 3.2px; animation: emberHigh 4.8s infinite ease-out; animation-delay: 2.1s; background: #ffedd5; }
        .e-high-2 { left: 58%; width: 2.6px; height: 2.6px; animation: emberHigh 5.2s infinite ease-out; animation-delay: 4.5s; background: #fb923c; }

        @keyframes emberFlue {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          20% { opacity: 0.95; }
          65% { transform: translateY(-55px) translateX(6px) scale(0.75); opacity: 0.6; }
          100% { transform: translateY(-85px) translateX(-4px) scale(0.15); opacity: 0; }
        }

        @keyframes emberHigh {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          15% { opacity: 1; }
          50% { transform: translateY(-70px) translateX(12px) scale(0.85); opacity: 0.8; }
          80% { transform: translateY(-120px) translateX(18px) scale(0.5); opacity: 0.45; }
          100% { transform: translateY(-160px) translateX(10px) scale(0.1); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 2. 星象大殿 (temple_3)：在太空背景之上、但在建物及窗框之下的擬真小流星
// 規格要求：
// - 流星極細小微光，明亮處僅有 1 個領頭光點
// - 劃過之後的路徑逐漸加速變暗，呈現微微幽淡的拖曳星影
// - 透過 SVG 1920x1072 與 preserveAspectRatio="xMidYMid slice" 與底圖同步縮放
// ══════════════════════════════════════════════════════════════
const ShootingStarMasked = () => {
  const [active, setActive] = useState(false);
  const [starKey, setStarKey] = useState(0);
  const [startPos, setStartPos] = useState({ x: 535, y: 255 });

  useEffect(() => {
    let timer;
    const scheduleNext = () => {
      // 每 12 ~ 22 秒劃過一次，自然靈動
      const delay = Math.floor(Math.random() * 10000) + 12000;
      timer = setTimeout(() => {
        // 在左窗深空右上區域隨機起點
        setStartPos({
          x: Math.floor(Math.random() * 35) + 515,
          y: Math.floor(Math.random() * 35) + 240
        });
        setStarKey(k => k + 1);
        setActive(true);
        setTimeout(() => {
          setActive(false);
          scheduleNext();
        }, 500);
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timer);
  }, []);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      viewBox="0 0 1920 1072"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* 精確左拱窗開口遮罩 (嚴格限制於窗戶玻璃範圍內，絕不溢出) */}
        <clipPath id="observatoryWindowClip">
          <path d="M 330 844 L 330 400 A 126 176 0 0 1 582 400 L 582 844 Z" />
        </clipPath>

        {/* 流星拖曳漸層：尾端近乎全透明，越接近頭部光點越亮 */}
        <linearGradient id="meteorTrailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0" />
          <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.12" />
          <stop offset="78%" stopColor="#bae6fd" stopOpacity="0.45" />
          <stop offset="94%" stopColor="#e0f2fe" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>

        {/* 領頭單一明亮光點微暈濾鏡 */}
        <filter id="meteorCoreGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g clipPath="url(#observatoryWindowClip)">
        {active && (
          <g
            key={starKey}
            className="animate-celestialMeteorFast"
            style={{
              transformOrigin: `${startPos.x}px ${startPos.y}px`,
              '--start-x': `${startPos.x}px`,
              '--start-y': `${startPos.y}px`
            }}
          >
            {/* 微微拖曳光影（極細 1.2px，尾跡隨飛行加速變暗） */}
            <line
              x1={startPos.x - 38}
              y1={startPos.y}
              x2={startPos.x}
              y2={startPos.y}
              stroke="url(#meteorTrailGrad)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* 流星最前端：唯一明亮的極小單一點 (半徑 1.3px) */}
            <circle
              cx={startPos.x}
              cy={startPos.y}
              r="1.3"
              fill="#ffffff"
              filter="url(#meteorCoreGlow)"
            />
          </g>
        )}
      </g>

      <style>{`
        @keyframes celestialMeteorPath {
          0% {
            transform: translate(0, 0) rotate(-34deg);
            opacity: 0;
          }
          12% {
            opacity: 0.95;
          }
          55% {
            opacity: 0.75;
          }
          85% {
            opacity: 0.35;
          }
          100% {
            transform: translate(-145px, 0) rotate(-34deg);
            opacity: 0;
          }
        }
        .animate-celestialMeteorFast {
          animation: celestialMeteorPath 0.44s cubic-bezier(0.35, 0.05, 0.8, 1) forwards;
        }
      `}</style>
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════
// 3. 黑曜石囚室 (dungeon_1)：底部擬真不透明黑曜小老鼠 (嗅聞＋吱聲)
// ══════════════════════════════════════════════════════════════
const PhotorealisticMouse = ({ isMuted = false }) => {
  const [active, setActive] = useState(false);
  const [direction, setDirection] = useState('leftToRight');

  useEffect(() => {
    let timer;
    const scheduleNext = () => {
      const delay = Math.floor(Math.random() * 16000) + 26000;
      timer = setTimeout(() => {
        const dir = Math.random() > 0.5 ? 'leftToRight' : 'rightToLeft';
        setDirection(dir);
        setActive(true);

        setTimeout(() => {
          if (!isMuted) escapeAudio.playMouseSqueak();
        }, 1700);

        setTimeout(() => {
          setActive(false);
          scheduleNext();
        }, 5400);
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timer);
  }, [isMuted]);

  if (!active) return null;

  return (
    <div
      className={`absolute bottom-4 sm:bottom-7 pointer-events-none select-none ${
        direction === 'leftToRight' ? 'animate-realMouseL2R' : 'animate-realMouseR2L'
      }`}
      style={{ width: '42px', height: '22px', opacity: 1 }}
    >
      <svg
        viewBox="0 0 42 22"
        fill="none"
        className={`w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] ${
          direction === 'rightToLeft' ? 'scale-x-[-1]' : ''
        }`}
      >
        <ellipse cx="20" cy="13" rx="11" ry="6.5" fill="#1c1917" />
        <ellipse cx="20" cy="11.5" rx="9.5" ry="5.5" fill="#292524" />
        <circle cx="31" cy="10" r="3.5" fill="#1c1917" />
        <ellipse cx="27" cy="7.2" rx="2.5" ry="3.2" fill="#292524" />
        <ellipse cx="27" cy="7.2" rx="1.5" ry="2.2" fill="#44403c" />
        <circle cx="32.5" cy="9.2" r="0.8" fill="#09090b" />
        <circle cx="32.7" cy="9" r="0.3" fill="#ffffff" />
        <path d="M34 11 L39 12.5 L34 13.8 Z" fill="#1c1917" />
        <line x1="37" y1="12" x2="41" y2="10" stroke="#78716c" strokeWidth="0.6" strokeLinecap="round" />
        <line x1="37" y1="13" x2="41" y2="15" stroke="#78716c" strokeWidth="0.6" strokeLinecap="round" />
        <path d="M10 14 C5 17, 2 12, 0 13" stroke="#292524" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M16 18 L15 21" stroke="#292524" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M26 18 L27 21" stroke="#292524" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <style>{`
        @keyframes realMouseL2R {
          0% { transform: translateX(-60px); }
          15% { transform: translateX(20vw); }
          32% { transform: translateX(20vw) rotate(-2deg); }
          45% { transform: translateX(20vw) rotate(2deg); }
          60% { transform: translateX(55vw); }
          85% { transform: translateX(85vw); }
          100% { transform: translateX(110vw); }
        }
        @keyframes realMouseR2L {
          0% { transform: translateX(110vw); }
          15% { transform: translateX(80vw); }
          32% { transform: translateX(80vw) rotate(2deg); }
          45% { transform: translateX(80vw) rotate(-2deg); }
          60% { transform: translateX(45vw); }
          85% { transform: translateX(15vw); }
          100% { transform: translateX(-60px); }
        }
        .animate-realMouseL2R { animation: realMouseL2R 5.4s cubic-bezier(0.25, 0.1, 0.25, 1) forwards; }
        .animate-realMouseR2L { animation: realMouseR2L 5.4s cubic-bezier(0.25, 0.1, 0.25, 1) forwards; }
      `}</style>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 4. 煉金術長廊 (dungeon_2)：無畫面干擾，頻率稍高之陰暗角落老鼠吱叫聲
// ══════════════════════════════════════════════════════════════
const DungeonAuditoryMouse = ({ isMuted = false }) => {
  useEffect(() => {
    let timer;
    const scheduleNextSqueak = () => {
      // 每 16 ~ 26 秒偶爾在長廊陰暗角落發出輕微老鼠聲
      const delay = Math.floor(Math.random() * 10000) + 16000;
      timer = setTimeout(() => {
        if (!isMuted) escapeAudio.playMouseSqueak();
        scheduleNextSqueak();
      }, delay);
    };

    scheduleNextSqueak();
    return () => clearTimeout(timer);
  }, [isMuted]);

  return null;
};

// ══════════════════════════════════════════════════════════════
// 5. 熔岩深淵 (dungeon_3)：峽谷深處飄升並自然熄滅的鮮明金橙火星
// ══════════════════════════════════════════════════════════════
const LavaEmbers = () => {
  return (
    <div
      className="absolute inset-x-0 pointer-events-none overflow-hidden"
      style={{
        bottom: '18%',
        height: '38%',
        left: '8%',
        right: '8%'
      }}
    >
      <div className="magma-ember m-1" />
      <div className="magma-ember m-2" />
      <div className="magma-ember m-3" />
      <div className="magma-ember m-4" />
      <div className="magma-ember m-5" />
      <div className="magma-ember m-6" />
      <style>{`
        .magma-ember {
          position: absolute;
          bottom: 0;
          border-radius: 50%;
          background: #fb923c;
          box-shadow: 0 0 8px #f97316, 0 0 3px #ffffff;
          opacity: 0;
          animation: magmaEmberFloat 5.2s infinite ease-out;
        }
        .m-1 { left: 18%; width: 4px; height: 4px; animation-delay: 0.3s; animation-duration: 4.8s; }
        .m-2 { left: 34%; width: 3px; height: 3px; animation-delay: 1.8s; animation-duration: 5.6s; background: #fde047; }
        .m-3 { left: 52%; width: 4.5px; height: 4.5px; animation-delay: 2.9s; animation-duration: 5.0s; }
        .m-4 { left: 68%; width: 3px; height: 3px; animation-delay: 3.8s; animation-duration: 6.2s; background: #ffedd5; }
        .m-5 { left: 44%; width: 3.5px; height: 3.5px; animation-delay: 4.6s; animation-duration: 4.6s; }
        .m-6 { left: 82%; width: 3px; height: 3px; animation-delay: 1.2s; animation-duration: 5.4s; }
        @keyframes magmaEmberFloat {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          20% { opacity: 0.95; }
          65% { transform: translateY(-75px) translateX(14px) scale(0.85); opacity: 0.7; }
          100% { transform: translateY(-150px) translateX(-10px) scale(0.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 6. 古墓外槨 (tomb_1)：地面石縫擬真黑金聖甲蟲 (進關 3.5s 即出巡)
// ══════════════════════════════════════════════════════════════
const ScarabCritter = () => {
  const [active, setActive] = useState(false);
  const [posX, setPosX] = useState(42);

  useEffect(() => {
    let timer;
    // 首次進關 3.5 秒後立即觸發初次爬行巡視，確保玩家不需久候！
    timer = setTimeout(() => {
      setPosX(42);
      setActive(true);
      setTimeout(() => {
        setActive(false);
        scheduleSubsequent();
      }, 8200);
    }, 3500);

    const scheduleSubsequent = () => {
      const delay = Math.floor(Math.random() * 14000) + 20000;
      timer = setTimeout(() => {
        setPosX(Math.floor(Math.random() * 30) + 35);
        setActive(true);
        setTimeout(() => {
          setActive(false);
          scheduleSubsequent();
        }, 8200);
      }, delay);
    };

    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    // 確定位於地面石板區域 (bottom: 11%~15%)，避免被 HUD 覆蓋
    <div
      className="absolute bottom-12 sm:bottom-16 pointer-events-none select-none animate-realScarab"
      style={{
        left: `${posX}%`,
        width: '32px',
        height: '32px',
        opacity: 1
      }}
    >
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
        {/* 厚重金屬黑金甲殼 */}
        <ellipse cx="16" cy="17" rx="6.5" ry="9" fill="#1c1917" />
        <ellipse cx="16" cy="16" rx="5.2" ry="7.5" fill="#292524" />
        <path d="M16 9 L16 25" stroke="#d97706" strokeWidth="0.8" strokeDasharray="1.5 1" />
        {/* 太陽象徵鏟狀前角 */}
        <ellipse cx="16" cy="8" rx="4" ry="2.6" fill="#1c1917" />
        <path d="M13 5.5 L16 2.5 L19 5.5" stroke="#b45309" strokeWidth="1.2" strokeLinecap="round" />
        {/* 6 條粗壯有力之步足 */}
        <path d="M10 11 C5 8, 4 10, 2 13" stroke="#1c1917" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M22 11 C27 8, 28 10, 30 13" stroke="#1c1917" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M9 17 C4 17, 3 19, 1 21" stroke="#1c1917" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M23 17 C28 17, 29 19, 31 21" stroke="#1c1917" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M10 23 C7 25, 6 28, 4 30" stroke="#1c1917" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M22 23 C25 25, 26 28, 28 30" stroke="#1c1917" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <style>{`
        @keyframes realScarab {
          0% { transform: translateY(18px) rotate(0deg); }
          25% { transform: translateY(6px) rotate(3deg); }
          50% { transform: translateY(-6px) rotate(-3deg); }
          75% { transform: translateY(-20px) rotate(2deg); }
          100% { transform: translateY(-36px) rotate(0deg); }
        }
        .animate-realScarab {
          animation: realScarab 8.2s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 7. 阿努比斯寶庫 (tomb_2)：中央兩門片門縫後方閃過之連續人形黑影 (著地、縮小50%、加速30%)
// ══════════════════════════════════════════════════════════════
const ShadowIntruder = () => {
  const [active, setActive] = useState(false);
  const [walkKey, setWalkKey] = useState(0);

  useEffect(() => {
    let timer;
    const scheduleNext = () => {
      // 每 24 ~ 38 秒偶發一次
      const delay = Math.floor(Math.random() * 14000) + 24000;
      timer = setTimeout(() => {
        setWalkKey(k => k + 1);
        setActive(true);
        setTimeout(() => {
          setActive(false);
          scheduleNext();
        }, 900); // 速度再快 30%，穿越門縫耗時約 0.85 秒
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timer);
  }, []);

  return (
    // 嚴格門縫裁切容器：精確鎖定於中央左右兩扇門片之間的「門縫開口」
    // left: 48.4%, width: 3.2%, top: 31%, height: 19% (底緣精確對齊門底門檻地面)
    <div
      className="absolute overflow-hidden pointer-events-none select-none"
      style={{
        left: '48.4%',
        top: '31%',
        width: '3.2%',
        height: '19%'
      }}
    >
      {active && (
        <div
          key={walkKey}
          className="absolute bottom-0 w-full animate-shadowFastWalk"
          style={{
            height: '34px', /* 縮小 50%：完全符合背景遠景透視人體高度 */
            opacity: 1
          }}
        >
          {/* 連續型態人形黑影剪影 (腳貼底著地，大步穿過) */}
          <svg viewBox="0 0 24 38" fill="#09090b" className="w-full h-full">
            {/* 頭部與連帽兜帽 */}
            <circle cx="12" cy="5.5" r="3.2" />
            {/* 連貫身軀與斗篷短袍 */}
            <path d="M9 9 L15 9 L17 25 L7 25 Z" />
            {/* 跨步雙腿 (腳尖貼緊 y=38 著地) */}
            <path d="M8 25 L5 37 L8 38 L11 26 Z" />
            <path d="M13 25 L16 36 L19 36 L15 26 Z" />
          </svg>
        </div>
      )}
      <style>{`
        @keyframes shadowFastWalk {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        .animate-shadowFastWalk {
          animation: shadowFastWalk 0.85s linear forwards;
        }
      `}</style>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 8. 太陽神殿 (tomb_3)：天光束中翻騰的 9 處微金塵斑
// ══════════════════════════════════════════════════════════════
const SunbeamMotes = () => {
  return (
    <div
      className="absolute pointer-events-none overflow-hidden"
      style={{
        left: '40%',
        top: '18%',
        width: '28%',
        height: '52%'
      }}
    >
      <div className="sun-mote sm-1" />
      <div className="sun-mote sm-2" />
      <div className="sun-mote sm-3" />
      <div className="sun-mote sm-4" />
      <div className="sun-mote sm-5" />
      <div className="sun-mote sm-6" />
      <div className="sun-mote sm-7" />
      <div className="sun-mote sm-8" />
      <div className="sun-mote sm-9" />
      <style>{`
        .sun-mote {
          position: absolute;
          border-radius: 50%;
          background: #fde047;
          box-shadow: 0 0 6px #f59e0b, 0 0 2px #fff;
          filter: blur(0.4px);
          animation: sunMoteSwirl 9s infinite ease-in-out;
        }
        .sm-1 { top: 22%; left: 35%; width: 3.5px; height: 3.5px; animation-delay: 0s; animation-duration: 8.5s; }
        .sm-2 { top: 38%; left: 52%; width: 2.8px; height: 2.8px; animation-delay: 1.8s; animation-duration: 9.2s; background: #fbbf24; }
        .sm-3 { top: 52%; left: 42%; width: 4.0px; height: 4.0px; animation-delay: 3.5s; animation-duration: 7.8s; }
        .sm-4 { top: 68%; left: 60%; width: 2.5px; height: 2.5px; animation-delay: 4.8s; animation-duration: 8.8s; }
        .sm-5 { top: 30%; left: 68%; width: 3.2px; height: 3.2px; animation-delay: 2.4s; animation-duration: 9.6s; background: #fef08a; }
        .sm-6 { top: 60%; left: 30%; width: 3.0px; height: 3.0px; animation-delay: 5.6s; animation-duration: 8.2s; }
        .sm-7 { top: 45%; left: 58%; width: 2.6px; height: 2.6px; animation-delay: 6.8s; animation-duration: 7.5s; }
        .sm-8 { top: 15%; left: 48%; width: 3.4px; height: 3.4px; animation-delay: 7.4s; animation-duration: 8.9s; }
        .sm-9 { top: 75%; left: 45%; width: 2.8px; height: 2.8px; animation-delay: 1.2s; animation-duration: 9.0s; }
        @keyframes sunMoteSwirl {
          0%, 100% { transform: translateY(0) translateX(0) scale(0.9); opacity: 0.15; }
          50% { transform: translateY(-22px) translateX(12px) scale(1.15); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 9. 廢棄門廳 (asylum_1) & 齒輪機械室 (asylum_2)：10 處光線隨機落塵斑 (同時僅 1~3 處)
// ══════════════════════════════════════════════════════════════
const DaylightMotes = () => {
  return (
    // 橫跨窗光斜射區域 (left: 20%~65%, top: 18%~68%)
    <div
      className="absolute pointer-events-none overflow-hidden"
      style={{
        left: '20%',
        top: '18%',
        width: '45%',
        height: '52%'
      }}
    >
      {/* 10 處候選微塵斑，透過錯開的長週期延遲，使得畫面上同時間僅有 1~3 處緩慢飄落 */}
      <div className="daylight-speck ds-1" />
      <div className="daylight-speck ds-2" />
      <div className="daylight-speck ds-3" />
      <div className="daylight-speck ds-4" />
      <div className="daylight-speck ds-5" />
      <div className="daylight-speck ds-6" />
      <div className="daylight-speck ds-7" />
      <div className="daylight-speck ds-8" />
      <div className="daylight-speck ds-9" />
      <div className="daylight-speck ds-10" />
      <style>{`
        .daylight-speck {
          position: absolute;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 5px rgba(255, 255, 255, 0.85);
          filter: blur(0.4px);
          opacity: 0;
          animation: speckDrift 14s infinite ease-in-out;
        }
        .ds-1  { top: 12%; left: 22%; width: 2.6px; height: 2.6px; animation-delay: 0.5s; }
        .ds-2  { top: 25%; left: 45%; width: 2.2px; height: 2.2px; animation-delay: 4.8s; }
        .ds-3  { top: 38%; left: 32%; width: 2.8px; height: 2.8px; animation-delay: 9.2s; }
        .ds-4  { top: 52%; left: 58%; width: 2.4px; height: 2.4px; animation-delay: 2.3s; }
        .ds-5  { top: 20%; left: 65%; width: 2.0px; height: 2.0px; animation-delay: 7.1s; }
        .ds-6  { top: 62%; left: 38%; width: 2.5px; height: 2.5px; animation-delay: 11.5s; }
        .ds-7  { top: 32%; left: 52%; width: 2.2px; height: 2.2px; animation-delay: 13.0s; }
        .ds-8  { top: 46%; left: 26%; width: 2.6px; height: 2.6px; animation-delay: 6.0s; }
        .ds-9  { top: 16%; left: 38%; width: 2.4px; height: 2.4px; animation-delay: 10.2s; }
        .ds-10 { top: 58%; left: 48%; width: 2.2px; height: 2.2px; animation-delay: 3.7s; }

        @keyframes speckDrift {
          0%   { transform: translateY(-8px) translateX(0); opacity: 0; }
          20%  { opacity: 0.75; }
          50%  { transform: translateY(24px) translateX(6px); opacity: 0.65; }
          80%  { opacity: 0.3; }
          100% { transform: translateY(48px) translateX(-3px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 10. 鐘樓頂層 (asylum_3)：左門框下＋右巨型圓鐘窗戶 (borderRadius 50%) 嚴格遮蔽暴雨
// ══════════════════════════════════════════════════════════════
const MaskedStormRain = ({ isMuted = false }) => {
  const [lightning, setLightning] = useState(false);

  useEffect(() => {
    let timer;
    const scheduleNextLightning = () => {
      const delay = Math.floor(Math.random() * 20000) + 30000;
      timer = setTimeout(() => {
        setLightning(true);
        setTimeout(() => setLightning(false), 130);

        setTimeout(() => {
          if (!isMuted) escapeAudio.playThunderRumble();
        }, 350);

        scheduleNextLightning();
      }, delay);
    };

    scheduleNextLightning();
    return () => clearTimeout(timer);
  }, [isMuted]);

  return (
    <>
      {/* 建築內部極微弱環境反光 (0.04) */}
      <div
        className={`absolute inset-0 bg-sky-200 pointer-events-none transition-opacity duration-100 ${
          lightning ? 'opacity-4' : 'opacity-0'
        }`}
      />

      {/* ── 窗外區域 1：左側 EXIT 門框內部 (頂緣下移至門框水平線之下 top: 36%) ── */}
      <div
        className="absolute overflow-hidden pointer-events-none"
        style={{
          top: '36%',
          left: '5%',
          width: '14%',
          height: '42%'
        }}
      >
        <div
          className={`absolute inset-0 bg-sky-100 transition-opacity duration-100 ${
            lightning ? 'opacity-70' : 'opacity-0'
          }`}
        />
        <div className="absolute inset-0 opacity-45">
          {[...Array(6)].map((_, i) => (
            <div
              key={`door-rain-${i}`}
              className="rain-line"
              style={{
                left: `${10 + i * 16}%`,
                animationDelay: `${(i * 0.16) % 0.8}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* ── 窗外區域 2：右側巨型玻璃圓鐘窗戶 (以圓形遮罩 borderRadius 50% 完美限定於時鐘外) ── */}
      <div
        className="absolute overflow-hidden pointer-events-none"
        style={{
          top: '6%',
          left: '52%',
          width: '32%',
          height: '56%',
          borderRadius: '50%' /* 圓形遮蔽：暴雨雨滴僅在巨鐘圓窗玻璃外落下，絕不穿透至四周石牆與地面 */
        }}
      >
        <div
          className={`absolute inset-0 bg-sky-100 transition-opacity duration-100 ${
            lightning ? 'opacity-70' : 'opacity-0'
          }`}
        />
        <div className="absolute inset-0 opacity-55">
          {[...Array(9)].map((_, i) => (
            <div
              key={`clock-rain-${i}`}
              className="rain-line"
              style={{
                left: `${8 + i * 10}%`,
                animationDelay: `${(i * 0.11) % 0.8}s`
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        .rain-line {
          position: absolute;
          top: -45px;
          width: 1.2px;
          height: 46px;
          background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 100%);
          transform: rotate(12deg);
          animation: stormFall 0.75s infinite linear;
        }
        @keyframes stormFall {
          0% { transform: translateY(0) rotate(12deg); }
          100% { transform: translateY(110vh) rotate(12deg); }
        }
      `}</style>
    </>
  );
};

// ══════════════════════════════════════════════════════════════
// 11. 大武山石板遺跡 (temple_1)：天頂微小碎石頭崩落
// ══════════════════════════════════════════════════════════════
const FallingPebbles = () => {
  const [active, setActive] = useState(false);
  const [fallX, setFallX] = useState(35);

  useEffect(() => {
    let timer;
    const scheduleNext = () => {
      const delay = Math.floor(Math.random() * 16000) + 26000;
      timer = setTimeout(() => {
        setFallX(Math.floor(Math.random() * 60) + 20);
        setActive(true);
        setTimeout(() => {
          setActive(false);
          scheduleNext();
        }, 2200);
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <div className="absolute top-0 inset-x-0 h-full pointer-events-none">
      <div
        className="absolute top-0 w-2 h-2 rounded-full bg-stone-700 animate-pebbleFall1"
        style={{ left: `${fallX}%`, opacity: 1 }}
      />
      <div
        className="absolute top-0 w-1.5 h-1.5 rounded-full bg-stone-600 animate-pebbleFall2"
        style={{ left: `${fallX + 2.5}%`, opacity: 1 }}
      />
      <div
        className="absolute top-0 w-1 h-1 rounded-full bg-stone-500 animate-pebbleFall3"
        style={{ left: `${fallX - 1.8}%`, opacity: 1 }}
      />
      <style>{`
        @keyframes pebbleFall1 {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
          15% { opacity: 0.85; }
          85% { transform: translateY(85vh) rotate(380deg); opacity: 0.85; }
          100% { transform: translateY(92vh) rotate(450deg); opacity: 0; }
        }
        @keyframes pebbleFall2 {
          0% { transform: translateY(-15px) rotate(0deg); opacity: 0; }
          15% { opacity: 0.8; }
          85% { transform: translateY(84vh) rotate(-320deg); opacity: 0.8; }
          100% { transform: translateY(91vh) rotate(-400deg); opacity: 0; }
        }
        @keyframes pebbleFall3 {
          0% { transform: translateY(-8px) rotate(0deg); opacity: 0; }
          15% { opacity: 0.75; }
          85% { transform: translateY(86vh) rotate(240deg); opacity: 0.75; }
          100% { transform: translateY(93vh) rotate(300deg); opacity: 0; }
        }
        .animate-pebbleFall1 { animation: pebbleFall1 2s cubic-bezier(0.5, 0, 0.9, 1) forwards; }
        .animate-pebbleFall2 { animation: pebbleFall2 2.2s cubic-bezier(0.5, 0, 0.9, 1) 0.12s forwards; }
        .animate-pebbleFall3 { animation: pebbleFall3 1.9s cubic-bezier(0.5, 0, 0.9, 1) 0.08s forwards; }
      `}</style>
    </div>
  );
};
