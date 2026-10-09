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
  ArrowLeft, Volume2, Mic, MicOff, CheckCircle2, XCircle, X,
  Trophy, Sparkles, BookOpen, ChevronLeft, ChevronRight,
  RotateCcw, Star, Headphones, Disc, Award, Film, Settings, Play, Video,
  Music, VolumeX, Eye, EyeOff
} from 'lucide-react';
import { UNIT_VIDEO_LIBRARY } from '../../data/unitVideoQuestionData';
import { YouTubeClipPlayer } from '../../components/common/YouTubeClipPlayer';

const BG_IMAGE = '/assets/langlab/bg_language_lab.jpg';
const MENTOR_OWL = '/assets/langlab/mentor_owl_standee.webp';
const STUDENT_BEAR = '/assets/langlab/student_bear_standee.webp';

export const LanguageLabHub = ({ onBack }) => {
  const { coins, questPoints, addCoins, addQuestPoints } = useStudent();

  // 當前選定冊次與單元
  const [selectedBook, setSelectedBook] = useState(1);
  const [selectedUnitId, setSelectedUnitId] = useState('b1_u1');
  const [selectedUnitTitle, setSelectedUnitTitle] = useState('Unit 1 What’s Your Name?');
  const [isBookshelfOpen, setIsBookshelfOpen] = useState(false);

  // 模式切換：'listening' (聽力實驗台) | 'speaking' (口說錄音台) | 'video' (影片選句台)
  const [activeMode, setActiveMode] = useState('listening');

  // 中文翻譯提示開關 (預設不開啟中文，專注純英語情境訓練)
  const [showChinese, setShowChinese] = useState(false);

  // 教室背景音樂狀態
  const [isBgmPlaying, setIsBgmPlaying] = useState(() => soundEngine.isSceneBgmActive());

  // 進入教室自動啟動校園環境 BGM，退出時停止
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

  // 自訂 YouTube 測試彈窗狀態
  const [isCustomVideoModalOpen, setIsCustomVideoModalOpen] = useState(false);
  const [customYtInput, setCustomYtInput] = useState('');
  const [customStart, setCustomStart] = useState(5);
  const [customEnd, setCustomEnd] = useState(12);
  const [customSentence, setCustomSentence] = useState('Where did you go last weekend?');

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
    } else if (mode === 'speaking') {
      const q = getUnitSpeakingQuestions(book, unitId, 10);
      setQuestions(q);
    } else if (mode === 'video') {
      const videoMatch = UNIT_VIDEO_LIBRARY.find(v => v.book === Number(book)) || UNIT_VIDEO_LIBRARY[0];
      const videoQuestions = (videoMatch.clips || []).map((clip) => ({
        ...clip,
        youtubeId: videoMatch.youtubeId,
        videoTitle: videoMatch.title,
        options: (clip.choices || []).map(c => ({
          key: c.key,
          textEn: c.text,
          isCorrect: c.isCorrect
        }))
      }));
      setQuestions(videoQuestions);
    }
  }, []);

  // 當冊次、單元或模式切換時，重新載入題目
  useEffect(() => {
    loadQuestionBank(selectedBook, selectedUnitId, activeMode);
  }, [selectedBook, selectedUnitId, activeMode, loadQuestionBank]);

  const currentQ = questions[currentIndex] || null;

  // 進入題目時自動播放示範語音 (影片模式不播放，避免與影片語音衝突)
  useEffect(() => {
    if (currentQ && !isFinished && activeMode !== 'video') {
      const textToSpeak = currentQ.audioText || currentQ.targetEn || currentQ.en;
      if (textToSpeak) {
        const timer = setTimeout(() => {
          speakEnglish(textToSpeak);
        }, 380);
        return () => clearTimeout(timer);
      }
    }
  }, [currentQ, currentIndex, isFinished, activeMode]);

  // 重新朗讀
  const handleReplay = useCallback(() => {
    if (!currentQ) return;
    const textToSpeak = currentQ.audioText || currentQ.targetEn || currentQ.en;
    if (textToSpeak) {
      speakEnglish(textToSpeak);
    }
  }, [currentQ]);

  // 應用老師自訂 YouTube 影片測試題
  const handleApplyCustomVideo = () => {
    if (!customYtInput.trim()) return;
    soundEngine.correct();
    let extractedId = customYtInput.trim();
    const match = extractedId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      extractedId = match[1];
    }

    const customQ = [{
      id: 'custom_1',
      start: Number(customStart) || 0,
      end: Number(customEnd) || 10,
      promptZh: '老師自訂 YouTube 影片測試：請看影片選出正確句子！',
      targetEn: customSentence,
      youtubeId: extractedId,
      videoTitle: '自訂 YouTube 影片即時測驗',
      options: [
        { key: 'A', textEn: customSentence, isCorrect: true },
        { key: 'B', textEn: 'What are you doing today?', isCorrect: false },
        { key: 'C', textEn: 'Nice to meet you too.', isCorrect: false },
        { key: 'D', textEn: 'I like apples and bananas.', isCorrect: false }
      ]
    }];

    setActiveMode('video');
    setQuestions(customQ);
    setCurrentIndex(0);
    setFeedback(null);
    setSelectedChoiceKey(null);
    setIsCustomVideoModalOpen(false);
  };

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
        soundEngine.pauseSceneBgm();
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

  // 書籍櫃選中單元回呼
  const handleSelectUnitFromBookshelf = (bookNum, unitId, unitTitle) => {
    setSelectedBook(bookNum);
    setSelectedUnitId(unitId);
    setSelectedUnitTitle(unitTitle);
    setIsBookshelfOpen(false);
  };

  return (
    <div className="relative w-full max-w-[1720px] mx-auto px-2 sm:px-4 py-2 animate-fadeIn flex flex-col items-center select-none">
      
      {/* ── 全景視聽語言教室舞台容器 (Widescreen Stage) ── */}
      <div className="relative w-full min-h-[580px] md:min-h-[660px] md:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-600/60 bg-slate-950 flex flex-col">
        
        {/* 教室全景底圖 */}
        <img
          src={BG_IMAGE}
          alt="視聽語言教室"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/50 pointer-events-none" />

        {/* 頂部輕量化懸浮導航 HUD */}
        <div className="relative z-30 px-3 sm:px-5 py-2.5 rounded-none sm:rounded-b-2xl bg-slate-950/75 backdrop-blur-md border-b sm:border border-white/20 text-white flex items-center justify-between gap-2 shadow-lg shrink-0">
          
          {/* 左：返回鍵與標題 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                stopSpeech();
                soundEngine.click();
                if (onBack) onBack();
              }}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-black flex items-center gap-1 shadow-md active:scale-95 cursor-pointer border border-white/10"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">回首頁</span>
            </button>
            <span className="text-xs sm:text-base font-black font-heading text-amber-200 drop-shadow">
              🏫 視聽語言教室
            </span>
          </div>

          {/* 中：模式膠囊切換 [🎧 聽力台 | 🎙️ 口說台 | 🎬 影片台] */}
          <div className="flex p-1 rounded-xl bg-black/50 border border-white/15">
            <button
              onClick={() => {
                soundEngine.click();
                setActiveMode('listening');
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
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
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                activeMode === 'speaking'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>口說台</span>
            </button>
            <button
              onClick={() => {
                soundEngine.click();
                setActiveMode('video');
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                activeMode === 'video'
                  ? 'bg-amber-600 text-white shadow-md ring-1 ring-amber-300'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>影片台</span>
            </button>
          </div>

          {/* 右：背景音樂開關 + 影音書籍櫃按鈕 + 自訂影片測試 */}
          <div className="flex items-center gap-2">
            {activeMode === 'video' && (
              <button
                onClick={() => {
                  soundEngine.click();
                  setIsCustomVideoModalOpen(true);
                }}
                className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 text-xs font-black flex items-center gap-1 border border-amber-500/40 cursor-pointer shadow-sm active:scale-95 transition-all"
                title="輸入任意 YouTube 網址自訂測試題"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden md:inline">自訂影片</span>
              </button>
            )}

            {/* 背景音樂開關 */}
            <button
              onClick={handleToggleBgm}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-black backdrop-blur-md border transition-all flex items-center gap-1 shadow-sm cursor-pointer active:scale-95 ${
                isBgmPlaying
                  ? 'bg-amber-500/25 text-amber-200 border-amber-400/40'
                  : 'bg-white/15 text-slate-300 border-white/20'
              }`}
              title={isBgmPlaying ? '暫停教室音樂' : '播放教室音樂'}
            >
              {isBgmPlaying ? (
                <Music className="w-3.5 h-3.5 animate-bounce text-amber-300" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

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

        {/* ── 核心教學互動舞台 (左側立繪 + 右側互動卡片區) ── */}
        <div className="relative flex-1 w-full max-w-[1440px] mx-auto flex flex-col md:flex-row items-end justify-between px-3 sm:px-6 md:px-10 pb-3 sm:pb-6 gap-3 md:gap-8 overflow-hidden z-20">
          
          {/* 左側：人物立牌展示 (小鎮風格：膝以上半身、去背透明、陰影、底部身分徽章膠囊) */}
          <div className="hidden md:flex flex-col items-center justify-end shrink-0 z-10 transition-transform duration-500 transform animate-slide-in-left">
            <div className="relative group flex flex-col items-center">
              {/* 人物語言對話氣泡 */}
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-60 p-2 rounded-2xl bg-slate-950/85 border border-amber-400/80 text-white text-xs font-bold shadow-xl text-center backdrop-blur-md z-20">
                <span className="text-amber-300 font-black">
                  {activeMode === 'listening' ? '🦉 貓頭鷹導師：' : '🐻 黑熊學伴：'}
                </span>
                <p className="text-[11px] text-slate-200 mt-0.5">
                  {activeMode === 'listening'
                    ? '戴好耳機，仔細聽發音，選出正確的卡片！'
                    : '跟著我大聲說出來！點擊麥克風開始錄音！'}
                </p>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-950/85" />
              </div>

              {/* 人物立繪圖像 (去背透光、原畫尺寸、小鎮規範) */}
              <img
                src={activeMode === 'listening' ? MENTOR_OWL : STUDENT_BEAR}
                alt={activeMode === 'listening' ? '貓頭鷹導師' : '黑熊學伴'}
                className="h-56 sm:h-72 md:h-[460px] lg:h-[500px] max-h-[62vh] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)] select-none transition-transform duration-300 group-hover:scale-102"
              />

              {/* 小鎮標準身分立牌膠囊 */}
              <div className="mt-1 px-4 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/30 shadow-xl flex items-center gap-2 pointer-events-auto">
                <span className="text-xl">{activeMode === 'listening' ? '🦉' : '🐻'}</span>
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-black text-white font-heading leading-tight">
                    {activeMode === 'listening' ? '貓頭鷹導師' : '黑熊學伴'}
                  </div>
                  <div className="text-[10px] font-bold text-amber-300">
                    {activeMode === 'listening' ? '視聽語言教室 • 聽力導師' : '視聽語言教室 • 口說學伴'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右側/中央：測驗題目區 (毛玻璃擬真透明、精巧不佔版面、預設不開中文、三選一) */}
          <div className="flex-1 w-full max-w-2xl h-full flex flex-col justify-end py-1 sm:py-2 z-20">
            
            {/* 1. 黑板頂部資訊條：冊次、單元、進度、上下題 */}
            <div className="w-full mb-2 flex items-center justify-between px-3.5 py-1.5 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-amber-500/40 text-white shadow-md">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/30 text-amber-300 font-mono font-black text-xs">
                  B{selectedBook}
                </span>
                {selectedBook === 9 && (
                  <span className="px-2 py-0.5 rounded-md bg-rose-600/90 text-white font-black text-[10px] tracking-wide border border-rose-400/50 shadow-xs">
                    國一先修
                  </span>
                )}
                <span className="text-xs sm:text-sm font-black font-heading truncate max-w-[180px] sm:max-w-xs text-slate-100">
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
                  className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white cursor-pointer"
                  title="上一題"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-white cursor-pointer"
                  title="下一題"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. 測驗內容區 (毛玻璃擬真半透明) */}
            {currentQ && !isFinished ? (
              <div className="w-full p-3 sm:p-5 text-center flex flex-col items-center justify-center relative overflow-hidden rounded-3xl bg-slate-950/50 backdrop-blur-md border border-white/20 shadow-2xl">
                
                {activeMode === 'video' ? (
                  /* ── 🎬 影片片段選句介面 ── */
                  <div className="w-full flex flex-col items-center max-w-xl mx-auto">
                    <div className="w-full mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-amber-300 font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>{currentQ.promptZh || '請觀看影片片段，選出劇中正確對話句：'}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowChinese(prev => !prev)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                          showChinese 
                            ? 'bg-amber-500/30 text-amber-200 border-amber-400/50' 
                            : 'bg-white/10 text-slate-300 border-white/20 hover:text-white'
                        }`}
                        title="切換中文翻譯提示"
                      >
                        {showChinese ? <Eye className="w-3 h-3 text-amber-300" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
                        <span>{showChinese ? '中文已開啟' : '預設不開中文'}</span>
                      </button>
                    </div>

                    {/* YouTube 裁剪區間播放器 (支援全螢幕 & 自動背景音暫停) */}
                    <div className="w-full mb-2.5">
                      <YouTubeClipPlayer
                        key={`${currentQ.youtubeId}_${currentQ.start}_${currentQ.end}`}
                        youtubeId={currentQ.youtubeId}
                        startSeconds={currentQ.start}
                        endSeconds={currentQ.end}
                        autoplay={true}
                      />
                    </div>

                    {/* 三選一 擬真毛玻璃卡片 (A, B, C) */}
                    <div className="flex flex-col gap-2 w-full">
                      {(currentQ.options || []).slice(0, 3).map((opt) => {
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
                            className={`px-3.5 py-2.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer backdrop-blur-md shadow-lg active:scale-98 ${
                              showCorrect || showReveal
                                ? 'bg-emerald-600/85 text-white border-emerald-400 ring-2 ring-emerald-300'
                                : showWrong
                                ? 'bg-rose-600/85 text-white border-rose-400'
                                : 'bg-slate-950/45 hover:bg-slate-900/60 border-white/20 hover:border-amber-400/70 text-slate-100'
                            }`}
                          >
                            <span className={`w-7 h-7 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 border ${
                              showCorrect || showReveal
                                ? 'bg-white text-emerald-700 border-white'
                                : showWrong
                                ? 'bg-white text-rose-700 border-white'
                                : 'bg-white/10 text-amber-300 border-white/20'
                            }`}>
                              {opt.key}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-black leading-snug break-words">
                                {opt.textEn}
                              </p>
                              {showChinese && opt.textZh && (
                                <p className="text-[11px] text-amber-200/90 mt-0.5">
                                  {opt.textZh}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : activeMode === 'listening' ? (
                  /* ── 🎧 聽力施測介面 (精巧圓形播放鈕 + 三選一毛玻璃卡片 + 預設無中文) ── */
                  <div className="w-full flex flex-col items-center justify-center max-w-xl mx-auto">
                    {/* 圓形播放鈕 + 提示 */}
                    <div className="flex flex-col items-center mb-3">
                      <button
                        type="button"
                        onClick={handleReplay}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.6)] active:scale-95 transition-all cursor-pointer border-2 border-white/40 group"
                        title="點擊重聽發音"
                      >
                        <Volume2 className="w-8 h-8 sm:w-10 sm:h-10 group-hover:scale-110 transition-transform animate-pulse" />
                      </button>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-bold text-amber-300/95 tracking-wide drop-shadow">
                          {currentQ.promptZh || '請仔細聆聽發音，選出正確句子：'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowChinese(prev => !prev)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                            showChinese 
                              ? 'bg-amber-500/30 text-amber-200 border-amber-400/50' 
                              : 'bg-white/10 text-slate-300 border-white/20 hover:text-white'
                          }`}
                          title="切換中文翻譯提示"
                        >
                          {showChinese ? <Eye className="w-3 h-3 text-amber-300" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
                          <span>{showChinese ? '中文已開啟' : '預設不開中文'}</span>
                        </button>
                      </div>
                    </div>

                    {/* 三選一 擬真毛玻璃卡片 (A, B, C) */}
                    <div className="flex flex-col gap-2 w-full">
                      {(currentQ.options || []).slice(0, 3).map((opt) => {
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
                            className={`px-3.5 py-2.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer backdrop-blur-md shadow-lg active:scale-98 ${
                              showCorrect || showReveal
                                ? 'bg-emerald-600/85 text-white border-emerald-400 ring-2 ring-emerald-300'
                                : showWrong
                                ? 'bg-rose-600/85 text-white border-rose-400'
                                : 'bg-slate-950/45 hover:bg-slate-900/60 border-white/20 hover:border-amber-400/70 text-slate-100 hover:text-white'
                            }`}
                          >
                            <span className={`w-7 h-7 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 border ${
                              showCorrect || showReveal
                                ? 'bg-white text-emerald-700 border-white'
                                : showWrong
                                ? 'bg-white text-rose-700 border-white'
                                : 'bg-white/10 text-amber-300 border-white/20'
                            }`}>
                              {opt.key}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm sm:text-base font-black leading-snug break-words drop-shadow-sm">
                                {opt.textEn}
                              </p>
                              {showChinese && opt.textZh && (
                                <p className="text-[11px] text-amber-200/90 mt-0.5 drop-shadow-sm font-medium">
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
                  /* ── 🎙️ 口說施測介面 ── */
                  <div className="w-full flex flex-col items-center justify-center max-w-xl mx-auto py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-rose-300">
                        {currentQ.speaker && currentQ.speaker !== 'Character' ? `${currentQ.speaker} 說：` : '跟讀目標句：'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowChinese(prev => !prev)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                          showChinese 
                            ? 'bg-amber-500/30 text-amber-200 border-amber-400/50' 
                            : 'bg-white/10 text-slate-300 border-white/20 hover:text-white'
                        }`}
                        title="切換中文翻譯提示"
                      >
                        {showChinese ? <Eye className="w-3 h-3 text-amber-300" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
                        <span>{showChinese ? '中文已開啟' : '預設不開中文'}</span>
                      </button>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white font-heading mb-1 text-center px-4 drop-shadow">
                      {currentQ.targetEn || currentQ.en}
                    </h3>
                    {showChinese && (currentQ.targetZh || currentQ.zh) && (
                      <p className="text-xs sm:text-sm font-bold text-amber-300/90 mb-3 text-center">
                        {currentQ.targetZh || currentQ.zh}
                      </p>
                    )}

                    {/* 聽示範與錄音按鈕 */}
                    <div className="flex items-center gap-3 my-3">
                      <button
                        type="button"
                        onClick={handleReplay}
                        className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md"
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
              </div>
            ) : isFinished ? (
              /* ── 完成測驗結算畫面 ── */
              <div className="w-full flex-1 my-2 p-6 text-center flex flex-col items-center justify-center rounded-3xl bg-slate-950/70 backdrop-blur-md border-2 border-amber-500/50 shadow-2xl">
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
              </div>
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

      {/* ── ⚙️ 自訂 YouTube 測試設定彈窗 ── */}
      {isCustomVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
          <div className="w-full max-w-lg bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-2 border-amber-500 rounded-3xl p-5 sm:p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-700/80 pb-3">
              <h3 className="text-base font-black font-heading text-amber-300 flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-400" />
                <span>老師自訂 YouTube 影片題目測試</span>
              </h3>
              <button
                onClick={() => setIsCustomVideoModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-amber-200 mb-1">
                  YouTube 影片網址或 11 碼 ID：
                </label>
                <input
                  type="text"
                  value={customYtInput}
                  onChange={(e) => setCustomYtInput(e.target.value)}
                  placeholder="例如: https://youtu.be/zMdq9jSaNLg 或 zMdq9jSaNLg"
                  className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white font-mono placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-amber-200 mb-1">
                    起始播放秒數 (Start):
                  </label>
                  <input
                    type="number"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-amber-200 mb-1">
                    結束暫停秒數 (End):
                  </label>
                  <input
                    type="number"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-amber-200 mb-1">
                  目標正確句子 (Target Sentence):
                </label>
                <input
                  type="text"
                  value={customSentence}
                  onChange={(e) => setCustomSentence(e.target.value)}
                  placeholder="例如: Where did you go last weekend?"
                  className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white font-bold placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="bg-amber-950/40 p-3 rounded-2xl border border-amber-800/50 text-amber-300 text-[11px] leading-relaxed">
                💡 <strong>零伺服器流量負擔：</strong>
                YouTube 的所有視訊檔案與 CDN 流量皆由 Google 免費承擔，無論多少位學生同時看，都不會耗損主機頻寬額度！
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-700/80">
              <button
                onClick={() => setIsCustomVideoModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-slate-300 font-bold text-xs cursor-pointer active:scale-95 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleApplyCustomVideo}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-black text-xs cursor-pointer shadow-md active:scale-95 transition-all"
              >
                立即載入測驗
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageLabHub;
