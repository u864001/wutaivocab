import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';
import { soundEngine, speakEnglish } from '../../services/audio';
import { moleBgm } from '../../services/moleBgm';
import { FALLBACK_WORDS } from '../../services/supabase';
import confetti from 'canvas-confetti';
import {
  ArrowLeft, Heart, Timer, Trophy, Sparkles, RefreshCw,
  AlertTriangle, Volume2, Flame, Award, Zap
} from 'lucide-react';

const STAGE_BG = '/assets/mole/stage_bg.jpg';
const MOLE_NORMAL = '/assets/mole/mole_normal.png';
const MOLE_DIZZY = '/assets/mole/mole_dizzy.png';
const MOLE_GOLD = '/assets/mole/mole_gold.png';
const MOLE_PRANK = '/assets/mole/mole_prank.png';

// 9 個自然地洞精準幾何座標百分比 (與 stage_bg.jpg 背景石圈 100% 貼合，上中下三排柱狀感應區完全獨立互不交疊)
const HOLE_POSITIONS = [
  // 上排（遠景 3 洞：y: 50.5%, height: 12.5%, zIndex: 10）
  { id: 0, x: 37.8, y: 50.8, width: 13, height: 12.5, zIndex: 10 },
  { id: 1, x: 50.0, y: 50.2, width: 13, height: 12.5, zIndex: 10 },
  { id: 2, x: 62.5, y: 50.8, width: 13, height: 12.5, zIndex: 10 },
  // 中排（中景 3 洞：y: 61.5%, height: 11.2%, zIndex: 20）
  { id: 3, x: 34.6, y: 61.2, width: 15, height: 11.2, zIndex: 20 },
  { id: 4, x: 50.0, y: 61.8, width: 15, height: 11.2, zIndex: 20 },
  { id: 5, x: 65.4, y: 61.2, width: 15, height: 11.2, zIndex: 20 },
  // 下排（近景 3 洞：y: 76.5%, height: 14.0%, zIndex: 30）
  { id: 6, x: 31.6, y: 75.8, width: 17, height: 14.0, zIndex: 30 },
  { id: 7, x: 50.0, y: 76.5, width: 17, height: 14.0, zIndex: 30 },
  { id: 8, x: 68.4, y: 75.8, width: 17, height: 14.0, zIndex: 30 }
];

export const WhackAMoleGame = ({
  settings,
  words = [],
  qualifyingBook,
  onBack
}) => {
  // ── 1. 遊戲單字庫建置（低年級字母模式 vs 中高年級單字模式） ──
  const isAlphabetMode = useMemo(() => {
    return settings?.alphaMode || (settings?.selectedUnits && settings.selectedUnits.includes('abc'));
  }, [settings]);

  const rawWordPool = useMemo(() => {
    if (isAlphabetMode) {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      return letters.map(char => ({
        word: char,
        wordZh: `字母 ${char}`,
        pronounce: char
      }));
    }

    const rawList = (!words || words.length === 0) ? FALLBACK_WORDS : words;
    let filtered = rawList;
    if (settings?.selectedUnits && settings.selectedUnits.length > 0) {
      const subset = rawList.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
      if (subset.length >= 4) filtered = subset;
    }

    const normalized = filtered.map(w => ({
      word: (w.en || w.word || '').trim(),
      wordZh: (w.zh || w.meaning || w.wordZh || '').trim()
    })).filter(w => w.word && w.wordZh);

    if (normalized.length >= 4) return normalized;

    // 備援單字庫
    return [
      { word: 'bag', wordZh: '書包' },
      { word: 'pencil', wordZh: '鉛筆' },
      { word: 'eraser', wordZh: '橡皮擦' },
      { word: 'book', wordZh: '書本' },
      { word: 'ruler', wordZh: '直尺' },
      { word: 'pen', wordZh: '原子筆' },
      { word: 'pencil case', wordZh: '鉛筆盒' },
      { word: 'marker', wordZh: '彩色筆' }
    ];
  }, [isAlphabetMode, words, settings?.selectedUnits]);

  // ── 2. 智慧錯題沉底加權題庫管理 (Leitner 抽認卡間隔記憶) ──
  const untestedQueueRef = useRef([]);
  const retryPoolRef = useRef([]);

  const initQueues = useCallback(() => {
    untestedQueueRef.current = [...rawWordPool].sort(() => 0.5 - Math.random());
    retryPoolRef.current = [];
  }, [rawWordPool]);

  // ── 3. 遊戲核心狀態 ──
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'gameover'
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60); // 60 秒挑戰
  const [roundIndex, setRoundIndex] = useState(0);

  // 當前目標題目
  const [currentTarget, setCurrentTarget] = useState(null);

  // 9 個地洞即時狀態
  // hole: null | { word, wordZh, isTarget, isGold, isPrank, status: 'emerging'|'visible'|'retreating'|'hit', hitResult: '+10'|'+60'|'-10'|'BOMB' }
  const [holes, setHoles] = useState(() => Array(9).fill(null));

  // 震動特效狀態
  const [isShaking, setIsShaking] = useState(false);

  // 全場換題鎖定標誌（防止多指同時點擊誤觸）
  const isTransitioningRef = useRef(false);

  // 即時剩餘秒數參照（供地鼠派發讀取難度，絕不放入 useCallback 依賴以防每秒連鎖重抽換題）
  const timeLeftRef = useRef(60);

  // 換題發動函數參照
  const startNextQuestionRef = useRef(null);

  // 是否已初次載入啟動
  const hasStartedRef = useRef(false);

  // 題目序號參照 (第 1 題開始計數)
  const questionCountRef = useRef(0);

  // 黃金鼠累積機率參照 (第 6 題起從 10% 開始，每題 +3%)
  const goldPityRateRef = useRef(0.10);

  // 當前地鼠計時器群組參照
  const moleTimersRef = useRef([]);

  const clearAllMoleTimers = useCallback(() => {
    moleTimersRef.current.forEach(t => clearTimeout(t));
    moleTimersRef.current = [];
  }, []);

  // ── 4. 是否處於最後 10 秒狂暴期 ──
  const isBerserk = useMemo(() => {
    return timeLeft <= 10 && timeLeft > 0 && gameState === 'playing';
  }, [timeLeft, gameState]);

  // 啟動純前端 Web Audio 地鼠背景音樂，並連動狂暴期加速
  useEffect(() => {
    if (gameState === 'playing') {
      moleBgm.start();
      moleBgm.setBerserk(isBerserk);
    } else {
      moleBgm.stop();
    }
  }, [gameState, isBerserk]);

  // 元件卸載時停止背景音樂並清除所有計時器
  useEffect(() => {
    return () => {
      moleBgm.stop();
      clearAllMoleTimers();
    };
  }, [clearAllMoleTimers]);

  // ── 5. 倒數 60 秒計時器（僅更新倒數數值，不影響題目生命週期） ──
  useEffect(() => {
    if (gameState !== 'playing') return;
    timeLeftRef.current = 60;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const nextVal = prev <= 1 ? 0 : prev - 1;
        timeLeftRef.current = nextVal;
        if (nextVal === 0) {
          clearInterval(timer);
          triggerGameOver('timeup');
        }
        return nextVal;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  // ── 6. 挑選下一題（35% 機率抽錯題池，65% 抽新題；待測庫抽空則自動循環） ──
  const getNextWord = useCallback(() => {
    if (retryPoolRef.current.length > 0 && Math.random() < 0.35) {
      // 從錯題池抽題
      const idx = Math.floor(Math.random() * retryPoolRef.current.length);
      return retryPoolRef.current[idx];
    }

    if (untestedQueueRef.current.length === 0) {
      // 重新灌入題目，無限循環
      untestedQueueRef.current = [...rawWordPool].sort(() => 0.5 - Math.random());
    }

    return untestedQueueRef.current.pop() || rawWordPool[0];
  }, [rawWordPool]);

  // ── 7. 正解超時未點擊處理 (Miss Timeout) ──
  const handleMissTimeout = useCallback((missedTarget) => {
    if (isTransitioningRef.current || gameState !== 'playing') return;
    isTransitioningRef.current = true;
    clearAllMoleTimers();

    // 中斷連擊
    setCombo(0);

    // 將該錯過題目沉入錯題複習池
    if (!retryPoolRef.current.some(w => w.word === missedTarget.word)) {
      retryPoolRef.current.push(missedTarget);
    }

    // 全場所有活動地鼠平滑下沉
    setHoles(curr => curr.map(h => h ? { ...h, status: 'retreating' } : null));

    setTimeout(() => {
      setHoles(Array(9).fill(null));
      setRoundIndex(r => r + 1);
      startNextQuestionRef.current?.();
    }, 450);
  }, [gameState, clearAllMoleTimers]);

  // ── 8. 派發地鼠核心機制（依時間推進動態難度，不綁定每秒更新） ──
  const spawnMolesForTarget = useCallback((targetWord) => {
    if (gameState !== 'playing' || !targetWord) return;

    clearAllMoleTimers();
    isTransitioningRef.current = false;

    // 難度參數計算（透過 timeLeftRef 讀取即時秒數，避免每秒觸發 hook 重新建立）：
    // 前 25 秒：2 隻（1正解 + 1誘答），停留 4.8 ~ 5.4 秒
    // 25~50 秒：3 隻（1正解 + 2誘答/炸彈），停留 4.0 ~ 4.6 秒
    // 最後 10 秒（狂暴期）：3 ~ 4 隻，停留 3.0 ~ 3.4 秒
    const currentSecs = timeLeftRef.current;
    const isLateGame = currentSecs <= 35;
    const isLastBurst = currentSecs <= 10;

    const moleCount = isLastBurst ? (Math.random() < 0.5 ? 4 : 3) : isLateGame ? 3 : 2;
    const baseDuration = isLastBurst ? 3200 : isLateGame ? 4200 : 5000;

    // 隨機選取不重複的洞穴索引
    const shuffledHoles = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => 0.5 - Math.random());
    const selectedHoleIndices = shuffledHoles.slice(0, moleCount);

    const targetHoleIdx = selectedHoleIndices[0];
    const distractorHoleIndices = selectedHoleIndices.slice(1);

    // 挑選干擾單字
    const distractors = rawWordPool
      .filter(w => w.word !== targetWord.word)
      .sort(() => 0.5 - Math.random())
      .slice(0, distractorHoleIndices.length);

    // 題目序號遞增
    questionCountRef.current += 1;
    const currentQ = questionCountRef.current;

    // ── 黃金鼠動態機率階梯計算 ──
    // 第 1 ~ 4 題：0%
    // 第 5 題：100% 必出
    // 第 6 題起：基準 10%，每題遞增 +3% (10%, 13%, 16%, 19%...)
    // 出現後立即重置回 10% 重新累加
    let isGoldSpawn = false;
    if (currentQ < 5) {
      isGoldSpawn = false;
    } else if (currentQ === 5) {
      isGoldSpawn = true;
      goldPityRateRef.current = 0.10; // 第 5 題保底後重置
    } else {
      const chance = Math.min(1.0, goldPityRateRef.current);
      if (Math.random() < chance) {
        isGoldSpawn = true;
        goldPityRateRef.current = 0.10; // 出現後下一題重置回 10%
      } else {
        isGoldSpawn = false;
        goldPityRateRef.current = Math.min(1.0, goldPityRateRef.current + 0.03); // 未出現則累加 3%
      }
    }

    // 蜂巢搗蛋鼠（前 15 秒不出現，非黃金鼠時 18% 機率）
    const isPrankSpawn = !isGoldSpawn && currentSecs <= 45 && Math.random() < 0.18;

    // 組裝初始地鼠狀態（進入 'emerging' 狀態）
    const nextHoles = Array(9).fill(null);

    // 正解地鼠（停留約 4.8 ~ 5.5 秒）
    const targetDuration = baseDuration + Math.floor(Math.random() * 450);
    nextHoles[targetHoleIdx] = {
      word: targetWord.word,
      wordZh: targetWord.wordZh,
      isTarget: true,
      isGold: isGoldSpawn,
      isPrank: false,
      status: 'emerging',
      hitResult: null
    };

    // 誘答地鼠與炸彈鼠
    distractorHoleIndices.forEach((hIdx, i) => {
      const dist = distractors[i] || rawWordPool[0];
      const makePrank = isPrankSpawn && i === 0;
      nextHoles[hIdx] = {
        word: makePrank ? 'BEE!' : dist.word,
        wordZh: makePrank ? '蜂巢' : dist.wordZh,
        isTarget: false,
        isGold: false,
        isPrank: makePrank,
        status: 'emerging',
        hitResult: null
      };
    });

    setHoles(nextHoles);

    // 平滑探頭過渡：450ms 後由 'emerging' 進入 'visible'
    const emergeTimer = setTimeout(() => {
      setHoles(curr => {
        return curr.map(h => h ? { ...h, status: 'visible' } : null);
      });
    }, 450);
    moleTimersRef.current.push(emergeTimer);

    // 為每隻誘答地鼠設定各自獨立的超時縮回時間（帶有些許隨機秒數差距）
    distractorHoleIndices.forEach((hIdx) => {
      const indepDuration = baseDuration - 300 + Math.floor(Math.random() * 600);
      const distTimer = setTimeout(() => {
        setHoles(curr => {
          if (!curr[hIdx] || curr[hIdx].status === 'hit') return curr;
          const updated = [...curr];
          updated[hIdx] = { ...updated[hIdx], status: 'retreating' };
          return updated;
        });
        // 450ms 平滑縮回到底後清空該洞
        setTimeout(() => {
          setHoles(curr => {
            if (!curr[hIdx] || curr[hIdx].status !== 'retreating') return curr;
            const updated = [...curr];
            updated[hIdx] = null;
            return updated;
          });
        }, 450);
      }, indepDuration);
      moleTimersRef.current.push(distTimer);
    });

    // 正解地鼠超時判定：若時間到仍未被點擊，觸發 Miss 換題
    const targetExpireTimer = setTimeout(() => {
      handleMissTimeout(targetWord);
    }, targetDuration);
    moleTimersRef.current.push(targetExpireTimer);

  }, [gameState, rawWordPool, clearAllMoleTimers, handleMissTimeout]);

  // ── 9. 初始化與換題發動 ──
  const startNextQuestion = useCallback(() => {
    if (gameState !== 'playing') return;
    const nextTarget = getNextWord();
    setCurrentTarget(nextTarget);
    if (nextTarget?.word) {
      speakEnglish(nextTarget.word);
    }
    spawnMolesForTarget(nextTarget);
  }, [gameState, getNextWord, spawnMolesForTarget]);

  startNextQuestionRef.current = startNextQuestion;

  // 初始化啟動 (嚴格只在初次載入或重玩時執行一次，絕不受每秒計時器干擾)
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    initQueues();
    startNextQuestion();
  }, [initQueues, startNextQuestion]);

  // ── 10. 點擊判定處理 (Once-per-spawn 全局鎖定與全場平滑縮回) ──
  const handleWhack = (holeId) => {
    if (isTransitioningRef.current || gameState !== 'playing') return;

    const mole = holes[holeId];
    if (!mole || mole.status === 'hit' || mole.status === 'retreating') return;

    // 立即鎖定，防止多指連點
    isTransitioningRef.current = true;
    clearAllMoleTimers();

    // ── A. 擊中正解地鼠 ──
    if (mole.isTarget) {
      soundEngine.correct();
      speakEnglish(mole.word);

      // 得分計算：正解 10 分 + 連擊獎勵（黃金鼠 +60 分）
      const bonus = mole.isGold ? 50 : combo * 2;
      const earned = 10 + bonus;
      setScore(s => s + earned);

      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setMaxCombo(m => Math.max(m, nextCombo));

      if (nextCombo >= 3 && nextCombo % 3 === 0) {
        soundEngine.combo(Math.min(5, Math.floor(nextCombo / 3) + 1));
      }

      // 若為黃金鼠爆發紙花彩蛋
      if (mole.isGold) {
        confetti({ particleCount: 45, spread: 70, origin: { y: 0.6 } });
      }

      // 從錯題池移除畢業
      retryPoolRef.current = retryPoolRef.current.filter(w => w.word !== mole.word);

      // 當前命中地鼠切換為眼冒金星並跳出得分，其餘地鼠立即啟動平滑下沉
      setHoles(curr => {
        return curr.map((h, idx) => {
          if (!h) return null;
          if (idx === holeId) {
            return { ...h, status: 'hit', hitResult: mole.isGold ? '+60 🌟' : `+${earned} 💥` };
          }
          return { ...h, status: 'retreating' };
        });
      });

      // 450ms 後平滑切換下一題
      setTimeout(() => {
        setHoles(Array(9).fill(null));
        setRoundIndex(r => r + 1);
        startNextQuestion();
      }, 450);

    // ── B. 誤擊蜂巢搗蛋鼠 ──
    } else if (mole.isPrank) {
      soundEngine.wrong();
      setCombo(0);
      setScore(s => Math.max(0, s - 20));

      // 觸發畫面震動
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

      // 當前地鼠顯示爆炸，其餘地鼠平滑下沉
      setHoles(curr => {
        return curr.map((h, idx) => {
          if (!h) return null;
          if (idx === holeId) {
            return { ...h, status: 'hit', hitResult: '💣 BEE!' };
          }
          return { ...h, status: 'retreating' };
        });
      });

      // 扣除愛心
      setLives(l => {
        const nextLives = l - 1;
        if (nextLives <= 0) {
          setTimeout(() => triggerGameOver('dead'), 400);
          return 0;
        }
        // 生命尚存，沉降換下一題
        setTimeout(() => {
          setHoles(Array(9).fill(null));
          setRoundIndex(r => r + 1);
          startNextQuestion();
        }, 450);
        return nextLives;
      });

    // ── C. 誤擊其他誘答單字地鼠 ──
    } else {
      soundEngine.wrong();
      setCombo(0);
      setScore(s => Math.max(0, s - 10));

      // 將當前目標單字沉入錯題池
      if (currentTarget && !retryPoolRef.current.some(w => w.word === currentTarget.word)) {
        retryPoolRef.current.push(currentTarget);
      }

      // 當前地鼠標記錯叉，其餘地鼠平滑下沉
      setHoles(curr => {
        return curr.map((h, idx) => {
          if (!h) return null;
          if (idx === holeId) {
            return { ...h, status: 'hit', hitResult: '-10 ❌' };
          }
          return { ...h, status: 'retreating' };
        });
      });

      setTimeout(() => {
        setHoles(Array(9).fill(null));
        setRoundIndex(r => r + 1);
        startNextQuestion();
      }, 420);
    }
  };

  // ── 11. 遊戲結束判定 ──
  const triggerGameOver = (reason) => {
    clearAllMoleTimers();
    moleBgm.stop();
    setGameState('gameover');
    soundEngine.wrong();

    // 全體地鼠強制沉沒
    setHoles(curr => curr.map(h => h ? { ...h, status: 'retreating' } : null));
    setTimeout(() => setHoles(Array(9).fill(null)), 400);

    if (score >= 60) {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.5 } });
    }
  };

  const handleRestart = () => {
    soundEngine.click();
    clearAllMoleTimers();
    questionCountRef.current = 0;
    goldPityRateRef.current = 0.10;
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(3);
    setTimeLeft(60);
    timeLeftRef.current = 60;
    setRoundIndex(0);
    setHoles(Array(9).fill(null));
    initQueues();
    setGameState('playing');
    setTimeout(() => {
      startNextQuestion();
    }, 120);
  };

  return (
    <div className={`fixed inset-0 w-full h-[100dvh] bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none z-20 animate-fadeIn font-sans ${isShaking ? 'animate-shake' : ''}`}>
      
      {/* ── 內建關鍵幀動畫 ── */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          15% { transform: translate(-8px, 6px); }
          30% { transform: translate(8px, -6px); }
          45% { transform: translate(-6px, -4px); }
          60% { transform: translate(6px, 4px); }
          75% { transform: translate(-4px, 2px); }
        }
        .animate-shake {
          animation: shake 0.45s ease-in-out;
        }

        @keyframes goldAuraPulse {
          0%, 100% {
            filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.8)) drop-shadow(0 0 24px rgba(245, 158, 11, 0.6));
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(251, 191, 36, 1)) drop-shadow(0 0 38px rgba(245, 158, 11, 0.85));
            transform: scale(1.02);
          }
        }
        .animate-gold-aura {
          animation: goldAuraPulse 1.2s ease-in-out infinite;
        }
      `}</style>

      {/* ── 2D 實景手繪森林全螢幕大氣氛圍底圖（加強虛化景深，凸顯中央 16:9 核心舞台） ── */}
      <img
        src={STAGE_BG}
        alt="Whack-a-Mole Ambient Background"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none brightness-[0.55] blur-[12px] scale-105"
      />

      {/* 景深暗化遮罩 */}
      <div className="absolute inset-0 bg-slate-950/60 pointer-events-none" />

      {/* ════════════════════════════════════════════════════════════════
          【最後 10 秒狂暴期：向內血紅色霓虹呼吸燈暈】
         ════════════════════════════════════════════════════════════════ */}
      {isBerserk && (
        <div className="fixed inset-0 pointer-events-none z-40 border-[8px] sm:border-[14px] border-rose-600/80 shadow-[inset_0_0_80px_rgba(225,29,72,0.9)] animate-pulse transition-opacity duration-500" />
      )}

      {/* ════════════════════════════════════════════════════════════════
          【頂部 HUD 一體化儀表板】
         ════════════════════════════════════════════════════════════════ */}
      <header className="relative z-30 w-full px-3 sm:px-6 py-2 bg-slate-950/75 backdrop-blur-md border-b border-white/15 flex items-center justify-between shadow-xl shrink-0">
        
        {/* 左上角：返回大廳 + 石板得分碑 */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button3D variant="slate" size="sm" onClick={onBack} icon={ArrowLeft}>
            {typeof window !== 'undefined' && window.innerWidth < 640 ? '' : '回大廳'}
          </Button3D>

          <div className="px-3 py-1 rounded-xl bg-black/60 border border-amber-400/50 shadow-inner flex items-center gap-1.5 sm:gap-2">
            <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-300 hidden sm:inline">得分</span>
            <span className="text-base sm:text-lg font-mono font-black text-amber-300">
              {score}
            </span>
          </div>
        </div>

        {/* 中央出題牌（顯著出題文字 + 語音朗讀） */}
        {currentTarget && (
          <div className="flex items-center gap-2 sm:gap-3 px-3.5 sm:px-5 py-1.5 rounded-2xl bg-black/85 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)] backdrop-blur-md">
            <span className="text-xs sm:text-sm font-black text-emerald-300 hidden md:inline">
              🎯 尋找目標：
            </span>
            <span className="text-base sm:text-xl md:text-2xl font-heading font-black text-amber-300 tracking-wide drop-shadow">
              {currentTarget.wordZh}
            </span>
            {!isAlphabetMode && (
              <span className="text-xs sm:text-sm text-slate-300 font-mono font-bold hidden sm:inline">
                ({currentTarget.word})
              </span>
            )}
            <button
              type="button"
              onClick={() => speakEnglish(currentTarget.word)}
              className="p-1 sm:p-1.5 rounded-lg bg-emerald-500/30 hover:bg-emerald-500/60 text-emerald-200 transition-colors cursor-pointer"
              title="重聽發音"
            >
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}

        {/* 右上角：連擊能量瓶 + 愛心生命 + 倒數計時 */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* 連擊燃燒能量瓶 */}
          {combo > 1 && (
            <div className="px-2.5 sm:px-3 py-1 rounded-xl bg-gradient-to-r from-orange-500/30 to-amber-500/30 border border-orange-400/60 shadow-lg flex items-center gap-1 animate-pulse">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-mono font-black text-orange-200">
                {combo}連擊
              </span>
            </div>
          )}

          {/* 愛心生命條 */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/60 border border-rose-400/40">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${
                  i < lives
                    ? 'text-rose-500 fill-rose-500 scale-100'
                    : 'text-slate-600 scale-90'
                }`}
              />
            ))}
          </div>

          {/* 60 秒倒數日晷 (最後 10 秒高亮閃爍) */}
          <div className={`px-2.5 sm:px-3 py-1 rounded-xl border font-mono font-black text-xs sm:text-sm flex items-center gap-1 ${
            isBerserk
              ? 'bg-rose-950/80 border-rose-400 text-rose-300 ring-2 ring-rose-500/50 animate-bounce'
              : 'bg-black/60 border-white/20 text-amber-300'
          }`}>
            <Timer className={`w-3.5 h-3.5 ${isBerserk ? 'text-rose-400' : 'text-amber-400'}`} />
            <span>{timeLeft}s</span>
          </div>

        </div>

      </header>

      {/* 狂暴期醒目標語提醒 */}
      {isBerserk && (
        <div className="relative z-30 w-full py-0.5 bg-rose-600 text-white text-center font-black text-xs sm:text-sm tracking-widest uppercase shadow-md animate-pulse">
          🔥 狂暴最後衝刺！老鼠加速冒出！ 🔥
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          【主舞台：16:9 比例地穴實景 ＆ 固定柱狀獨立 Hitbox (背景圖與地穴 1:1 絕對鎖定)】
         ════════════════════════════════════════════════════════════════ */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto p-2 sm:p-4 flex items-center justify-center overflow-hidden">
        
        {/* 16:9 比例地穴互動舞台 (背景圖與 9 穴嚴格綁定在同一容器，任何螢幕都不移位) */}
        <div className="relative w-full aspect-[16/9] max-h-[78vh] rounded-3xl overflow-hidden shadow-[0_12px_45px_rgba(0,0,0,0.85)] border-2 border-emerald-500/30">
          
          {/* 舞台背景實景手繪圖 (100% 絕對鋪滿容器，石圈孔洞與地鼠 100% 錨定) */}
          <img
            src={STAGE_BG}
            alt="Whack-a-Mole Stage"
            className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none brightness-[0.94] contrast-[1.05]"
          />

          {/* 景深暗化柔光遮罩 */}
          <div className="absolute inset-0 bg-slate-950/15 pointer-events-none" />

          {/* 9 個固定自然地穴柱狀互動區域 */}
          {HOLE_POSITIONS.map((holePos) => {
            const holeMole = holes[holePos.id];
            const hasActiveMole = holeMole !== null && holeMole.status !== 'hidden';

            // 動態垂直位移：emerging/visible/hit 為 0 (探出)，retreating 為 full (沉入地洞)
            const isEmerged = hasActiveMole && (holeMole.status === 'emerging' || holeMole.status === 'visible' || holeMole.status === 'hit');

            return (
              <div
                key={holePos.id}
                style={{
                  left: `${holePos.x}%`,
                  top: `${holePos.y}%`,
                  transform: 'translate(-50%, -96%)',
                  zIndex: holePos.zIndex,
                  width: `${holePos.width}%`,
                  height: `${holePos.height}%`
                }}
                /* 
                   【核心架構：獨立柱狀 Hitbox】
                   只要該洞有安排老鼠，整根垂直柱狀區域均為唯一獨立點擊區（剛露頭亦可點擊），
                   垂直高度依景深分區完全獨立（上排、中排、下排完全不相交），前後左右 100% 絕不交疊遮蔽！
                   無老鼠時 pointer-events: none 完全穿透。
                */
                onClick={() => hasActiveMole && handleWhack(holePos.id)}
                className={`absolute flex flex-col justify-end items-center cursor-pointer select-none ${
                  hasActiveMole ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
              >
                {/* ── 地穴垂直升降井道（overflow-hidden 實現真物理鑽出／沉入） ── */}
                <div className="relative w-full h-full overflow-hidden flex flex-col justify-end items-center pointer-events-none">
                  
                  {hasActiveMole && (
                    <div
                      className={`relative w-full h-full flex flex-col items-center justify-end transform transition-transform ${
                        isEmerged
                          ? 'translate-y-0 duration-[450ms] ease-out'
                          : 'translate-y-full duration-[450ms] ease-in'
                      }`}
                    >
                      {/* 
                          地鼠精工半身透明立體角色圖：
                          黃金鼠保留經典高辨識度棕色毛皮與清晰木牌，套用向外擴散金色霓虹光暈與皇冠光環，
                          徹底解決金黃背景吃掉文字的問題，保證單字 100% 清晰易讀！
                      */}
                      <img
                        src={
                          holeMole.status === 'hit'
                            ? MOLE_DIZZY
                            : holeMole.isPrank
                            ? MOLE_PRANK
                            : MOLE_NORMAL
                        }
                        alt="Mole"
                        className={`h-full w-auto object-contain object-bottom select-none pointer-events-none ${
                          holeMole.isGold && holeMole.status !== 'hit'
                            ? 'animate-gold-aura ring-2 ring-amber-400/80 rounded-full'
                            : 'drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]'
                        } ${
                          holeMole.status === 'hit' ? 'scale-95 duration-150' : 'scale-100'
                        }`}
                      />

                      {/* 地鼠手舉木牌上的清晰單字 (字牌位置在精靈圖下半部 60% ~ 96%，黑字清晰高對比) */}
                      {holeMole.status !== 'hit' && !holeMole.isPrank && (
                        <div className="absolute left-[10%] right-[10%] top-[60%] bottom-[5%] flex items-center justify-center pointer-events-none z-10 px-1">
                          <span className={`font-heading font-black text-center tracking-tight select-none leading-none truncate ${
                            holeMole.isGold
                              ? 'text-[#2b1704] text-xs sm:text-sm md:text-base font-black drop-shadow-[0_1px_2px_rgba(251,191,36,0.95)]'
                              : 'text-[#36200d] text-xs sm:text-sm md:text-base font-black drop-shadow-[0_1px_1px_rgba(255,248,220,0.85)]'
                          }`}>
                            {holeMole.word}
                          </span>
                        </div>
                      )}

                      {/* 蜂巢搗蛋鼠：手舉蜂巢警示 */}
                      {holeMole.isPrank && holeMole.status !== 'hit' && (
                        <div className="absolute left-[8%] right-[8%] top-[64%] flex items-center justify-center pointer-events-none z-10">
                          <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white font-black text-[9px] sm:text-xs shadow-lg animate-pulse border border-rose-300 whitespace-nowrap">
                            ⚠️ 搗蛋蜂
                          </span>
                        </div>
                      )}

                      {/* 被擊中時的跳出反饋（眼冒金星 ＋ 飄字） */}
                      {holeMole.status === 'hit' && holeMole.hitResult && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                          <span className={`text-base sm:text-2xl font-black font-heading animate-bounce drop-shadow-[0_0_10px_rgba(0,0,0,0.9)] ${
                            holeMole.hitResult.includes('+') ? 'text-yellow-300' : 'text-rose-400'
                          }`}>
                            {holeMole.hitResult}
                          </span>
                        </div>
                      )}

                      {/* 皇冠彩蛋鼠的金色皇冠與星芒光環 */}
                      {holeMole.isGold && (
                        <>
                          <div className="absolute -top-1 sm:-top-2 left-1/2 -translate-x-1/2 text-base sm:text-xl filter drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]">
                            👑
                          </div>
                          <Sparkles className="absolute top-0 right-1 w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 animate-spin" />
                        </>
                      )}

                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>

      </main>

      {/* ════════════════════════════════════════════════════════════════
          【結算彈窗 (Game Over & 榮譽榜提交)】
         ════════════════════════════════════════════════════════════════ */}
      {gameState !== 'playing' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <GlassCard className="max-w-md w-full p-6 text-center border-2 border-amber-400 shadow-2xl bg-slate-950/90">
            
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Trophy className="w-10 h-10 animate-bounce text-amber-400" />
            </div>

            <h3 className="text-2xl font-black font-heading text-white mb-1">
              {lives > 0 ? '🎉 60秒極速挑戰完成！' : '💥 挑戰結束！'}
            </h3>
            
            <p className="text-xs font-bold text-slate-300 mb-4">
              {lives > 0 ? '手速驚人，成功守護了森林字卡！' : '別灰心，小心不要敲到蜂巢搗蛋鼠喔！'}
            </p>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-black/50 border border-white/15 mb-5 text-center">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">最終得分</span>
                <span className="text-2xl font-mono font-black text-amber-300">{score}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">最高連擊</span>
                <span className="text-2xl font-mono font-black text-orange-400">{maxCombo} 連擊</span>
              </div>
            </div>

            {/* 榮譽榜成績提交卡片 */}
            <HonorSubmissionCard
              gameMode={isAlphabetMode ? 'mole-abc' : 'mole-vocab'}
              score={score}
              qualifyingBook={isAlphabetMode ? 'abc' : (qualifyingBook || '1')}
              categoryTitle={isAlphabetMode ? '字母打地鼠' : '單字打地鼠'}
              className="mb-4"
            />

            <div className="grid grid-cols-2 gap-3">
              <Button3D variant="slate" size="md" onClick={onBack} icon={ArrowLeft}>
                回大廳
              </Button3D>
              <Button3D variant="amber" size="md" onClick={handleRestart} icon={RefreshCw}>
                再玩一次
              </Button3D>
            </div>

          </GlassCard>
        </div>
      )}

    </div>
  );
};
