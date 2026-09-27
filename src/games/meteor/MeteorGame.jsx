import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useI18n } from '../../context/I18nContext';
import { soundEngine, speakEnglish } from '../../services/audio';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';
import { generateSmartOptions } from '../../services/distractorHelper';
import confetti from 'canvas-confetti';
import { ArrowLeft, Rocket, Heart, Trophy, Flame } from 'lucide-react';

export const MeteorGame = ({
  settings,
  words = [],
  qualifyingBook,
  onBack
}) => {
  const { t } = useI18n();
  const [subMode, setSubMode] = useState('zh-en'); // 'zh-en' | 'en-zh' | 'abc'
  const [queue, setQueue] = useState([]);
  const [currentMeteor, setCurrentMeteor] = useState(null);
  const [options, setOptions] = useState([]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [survivalTime, setSurvivalTime] = useState(0);

  const containerRef = useRef(null);
  const meteorRef = useRef(null);
  const animFrameRef = useRef(null);

  // 取得當前模式的「選取範圍單字庫」
  const getSelectedPool = () => {
    if (subMode === 'abc') {
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((l, i) => ({
        id: `abc-${i}`,
        book: 'ABC',
        lesson: '1',
        en: l,
        zh: l.toLowerCase()
      }));
    }
    const filtered = words.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
    return filtered;
  };

  useEffect(() => {
    const pool = getSelectedPool();
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setQueue(shuffled);
  }, [settings, words, subMode]);

  const updateOptionsFor = (targetWord) => {
    const ansKey = subMode === 'en-zh' ? 'zh' : (subMode === 'abc' ? 'zh' : 'en');
    const selectedPool = getSelectedPool();
    const fullPool = subMode === 'abc' ? selectedPool : words;

    const opts = generateSmartOptions(targetWord, selectedPool, fullPool, ansKey);
    setOptions(opts);
  };

  const spawnMeteor = (wordObj) => {
    // 隕石落下總時長隨擊落數遞減 (難度平滑提升)
    const duration = Math.max(2.6, (5.2 - score * 0.12) * 1.5);
    const xPos = 15 + Math.random() * 70;

    setCurrentMeteor({
      word: wordObj,
      x: xPos,
      duration,
      startTime: performance.now()
    });

    setIsExploding(false);
    if (subMode !== 'zh-en' && subMode !== 'abc') {
      speakEnglish(wordObj.en);
    }
  };

  const handleStart = (mode) => {
    setSubMode(mode);
    setHasStarted(true);
    setLives(3);
    setScore(0);
    setGameStartTime(Date.now());

    let pool = [];
    if (mode === 'abc') {
      pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((l, i) => ({
        id: `abc-${i}`,
        book: 'ABC',
        lesson: '1',
        en: l,
        zh: l.toLowerCase()
      }));
    } else {
      pool = words.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
    }

    if (pool.length === 0) {
      alert('請先在主畫面勾選複習範圍！');
      return onBack();
    }

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setQueue(shuffled);
    const first = shuffled[0];
    updateOptionsFor(first);
    spawnMeteor(first);
  };

  // 兩段式落下動畫
  useEffect(() => {
    if (!hasStarted || isFinished || !currentMeteor || isExploding) return;

    const tick = (now) => {
      const elapsed = (now - currentMeteor.startTime) / 1000;
      const progress = Math.min(elapsed / currentMeteor.duration, 1);

      // 前 62.5% 等速落下 (-10% -> 30%)，後 37.5% 加速 (30% -> 90%)
      const ph1Dur = currentMeteor.duration * 0.625;
      const ph2Dur = currentMeteor.duration - ph1Dur;
      let y = 0;

      if (elapsed <= ph1Dur) {
        y = -10 + (elapsed / ph1Dur) * 40;
      } else {
        const p2 = Math.min((elapsed - ph1Dur) / ph2Dur, 1);
        const ease = 0.6 * p2 * p2 + 0.4 * p2;
        y = 30 + ease * 60;
      }

      if (meteorRef.current) {
        meteorRef.current.style.top = `${y}%`;
      }

      if (progress >= 1) {
        handleMiss();
      } else {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [currentMeteor, hasStarted, isFinished, isExploding]);

  const handleMiss = () => {
    soundEngine.wrong();
    setIsExploding(true);

    setLives(prev => {
      const next = prev - 1;
      if (next <= 0) {
        setSurvivalTime(Math.floor((Date.now() - gameStartTime) / 1000));
        setTimeout(() => setIsFinished(true), 800);
      } else {
        setTimeout(() => nextTurn(), 900);
      }
      return next;
    });
  };

  const handleOptionClick = (opt) => {
    if (!currentMeteor || isExploding) return;
    soundEngine.laser();

    if (opt.isCorrect) {
      soundEngine.explosion();
      setScore(s => s + 1);
      setIsExploding(true);

      if (meteorRef.current) {
        const rect = meteorRef.current.getBoundingClientRect();
        confetti({
          particleCount: 35,
          spread: 60,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight
          },
          colors: ['#f87171', '#fbbf24', '#facc15']
        });
      }

      setTimeout(() => nextTurn(), 600);
    } else {
      handleMiss();
    }
  };

  const nextTurn = () => {
    const newQueue = [...queue];
    newQueue.shift();

    // 隊列耗盡時，只從「選取範圍」重新洗牌，絕不洩漏到未選單字！
    if (newQueue.length === 0) {
      newQueue.push(...getSelectedPool().sort(() => 0.5 - Math.random()));
    }

    setQueue(newQueue);
    const nextWord = newQueue[0];
    updateOptionsFor(nextWord);
    spawnMeteor(nextWord);
  };

  if (!hasStarted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full text-center p-8">
          <div className="w-20 h-20 rounded-3xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 animate-float-slow">
            <Rocket className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2 font-heading">
            {t.meteorTitle}
          </h2>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-6">
            {t.selectDefenseMode}
          </p>

          <div className="space-y-3">
            <Button3D variant="blue" size="lg" onClick={() => handleStart('zh-en')} className="w-full">
              {t.meteorZhEn}
            </Button3D>
            <Button3D variant="emerald" size="lg" onClick={() => handleStart('en-zh')} className="w-full">
              {t.meteorEnZh}
            </Button3D>
            <Button3D variant="amber" size="lg" onClick={() => handleStart('abc')} className="w-full">
              {t.meteorAbc}
            </Button3D>
            <Button3D variant="slate" size="md" onClick={onBack} className="w-full mt-2">
              {t.backLobby}
            </Button3D>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 animate-fadeIn">
        <GlassCard className="max-w-md w-full text-center p-8">
          <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-3 animate-bounce" />
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 font-heading mb-1">
            {t.defenseOver}
          </h2>
          <p className="text-xs font-bold text-slate-500 mb-6">
            {t.survivalTime}<span className="text-indigo-600 font-black text-lg">{survivalTime} 秒</span>
          </p>

          <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 mb-6">
            <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
              {score}
            </span>
            <p className="text-xs font-bold text-slate-500 mt-1">{t.meteorsDestroyed}</p>
          </div>

          {/* 榮譽榜破紀錄留名判定卡 */}
          <HonorSubmissionCard
            mode={`meteor-${subMode}`}
            book={qualifyingBook}
            score={score}
            time={survivalTime}
          />

          <Button3D variant="slate" size="lg" onClick={onBack} className="w-full">
            {t.backLobby}
          </Button3D>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2 flex flex-col items-center">
      {/* 頂部資訊列 */}
      <div className="w-full flex items-center justify-between mb-3">
        <Button3D variant="slate" size="sm" onClick={onBack} icon={ArrowLeft}>
          {t.backLobby}
        </Button3D>

        <div className="flex items-center gap-1.5">
          {[...Array(3)].map((_, i) => (
            <Heart
              key={i}
              className={`w-6 h-6 transition-all ${
                i < lives ? 'text-rose-500 fill-rose-500 animate-pulse' : 'text-slate-300 dark:text-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="px-4 py-1.5 rounded-2xl bg-indigo-500 text-white font-black text-sm shadow-md">
          得分: {score}
        </div>
      </div>

      {/* 隕石墜落遊戲畫布區域 */}
      <div
        ref={containerRef}
        className="w-full h-[380px] sm:h-[460px] rounded-3xl bg-slate-900 border-2 border-indigo-500/40 relative overflow-hidden shadow-2xl mb-4"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 30%, #1e1b4b 0%, #090d16 80%)'
        }}
      >
        {/* 背景裝飾小行星 */}
        <div className="absolute top-12 left-10 w-2 h-2 rounded-full bg-blue-300/40 animate-twinkle-slow" />
        <div className="absolute top-28 right-20 w-3 h-3 rounded-full bg-cyan-200/50 animate-twinkle-slow" />

        {/* 墜落中的隕石 */}
        {currentMeteor && (
          <div
            ref={meteorRef}
            className="absolute -translate-x-1/2 flex flex-col items-center z-10 transition-all pointer-events-none"
            style={{ left: `${currentMeteor.x}%`, top: '-10%' }}
          >
            {isExploding ? (
              <div className="text-5xl animate-bounce">💥</div>
            ) : (
              <div className="flex flex-col items-center">
                <Flame className="w-8 h-8 text-amber-500 -mb-2 animate-pulse" />
                <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-b from-amber-400 to-rose-600 text-white font-black text-lg sm:text-2xl shadow-xl border-2 border-yellow-200">
                  {subMode === 'zh-en' ? currentMeteor.word.zh : currentMeteor.word.en}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 地表防禦線 */}
        <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-indigo-500/30 to-transparent border-t border-indigo-400/40" />
      </div>

      {/* 下方 4 個雷射選項按鈕 */}
      <div className="w-full grid grid-cols-2 gap-3 sm:gap-4">
        {options.map((opt) => (
          <Button3D
            key={opt.id}
            variant="blue"
            size="lg"
            onClick={() => handleOptionClick(opt)}
            className="py-4 sm:py-5 text-lg sm:text-xl"
          >
            {opt.text}
          </Button3D>
        ))}
      </div>
    </div>
  );
};
