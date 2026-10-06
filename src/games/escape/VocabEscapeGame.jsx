import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useI18n } from '../../context/I18nContext';
import { useStudent } from '../../context/StudentContext';
import { enterFullscreen, exitFullscreen } from '../../services/fullscreen';
import { soundEngine } from '../../services/audio';
import { escapeAudio, speakMysteriousEnglish } from './escapeAudio';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';
import { getRandomFunNickname } from '../../utils/studentIdHelper';
import { generateEscapeRoomCampaign } from './escapeData';
import { ChamberScene } from './ChamberScene';
import { UniversalOptionPuzzle } from './puzzles/UniversalOptionPuzzle';
import { SentenceOrderPuzzle } from './puzzles/SentenceOrderPuzzle';
import { SpellingPuzzle } from './puzzles/SpellingPuzzle';
import { PairingPuzzle } from './puzzles/PairingPuzzle';
import confetti from 'canvas-confetti';
import {
  ArrowLeft, Trophy, RotateCcw, Sparkles, Key, CheckCircle2,
  X, ShieldAlert, Volume2, Heart, Award, Compass, BookOpen, Clock,
  User, Dices, ArrowRight, DoorOpen
} from 'lucide-react';

export const VocabEscapeGame = ({
  words = [],
  settings = {},
  qualifyingBook: lobbyQualifyingBook,
  onBack
}) => {
  const { lang, t } = useI18n();
  const { currentStudent, addQuestPoints } = useStudent();

  // 學生自訂暱稱 (自動帶出登入暱稱或本機記憶)
  const [playerName, setPlayerName] = useState(() => {
    return (
      currentStudent?.nickname ||
      localStorage.getItem('wutai_player_name') ||
      '探險小勇士'
    );
  });

  // 遊戲狀態機: 'briefing' | 'playing' | 'transition' | 'victory'
  const [gameState, setGameState] = useState('briefing');
  const [campaignData, setCampaignData] = useState(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [activePuzzleId, setActivePuzzleId] = useState(null);
  const [solvedPuzzleIds, setSolvedPuzzleIds] = useState(new Set());
  const [lives, setLives] = useState(3);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [hintCount, setHintCount] = useState(2);
  const [eliminatedOptions, setEliminatedOptions] = useState({});
  const [isBgmMuted, setIsBgmMuted] = useState(false);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const hasAddedQuestPointsRef = useRef(false);

  // 初始化連續 3 室逃脫會話
  const initCampaign = useCallback(() => {
    const studentGrade = currentStudent?.grade || '03';
    const campaign = generateEscapeRoomCampaign(words, {
      grade: studentGrade,
      selectedUnits: settings.selectedUnits || []
    });

    setCampaignData(campaign);
    setCurrentChapterIndex(0);
    setSolvedPuzzleIds(new Set());
    setActivePuzzleId(null);
    setLives(3);
    setTimeElapsed(0);
    setHintCount(2);
    setEliminatedOptions({});
    hasAddedQuestPointsRef.current = false;
  }, [words, currentStudent, settings.selectedUnits]);

  useEffect(() => {
    initCampaign();
  }, [initCampaign]);

  // 卸載時還原全螢幕、停止計時器與停止合成音樂
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      escapeAudio.stopCurrentMusic();
      exitFullscreen();
    };
  }, []);

  // 隨機更換趣味暱稱
  const handleRandomNickname = () => {
    soundEngine.click();
    const newNick = getRandomFunNickname();
    setPlayerName(newNick);
    try {
      localStorage.setItem('wutai_player_name', newNick);
    } catch (e) {}
  };

  // 開始冒險：進入第一室並全螢幕
  const handleStartEscape = () => {
    soundEngine.init();
    soundEngine.click();
    escapeAudio.init();

    // 記憶暱稱
    const cleanNick = playerName.trim() || '探險小勇士';
    try {
      localStorage.setItem('wutai_player_name', cleanNick);
    } catch (e) {}

    // 立即觸發全螢幕沉浸
    enterFullscreen();

    // 啟動第一室專屬 Web Audio 合成懸疑音樂
    const firstRoom = campaignData?.chapters?.[0];
    if (firstRoom?.themeId) {
      escapeAudio.playRoomBgm(firstRoom.themeId);
    }

    setGameState('playing');
    startTimeRef.current = Date.now();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  };

  // 切換音樂靜音
  const handleToggleBgm = () => {
    const muted = escapeAudio.toggleMute();
    setIsBgmMuted(muted);
  };

  // 放棄逃脫退出
  const handleQuitGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    escapeAudio.stopCurrentMusic();
    exitFullscreen();
    onBack();
  };

  const currentChapter = campaignData?.chapters?.[currentChapterIndex];

  // 玩家解開單一題目機關
  const handleSolvePuzzle = (puzzleId, result) => {
    const nextSolved = new Set(solvedPuzzleIds);
    nextSolved.add(puzzleId);
    setSolvedPuzzleIds(nextSolved);
    setActivePuzzleId(null);

    // 檢查當前房間內 3 個關鍵核心印記是否都已解鎖
    const currentRoomPuzzles = currentChapter?.puzzles || [];
    const keySolvedCount = currentRoomPuzzles.filter(p => p.isKeyRelic && nextSolved.has(p.id)).length;

    if (keySolvedCount >= 3) {
      // 本室關鍵 3 點全部解鎖！觸發重型石門升起開啟音效
      escapeAudio.playDoorUnlockSound();
      soundEngine.win();
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}

      if (currentChapterIndex < (campaignData.chapters.length - 1)) {
        // 進入過場串場說明畫面
        setGameState('transition');
      } else {
        // 三大房間全數通關！終極逃脫成功
        handleGrandVictory();
      }
    }
  };

  // 點擊「前往下一室」過場切換
  const handleGoNextRoom = () => {
    soundEngine.click();
    const nextIdx = currentChapterIndex + 1;
    setCurrentChapterIndex(nextIdx);

    // 平滑切換下一室專屬 Web Audio 奇幻環境音樂
    const nextChapterMeta = campaignData?.chapters?.[nextIdx];
    if (nextChapterMeta?.themeId) {
      escapeAudio.playRoomBgm(nextChapterMeta.themeId);
    }

    setGameState('playing');
  };

  // 玩家答錯扣除生命值
  const handleMistake = (puzzleId, detail) => {
    setLives(prev => {
      const nextLives = Math.max(0, prev - 1);
      if (nextLives === 0) {
        setTimeout(() => setLives(1), 1500);
      }
      return nextLives;
    });
  };

  // 鷹眼透鏡提示道具
  const handleUseHint = () => {
    if (hintCount <= 0 || !activePuzzleId) return;
    const currentPuzzle = currentChapter?.puzzles?.find(p => p.id === activePuzzleId);
    if (!currentPuzzle) return;

    soundEngine.click();

    if (['cloze', 'riddle', 'listening', 'opposites', 'dialogue', 'meaning'].includes(currentPuzzle.type)) {
      const wrongOptions = (currentPuzzle.options || []).filter(o => {
        const text = typeof o === 'string' ? o : (o.en || o.id || '');
        const target = currentPuzzle.targetText || currentPuzzle.targetWord?.en || '';
        return text.toLowerCase() !== target.toLowerCase();
      });
      if (wrongOptions.length > 0) {
        const toEliminate = typeof wrongOptions[0] === 'string' ? wrongOptions[0] : (wrongOptions[0].id || wrongOptions[0].en);
        setEliminatedOptions(prev => ({
          ...prev,
          [activePuzzleId]: toEliminate
        }));
        setHintCount(prev => Math.max(0, prev - 1));
      }
    } else if (currentPuzzle.type === 'spelling') {
      speakMysteriousEnglish(currentPuzzle.voiceText || currentPuzzle.englishPrompt || currentPuzzle.targetWord?.en);
      setHintCount(prev => Math.max(0, prev - 1));
    } else if (currentPuzzle.type === 'sentence_order') {
      speakMysteriousEnglish(currentPuzzle.voiceText);
      setHintCount(prev => Math.max(0, prev - 1));
    }
  };

  // 終極大脫逃通關結算
  const handleGrandVictory = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    soundEngine.win();
    try {
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.5 } });
    } catch (e) {}

    // 發放探索積分 +5
    if (addQuestPoints && !hasAddedQuestPointsRef.current) {
      hasAddedQuestPointsRef.current = true;
      addQuestPoints(5);
    }

    setGameState('victory');
  };

  // 再挑戰一局全新的連續密室
  const handlePlayAgain = () => {
    soundEngine.click();
    initCampaign();
    setGameState('briefing');
  };

  if (!campaignData || !currentChapter) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const { chapters, qualifyingBook, totalPuzzlesCount, allWordsInvolved } = campaignData;
  const activePuzzle = currentChapter.puzzles.find(p => p.id === activePuzzleId);

  // ── 畫面 1：行前前情提要與暱稱設定 (Prologue Screen) ──
  if (gameState === 'briefing') {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 animate-fadeIn">
        <GlassCard className="max-w-2xl w-full p-6 sm:p-8 text-center relative overflow-hidden border-2 border-amber-400/70 shadow-2xl">
          <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-emerald-500 text-white flex items-center justify-center mx-auto mb-3 shadow-xl shadow-amber-500/30 text-3xl">
            🗝️
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200 text-xs font-black mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>大武山遠古石板屋遺跡 • 三連環密室大脫逃</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-800 dark:text-slate-100 mb-2">
            神祕密室大脫逃
          </h2>

          {/* 前情提要冒險背景說明 */}
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 mb-5 text-left text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed font-bold">
            <p className="mb-2">
              📜 <strong>【前情提要】</strong>探險家在屏東霧台深山調查古石板屋遺跡時，不慎踏中機關陷阱，身後千斤青石大門轟隆落下，退路已被徹底封死！
            </p>
            <p className="mb-2">
              每間石室隱藏著 <strong>5 處神秘遺跡</strong>，但只有 <strong>3 個散發淡淡金色呼吸光暈的才是過關關鍵</strong>（其餘為白色迷途古物）！
            </p>
            <p>
              聆聽石壁發出的<strong>低沉神秘英文預言</strong>，解開三道石門，重回陽光灑落的青山大地！
            </p>
          </div>

          {/* 學生暱稱確認與可編輯輸入框 */}
          <div className="mb-5 p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 max-w-md mx-auto text-left shadow-sm">
            <label className="text-xs font-black text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-500" />
              <span>探險家冒險代號（已自動帶出，可修改）：</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={12}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-black text-sm outline-none focus:border-amber-500 transition-all"
                placeholder="輸入您的冒險稱號"
              />
              <button
                type="button"
                onClick={handleRandomNickname}
                className="p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-200 font-black text-xs transition-all active:scale-95 flex items-center gap-1 shrink-0 cursor-pointer"
                title="隨機生成稱號"
              >
                <Dices className="w-4 h-4" />
                <span>換一個</span>
              </button>
            </div>
          </div>

          {/* 年級適配與上榜保證徽章 */}
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 mb-6 flex items-center justify-between text-left">
            <div className="flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-black text-emerald-900 dark:text-emerald-200">
                  全自動年級適配（第 {qualifyingBook} 冊單元詞彙）
                </div>
                <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  符合全校英雄榜登錄與宇宙金幣領取門檻！
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

  // ── 畫面 2：房間過場說明 (Transition Screen) ──
  if (gameState === 'transition') {
    const nextChapterMeta = chapters[currentChapterIndex + 1];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
        <GlassCard className="max-w-lg w-full p-6 sm:p-8 text-center relative overflow-hidden border-2 border-emerald-400 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-400/40">
            <DoorOpen className="w-8 h-8 animate-bounce" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black mb-2">
            <span>🎉 第 {currentChapter.roomNumber} 道石門已解除封印！</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-heading text-white mb-3">
            {currentChapter.titleZh} 脫逃成功！
          </h3>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 mb-6 text-left text-xs sm:text-sm text-slate-200 font-bold leading-relaxed">
            {currentChapter.transitionStoryZh}
          </div>

          <Button3D
            variant="emerald"
            size="lg"
            onClick={handleGoNextRoom}
            className="w-full flex items-center justify-center gap-2"
          >
            <span>進入下一個房間：{nextChapterMeta?.titleZh}</span>
            <ArrowRight className="w-5 h-5" />
          </Button3D>
        </GlassCard>
      </div>
    );
  }

  // ── 畫面 3：密室探索主場景 ──
  return (
    <div className="relative w-full h-[100dvh]">
      <ChamberScene
        currentChapter={currentChapter}
        chapterIndex={currentChapterIndex}
        totalChapters={chapters.length}
        solvedPuzzleIds={solvedPuzzleIds}
        onSelectStation={(puzzleId) => setActivePuzzleId(puzzleId)}
        lives={lives}
        timeElapsed={timeElapsed}
        hintCount={hintCount}
        onUseHint={handleUseHint}
        onQuit={handleQuitGame}
        isBgmMuted={isBgmMuted}
        onToggleBgm={handleToggleBgm}
      />

      {/* ── 聚焦機關互動彈窗 ── */}
      {activePuzzle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 border-2 border-amber-400/80 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{currentChapter.runeIcon}</span>
                <div>
                  <span className="text-[11px] font-bold text-slate-400">
                    {activePuzzle.hint}
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

            {['cloze', 'riddle', 'listening', 'opposites', 'dialogue', 'meaning'].includes(activePuzzle.type) && (
              <UniversalOptionPuzzle
                puzzle={activePuzzle}
                onSolve={handleSolvePuzzle}
                onMistake={handleMistake}
                isSolved={solvedPuzzleIds.has(activePuzzle.id)}
                eliminatedOptionId={eliminatedOptions[activePuzzle.id]}
                themeColor={currentChapter.color}
              />
            )}

            {activePuzzle.type === 'sentence_order' && (
              <SentenceOrderPuzzle
                puzzle={activePuzzle}
                onSolve={handleSolvePuzzle}
                onMistake={handleMistake}
                isSolved={solvedPuzzleIds.has(activePuzzle.id)}
                themeColor={currentChapter.color}
              />
            )}

            {activePuzzle.type === 'spelling' && (
              <SpellingPuzzle
                puzzle={activePuzzle}
                onSolve={handleSolvePuzzle}
                onMistake={handleMistake}
                isSolved={solvedPuzzleIds.has(activePuzzle.id)}
                themeColor={currentChapter.color}
              />
            )}

            {activePuzzle.type === 'pairing' && (
              <PairingPuzzle
                puzzle={activePuzzle}
                onSolve={handleSolvePuzzle}
                onMistake={handleMistake}
                isSolved={solvedPuzzleIds.has(activePuzzle.id)}
                themeColor={currentChapter.color}
              />
            )}
          </div>
        </div>
      )}

      {/* ── 畫面 4：終極大脫逃勝利結算 ── */}
      {gameState === 'victory' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <GlassCard className="max-w-md w-full p-6 sm:p-8 text-center relative overflow-hidden border-2 border-emerald-400 shadow-2xl max-h-[92dvh] overflow-y-auto">
            <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-amber-400 mx-auto mb-2 animate-bounce" />

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-black mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>全破三大房間 • 終極大門完全敞開</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black font-heading text-slate-800 dark:text-white mb-1">
              🎉 逃脫成功！
            </h2>
            <p className="text-xs font-bold text-slate-400 mb-3">
              探險家 <strong className="text-amber-400">{playerName}</strong> 歷時 <span className="text-amber-400 font-black text-base">{timeElapsed} 秒</span> 破解三連環全部封印！
            </p>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 mb-4 text-xs font-bold text-slate-300 text-left leading-relaxed">
              {currentChapter.victoryStoryZh}
            </div>

            <div className="mb-5 text-left">
              <HonorSubmissionCard
                mode="escape"
                book={qualifyingBook}
                score={totalPuzzlesCount}
                time={timeElapsed}
                totalCount={totalPuzzlesCount}
                rangeText={`第 ${qualifyingBook} 冊 - 三連環密室大脫逃`}
                reviewWords={allWordsInvolved.map(w => ({
                  id: w.id,
                  en: w.en,
                  zh: w.zh,
                  isMistake: false
                }))}
              />
            </div>

            <div className="space-y-2.5">
              <Button3D
                variant="amber"
                size="md"
                onClick={handlePlayAgain}
                className="w-full"
              >
                再闖全新密室 🚪
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
