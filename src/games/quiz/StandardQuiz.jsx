import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useI18n } from '../../context/I18nContext';
import { soundEngine, speakEnglish } from '../../services/audio';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';
import { getSentenceListeningQuestions, getDialogueQAQuestions } from '../../services/listeningQuestionBank.js';
import confetti from 'canvas-confetti';
import {
  ArrowLeft, Volume2, Send, CheckCircle2, XCircle,
  Trophy, RotateCcw, Headphones, MessageSquare, Sparkles
} from 'lucide-react';

export const StandardQuiz = ({
  mode = 'zh-en',
  settings,
  words = [],
  qualifyingBook,
  onBack
}) => {
  const { t } = useI18n();

  // 聽力三合一膠囊子模式：'word' (單字辨音) | 'sentence' (句子辨句) | 'qa' (情境問答)
  const [listeningSubMode, setListeningSubMode] = useState('word');

  const [queue, setQueue] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [selectedChoiceKey, setSelectedChoiceKey] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0, streak: 0 });
  const [firstAttemptCorrect, setFirstAttemptCorrect] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const inputRef = useRef(null);
  const initialCountRef = useRef(0);
  const historyWordsRef = useRef(new Map());
  const mistakeIdsRef = useRef(new Set());
  const firstAttemptDoneRef = useRef(new Set());
  const repeatFailCountRef = useRef(new Map());

  // 初始化題庫隊列 (支援單字、小鎮生活句子辨句、小鎮生活情境問答)
  useEffect(() => {
    let list = [];

    if (mode === 'quiz-listening') {
      const qCount = settings?.count === 'all' ? 30 : (parseInt(settings?.count, 10) || 20);

      if (listeningSubMode === 'sentence') {
        list = getSentenceListeningQuestions(qCount);
      } else if (listeningSubMode === 'qa') {
        list = getDialogueQAQuestions(qCount);
      } else {
        // 'word' 單字辨音模式
        let filtered = words.filter(w => settings?.selectedUnits?.includes(`${w.book}-${w.lesson}`));
        if (filtered.length === 0 && words.length > 0) {
          filtered = words; // 若未選單元，預設隨機挑選全部單字
        }
        let shuffled = [...filtered].sort(() => 0.5 - Math.random());
        if (settings?.count !== 'all') {
          shuffled = shuffled.slice(0, parseInt(settings?.count, 10) || 20);
        }
        list = shuffled;
      }
    } else {
      let filtered = words.filter(w => settings?.selectedUnits?.includes(`${w.book}-${w.lesson}`));
      let shuffled = [...filtered].sort(() => 0.5 - Math.random());
      if (settings?.count !== 'all') {
        shuffled = shuffled.slice(0, parseInt(settings?.count, 10) || 20);
      }
      list = shuffled;
    }

    setQueue(list);
    initialCountRef.current = list.length;
    historyWordsRef.current.clear();
    mistakeIdsRef.current.clear();
    firstAttemptDoneRef.current.clear();
    repeatFailCountRef.current.clear();
    setFirstAttemptCorrect(0);

    list.forEach(w => {
      historyWordsRef.current.set(w.id, {
        id: w.id,
        en: w.correctEn || w.en,
        zh: w.correctZh || w.zh
      });
    });

    setCurrentQuestion(list[0] || null);
  }, [settings, words, mode, listeningSubMode]);

  // 聽力模式自動播放語音
  useEffect(() => {
    if (hasStarted && mode === 'quiz-listening' && currentQuestion && !isFinished) {
      const textToSpeak = currentQuestion.audioText || currentQuestion.en;
      if (textToSpeak) {
        const timer = setTimeout(() => {
          speakEnglish(textToSpeak);
        }, 320);
        return () => clearTimeout(timer);
      }
    }
  }, [currentQuestion, hasStarted, mode, isFinished]);

  const handleStart = () => {
    if (queue.length === 0) return onBack();
    setHasStarted(true);
    setStartTime(Date.now());
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  // 重新播放當前題目語音
  const handleReplayAudio = useCallback(() => {
    if (!currentQuestion) return;
    const textToSpeak = currentQuestion.audioText || currentQuestion.en;
    if (textToSpeak) {
      speakEnglish(textToSpeak);
    }
  }, [currentQuestion]);

  // 單選題選項點擊處理 (句子辨句、情境問答專用)
  const handleSelectChoice = (option) => {
    if (feedback !== null || !currentQuestion) return;

    setSelectedChoiceKey(option.key);
    const isCorrect = option.isCorrect;
    const qId = currentQuestion.id;

    const isFirstAttempt = !firstAttemptDoneRef.current.has(qId);
    if (isFirstAttempt) {
      firstAttemptDoneRef.current.add(qId);
      if (isCorrect) {
        setFirstAttemptCorrect(prev => prev + 1);
      }
    }

    if (isCorrect) {
      setFeedback('correct');
      const newStreak = stats.streak + 1;
      setStats(s => ({ ...s, correct: s.correct + 1, streak: newStreak }));
      soundEngine.correct();
      if (newStreak >= 3) soundEngine.combo(newStreak);

      setTimeout(() => moveToNext(true), 950);
    } else {
      setFeedback('wrong');
      mistakeIdsRef.current.add(currentQuestion.id);
      setStats(s => ({ ...s, wrong: s.wrong + 1, streak: 0 }));
      soundEngine.wrong();

      setTimeout(() => moveToNext(false), 2100);
    }
  };

  // 文字輸入送出處理 (單字拼寫測驗)
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || feedback) return;

    let isCorrect = false;
    const ans = inputValue.trim().toLowerCase();

    if (mode === 'quiz-zh-en' || mode === 'quiz-listening' || mode === 'quiz-hard') {
      const target = (currentQuestion.correctEn || currentQuestion.en || '').toLowerCase();
      isCorrect = ans === target;
    } else if (mode === 'quiz-en-zh') {
      const inputTargets = ans.split(/[、,，/]/).map(w => w.trim());
      const correctTargets = (currentQuestion.correctZh || currentQuestion.zh || '').split(/[、,，/]/).map(w => w.trim());
      isCorrect = inputTargets.some(u => correctTargets.includes(u));
    }

    const qId = currentQuestion.id;
    const isFirstAttempt = !firstAttemptDoneRef.current.has(qId);
    if (isFirstAttempt) {
      firstAttemptDoneRef.current.add(qId);
      if (isCorrect) {
        setFirstAttemptCorrect(prev => prev + 1);
      }
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
      mistakeIdsRef.current.add(currentQuestion.id);
      setStats(s => ({ ...s, wrong: s.wrong + 1, streak: 0 }));
      soundEngine.wrong();

      setTimeout(() => moveToNext(false), 1800);
    }
  };

  const moveToNext = (wasCorrect) => {
    setFeedback(null);
    setSelectedChoiceKey(null);
    setInputValue('');
    inputRef.current?.focus();

    const newQ = [...queue];
    const curr = newQ.shift();

    // 答錯沉底：錯題循環重測機制 (單題上限3次重試，防無限迴圈卡死)
    if (!wasCorrect && curr) {
      const failCount = (repeatFailCountRef.current.get(curr.id) || 0) + 1;
      repeatFailCountRef.current.set(curr.id, failCount);
      if (failCount < 3) {
        newQ.push(curr);
      }
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
        <GlassCard className="max-w-lg w-full text-center p-6 sm:p-8">
          <div className="w-20 h-20 rounded-3xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
            {mode === 'quiz-listening' ? <Headphones className="w-10 h-10" /> : <Volume2 className="w-10 h-10" />}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 mb-2 font-heading">
            {mode === 'quiz-zh-en'
              ? t.quizZhEn
              : mode === 'quiz-en-zh'
              ? t.quizEnZh
              : mode === 'quiz-listening'
              ? t.quizListening
              : t.quizHard}
          </h2>

          {/* 🌟 聽力測驗專屬：膠囊式切換欄 [🐣 單字辨音 | 🦁 句子辨句 | 💬 情境問答] 🌟 */}
          {mode === 'quiz-listening' && (
            <div className="my-5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 max-w-md mx-auto flex gap-1.5 shadow-inner">
              <button
                type="button"
                onClick={() => setListeningSubMode('word')}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  listeningSubMode === 'word'
                    ? 'bg-blue-600 text-white shadow-md scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>🐣</span>
                <span>單字辨音</span>
              </button>
              <button
                type="button"
                onClick={() => setListeningSubMode('sentence')}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  listeningSubMode === 'sentence'
                    ? 'bg-emerald-600 text-white shadow-md scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>🦁</span>
                <span>句子辨句</span>
              </button>
              <button
                type="button"
                onClick={() => setListeningSubMode('qa')}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  listeningSubMode === 'qa'
                    ? 'bg-indigo-600 text-white shadow-md scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>💬</span>
                <span>情境問答</span>
              </button>
            </div>
          )}

          <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            {mode === 'quiz-listening' && listeningSubMode === 'sentence'
              ? `聆聽小鎮生活英語原音，選出聽到的正確句子 (共 ${queue.length} 題)`
              : mode === 'quiz-listening' && listeningSubMode === 'qa'
              ? `聆聽小鎮在地好友提問，選出最得體的生活答句 (共 ${queue.length} 題)`
              : t.quizQuestionCountHint.replace('{count}', queue.length)}
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
    const isTownListeningMode = mode === 'quiz-listening' && (listeningSubMode === 'sentence' || listeningSubMode === 'qa');
    const rangeDescription = isTownListeningMode
      ? (listeningSubMode === 'sentence' ? '小鎮生活英語句型辨析' : '小鎮生活情境問答挑戰')
      : qualifyingBook
      ? `第 ${qualifyingBook} 冊`
      : settings?.selectedUnits?.slice(0, 3).join(', ');

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
                {firstAttemptCorrect} / {initialCountRef.current || stats.correct}
              </span>
              <p className="text-xs font-bold text-slate-500 mt-1">首次答對 ({Math.round((firstAttemptCorrect / (initialCountRef.current || 1)) * 100)}%)</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
                {mistakeIdsRef.current.size > 0 ? `+${mistakeIdsRef.current.size}` : '0'}
              </span>
              <p className="text-xs font-bold text-slate-500 mt-1">
                {mistakeIdsRef.current.size > 0 ? '完成錯題訂正' : '一次零失誤'}
              </p>
            </div>
          </div>

          {/* 榮譽榜破紀錄留名判定卡與獎狀領取 */}
          <HonorSubmissionCard
            mode={mode}
            book={isTownListeningMode ? null : qualifyingBook}
            score={firstAttemptCorrect}
            time={elapsedTime}
            totalCount={initialCountRef.current || 20}
            rangeText={rangeDescription}
            reviewWords={Array.from(historyWordsRef.current.values()).map(w => ({
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

  // 測驗進行中畫面
  const hasOptions = Array.isArray(currentQuestion?.options) && currentQuestion.options.length > 0;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 flex flex-col items-center">
      {/* 頂部資訊列 */}
      <div className="w-full flex items-center justify-between mb-4">
        <Button3D variant="slate" size="sm" onClick={onBack} icon={ArrowLeft}>
          {t.backLobby}
        </Button3D>

        {/* 聽力模式子標籤徽章 */}
        {mode === 'quiz-listening' && (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-400/30">
            {listeningSubMode === 'sentence' ? '🦁 句子辨句' : listeningSubMode === 'qa' ? '💬 情境問答' : '🐣 單字辨音'}
          </span>
        )}

        <span className="text-xs font-black text-slate-500 dark:text-slate-400">
          {t.remaining}{queue.length}
        </span>
      </div>

      {currentQuestion && (
        <GlassCard className="w-full text-center relative overflow-hidden p-6 sm:p-10">
          {/* 連擊 Combo 徽章 */}
          {stats.streak >= 2 && (
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black text-xs shadow-md animate-bounce">
              🔥 Combo x{stats.streak}!
            </div>
          )}

          {/* 題目與發音顯示區域 */}
          <div className="min-h-[140px] flex flex-col items-center justify-center mb-6">
            {mode === 'quiz-zh-en' || mode === 'quiz-hard' ? (
              <h2 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-slate-100 font-heading">
                {currentQuestion.zh}
              </h2>
            ) : mode === 'quiz-en-zh' ? (
              <h2 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-slate-100 font-heading">
                {currentQuestion.en}
              </h2>
            ) : mode === 'quiz-listening' ? (
              <div className="flex flex-col items-center">
                {/* 題目提示語句 (情境問答或句子辨句) */}
                {currentQuestion.promptZh && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-300/40 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-black mb-3 animate-fadeIn">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{currentQuestion.promptZh}</span>
                  </div>
                )}

                {/* 大圓形朗讀播放按鈕 (點擊重複播放) */}
                <button
                  type="button"
                  onClick={handleReplayAudio}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer relative group"
                  title="點擊重新朗讀發音"
                >
                  <Volume2 className="w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-110 transition-transform" />
                  <span className="absolute -bottom-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white animate-ping" />
                </button>

                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-2.5 flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" />
                  <span>點擊按鈕可隨時重聽語音</span>
                </p>
              </div>
            ) : null}
          </div>

          {/* 🌟 4 大實體觸控卡片選項 (句子辨句、情境問答專用) 🌟 */}
          {hasOptions ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl mx-auto w-full">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedChoiceKey === opt.key;
                const showSuccess = feedback === 'correct' && opt.isCorrect;
                const showWrongSelection = feedback === 'wrong' && isSelected;
                const showAnswerReveal = feedback === 'wrong' && opt.isCorrect;

                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectChoice(opt)}
                    disabled={feedback !== null}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3 relative shadow-md active:scale-98 cursor-pointer ${
                      showSuccess
                        ? 'bg-emerald-500 text-white border-emerald-400 ring-4 ring-emerald-300/50 scale-[1.02]'
                        : showWrongSelection
                        ? 'bg-rose-500 text-white border-rose-400 scale-[0.98]'
                        : showAnswerReveal
                        ? 'bg-emerald-500/90 text-white border-emerald-300 ring-4 ring-emerald-400/60 animate-pulse'
                        : 'bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-xl font-mono font-black text-sm flex items-center justify-center shrink-0 shadow-sm ${
                      showSuccess || showAnswerReveal
                        ? 'bg-white text-emerald-700'
                        : showWrongSelection
                        ? 'bg-white text-rose-700'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}>
                      {opt.key}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm sm:text-base font-black leading-snug break-words ${
                        showSuccess || showWrongSelection || showAnswerReveal
                          ? 'text-white'
                          : 'text-slate-800 dark:text-slate-100'
                      }`}>
                        {opt.textEn}
                      </p>
                      {opt.textZh && (
                        <p className={`text-xs font-bold mt-1 ${
                          showSuccess || showWrongSelection || showAnswerReveal
                            ? 'text-white/85'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {opt.textZh}
                        </p>
                      )}
                    </div>

                    {showSuccess && <CheckCircle2 className="w-5 h-5 text-white shrink-0 animate-bounce" />}
                    {showWrongSelection && <XCircle className="w-5 h-5 text-white shrink-0 animate-pulse" />}
                  </button>
                );
              })}
            </div>
          ) : (
            /* 傳統輸入框表單 (單字拼寫測驗) */
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
          )}

          {/* 正誤即時遮罩 (若為單字拼寫輸入框時顯示) */}
          {!hasOptions && feedback && (
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
                    正確答案：<span className="text-xl underline font-black ml-1">
                      {mode === 'quiz-en-zh' ? currentQuestion.zh : currentQuestion.en}
                    </span>
                  </p>
                </>
              )}
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
};
