import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useStudent } from '../../context/StudentContext';
import { soundEngine, speakEnglish, stopSpeech } from '../../services/audio';
import { MediaBookshelfModal } from './MediaBookshelfModal';
import {
  getBooksSummary,
  getUnitListeningQuestions,
  getUnitSpeakingQuestions,
  getAlphabetListeningQuestions,
  getAlphabetSpeakingQuestions,
  getGradeListeningQuestions,
  getGradeSpeakingQuestions
} from '../../services/hereWeGoQuestionBank';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';
import confetti from 'canvas-confetti';
import {
  ArrowLeft, Volume2, Mic, MicOff, CheckCircle2, XCircle, X,
  Trophy, Sparkles, BookOpen, RotateCcw, Star, Headphones, Film,
  Play, Eye, EyeOff, ChevronRight, Award, Flame, Clock, RefreshCw,
  Video, Music, VolumeX, ShieldCheck
} from 'lucide-react';
import { UNIT_VIDEO_LIBRARY } from '../../data/unitVideoQuestionData';
import { YouTubeClipPlayer } from '../../components/common/YouTubeClipPlayer';

const BG_IMAGE = '/assets/langlab/bg_language_lab.jpg';
const MENTOR_OWL = '/assets/langlab/mentor_owl_standee.webp';
const STUDENT_BEAR = '/assets/langlab/student_bear_standee.webp';

export const LanguageLabHub = ({ onBack }) => {
  const { coins, questPoints, addCoins, addQuestPoints } = useStudent();

  // ── 畫面導航狀態機 ──
  // 'main_menu': 貓頭鷹迎接，三大由上而下主入口 (聽力測驗 / 口說測驗 / 影音播放)
  // 'grade_select': 次級年級選擇 (低年級字母 / 中年級 / 高年級 / 自選單元)
  // 'quiz': 15 題作答實施台 (聽力 Kahoot! 風格 / 口說跟讀)
  // 'video_room': 影音放映專區 (全片播放 / 微秒選答)
  // 'settlement': 15 題成績結算與榮譽榜
  const [viewState, setViewState] = useState('main_menu');

  // 當前測驗模式：'listening' | 'speaking'
  const [activeMode, setActiveMode] = useState('listening');

  // 當前挑戰分類標籤與 ID
  const [currentChallengeInfo, setCurrentChallengeInfo] = useState({
    id: 'alpha_upper',
    title: '低年級 • 大寫字母',
    badge: '字母辨析'
  });

  // 書架自選單元狀態
  const [selectedBook, setSelectedBook] = useState(1);
  const [selectedUnitId, setSelectedUnitId] = useState('b1_u1');
  const [selectedUnitTitle, setSelectedUnitTitle] = useState('Unit 1 What’s Your Name?');
  const [isBookshelfOpen, setIsBookshelfOpen] = useState(false);

  // 中文翻譯提示開關 (預設關閉，專注英語)
  const [showChinese, setShowChinese] = useState(false);

  // 背景音樂狀態
  const [isBgmPlaying, setIsBgmPlaying] = useState(() => soundEngine.isSceneBgmActive());

  // 進入教室自動啟動環境音樂，退出停止
  useEffect(() => {
    soundEngine.startSceneBgm('school');
    setIsBgmPlaying(soundEngine.isSceneBgmActive());
    return () => {
      stopSpeech();
      soundEngine.stopSceneBgm();
    };
  }, []);

  const handleToggleBgm = () => {
    const active = soundEngine.toggleSceneBgm('school');
    setIsBgmPlaying(active);
  };

  // ── 測驗題目與答題狀態 ──
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 聽力題回饋狀態：null (未答) | 'correct' (正確) | 'wrong' (錯誤)
  const [feedback, setFeedback] = useState(null);
  const [selectedChoiceKey, setSelectedChoiceKey] = useState(null);
  const [scoreStats, setScoreStats] = useState({ correct: 0, wrong: 0, streak: 0 });

  // 3 秒自動倒數進度條 (0 ~ 100) 與秒數
  const [autoNextProgress, setAutoNextProgress] = useState(100);
  const autoNextTimerRef = useRef(null);

  // 口說題狀態
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const [speechResult, setSpeechResult] = useState(null); // { stars: 1|2|3, feedbackText: string, matchScore: number }
  const recognitionRef = useRef(null);

  // 影音專區狀態
  const [videoPlayMode, setVideoPlayMode] = useState('full'); // 'full' (全片觀賞) | 'clips' (微秒挑戰)
  const [selectedVideoId, setSelectedVideoId] = useState('halloween_movie_yt');

  const currentQ = questions[currentIndex] || null;

  // 進入主選單時貓頭鷹語音問候
  useEffect(() => {
    if (viewState === 'main_menu') {
      const timer = setTimeout(() => {
        speakEnglish("Welcome to the Language Lab! What would you like to practice today?");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [viewState]);

  // 切換到新題目時自動播放發音 (若在聽力模式)
  useEffect(() => {
    if (viewState === 'quiz' && activeMode === 'listening' && currentQ) {
      const timer = setTimeout(() => {
        speakEnglish(currentQ.audioText || currentQ.correctEn);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, viewState, activeMode]);

  // 清除倒數計時器
  const clearAutoNextTimer = useCallback(() => {
    if (autoNextTimerRef.current) {
      clearInterval(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
    }
    setAutoNextProgress(100);
  }, []);

  // 卸載時清除倒數計時器
  useEffect(() => {
    return () => clearAutoNextTimer();
  }, [clearAutoNextTimer]);

  // ── 載入 15 題題目並啟動測驗 ──
  const startChallenge = (mode, challengeId, title, badge, customBook = null, customUnit = null) => {
    soundEngine.click();
    clearAutoNextTimer();
    stopSpeech();

    setActiveMode(mode);
    setCurrentChallengeInfo({ id: challengeId, title, badge });
    setCurrentIndex(0);
    setFeedback(null);
    setSelectedChoiceKey(null);
    setSpeechResult(null);
    setRecordedText('');
    setScoreStats({ correct: 0, wrong: 0, streak: 0 });

    let qList = [];
    const count = 15;

    if (challengeId === 'alpha_upper') {
      qList = mode === 'listening' ? getAlphabetListeningQuestions('upper', count) : getAlphabetSpeakingQuestions('upper', count);
    } else if (challengeId === 'alpha_lower') {
      qList = mode === 'listening' ? getAlphabetListeningQuestions('lower', count) : getAlphabetSpeakingQuestions('lower', count);
    } else if (challengeId === 'alpha_mixed') {
      qList = mode === 'listening' ? getAlphabetListeningQuestions('mixed', count) : getAlphabetSpeakingQuestions('mixed', count);
    } else if (challengeId === 'grade_g3') {
      qList = mode === 'listening' ? getGradeListeningQuestions('g3', count) : getGradeSpeakingQuestions('g3', count);
    } else if (challengeId === 'grade_g4') {
      qList = mode === 'listening' ? getGradeListeningQuestions('g4', count) : getGradeSpeakingQuestions('g4', count);
    } else if (challengeId === 'grade_g5') {
      qList = mode === 'listening' ? getGradeListeningQuestions('g5', count) : getGradeSpeakingQuestions('g5', count);
    } else if (challengeId === 'grade_g6') {
      qList = mode === 'listening' ? getGradeListeningQuestions('g6', count) : getGradeSpeakingQuestions('g6', count);
    } else if (challengeId === 'grade_jh') {
      qList = mode === 'listening' ? getGradeListeningQuestions('jh', count) : getGradeSpeakingQuestions('jh', count);
    } else if (challengeId === 'custom_unit') {
      const b = customBook || selectedBook;
      const u = customUnit || selectedUnitId;
      qList = mode === 'listening' ? getUnitListeningQuestions(b, u, count) : getUnitSpeakingQuestions(b, u, count);
    }

    setQuestions(qList);
    setViewState('quiz');
  };

  // ── 切換下一題或進入結算 ──
  const handleNextQuestion = () => {
    clearAutoNextTimer();
    stopSpeech();
    soundEngine.click();

    setFeedback(null);
    setSelectedChoiceKey(null);
    setSpeechResult(null);
    setRecordedText('');

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // 15 題全部完成 ➔ 進入結算
      handleFinishQuiz();
    }
  };

  // ── 結算獎勵與成就 ──
  const handleFinishQuiz = () => {
    clearAutoNextTimer();
    stopSpeech();
    soundEngine.win();

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    const total = Math.max(1, questions.length);
    const correct = scoreStats.correct;
    const ratio = correct / total;

    // 依正確率給予金幣與學分
    if (ratio >= 0.8) {
      if (addCoins) addCoins(3);
      if (addQuestPoints) addQuestPoints(5);
    } else if (ratio >= 0.6) {
      if (addCoins) addCoins(2);
      if (addQuestPoints) addQuestPoints(3);
    } else {
      if (addCoins) addCoins(1);
      if (addQuestPoints) addQuestPoints(1);
    }

    setViewState('settlement');
  };

  // ── 聽力題：點選選項 (Kahoot! 即時紅綠回饋 + 3 秒自動下一題) ──
  const handleSelectChoice = (opt) => {
    if (feedback !== null || !currentQ) return;
    clearAutoNextTimer();
    setSelectedChoiceKey(opt.key);

    const isCorrect = opt.isCorrect;

    if (isCorrect) {
      setFeedback('correct');
      const newStreak = scoreStats.streak + 1;
      setScoreStats(s => ({ ...s, correct: s.correct + 1, streak: newStreak }));
      soundEngine.correct();
      if (newStreak >= 3) soundEngine.combo(newStreak);
    } else {
      setFeedback('wrong');
      setScoreStats(s => ({ ...s, wrong: s.wrong + 1, streak: 0 }));
      soundEngine.wrong();
    }

    // 啟動 3 秒倒數計時條，3 秒後自動切換下一題 (亦可提早手動點擊下一題按鈕)
    const startTime = Date.now();
    const duration = 3000;
    autoNextTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPercent = Math.max(0, 100 - (elapsed / duration) * 100);
      setAutoNextProgress(remainingPercent);

      if (elapsed >= duration) {
        clearAutoNextTimer();
        handleNextQuestion();
      }
    }, 50);
  };

  // ── 口說題：啟動語音辨識 ──
  const handleStartSpeaking = () => {
    stopSpeech();
    soundEngine.click();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
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
        soundEngine.pauseSceneBgm();
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setRecordedText(transcript);

        const targetClean = (currentQ?.targetEn || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
        const userClean = transcript.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

        const targetWords = targetClean.split(/\s+/);
        const userWords = userClean.split(/\s+/);
        const matchedWords = targetWords.filter(w => userWords.includes(w));
        const matchRatio = matchedWords.length / Math.max(1, targetWords.length);

        if (matchRatio >= 0.8 || targetClean === userClean) {
          setSpeechResult({ stars: 3, feedbackText: '⭐⭐⭐ Perfect! 發音無懈可擊！', matchScore: Math.round(matchRatio * 100) });
          soundEngine.win();
          setScoreStats(s => ({ ...s, correct: s.correct + 1 }));
          try { confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } }); } catch (e) {}
        } else if (matchRatio >= 0.45) {
          setSpeechResult({ stars: 2, feedbackText: '⭐⭐ Good job! 發音很清晰，再接再厲！', matchScore: Math.round(matchRatio * 100) });
          soundEngine.correct();
          setScoreStats(s => ({ ...s, correct: s.correct + 1 }));
        } else {
          setSpeechResult({ stars: 1, feedbackText: '⭐ 聽示範音再試一次，大聲說出來！', matchScore: Math.round(matchRatio * 100) });
          soundEngine.wrong();
          setScoreStats(s => ({ ...s, wrong: s.wrong + 1 }));
        }
      };

      rec.onerror = (e) => {
        console.warn('SpeechRecognition error:', e);
        setIsRecording(false);
        soundEngine.resumeSceneBgm();
      };

      rec.onend = () => {
        setIsRecording(false);
        soundEngine.resumeSceneBgm();
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
      setIsRecording(false);
    }
  };

  // 重聽題目示範發音
  const handlePlayCurrentAudio = () => {
    soundEngine.click();
    speakEnglish(currentQ?.audioText || currentQ?.correctEn || currentQ?.targetEn);
  };

  // 自選書架確認單元
  const handleSelectUnitFromBookshelf = (bookNum, unitId, unitTitle) => {
    setSelectedBook(bookNum);
    setSelectedUnitId(unitId);
    setSelectedUnitTitle(unitTitle);
    setIsBookshelfOpen(false);
    startChallenge(activeMode, 'custom_unit', `自選 • B${bookNum} ${unitTitle}`, `Book ${bookNum}`, bookNum, unitId);
  };

  const activeVideo = UNIT_VIDEO_LIBRARY.find(v => v.id === selectedVideoId) || UNIT_VIDEO_LIBRARY[0];

  return (
    <div className="relative w-full max-w-[1720px] mx-auto px-2 sm:px-4 py-2 animate-fadeIn flex flex-col items-center select-none">
      
      {/* ── 全景視聽語言教室主舞台容器 ── */}
      <div className="relative w-full min-h-[580px] md:min-h-[660px] md:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-600/60 bg-slate-950 flex flex-col">
        
        {/* 教室全景底圖 */}
        <img
          src={BG_IMAGE}
          alt="視聽語言教室"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-slate-950/60 pointer-events-none" />

        {/* ── 頂部極簡導航 HUD ── */}
        <div className="relative z-30 px-3 sm:px-6 py-3 bg-slate-950/80 backdrop-blur-md border-b border-white/15 text-white flex items-center justify-between gap-3 shadow-lg shrink-0">
          
          {/* 左側：返回上一層與關卡名稱 */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                stopSpeech();
                soundEngine.click();
                clearAutoNextTimer();
                if (viewState === 'main_menu') {
                  if (onBack) onBack();
                } else if (viewState === 'grade_select') {
                  setViewState('main_menu');
                } else if (viewState === 'quiz') {
                  setViewState('grade_select');
                } else if (viewState === 'video_room') {
                  setViewState('main_menu');
                } else if (viewState === 'settlement') {
                  setViewState('grade_select');
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer border border-white/15 transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>{viewState === 'main_menu' ? '回小鎮' : '回選單'}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-lg font-black font-heading text-amber-200 drop-shadow">
                🏫 雙語聽說探險館
              </span>
              {viewState === 'quiz' && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-black hidden sm:inline">
                  {currentChallengeInfo.title}
                </span>
              )}
            </div>
          </div>

          {/* 右側：金幣、學分與 BGM 控制 */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-black/40 border border-white/15 text-xs font-black">
              <span className="text-amber-300 flex items-center gap-1">🪙 {coins}</span>
              <span className="text-emerald-300 flex items-center gap-1">💎 {questPoints}</span>
            </div>

            <button
              onClick={handleToggleBgm}
              className={`p-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                isBgmPlaying 
                  ? 'bg-emerald-600/30 text-emerald-300 border-emerald-400/40 hover:bg-emerald-600/40' 
                  : 'bg-stone-800/80 text-stone-400 border-stone-600 hover:text-white'
              }`}
              title="開關教室背景音樂"
            >
              {isBgmPlaying ? <Music className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* ── 舞臺核心互動區 ── */}
        <div className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 flex flex-col justify-center items-center overflow-y-auto">

          {/* ════════════════════════════════════════════════════════════════
              【狀態一：主選單 (main_menu)】貓頭鷹引導 + 由上而下三大功能
             ════════════════════════════════════════════════════════════════ */}
          {viewState === 'main_menu' && (
            <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 animate-fadeIn my-auto">
              
              {/* 貓頭鷹導師立繪與問候 */}
              <div className="flex flex-col items-center shrink-0">
                <img
                  src={MENTOR_OWL}
                  alt="Mentor Owl"
                  className="w-36 h-36 sm:w-48 sm:h-48 md:w-60 md:h-60 object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] animate-float"
                />
                <div className="mt-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-black shadow-lg flex items-center gap-2">
                  <span>🦉</span>
                  <span>貓頭鷹導師 (Mentor Owl)</span>
                </div>
              </div>

              {/* 右側：由上而下清爽三大主入口 */}
              <div className="w-full max-w-md flex flex-col gap-3 sm:gap-4">
                
                {/* 導師對話氣泡 */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/85 backdrop-blur-md border-2 border-amber-400/40 text-white shadow-xl">
                  <p className="text-xs sm:text-sm text-amber-300 font-bold leading-relaxed">
                    "Welcome! What would you like to practice today?"
                  </p>
                  <p className="text-xs sm:text-sm font-black text-white mt-1">
                    歡迎來到雙語聽說探險館！請選擇今天的學習項目：
                  </p>
                </div>

                {/* 1. 聽力測驗入口 */}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.click();
                    setActiveMode('listening');
                    setViewState('grade_select');
                  }}
                  className="group w-full p-4 rounded-2xl bg-gradient-to-r from-blue-900/85 to-indigo-900/85 hover:from-blue-800 hover:to-indigo-800 border-2 border-blue-400/50 hover:border-blue-300 shadow-xl transition-all duration-200 cursor-pointer text-left flex items-center gap-4 active:scale-98"
                >
                  <div className="w-13 h-13 rounded-2xl bg-blue-600/30 border border-blue-400/50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shrink-0">
                    🎧
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-black text-blue-200 font-heading">
                        聽力測驗 (Listening Quiz)
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold">
                        15 題特訓
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-bold mt-1">
                      包含低年級字母聽音、中高年級生活會話，訓練敏銳英語耳！
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-blue-300 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                {/* 2. 口說測驗入口 */}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.click();
                    setActiveMode('speaking');
                    setViewState('grade_select');
                  }}
                  className="group w-full p-4 rounded-2xl bg-gradient-to-r from-rose-900/85 to-pink-900/85 hover:from-rose-800 hover:to-pink-800 border-2 border-rose-400/50 hover:border-rose-300 shadow-xl transition-all duration-200 cursor-pointer text-left flex items-center gap-4 active:scale-98"
                >
                  <div className="w-13 h-13 rounded-2xl bg-rose-600/30 border border-rose-400/50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shrink-0">
                    🎙️
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-black text-rose-200 font-heading">
                        口說測驗 (Speaking Challenge)
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                        AI 即時評測
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-bold mt-1">
                      大聲開口念出字母與句子，黑熊學伴與 AI 星級即時評分！
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-rose-300 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                {/* 3. 影音播放專區 */}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.click();
                    setViewState('video_room');
                  }}
                  className="group w-full p-4 rounded-2xl bg-gradient-to-r from-amber-900/85 to-orange-900/85 hover:from-amber-800 hover:to-orange-800 border-2 border-amber-400/50 hover:border-amber-300 shadow-xl transition-all duration-200 cursor-pointer text-left flex items-center gap-4 active:scale-98"
                >
                  <div className="w-13 h-13 rounded-2xl bg-amber-600/30 border border-amber-400/50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shrink-0">
                    🎬
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-black text-amber-200 font-heading">
                        影音播放 (Video Screening Room)
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                        微電影放映
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-bold mt-1">
                      萬聖節微電影與課文動畫短片，全片播放與情境對話選答！
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-amber-300 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              【狀態二：年級選擇 (grade_select)】次級年級分類快速選單
             ════════════════════════════════════════════════════════════════ */}
          {viewState === 'grade_select' && (
            <div className="w-full max-w-4xl flex flex-col items-center animate-fadeIn my-auto">
              
              {/* 導師引導語 */}
              <div className="w-full p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/20 text-center mb-4 flex items-center justify-center gap-3">
                <span className="text-2xl">🦉</span>
                <span className="text-sm sm:text-base font-black text-amber-200">
                  {activeMode === 'listening' ? '🎧 聽力測驗' : '🎙️ 口說測驗'}：請選擇年級程度或自選單元，系統將隨機抽 15 題開始挑戰！
                </span>
              </div>

              {/* 四大年級程度區塊 */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                
                {/* 1. 低年級專區 (大寫、小寫、大小寫混合) */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-900/90 border-2 border-emerald-500/40 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-base font-black text-emerald-200 font-heading flex items-center gap-2">
                        <span>🌱</span>
                        <span>低年級 • 字母特訓 (Alphabet)</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                        聽音選字
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-bold mb-3">
                      聽字母發音，選出正確字母卡片 (保證不重複同字母大小寫)。
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => startChallenge(activeMode, 'alpha_upper', '低年級 • 大寫字母', 'A-Z')}
                      className="py-2.5 px-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white font-black text-xs text-center shadow-md active:scale-95 transition-all cursor-pointer border border-emerald-400/50"
                    >
                      🔠 大寫字母
                    </button>
                    <button
                      type="button"
                      onClick={() => startChallenge(activeMode, 'alpha_lower', '低年級 • 小寫字母', 'a-z')}
                      className="py-2.5 px-2 rounded-xl bg-teal-600/80 hover:bg-teal-500 text-white font-black text-xs text-center shadow-md active:scale-95 transition-all cursor-pointer border border-teal-400/50"
                    >
                      🔡 小寫字母
                    </button>
                    <button
                      type="button"
                      onClick={() => startChallenge(activeMode, 'alpha_mixed', '低年級 • 大小寫混合', 'A-z')}
                      className="py-2.5 px-2 rounded-xl bg-cyan-600/80 hover:bg-cyan-500 text-white font-black text-xs text-center shadow-md active:scale-95 transition-all cursor-pointer border border-cyan-400/50"
                    >
                      🔀 大小寫混合
                    </button>
                  </div>
                </div>

                {/* 2. 中年級專區 (三年級、四年級) */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/80 to-slate-900/90 border-2 border-blue-500/40 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-base font-black text-blue-200 font-heading flex items-center gap-2">
                        <span>🌿</span>
                        <span>中年級 • 生活會話 (Elementary)</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                        Book 1 ~ 4
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-bold mb-3">
                      課文常用情境會話、日常問候與指令問答。
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => startChallenge(activeMode, 'grade_g3', '三年級 • 生活對話', 'Book 1 & 2')}
                      className="py-2.5 px-3 rounded-xl bg-blue-600/80 hover:bg-blue-500 text-white font-black text-xs text-center shadow-md active:scale-95 transition-all cursor-pointer border border-blue-400/50"
                    >
                      📘 三年級 (B1-B2)
                    </button>
                    <button
                      type="button"
                      onClick={() => startChallenge(activeMode, 'grade_g4', '四年級 • 生活對話', 'Book 3 & 4')}
                      className="py-2.5 px-3 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 text-white font-black text-xs text-center shadow-md active:scale-95 transition-all cursor-pointer border border-indigo-400/50"
                    >
                      📗 四年級 (B3-B4)
                    </button>
                  </div>
                </div>

                {/* 3. 高年級專區 (五年級、六年級、國一先修) */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/80 to-slate-900/90 border-2 border-purple-500/40 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-base font-black text-purple-200 font-heading flex items-center gap-2">
                        <span>🌲</span>
                        <span>高年級 • 綜合應用 (Advanced)</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                        Book 5 ~ 9
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-bold mb-3">
                      複雜語法、時態表達與國中英語先修銜接句型。
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => startChallenge(activeMode, 'grade_g5', '五年級 • 綜合對話', 'Book 5 & 6')}
                      className="py-2.5 px-2 rounded-xl bg-purple-600/80 hover:bg-purple-500 text-white font-black text-xs text-center shadow-md active:scale-95 transition-all cursor-pointer border border-purple-400/50"
                    >
                      📙 五年級
                    </button>
                    <button
                      type="button"
                      onClick={() => startChallenge(activeMode, 'grade_g6', '六年級 • 綜合對話', 'Book 7 & 8')}
                      className="py-2.5 px-2 rounded-xl bg-fuchsia-600/80 hover:bg-fuchsia-500 text-white font-black text-xs text-center shadow-md active:scale-95 transition-all cursor-pointer border border-fuchsia-400/50"
                    >
                      📕 六年級
                    </button>
                    <button
                      type="button"
                      onClick={() => startChallenge(activeMode, 'grade_jh', '國一先修 • 銜接特訓', 'Book 9')}
                      className="py-2.5 px-2 rounded-xl bg-pink-600/80 hover:bg-pink-500 text-white font-black text-xs text-center shadow-md active:scale-95 transition-all cursor-pointer border border-pink-400/50"
                    >
                      🎓 國一先修
                    </button>
                  </div>
                </div>

                {/* 4. 自選單元專區 */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/80 to-slate-900/90 border-2 border-amber-500/40 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-base font-black text-amber-200 font-heading flex items-center gap-2">
                        <span>📚</span>
                        <span>自選單元特訓 (Custom Unit)</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                        自主練習
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-bold mb-3">
                      自己挑選指定冊次 (Book 1~9) 與特定課文單元專題練習。
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.click();
                      setIsBookshelfOpen(true);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-xs text-center shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 border border-amber-300/40"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>📖 開啟全冊書架自由選課 ➔</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              【狀態三：測驗作答實施台 (quiz)】15 題聽力 / 口說挑戰
             ════════════════════════════════════════════════════════════════ */}
          {viewState === 'quiz' && currentQ && (
            <div className="w-full max-w-2xl flex flex-col items-center animate-fadeIn my-auto">
              
              {/* 作答台卡片主體 */}
              <div className="w-full p-4 sm:p-6 rounded-3xl bg-slate-950/75 backdrop-blur-md border-2 border-amber-500/50 shadow-2xl flex flex-col items-center relative">
                
                {/* 頂部進度條與題號指示 */}
                <div className="w-full flex items-center justify-between mb-3 text-xs sm:text-sm font-black">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      第 {currentIndex + 1} / {questions.length} 題
                    </span>
                    {scoreStats.streak >= 2 && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-400/30 flex items-center gap-1 animate-pulse">
                        <Flame className="w-3.5 h-3.5" />
                        <span>連勝 {scoreStats.streak}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-emerald-400 font-bold">✓ 答對: {scoreStats.correct}</span>
                    <span className="text-rose-400 font-bold">✗ 答錯: {scoreStats.wrong}</span>
                  </div>
                </div>

                {/* 15 題總進度長條 */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-4 border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>

                {/* ── 🎧 聽力測驗介面 ── */}
                {activeMode === 'listening' && (
                  <div className="w-full flex flex-col items-center">
                    
                    {/* 播放發音大按鈕 */}
                    <div className="my-2 flex flex-col items-center">
                      <button
                        type="button"
                        onClick={handlePlayCurrentAudio}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-amber-300 ring-4 ring-amber-400/20 group"
                        title="點擊播放或重聽發音"
                      >
                        <Volume2 className="w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-110 transition-transform" />
                      </button>
                      <span className="text-xs text-amber-300 font-black mt-2 flex items-center gap-1">
                        <span>🔊 點擊重聽發音</span>
                      </span>
                    </div>

                    {/* 題目提示語句 */}
                    <p className="text-sm sm:text-base font-black text-white text-center mb-4 mt-1">
                      {currentQ.promptZh}
                    </p>

                    {/* 三選一 Kahoot! 風格超大選項按鈕卡片 */}
                    <div className="w-full flex flex-col gap-2.5 mb-2">
                      {(currentQ.options || []).map((opt) => {
                        const isSelected = selectedChoiceKey === opt.key;
                        const isCorrect = opt.isCorrect;
                        const isAnswered = feedback !== null;

                        // Kahoot! 樣式判定
                        const showCorrect = isAnswered && isCorrect;
                        const showWrong = isAnswered && isSelected && !isCorrect;
                        const isDimmed = isAnswered && !isCorrect && !isSelected;

                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => handleSelectChoice(opt)}
                            disabled={isAnswered}
                            className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all duration-200 flex items-center gap-3.5 cursor-pointer backdrop-blur-md shadow-lg active:scale-98 ${
                              showCorrect
                                ? 'bg-emerald-600 text-white border-emerald-300 ring-4 ring-emerald-300/60 shadow-emerald-500/40 scale-102'
                                : showWrong
                                ? 'bg-rose-600 text-white border-rose-300 ring-4 ring-rose-300/60 shadow-rose-500/40'
                                : isDimmed
                                ? 'bg-slate-900/40 text-slate-400 border-white/10 opacity-35'
                                : 'bg-slate-900/80 hover:bg-slate-800 text-white border-white/20 hover:border-amber-400/70 hover:scale-101'
                            }`}
                          >
                            {/* A, B, C 標籤 */}
                            <span className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl font-mono font-black text-sm sm:text-base flex items-center justify-center shrink-0 border ${
                              showCorrect
                                ? 'bg-white text-emerald-700 border-white'
                                : showWrong
                                ? 'bg-white text-rose-700 border-white'
                                : 'bg-white/15 text-amber-300 border-white/20'
                            }`}>
                              {showCorrect ? '✓' : showWrong ? '✗' : opt.key}
                            </span>

                            {/* 選項英文字 (字母超大，句子易讀) */}
                            <div className="flex-1 min-w-0">
                              <span className={`font-black font-heading leading-tight break-words ${
                                currentQ.isAlphabet ? 'text-2xl sm:text-3xl' : 'text-sm sm:text-base'
                              }`}>
                                {opt.textEn}
                              </span>
                              {showChinese && opt.textZh && !currentQ.isAlphabet && (
                                <p className="text-xs text-amber-200/90 mt-0.5 font-bold">
                                  {opt.textZh}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* ── 作答後醒目的「下一題 ➔」引導與 3 秒倒數進度條 ── */}
                    {feedback !== null && (
                      <div className="w-full mt-3 p-3.5 rounded-2xl bg-slate-900/95 border-2 border-amber-400/60 shadow-2xl flex flex-col items-center gap-2.5 animate-bounce-short">
                        
                        {/* 倒數計時條 */}
                        <div className="w-full flex items-center justify-between text-xs text-amber-300 font-bold">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                            <span>⏱️ 倒數 3 秒自動進入下一題...</span>
                          </span>
                          <span className="font-mono">{Math.ceil((autoNextProgress / 100) * 3)} 秒</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-amber-400 transition-all duration-75"
                            style={{ width: `${autoNextProgress}%` }}
                          />
                        </div>

                        {/* 超大金色高亮下一題按鈕 */}
                        <button
                          type="button"
                          onClick={handleNextQuestion}
                          className="w-full py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-base sm:text-lg shadow-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 border-2 border-amber-200"
                        >
                          <span>{currentIndex + 1 < questions.length ? '下一題 ➔ (Next Question)' : '🏆 查看成績結算 (Finish Quiz)'}</span>
                        </button>
                      </div>
                    )}

                  </div>
                )}

                {/* ── 🎙️ 口說測驗介面 ── */}
                {activeMode === 'speaking' && (
                  <div className="w-full flex flex-col items-center">
                    
                    {/* 目標字卡 */}
                    <div className="w-full p-4 sm:p-6 rounded-2xl bg-stone-900/90 border-2 border-rose-500/40 my-3 text-center flex flex-col items-center">
                      <p className="text-xs text-rose-300 font-bold mb-2">
                        {currentQ.promptZh || '請聆聽標準發音，並大聲開口念出：'}
                      </p>
                      
                      <div className="flex items-center justify-center gap-3">
                        <span className={`font-black text-white font-heading ${
                          currentQ.isAlphabet ? 'text-4xl sm:text-6xl text-amber-300' : 'text-lg sm:text-2xl'
                        }`}>
                          {currentQ.targetEn}
                        </span>
                        <button
                          type="button"
                          onClick={handlePlayCurrentAudio}
                          className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-400/30 transition-all cursor-pointer"
                          title="聽示範發音"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                      </div>

                      {currentQ.targetZh && (
                        <p className="text-xs text-slate-300 mt-2 font-bold">
                          {currentQ.targetZh}
                        </p>
                      )}
                    </div>

                    {/* 錄音按鈕 */}
                    <div className="my-2 flex flex-col items-center">
                      <button
                        type="button"
                        onClick={handleStartSpeaking}
                        disabled={isRecording}
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center shadow-2xl transition-all cursor-pointer border-2 active:scale-95 ${
                          isRecording
                            ? 'bg-red-600 text-white border-red-300 animate-ping ring-8 ring-red-500/40'
                            : 'bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white border-rose-300 ring-4 ring-rose-400/20'
                        }`}
                      >
                        {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10 sm:w-12 sm:h-12" />}
                      </button>
                      <span className="text-xs text-rose-300 font-black mt-2">
                        {isRecording ? '🎙️ 正在聆聽中，請大聲念...' : '點擊麥克風開始錄音'}
                      </span>
                    </div>

                    {/* 學生辨識文字與評分星級 */}
                    {recordedText && (
                      <div className="w-full mt-3 p-3.5 rounded-2xl bg-black/60 border border-white/20 text-center">
                        <span className="text-xs text-slate-400">你念出的是：</span>
                        <p className="text-base sm:text-lg font-black text-amber-200 mt-0.5">
                          "{recordedText}"
                        </p>
                        {speechResult && (
                          <div className="mt-2 flex flex-col items-center">
                            <span className="text-base sm:text-lg font-black text-yellow-300 animate-bounce">
                              {speechResult.feedbackText}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 下一題按鈕與重念一次按鈕 */}
                    <div className="w-full flex items-center gap-2.5 mt-4">
                      <button
                        type="button"
                        onClick={handleStartSpeaking}
                        className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-sm flex items-center justify-center gap-1.5 border border-white/20 transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4 text-amber-400" />
                        <span>不滿意？重念一次</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-black text-sm flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer border border-rose-300"
                      >
                        <span>{currentIndex + 1 < questions.length ? '下一題 ➔' : '查看結算 🏆'}</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              【狀態四：影音播放專區 (video_room)】微電影全片與片段挑戰
             ════════════════════════════════════════════════════════════════ */}
          {viewState === 'video_room' && (
            <div className="w-full max-w-4xl flex flex-col items-center animate-fadeIn my-auto">
              
              {/* 頂部選片列 */}
              <div className="w-full flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-slate-900/90 border border-white/20 mb-3 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-amber-300 font-black flex items-center gap-1 mr-1">
                    <Film className="w-4 h-4 text-amber-400" />
                    <span>放映片單：</span>
                  </span>
                  {UNIT_VIDEO_LIBRARY.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        soundEngine.click();
                        setSelectedVideoId(v.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedVideoId === v.id
                          ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-300'
                          : 'bg-stone-800 text-slate-300 hover:text-white border border-white/10'
                      }`}
                    >
                      <span>{v.shortTitle || v.title}</span>
                    </button>
                  ))}
                </div>

                {/* 觀影模式：全片觀賞 vs 片段題目 */}
                <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setVideoPlayMode('full')}
                    className={`px-2.5 py-1 rounded-lg font-black text-[11px] transition-all cursor-pointer ${
                      videoPlayMode === 'full' ? 'bg-amber-500 text-stone-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🎥 全片觀賞
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoPlayMode('clips');
                      // 載入該片題目並進作答
                      const clips = activeVideo.clips || [];
                      const formatted = clips.map((clip, idx) => ({
                        ...clip,
                        youtubeId: activeVideo.youtubeId,
                        localUrl: activeVideo.localUrl,
                        isLocalPlayer: activeVideo.isLocalPlayer,
                        videoTitle: activeVideo.title,
                        options: (clip.choices || []).map((c, cIdx) => ({
                          key: String.fromCharCode(65 + cIdx),
                          textEn: c.text,
                          isCorrect: c.isCorrect
                        }))
                      }));
                      setQuestions(formatted);
                      setCurrentIndex(0);
                      setFeedback(null);
                      setSelectedChoiceKey(null);
                      setCurrentChallengeInfo({ id: activeVideo.id, title: activeVideo.shortTitle, badge: '影片選句' });
                      setActiveMode('listening');
                      setViewState('quiz');
                    }}
                    className={`px-2.5 py-1 rounded-lg font-black text-[11px] transition-all cursor-pointer ${
                      videoPlayMode === 'clips' ? 'bg-amber-500 text-stone-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🎯 微秒測驗 ({activeVideo.clips?.length || 0}題)
                  </button>
                </div>
              </div>

              {/* 影片播放主體 (全片播放模式) */}
              <div className="w-full rounded-3xl overflow-hidden bg-black border-2 border-amber-500/60 shadow-2xl relative aspect-video">
                {activeVideo.isLocalPlayer ? (
                  <iframe
                    src={`${activeVideo.localUrl}?start=0&caption=1`}
                    title={activeVideo.title}
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <YouTubeClipPlayer
                    youtubeId={activeVideo.youtubeId}
                    startSeconds={0}
                    endSeconds={activeVideo.totalDuration || 66}
                    autoplay={true}
                    captionShield={false}
                    hideControls={false}
                  />
                )}
              </div>

              <div className="w-full mt-3 p-3 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between text-xs text-slate-300">
                <span className="font-bold">{activeVideo.description}</span>
                <span className="font-mono text-amber-300 font-black">{activeVideo.badge}</span>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              【狀態五：結算成績與榮譽榜 (settlement)】
             ════════════════════════════════════════════════════════════════ */}
          {viewState === 'settlement' && (
            <div className="w-full max-w-xl flex flex-col items-center animate-fadeIn my-auto">
              <div className="w-full p-6 rounded-3xl bg-slate-950/90 backdrop-blur-md border-2 border-amber-400 shadow-2xl text-center flex flex-col items-center">
                
                {/* 獎盃圖示 */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-4xl shadow-xl border-4 border-amber-200 animate-bounce">
                  🏆
                </div>

                <h2 className="text-2xl font-black font-heading text-amber-200 mt-3">
                  挑戰完成！Congratulations!
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  {currentChallengeInfo.title} • 15 題特訓完畢
                </p>

                {/* 分數面板 */}
                <div className="w-full my-4 grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 flex flex-col items-center">
                    <span className="text-xs text-slate-400">答對題數</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono mt-1">
                      {scoreStats.correct} / {questions.length}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 flex flex-col items-center">
                    <span className="text-xs text-slate-400">正確率</span>
                    <span className="text-2xl font-black text-amber-400 font-mono mt-1">
                      {Math.round((scoreStats.correct / Math.max(1, questions.length)) * 100)}%
                    </span>
                  </div>
                </div>

                {/* 獎勵發放資訊 */}
                <div className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-black flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>已獲得學習金幣與榮譽學分！</span>
                </div>

                {/* 榮譽榜提交組件 */}
                <div className="w-full mb-4">
                  <HonorSubmissionCard
                    mode="listening_lab"
                    book={selectedBook}
                    score={scoreStats.correct}
                    totalCount={questions.length}
                    rangeText={currentChallengeInfo.title}
                  />
                </div>

                {/* 底部導航按鈕 */}
                <div className="w-full flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => startChallenge(activeMode, currentChallengeInfo.id, currentChallengeInfo.title, currentChallengeInfo.badge)}
                    className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>再測一次</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewState('grade_select')}
                    className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-sm flex items-center justify-center gap-1.5 border border-white/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>換其他年級</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewState('main_menu')}
                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <span>回大廳</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

      {/* ── 📚 全冊書架彈窗 (MediaBookshelfModal) ── */}
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
