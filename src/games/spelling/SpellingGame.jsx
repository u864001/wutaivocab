import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useI18n } from '../../context/I18nContext';
import { soundEngine, speakEnglish } from '../../services/audio';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';
import { enterFullscreen, exitFullscreen } from '../../services/fullscreen';
import confetti from 'canvas-confetti';
import { ArrowLeft, Volume2, Heart, Trophy, CheckCircle2, HeartCrack, Sparkles } from 'lucide-react';

export const SpellingGame = ({
  settings,
  words = [],
  qualifyingBook,
  onBack
}) => {
  const { t } = useI18n();
  const [queue, setQueue] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [wordGroups, setWordGroups] = useState([]);
  const [cleanTarget, setCleanTarget] = useState('');
  const [slots, setSlots] = useState([]);
  const [letters, setLetters] = useState([]);
  const [lives, setLives] = useState(5);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [shakingSlot, setShakingSlot] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const initialCountRef = useRef(0);
  const historyWordsRef = useRef(new Map());
  const mistakeIdsRef = useRef(new Set());

  // 同步 Refs 供鍵盤、拖曳與異步回呼使用，杜絕 stale closure
  const cleanTargetRef = useRef('');
  cleanTargetRef.current = cleanTarget;
  const slotsRef = useRef(slots);
  slotsRef.current = slots;
  const lettersRef = useRef(letters);
  lettersRef.current = letters;
  const feedbackRef = useRef(feedback);
  feedbackRef.current = feedback;
  const hasStartedRef = useRef(hasStarted);
  hasStartedRef.current = hasStarted;
  const isFinishedRef = useRef(isFinished);
  isFinishedRef.current = isFinished;
  const currentWordRef = useRef(currentWord);
  currentWordRef.current = currentWord;
  const queueRef = useRef(queue);
  queueRef.current = queue;
  const startTimeRef = useRef(startTime);
  startTimeRef.current = startTime;

  // 解析題目：支援片語分組 (如 "by bike" -> [by(2), bike(4)])
  const parsePhrase = (rawEn = '') => {
    const words = rawEn.trim().split(/\s+/).filter(Boolean);
    let globalSlotIndex = 0;
    const groups = [];
    const allCleanChars = [];

    for (const w of words) {
      const chars = w.toLowerCase().replace(/[^a-z]/g, '').split('');
      const group = {
        word: w,
        slots: []
      };
      for (const ch of chars) {
        group.slots.push({
          char: ch,
          slotIndex: globalSlotIndex
        });
        allCleanChars.push(ch);
        globalSlotIndex++;
      }
      if (group.slots.length > 0) {
        groups.push(group);
      }
    }

    return {
      wordGroups: groups,
      cleanTarget: allCleanChars.join(''),
      totalSlots: globalSlotIndex
    };
  };

  useEffect(() => {
    let filtered = words.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
    let shuffled = [...filtered].sort(() => 0.5 - Math.random());
    if (settings.count !== 'all') {
      shuffled = shuffled.slice(0, parseInt(settings.count, 10));
    }
    setQueue(shuffled);
    queueRef.current = shuffled;
    initialCountRef.current = shuffled.length;
    historyWordsRef.current.clear();
    mistakeIdsRef.current.clear();
    shuffled.forEach(w => historyWordsRef.current.set(w.id, { id: w.id, en: w.en, zh: w.zh }));
  }, [settings, words]);

  const loadWord = (wordObj) => {
    if (!wordObj || !wordObj.en) return;
    setCurrentWord(wordObj);
    currentWordRef.current = wordObj;

    const { wordGroups: groups, cleanTarget: target, totalSlots } = parsePhrase(wordObj.en);
    if (totalSlots === 0) {
      moveToNext(true);
      return;
    }

    setWordGroups(groups);
    setCleanTarget(target);
    cleanTargetRef.current = target;

    const initialSlots = new Array(totalSlots).fill(null);
    setSlots(initialSlots);
    slotsRef.current = initialSlots;

    const chars = target.split('').map((char, index) => ({
      id: `letter-${index}-${Date.now()}-${Math.random()}`,
      char,
      isPlaced: false
    }));

    const shuffledLetters = [...chars].sort(() => 0.5 - Math.random());
    setLetters(shuffledLetters);
    lettersRef.current = shuffledLetters;

    setLives(5);
    setFeedback(null);
    feedbackRef.current = null;
    setTimeout(() => speakEnglish(wordObj.en), 250);
  };

  // 卸載時還原全螢幕
  useEffect(() => {
    return () => {
      exitFullscreen();
    };
  }, []);

  const handleBackToLobby = () => {
    exitFullscreen();
    onBack();
  };

  const handleStart = () => {
    if (!queue || queue.length === 0) {
      alert('選取範圍內沒有單字，請回大廳重新勾選！');
      return onBack();
    }
    setHasStarted(true);
    hasStartedRef.current = true;
    const now = Date.now();
    setStartTime(now);
    startTimeRef.current = now;
    enterFullscreen();
    loadWord(queue[0]);
  };

  // 點擊字母自動填入第一個空格 (平板友善)
  const handleLetterClick = (letter) => {
    if (feedbackRef.current || letter.isPlaced) return;

    const nextEmptyIndex = slotsRef.current.findIndex(s => s === null);
    if (nextEmptyIndex === -1) return;

    const targetChar = cleanTargetRef.current[nextEmptyIndex];

    if (letter.char === targetChar) {
      processCorrect(letter, nextEmptyIndex);
    } else {
      processWrong(nextEmptyIndex);
    }
  };

  // 拖曳起始處理
  const handleDragStart = (e, letter) => {
    if (feedbackRef.current || letter.isPlaced) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', letter.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  // 拖曳置入槽位處理
  const handleDropOnSlot = (e, targetSlotIndex) => {
    e.preventDefault();
    if (feedbackRef.current) return;
    const letterId = e.dataTransfer.getData('text/plain');
    if (!letterId) return;

    const letterObj = lettersRef.current.find(l => l.id === letterId);
    if (!letterObj || letterObj.isPlaced) return;

    // 該槽位若已填入，不予重複覆蓋
    if (slotsRef.current[targetSlotIndex] !== null) return;

    const expectedChar = cleanTargetRef.current[targetSlotIndex];
    if (letterObj.char === expectedChar) {
      processCorrect(letterObj, targetSlotIndex);
    } else {
      processWrong(targetSlotIndex);
    }
  };

  // 處理放置正確
  const processCorrect = (letterObj, slotIndex) => {
    soundEngine.correct();

    const newSlots = [...slotsRef.current];
    newSlots[slotIndex] = letterObj;
    slotsRef.current = newSlots;
    setSlots(newSlots);

    const newLetters = lettersRef.current.map(l => (l.id === letterObj.id ? { ...l, isPlaced: true } : l));
    lettersRef.current = newLetters;
    setLetters(newLetters);

    // 全部填滿
    if (newSlots.every(slot => slot !== null)) {
      setFeedback('correct');
      feedbackRef.current = 'correct';
      setStats(s => ({ ...s, correct: s.correct + 1 }));
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => moveToNext(true), 1300);
    }
  };

  // 處理放置錯誤
  const processWrong = (slotIndex) => {
    soundEngine.wrong();
    if (currentWordRef.current?.id) {
      mistakeIdsRef.current.add(currentWordRef.current.id);
    }
    setShakingSlot(slotIndex);
    setTimeout(() => setShakingSlot(null), 500);

    setLives(prev => {
      const next = prev - 1;
      if (next <= 0) {
        setFeedback('wrong');
        feedbackRef.current = 'wrong';
        setStats(s => ({ ...s, wrong: s.wrong + 1 }));
        setTimeout(() => moveToNext(false), 2200);
      }
      return next;
    });
  };

  // 支援鍵盤直接打字輸入 (Chromebook / 電腦無縫體驗)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!hasStartedRef.current || isFinishedRef.current || feedbackRef.current) return;
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key.length !== 1) return;

      const pressedKey = e.key.toLowerCase();
      if (!/[a-z]/.test(pressedKey)) return;

      const currentSlots = slotsRef.current;
      const nextEmptyIndex = currentSlots.findIndex(s => s === null);
      if (nextEmptyIndex === -1) return;

      const targetChar = cleanTargetRef.current[nextEmptyIndex];

      if (pressedKey === targetChar) {
        const availableLetter = lettersRef.current.find(l => !l.isPlaced && l.char === pressedKey);
        if (availableLetter) {
          processCorrect(availableLetter, nextEmptyIndex);
        }
      } else {
        processWrong(nextEmptyIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const moveToNext = (wasCorrect) => {
    setFeedback(null);
    feedbackRef.current = null;
    const newQueue = [...queueRef.current];
    const curr = newQueue.shift();

    if (!wasCorrect) {
      newQueue.push(curr);
    }

    if (newQueue.length > 0) {
      setQueue(newQueue);
      queueRef.current = newQueue;
      loadWord(newQueue[0]);
    } else {
      // 挑戰完成！退出全螢幕回到正常視窗
      exitFullscreen();
      const finalSec = Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000);
      setElapsedTime(finalSec);
      setIsFinished(true);
      isFinishedRef.current = true;
      soundEngine.win();
      confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
    }
  };

  if (!hasStarted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full text-center p-8">
          <div className="w-20 h-20 rounded-3xl bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2 font-heading">
            {t.spellingTitle}
          </h2>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">
            {t.spellingHelp}
          </p>
          <div className="flex items-center justify-center gap-1.5 text-rose-500 text-xs font-black mb-6">
            <Heart className="w-4 h-4 fill-rose-500" />
            {t.heartGraceInfo}
          </div>
          <div className="space-y-3">
            <Button3D variant="rose" size="lg" onClick={handleStart} className="w-full">
              {t.startChallenge}
            </Button3D>
            <Button3D variant="slate" size="md" onClick={handleBackToLobby} className="w-full">
              {t.backLobby}
            </Button3D>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (isFinished) {
    const totalWords = initialCountRef.current || stats.correct;
    const mistakesCount = mistakeIdsRef.current.size;
    const firstAttemptPerfect = Math.max(0, totalWords - mistakesCount);

    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 animate-fadeIn">
        <GlassCard className="max-w-md w-full text-center p-8">
          <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-3 animate-bounce" />
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 font-heading mb-1">
            {t.spellingComplete}
          </h2>
          <p className="text-xs font-bold text-slate-500 mb-6">
            {t.spentTime}：<span className="text-rose-500 font-black text-lg">{elapsedTime} 秒</span>
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {firstAttemptPerfect} / {totalWords}
              </span>
              <p className="text-xs font-bold text-slate-500 mt-1">首次完美拼出 ({Math.round((firstAttemptPerfect / Math.max(1, totalWords)) * 100)}%)</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
                {mistakesCount > 0 ? `+${mistakesCount}` : '0'}
              </span>
              <p className="text-xs font-bold text-slate-500 mt-1">{mistakesCount > 0 ? '完成重測訂正' : '一次零失誤'}</p>
            </div>
          </div>

          {/* 榮譽榜破紀錄留名判定卡與獎狀領取 */}
          <HonorSubmissionCard
            mode="spelling"
            book={qualifyingBook}
            score={firstAttemptPerfect}
            time={elapsedTime}
            totalCount={totalWords}
            rangeText={qualifyingBook ? `第 ${qualifyingBook} 冊` : settings.selectedUnits.slice(0, 3).join(', ')}
            reviewWords={Array.from(historyWordsRef.current.values()).map(w => ({
              ...w,
              isMistake: mistakeIdsRef.current.has(w.id)
            }))}
          />

          <Button3D variant="slate" size="lg" onClick={handleBackToLobby} className="w-full">
            {t.backLobby}
          </Button3D>
        </GlassCard>
      </div>
    );
  }

  // ─── 遊戲進行中 (iPad 零捲動滿版全螢幕適配) ───
  return (
    <div className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-between p-3 sm:p-5 max-h-[100dvh] h-[100dvh] overflow-hidden select-none animate-fadeIn">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center h-full justify-between">
        {/* 頂部資訊列 */}
        <div className="w-full flex items-center justify-between mb-2 sm:mb-3 flex-shrink-0">
          <Button3D variant="slate" size="sm" onClick={handleBackToLobby} icon={ArrowLeft}>
            {t.backLobby}
          </Button3D>

          {/* 愛心生命值 */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 sm:w-6 sm:h-6 transition-all ${
                  i < lives
                    ? 'text-rose-500 fill-rose-500 animate-pulse'
                    : 'text-slate-300 dark:text-slate-700'
                }`}
              />
            ))}
          </div>

          <span className="text-xs font-black text-slate-400">
            剩餘：{queue.length} 字
          </span>
        </div>

        {currentWord && (
          <GlassCard className="w-full flex-1 min-h-0 flex flex-col justify-between text-center relative overflow-hidden p-4 sm:p-6 mb-1">
            {/* 中文提示與朗讀按鈕 */}
            <div className="mb-2 sm:mb-3 flex flex-col items-center flex-shrink-0">
              <h2 className="text-2xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 font-heading mb-1">
                {currentWord.zh}
              </h2>
              <button
                onClick={() => speakEnglish(currentWord.en)}
                className="p-2 sm:p-3 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:scale-105 active:scale-95 transition-transform"
              >
                <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* 單字目標槽位 (支援片語單詞分組 _ _   _ _ _ _) */}
            <div className="flex flex-wrap justify-center items-center gap-x-5 sm:gap-x-8 gap-y-3 mb-3 sm:mb-5 min-h-[56px] sm:min-h-[64px]">
              {wordGroups.map((group, gIdx) => (
                <div key={gIdx} className="flex items-center gap-1.5 sm:gap-2.5">
                  {group.slots.map(({ slotIndex }) => {
                    const slot = slots[slotIndex];
                    const isShaking = shakingSlot === slotIndex;
                    return (
                      <div
                        key={slotIndex}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'move';
                        }}
                        onDrop={(e) => handleDropOnSlot(e, slotIndex)}
                        className={`
                          w-10 h-12 sm:w-14 sm:h-18 rounded-xl sm:rounded-2xl border-2 sm:border-4 flex items-center justify-center text-xl sm:text-3xl font-black uppercase transition-all select-none
                          ${isShaking ? 'animate-shake border-rose-500 bg-rose-50 dark:bg-rose-950/50' : ''}
                          ${slot 
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/30' 
                            : 'bg-slate-100 dark:bg-slate-800/80 border-dashed border-slate-300 dark:border-slate-600 text-transparent'}
                        `}
                      >
                        {slot ? slot.char : '?'}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* 打散的字母卡片區 (支援點擊、拖曳與鍵盤打字) */}
            <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex-shrink-0">
              <p className="text-[11px] sm:text-xs font-bold text-slate-400 mb-2">
                {t.tapLettersHint}
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {letters.map((letter) => (
                  <button
                    key={letter.id}
                    draggable={!letter.isPlaced && feedback === null}
                    onDragStart={(e) => handleDragStart(e, letter)}
                    disabled={letter.isPlaced || feedback !== null}
                    onClick={() => handleLetterClick(letter)}
                    className={`
                      w-10 h-12 sm:w-14 sm:h-18 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-3xl font-black uppercase transition-all select-none
                      ${letter.isPlaced 
                        ? 'opacity-0 scale-50 pointer-events-none' 
                        : 'btn-3d bg-rose-500 hover:bg-rose-400 text-white border-b-4 border-rose-700 active:border-b-0 cursor-grab active:cursor-grabbing shadow-md'}
                    `}
                  >
                    {letter.char}
                  </button>
                ))}
              </div>
            </div>

            {/* 正確或失敗全屏回饋遮罩 */}
            {feedback && (
              <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-md animate-fadeIn ${
                feedback === 'correct' ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/95 text-white'
              }`}>
                {feedback === 'correct' ? (
                  <>
                    <CheckCircle2 className="w-14 h-14 mb-2 animate-bounce" />
                    <span className="text-2xl sm:text-3xl font-black font-heading">{t.correct}</span>
                  </>
                ) : (
                  <>
                    <HeartCrack className="w-14 h-14 mb-2 animate-pulse" />
                    <span className="text-xl sm:text-2xl font-black font-heading mb-1">{t.heartsDepleted}</span>
                    <p className="text-xl sm:text-2xl font-black underline mt-2">{currentWord.en}</p>
                  </>
                )}
              </div>
            )}
          </GlassCard>
        )}
      </div>
    </div>
  );
};
