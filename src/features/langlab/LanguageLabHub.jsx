import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useStudent } from '../../context/StudentContext';
import { soundEngine, speakEnglish, stopSpeech } from '../../services/audio';
import { MediaBookshelfModal } from './MediaBookshelfModal';
import {
  getUnitListeningQuestions,
  getUnitSpeakingQuestions,
  getBooksSummary
} from '../../services/hereWeGoQuestionBank';
import confetti from 'canvas-confetti';
import {
  ArrowLeft, Volume2, Mic, MicOff, CheckCircle2, XCircle,
  Trophy, Sparkles, BookOpen, ChevronLeft, ChevronRight,
  RotateCcw, Star, Headphones, Disc, Award
} from 'lucide-react';

const BG_IMAGE = '/assets/langlab/bg_language_lab.jpg';
const MENTOR_OWL = '/assets/langlab/mentor_owl.jpg';
const STUDENT_BEAR = '/assets/langlab/student_bear.jpg';

export const LanguageLabHub = ({ onBack }) => {
  const { coins, questPoints, addCoins, addQuestPoints } = useStudent();

  // 當前選定冊次與單元
  const [selectedBook, setSelectedBook] = useState(1);
  const [selectedUnitId, setSelectedUnitId] = useState('b1_u1');
  const [selectedUnitTitle, setSelectedUnitTitle] = useState('Unit 1 What’s Your Name?');
  const [isBookshelfOpen, setIsBookshelfOpen] = useState(false);

  // 模式切換：'listening' (聽力實驗台) | 'speaking' (口說錄音台)
  const [activeMode, setActiveMode] = useState('listening');

  // 題目資料與當前題號
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 聽力題狀態
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [selectedChoiceKey, setSelectedChoiceKey] = useState(null);
  const [scoreStats, setScoreStats] = useState({ correct: 0, wrong: 0, streak: 0 });

  // 口說題狀態
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const [speechResult, setSpeechResult] = useState(null); // { stars: 1|2|3, feedbackText: string, matchScore: number }
  const recognitionRef = useRef(null);

  // 完成結算狀態
  const [isFinished, setIsFinished] = useState(false);

  // 載入題庫
  const loadQuestionBank = useCallback((book, unitId, mode) => {
    setCurrentIndex(0);
    setFeedback(null);
    setSelectedChoiceKey(null);
    setSpeechResult(null);
    setRecordedText('');
    setIsFinished(false);

    if (mode === 'listening') {
      const q = getUnitListeningQuestions(book, unitId, 15);
      setQuestions(q);
    } else {
      const q = getUnitSpeakingQuestions(book, unitId, 10);
      setQuestions(q);
    }
  }, []);

  // 當冊次、單元或模式切換時，重新載入題目
  useEffect(() => {
    loadQuestionBank(selectedBook, selectedUnitId, activeMode);
  }, [selectedBook, selectedUnitId, activeMode, loadQuestionBank]);

  const currentQ = questions[currentIndex] || null;

  // 進入題目時自動播放示範語音
  useEffect(() => {
    if (currentQ && !isFinished) {
      const textToSpeak = currentQ.audioText || currentQ.targetEn || currentQ.en;
      if (textToSpeak) {
        const timer = setTimeout(() => {
          speakEnglish(textToSpeak);
        }, 380);
        return () => clearTimeout(timer);
      }
    }
  }, [currentQ, currentIndex, isFinished]);

  // 重新朗讀
  const handleReplay = useCallback(() => {
    if (!currentQ) return;
    const textToSpeak = currentQ.audioText || currentQ.targetEn || currentQ.en;
    if (textToSpeak) {
      speakEnglish(textToSpeak);
    }
  }, [currentQ]);

  // 切換上一題
  const handlePrevQuestion = () => {
    if (currentIndex <= 0) return;
    soundEngine.click();
    stopSpeech();
    setFeedback(null);
    setSelectedChoiceKey(null);
    setSpeechResult(null);
    setRecordedText('');
    setCurrentIndex(prev => prev - 1);
  };

  // 切換下一題
  const handleNextQuestion = () => {
    soundEngine.click();
    stopSpeech();
    setFeedback(null);
    setSelectedChoiceKey(null);
    setSpeechResult(null);
    setRecordedText('');

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // 完成該單元測驗
      setIsFinished(true);
      soundEngine.win();
      try {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
      if (addCoins) addCoins(1);
      if (addQuestPoints) addQuestPoints(1);
    }
  };

  // ── 聽力題：點選選項 ──
  const handleSelectChoice = (opt) => {
    if (feedback !== null || !currentQ) return;
    setSelectedChoiceKey(opt.key);

    if (opt.isCorrect) {
      setFeedback('correct');
      const newStreak = scoreStats.streak + 1;
      setScoreStats(s => ({ ...s, correct: s.correct + 1, streak: newStreak }));
      soundEngine.correct();
      if (newStreak >= 3) soundEngine.combo(newStreak);

      setTimeout(() => {
        handleNextQuestion();
      }, 1200);
    } else {
      setFeedback('wrong');
      setScoreStats(s => ({ ...s, wrong: s.wrong + 1, streak: 0 }));
      soundEngine.wrong();
    }
  };

  // ── 口說題：啟動 Web Speech API 錄音辨識 ──
  const handleStartSpeaking = () => {
    stopSpeech();
    soundEngine.click();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // 瀏覽器不支援時，優雅給予示範與自評
      setSpeechResult({
        stars: 3,
        feedbackText: '您的瀏覽器已播放標準美語發音！跟讀練習完成！',
        matchScore: 100
      });
      soundEngine.correct();
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const rec = new SpeechRecognition();
      rec.lang = 'en-US';
      rec.continuous = false;
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setIsRecording(true);
        setSpeechResult(null);
        setRecordedText('');
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setRecordedText(transcript);

        // 比對吻合度 (精準文字與單字群覆蓋比率)
        const targetClean = (currentQ?.targetEn || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
        const userClean = transcript.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

        const targetWords = targetClean.split(/\s+/);
        const userWords = userClean.split(/\s+/);
        const matchedWords = targetWords.filter(w => userWords.includes(w));
        const matchRatio = matchedWords.length / Math.max(1, targetWords.length);

        if (matchRatio >= 0.8 || targetClean === userClean) {
          setSpeechResult({ stars: 3, feedbackText: '⭐⭐⭐ Perfect! 發音無懈可擊！', matchScore: Math.round(matchRatio * 100) });
          soundEngine.win();
          try { confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } }); } catch (e) {}
        } else if (matchRatio >= 0.45) {
          setSpeechResult({ stars: 2, feedbackText: '⭐⭐ Good job! 發音很清晰，再接再厲！', matchScore: Math.round(matchRatio * 100) });
          soundEngine.correct();
        } else {
          setSpeechResult({ stars: 1, feedbackText: '⭐ 聽示範音再試一次，大聲說出來！', matchScore: Math.round(matchRatio * 100) });
          soundEngine.wrong();
        }
      };

      rec.onerror = (e) => {
        console.warn('SpeechRecognition error:', e);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
      setIsRecording(false);
    }
  };

  // 書籍櫃選中單元回呼
  const handleSelectUnitFromBookshelf = (bookNum, unitId, unitTitle) => {
    setSelectedBook(bookNum);
    setSelectedUnitId(unitId);
    setSelectedUnitTitle(unitTitle);
    setIsBookshelfOpen(false);
  };

  return (
    <div className="relative w-full max-w-[1720px] mx-auto px-2 sm:px-4 py-2 animate-fadeIn flex flex-col items-center select-none">
      
      {/* ── 16:9 全景視聽語言教室舞台容器 (Widescreen 16:9 Stage) ── */}
      <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-600/60 bg-slate-950">
        
        {/* 教室全景底圖 */}
        <img
          src={BG_IMAGE}
          alt="視聽語言教室"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.03]"
        />

        {/* 頂部輕量化懸浮導航 HUD */}
        <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 z-30 px-3 sm:px-5 py-2 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-between gap-2 shadow-lg">
          
          {/* 左：返回鍵與標題 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                stopSpeech();
                soundEngine.click();
                if (onBack) onBack();
              }}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black flex items-center gap-1 shadow-md active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">回首頁</span>
            </button>
            <span className="text-xs sm:text-base font-black font-heading text-amber-200 drop-shadow">
              🏫 視聽語言教室
            </span>
          </div>

          {/* 中：模式膠囊切換 [🎧 聽力實驗台 | 🎙️ 口說錄音台] */}
          <div className="flex p-1 rounded-xl bg-black/40 border border-white/15">
            <button
              onClick={() => {
                soundEngine.click();
                setActiveMode('listening');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                activeMode === 'listening'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>聽力台</span>
            </button>
            <button
              onClick={() => {
                soundEngine.click();
                setActiveMode('speaking');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                activeMode === 'speaking'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>口說台</span>
            </button>
          </div>

          {/* 右：影音書籍櫃按鈕 + 金幣與積分 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.click();
                setIsBookshelfOpen(true);
              }}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 border border-amber-400/50 cursor-pointer animate-pulse"
              title="點選影音書籍櫃更換冊次與單元"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-200" />
              <span className="font-heading">影音書籍櫃</span>
            </button>
          </div>
        </div>

        {/* ── 核心教學互動舞台 (黑板投影區 + 人物立牌 + 觸控控制台) ── */}
        <div className="absolute inset-0 pt-16 sm:pt-20 pb-4 px-3 sm:px-8 flex items-center justify-between gap-4">
          
          {/* 左側：人物立牌滑入滑出展示 (貓頭鷹助教 vs 台灣黑熊學伴) */}
          <div className="hidden lg:flex flex-col items-center justify-end w-72 h-full pb-2 shrink-0 transition-transform duration-500 transform">
            <div className="relative group animate-slideUp">
              {/* 人物語音對話氣泡 */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 p-2.5 rounded-2xl bg-slate-900/90 border border-amber-400/80 text-white text-xs font-bold shadow-xl text-center backdrop-blur-md">
                <span className="text-amber-300 font-black">
                  {activeMode === 'listening' ? '🦉 貓頭鷹助教：' : '🐻 黑熊學伴：'}
                </span>
                <p className="text-[11px] text-slate-200 mt-0.5">
                  {activeMode === 'listening'
                    ? '戴好耳機，仔細聽發音，選出正確的卡片！'
                    : '跟著我大聲說出來！點擊麥克風開始錄音！'}
                </p>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-900/90" />
              </div>

              {/* 人物立牌圖像 */}
              <img
                src={activeMode === 'listening' ? MENTOR_OWL : STUDENT_BEAR}
                alt="導師立牌"
                className="w-56 h-auto max-h-[50vh] object-contain drop-shadow-2xl transition-all duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* 中央/主要區域：大黑板題目投影幕 + 答題控制台 */}
          <div className="flex-1 max-w-3xl h-full flex flex-col justify-between py-1 sm:py-2">
            
            {/* 1. 黑板頂部資訊：當前冊次、單元、進度、上下題 */}
            <div className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-amber-500/40 text-white shadow-md">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/30 text-amber-300 font-mono font-black text-xs">
                  B{selectedBook}
                </span>
                <span className="text-xs sm:text-sm font-black font-heading truncate max-w-[200px] sm:max-w-xs text-slate-100">
                  {selectedUnitTitle}
                </span>
              </div>

              {/* 上一題 / 下一題 控制鈕 */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-bold text-amber-400 mr-2">
                  {currentIndex + 1} / {questions.length}
                </span>
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentIndex === 0}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white cursor-pointer"
                  title="上一題"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                  title="下一題"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. 黑板中央內容區 */}
            {currentQ && !isFinished ? (
              <GlassCard className="w-full flex-1 my-2 p-4 sm:p-6 text-center flex flex-col items-center justify-center relative overflow-hidden bg-slate-900/85 border-2 border-emerald-500/40 shadow-2xl">
                
                {activeMode === 'listening' ? (
                  /* ── 聽力施測介面 ── */
                  <div className="w-full flex flex-col items-center">
                    {/* 提示與重播大喇叭按鈕 */}
                    <p className="text-xs text-amber-300 font-bold mb-3 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{currentQ.promptZh}</span>
                    </p>

                    <button
                      type="button"
                      onClick={handleReplay}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white flex items-center justify-center shadow-xl active:scale-95 transition-transform cursor-pointer mb-4"
                      title="點擊重聽發音"
                    >
                      <Volume2 className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
                    </button>

                    {/* 4 大實體觸控卡片 (A, B, C, D) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-xl">
                      {(currentQ.options || []).map((opt) => {
                        const isSelected = selectedChoiceKey === opt.key;
                        const isCorrect = opt.isCorrect;
                        const showCorrect = feedback === 'correct' && isCorrect;
                        const showWrong = feedback === 'wrong' && isSelected;
                        const showReveal = feedback === 'wrong' && isCorrect;

                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => handleSelectChoice(opt)}
                            disabled={feedback !== null}
                            className={`p-3 rounded-2xl border-2 text-left transition-all flex items-start gap-2.5 cursor-pointer shadow-md ${
                              showCorrect || showReveal
                                ? 'bg-emerald-500 text-white border-emerald-400 ring-2 ring-emerald-300'
                                : showWrong
                                ? 'bg-rose-500 text-white border-rose-400'
                                : 'bg-slate-800/90 border-slate-700 hover:border-blue-400 text-slate-100'
                            }`}
                          >
                            <span className={`w-7 h-7 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 ${
                              showCorrect || showReveal
                                ? 'bg-white text-emerald-700'
                                : showWrong
                                ? 'bg-white text-rose-700'
                                : 'bg-slate-700 text-slate-200'
                            }`}>
                              {opt.key}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-black leading-snug break-words">
                                {opt.textEn}
                              </p>
                              {opt.textZh && (
                                <p className="text-[11px] opacity-80 mt-0.5">
                                  {opt.textZh}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* ── 口說施測介面 ── */
                  <div className="w-full flex flex-col items-center">
                    <span className="text-xs font-mono font-bold text-rose-300 mb-1">
                      {currentQ.speaker && currentQ.speaker !== 'Character' ? `${currentQ.speaker} 說：` : '跟讀目標句：'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white font-heading mb-1 text-center px-4">
                      {currentQ.targetEn || currentQ.en}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-amber-300/90 mb-4">
                      {currentQ.targetZh || currentQ.zh}
                    </p>

                    {/* 聽示範與錄音按鈕 */}
                    <div className="flex items-center gap-3 mb-4">
                      <button
                        type="button"
                        onClick={handleReplay}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Volume2 className="w-4 h-4 text-blue-400" />
                        <span>示範發音</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleStartSpeaking}
                        disabled={isRecording}
                        className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-xl cursor-pointer active:scale-95 transition-all ${
                          isRecording
                            ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-400/50'
                            : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white'
                        }`}
                      >
                        <Mic className="w-5 h-5" />
                        <span>{isRecording ? '聆聽中，請說話...' : '按住開始錄音'}</span>
                      </button>
                    </div>

                    {/* 口說評等星星與反饋 */}
                    {speechResult && (
                      <div className="p-3 rounded-2xl bg-black/60 border border-white/20 text-center animate-scaleUp max-w-md w-full">
                        <div className="flex justify-center gap-1 mb-1">
                          {[1, 2, 3].map(st => (
                            <Star
                              key={st}
                              className={`w-6 h-6 ${
                                st <= speechResult.stars
                                  ? 'text-amber-400 fill-amber-400 animate-bounce'
                                  : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs sm:text-sm font-black text-white">
                          {speechResult.feedbackText}
                        </p>
                        {recordedText && (
                          <p className="text-[11px] text-slate-300 mt-1 italic">
                            偵測發音："{recordedText}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </GlassCard>
            ) : isFinished ? (
              /* ── 完成測驗結算畫面 ── */
              <GlassCard className="w-full flex-1 my-2 p-6 text-center flex flex-col items-center justify-center bg-slate-900/90 border-2 border-amber-500/50">
                <Trophy className="w-16 h-16 text-amber-400 mb-2 animate-bounce" />
                <h3 className="text-2xl font-black text-white font-heading">
                  恭喜完成本單元雙語聽說特訓！
                </h3>
                <p className="text-xs text-amber-300 font-bold mt-1 mb-4">
                  已精熟 {selectedUnitTitle} • 獲得宇宙金幣 +1、榮譽探索積分 +1！
                </p>
                <div className="flex gap-3">
                  <Button3D
                    variant="emerald"
                    size="md"
                    onClick={() => loadQuestionBank(selectedBook, selectedUnitId, activeMode)}
                  >
                    再練一次
                  </Button3D>
                  <Button3D
                    variant="amber"
                    size="md"
                    onClick={() => setIsBookshelfOpen(true)}
                  >
                    選擇下一單元
                  </Button3D>
                </div>
              </GlassCard>
            ) : null}
          </div>
        </div>
      </div>

      {/* ── 影音書籍櫃 (Media Bookshelf) 模態窗 ── */}
      {isBookshelfOpen && (
        <MediaBookshelfModal
          currentBook={selectedBook}
          currentUnitId={selectedUnitId}
          onSelectUnit={handleSelectUnitFromBookshelf}
          onClose={() => setIsBookshelfOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageLabHub;
