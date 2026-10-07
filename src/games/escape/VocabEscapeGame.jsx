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
import { generateEscapeRoomCampaign, ESCAPE_THEMES } from './escapeData';
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

  // 當前選定的密室風格主題 (temple | dungeon | tomb | asylum | random)
  const [selectedThemeId, setSelectedThemeId] = useState(() => {
    return localStorage.getItem('wutai_escape_theme') || 'temple';
  });

  // 遊戲狀態機: 'briefing' | 'intro' | 'playing' | 'transition' | 'victory'
  const [gameState, setGameState] = useState('briefing');
  const [showChineseTranslation, setShowChineseTranslation] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
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

  // 進入密室館時，背景預先載入所有 12 張超高壓縮 WebP 底圖，消滅任何黑屏與載入延遲
  useEffect(() => {
    try {
      const allBgUrls = ESCAPE_THEMES.flatMap(t => t.chapters.map(c => c.bg));
      allBgUrls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    } catch (e) {}
  }, []);

  // 初始化連續 3 室逃脫會話
  const initCampaign = useCallback((overrideThemeId = null) => {
    const studentGrade = currentStudent?.grade || '03';
    const themeToUse = overrideThemeId || selectedThemeId;
    const campaign = generateEscapeRoomCampaign(words, {
      grade: studentGrade,
      selectedUnits: settings.selectedUnits || [],
      themeId: themeToUse
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
  }, [words, currentStudent, settings.selectedUnits, selectedThemeId]);

  // 切換密室風格主題
  const handleSelectTheme = (themeId) => {
    soundEngine.click();
    setSelectedThemeId(themeId);
    try {
      localStorage.setItem('wutai_escape_theme', themeId);
    } catch (e) {}
    initCampaign(themeId);
  };

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

  // 開始冒險：進入儀式感神祕序章並預載該主題三圖
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

    // 啟動專屬高品質環境音樂
    const firstRoom = campaignData?.chapters?.[0];
    if (firstRoom?.themeId) {
      escapeAudio.playRoomBgm(firstRoom.themeId);
    }

    try {
      window.history.pushState({ escapeStage: 'intro' }, '');
    } catch (e) {}

    setGameState('intro');
    setShowChineseTranslation(false);

    // 預加載當前主題 3 張房間圖片
    const curThemeChapters = campaignData?.chapters || [];
    let loadedCount = 0;
    if (curThemeChapters.length === 0) {
      setImagesLoaded(true);
    } else {
      setImagesLoaded(false);
      curThemeChapters.forEach(chap => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loadedCount++;
          if (loadedCount >= curThemeChapters.length) {
            setImagesLoaded(true);
          }
        };
        img.src = chap.bg;
      });
    }

    // 沉浸神秘英語外師誦讀序章文字
    const curTheme = ESCAPE_THEMES.find(th => th.id === selectedThemeId) || ESCAPE_THEMES[0];
    if (curTheme?.prologueEn) {
      speakMysteriousEnglish(curTheme.prologueEn);
    }
  };

  // 點擊「立即進入密室」或跳過序章：無縫切入第一室
  const handleProceedToFirstChamber = () => {
    soundEngine.click();
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}

    try {
      window.history.pushState({ escapeStage: 'playing' }, '');
    } catch (e) {}

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

  // 1. 在密室遊戲中 (intro / playing / transition / victory) 點擊退回：返回「密室逃脫大廳」
  const handleExitToEscapeLobby = () => {
    soundEngine.click();
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}
    if (timerRef.current) clearInterval(timerRef.current);
    escapeAudio.stopCurrentMusic();
    exitFullscreen();
    setGameState('briefing');
  };

  // 2. 在「密室逃脫大廳」(briefing) 點擊返回：回到「單字冒險大廳 (單字館)」
  const handleQuitGameToVocabLobby = () => {
    soundEngine.click();
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}
    if (timerRef.current) clearInterval(timerRef.current);
    escapeAudio.stopCurrentMusic();
    exitFullscreen();
    onBack();
  };

  // 監聽瀏覽器上一頁：若在密室遊戲進行中按上一頁，退回密室逃脫大廳，而非直接跳回單字館
  useEffect(() => {
    const handlePopState = () => {
      if (gameState !== 'briefing') {
        try {
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
        } catch (e) {}
        if (timerRef.current) clearInterval(timerRef.current);
        escapeAudio.stopCurrentMusic();
        exitFullscreen();
        setGameState('briefing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [gameState]);

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

  const { chapters, qualifyingBook, totalPuzzlesCount, allWordsInvolved, theme: currentThemeObj = ESCAPE_THEMES[0] } = campaignData;
  const activePuzzle = currentChapter.puzzles.find(p => p.id === activePuzzleId);

  // ── 畫面 1：行前前情提要與暱稱設定 (Prologue Screen) ──
  if (gameState === 'briefing') {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 animate-fadeIn">
        <GlassCard className="max-w-2xl w-full p-6 sm:p-8 text-center relative overflow-hidden border-2 border-amber-400/70 shadow-2xl">
          <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-emerald-500 text-white flex items-center justify-center mx-auto mb-3 shadow-xl shadow-amber-500/30 text-3xl">
            {currentThemeObj.icon}
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200 text-xs font-black mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{currentThemeObj.nameZh} • 三連環密室大脫逃</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-800 dark:text-slate-100 mb-2">
            神祕密室大脫逃
          </h2>

          {/* 密室探險主題風格切換器 */}
          <div className="mb-5 text-left">
            <label className="text-xs font-black text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-500" />
                <span>選擇密室探險主題（每主題皆為獨立 3 連環關卡）：</span>
              </span>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                點擊即時切換場景
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {ESCAPE_THEMES.map((th) => {
                const isSelected = selectedThemeId === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => handleSelectTheme(th.id)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden active:scale-95 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-950 dark:text-amber-200 shadow-md ring-2 ring-amber-400/50 scale-102 font-black'
                        : 'bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400/60'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-lg">{th.icon}</span>
                      <span className="text-xs truncate">{th.nameZh}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 truncate">
                      {th.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 連續 3 關路線名稱導覽 */}
            <div className="p-2.5 rounded-2xl bg-slate-900/90 text-white border border-white/10 flex items-center justify-between gap-1 text-[11px] font-mono font-bold overflow-x-auto scrollbar-none shadow-inner">
              {currentThemeObj.chapters.map((chap, cIdx) => (
                <div key={chap.id} className="flex items-center gap-1.5 shrink-0">
                  <span className="w-5 h-5 rounded-full bg-amber-500/30 text-amber-300 flex items-center justify-center text-[10px] font-black">
                    {cIdx + 1}
                  </span>
                  <span className="truncate max-w-[120px] sm:max-w-none text-slate-200">
                    {chap.runeIcon} {chap.titleZh.split('：')[1] || chap.titleZh}
                  </span>
                  {cIdx < 2 && <span className="text-amber-400 text-xs mx-1">➔</span>}
                </div>
              ))}
            </div>
          </div>

          {/* 前情提要冒險背景說明 */}
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 mb-5 text-left text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed font-bold">
            <p className="mb-2">
              📜 <strong>【{currentThemeObj.nameZh} • 前情提要】</strong>{currentThemeObj.briefZh}
            </p>
            <p className="mb-2">
              每間石室隱藏著 <strong>5 處神秘遺跡（位置每次進入皆動態隨機）</strong>，但只有 <strong>3 個散發淡淡金色呼吸光暈的才是過關關鍵</strong>（其餘為淡白迷途古物）！
            </p>
            <p>
              聆聽石壁發出的<strong>神秘美語預言</strong>，解開連續三道石門，重回陽光灑落的廣闊天地！
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
              onClick={handleQuitGameToVocabLobby}
              className="w-full"
            >
              返回單字冒險大廳 🏠
            </Button3D>
          </div>
        </GlassCard>
      </div>
    );
  }

  // ── 畫面 1.5：沉浸式神祕前導序章 (全黑儀式感背景、低沉外師嗓音誦讀、三圖秒級預載) ──
  if (gameState === 'intro') {
    const curTheme = ESCAPE_THEMES.find(th => th.id === selectedThemeId) || ESCAPE_THEMES[0];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950 text-white select-none overflow-hidden animate-fadeIn">
        {/* 背景氛圍微光 */}
        <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-transparent to-black/95 pointer-events-none" />

        <div className="relative z-10 max-w-2xl w-full text-center px-4 py-8">
          {/* 主題徽章 */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-black mb-6 text-amber-300">
            <span>{curTheme.icon}</span>
            <span>{curTheme.nameZh}</span>
            <span className="text-white/40">•</span>
            <span className="text-white/80">{curTheme.badge}</span>
          </div>

          {/* 神秘英文序言文字 (外師沉穩低音朗讀) */}
          <div className="mb-8 space-y-4">
            <blockquote className="text-lg sm:text-2xl font-serif italic text-amber-100/90 leading-relaxed drop-shadow-md">
              "{curTheme.prologueEn}"
            </blockquote>

            {/* 中文翻譯 (玩家選擇性顯示) */}
            {showChineseTranslation ? (
              <p className="text-sm sm:text-base text-amber-200/80 font-bold leading-relaxed animate-fadeIn">
                {curTheme.prologueZh}
              </p>
            ) : null}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowChineseTranslation(prev => !prev)}
                className="text-xs text-white/50 hover:text-amber-300 underline underline-offset-4 transition-colors cursor-pointer"
              >
                {showChineseTranslation ? '隱藏中文說明' : '👁️ 點此查看中文說明'}
              </button>
            </div>
          </div>

          {/* 進入第一室 / 載入狀態按鈕 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button3D
              variant="amber"
              size="lg"
              onClick={handleProceedToFirstChamber}
              className="w-full sm:w-auto px-8 py-3 text-base sm:text-lg animate-pulse"
            >
              <span>{imagesLoaded ? '立即進入密室 (Skip) 🗝️' : '探索準備就緒，點擊進入 🗝️'}</span>
            </Button3D>

            <button
              type="button"
              onClick={handleExitToEscapeLobby}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              ← 暫退大廳
            </button>
          </div>
        </div>
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
            className="w-full flex items-center justify-center gap-2 mb-2"
          >
            <span>進入下一個房間：{nextChapterMeta?.titleZh}</span>
            <ArrowRight className="w-5 h-5" />
          </Button3D>

          <button
            onClick={handleExitToEscapeLobby}
            className="text-xs font-bold text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer py-1"
          >
            暫停並返回密室大廳
          </button>
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
        onQuit={handleExitToEscapeLobby}
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
                onClick={handleExitToEscapeLobby}
                className="w-full"
              >
                返回密室大廳 🏰
              </Button3D>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
export default VocabEscapeGame;
