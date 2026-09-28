import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { QuizQuestion, PhonicsCard, Language } from '../types/phonics';
import { QUIZ_QUESTIONS } from '../data/phonicsData';
import { PhonicsCardView } from './PhonicsCardView';
import { speakWord, playSuccessChime, playErrorBonk, playCardSnapSound } from '../utils/audio';
import { getT } from '../utils/i18n';
import confetti from 'canvas-confetti';
import {
  Volume2,
  CheckCircle,
  HelpCircle,
  Trophy,
  Star,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';

interface QuizViewProps {
  allCards: PhonicsCard[];
  selectedCardIds: Set<string>;
  lang: Language;
  onReturnToTeaching: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  allCards,
  selectedCardIds,
  lang,
  onReturnToTeaching,
}) => {
  const t = getT(lang);

  // Filter or generate question deck based on selected cards or full curriculum
  const questionPool = useMemo(() => {
    // If teacher selected specific cards, prioritize words using those cards
    if (selectedCardIds.size >= 3) {
      const filtered = QUIZ_QUESTIONS.filter((q) =>
        q.phonemes.some((ph) => {
          const card = allCards.find((c) => c.grapheme === ph);
          return card && selectedCardIds.has(card.id);
        })
      );
      if (filtered.length >= 5) return filtered;
    }
    return QUIZ_QUESTIONS;
  }, [allCards, selectedCardIds]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [stars, setStars] = useState(0);
  const [streak, setStreak] = useState(0);
  const [placedGraphemes, setPlacedGraphemes] = useState<(string | null)[]>([]);
  const [answerStatus, setAnswerStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentQ: QuizQuestion | undefined = questionPool[currentIndex];

  // Helper map from grapheme string to PhonicsCard
  const graphemeToCardMap = useMemo(() => {
    const map = new Map<string, PhonicsCard>();
    allCards.forEach((c) => {
      map.set(c.grapheme, c);
    });
    return map;
  }, [allCards]);

  // Construct options palette (Target phonemes + Distractors) shuffled
  const optionsCards = useMemo(() => {
    if (!currentQ) return [];
    const pool = [...currentQ.phonemes, ...currentQ.distractors];
    // Deterministic shuffle using question ID
    return pool
      .map((grapheme, index) => {
        let card = graphemeToCardMap.get(grapheme);
        if (!card) {
          card = {
            id: `q_opt_${grapheme}_${index}`,
            grapheme,
            displayText: grapheme,
            category: currentQ.categoryHint,
            phonemeSound: `/${grapheme}/`,
          };
        }
        return { ...card, uniqueOptId: `opt_${index}_${grapheme}` };
      })
      .sort(() => Math.random() - 0.5);
  }, [currentQ, graphemeToCardMap]);

  // Track placed cards in slots: array of length currentQ.phonemes.length
  useEffect(() => {
    if (currentQ) {
      setPlacedGraphemes(new Array(currentQ.phonemes.length).fill(null));
      setAnswerStatus('idle');
      setHintMessage(null);
      // Auto-play audio prompt when question loads
      handlePlayPrompt();
    }
  }, [currentIndex, currentQ]);

  const handlePlayPrompt = useCallback(async () => {
    if (!currentQ || isSpeaking) return;
    setIsSpeaking(true);
    await speakWord(currentQ.word, 0.82);
    setIsSpeaking(false);
  }, [currentQ, isSpeaking]);

  // Place a card from candidate tray into the first available empty slot or specific slot
  const handlePlaceCardIntoSlot = (grapheme: string, targetSlot?: number) => {
    if (!currentQ || answerStatus === 'correct') return;
    playCardSnapSound();
    setAnswerStatus('idle');
    setHintMessage(null);

    const updated = [...placedGraphemes];
    if (typeof targetSlot === 'number') {
      updated[targetSlot] = grapheme;
    } else {
      const firstEmpty = updated.findIndex((item) => item === null);
      if (firstEmpty !== -1) {
        updated[firstEmpty] = grapheme;
      }
    }
    setPlacedGraphemes(updated);
  };

  const handleRemoveFromSlot = (slotIndex: number) => {
    if (answerStatus === 'correct') return;
    const updated = [...placedGraphemes];
    updated[slotIndex] = null;
    setPlacedGraphemes(updated);
    setAnswerStatus('idle');
    setHintMessage(null);
  };

  // Check Answer logic
  const handleCheckAnswer = async () => {
    if (!currentQ || placedGraphemes.includes(null)) return;

    const isCorrect = currentQ.phonemes.every(
      (expected, idx) => placedGraphemes[idx] === expected
    );

    if (isCorrect) {
      setAnswerStatus('correct');
      setStars((prev) => prev + 10);
      setStreak((prev) => prev + 1);
      playSuccessChime();

      // Canvas Confetti celebratory fireworks
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'],
        });
      } catch {
        // confetti fallback
      }

      // Pronounce word proudly
      await speakWord(currentQ.word, 0.88);

      // Auto advance after 1.8s
      setTimeout(() => {
        if (currentIndex < questionPool.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setIsCompleted(true);
        }
      }, 1800);
    } else {
      setAnswerStatus('wrong');
      setStreak(0);
      playErrorBonk();

      // Find first mismatched sound and give precise TESOL hint
      const firstWrongIdx = currentQ.phonemes.findIndex(
        (expected, idx) => placedGraphemes[idx] !== expected
      );
      if (firstWrongIdx !== -1) {
        const ordinalEn = ['1st', '2nd', '3rd', '4th', '5th'][firstWrongIdx] || `${firstWrongIdx + 1}th`;
        const ordinalZh = ['第 1 個', '第 2 個', '第 3 個', '第 4 個', '第 5 個'][firstWrongIdx] || `第 ${firstWrongIdx + 1} 個`;
        setHintMessage(
          lang === 'zh'
            ? `提示：注意【${ordinalZh}音素】發音！點擊中央喇叭再聽一次。`
            : `Hint: Listen closely to the [${ordinalEn} sound]! Tap the speaker to listen again.`
        );
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questionPool.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setStars(0);
    setStreak(0);
    setIsCompleted(false);
    setAnswerStatus('idle');
  };

  if (!currentQ) return null;

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-between p-3 sm:p-6 max-w-4xl mx-auto">
      {/* Top Quiz Header / Scoreboard */}
      <div className="w-full flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-xs mb-4">
        {/* Progress */}
        <div className="flex items-center space-x-2">
          <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            {t.questionProgress
              .replace('{current}', String(currentIndex + 1))
              .replace('{total}', String(questionPool.length))}
          </span>
          <div className="w-24 sm:w-36 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questionPool.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Score & Streak */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-amber-500 font-bold text-sm sm:text-base">
            <Star className="w-5 h-5 fill-amber-400" />
            <span>{stars}</span>
          </div>
          {streak > 1 && (
            <div className="flex items-center space-x-1 text-rose-500 font-bold text-xs sm:text-sm px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 animate-pop">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{streak} Streak!</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Dictation Area */}
      <div className="w-full my-auto flex flex-col items-center justify-center space-y-6">
        {/* Central Audio Prompt Speaker Button */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={handlePlayPrompt}
            disabled={isSpeaking}
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-all duration-200 ${
              isSpeaking
                ? 'bg-indigo-700 scale-95 ring-8 ring-indigo-300/40 dark:ring-indigo-700/40 animate-pulse'
                : 'bg-gradient-to-tr from-indigo-500 to-purple-600 hover:scale-105 hover:shadow-indigo-500/30 active:scale-95 animate-pulse-glow'
            }`}
          >
            <Volume2 className="w-12 h-12 mb-1" />
            <span className="text-xs font-bold tracking-wider uppercase">
              {isSpeaking ? 'Playing...' : t.listenAgain}
            </span>
          </button>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {t.quizSubtitle}
          </p>
        </div>

        {/* Elkonin Question Slots [ ? ] [ ? ] [ ? ] */}
        <div
          className={`flex items-center justify-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border-2 transition-all duration-300 ${
            answerStatus === 'correct'
              ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 ring-4 ring-emerald-400/30'
              : answerStatus === 'wrong'
              ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/30 animate-shake'
              : 'border-slate-300 dark:border-slate-700'
          }`}
        >
          {currentQ.phonemes.map((_, slotIdx) => {
            const grapheme = placedGraphemes[slotIdx];
            const card = grapheme ? graphemeToCardMap.get(grapheme) : null;

            return (
              <div
                key={`slot_${slotIdx}`}
                onClick={() => grapheme && handleRemoveFromSlot(slotIdx)}
                className="relative cursor-pointer"
              >
                {grapheme && card ? (
                  <PhonicsCardView
                    card={card}
                    size="lg"
                    showRemove={answerStatus !== 'correct'}
                    onRemove={() => handleRemoveFromSlot(slotIdx)}
                    className={answerStatus === 'correct' ? 'border-emerald-500! ring-2 ring-emerald-400!' : ''}
                  />
                ) : (
                  <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl border-3 border-dashed border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-800/40 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 transition-colors">
                    <HelpCircle className="w-8 h-8 opacity-40 mb-1" />
                    <span className="text-xs font-bold text-slate-400">
                      Sound {slotIdx + 1}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Feedback Messages */}
        {answerStatus === 'correct' && (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base sm:text-lg animate-pop">
            <CheckCircle className="w-6 h-6" />
            <span>{t.correctTitle}</span>
            <span className="text-2xl">{currentQ.emoji}</span>
          </div>
        )}

        {answerStatus === 'wrong' && hintMessage && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-medium animate-pop">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{hintMessage}</span>
          </div>
        )}

        {/* Answer Candidate Cards Tray (Target + Distractors) */}
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="text-center text-xs font-bold text-slate-500 mb-3">
            {lang === 'zh' ? '點擊或拖曳正確的發音卡填入上方空格：' : 'Tap or drag sound tiles into the slots above:'}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {optionsCards.map((opt) => (
              <div key={opt.uniqueOptId}>
                <PhonicsCardView
                  card={opt}
                  size="md"
                  onClick={() => handlePlaceCardIntoSlot(opt.grapheme)}
                  className="hover:scale-106 active:scale-95"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={() => {
            setPlacedGraphemes(new Array(currentQ.phonemes.length).fill(null));
            setAnswerStatus('idle');
            setHintMessage(null);
          }}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{lang === 'zh' ? '重新作答' : 'Reset'}</span>
        </button>

        {answerStatus === 'correct' ? (
          <button
            type="button"
            onClick={handleNextQuestion}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors animate-bounce-small"
          >
            <span>{t.nextQuestion}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={placedGraphemes.includes(null)}
            onClick={handleCheckAnswer}
            className="flex items-center space-x-2 px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base shadow-md transition-colors"
          >
            <span>{t.checkAnswer}</span>
            <CheckCircle className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Quiz Completion Modal */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-pop">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-5">
            <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-500 mx-auto flex items-center justify-center">
              <Trophy className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                {t.quizFinishedTitle}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t.quizScoreMsg}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-around">
              <div>
                <span className="text-xs text-slate-400 font-medium">{t.finalScore}</span>
                <p className="text-2xl font-bold text-amber-500">{stars} ⭐️</p>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
              <div>
                <span className="text-xs text-slate-400 font-medium">{t.accuracy}</span>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">100%</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRestart}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.restartQuiz}</span>
              </button>

              <button
                type="button"
                onClick={onReturnToTeaching}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>{t.backToBoard}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
