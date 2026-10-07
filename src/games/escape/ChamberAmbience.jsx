import React, { useState, useEffect } from 'react';
import { escapeAudio } from './escapeAudio';

/**
 * 密室逃脫：沉浸式擬真環境彩蛋層 (Chamber Ambience Layer)
 * 規格要求：
 * 1. 絕不干擾主視覺與解謎互動 (pointer-events-none, 外圍/深度背景活動)
 * 2. 每張房間底圖僅啟用 1 種專屬微小彩蛋，避免充斥
 * 3. 生物擬真無透明度 (100% 實物不透明度)、自然活動模式
 * 4. 嚴格的前後景遮蔽關係 (流星與暴雨嚴格限制於窗外/門框內部，人物黑影遮蔽於半開門縫內)
 * 5. 聲畫連動 (老鼠停頓嗅聞時「吱」聲、閃電後遠處低頻滾動雷鳴)
 */
export const ChamberAmbience = ({ themeId = 'temple', isMuted = false }) => {
  const tid = String(themeId).toLowerCase();

  // 嚴格判定當前房間對應之單一專屬彩蛋類型
  const ambienceType = (() => {
    // ── 主題一：大武山石板遺跡 ──
    if (tid === 'temple' || tid === 'temple_1') return 'falling_pebbles';       // 第一室：石板天頂偶爾崩落的碎石頭
    if (tid === 'library' || tid === 'temple_2') return 'hearth_embers';        // 第二室：壁爐上方自然飄逸的紛飛火燼 (取代蜘蛛)
    if (tid === 'observatory' || tid === 'temple_3') return 'shooting_star';    // 第三室：嚴格限定於夜空天頂開口的銀白流星

    // ── 主題二：地底黑曜地下城 ──
    if (tid.startsWith('dungeon_1')) return 'photorealistic_mouse';             // 第一室：底層 1/5 擬真不透明黑曜小老鼠 (嗅聞＋吱聲)
    if (tid.startsWith('dungeon_2')) return 'cobweb_spider';                    // 第二室：石壁拱頂蛛網上的擬真不透明蜘蛛 (偶發微動)
    if (tid.startsWith('dungeon_3')) return 'lava_embers';                      // 第三室：深處熔岩峽谷清晰飄升自然熄滅的火星

    // ── 主題三：法老秘境古墓探險 ──
    if (tid.startsWith('tomb_1')) return 'scarab';                              // 第一室：地面石板爬行的擬真不透明黑金聖甲蟲
    if (tid.startsWith('tomb_2')) return 'shadow_intruder';                     // 第二室：背景中央深處半開門縫閃過的神秘人物黑影
    if (tid.startsWith('tomb_3')) return 'sunbeam_motes';                       // 第三室：天頂太陽神天光束中翻騰的 8~12 處金塵光斑

    // ── 主題四：殘破時鐘廢棄建築 ──
    if (tid.startsWith('asylum_1')) return 'cobweb_spider';                     // 第一室：廢棄門廳蛛網上的擬真不透明蜘蛛
    if (tid.startsWith('asylum_2')) return 'daylight_motes';                    // 第二室：拱窗灑入白陽光中的 1~3 處緩慢飄落塵斑
    if (tid.startsWith('asylum_3')) return 'masked_storm_rain';                 // 第三室：嚴格擋在門框與鐘面外的窗外暴雨＋閃電雷鳴

    return 'hearth_embers';
  })();

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden">
      {ambienceType === 'falling_pebbles' && <FallingPebbles />}
      {ambienceType === 'hearth_embers' && <HearthEmbers />}
      {ambienceType === 'shooting_star' && <ShootingStarMasked />}
      {ambienceType === 'photorealistic_mouse' && <PhotorealisticMouse isMuted={isMuted} />}
      {ambienceType === 'cobweb_spider' && <CobwebSpider />}
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
// 1. 典籍知識庫 (library / temple_2)：壁爐紛飛火燼 (取代蜘蛛)
// ══════════════════════════════════════════════════════════════
const HearthEmbers = () => {
  return (
    <div
      className="absolute pointer-events-none overflow-hidden"
      style={{
        left: '18%',
        bottom: '12%',
        width: '18%',
        height: '26%'
      }}
    >
      <div className="hearth-ember e-1" />
      <div className="hearth-ember e-2" />
      <div className="hearth-ember e-3" />
      <div className="hearth-ember e-4" />
      <div className="hearth-ember e-5" />
      <style>{`
        .hearth-ember {
          position: absolute;
          bottom: 2px;
          border-radius: 50%;
          background: #fb923c;
          box-shadow: 0 0 6px #f97316, 0 0 2px #fff;
          opacity: 0;
          animation: hearthEmberRise 4.2s infinite ease-out;
        }
        .e-1 { left: 28%; width: 2.5px; height: 2.5px; animation-delay: 0.2s; animation-duration: 3.8s; }
        .e-2 { left: 45%; width: 3px; height: 3px; animation-delay: 1.6s; animation-duration: 4.5s; background: #fde047; }
        .e-3 { left: 62%; width: 2px; height: 2px; animation-delay: 2.8s; animation-duration: 3.4s; }
        .e-4 { left: 36%; width: 3.5px; height: 3.5px; animation-delay: 3.5s; animation-duration: 4.8s; background: #ea580c; }
        .e-5 { left: 75%; width: 2.5px; height: 2.5px; animation-delay: 4.6s; animation-duration: 4.0s; }
        @keyframes hearthEmberRise {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          25% { opacity: 0.85; }
          60% { transform: translateY(-45px) translateX(6px) scale(0.8); opacity: 0.6; }
          100% { transform: translateY(-100px) translateX(-4px) scale(0.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 2. 星象大殿 (observatory / temple_3)：夜空開口處被建築嚴格遮蔽的流星
// ══════════════════════════════════════════════════════════════
const ShootingStarMasked = () => {
  const [active, setActive] = useState(false);
  const [starKey, setStarKey] = useState(0);

  useEffect(() => {
    let timer;
    const scheduleNext = () => {
      // 每 22 ~ 36 秒偶發一道流星
      const delay = Math.floor(Math.random() * 14000) + 22000;
      timer = setTimeout(() => {
        setStarKey(k => k + 1);
        setActive(true);
        setTimeout(() => {
          setActive(false);
          scheduleNext();
        }, 900);
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timer);
  }, []);

  return (
    // 嚴格裁切容器：僅限於天頂穹頂夜空開口區域 (top: 2%~32%, left: 32%~68%)
    <div
      className="absolute overflow-hidden pointer-events-none"
      style={{
        top: '2%',
        left: '32%',
        width: '36%',
        height: '30%'
      }}
    >
      {active && (
        <div
          key={starKey}
          className="absolute animate-celestialStar"
          style={{
            top: '15%',
            right: '10%',
            width: '130px',
            height: '2px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 85%, rgba(224,242,254,1) 100%)',
            boxShadow: '0 0 10px rgba(255,255,255,0.9)',
            transformOrigin: 'right center'
          }}
        />
      )}
      <style>{`
        @keyframes celestialStar {
          0% { transform: rotate(-38deg) translateX(0); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 0.9; }
          100% { transform: rotate(-38deg) translateX(-280px); opacity: 0; }
        }
        .animate-celestialStar {
          animation: celestialStar 0.85s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 3. 黑曜石囚室 (dungeon_1)：底部 1/5 擬真不透明黑曜小老鼠 (停頓嗅聞＋吱聲)
// ══════════════════════════════════════════════════════════════
const PhotorealisticMouse = ({ isMuted = false }) => {
  const [active, setActive] = useState(false);
  const [direction, setDirection] = useState('leftToRight');

  useEffect(() => {
    let timer;
    const scheduleNext = () => {
      // 每 28 ~ 46 秒偶發一次
      const delay = Math.floor(Math.random() * 18000) + 28000;
      timer = setTimeout(() => {
        const dir = Math.random() > 0.5 ? 'leftToRight' : 'rightToLeft';
        setDirection(dir);
        setActive(true);

        // 老鼠停頓嗅聞時 (動畫約 1.7 秒處) 發出細微逼真的「吱」聲
        setTimeout(() => {
          if (!isMuted) {
            escapeAudio.playMouseSqueak();
          }
        }, 1700);

        // 完整跑動歷時 5.4 秒
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
      style={{ width: '42px', height: '22px', opacity: 1 /* 100% 實物完全不透明 */ }}
    >
      <svg
        viewBox="0 0 42 22"
        fill="none"
        className={`w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] ${
          direction === 'rightToLeft' ? 'scale-x-[-1]' : ''
        }`}
      >
        {/* 實體鼠身 (擬真深炭黑毛色層次) */}
        <ellipse cx="20" cy="13" rx="11" ry="6.5" fill="#1c1917" />
        <ellipse cx="20" cy="11.5" rx="9.5" ry="5.5" fill="#292524" />
        {/* 頭部與微翹耳朵 */}
        <circle cx="31" cy="10" r="3.5" fill="#1c1917" />
        <ellipse cx="27" cy="7.2" rx="2.5" ry="3.2" fill="#292524" />
        <ellipse cx="27" cy="7.2" rx="1.5" ry="2.2" fill="#44403c" />
        {/* 烏亮眼睛 */}
        <circle cx="32.5" cy="9.2" r="0.8" fill="#09090b" />
        <circle cx="32.7" cy="9" r="0.3" fill="#ffffff" />
        {/* 鼻尖與細微鬍鬚 */}
        <path d="M34 11 L39 12.5 L34 13.8 Z" fill="#1c1917" />
        <line x1="37" y1="12" x2="41" y2="10" stroke="#78716c" strokeWidth="0.6" strokeLinecap="round" />
        <line x1="37" y1="13" x2="41" y2="15" stroke="#78716c" strokeWidth="0.6" strokeLinecap="round" />
        {/* 靈活自然彎曲長尾巴 */}
        <path d="M10 14 C5 17, 2 12, 0 13" stroke="#292524" strokeWidth="1.4" strokeLinecap="round" />
        {/* 爬行小爪 */}
        <path d="M16 18 L15 21" stroke="#292524" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M26 18 L27 21" stroke="#292524" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <style>{`
        @keyframes realMouseL2R {
          0% { transform: translateX(-60px); }
          15% { transform: translateX(20vw); }
          32% { transform: translateX(20vw) rotate(-2deg); } /* 停頓嗅聞 */
          45% { transform: translateX(20vw) rotate(2deg); }
          60% { transform: translateX(55vw); }
          85% { transform: translateX(85vw); }
          100% { transform: translateX(110vw); }
        }
        @keyframes realMouseR2L {
          0% { transform: translateX(110vw); }
          15% { transform: translateX(80vw); }
          32% { transform: translateX(80vw) rotate(2deg); } /* 停頓嗅聞 */
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
// 4. 煉金術長廊 (dungeon_2) & 廢棄門廳 (asylum_1)：石壁蛛網上的擬真不透明蜘蛛 (偶爾微動)
// ══════════════════════════════════════════════════════════════
const CobwebSpider = () => {
  const [twitch, setTwitch] = useState(false);

  useEffect(() => {
    let timer;
    const scheduleNextTwitch = () => {
      // 蜘蛛平時在網上完全靜止，每 18 ~ 32 秒僅偶爾微微動一下爪子
      const delay = Math.floor(Math.random() * 14000) + 18000;
      timer = setTimeout(() => {
        setTwitch(true);
        setTimeout(() => {
          setTwitch(false);
          scheduleNextTwitch();
        }, 600);
      }, delay);
    };

    scheduleNextTwitch();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="absolute top-4 sm:top-7 right-4 sm:right-10 pointer-events-none select-none"
      style={{ width: '85px', height: '85px', opacity: 1 /* 100% 實物不透明 */ }}
    >
      <svg viewBox="0 0 85 85" fill="none" className="w-full h-full">
        {/* 自然精細蛛網絲線 (融入石壁背景) */}
        <path d="M0 0 L85 85" stroke="rgba(220, 220, 220, 0.38)" strokeWidth="0.8" />
        <path d="M40 0 L85 85" stroke="rgba(220, 220, 220, 0.32)" strokeWidth="0.7" />
        <path d="M85 0 L85 85" stroke="rgba(220, 220, 220, 0.38)" strokeWidth="0.8" />
        <path d="M0 40 L85 85" stroke="rgba(220, 220, 220, 0.32)" strokeWidth="0.7" />
        <path d="M25 25 C45 35, 60 45, 65 65" stroke="rgba(220, 220, 220, 0.28)" strokeWidth="0.7" />
        <path d="M45 15 C60 30, 70 45, 75 60" stroke="rgba(220, 220, 220, 0.28)" strokeWidth="0.7" />

        {/* 靜棲於蛛網中央的擬真不透明黑蜘蛛 (附偶發微動動畫) */}
        <g
          className="transition-transform duration-300"
          style={{
            transform: twitch ? 'translate(48px, 48px) rotate(4deg)' : 'translate(48px, 48px) rotate(0deg)',
            transformOrigin: '10px 10px'
          }}
        >
          {/* 蜘蛛腹部與頭胸部 */}
          <ellipse cx="10" cy="12" rx="4" ry="5.5" fill="#18181b" />
          <ellipse cx="10" cy="11" rx="3" ry="4" fill="#27272a" />
          <circle cx="10" cy="5.5" r="2.8" fill="#18181b" />

          {/* 8 條節肢彎曲步足 (完全不透明實物) */}
          <path d="M7 6 C3 3, 1 7, 0 10" stroke="#18181b" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M13 6 C17 3, 19 7, 20 10" stroke="#18181b" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M6 8 C2 7, 0 11, -1 15" stroke="#18181b" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M14 8 C18 7, 20 11, 21 15" stroke="#18181b" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M7 11 C3 12, 1 17, 0 20" stroke="#18181b" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M13 11 C17 12, 19 17, 20 20" stroke="#18181b" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M8 14 C5 17, 3 21, 2 24" stroke="#18181b" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M12 14 C15 17, 17 21, 18 24" stroke="#18181b" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 5. 熔岩深淵 (dungeon_3)：熔岩峽谷深處飄升並自然熄滅的鮮明金橙火星
// ══════════════════════════════════════════════════════════════
const LavaEmbers = () => {
  return (
    // 限制於熔岩深淵中景 (bottom: 20%~55%)，避免浮在前景欄杆上方
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
// 6. 古墓外槨 (tomb_1)：地面石板擬真不透明黑金聖甲蟲 (沉穩爬行)
// ══════════════════════════════════════════════════════════════
const ScarabCritter = () => {
  const [active, setActive] = useState(false);
  const [posX, setPosX] = useState(35);

  useEffect(() => {
    let timer;
    const scheduleNext = () => {
      // 每 24 ~ 40 秒偶發一次
      const delay = Math.floor(Math.random() * 16000) + 24000;
      timer = setTimeout(() => {
        setPosX(Math.floor(Math.random() * 45) + 25);
        setActive(true);
        setTimeout(() => {
          setActive(false);
          scheduleNext();
        }, 8200);
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <div
      className="absolute bottom-6 sm:bottom-10 pointer-events-none select-none animate-realScarab"
      style={{
        left: `${posX}%`,
        width: '28px',
        height: '28px',
        opacity: 1 /* 100% 實物不透明 */
      }}
    >
      <svg viewBox="0 0 28 28" fill="none" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
        {/* 黑金厚實甲殼 */}
        <ellipse cx="14" cy="15" rx="5.5" ry="7.5" fill="#1c1917" />
        <ellipse cx="14" cy="14" rx="4.2" ry="6.2" fill="#292524" />
        <path d="M14 8 L14 22" stroke="#d97706" strokeWidth="0.7" strokeDasharray="1 1" />
        {/* 頭胸與鋸齒挖掘鏟角 */}
        <ellipse cx="14" cy="7" rx="3.5" ry="2.2" fill="#1c1917" />
        <path d="M11.5 5 L14 2.5 L16.5 5" stroke="#b45309" strokeWidth="1" strokeLinecap="round" />
        {/* 6 條外彎抓地步足 */}
        <path d="M9 10 C5 7, 4 9, 2 12" stroke="#1c1917" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M19 10 C23 7, 24 9, 26 12" stroke="#1c1917" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M8 15 C4 15, 3 17, 1 19" stroke="#1c1917" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M20 15 C24 15, 25 17, 27 19" stroke="#1c1917" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M9 20 C6 22, 5 24, 3 26" stroke="#1c1917" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M19 20 C22 22, 23 24, 25 26" stroke="#1c1917" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <style>{`
        @keyframes realScarab {
          0% { transform: translateY(24px) rotate(0deg); }
          25% { transform: translateY(8px) rotate(2deg); }
          50% { transform: translateY(-8px) rotate(-2deg); }
          75% { transform: translateY(-24px) rotate(3deg); }
          100% { transform: translateY(-44px) rotate(0deg); }
        }
        .animate-realScarab {
          animation: realScarab 8.2s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 7. 阿努比斯寶庫 (tomb_2)：中央背景半開門縫閃過的神秘人物黑影 (嚴格遮蔽)
// ══════════════════════════════════════════════════════════════
const ShadowIntruder = () => {
  const [active, setActive] = useState(false);
  const [walkKey, setWalkKey] = useState(0);

  useEffect(() => {
    let timer;
    const scheduleNext = () => {
      // 每 26 ~ 42 秒偶發一次
      const delay = Math.floor(Math.random() * 16000) + 26000;
      timer = setTimeout(() => {
        setWalkKey(k => k + 1);
        setActive(true);
        setTimeout(() => {
          setActive(false);
          scheduleNext();
        }, 1400); // 人物步行穿越門縫耗時約 1.3 秒
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timer);
  }, []);

  return (
    // 嚴格裁切容器：僅限於中央深處半開石門縫隙 (left: 47%~53.5%, top: 28%~58%)
    // 左右兩側半開門為前景，人物黑影在門縫後方走過，出入自然被兩扇門遮蔽！
    <div
      className="absolute overflow-hidden pointer-events-none select-none"
      style={{
        left: '47%',
        top: '28%',
        width: '6.5%',
        height: '30%'
      }}
    >
      {active && (
        <div
          key={walkKey}
          className="absolute bottom-0 w-full h-[85%] animate-shadowWalk"
          style={{ opacity: 1 /* 100% 實體陰影不透明 */ }}
        >
          {/* 擬真探險者黑影剪影 (斗篷、身形、大步流星) */}
          <svg viewBox="0 0 30 65" fill="#09090b" className="w-full h-full">
            {/* 兜帽與頭部 */}
            <circle cx="15" cy="8" r="4.5" />
            {/* 飄逸長袍與身軀 */}
            <path d="M11 13 L19 13 L23 38 L7 38 Z" />
            {/* 跨步雙腿 */}
            <path d="M9 38 L6 58 L10 59 L13 40 Z" />
            <path d="M17 38 L22 56 L26 55 L19 39 Z" />
          </svg>
        </div>
      )}
      <style>{`
        @keyframes shadowWalk {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        .animate-shadowWalk {
          animation: shadowWalk 1.3s linear forwards;
        }
      `}</style>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 8. 太陽神殿 (tomb_3)：天頂太陽神天光束中翻騰的 8~12 處金塵光斑 (3~5處常態翻騰)
// ══════════════════════════════════════════════════════════════
const SunbeamMotes = () => {
  return (
    // 集中於神殿天光傾瀉區域 (left: 40%~68%, top: 18%~68%)
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
// 9. 齒輪機械室 (asylum_2)：拱窗白色陽光中的 1~3 處塵斑 (緩慢飄落變暗)
// ══════════════════════════════════════════════════════════════
const DaylightMotes = () => {
  return (
    // 集中於左中側白色陽光斜射帶
    <div
      className="absolute pointer-events-none overflow-hidden"
      style={{
        left: '26%',
        top: '22%',
        width: '32%',
        height: '48%'
      }}
    >
      <div className="daylight-mote dm-1" />
      <div className="daylight-mote dm-2" />
      <div className="daylight-mote dm-3" />
      <style>{`
        .daylight-mote {
          position: absolute;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 5px rgba(255, 255, 255, 0.9);
          filter: blur(0.5px);
          animation: daylightMoteFall 8.5s infinite ease-in-out;
        }
        .dm-1 { top: 18%; left: 35%; width: 3px; height: 3px; animation-delay: 0.5s; animation-duration: 8s; }
        .dm-2 { top: 35%; left: 55%; width: 2.5px; height: 2.5px; animation-delay: 3.2s; animation-duration: 9s; }
        .dm-3 { top: 55%; left: 42%; width: 2.8px; height: 2.8px; animation-delay: 5.8s; animation-duration: 8.5s; }
        @keyframes daylightMoteFall {
          0% { transform: translateY(-10px) translateX(0); opacity: 0; }
          25% { opacity: 0.75; }
          75% { opacity: 0.5; }
          100% { transform: translateY(50px) translateX(10px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 10. 鐘樓頂層 (asylum_3)：嚴格限於門框與鐘面外的暴雨雨滴＋閃電雷鳴
// ══════════════════════════════════════════════════════════════
const MaskedStormRain = ({ isMuted = false }) => {
  const [lightning, setLightning] = useState(false);

  useEffect(() => {
    let timer;
    const scheduleNextLightning = () => {
      // 每 30 ~ 50 秒窗外極罕見閃電一次
      const delay = Math.floor(Math.random() * 20000) + 30000;
      timer = setTimeout(() => {
        setLightning(true);
        setTimeout(() => setLightning(false), 130);

        // 閃光後 350ms，遠處傳來深沉低頻滾動雷鳴 (Procedural Audio)
        setTimeout(() => {
          if (!isMuted) {
            escapeAudio.playThunderRumble();
          }
        }, 350);

        scheduleNextLightning();
      }, delay);
    };

    scheduleNextLightning();
    return () => clearTimeout(timer);
  }, [isMuted]);

  return (
    <>
      {/* 建築內部整體極微弱反光映照 (極低透明度 0.05，絕不刺眼) */}
      <div
        className={`absolute inset-0 bg-sky-200 pointer-events-none transition-opacity duration-100 ${
          lightning ? 'opacity-5' : 'opacity-0'
        }`}
      />

      {/* ── 窗外區域 1：左側逃生 EXIT 門框內部 (嚴格裁切，雨絲只在門外下) ── */}
      <div
        className="absolute overflow-hidden pointer-events-none"
        style={{
          top: '27%',
          left: '4.8%',
          width: '16.5%',
          height: '54%'
        }}
      >
        {/* 門外夜空閃電直接照射 (窗外高亮) */}
        <div
          className={`absolute inset-0 bg-sky-100 transition-opacity duration-100 ${
            lightning ? 'opacity-70' : 'opacity-0'
          }`}
        />
        {/* 門外密集雨絲 */}
        <div className="absolute inset-0 opacity-45">
          {[...Array(6)].map((_, i) => (
            <div
              key={`door-rain-${i}`}
              className="rain-line"
              style={{
                left: `${12 + i * 16}%`,
                animationDelay: `${(i * 0.18) % 0.8}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* ── 窗外區域 2：右側巨型玻璃鐘面窗戶內部 (嚴格裁切，雨絲在鐘外飛灑) ── */}
      <div
        className="absolute overflow-hidden pointer-events-none"
        style={{
          top: '2%',
          left: '48%',
          width: '40%',
          height: '76%'
        }}
      >
        {/* 鐘面外夜空閃電直接照射 */}
        <div
          className={`absolute inset-0 bg-sky-100 transition-opacity duration-100 ${
            lightning ? 'opacity-70' : 'opacity-0'
          }`}
        />
        {/* 鐘面外密集暴雨 */}
        <div className="absolute inset-0 opacity-50">
          {[...Array(10)].map((_, i) => (
            <div
              key={`clock-rain-${i}`}
              className="rain-line"
              style={{
                left: `${6 + i * 10}%`,
                animationDelay: `${(i * 0.12) % 0.8}s`
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
          height: 48px;
          background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 100%);
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
// 11. 大武山石板遺跡 (temple / temple_1)：天頂微小碎石頭崩落 (自然重力)
// ══════════════════════════════════════════════════════════════
const FallingPebbles = () => {
  const [active, setActive] = useState(false);
  const [fallX, setFallX] = useState(35);

  useEffect(() => {
    let timer;
    const scheduleNext = () => {
      // 每 26 ~ 42 秒偶發一次
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
