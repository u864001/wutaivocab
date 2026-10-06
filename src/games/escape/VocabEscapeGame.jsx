import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useI18n } from '../../context/I18nContext';
import { useStudent } from '../../context/StudentContext';
import { enterFullscreen, exitFullscreen } from '../../services/fullscreen';
import { soundEngine, speakEnglish } from '../../services/audio';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';
import { generateEscapeRoomSession, CHAMBER_THEMES } from './escapeData';
import { ChamberScene } from './ChamberScene';
import { ListeningPuzzle } from './puzzles/ListeningPuzzle';
import { MeaningPuzzle } from './puzzles/MeaningPuzzle';
import { SpellingPuzzle } from './puzzles/SpellingPuzzle';
import { PairingPuzzle } from './puzzles/PairingPuzzle';
import confetti from 'canvas-confetti';
import {
  ArrowLeft, Trophy, RotateCcw, Sparkles, Key, CheckCircle2,
  X, ShieldAlert, Volume2, Heart, Award, Compass, BookOpen, Clock
} from 'lucide-react';

export const VocabEscapeGame = ({
  words = [],
  settings = {},
  qualifyingBook: lobbyQualifyingBook,
  onBack
}) => {
  const { lang, t } = useI18n();
  const { currentStudent, addQuestPoints } = useStudent();

  // 遊戲狀態機: 'briefing' | 'playing' | 'victory'
  const [gameState, setGameState] = useState('briefing');
  const [sessionData, setSessionData] = useState(null);
  const [activePuzzleId, setActivePuzzleId] = useState(null);
  const [solvedPuzzleIds, setSolvedPuzzleIds] = useState(new Set());
  const [lives, setLives] = useState(3);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [hintCount, setHintCount] = useState(2);
  const [eliminatedOptions, setEliminatedOptions] = useState({}); // { [puzzleId]: optionId }
  const [selectedThemeId, setSelectedThemeId] = useState(null);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const hasAddedQuestPointsRef = useRef(false);

  // 初始化密室場景會話 (程序化主題與謎題生成)
  const initSession = useCallback((themeId = null) => {
    const studentGrade = currentStudent?.grade || '03';
    const session = generateEscapeRoomSession(words, {
      grade: studentGrade,
      themeId: themeId || selectedThemeId,
      selectedUnits: settings.selectedUnits || []
    });

    setSessionData(session);
    setSolvedPuzzleIds(new Set());
    setActivePuzzleId(null);
    setLives(3);
    setTimeElapsed(0);
    setHintCount(2);
    setEliminatedOptions({});
    hasAddedQuestPointsRef.current = false;
  }, [words, currentStudent, selectedThemeId, settings.selectedUnits]);

  // 初次載入
  useEffect(() => {
    initSession();
  }, [initSession]);

  // 卸載時還原全螢幕與清除計時器
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      exitFullscreen();
    };
  }, []);

  // 開始挑戰進入密室
  const handleStartEscape = () => {
    soundEngine.init();
    soundEngine.click();
    enterFullscreen();

    setGameState('playing');
    startTimeRef.current = Date.now();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  };

  // 退出密室
  const handleQuitGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    exitFullscreen();
    onBack();
  };

  // 玩家點擊解開機關
  const handleSolvePuzzle = (puzzleId, result) => {
    const nextSolved = new Set(solvedPuzzleIds);
    nextSolved.add(puzzleId);
    setSolvedPuzzleIds(nextSolved);
    setActivePuzzleId(null); // 關閉機關彈窗，回全景密室

    // 檢查是否四大機關全部解鎖
    if (sessionData && nextSolved.size === sessionData.puzzles.length) {
      handleVictory();
    }
  };

  // 玩家答錯扣除生命值
  const handleMistake = (puzzleId, detail) => {
    setLives(prev => {
      const nextLives = Math.max(0, prev - 1);
      if (nextLives === 0) {
        // 生命值耗盡時：給予短暫震動警報，自動補充 1 點生命值以防國小學童卡死，保護挫折感
        setTimeout(() => {
          setLives(1);
        }, 1500);
      }
      return nextLives;
    });
  };

  // 鷹眼透鏡提示 (排除 1 個錯誤選項)
  const handleUseHint = () => {
    if (hintCount <= 0 || !activePuzzleId) return;
    const currentPuzzle = sessionData?.puzzles?.find(p => p.id === activePuzzleId);
    if (!currentPuzzle) return;

    soundEngine.click();

    if (currentPuzzle.type === 'listening' || currentPuzzle.type === 'meaning') {
      const wrongOptions = currentPuzzle.options.filter(o => o.id !== currentPuzzle.targetWord.id);
      if (wrongOptions.length > 0) {
        const toEliminate = wrongOptions[0];
        setEliminatedOptions(prev => ({
          ...prev,
          [activePuzzleId]: toEliminate.id
        }));
        setHintCount(prev => Math.max(0, prev - 1));
      }
    } else if (currentPuzzle.type === 'spelling') {
      // 拼字提示：直接朗讀單字
      speakEnglish(currentPuzzle.targetWord.en);
      setHintCount(prev => Math.max(0, prev - 1));
    }
  };

  // 通關勝利結算
  const handleVictory = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    soundEngine.win();
    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    } catch (e) {}

    // 發放探索積分 +5
    if (addQuestPoints && !hasAddedQuestPointsRef.current) {
      hasAddedQuestPointsRef.current = true;
      addQuestPoints(5);
    }

    setGameState('victory');
  };

  // 重新開局新密室
  const handlePlayAgain = () => {
    soundEngine.click();
    initSession();
    setGameState('briefing');
  };

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const { theme, puzzles, qualifyingBook, wordsInvolved } = sessionData;
  const activePuzzle = puzzles.find(p => p.id === activePuzzleId);

  // ── 畫面 1：行前簡報與主題選擇 (Briefing Screen) ──
  if (gameState === 'briefing') {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 animate-fadeIn">
        <GlassCard className="max-w-2xl w-full p-6 sm:p-8 text-center relative overflow-hidden border-2 border-amber-400/60 shadow-2xl">
          {/* 背景光暈 */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* 頂部圖章 */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-emerald-500 text-white flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/30 text-3xl">
            {theme.runeIcon}
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-black mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>霧臺神祕密室逃脫 • {theme.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-800 dark:text-slate-100 mb-2">
            {theme.nameZh}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 mb-6 max-w-lg mx-auto">
            {theme.descZh}
          </p>

          {/* 三大密室主題快速切換器 (iPad 點擊即切換) */}
          <div className="mb-6">
            <p className="text-xs font-black text-slate-400 dark:text-slate-500 mb-2.5">
              選擇探索密室主題：
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto">
              {CHAMBER_THEMES.map((t) => {
                const isSelected = t.id === theme.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      soundEngine.click();
                      setSelectedThemeId(t.id);
                      initSession(t.id);
                    }}
                    className={`p-2.5 sm:p-3 rounded-2xl border-2 font-black text-xs sm:text-sm flex flex-col items-center gap-1 transition-all active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-400 shadow-md scale-105'
                        : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-amber-300'
                    }`}
                  >
                    <span className="text-lg">{t.runeIcon}</span>
                    <span className="truncate w-full">{t.nameZh.slice(0, 4)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 年級適配與上榜保證徽章 */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 mb-6 flex items-center justify-between text-left">
            <div className="flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-black text-emerald-900 dark:text-emerald-200">
                  年級題庫精準適配（第 {qualifyingBook} 冊單元）
                </div>
                <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  符合全校英雄榜 Top 50 衝榜與宇宙金幣領取門檻！
                </div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-black shrink-0">
              上榜認證
            </span>
          </div>

          {/* 操作按鈕 */}
          <div className="space-y-3">
            <Button3D
              variant="amber"
              size="lg"
              onClick={handleStartEscape}
              className="w-full text-base sm:text-lg"
            >
              進入密室大脫逃 🗝️
            </Button3D>

            <Button3D
              variant="slate"
              size="md"
              onClick={handleQuitGame}
              className="w-full"
            >
              返回大廳
            </Button3D>
          </div>
        </GlassCard>
      </div>
    );
  }

  // ── 畫面 2：密室探索主場景 (Chamber In-Game Scene) ──
  return (
    <div className="relative w-full h-[100dvh]">
      <ChamberScene
        theme={theme}
        puzzles={puzzles}
        solvedPuzzleIds={solvedPuzzleIds}
        activePuzzleId={activePuzzleId}
        onSelectStation={(puzzleId) => setActivePuzzleId(puzzleId)}
        lives={lives}
        timeElapsed={timeElapsed}
        hintCount={hintCount}
        onUseHint={handleUseHint}
        onQuit={handleQuitGame}
      />

      {/* ── 聚焦機關互動彈窗 (iPad 沉浸式浮層視圖) ── */}
      {activePuzzle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 border-2 border-amber-400/80 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[90dvh] overflow-y-auto">
            {/* 彈窗頂部 */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{theme.runeIcon}</span>
                <div>
                  <span className="text-[11px] font-bold text-slate-400">
                    {activePuzzle.stationName}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black font-heading text-slate-800 dark:text-slate-100">
                    {activePuzzle.titleZh}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => {
                  soundEngine.click();
                  setActivePuzzleId(null);
                }}
                className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all active:scale-90 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 依機關類型載入特定謎題組件 */}
            {activePuzzle.type === 'listening' && (
              <ListeningPuzzle
                puzzle={activePuzzle}
                onSolve={handleSolvePuzzle}
                onMistake={handleMistake}
                isSolved={solvedPuzzleIds.has(activePuzzle.id)}
                eliminatedOptionId={eliminatedOptions[activePuzzle.id]}
                themeColor={theme.color}
              />
            )}

            {activePuzzle.type === 'meaning' && (
              <MeaningPuzzle
                puzzle={activePuzzle}
                onSolve={handleSolvePuzzle}
                onMistake={handleMistake}
                isSolved={solvedPuzzleIds.has(activePuzzle.id)}
                eliminatedOptionId={eliminatedOptions[activePuzzle.id]}
                themeColor={theme.color}
              />
            )}

            {activePuzzle.type === 'spelling' && (
              <SpellingPuzzle
                puzzle={activePuzzle}
                onSolve={handleSolvePuzzle}
                onMistake={handleMistake}
                isSolved={solvedPuzzleIds.has(activePuzzle.id)}
                themeColor={theme.color}
              />
            )}

            {activePuzzle.type === 'pairing' && (
              <PairingPuzzle
                puzzle={activePuzzle}
                onSolve={handleSolvePuzzle}
                onMistake={handleMistake}
                isSolved={solvedPuzzleIds.has(activePuzzle.id)}
                themeColor={theme.color}
              />
            )}
          </div>
        </div>
      )}

      {/* ── 畫面 3：大逃脫勝利結算浮層 (Victory Modal) ── */}
      {gameState === 'victory' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <GlassCard className="max-w-md w-full p-6 sm:p-8 text-center relative overflow-hidden border-2 border-emerald-400 shadow-2xl max-h-[92dvh] overflow-y-auto">
            <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-amber-400 mx-auto mb-2 animate-bounce" />

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-black mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>密室大門已完全開啟</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black font-heading text-slate-800 dark:text-white mb-1">
              🎉 逃脫成功！
            </h2>
            <p className="text-xs font-bold text-slate-400 mb-5">
              耗時 <span className="text-amber-500 font-black text-base">{timeElapsed} 秒</span> 破解【{theme.nameZh}】四大封印！
            </p>

            {/* 榮譽榜登錄與宇宙金幣結算卡 */}
            <div className="mb-5 text-left">
              <HonorSubmissionCard
                mode="escape"
                book={qualifyingBook}
                score={4}
                time={timeElapsed}
                totalCount={4}
                rangeText={`第 ${qualifyingBook} 冊 - ${theme.nameZh}`}
                reviewWords={wordsInvolved.map(w => ({
                  id: w.id,
                  en: w.en,
                  zh: w.zh,
                  isMistake: false
                }))}
              />
            </div>

            {/* 動作按鈕 */}
            <div className="space-y-2.5">
              <Button3D
                variant="amber"
                size="md"
                onClick={handlePlayAgain}
                className="w-full"
              >
                挑戰下一座密室 🚪
              </Button3D>

              <Button3D
                variant="slate"
                size="md"
                onClick={handleQuitGame}
                className="w-full"
              >
                返回大廳
              </Button3D>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
export default VocabEscapeGame;
