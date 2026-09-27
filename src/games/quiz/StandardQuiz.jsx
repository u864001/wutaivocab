import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useI18n } from '../../context/I18nContext';
import { soundEngine, speakEnglish } from '../../services/audio';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';
import confetti from 'canvas-confetti';
import { ArrowLeft, Volume2, Send, CheckCircle2, XCircle, Trophy, RotateCcw } from 'lucide-react';

export const StandardQuiz = ({
  mode = 'zh-en',
  settings,
  words = [],
  qualifyingBook,
  onBack
}) => {
  const { t } = useI18n();
  const [queue, setQueue] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [isFinished, setIsFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0, streak: 0 });
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const inputRef = useRef(null);

  // 初始化題庫隊列
  useEffect(() => {
    let filtered = words.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
    let shuffled = [...filtered].sort(() => 0.5 - Math.random());
    if (settings.count !== 'all') {
      shuffled = shuffled.slice(0, parseInt(settings.count, 10));
    }
    setQueue(shuffled);
    setCurrentQuestion(shuffled[0] || null);
  }, [settings, words, mode]);

  // 聽力模式自動播放
  useEffect(() => {
    if (hasStarted && mode === 'quiz-listening' && currentQuestion && !isFinished) {
      setTimeout(() => speakEnglish(currentQuestion.en), 300);
    }
  }, [currentQuestion, hasStarted, mode, isFinished]);

  const handleStart = () => {
    if (queue.length === 0) return onBack();
    setHasStarted(true);
    setStartTime(Date.now());
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || feedback) return;

    let isCorrect = false;
    const ans = inputValue.trim().toLowerCase();

    if (mode === 'quiz-zh-en' || mode === 'quiz-listening' || mode === 'quiz-hard') {
      isCorrect = ans === currentQuestion.en.toLowerCase();
    } else if (mode === 'quiz-en-zh') {
      // 容許多重中文翻譯 (以逗號或斜線隔開)
      const inputTargets = ans.split(/[、,，/]/).map(w => w.trim());
      const correctTargets = currentQuestion.zh.split(/[、,，/]/).map(w => w.trim());
      isCorrect = inputTargets.some(u => correctTargets.includes(u));
    }

    if (isCorrect) {
      setFeedback('correct');
      const newStreak = stats.streak + 1;
      setStats(s => ({ ...s, correct: s.correct + 1, streak: newStreak }));
      soundEngine.correct();
      if (newStreak >= 3) soundEngine.combo(newStreak);

      setTimeout(() => moveToNext(true), 900);
    } else {
      setFeedback('wrong');
      setStats(s => ({ ...s, wrong: s.wrong + 1, streak: 0 }));
      soundEngine.wrong();

      setTimeout(() => moveToNext(false), 1800);
    }
  };

  const moveToNext = (wasCorrect) => {
    setFeedback(null);
    setInputValue('');
    inputRef.current?.focus();

    const newQ = [...queue];
    const curr = newQ.shift();

    // 答錯沉底：錯題循環重測機制
    if (!wasCorrect) {
      newQ.push(curr);
    }

    if (newQ.length > 0) {
      setQueue(newQ);
      setCurrentQuestion(newQ[0]);
    } else {
      const finalSec = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(finalSec);
      setIsFinished(true);
      soundEngine.win();
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    }
  };

  // 尚未開始畫面
  if (!hasStarted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full text-center p-8">
          <div className="w-20 h-20 rounded-3xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
            <Volume2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2 font-heading">
            {mode === 'quiz-zh-en' ? t.quizZhEn : mode === 'quiz-en-zh' ? t.quizEnZh : mode === 'quiz-listening' ? t.quizListening : t.quizHard}
          </h2>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-6">
            {t.quizQuestionCountHint.replace('{count}', queue.length)}
          </p>
          <div className="space-y-3">
            <Button3D variant="blue" size="lg" onClick={handleStart} className="w-full">
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

  // 測驗結算畫面
  if (isFinished) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 animate-fadeIn">
        <GlassCard className="max-w-md w-full text-center p-8">
          <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-3 animate-bounce" />
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 font-heading mb-1">
            {t.perfect}
          </h2>
          <p className="text-xs font-bold text-slate-500 mb-6">
            {t.spentTime}：<span className="text-blue-600 font-black text-lg">{elapsedTime} 秒</span>
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {stats.correct}
              </span>
              <p className="text-xs font-bold text-slate-500 mt-1">{t.correctAnswers}</p>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
              <span className="text-3xl font-black text-rose-500">
                {stats.wrong}
              </span>
              <p className="text-xs font-bold text-slate-500 mt-1">{t.retryMistakes}</p>
            </div>
          </div>

          {/* 榮譽榜破紀錄留名判定卡 */}
          <HonorSubmissionCard
            mode={mode}
            book={qualifyingBook}
            score={stats.correct}
            time={elapsedTime}
          />

          <Button3D variant="slate" size="lg" onClick={onBack} className="w-full">
            {t.backLobby}
          </Button3D>
        </GlassCard>
      </div>
    );
  }

  // 測驗進行中畫面
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 flex flex-col items-center">
      {/* 頂部資訊列 */}
      <div className="w-full flex items-center justify-between mb-4">
        <Button3D variant="slate" size="sm" onClick={onBack} icon={ArrowLeft}>
          {t.backLobby}
        </Button3D>
        <span className="text-xs font-black text-slate-500 dark:text-slate-400">
          {t.remaining}{queue.length}
        </span>
      </div>

      {currentQuestion && (
        <GlassCard className="w-full text-center relative overflow-hidden p-8 sm:p-12">
          {/* 連擊 Combo 徽章 */}
          {stats.streak >= 2 && (
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black text-xs shadow-md animate-bounce">
              🔥 Combo x{stats.streak}!
            </div>
          )}

          {/* 題目顯示區域 */}
          <div className="min-h-[160px] flex flex-col items-center justify-center mb-6">
            {mode === 'quiz-zh-en' || mode === 'quiz-hard' ? (
              <h2 className="text-4xl sm:text-5xl font-black text-slate-800 dark:text-slate-100 font-heading">
                {currentQuestion.zh}
              </h2>
            ) : mode === 'quiz-en-zh' ? (
              <h2 className="text-4xl sm:text-5xl font-black text-slate-800 dark:text-slate-100 font-heading">
                {currentQuestion.en}
              </h2>
            ) : mode === 'quiz-listening' ? (
              <button
                type="button"
                onClick={() => speakEnglish(currentQuestion.en)}
                className="w-24 h-24 rounded-full bg-blue-500 hover:bg-blue-400 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <Volume2 className="w-12 h-12" />
              </button>
            ) : null}
          </div>

          {/* 正誤即時遮罩 */}
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
                  <XCircle className="w-16 h-16 mb-2" />
                  <span className="text-2xl font-black font-heading mb-1">{t.wrong}</span>
                  <p className="text-sm font-bold opacity-90">
                    正確答案：<span className="text-xl underline font-black ml-1">{mode === 'quiz-en-zh' ? currentQuestion.zh : currentQuestion.en}</span>
                  </p>
                </>
              )}
            </div>
          )}

          {/* 輸入表單 */}
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-lg mx-auto">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="請輸入答案並按 Enter..."
              disabled={feedback !== null}
              autoComplete="off"
              autoFocus
              className="flex-1 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800 text-xl font-black text-center text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500"
            />
            <Button3D
              type="submit"
              variant="blue"
              size="lg"
              disabled={!inputValue.trim() || feedback !== null}
              icon={Send}
            >
              送出
            </Button3D>
          </form>
        </GlassCard>
      )}
    </div>
  );
};
