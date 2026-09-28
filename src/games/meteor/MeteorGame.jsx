import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useI18n } from '../../context/I18nContext';
import { soundEngine, speakEnglish } from '../../services/audio';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';
import { generateSmartOptions } from '../../services/distractorHelper';
import { MeteorCanvas3D } from './MeteorCanvas3D';
import confetti from 'canvas-confetti';
import {
  ArrowLeft, Rocket, Heart, Trophy, Flame,
  Shield, Zap, Sparkles, Target, Eye
} from 'lucide-react';

export const MeteorGame = ({
  settings,
  words = [],
  qualifyingBook,
  onBack
}) => {
  const { t } = useI18n();
  const [subMode, setSubMode] = useState('zh-en'); // 'zh-en' | 'en-zh' | 'abc'
  const [renderMode, setRenderMode] = useState('3d'); // '3d' | '2d' (可隨時一鍵切換)
  const [queue, setQueue] = useState([]);
  const [currentMeteor, setCurrentMeteor] = useState(null);
  const [options, setOptions] = useState([]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [survivalTime, setSurvivalTime] = useState(0);
  const [laserTrigger, setLaserTrigger] = useState(null);

  const containerRef = useRef(null);
  const meteorRef = useRef(null);
  const animFrameRef = useRef(null);
  const encounteredWordsRef = useRef(new Map());
  const mistakeIdsRef = useRef(new Set());

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

    const opts = generateSmartOptions(
      targetWord,
      selectedPool,
      fullPool,
      ansKey,
      settings?.distractorMode || 'strict'
    );
    setOptions(opts);
  };

  const spawnMeteor = (wordObj) => {
    if (wordObj && wordObj.id) {
      encounteredWordsRef.current.set(wordObj.id, { id: wordObj.id, en: wordObj.en, zh: wordObj.zh });
    }
    // 隕石落下總時長隨擊落數遞減 (難度平滑提升)
    const duration = Math.max(2.8, (5.4 - score * 0.1) * 1.5);
    const xPos = 18 + Math.random() * 64;

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
    setCombo(0);
    setMaxCombo(0);
    setGameStartTime(Date.now());
    encounteredWordsRef.current.clear();
    mistakeIdsRef.current.clear();

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

  // 2D 備援模式下的兩段式落下動畫
  useEffect(() => {
    if (!hasStarted || isFinished || !currentMeteor || isExploding || renderMode !== '2d') return;

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
  }, [currentMeteor, hasStarted, isFinished, isExploding, renderMode]);

  // 3D 模式下的下墜逾時檢查
  useEffect(() => {
    if (!hasStarted || isFinished || !currentMeteor || isExploding || renderMode !== '3d') return;

    const timeoutSec = currentMeteor.duration * 1000;
    const timer = setTimeout(() => {
      handleMiss();
    }, timeoutSec);

    return () => clearTimeout(timer);
  }, [currentMeteor, hasStarted, isFinished, isExploding, renderMode]);

  const handleMiss = () => {
    soundEngine.wrong();
    setIsExploding(true);
    setCombo(0);
    if (currentMeteor?.word?.id) {
      mistakeIdsRef.current.add(currentMeteor.word.id);
    }

    setLives(prev => {
      const next = prev - 1;
      if (next <= 0) {
        setSurvivalTime(Math.floor((Date.now() - gameStartTime) / 1000));
        setTimeout(() => setIsFinished(true), 900);
      } else {
        setTimeout(() => nextTurn(), 900);
      }
      return next;
    });
  };

  const handleOptionClick = (opt) => {
    if (!currentMeteor || isExploding) return;
    soundEngine.laser();

    // 觸發 3D 雷射防衛光束
    setLaserTrigger({ isCorrect: opt.isCorrect, timestamp: Date.now() });

    if (opt.isCorrect) {
      soundEngine.explosion();
      setScore(s => s + 1);
      setCombo(c => {
        const nextC = c + 1;
        setMaxCombo(m => Math.max(m, nextC));
        if (nextC >= 2) soundEngine.combo(nextC);
        return nextC;
      });
      setIsExploding(true);

      // 2D 備援模式下的碎屑紙花
      if (renderMode === '2d' && meteorRef.current) {
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

      setTimeout(() => nextTurn(), renderMode === '3d' ? 650 : 600);
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

  // 模式選擇前導頁
  if (!hasStarted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full text-center p-8">
          <div className="w-20 h-20 rounded-3xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 animate-float-slow">
            <Rocket className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1 font-heading">
            {t.meteorTitle} 3D
          </h2>
          <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mb-2">
            ● 地球守衛戰：攔截星際隕石群
          </p>
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

  // 結算畫面
  if (isFinished) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 animate-fadeIn">
        <GlassCard className="max-w-md w-full text-center p-8">
          <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-3 animate-bounce" />
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 font-heading mb-1">
            {t.defenseOver}
          </h2>
          <p className="text-xs font-bold text-slate-500 mb-4">
            {t.survivalTime}<span className="text-indigo-600 font-black text-lg">{survivalTime} 秒</span>
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {score}
              </span>
              <p className="text-[11px] font-bold text-slate-500 mt-1">{t.meteorsDestroyed}</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
                {maxCombo}x
              </span>
              <p className="text-[11px] font-bold text-slate-500 mt-1">最高連續連擊</p>
            </div>
          </div>

          {/* 榮譽榜破紀錄留名判定卡與獎狀領取 */}
          <HonorSubmissionCard
            mode={`meteor-${subMode}`}
            book={qualifyingBook}
            score={score}
            time={survivalTime}
            totalCount={Math.max(score + (3 - lives), encounteredWordsRef.current.size, 1)}
            rangeText={qualifyingBook ? `第 ${qualifyingBook} 冊` : (subMode === 'abc' ? '英文字母 ABC' : settings.selectedUnits.slice(0, 3).join(', '))}
            reviewWords={Array.from(encounteredWordsRef.current.values()).map(w => ({
              ...w,
              isMistake: mistakeIdsRef.current.has(w.id)
            }))}
          />

          <Button3D variant="slate" size="lg" onClick={onBack} className="w-full">
            {t.backLobby}
          </Button3D>
        </GlassCard>
      </div>
    );
  }

  // 遊戲進行主畫面
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2 flex flex-col items-center animate-fadeIn">
      {/* ── 頂部科幻戰術資訊列 ── */}
      <div className="w-full flex items-center justify-between mb-3 flex-wrap gap-2">
        <Button3D variant="slate" size="sm" onClick={onBack} icon={ArrowLeft}>
          {t.backLobby}
        </Button3D>

        {/* 護盾防護生命 (Shield Life) */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 shadow-inner">
          <Shield className="w-4 h-4 text-cyan-400" />
          <div className="flex items-center gap-1.5">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className={`w-6 h-3 rounded-full transition-all duration-300 ${
                  i < lives
                    ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_10px_rgba(56,189,248,0.7)]'
                    : 'bg-slate-700 opacity-40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 連擊與得分 */}
        <div className="flex items-center gap-2">
          {combo >= 2 && (
            <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs shadow-md animate-bounce">
              COMBO {combo}x 🔥
            </div>
          )}
          <div className="px-4 py-1.5 rounded-2xl bg-cyan-600 text-white font-black text-sm shadow-md font-mono flex items-center gap-1.5">
            <Target className="w-4 h-4 text-cyan-200" />
            <span>{score}</span>
          </div>

          {/* 2D / 3D 切換開關 (保障學習彈性) */}
          <button
            onClick={() => setRenderMode(m => m === '3d' ? '2d' : '3d')}
            className="p-1.5 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-black flex items-center gap-1 transition-all"
            title="點擊切換 3D 沉浸視覺 或 2D 簡約模式"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>{renderMode === '3d' ? '3D模式' : '2D簡約'}</span>
          </button>
        </div>
      </div>

      {/* ── 目標單字科幻 HUD 鎖定儀 ── */}
      {currentMeteor && (
        <div className="mb-2 w-full max-w-md mx-auto flex items-center justify-center gap-2 px-4 py-1.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 shadow-sm text-cyan-300 text-xs font-black">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>鎖定目標：</span>
          <span className="text-white text-sm font-black tracking-wide">
            {subMode === 'zh-en' ? currentMeteor.word.zh : currentMeteor.word.en}
          </span>
        </div>
      )}

      {/* ── 隕石戰場區域 (3D 或 2D 渲染) ── */}
      {renderMode === '3d' ? (
        <div className="w-full mb-4">
          <MeteorCanvas3D
            currentMeteor={currentMeteor}
            subMode={subMode}
            isExploding={isExploding}
            laserTrigger={laserTrigger}
          />
        </div>
      ) : (
        /* 2D 簡約備援畫布 */
        <div
          ref={containerRef}
          className="w-full h-[360px] sm:h-[460px] rounded-3xl bg-slate-900 border-2 border-indigo-500/40 relative overflow-hidden shadow-2xl mb-4"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 30%, #1e1b4b 0%, #090d16 80%)'
          }}
        >
          <div className="absolute top-12 left-10 w-2 h-2 rounded-full bg-blue-300/40 animate-twinkle-slow" />
          <div className="absolute top-28 right-20 w-3 h-3 rounded-full bg-cyan-200/50 animate-twinkle-slow" />

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

          <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-indigo-500/30 to-transparent border-t border-indigo-400/40" />
        </div>
      )}

      {/* ── 下方 4 個全息能量戰術選項按鈕 ── */}
      <div className="w-full grid grid-cols-2 gap-3 sm:gap-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleOptionClick(opt)}
            className="group relative p-4 sm:p-5 rounded-2xl font-black text-lg sm:text-xl transition-all duration-150 active:scale-95 text-center cursor-pointer select-none overflow-hidden bg-slate-900/90 text-cyan-100 hover:text-white border-2 border-cyan-500/50 hover:border-cyan-400 shadow-[0_4px_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
          >
            {/* 全息掃描光暈線 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            
            <div className="relative z-10 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all" />
              <span className="font-heading tracking-wide drop-shadow-md">
                {opt.text}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
