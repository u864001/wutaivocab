import React, { useState, useEffect, useRef } from 'react';
import { escapeAudio } from './escapeAudio';

/**
 * 密室逃脫：單一主題沉浸彩蛋層 (Chamber Ambience Layer)
 * 規格要求：
 * 1. 絕不干擾主視覺與解謎互動 (pointer-events-none, 低透明度, 外圍/底部活動)
 * 2. 每張房間底圖僅啟用 1 種專屬微小彩蛋，避免充斥
 * 3. 隨機間隔偶發觸發 (20~50 秒觸發一次)，真實且神秘
 */
export const ChamberAmbience = ({ themeId = 'temple', isMuted = false }) => {
  const tid = String(themeId).toLowerCase();

  // 判定當前房間對應之單一彩蛋類型
  const ambienceType = (() => {
    if (tid === 'temple' || tid === 'temple_1') return 'falling_pebbles'; // 第一室石板屋：偶爾崩落的微小碎石
    if (tid === 'library' || tid === 'temple_2') return 'spider';         // 知識庫：邊緣爬行的小蜘蛛
    if (tid === 'observatory' || tid === 'temple_3') return 'shooting_star'; // 星象祭壇：夜空偶爾劃過的銀白流星

    if (tid.startsWith('dungeon_1')) return 'mouse';                      // 地牢囚室：地板暗影急竄小老鼠
    if (tid.startsWith('dungeon_2')) return 'spider';                     // 煉金長廊：石壁青苔邊緣小蜘蛛
    if (tid.startsWith('dungeon_3')) return 'lava_embers';                // 熔岩深淵：熔岩河上方微小金橙火星

    if (tid.startsWith('tomb_1')) return 'scarab';                        // 古墓外槨室：地面緩慢爬行黑金聖甲蟲
    if (tid.startsWith('tomb_2')) return 'golden_motes';                  // 寶庫神殿：光束中漂浮的微弱金粉塵
    if (tid.startsWith('tomb_3')) return 'sunbeam_motes';                 // 太陽神殿：天頂金光中的浮游塵斑

    if (tid.startsWith('asylum_1')) return 'mouse';                       // 廢棄門廳：木地板角落竄過的小老鼠
    if (tid.startsWith('asylum_2')) return 'spider';                      // 齒輪機械室：齒輪暗處的小蜘蛛
    if (tid.startsWith('asylum_3')) return 'storm_rain';                  // 鐘樓頂層：窗外雨絲與遠處極罕見微雷光

    return 'spider';
  })();

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden">
      <style>{`
        @keyframes spiderCrawlRight {
          0% { transform: translateY(-30px) rotate(15deg); opacity: 0; }
          12% { opacity: 0.65; }
          25% { transform: translateY(50px) rotate(20deg); opacity: 0.65; }
          40% { transform: translateY(50px) rotate(20deg); opacity: 0.65; }
          55% { transform: translateY(120px) translateX(-25px) rotate(-10deg); opacity: 0.65; }
          70% { transform: translateY(120px) translateX(-25px) rotate(-10deg); opacity: 0.65; }
          90% { opacity: 0.6; }
          100% { transform: translateY(220px) translateX(-50px) rotate(-35deg); opacity: 0; }
        }
        @keyframes spiderCrawlLeft {
          0% { transform: translateY(-30px) rotate(-15deg); opacity: 0; }
          12% { opacity: 0.65; }
          25% { transform: translateY(50px) rotate(-20deg); opacity: 0.65; }
          40% { transform: translateY(50px) rotate(-20deg); opacity: 0.65; }
          55% { transform: translateY(120px) translateX(25px) rotate(10deg); opacity: 0.65; }
          70% { transform: translateY(120px) translateX(25px) rotate(10deg); opacity: 0.65; }
          90% { opacity: 0.6; }
          100% { transform: translateY(220px) translateX(50px) rotate(35deg); opacity: 0; }
        }
        .animate-spiderCrawlRight { animation: spiderCrawlRight 9.5s linear forwards; }
        .animate-spiderCrawlLeft { animation: spiderCrawlLeft 9.5s linear forwards; }

        @keyframes mouseRunL2R {
          0% { transform: translateX(-60px); opacity: 0; }
          10% { opacity: 0.75; }
          28% { transform: translateX(24vw); opacity: 0.75; }
          40% { transform: translateX(24vw) rotate(-3deg); opacity: 0.75; }
          55% { transform: translateX(24vw) rotate(3deg); opacity: 0.75; }
          70% { transform: translateX(52vw); opacity: 0.75; }
          90% { opacity: 0.7; }
          100% { transform: translateX(105vw); opacity: 0; }
        }
        @keyframes mouseRunR2L {
          0% { transform: translateX(105vw); opacity: 0; }
          10% { opacity: 0.75; }
          28% { transform: translateX(76vw); opacity: 0.75; }
          40% { transform: translateX(76vw) rotate(3deg); opacity: 0.75; }
          55% { transform: translateX(76vw) rotate(-3deg); opacity: 0.75; }
          70% { transform: translateX(48vw); opacity: 0.75; }
          90% { opacity: 0.7; }
          100% { transform: translateX(-60px); opacity: 0; }
        }
        .animate-mouseRunL2R { animation: mouseRunL2R 5.2s cubic-bezier(0.3, 0, 0.2, 1) forwards; }
        .animate-mouseRunR2L { animation: mouseRunR2L 5.2s cubic-bezier(0.3, 0, 0.2, 1) forwards; }

        @keyframes scarabCrawl {
          0% { transform: translateY(20px) rotate(0deg); opacity: 0; }
          15% { opacity: 0.7; }
          30% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          45% { transform: translateY(-12px) rotate(15deg); opacity: 0.7; }
          60% { transform: translateY(-12px) rotate(15deg); opacity: 0.7; }
          80% { transform: translateY(-28px) rotate(25deg); opacity: 0.65; }
          100% { transform: translateY(-45px) rotate(30deg); opacity: 0; }
        }
        .animate-scarabCrawl { animation: scarabCrawl 8s ease-in-out forwards; }

        @keyframes pebbleFall1 {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
          15% { opacity: 0.8; }
          85% { transform: translateY(85vh) rotate(380deg); opacity: 0.7; }
          100% { transform: translateY(92vh) rotate(450deg); opacity: 0; }
        }
        @keyframes pebbleFall2 {
          0% { transform: translateY(-15px) rotate(0deg); opacity: 0; }
          15% { opacity: 0.75; }
          85% { transform: translateY(84vh) rotate(-320deg); opacity: 0.65; }
          100% { transform: translateY(91vh) rotate(-400deg); opacity: 0; }
        }
        @keyframes pebbleFall3 {
          0% { transform: translateY(-8px) rotate(0deg); opacity: 0; }
          15% { opacity: 0.7; }
          85% { transform: translateY(86vh) rotate(240deg); opacity: 0.6; }
          100% { transform: translateY(93vh) rotate(300deg); opacity: 0; }
        }
        .animate-pebbleFall1 { animation: pebbleFall1 2s cubic-bezier(0.5, 0, 0.9, 1) forwards; }
        .animate-pebbleFall2 { animation: pebbleFall2 2.2s cubic-bezier(0.5, 0, 0.9, 1) 0.12s forwards; }
        .animate-pebbleFall3 { animation: pebbleFall3 1.9s cubic-bezier(0.5, 0, 0.9, 1) 0.08s forwards; }

        @keyframes shootingStar {
          0% { transform: rotate(-40deg) translateX(0); opacity: 0; }
          15% { opacity: 1; }
          80% { opacity: 0.85; }
          100% { transform: rotate(-40deg) translateX(-260px); opacity: 0; }
        }
        .animate-shootingStar { animation: shootingStar 0.8s ease-out forwards; }
      `}</style>

      {ambienceType === 'spider' && <SpiderCritter />}
      {ambienceType === 'mouse' && <MouseCritter isMuted={isMuted} />}
      {ambienceType === 'scarab' && <ScarabCritter />}
      {ambienceType === 'falling_pebbles' && <FallingPebbles />}
      {ambienceType === 'shooting_star' && <ShootingStar />}
      {ambienceType === 'lava_embers' && <LavaEmbers />}
      {ambienceType === 'storm_rain' && <StormRain />}
      {ambienceType === 'golden_motes' && <DustMotes color="gold" />}
      {ambienceType === 'sunbeam_motes' && <DustMotes color="sun" />}
    </div>
  );
};

// ── 彩蛋 1：外圍牆角爬行的小蜘蛛 (走走停停、不定軌跡) ──
const SpiderCritter = () => {
  const [active, setActive] = useState(false);
  const [side, setSide] = useState('right'); // 'left' | 'right'

  useEffect(() => {
    let timeoutId;
    const scheduleNext = () => {
      // 每 28 ~ 46 秒偶爾出現一次
      const delay = Math.floor(Math.random() * 18000) + 28000;
      timeoutId = setTimeout(() => {
        setSide(Math.random() > 0.5 ? 'right' : 'left');
        setActive(true);
        // 動畫持續 9.5 秒後消失
        setTimeout(() => {
          setActive(false);
          scheduleNext();
        }, 9500);
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, []);

  if (!active) return null;

  return (
    <div
      className={`absolute ${side === 'right' ? 'right-2 sm:right-6 animate-spiderCrawlRight' : 'left-2 sm:left-6 animate-spiderCrawlLeft'} top-16 sm:top-24 opacity-60`}
      style={{ width: '22px', height: '22px' }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-slate-800 drop-shadow-sm">
        {/* 蜘蛛腹部與頭胸部 */}
        <ellipse cx="12" cy="14" rx="3.5" ry="4.5" fill="currentColor" />
        <circle cx="12" cy="8.5" r="2.5" fill="currentColor" />
        {/* 8 條節肢蜘蛛腿 */}
        <path d="M9 12 C5 9, 3 13, 2 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M15 12 C19 9, 21 13, 22 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M9.5 13 C6 13, 4 17, 3 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M14.5 13 C18 13, 20 17, 21 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M10 9 C7 6, 5 8, 3 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M14 9 C17 6, 19 8, 21 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M11 7 C9 3, 7 4, 5 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M13 7 C15 3, 17 4, 19 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  );
};

// ── 彩蛋 2：底層溜過的小老鼠 (急竄、短暫駐足嗅聞、偶發「吱」聲) ──
const MouseCritter = ({ isMuted = false }) => {
  const [active, setActive] = useState(false);
  const [direction, setDirection] = useState('leftToRight');

  useEffect(() => {
    let timeoutId;
    const scheduleNext = () => {
      // 每 32 ~ 52 秒偶發一次
      const delay = Math.floor(Math.random() * 20000) + 32000;
      timeoutId = setTimeout(() => {
        const dir = Math.random() > 0.5 ? 'leftToRight' : 'rightToLeft';
        setDirection(dir);
        setActive(true);

        // 老鼠停頓時 (約 1.8 秒後) 發出極微小逼真的「吱」聲
        setTimeout(() => {
          if (!isMuted) {
            escapeAudio.playMouseSqueak();
          }
        }, 1800);

        // 完整跑動動畫持續約 5.2 秒
        setTimeout(() => {
          setActive(false);
          scheduleNext();
        }, 5200);
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [isMuted]);

  if (!active) return null;

  return (
    <div
      className={`absolute bottom-6 sm:bottom-10 opacity-70 ${
        direction === 'leftToRight' ? 'animate-mouseRunL2R' : 'animate-mouseRunR2L'
      }`}
      style={{ width: '36px', height: '18px' }}
    >
      <svg
        viewBox="0 0 36 18"
        fill="none"
        className={`w-full h-full text-slate-900 drop-shadow-sm ${direction === 'rightToLeft' ? 'scale-x-[-1]' : ''}`}
      >
        {/* 老鼠身體與微翹耳朵 */}
        <ellipse cx="18" cy="11" rx="9" ry="5.5" fill="currentColor" />
        <circle cx="27" cy="8.5" r="2.8" fill="currentColor" />
        <ellipse cx="23" cy="6" rx="2.2" ry="3" fill="#334155" />
        {/* 尖鼻子 */}
        <path d="M29 9.5 L34 11 L29 12.5 Z" fill="currentColor" />
        {/* 細長波浪尾巴 */}
        <path d="M9 12 C5 14, 2 10, 0 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        {/* 快速小爪 */}
        <line x1="14" y1="15" x2="13" y2="17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="22" y1="15" x2="23" y2="17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
};

// ── 彩蛋 3：古墓地面黑金色聖甲蟲 (穩重爬行、觸角探路) ──
const ScarabCritter = () => {
  const [active, setActive] = useState(false);
  const [posX, setPosX] = useState(30);

  useEffect(() => {
    let timeoutId;
    const scheduleNext = () => {
      // 每 30 ~ 48 秒偶發一次
      const delay = Math.floor(Math.random() * 18000) + 30000;
      timeoutId = setTimeout(() => {
        setPosX(Math.floor(Math.random() * 50) + 20); // 隨機出現在地面中央偏下
        setActive(true);
        setTimeout(() => {
          setActive(false);
          scheduleNext();
        }, 8000);
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, []);

  if (!active) return null;

  return (
    <div
      className="absolute bottom-8 sm:bottom-12 opacity-65 animate-scarabCrawl"
      style={{ left: `${posX}%`, width: '24px', height: '24px' }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-stone-900 drop-shadow-md">
        {/* 甲殼與微弱暗金紋路 */}
        <ellipse cx="12" cy="13" rx="4.5" ry="6" fill="#1c1917" />
        <path d="M12 7 L12 19" stroke="#d97706" strokeWidth="0.6" strokeDasharray="1 1" />
        <ellipse cx="12" cy="6" rx="3" ry="2" fill="#292524" />
        {/* 聖甲蟲前齒角 */}
        <path d="M10 4 L12 2 L14 4" stroke="#d97706" strokeWidth="0.8" strokeLinecap="round" />
        {/* 6 條外彎爬行步足 */}
        <path d="M8 8 C5 6, 4 8, 3 10" stroke="#1c1917" strokeWidth="1" strokeLinecap="round" />
        <path d="M16 8 C19 6, 20 8, 21 10" stroke="#1c1917" strokeWidth="1" strokeLinecap="round" />
        <path d="M7 13 C4 13, 3 15, 2 16" stroke="#1c1917" strokeWidth="1" strokeLinecap="round" />
        <path d="M17 13 C20 13, 21 15, 22 16" stroke="#1c1917" strokeWidth="1" strokeLinecap="round" />
        <path d="M8 17 C5 19, 4 21, 3 22" stroke="#1c1917" strokeWidth="1" strokeLinecap="round" />
        <path d="M16 17 C19 19, 20 21, 21 22" stroke="#1c1917" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  );
};

// ── 彩蛋 4：石板屋上方崩落的碎石頭粉塵 (自然重力飄散) ──
const FallingPebbles = () => {
  const [active, setActive] = useState(false);
  const [fallX, setFallX] = useState(35);

  useEffect(() => {
    let timeoutId;
    const scheduleNext = () => {
      // 每 26 ~ 42 秒偶發一次
      const delay = Math.floor(Math.random() * 16000) + 26000;
      timeoutId = setTimeout(() => {
        setFallX(Math.floor(Math.random() * 60) + 20);
        setActive(true);
        setTimeout(() => {
          setActive(false);
          scheduleNext();
        }, 2200);
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, []);

  if (!active) return null;

  return (
    <div className="absolute top-0 inset-x-0 h-full pointer-events-none">
      <div
        className="absolute top-0 w-2 h-2 rounded-full bg-stone-700/80 animate-pebbleFall1"
        style={{ left: `${fallX}%` }}
      />
      <div
        className="absolute top-0 w-1.5 h-1.5 rounded-full bg-stone-600/70 animate-pebbleFall2"
        style={{ left: `${fallX + 2.5}%` }}
      />
      <div
        className="absolute top-0 w-1 h-1 rounded-full bg-stone-500/60 animate-pebbleFall3"
        style={{ left: `${fallX - 1.8}%` }}
      />
    </div>
  );
};

// ── 彩蛋 5：星象大殿夜空偶爾劃過的銀白流星 ──
const ShootingStar = () => {
  const [active, setActive] = useState(false);
  const [startPos, setStartPos] = useState({ top: '12%', left: '60%' });

  useEffect(() => {
    let timeoutId;
    const scheduleNext = () => {
      // 每 22 ~ 36 秒偶發一道流星
      const delay = Math.floor(Math.random() * 14000) + 22000;
      timeoutId = setTimeout(() => {
        setStartPos({
          top: `${Math.floor(Math.random() * 20) + 8}%`,
          left: `${Math.floor(Math.random() * 35) + 45}%`
        });
        setActive(true);
        setTimeout(() => {
          setActive(false);
          scheduleNext();
        }, 900);
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, []);

  if (!active) return null;

  return (
    <div
      className="absolute animate-shootingStar"
      style={{
        top: startPos.top,
        left: startPos.left,
        width: '120px',
        height: '2px',
        background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 80%, rgba(224,242,254,1) 100%)',
        boxShadow: '0 0 8px rgba(255,255,255,0.8)',
        transform: 'rotate(-40deg)',
        transformOrigin: 'right center'
      }}
    />
  );
};

// ── 彩蛋 6：熔岩深淵上方飄散微弱金橙火星餘燼 ──
const LavaEmbers = () => {
  return (
    <div className="absolute bottom-0 inset-x-0 h-48 pointer-events-none overflow-hidden">
      <div className="ember-particle ember-1" />
      <div className="ember-particle ember-2" />
      <div className="ember-particle ember-3" />
      <div className="ember-particle ember-4" />
      <style>{`
        .ember-particle {
          position: absolute;
          bottom: 0;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #fb923c;
          box-shadow: 0 0 6px #f97316;
          opacity: 0;
          animation: emberRise 6s infinite ease-out;
        }
        .ember-1 { left: 22%; animation-delay: 0.5s; animation-duration: 5.5s; }
        .ember-2 { left: 48%; animation-delay: 2.2s; animation-duration: 6.8s; }
        .ember-3 { left: 74%; animation-delay: 3.8s; animation-duration: 5.2s; }
        .ember-4 { left: 35%; animation-delay: 4.5s; animation-duration: 6.2s; }
        @keyframes emberRise {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          20% { opacity: 0.7; }
          60% { transform: translateY(-70px) translateX(12px) scale(0.8); opacity: 0.5; }
          100% { transform: translateY(-130px) translateX(-8px) scale(0.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// ── 彩蛋 7：暴風雨鐘樓雨絲與遠處極罕見微雷光 ──
const StormRain = () => {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let timeoutId;
    const scheduleNextFlash = () => {
      // 每 35 ~ 55 秒遠處夜空極柔和微閃一次
      const delay = Math.floor(Math.random() * 20000) + 35000;
      timeoutId = setTimeout(() => {
        setFlash(true);
        setTimeout(() => setFlash(false), 140);
        scheduleNextFlash();
      }, delay);
    };

    scheduleNextFlash();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      {/* 遠處夜空微弱雷光映照 (極低透明度 0.12，絕不刺眼) */}
      <div
        className={`absolute inset-0 bg-sky-200 pointer-events-none transition-opacity duration-100 ${
          flash ? 'opacity-12' : 'opacity-0'
        }`}
      />
      {/* 淡淡的窗外雨絲 */}
      <div className="absolute inset-0 opacity-25 pointer-events-none overflow-hidden">
        <div className="rain-streak r-1" />
        <div className="rain-streak r-2" />
        <div className="rain-streak r-3" />
        <div className="rain-streak r-4" />
        <style>{`
          .rain-streak {
            position: absolute;
            top: -40px;
            width: 1px;
            height: 36px;
            background: linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.6));
            animation: rainFall 1.2s infinite linear;
          }
          .r-1 { left: 15%; animation-delay: 0.2s; }
          .r-2 { left: 38%; animation-delay: 0.7s; }
          .r-3 { left: 68%; animation-delay: 0.4s; }
          .r-4 { left: 85%; animation-delay: 0.9s; }
          @keyframes rainFall {
            0% { transform: translateY(0) translateX(0); }
            100% { transform: translateY(110vh) translateX(-20px); }
          }
        `}</style>
      </div>
    </>
  );
};

// ── 彩蛋 8：神殿與寶庫光束中的微弱塵斑 (Dust Motes) ──
const DustMotes = ({ color = 'gold' }) => {
  const isGold = color === 'gold';
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className={`dust-mote d-1 ${isGold ? 'bg-amber-400' : 'bg-amber-200'}`} />
      <div className={`dust-mote d-2 ${isGold ? 'bg-yellow-300' : 'bg-amber-100'}`} />
      <div className={`dust-mote d-3 ${isGold ? 'bg-amber-300' : 'bg-white'}`} />
      <style>{`
        .dust-mote {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          filter: blur(0.5px);
          animation: floatMote 8s infinite ease-in-out;
        }
        .d-1 { top: 38%; left: 45%; animation-delay: 0s; animation-duration: 9s; }
        .d-2 { top: 48%; left: 52%; animation-delay: 2s; animation-duration: 7.5s; }
        .d-3 { top: 28%; left: 49%; animation-delay: 4.5s; animation-duration: 8.5s; }
        @keyframes floatMote {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.1; }
          50% { transform: translateY(-16px) translateX(8px); opacity: 0.55; }
        }
      `}</style>
    </div>
  );
};
