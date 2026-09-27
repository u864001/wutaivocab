import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useI18n } from '../../context/I18nContext';
import { soundEngine, speakEnglish } from '../../services/audio';
import { uploadScore } from '../../services/supabase';
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
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScoreSaved, setIsScoreSaved] = useState(false);

  useEffect(() => {
    let filtered = words.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
    let shuffled = [...filtered].sort(() => 0.5 - Math.random());
    if (settings.count !== 'all') {
      shuffled = shuffled.slice(0, parseInt(settings.count, 10));
    }
    setQueue(shuffled);
  }, [settings, words]);

  const loadWord = (wordObj) => {
    setCurrentWord(wordObj);
    const wordStr = wordObj.en.toLowerCase();
    setSlots(new Array(wordStr.length).fill(null));

    const chars = wordStr.split('').map((char, index) => ({
      id: `letter-${index}-${Date.now()}-${Math.random()}`,
      char,
      isPlaced: false
    }));

    setLetters([...chars].sort(() => 0.5 - Math.random()));
    setLives(5);
    setFeedback(null);
    setTimeout(() => speakEnglish(wordObj.en), 250);
  };

  const handleStart = () => {
    if (queue.length === 0) return onBack();
    setHasStarted(true);
    setStartTime(Date.now());
    loadWord(queue[0]);
  };

  // 點擊字母自動填入第一個空格 (平板友善)
  const handleLetterClick = (letter) => {
    if (feedback || letter.isPlaced) return;

    const nextEmptyIndex = slots.findIndex(s => s === null);
    if (nextEmptyIndex === -1) return;

    const targetChar = currentWord.en.toLowerCase()[nextEmptyIndex];

    if (letter.char === targetChar) {
      processCorrect(letter, nextEmptyIndex);
    } else {
      processWrong(nextEmptyIndex);
    }
  };

  // 處理放置正確
  const processCorrect = (letterObj, slotIndex) => {
    soundEngine.correct();

    const newSlots = [...slots];
    newSlots[slotIndex] = letterObj;
    setSlots(newSlots);

    setLetters(prev => prev.map(l => (l.id === letterObj.id ? { ...l, isPlaced: true } : l)));

    // 全部填滿
    if (newSlots.every(slot => slot !== null)) {
      setFeedback('correct');
      setStats(s => ({ ...s, correct: s.correct + 1 }));
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => moveToNext(true), 1300);
    }
  };

  // 處理放置錯誤
  const processWrong = (slotIndex) => {
    soundEngine.wrong();
    setShakingSlot(slotIndex);
    setTimeout(() => setShakingSlot(null), 500);

    setLives(prev => {
      const next = prev - 1;
      if (next <= 0) {
        setFeedback('wrong');
        setStats(s => ({ ...s, wrong: s.wrong + 1 }));
        setTimeout(() => moveToNext(false), 2200);
      }
      return next;
    });
  };

  const moveToNext = (wasCorrect) => {
    setFeedback(null);
    const newQueue = [...queue];
    const curr = newQueue.shift();

    if (!wasCorrect) {
      newQueue.push(curr);
    }

    if (newQueue.length > 0) {
      setQueue(newQueue);
      loadWord(newQueue[0]);
    } else {
      const finalSec = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(finalSec);
      setIsFinished(true);
      soundEngine.win();
      confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
    }
  };

  const handleSubmitScore = async () => {
    if (!playerName.trim() || isSubmitting) return;
    setIsSubmitting(true);

    const success = await uploadScore({
      mode: 'spelling',
      book: qualifyingBook || 'Custom',
      name: playerName.trim(),
      score: stats.correct,
      time: elapsedTime
    });

    if (success) setIsScoreSaved(true);
    setIsSubmitting(false);
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
            聽語音、看中文，點擊字母按順序拼出完整單字！
          </p>
          <div className="flex items-center justify-center gap-1.5 text-rose-500 text-xs font-black mb-6">
            <Heart className="w-4 h-4 fill-rose-500" />
            每題擁有 5 次容錯愛心
          </div>
          <div className="space-y-3">
            <Button3D variant="rose" size="lg" onClick={handleStart} className="w-full">
              {t.startChallenge}
            </Button3D>
            <Button3D variant="slate" size="md" onClick={onBack} className="w-full">
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
            拼字闖關完成！
          </h2>
          <p className="text-xs font-bold text-slate-500 mb-6">
            總花費時間：<span className="text-rose-500 font-black text-lg">{elapsedTime} 秒</span>
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {stats.correct}
              </span>
              <p className="text-xs font-bold text-slate-500 mt-1">完美拼出</p>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
              <span className="text-3xl font-black text-rose-500">
                {stats.wrong}
              </span>
              <p className="text-xs font-bold text-slate-500 mt-1">扣盡重測</p>
            </div>
          </div>

          {qualifyingBook !== null && !isScoreSaved ? (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800">
              <p className="text-xs font-black text-amber-800 dark:text-amber-200 mb-2">
                👑 獲得榮譽榜登錄資格！
              </p>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder={t.enterName}
                className="w-full p-3 rounded-xl border border-amber-300 bg-white dark:bg-slate-800 text-center font-bold text-slate-800 dark:text-slate-100 mb-2 outline-none focus:border-amber-500"
              />
              <Button3D
                variant="amber"
                size="md"
                onClick={handleSubmitScore}
                disabled={!playerName.trim() || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? t.submitting : t.submitHonor}
              </Button3D>
            </div>
          ) : isScoreSaved ? (
            <div className="mb-6 p-3 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs">
              ✓ {t.submitted}
            </div>
          ) : null}

          <Button3D variant="slate" size="lg" onClick={onBack} className="w-full">
            {t.backLobby}
          </Button3D>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 flex flex-col items-center">
      {/* 頂部資訊列 */}
      <div className="w-full flex items-center justify-between mb-4">
        <Button3D variant="slate" size="sm" onClick={onBack} icon={ArrowLeft}>
          {t.backLobby}
        </Button3D>

        {/* 愛心生命值 */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Heart
              key={i}
              className={`w-6 h-6 transition-all ${
                i < lives
                  ? 'text-rose-500 fill-rose-500 animate-pulse'
                  : 'text-slate-300 dark:text-slate-700'
              }`}
            />
          ))}
        </div>

        <span className="text-xs font-black text-slate-500 dark:text-slate-400">
          剩餘：{queue.length} 字
        </span>
      </div>

      {currentWord && (
        <GlassCard className="w-full text-center relative overflow-hidden p-6 sm:p-10">
          {/* 中文提示與朗讀按鈕 */}
          <div className="mb-8 flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 font-heading mb-3">
              {currentWord.zh}
            </h2>
            <button
              onClick={() => speakEnglish(currentWord.en)}
              className="p-3.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:scale-105 active:scale-95 transition-transform"
            >
              <Volume2 className="w-7 h-7" />
            </button>
          </div>

          {/* 單字目標槽位 */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 min-h-[72px]">
            {slots.map((slot, idx) => (
              <div
                key={idx}
                className={`
                  w-12 h-14 sm:w-16 sm:h-20 rounded-2xl border-2 sm:border-4 flex items-center justify-center text-2xl sm:text-4xl font-black uppercase transition-all
                  ${shakingSlot === idx ? 'animate-shake border-rose-500 bg-rose-50' : ''}
                  ${slot 
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/30' 
                    : 'bg-slate-100 dark:bg-slate-800/80 border-dashed border-slate-300 dark:border-slate-600 text-transparent'}
                `}
              >
                {slot ? slot.char : '?'}
              </div>
            ))}
          </div>

          {/* 打散的字母卡片區 */}
          <div className="p-4 sm:p-6 rounded-3xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <p className="text-xs font-bold text-slate-400 mb-3">
              點擊下方字母填入槽位：
            </p>
            <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3.5">
              {letters.map((letter) => (
                <button
                  key={letter.id}
                  disabled={letter.isPlaced || feedback !== null}
                  onClick={() => handleLetterClick(letter)}
                  className={`
                    w-12 h-14 sm:w-16 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-4xl font-black uppercase transition-all
                    ${letter.isPlaced 
                      ? 'opacity-0 scale-50 pointer-events-none' 
                      : 'btn-3d bg-rose-500 hover:bg-rose-400 text-white border-b-4 border-rose-700 active:border-b-0 cursor-pointer shadow-md'}
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
                  <CheckCircle2 className="w-16 h-16 mb-2 animate-bounce" />
                  <span className="text-3xl font-black font-heading">{t.correct}</span>
                </>
              ) : (
                <>
                  <HeartCrack className="w-16 h-16 mb-2 animate-pulse" />
                  <span className="text-2xl font-black font-heading mb-1">{t.heartsDepleted}</span>
                  <p className="text-2xl font-black underline mt-2">{currentWord.en}</p>
                </>
              )}
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
};
