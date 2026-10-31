import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Sparkles, Play, Pause, RotateCcw, Volume2, BookOpen, Calendar, Shuffle } from 'lucide-react';
import { Button3D } from './ui/Button3D';
import { FOREST_QUOTES } from '../data/forestQuotes';
import { speakEnglish } from '../services/audio';

// 16 隻完整角色矩陣 (4 常態神獸 + 12 個月份節慶限定)
const ALL_CHARACTERS = [
  // 四大常態神獸
  {
    id: 'clouded_leopard',
    name: '台灣雲豹',
    title: '神聖引路者 Likulaw',
    category: '常態守護神獸',
    badge: '常態',
    speed: '疾速如風',
    icon: '🐆',
    color: 'from-amber-500 to-yellow-300',
    src: '/assets/common/loader/clouded_leopard.webp'
  },
  {
    id: 'black_bear',
    name: '台灣黑熊',
    title: '山林守護者 Cumay',
    category: '常態守護神獸',
    badge: '常態',
    speed: '威武沉穩',
    icon: '🐻',
    color: 'from-stone-600 to-amber-600',
    src: '/assets/common/loader/black_bear.webp'
  },
  {
    id: 'wild_boar',
    name: '神山野豬',
    title: '衝鋒勇士 Babuy',
    category: '常態守護神獸',
    badge: '常態',
    speed: '勇往直前',
    icon: '🐗',
    color: 'from-orange-600 to-amber-700',
    src: '/assets/common/loader/wild_boar.webp'
  },
  {
    id: 'sambar_deer',
    name: '台灣水鹿',
    title: '高山精靈 Venado',
    category: '常態守護神獸',
    badge: '常態',
    speed: '長角輕躍',
    icon: '🦌',
    color: 'from-emerald-500 to-teal-300',
    src: '/assets/common/loader/sambar_deer.webp'
  },
  // 12 個月份節慶限定角色
  { id: 'season_01_eagle', name: '神山金鷹', title: '元旦迎曦之翼', month: 1, category: '節慶限定', badge: '1月元旦', speed: '展翅翱翔', icon: '🦅', color: 'from-yellow-500 to-amber-300', src: '/assets/common/loader/season_01_eagle.webp' },
  { id: 'season_02_snake', name: '靈蛇祥瑞', title: '新春如意金蛇', month: 2, category: '節慶限定', badge: '2月新春', speed: '騰雲駕霧', icon: '🐍', color: 'from-red-500 to-amber-400', src: '/assets/common/loader/season_02_snake.webp' },
  { id: 'season_03_deer', name: '花冠小鹿', title: '春暖花開精靈', month: 3, category: '節慶限定', badge: '3月春櫻', speed: '落櫻踏步', icon: '🌸', color: 'from-pink-400 to-rose-300', src: '/assets/common/loader/season_03_deer.webp' },
  { id: 'season_04_bunny', name: '彩蛋兔兔', title: '復活節彩蛋使者', month: 4, category: '節慶限定', badge: '4月復活', speed: '滾蛋飛奔', icon: '🐰', color: 'from-teal-400 to-sky-300', src: '/assets/common/loader/season_04_bunny.webp' },
  { id: 'season_05_lily', name: '百合精靈', title: '霧台純白聖花', month: 5, category: '節慶限定', badge: '5月母親', speed: '微風輕拂', icon: '🌺', color: 'from-amber-200 to-emerald-200', src: '/assets/common/loader/season_05_lily.webp' },
  { id: 'season_06_dragonboat', name: '端午龍舟', title: '端午奪標飛龍', month: 6, category: '節慶限定', badge: '6月端午', speed: '乘風破浪', icon: '🚣‍♂️', color: 'from-red-600 to-emerald-500', src: '/assets/common/loader/season_06_dragonboat.webp' },
  { id: 'season_07_squirrel', name: '仲夏飛鼠', title: '夏夜林梢滑翔', month: 7, category: '節慶限定', badge: '7月盛夏', speed: '林間飛渡', icon: '🐿️', color: 'from-indigo-400 to-teal-300', src: '/assets/common/loader/season_07_squirrel.webp' },
  { id: 'season_08_warrior', name: '神山戰士', title: '豐年祭百合勇士', month: 8, category: '節慶限定', badge: '8月豐年', speed: '昂首闊步', icon: '🏹', color: 'from-amber-600 to-stone-800', src: '/assets/common/loader/season_08_warrior.webp' },
  { id: 'season_09_moonrabbit', name: '中秋奔月玉兔', title: '廣寒滿月傳奇', month: 9, category: '節慶限定', badge: '9月中秋', speed: '踏雲奔月', icon: '🌕', color: 'from-amber-300 to-yellow-100', src: '/assets/common/loader/season_09_moonrabbit.webp' },
  { id: 'season_10_pumpkin', name: '萬聖南瓜怪', title: '萬聖奇幻南瓜', month: 10, category: '節慶限定', badge: '10月萬聖', speed: '歡樂彈跳', icon: '🎃', color: 'from-orange-500 to-purple-600', src: '/assets/common/loader/season_10_pumpkin.webp' },
  { id: 'season_11_turkey', name: '感恩火雞', title: '秋收感恩小使者', month: 11, category: '節慶限定', badge: '11月感恩', speed: '快步擺尾', icon: '🦃', color: 'from-amber-700 to-orange-400', src: '/assets/common/loader/season_11_turkey.webp' },
  { id: 'season_12_sleigh', name: '聖誕馴鹿雪橇', title: '聖誕奇蹟之約', month: 12, category: '節慶限定', badge: '12月聖誕', speed: '踏雪飛馳', icon: '🎅', color: 'from-red-500 to-emerald-400', src: '/assets/common/loader/season_12_sleigh.webp' }
];

export const PreloaderShowcase = ({ onBack }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [isLooping, setIsLooping] = useState(true);
  const [progress, setProgress] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'core' | 'seasonal'
  const [isQuoteListOpen, setIsQuoteListOpen] = useState(false);

  const character = ALL_CHARACTERS[selectedIdx] || ALL_CHARACTERS[0];
  const quote = FOREST_QUOTES[quoteIdx] || FOREST_QUOTES[0];

  // 自動循環進度條 (Loop 0 -> 100 -> 0)
  const dirRef = useRef(1); // 1 = forward, -1 = reverse (or reset)
  useEffect(() => {
    if (!isLooping) return;
    let animId;
    let last = performance.now();

    const loop = (now) => {
      const dt = (now - last) / 1000;
      last = now;

      setProgress(prev => {
        let next = prev + dt * 32 * speedMultiplier;
        if (next >= 100) {
          next = 0;
          // 到達 100% 時自動跳下一句格言
          setQuoteIdx(qPrev => (qPrev + 1) % FOREST_QUOTES.length);
        }
        return next;
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isLooping, speedMultiplier]);

  // 過濾角色
  const filteredChars = ALL_CHARACTERS.filter(c => {
    if (activeTab === 'core') return c.category === '常態守護神獸';
    if (activeTab === 'seasonal') return c.category === '節慶限定';
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center p-3 sm:p-6 select-none animate-fadeIn">
      {/* 頂部導航列 */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-4 sm:mb-6">
        <Button3D variant="slate" size="sm" onClick={onBack} icon={ArrowLeft}>
          返回首頁
        </Button3D>

        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400 animate-spin-slow" />
          <h1 className="text-lg sm:text-2xl font-black font-heading text-amber-400 drop-shadow">
            神獸進度條 ＆ 雙語格言全量展示台
          </h1>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
          共 16 隻神獸 • 30 則格言
        </span>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左側：即時動態模擬主畫布 (Large Live Runner Screen) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div
            className="w-full rounded-3xl border-2 border-stone-800 p-6 sm:p-8 flex flex-col items-center justify-between min-h-[380px] shadow-2xl relative overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.8) 0%, rgba(2, 6, 23, 0.98) 100%)'
            }}
          >
            {/* 背景神山星芒粒子 */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />

            {/* 標題與當前神獸徽章 */}
            <div className="w-full flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{character.icon}</span>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-amber-300 text-base">{character.name}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-stone-800 text-amber-400 border border-amber-500/30">
                      {character.badge}
                    </span>
                  </div>
                  <span className="text-xs text-stone-400 font-bold">{character.title} • {character.speed}</span>
                </div>
              </div>

              <div className="text-right font-mono font-black text-amber-400 text-lg">
                {Math.floor(progress)}%
              </div>
            </div>

            {/* 跑道與即時奔馳動態 (0% -> 100%) */}
            <div className="w-full relative py-8 my-auto z-10">
              {/* 奔跑神獸 Sprite */}
              <div
                className="absolute -top-7 transition-all duration-75 ease-out flex flex-col items-center pointer-events-none"
                style={{
                  left: `calc(${progress}% - 32px)`,
                  filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.7))'
                }}
              >
                <div className="relative w-16 h-16 flex items-center justify-center animate-bounce">
                  <img
                    src={character.src}
                    alt={character.name}
                    className="w-14 h-14 object-contain filter drop-shadow-[0_2px_8px_rgba(251,191,36,0.6)]"
                  />
                  {/* 腳底金光塵土微粒特效 */}
                  <div className="absolute -bottom-1 -left-1 flex gap-0.5 opacity-90">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    <span className="w-1 h-1 rounded-full bg-amber-200 animate-pulse delay-75" />
                  </div>
                </div>

                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-stone-900/90 text-amber-300 border border-amber-500/30 whitespace-nowrap -mt-1 shadow-sm">
                  {character.name}
                </span>
              </div>

              {/* 神山石槽進度條跑道 */}
              <div className="w-full h-4 rounded-full bg-stone-900/95 border-2 border-stone-700/80 p-0.5 shadow-inner overflow-hidden relative">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${character.color} transition-all duration-75 ease-out relative shadow-[0_0_14px_rgba(245,158,11,0.6)]`}
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>

            {/* 底部神山雙語格言卡 */}
            <div className="w-full p-4 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-xl backdrop-blur-md relative overflow-hidden text-left z-10">
              <div className="absolute -right-3 -bottom-3 text-4xl opacity-10 select-none">
                🌸
              </div>

              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-500/90 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>神山每日格言 • Forest Wisdom #{quoteIdx + 1}</span>
                </span>
                <button
                  onClick={() => speakEnglish(quote.en)}
                  className="px-2 py-0.5 rounded-lg bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>發音</span>
                </button>
              </div>

              <p className="text-sm sm:text-base font-black text-amber-200 tracking-wide font-sans mb-1">
                "{quote.en}"
              </p>
              <p className="text-xs sm:text-sm font-bold text-stone-300">
                {quote.zh}
              </p>
            </div>
          </div>

          {/* 畫布控制台 (Play / Pause / Slider / Speed) */}
          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2">
              <Button3D
                variant={isLooping ? 'amber' : 'slate'}
                size="sm"
                onClick={() => setIsLooping(!isLooping)}
                icon={isLooping ? Pause : Play}
              >
                {isLooping ? '暫停' : '播放'}
              </Button3D>
              <Button3D
                variant="slate"
                size="sm"
                onClick={() => setProgress(0)}
                icon={RotateCcw}
              >
                重置 0%
              </Button3D>
            </div>

            {/* 手動滑桿 */}
            <div className="flex-1 min-w-[160px] flex items-center gap-2 px-2">
              <span className="text-xs text-stone-400 font-bold">進度</span>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => {
                  setIsLooping(false);
                  setProgress(Number(e.target.value));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-amber-400 w-8 text-right">
                {Math.floor(progress)}%
              </span>
            </div>

            {/* 速度切換 */}
            <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs font-bold">
              {[0.5, 1, 2].map(speed => (
                <button
                  key={speed}
                  onClick={() => setSpeedMultiplier(speed)}
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    speedMultiplier === speed
                      ? 'bg-amber-500 text-stone-950 font-black'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* 格言切換微型控制列 */}
          <div className="p-3 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="text-stone-400">更換格言:</span>
              <button
                onClick={() => setQuoteIdx(prev => (prev - 1 + FOREST_QUOTES.length) % FOREST_QUOTES.length)}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
              >
                ◀ 上一句
              </button>
              <button
                onClick={() => setQuoteIdx(prev => (prev + 1) % FOREST_QUOTES.length)}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
              >
                下一句 ▶
              </button>
              <button
                onClick={() => setQuoteIdx(Math.floor(Math.random() * FOREST_QUOTES.length))}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors flex items-center gap-1"
              >
                <Shuffle className="w-3 h-3" />
                <span>隨機抽取</span>
              </button>
            </div>

            <button
              onClick={() => setIsQuoteListOpen(!isQuoteListOpen)}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              {isQuoteListOpen ? '收起格言列表' : `展開全部 (${FOREST_QUOTES.length}則)`}
            </button>
          </div>

          {/* 展開之完整格言庫清單 */}
          {isQuoteListOpen && (
            <div className="max-h-60 overflow-y-auto p-3 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col gap-2 text-left animate-fadeIn">
              {FOREST_QUOTES.map((q, idx) => (
                <div
                  key={idx}
                  onClick={() => setQuoteIdx(idx)}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all border ${
                    quoteIdx === idx
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                      : 'bg-stone-950/60 border-stone-800/60 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <p className="text-xs font-black font-sans">{idx + 1}. "{q.en}"</p>
                  <p className="text-[11px] text-stone-400">{q.zh}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 右側：16 隻角色全覽與即時點選切換 (16 Characters Selector) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* 分類標籤切換 */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-900 border border-stone-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                activeTab === 'all' ? 'bg-amber-500 text-stone-950 font-black' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              全部 (16)
            </button>
            <button
              onClick={() => setActiveTab('core')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                activeTab === 'core' ? 'bg-amber-500 text-stone-950 font-black' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              常態神獸 (4)
            </button>
            <button
              onClick={() => setActiveTab('seasonal')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                activeTab === 'seasonal' ? 'bg-amber-500 text-stone-950 font-black' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              節慶限定 (12)
            </button>
          </div>

          {/* 角色清單卡片 */}
          <div className="max-h-[640px] overflow-y-auto flex flex-col gap-2 pr-1">
            {filteredChars.map((c) => {
              const originalIndex = ALL_CHARACTERS.findIndex(item => item.id === c.id);
              const isSelected = originalIndex === selectedIdx;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedIdx(originalIndex)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-left ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-amber-500 shadow-md scale-[1.02]'
                      : 'bg-stone-900/80 border-stone-800 hover:bg-stone-800/80 text-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* 角色 Sprite 縮圖 */}
                    <div className="w-12 h-12 rounded-xl bg-stone-950 border border-stone-800 p-1 flex items-center justify-center flex-shrink-0">
                      <img
                        src={c.src}
                        alt={c.name}
                        className="w-10 h-10 object-contain filter drop-shadow"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-black ${isSelected ? 'text-amber-300' : 'text-stone-100'}`}>
                          {c.name}
                        </span>
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-stone-800 text-stone-400">
                          {c.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 font-bold truncate max-w-[170px]">
                        {c.title}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs font-black px-2.5 py-1 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'bg-stone-800 text-stone-400'
                  }`}>
                    {isSelected ? '跑步中' : '選擇'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
