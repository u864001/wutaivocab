import React, { useState, useEffect, useRef } from 'react';
import { getRandomQuote } from '../../data/forestQuotes';
import { Sparkles } from 'lucide-react';

// 四大常態神獸定義
const CORE_ANIMALS = [
  {
    id: 'clouded_leopard',
    name: '台灣雲豹',
    title: '神聖引路者 Likulaw',
    speed: '疾速如風',
    icon: '🐆',
    color: 'from-amber-500 to-yellow-300',
    src: '/assets/common/loader/clouded_leopard.webp'
  },
  {
    id: 'black_bear',
    name: '台灣黑熊',
    title: '山林守護者 Cumay',
    speed: '威武沉穩',
    icon: '🐻',
    color: 'from-stone-600 to-amber-600',
    src: '/assets/common/loader/black_bear.webp'
  },
  {
    id: 'wild_boar',
    name: '神山野豬',
    title: '衝鋒勇士 Babuy',
    speed: '勇往直前',
    icon: '🐗',
    color: 'from-orange-600 to-amber-700',
    src: '/assets/common/loader/wild_boar.webp'
  },
  {
    id: 'sambar_deer',
    name: '台灣水鹿',
    title: '高山精靈 Venado',
    speed: '長角輕躍',
    icon: '🦌',
    color: 'from-emerald-500 to-teal-300',
    src: '/assets/common/loader/sambar_deer.webp'
  }
];

// 12 個月份節慶限定輪替動物彩蛋 (全新排定，絕不重複，各具文化/節慶與向前動態)
const SEASONAL_ANIMALS = {
  1: { id: 'eagle', name: '神山金鷹', title: '元旦迎曦之翼', speed: '展翅翱翔', icon: '🦅', color: 'from-yellow-500 to-amber-300', src: '/assets/common/loader/season_01_eagle.webp' },
  2: { id: 'sweetheart', name: '甜心萌兔', title: '情人節甜心使者', speed: '抱心躍步', icon: '🐰', color: 'from-pink-500 to-rose-400', src: '/assets/common/loader/season_02_sweetheart.webp' },
  3: { id: 'hundred_pace_snake', name: '守護百步蛇', title: '魯凱長老圖騰', speed: '靈動前行', icon: '🐍', color: 'from-amber-600 to-orange-500', src: '/assets/common/loader/season_03_snake.webp' },
  4: { id: 'easter_bunny', name: '彩蛋兔兔', title: '復活節彩蛋使者', speed: '滾蛋飛奔', icon: '🥚', color: 'from-teal-400 to-sky-300', src: '/assets/common/loader/season_04_bunny.webp' },
  5: { id: 'mother_kangaroo', name: '母子袋鼠', title: '溫馨母親節守護', speed: '溫馨躍進', icon: '🦘', color: 'from-amber-500 to-rose-300', src: '/assets/common/loader/season_05_mother.webp' },
  6: { id: 'dragon_boat', name: '端午龍舟', title: '端午奪標飛龍', speed: '乘風破浪', icon: '🚣‍♂️', color: 'from-red-600 to-amber-500', src: '/assets/common/loader/season_06_dragonboat.webp' },
  7: { id: 'flying_squirrel', name: '大赤鼯鼠', title: '夏夜林梢滑翔', speed: '俯衝飛渡', icon: '🐿️', color: 'from-amber-600 to-teal-400', src: '/assets/common/loader/season_07_squirrel.webp' },
  8: { id: 'festival_warrior', name: '神山小勇士', title: '豐年祭百合勇士', speed: '昂首闊步', icon: '🏹', color: 'from-red-600 to-stone-800', src: '/assets/common/loader/season_08_warrior.webp' },
  9: { id: 'moon_rabbit', name: '中秋奔月玉兔', title: '廣寒滿月傳奇', speed: '踏雲奔月', icon: '🌕', color: 'from-amber-300 to-yellow-100', src: '/assets/common/loader/season_09_moonrabbit.webp' },
  10: { id: 'halloween_pumpkin', name: '魔法南瓜怪', title: '萬聖奇幻南瓜', speed: '掃帚飛衝', icon: '🎃', color: 'from-orange-500 to-purple-600', src: '/assets/common/loader/season_10_pumpkin.webp' },
  11: { id: 'harvest_turkey', name: '俏皮火雞', title: '秋收感恩小使者', speed: '風火輪衝刺', icon: '🦃', color: 'from-amber-700 to-orange-400', src: '/assets/common/loader/season_11_turkey.webp' },
  12: { id: 'santa_sleigh', name: '聖誕馴鹿雪橇', title: '聖誕奇蹟之約', speed: '踏雪飛馳', icon: '🎅', color: 'from-red-500 to-emerald-400', src: '/assets/common/loader/season_12_sleigh.webp' }
};

/**
 * 依據月份選出本次展示的角色
 * 依指示：當月節慶 32%，四大常態 68% (每隻約 17%)
 */
const selectAnimalForCurrentMonth = () => {
  const currentMonth = new Date().getMonth() + 1;
  const seasonal = SEASONAL_ANIMALS[currentMonth];

  if (seasonal && Math.random() < 0.32) {
    return { ...seasonal, isSeasonal: true, month: currentMonth };
  }

  const core = CORE_ANIMALS[Math.floor(Math.random() * CORE_ANIMALS.length)];
  return { ...core, isSeasonal: false };
};

export const GamePreloader = ({
  assetUrls = [],
  title = '正在進入冒險境界...',
  minDurationMs = 1200,
  onComplete
}) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [animal, setAnimal] = useState(() => selectAnimalForCurrentMonth());
  const [quote, setQuote] = useState(() => getRandomQuote());
  const [imgError, setImgError] = useState(false);

  const startTimeRef = useRef(Date.now());
  const assetProgressRef = useRef(0);
  const animFrameRef = useRef(null);
  const hasFinishedRef = useRef(false);

  // 0. 載入頁保持靜音；離開載入頁時立即截斷語音 (Speech Synthesis Cutoff)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // 1. 真實非同步資源預載 (Real Asset Preloading with decode)
  useEffect(() => {
    if (!assetUrls || assetUrls.length === 0) {
      assetProgressRef.current = 100;
      return;
    }

    let loadedCount = 0;
    const total = assetUrls.length;

    const handleSingleDone = () => {
      loadedCount++;
      assetProgressRef.current = Math.min(100, Math.floor((loadedCount / total) * 100));
    };

    assetUrls.forEach(url => {
      const img = new Image();
      img.src = url;
      if (img.decode) {
        img.decode().then(handleSingleDone).catch(handleSingleDone);
      } else {
        img.onload = handleSingleDone;
        img.onerror = handleSingleDone;
      }
    });
  }, [assetUrls]);

  // 2. 60 FPS 平滑進度插值與最少停留時間平滑保證 (CI/測試環境縮短為 100ms 避免超時)
  const isCI = typeof navigator !== 'undefined' && (Boolean(navigator.webdriver) || Boolean(window.__CI__));
  const effectiveMinDuration = isCI ? 100 : minDurationMs;

  useEffect(() => {
    const loop = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const timeRatio = Math.min(1, elapsed / effectiveMinDuration);
      const timePercent = timeRatio * 100;

      // 資源進度與時間進度取最大值，確保絕不因特定圖檔解碼卡在 0%
      const targetPercent = Math.max(timePercent, assetProgressRef.current);

      setProgress(prev => {
        const next = Math.max(prev, Math.floor(targetPercent));

        if (next >= 100 && !hasFinishedRef.current) {
          hasFinishedRef.current = true;
          // CI 環境即刻淡出，真實環境保留 300ms 柔和過渡
          const exitDelay = isCI ? 0 : 120;
          const fadeDuration = isCI ? 0 : 250;
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, fadeDuration);
          }, exitDelay);
        }

        return next;
      });

      if (!hasFinishedRef.current) {
        animFrameRef.current = requestAnimationFrame(loop);
      }
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [effectiveMinDuration, onComplete, isCI]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-stone-950 text-stone-100 transition-opacity duration-300 select-none overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundImage: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.75) 0%, rgba(2, 6, 23, 0.98) 100%)'
      }}
    >
      {/* 柔和暗色背景微紋理 (中性深灰點，絕不泛黃) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative w-full max-w-lg mx-auto flex flex-col items-center text-center px-4">
        {/* 標題與節慶標籤 */}
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-amber-400 animate-spin-slow" />
          <h2 className="text-xl sm:text-2xl font-black font-heading tracking-wide text-amber-400 drop-shadow-md">
            {title}
          </h2>
          {animal.isSeasonal && (
            <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {animal.month}月限定
            </span>
          )}
        </div>

        {/* 跑道與奔跑動物容器 */}
        <div className="w-full relative py-6 mb-3">
          {/* 奔跑動物角色 (隨 progress 水平移動，面向右方衝刺) */}
          <div
            className="absolute -top-8 transition-all duration-75 ease-out flex flex-col items-center pointer-events-none"
            style={{
              left: `clamp(0px, calc(${progress}% - 28px), calc(100% - 56px))`
            }}
          >
            {/* 動態角色顯示 (完全去除金色光暈與金霧，呈現純淨鮮明的兒童繪本風) */}
            <div className="relative w-14 h-14 flex items-center justify-center animate-bounce">
              {!imgError ? (
                <img
                  src={animal.src}
                  alt={animal.name}
                  onError={() => setImgError(true)}
                  className="w-14 h-14 object-contain select-none pointer-events-none relative z-10"
                />
              ) : (
                /* 優雅降級圖標 */
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-stone-800 to-stone-700 border border-stone-600 flex items-center justify-center text-2xl shadow-lg relative z-10">
                  {animal.icon}
                </div>
              )}

              {/* 腳底純黑地面接地陰影 (純黑自然接地，絕無任何金色光暈) */}
              <div className="absolute -bottom-1 w-8 h-1.5 rounded-full bg-black/45 blur-[1px] pointer-events-none z-0" />
            </div>
          </div>

          {/* 神山石槽進度條底座 */}
          <div className="w-full h-4 rounded-full bg-stone-900/90 border-2 border-stone-700/80 p-0.5 shadow-inner overflow-hidden relative">
            {/* 進度填充槽 */}
            <div
              className={`h-full rounded-full bg-gradient-to-r ${animal.color} transition-all duration-75 ease-out relative shadow-[0_0_12px_rgba(245,158,11,0.5)]`}
              style={{ width: `${progress}%` }}
            >
              {/* 高光流動條 */}
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
              {/* 進度前沿引路光圈 (Leading Head Indicator) */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/80 rounded-full shadow-[0_0_8px_#ffffff]" />
            </div>
          </div>

          {/* 進度數值與動物稱號 */}
          <div className="w-full flex items-center justify-between text-xs font-bold text-stone-400 mt-2 px-1">
            <span className="flex items-center gap-1 text-amber-300/90">
              <span>{animal.title}</span>
              <span className="text-stone-500">•</span>
              <span className="text-stone-400 text-[11px]">{animal.speed}</span>
            </span>
            <span className="font-mono text-amber-400 font-black text-sm">
              {progress}%
            </span>
          </div>
        </div>

        {/* 下方神山雙語英語格言卡 (Forest Wisdom Quote Card) */}
        {quote && (
          <div className="w-full mt-4 p-4 rounded-2xl bg-stone-900/80 border border-stone-800 shadow-xl backdrop-blur-md relative overflow-hidden text-left animate-fadeIn">
            {/* 百合暗紋裝飾 */}
            <div className="absolute -right-3 -bottom-3 text-4xl opacity-10 select-none">
              🌸
            </div>

            <p className="text-[11px] font-black uppercase tracking-wider text-amber-500/80 mb-1 flex items-center gap-1.5">
              <span>📖 神山每日格言 • Forest Wisdom</span>
            </p>
            <p className="text-sm sm:text-base font-black text-amber-200 tracking-wide font-sans mb-1">
              "{quote.en}"
            </p>
            <p className="text-xs sm:text-sm font-bold text-stone-300">
              {quote.zh}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
