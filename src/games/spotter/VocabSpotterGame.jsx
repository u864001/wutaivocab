import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { SpotterScene } from './SpotterScene';
import { SpotterWordBank } from './SpotterWordBank';
import { SPOTTER_SCENES, DIFFERENCE_CATEGORIES, generateSpotterRound } from './spotterData';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';
import { soundEngine } from '../../services/audio';
import confetti from 'canvas-confetti';
import {
  ArrowLeft, Heart, Timer, Trophy, Sparkles, RefreshCw,
  CheckCircle2, AlertTriangle, ShieldAlert
} from 'lucide-react';

export const VocabSpotterGame = ({
  settings,
  words = [],
  qualifyingBook,
  onBack
}) => {
  const currentScene = SPOTTER_SCENES[0];

  // 每一局動態隨機抽取 5 個目標單字並指定樣態
  const [roundSeed, setRoundSeed] = useState(() => Date.now());
  const roundData = useMemo(() => generateSpotterRound(5), [roundSeed]);

  const { activeDifferences, itemStateMap, wordBankOptions, totalCount } = roundData;

  // 遊戲核心狀態
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'failed' | 'victory'
  const [lives, setLives] = useState(5); // 5 顆愛心
  const [spotlightDiffId, setSpotlightDiffId] = useState(null); // 當前聚光燈鎖定之相異點 ID
  const [solvedDiffIds, setSolvedDiffIds] = useState(() => new Set());
  const [shakeScene, setShakeScene] = useState(false);
  const [missFeedback, setMissFeedback] = useState(null);
  const [matchSuccessFeedback, setMatchSuccessFeedback] = useState(null);
  const [missRipples, setMissRipples] = useState([]);

  // 計時器 (毫秒精度，過關時結算)
  const [elapsedMs, setElapsedMs] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  // 計時器運作
  useEffect(() => {
    if (gameState === 'playing') {
      startTimeRef.current = Date.now() - elapsedMs;
      timerRef.current = setInterval(() => {
        setElapsedMs(Date.now() - startTimeRef.current);
      }, 50);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // 重置/開啟全新題目挑戰
  const handleRestart = () => {
    setRoundSeed(Date.now()); // 換一組全新的隨機 5 個題目與樣態
    setGameState('playing');
    setLives(5);
    setSpotlightDiffId(null);
    setSolvedDiffIds(new Set());
    setElapsedMs(0);
    setMissFeedback(null);
    setMatchSuccessFeedback(null);
    setMissRipples([]);
    startTimeRef.current = Date.now();
  };

  // 扣心與檢查失敗
  const deductLife = (reasonText) => {
    setLives(prev => {
      const nextLives = Math.max(0, prev - 1);
      if (nextLives === 0) {
        setGameState('failed');
        soundEngine.wrong();
      }
      return nextLives;
    });

    // 震動畫面
    setShakeScene(true);
    setTimeout(() => setShakeScene(false), 500);

    // 提示反饋
    setMissFeedback(reasonText);
    setTimeout(() => setMissFeedback(null), 2500);
  };

  // 點擊命中相異目標
  const handleDifferenceClicked = (diffId, clickPos) => {
    if (spotlightDiffId) return; // 聚光燈鎖定中不重複觸發

    soundEngine.correct();
    setSpotlightDiffId(diffId);
    setMissFeedback(null);
  };

  // 點擊非相異之處 (點錯)
  const handleMissClicked = (clickPos) => {
    if (spotlightDiffId) return;

    soundEngine.wrong();
    const rippleId = Date.now() + Math.random();
    setMissRipples(prev => [...prev, { id: rippleId, x: clickPos.x, y: clickPos.y }]);
    setTimeout(() => {
      setMissRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 800);

    deductLife('❌ 這裡兩邊完全一樣喔！請再仔細觀察其他角落～');
  };

  // 單字庫點選成功
  const handleWordMatchSuccess = (diffId) => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}

    const newSolved = new Set(solvedDiffIds);
    newSolved.add(diffId);
    setSolvedDiffIds(newSolved);
    setSpotlightDiffId(null);

    const targetDiff = activeDifferences.find(d => d.id === diffId);
    if (targetDiff) {
      setMatchSuccessFeedback({
        word: targetDiff.word,
        wordZh: targetDiff.wordZh,
        solvedCount: newSolved.size,
        total: totalCount
      });
      setTimeout(() => setMatchSuccessFeedback(null), 2500);
    }

    // 檢查是否全破通關 (本局 5 個相異點全部尋獲)
    if (newSolved.size >= totalCount) {
      setGameState('victory');
      soundEngine.win();
      setTimeout(() => {
        try {
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.5 }
          });
        } catch (e) {}
      }, 300);
    }
  };

  // 單字庫點選失敗
  const handleWordMatchFail = (word) => {
    deductLife(`❌ 「${word}」不是聚光燈照出的物品喔！請再看一眼聚光燈！`);
  };

  // 格式化計時時間 (分:秒.毫秒)
  const formattedTime = useMemo(() => {
    const totalSec = elapsedMs / 1000;
    const mins = Math.floor(totalSec / 60);
    const secs = (totalSec % 60).toFixed(1);
    return `${String(mins).padStart(2, '0')}:${secs.padStart(4, '0')}`;
  }, [elapsedMs]);

  const activeSpotlightDiff = activeDifferences.find(d => d.id === spotlightDiffId);

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4 space-y-4 animate-fadeIn pb-16 select-none">
      {/* ── 頂部抬頭控制列 ── */}
      <GlassCard className="p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 border-2 border-amber-300 dark:border-amber-700/60 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-amber-500/10">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button3D variant="slate" size="sm" onClick={onBack} icon={ArrowLeft}>
            {typeof window !== 'undefined' && window.innerWidth < 640 ? '' : '回大廳'}
          </Button3D>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🦅</span>
              <h2 className="text-base sm:text-lg font-black text-slate-800 dark:text-white font-heading">
                鷹眼神探 • 單字找不同
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black">
                隨機 5 處相異題
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
              {currentScene.titleZh} • 20大單字隨機組合 • 找出本局 5 處相異處！
            </p>
          </div>
        </div>

        {/* 狀態指示：愛心、進度條與計時器 */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {/* 愛心條 (5 Lives) */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-300 dark:border-rose-800">
            {[...Array(5)].map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                  i < lives
                    ? 'text-rose-500 fill-rose-500 scale-100'
                    : 'text-slate-300 dark:text-slate-600 scale-90'
                }`}
              />
            ))}
          </div>

          {/* 破案進度 (0/5) */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-black">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>進度：{solvedDiffIds.size} / {totalCount}</span>
          </div>

          {/* 計時器 */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black font-mono">
            <Timer className="w-4 h-4 text-amber-500" />
            <span>{formattedTime}</span>
          </div>
        </div>
      </GlassCard>

      {/* ── 6 大差異類型標籤導引欄 ── */}
      <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 overflow-x-auto scrollbar-none text-xs font-bold text-slate-600 dark:text-slate-300">
        <span className="font-black text-amber-600 dark:text-amber-400 pl-1 shrink-0">
          🔍 6大相異類型：
        </span>
        {DIFFERENCE_CATEGORIES.map(cat => (
          <span
            key={cat.id}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-600 text-[11px] shrink-0 font-black"
          >
            <span>{cat.icon}</span>
            <span>{cat.labelZh}</span>
          </span>
        ))}
      </div>

      {/* ── 答對成功激勵橫幅 ── */}
      {matchSuccessFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border-2 border-emerald-400 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-black flex items-center justify-between gap-2 animate-bounce shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>🎉 太強了！成功尋獲相異物品：<strong className="font-heading uppercase underline decoration-2">{matchSuccessFeedback.word}</strong>（{matchSuccessFeedback.wordZh}）！</span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-black shrink-0">
            已尋獲 {matchSuccessFeedback.solvedCount} / {matchSuccessFeedback.total}
          </span>
        </div>
      )}

      {/* ── 點錯警示提示橫幅 ── */}
      {missFeedback && (
        <div className="p-3 rounded-2xl bg-rose-500/15 border-2 border-rose-400 text-rose-700 dark:text-rose-200 text-xs sm:text-sm font-black flex items-center gap-2 animate-bounce">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{missFeedback}</span>
        </div>
      )}

      {/* ── 雙圖畫卷核心區域 (左圖與右圖對照) ── */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 transition-transform ${shakeScene ? 'animate-headShake' : ''}`}>
        {/* 左圖 */}
        <SpotterScene
          itemStateMap={itemStateMap}
          activeDifferences={activeDifferences}
          isLeft={true}
          spotlightDiffId={spotlightDiffId}
          solvedDiffIds={solvedDiffIds}
          onDifferenceClicked={handleDifferenceClicked}
          onMissClicked={handleMissClicked}
          missRipples={missRipples}
        />

        {/* 右圖 */}
        <SpotterScene
          itemStateMap={itemStateMap}
          activeDifferences={activeDifferences}
          isLeft={false}
          spotlightDiffId={spotlightDiffId}
          solvedDiffIds={solvedDiffIds}
          onDifferenceClicked={handleDifferenceClicked}
          onMissClicked={handleMissClicked}
          missRipples={missRipples}
        />
      </div>

      {/* ── 下方單字庫 (Word Bank) ── */}
      <SpotterWordBank
        spotlightDiff={activeSpotlightDiff}
        wordOptions={wordBankOptions}
        activeDifferences={activeDifferences}
        solvedDiffIds={solvedDiffIds}
        onWordMatchSuccess={handleWordMatchSuccess}
        onWordMatchFail={handleWordMatchFail}
      />

      {/* ── 彈窗 1：通關大捷勝利結算 (Victory) ── */}
      {gameState === 'victory' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <GlassCard className="max-w-md w-full p-6 sm:p-8 text-center relative overflow-hidden border-2 border-amber-400 shadow-2xl max-h-[92dvh] overflow-y-auto">
            <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-amber-400 mx-auto mb-2 animate-bounce" />

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-black mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>鷹眼破案 • 5 大相異處全數尋獲</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black font-heading text-slate-800 dark:text-white mb-1">
              🎉 鷹眼破案成功！
            </h2>
            <p className="text-xs font-bold text-slate-400 mb-4">
              過關耗時 <span className="text-amber-400 font-black text-base">{formattedTime}</span> • 剩餘愛心 <span className="text-rose-500 font-black text-base">❤️ x {lives}</span>
            </p>

            {/* 提報 Top 50 榮譽榜 */}
            <div className="mb-5 text-left">
              <HonorSubmissionCard
                mode="spotter"
                book={qualifyingBook || '3'}
                score={lives}
                time={Math.round(elapsedMs / 1000)}
                totalCount={totalCount}
                rangeText="第 3 冊 - 鷹眼神探單字找不同"
                reviewWords={activeDifferences.map(d => ({
                  id: d.id,
                  en: d.word,
                  zh: d.wordZh,
                  isMistake: false
                }))}
              />
            </div>

            <div className="space-y-2.5">
              <Button3D
                variant="amber"
                size="md"
                onClick={handleRestart}
                icon={RefreshCw}
                className="w-full"
              >
                換一組隨機題目挑戰 🎲
              </Button3D>

              <Button3D
                variant="slate"
                size="md"
                onClick={onBack}
                icon={ArrowLeft}
                className="w-full"
              >
                返回大廳
              </Button3D>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ── 彈窗 2：挑戰失敗 (Failed) ── */}
      {gameState === 'failed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <GlassCard className="max-w-md w-full p-6 sm:p-8 text-center relative overflow-hidden border-2 border-rose-500 shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-3 text-3xl">
              💔
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-black mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>愛心已耗盡</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-800 dark:text-white mb-2">
              挑戰失敗 (Failed)
            </h2>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              本次探查已破解 <strong className="text-amber-500">{solvedDiffIds.size} / {totalCount}</strong> 處差異。<br />
              深呼吸一口氣，聚精會神，再來一次定能通關！
            </p>

            <div className="space-y-2.5">
              <Button3D
                variant="rose"
                size="md"
                onClick={handleRestart}
                icon={RefreshCw}
                className="w-full"
              >
                重新挑戰 ❤️
              </Button3D>

              <Button3D
                variant="slate"
                size="md"
                onClick={onBack}
                icon={ArrowLeft}
                className="w-full"
              >
                返回單字學習館
              </Button3D>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
