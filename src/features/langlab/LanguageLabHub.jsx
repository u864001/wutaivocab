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

export const LanguageLabHub = ({ onBack, onNavigate }) => {
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
  const questionScoresRef = useRef({});
  const recordingTimeoutRef = useRef(null);

  // 影音專區狀態：分類分頁 ('original': 老師原創微電影 | 'songs': 精選生活美語歌謠)
  const [videoCategory, setVideoCategory] = useState('original');
  const [selectedVideoId, setSelectedVideoId] = useState('mothers_day_card_yt');

  const currentQ = questions[currentIndex] || null;

  // 進入主選單時貓頭鷹語音問候；離開主選單或切換任何館別/狀態時立即停止語音 (不可在後台持續播放)
  useEffect(() => {
    let timer = null;
    if (viewState === 'main_menu') {
      timer = setTimeout(() => {
        speakEnglish("Welcome to the Language Lab! What would you like to practice today?");
      }, 500);
    }
    return () => {
      if (timer) clearTimeout(timer);
      stopSpeech();
    };
  }, [viewState]);

  // 切換 viewState 時無條件中斷所有背景語音發音
  useEffect(() => {
    stopSpeech();
  }, [viewState]);

  // 切換到新題目時自動播放發音 (若在聽力模式且非影片剪輯題)
  useEffect(() => {
    if (viewState === 'quiz' && activeMode === 'listening' && currentQ) {
      if (currentQ.youtubeId || currentQ.isLocalPlayer) return;
      const timer = setTimeout(() => {
        speakEnglish(currentQ.audioText || currentQ.correctEn);
      }, 400);
      return () => {
        clearTimeout(timer);
        stopSpeech();
      };
    }
  }, [currentIndex, viewState, activeMode, currentQ]);

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
    questionScoresRef.current = {};

    let qList = [];
    const count = 15;

    const vMatch = UNIT_VIDEO_LIBRARY.find(v => v.id === challengeId);
    if (vMatch) {
      const clips = vMatch.clips || [];
      qList = clips.map((clip) => ({
        ...clip,
        youtubeId: vMatch.youtubeId,
        localUrl: vMatch.localUrl,
        isLocalPlayer: vMatch.isLocalPlayer,
        videoTitle: vMatch.title,
        options: (clip.choices || []).map((c, cIdx) => ({
          key: String.fromCharCode(65 + cIdx),
          textEn: c.text,
          isCorrect: c.isCorrect
        }))
      }));
    } else if (challengeId === 'alpha_upper') {
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

    // 若為口說題且未評測即跳題，補記為未作答
    if (activeMode === 'speaking' && !questionScoresRef.current[currentIndex]) {
      questionScoresRef.current[currentIndex] = { isCorrect: false, stars: 0 };
      setScoreStats(s => ({ ...s, wrong: s.wrong + 1 }));
    }

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

  // ── 口說題：安全關閉錄音計時器 ──
  const stopActiveRecording = () => {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        const prev = recognitionRef.current;
        prev.onstart = null;
        prev.onresult = null;
        prev.onerror = null;
        prev.onend = null;
        prev.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
    soundEngine.resumeSceneBgm();
  };

  const handleStopSpeaking = () => {
    soundEngine.click();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        stopActiveRecording();
      }
    } else {
      setIsRecording(false);
    }
  };

  // ── 口說題：啟動語音辨識 (支援再次點擊立即送出、3.5s 超時安全評測與智慧回退) ──
  const handleStartSpeaking = () => {
    stopSpeech();
    soundEngine.click();

    // 若目前正在錄音中，再次點擊等於手動提前結束並立即評估！
    if (isRecording) {
      handleStopSpeaking();
      return;
    }

    stopActiveRecording();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const targetEn = currentQ?.targetEn || currentQ?.correctEn || 'English';

    if (!SpeechRecognition) {
      // 瀏覽器不支援 Web Speech API ➔ 自動播放示範發音並完成評測
      setRecordedText(targetEn);
      setSpeechResult({
        stars: 3,
        feedbackText: '⭐⭐⭐ 太棒了！已播放示範發音，跟讀完成！',
        matchScore: 100
      });
      speakEnglish(targetEn);
      soundEngine.win();
      questionScoresRef.current[currentIndex] = { isCorrect: true, stars: 3 };
      setScoreStats(s => ({
        ...s,
        correct: Object.values(questionScoresRef.current).filter(x => x.isCorrect).length
      }));
      return;
    }

    try {
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

        // 3.5 秒安全超時：若環境無聲音，自動結束並評測，絕不無限等待卡死！
        if (recordingTimeoutRef.current) clearTimeout(recordingTimeoutRef.current);
        recordingTimeoutRef.current = setTimeout(() => {
          try {
            if (rec) rec.stop();
          } catch (e) {
            stopActiveRecording();
          }
        }, 3500);
      };

      rec.onresult = (event) => {
        if (recordingTimeoutRef.current) clearTimeout(recordingTimeoutRef.current);
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        setRecordedText(transcript);

        const targetClean = targetEn.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
        const userClean = transcript.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

        const targetWords = targetClean.split(/\s+/).filter(Boolean);
        const userWords = userClean.split(/\s+/).filter(Boolean);
        const matchedWords = targetWords.filter(w => userWords.includes(w));
        const matchRatio = matchedWords.length / Math.max(1, targetWords.length);

        let stars = 1;
        let feedbackText = '';
        let isCorrect = false;

        if (matchRatio >= 0.75 || targetClean === userClean) {
          stars = 3;
          feedbackText = '⭐⭐⭐ Perfect! 發音無懈可擊！';
          isCorrect = true;
          soundEngine.win();
          try { confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } }); } catch (e) {}
        } else if (matchRatio >= 0.4) {
          stars = 2;
          feedbackText = '⭐⭐ Good job! 發音很清晰，再接再厲！';
          isCorrect = true;
          soundEngine.correct();
        } else {
          stars = 1;
          feedbackText = '⭐ 聽示範音再試一次，大聲說出來！';
          isCorrect = false;
          soundEngine.wrong();
        }

        setSpeechResult({
          stars,
          feedbackText,
          matchScore: Math.round(matchRatio * 100)
        });

        const currentBest = questionScoresRef.current[currentIndex]?.stars || 0;
        if (stars >= currentBest) {
          questionScoresRef.current[currentIndex] = { isCorrect, stars };
        }
        setScoreStats(s => ({
          ...s,
          correct: Object.values(questionScoresRef.current).filter(x => x.isCorrect).length
        }));
      };

      rec.onerror = (e) => {
        if (recordingTimeoutRef.current) clearTimeout(recordingTimeoutRef.current);
        console.warn('SpeechRecognition error:', e);
        stopActiveRecording();

        if (e.error === 'no-speech') {
          setRecordedText('(未偵測到聲音)');
          setSpeechResult({
            stars: 1,
            feedbackText: '💡 剛剛太安靜囉！請靠近麥克風大聲說～',
            matchScore: 0
          });
          soundEngine.wrong();
        } else if (e.error === 'not-allowed') {
          setRecordedText('(麥克風權限未開啟)');
          setSpeechResult({
            stars: 2,
            feedbackText: '🎤 請點擊網址列旁的鎖頭圖示開啟麥克風權限！',
            matchScore: 50
          });
        } else {
          // 網路或其他不可抗力：自動播放示範音並給予鼓勵，絕不卡死學生！
          setRecordedText(targetEn);
          setSpeechResult({
            stars: 3,
            feedbackText: '⭐⭐⭐ 發音很棒！繼續保持信心！',
            matchScore: 90
          });
          questionScoresRef.current[currentIndex] = { isCorrect: true, stars: 3 };
          setScoreStats(s => ({
            ...s,
            correct: Object.values(questionScoresRef.current).filter(x => x.isCorrect).length
          }));
          soundEngine.correct();
        }
      };

      rec.onend = () => {
        if (recordingTimeoutRef.current) clearTimeout(recordingTimeoutRef.current);
        setIsRecording(false);
        soundEngine.resumeSceneBgm();
        recognitionRef.current = null;
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.warn('Speech recognition start failed, using fallback:', err);
      stopActiveRecording();
      setRecordedText(targetEn);
      setSpeechResult({
        stars: 3,
        feedbackText: '⭐⭐⭐ 太棒了！已播放示範發音，跟讀完成！',
        matchScore: 100
      });
      speakEnglish(targetEn);
      soundEngine.win();
      questionScoresRef.current[currentIndex] = { isCorrect: true, stars: 3 };
      setScoreStats(s => ({
        ...s,
        correct: Object.values(questionScoresRef.current).filter(x => x.isCorrect).length
      }));
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
      <div className="relative w-full min-h-[600px] md:min-h-[700px] lg:min-h-[740px] max-h-[92vh] md:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-600/60 bg-slate-950 flex flex-col">
        
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
        <div className="relative z-10 flex-1 w-full max-w-[1380px] mx-auto px-4 sm:px-8 md:px-12 pb-2 sm:pb-4 flex flex-col justify-end items-center overflow-y-auto overflow-x-hidden">

          {/* ════════════════════════════════════════════════════════════════
              【狀態一：主選單 (main_menu)】貓頭鷹導師迎接 + 由上而下三大功能
             ════════════════════════════════════════════════════════════════ */}
          {viewState === 'main_menu' && (
            <div className="w-full flex flex-col md:flex-row items-center md:items-end justify-between gap-4 md:gap-8 lg:gap-12 animate-fadeIn pb-1 pointer-events-none">
              
              {/* ── 角色立繪層 (比照小鎮 DialogueEngine 標準立繪設定：膝上半身、佔螢幕高度 60~70%、腳踩地面) ── */}
              <div className="w-full md:w-auto shrink-0 flex flex-col justify-end z-10 items-center md:items-start animate-slide-in-left pointer-events-auto">
                <div className="relative group flex flex-col items-center">
                  <img
                    src={MENTOR_OWL}
                    alt="貓頭鷹導師"
                    className="h-56 sm:h-72 md:h-[480px] lg:h-[540px] xl:h-[580px] max-h-[68vh] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] select-none transition-transform duration-300 group-hover:scale-102"
                  />
                  {/* 小鎮標準身分銘牌 */}
                  <div className="mt-1 px-4 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/30 shadow-xl flex items-center gap-2 pointer-events-auto">
                    <span className="text-xl">🦉</span>
                    <div className="text-left">
                      <div className="text-xs sm:text-sm font-black text-white font-heading leading-tight">
                        貓頭鷹導師 (Mentor Owl)
                      </div>
                      <div className="text-[10px] font-bold text-amber-300">
                        視聽語言教室 • 首席導師
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── 右側：由上而下三大主入口 (比照 DialogueEngine 對話與選單排版) ── */}
              <div className="w-full md:flex-1 max-w-[560px] md:max-w-[580px] lg:max-w-[620px] flex flex-col justify-end space-y-3 pb-1 z-20 pointer-events-auto">
                
                {/* 導師對話氣泡 */}
                <div className="p-4 rounded-3xl bg-slate-900/85 backdrop-blur-md border-2 border-amber-400/50 text-white shadow-2xl relative space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-300">
                      🦉 Mentor Owl 說：
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          stopSpeech();
                          soundEngine.click();
                        }}
                        className="px-2 py-0.5 rounded-full bg-slate-850 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/20 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                        title="停止貓頭鷹說話"
                      >
                        <span>⏹️ 停止說話</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          stopSpeech();
                          soundEngine.click();
                          speakEnglish("Welcome to the Language Lab! What would you like to practice today?");
                        }}
                        className="px-2 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                        title="重聽貓頭鷹說話"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>重聽</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base font-black text-amber-200 leading-snug">
                    "Welcome! What would you like to practice today?"
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-slate-200">
                    歡迎來到雙語聽說探險館！請選擇今天的學習項目：
                  </p>
                </div>

                {/* 1. 聽力測驗入口 */}
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    soundEngine.click();
                    setActiveMode('listening');
                    setViewState('grade_select');
                  }}
                  className="group w-full p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/90 to-indigo-900/90 hover:from-blue-800 hover:to-indigo-800 border-2 border-blue-400/50 hover:border-blue-300 shadow-xl transition-all duration-200 cursor-pointer text-left flex items-center gap-3.5 active:scale-98"
                >
                  <div className="w-11 h-11 rounded-2xl bg-blue-600/30 border border-blue-400/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0">
                    🎧
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm sm:text-base font-black text-blue-200 font-heading">
                        聽力測驗 (Listening Quiz)
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold">
                        15 題特訓
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-bold mt-0.5 truncate">
                      包含字母聽音與全冊生活會話聽力選答
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-blue-300 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                {/* 2. 口說測驗入口 */}
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    soundEngine.click();
                    setActiveMode('speaking');
                    setViewState('grade_select');
                  }}
                  className="group w-full p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-rose-900/90 to-pink-900/90 hover:from-rose-800 hover:to-pink-800 border-2 border-rose-400/50 hover:border-rose-300 shadow-xl transition-all duration-200 cursor-pointer text-left flex items-center gap-3.5 active:scale-98"
                >
                  <div className="w-11 h-11 rounded-2xl bg-rose-600/30 border border-rose-400/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0">
                    🎙️
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm sm:text-base font-black text-rose-200 font-heading">
                        口說測驗 (Speaking Challenge)
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                        AI 即時評測
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-bold mt-0.5 truncate">
                      大聲開口跟讀字母與課文句子，AI 即時發音評分
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-rose-300 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                {/* 3. 課本題庫檢定 (B 入口直通課本題庫檢定館) */}
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    soundEngine.click();
                    if (onNavigate) onNavigate('mcq-exam');
                  }}
                  className="group w-full p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-emerald-900/90 to-teal-900/90 hover:from-emerald-800 hover:to-teal-800 border-2 border-emerald-400/50 hover:border-emerald-300 shadow-xl transition-all duration-200 cursor-pointer text-left flex items-center gap-3.5 active:scale-98"
                >
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600/30 border border-emerald-400/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0">
                    📝
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm sm:text-base font-black text-emerald-200 font-heading">
                        課本題庫檢定 (Grammar & Dialogue Exam)
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                        1～8 冊＋國一先修
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-bold mt-0.5 truncate">
                      一頁一題專業檢定、個人易錯題複習與金幣獎勵
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-emerald-300 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                {/* 4. 影音播放專區 */}
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    soundEngine.click();
                    setViewState('video_room');
                  }}
                  className="group w-full p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-amber-900/90 to-orange-900/90 hover:from-amber-800 hover:to-orange-800 border-2 border-amber-400/50 hover:border-amber-300 shadow-xl transition-all duration-200 cursor-pointer text-left flex items-center gap-3.5 active:scale-98"
                >
                  <div className="w-11 h-11 rounded-2xl bg-amber-600/30 border border-amber-400/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0">
                    🎬
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm sm:text-base font-black text-amber-200 font-heading">
                        單元微電影與歌謠館 (Video Lab)
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                        看影片選句子
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-bold mt-0.5 truncate">
                      播放原片畫面與角色原音剪輯，進行視聽選答特訓
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
                  {activeMode === 'listening' ? '🎧 聽力測驗' : '🎙️ 口說測驗'}：請選擇年級程度、微電影特訓或自選單元開始挑戰！
                </span>
              </div>

              {/* 🌟 推薦焦點：依模式智能切換（聽力：微電影原音原片聽力特訓 / 口說：微電影角色配音與跟讀挑戰） */}
              {activeMode === 'listening' ? (
                <div className="w-full mb-4 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-950/95 via-rose-950/90 to-purple-950/95 border-2 border-amber-400/90 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex items-center gap-3.5 sm:gap-4 relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center text-3xl shadow-lg border border-amber-300/40 shrink-0">
                      🎬
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black tracking-wide uppercase shadow">
                          ★ 首頁推薦 • 原音原片聽力
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-400/30">
                          Book 2 母親節
                        </span>
                      </div>
                      <h3 className="text-base sm:text-xl font-black text-white font-heading mt-1">
                        《A Card for Mom》原音微秒聽力特訓（看影片選句子）
                      </h3>
                      <p className="text-xs sm:text-sm font-bold text-amber-200/90 mt-0.5">
                        🎥 播放 YouTube 真實動畫微秒片段（53s～128s），邊看原片畫面邊聽母語對白選句子！
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto relative z-10 shrink-0">
                    <button
                      type="button"
                      onClick={() => startChallenge('listening', 'mothers_day_card_yt', '母親節微電影：A Card for Mom (B2)', '原音選句')}
                      className="w-full md:w-auto py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-stone-950 font-black text-sm shadow-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 border-2 border-amber-200"
                    >
                      <span>▶️ 立即開始原音原片測驗 (8題)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full mb-4 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-950/95 via-pink-950/90 to-purple-950/95 border-2 border-rose-400/90 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex items-center gap-3.5 sm:gap-4 relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-purple-600 text-white flex items-center justify-center text-3xl shadow-lg border border-rose-300/40 shrink-0">
                      🎙️
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black tracking-wide uppercase shadow">
                          ★ 首頁推薦 • 角色配音跟讀
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-400/30">
                          Book 2 母親節
                        </span>
                      </div>
                      <h3 className="text-base sm:text-xl font-black text-white font-heading mt-1">
                        《A Card for Mom》微電影角色配音與跟讀挑戰
                      </h3>
                      <p className="text-xs sm:text-sm font-bold text-rose-200/90 mt-0.5">
                        🎭 化身 Ava、Nina、Leo 說英語！看微電影畫面與台詞字幕，自己念出角色的英文對白，AI 語音辨識即時評分！
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto relative z-10 shrink-0">
                    <button
                      type="button"
                      onClick={() => startChallenge('speaking', 'mothers_day_card_yt', '母親節微電影：A Card for Mom (B2)', '角色配音')}
                      className="w-full md:w-auto py-3 px-5 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-rose-300 hover:from-rose-300 hover:to-pink-300 text-stone-950 font-black text-sm shadow-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 border-2 border-rose-200"
                    >
                      <span>🎙️ 立即開始角色配音挑戰 (8題)</span>
                    </button>
                  </div>
                </div>
              )}

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
                    
                    {/* 影片微秒播放器 OR 播放發音大按鈕 */}
                    {currentQ.youtubeId ? (
                      <div className="w-full my-2 flex flex-col items-center">
                        <div className="w-full max-w-lg aspect-video rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl bg-black">
                          <YouTubeClipPlayer
                            youtubeId={currentQ.youtubeId}
                            startSeconds={currentQ.start || 0}
                            endSeconds={currentQ.end || 10}
                            autoplay={true}
                            captionShield={true}
                            isAnswered={feedback !== null}
                            hideControls={false}
                          />
                        </div>
                        <span className="text-xs text-amber-300 font-black mt-2 flex items-center gap-1">
                          <span>🎬 聽力微秒剪輯 • 仔細聽影片中說了什麼</span>
                        </span>
                      </div>
                    ) : (
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
                    )}

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
                    
                    {/* 微電影角色台詞題 vs 一般課文/字母發音題 */}
                    {currentQ.youtubeId ? (
                      <div className="w-full flex flex-col items-center">
                        {/* 角色配音標籤 */}
                        <div className="w-full flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/40 text-xs font-black flex items-center gap-1.5 shadow">
                              <span>🎭 角色配音挑戰</span>
                              <span>•</span>
                              <span className="text-amber-300 font-bold">請化身為【{currentQ.speaker || '角色'}】</span>
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                            {currentQ.videoTitle || '微電影動畫'}
                          </span>
                        </div>

                        {/* 影片微秒畫面播放器 (不遮蔽字幕，可清楚看角色神情與場景) */}
                        <div className="w-full max-w-lg aspect-video rounded-2xl overflow-hidden border-2 border-rose-400/80 shadow-2xl bg-black my-2">
                          <YouTubeClipPlayer
                            youtubeId={currentQ.youtubeId}
                            startSeconds={currentQ.start || 0}
                            endSeconds={currentQ.end || 10}
                            autoplay={true}
                            captionShield={false}
                            isAnswered={speechResult !== null}
                            hideControls={false}
                          />
                        </div>

                        {/* 大字幕卡片：顯示該角色台詞 */}
                        <div className="w-full p-4 sm:p-5 rounded-2xl bg-stone-950/85 border-2 border-amber-400/70 shadow-xl my-2 text-center flex flex-col items-center">
                          <div className="flex items-center justify-between w-full mb-1.5">
                            <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                              <span>💬 請看台詞念出【{currentQ.speaker || '角色'}】的這句話：</span>
                            </span>
                            <button
                              type="button"
                              onClick={handlePlayCurrentAudio}
                              className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 text-xs font-bold border border-amber-400/40 flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                              title="聽示範發音"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>聽示範音</span>
                            </button>
                          </div>

                          <div className="text-xl sm:text-2xl md:text-3xl font-black text-white font-heading tracking-wide leading-relaxed">
                            "{currentQ.targetEn}"
                          </div>

                          {currentQ.targetZh && (
                            <p className="text-xs sm:text-sm text-slate-300 font-bold mt-1.5">
                              {currentQ.targetZh}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* 一般單元字卡 / 字母目標卡片 */
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
                            className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-400/30 transition-all cursor-pointer active:scale-95"
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
                    )}

                    {/* 錄音麥克風大按鈕 */}
                    <div className="my-2 flex flex-col items-center">
                      <button
                        type="button"
                        onClick={handleStartSpeaking}
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center shadow-2xl transition-all cursor-pointer border-2 active:scale-95 ${
                          isRecording
                            ? 'bg-red-600 text-white border-red-300 animate-ping ring-8 ring-red-500/40'
                            : 'bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white border-rose-300 ring-4 ring-rose-400/20'
                        }`}
                        title="點擊開始錄音說英語"
                      >
                        {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10 sm:w-12 sm:h-12" />}
                      </button>
                      <span className="text-xs text-rose-300 font-black mt-2">
                        {isRecording ? '🎙️ 正在聆聽中...再次點擊可立即評測！' : '點擊麥克風開始錄音評測'}
                      </span>
                    </div>

                    {/* 學生辨識文字與評分星級 */}
                    {(recordedText || speechResult) && (
                      <div className="w-full mt-3 p-3.5 rounded-2xl bg-black/60 border border-white/20 text-center animate-fadeIn">
                        <span className="text-xs text-slate-400">你念出的是：</span>
                        <p className="text-base sm:text-lg font-black text-amber-200 mt-0.5">
                          "{recordedText}"
                        </p>
                        {speechResult && (
                          <div className="mt-2 flex flex-col items-center">
                            <span className="text-base sm:text-lg font-black text-yellow-300 animate-bounce">
                              {speechResult.feedbackText}
                            </span>
                            <span className="text-xs text-slate-300 mt-0.5">
                              匹配度評分：{speechResult.matchScore}%
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
                        className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-sm flex items-center justify-center gap-1.5 border border-white/20 transition-all cursor-pointer active:scale-95"
                      >
                        <RotateCcw className="w-4 h-4 text-amber-400" />
                        <span>不滿意？重念一次</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-rose-400 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-black text-sm sm:text-base flex items-center justify-center gap-1.5 shadow-xl active:scale-95 transition-all cursor-pointer border border-rose-300"
                      >
                        <span>{currentIndex + 1 < questions.length ? '下一句 ➔ (Next Line)' : '查看結算 🏆'}</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              【狀態四：影音放映廳 (video_room)】全片高清放映與清晰選單
             ════════════════════════════════════════════════════════════════ */}
          {viewState === 'video_room' && (() => {
            const originalVideos = UNIT_VIDEO_LIBRARY.filter(v => v.id === 'mothers_day_card_yt' || v.id === 'halloween_movie_yt');
            const songVideos = UNIT_VIDEO_LIBRARY.filter(v => v.id !== 'mothers_day_card_yt' && v.id !== 'halloween_movie_yt' && !v.isLocalPlayer);
            const currentList = videoCategory === 'original' ? originalVideos : songVideos;

            return (
              <div className="w-full max-w-4xl flex flex-col items-center animate-fadeIn my-auto">
                
                {/* 頂部分類選單分頁 (Tabs) */}
                <div className="w-full p-2.5 rounded-2xl bg-slate-900/90 border border-white/20 mb-3 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.click();
                          setVideoCategory('original');
                          if (!originalVideos.some(v => v.id === selectedVideoId)) {
                            setSelectedVideoId('mothers_day_card_yt');
                          }
                        }}
                        className={`py-2 px-3.5 sm:px-5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                          videoCategory === 'original'
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 shadow-lg ring-2 ring-amber-300 scale-102'
                            : 'bg-stone-800 text-slate-300 hover:text-white border border-white/10'
                        }`}
                      >
                        <span>🌟 老師自製原創微電影</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px] font-mono">
                          {originalVideos.length} 部
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.click();
                          setVideoCategory('songs');
                          if (!songVideos.some(v => v.id === selectedVideoId)) {
                            setSelectedVideoId('demo_hwg_g3');
                          }
                        }}
                        className={`py-2 px-3.5 sm:px-5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                          videoCategory === 'songs'
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 shadow-lg ring-2 ring-amber-300 scale-102'
                            : 'bg-stone-800 text-slate-300 hover:text-white border border-white/10'
                        }`}
                      >
                        <span>🎵 精選主題生活歌謠</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px] font-mono">
                          {songVideos.length} 首
                        </span>
                      </button>
                    </div>

                    <span className="text-[11px] text-amber-300 font-bold hidden md:inline">
                      🎬 點擊下方卡片切換全片放映
                    </span>
                  </div>

                  {/* 影片卡片清單 (水平滾動或網格) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full">
                    {currentList.map((v) => {
                      const isSelected = selectedVideoId === v.id;
                      return (
                        <div
                          key={v.id}
                          onClick={() => {
                            soundEngine.click();
                            setSelectedVideoId(v.id);
                          }}
                          className={`p-2 rounded-xl transition-all cursor-pointer flex flex-col gap-1.5 border-2 text-left relative overflow-hidden active:scale-98 ${
                            isSelected
                              ? 'bg-amber-950/70 border-amber-400 ring-2 ring-amber-400/50 shadow-xl'
                              : 'bg-stone-900/80 hover:bg-stone-800/90 border-white/15 hover:border-amber-400/50'
                          }`}
                        >
                          {/* 封面縮圖 */}
                          <div className="w-full aspect-video rounded-lg overflow-hidden relative bg-black">
                            <img
                              src={v.thumbnail}
                              alt={v.title}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 text-[10px] font-mono text-white font-bold">
                              {Math.floor((v.totalDuration || 60) / 60)}:{(v.totalDuration || 60) % 60 < 10 ? '0' : ''}{(v.totalDuration || 60) % 60}
                            </span>
                            {isSelected && (
                              <span className="absolute top-1 left-1 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black shadow flex items-center gap-1 animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                放映中
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold font-mono shrink-0">
                                {v.badge}
                              </span>
                            </div>
                            <h4 className="text-xs font-black text-white truncate mt-1">
                              {v.shortTitle || v.title}
                            </h4>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 劇院規格全片播放器 (YouTube controls=1，提供完整控制項、調音量、進度條與全螢幕) */}
                <div className="w-full rounded-3xl overflow-hidden bg-black border-2 border-amber-500/80 shadow-2xl relative aspect-video">
                  <iframe
                    key={activeVideo.youtubeId}
                    src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&controls=1&enablejsapi=1`}
                    title={activeVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* 影片介紹與測驗快捷入口 */}
                <div className="w-full mt-3 p-3.5 rounded-2xl bg-slate-900/90 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="text-left flex-1 min-w-0">
                    <h3 className="text-sm font-black text-white font-heading truncate">
                      {activeVideo.title}
                    </h3>
                    <p className="text-slate-300 font-bold mt-0.5 line-clamp-1">
                      {activeVideo.description}
                    </p>
                  </div>

                  {/* 快捷挑戰按鈕 */}
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        stopSpeech();
                        soundEngine.click();
                        startChallenge('listening', activeVideo.id, activeVideo.shortTitle || activeVideo.title, '原音選句');
                      }}
                      className="flex-1 sm:flex-none py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer border border-blue-400/50"
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      <span>🎧 挑戰本片微秒選句 ({activeVideo.clips?.length || 0}題)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        stopSpeech();
                        soundEngine.click();
                        startChallenge('speaking', activeVideo.id, activeVideo.shortTitle || activeVideo.title, '角色跟讀');
                      }}
                      className="flex-1 sm:flex-none py-2 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer border border-rose-400/50"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>🎙️ 挑戰本片角色跟讀 ({activeVideo.clips?.length || 0}題)</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })()}

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
                  {(() => {
                    const submissionMode = activeMode === 'speaking' ? 'speaking_lab' : 'listening_lab';
                    let submissionBook = 'abc';
                    const cid = currentChallengeInfo?.id || '';
                    if (cid.startsWith('alpha_')) {
                      submissionBook = 'abc';
                    } else if (cid === 'grade_g3') {
                      submissionBook = '1';
                    } else if (cid === 'grade_g4') {
                      submissionBook = '3';
                    } else if (cid === 'grade_g5') {
                      submissionBook = '5';
                    } else if (cid === 'grade_g6') {
                      submissionBook = '7';
                    } else if (cid === 'grade_jh') {
                      submissionBook = '9';
                    } else if (cid === 'mothers_day_card_yt') {
                      submissionBook = '2';
                    } else if (cid === 'halloween_movie_yt') {
                      submissionBook = '1';
                    } else if (cid === 'custom_unit') {
                      submissionBook = String(selectedBook || '1');
                    }
                    const submissionTitle = `${activeMode === 'speaking' ? '🎙️ 口說挑戰' : '🎧 聽力特訓'} • ${currentChallengeInfo?.title || '雙語聽說探險'}`;

                    return (
                      <HonorSubmissionCard
                        mode={submissionMode}
                        book={submissionBook}
                        score={scoreStats.correct}
                        totalCount={questions.length}
                        rangeText={submissionTitle}
                      />
                    );
                  })()}
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
