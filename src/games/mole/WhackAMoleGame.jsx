import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';
import { soundEngine, speakEnglish, bgmManager } from '../../services/audio';
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

// 9 個自然地洞精準幾何透視座標百分比 (3x3 自然弧形排列，互不交疊)
const HOLE_POSITIONS = [
  // 上排（遠景 3 洞：scale 0.86, z-index 10）
  { id: 0, x: 26, y: 53, scale: 0.86, zIndex: 10 },
  { id: 1, x: 50, y: 51, scale: 0.84, zIndex: 10 },
  { id: 2, x: 74, y: 53, scale: 0.86, zIndex: 10 },
  // 中排（中景 3 洞：scale 0.96, z-index 20）
  { id: 3, x: 21, y: 69, scale: 0.96, zIndex: 20 },
  { id: 4, x: 50, y: 67, scale: 0.94, zIndex: 20 },
  { id: 5, x: 79, y: 69, scale: 0.96, zIndex: 20 },
  // 下排（近景 3 洞：scale 1.08, z-index 30）
  { id: 6, x: 17, y: 86, scale: 1.08, zIndex: 30 },
  { id: 7, x: 50, y: 84, scale: 1.06, zIndex: 30 },
  { id: 8, x: 83, y: 86, scale: 1.08, zIndex: 30 }
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

  // 狂暴期音樂加速連動
  useEffect(() => {
    if (isBerserk) {
      bgmManager.setPlaybackRate(1.28);
    } else {
      bgmManager.setPlaybackRate(1.0);
    }
  }, [isBerserk]);

  // 元件卸載時務必重設音樂播放速率
  useEffect(() => {
    return () => {
      bgmManager.setPlaybackRate(1.0);
      clearAllMoleTimers();
    };
  }, [clearAllMoleTimers]);

  // ── 5. 倒數 60 秒計時器 ──
  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerGameOver('timeup');
          return 0;
        }
        return prev - 1;
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

  // ── 7. 派發地鼠核心機制（依時間推進動態難度） ──
  const spawnMolesForTarget = useCallback((targetWord) => {
    if (gameState !== 'playing' || !targetWord) return;

    clearAllMoleTimers();
    isTransitioningRef.current = false;

    // 難度參數計算（大幅放慢節奏，時間充裕，符合 4.5~6 秒不等）：
    // 前 25 秒：2 隻（1正解 + 1誘答），停留 5.0 ~ 5.6 秒
    // 25~50 秒：3 隻（1正解 + 2誘答/炸彈），停留 4.2 ~ 4.8 秒
    // 最後 10 秒（狂暴期）：3 ~ 4 隻，停留 3.0 ~ 3.4 秒
    const isLateGame = timeLeft <= 35;
    const isLastBurst = timeLeft <= 10;

    const moleCount = isLastBurst ? (Math.random() < 0.5 ? 4 : 3) : isLateGame ? 3 : 2;
    const baseDuration = isLastBurst ? 3200 : isLateGame ? 4400 : 5200;

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

    // 皇冠彩蛋鼠（8% 機率）與 蜂巢搗蛋鼠（前 15 秒不出現，之後 15% 機率）
    const isGoldSpawn = Math.random() < 0.08;
    const isPrankSpawn = !isGoldSpawn && timeLeft <= 45 && Math.random() < 0.18;

    // 組裝初始地鼠狀態（進入 'emerging' 狀態）
    const nextHoles = Array(9).fill(null);

    // 正解地鼠（停留約 4.8 ~ 5.6 秒）
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
    distractorHoleIndices.forEach((hIdx, idx) => {
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

  }, [gameState, timeLeft, rawWordPool, clearAllMoleTimers]);

  // ── 8. 初始化與換題發動 ──
  const startNextQuestion = useCallback(() => {
    const nextTarget = getNextWord();
    setCurrentTarget(nextTarget);
    if (nextTarget?.word) {
      speakEnglish(nextTarget.word);
    }
    spawnMolesForTarget(nextTarget);
  }, [getNextWord, spawnMolesForTarget]);

  // 初始化啟動
  useEffect(() => {
    initQueues();
    startNextQuestion();
  }, [initQueues, startNextQuestion]);

  // ── 9. 正解超時未點擊處理 (Miss Timeout) ──
  const handleMissTimeout = (missedTarget) => {
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
      startNextQuestion();
    }, 400);
  };

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
    bgmManager.setPlaybackRate(1.0);
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
    bgmManager.setPlaybackRate(1.0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(3);
    setTimeLeft(60);
    setRoundIndex(0);
    setHoles(Array(9).fill(null));
    initQueues();
    setGameState('playing');
    setTimeout(() => {
      startNextQuestion();
    }, 100);
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
      `}</style>

      {/* ── 2D 實景手繪森林地穴舞台背景 ── */}
      <img
        src={STAGE_BG}
        alt="Whack-a-Mole Stage"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none brightness-[0.92] contrast-[1.05]"
      />

      {/* 景深暗化遮罩 */}
      <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />

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
          【主舞台：9 個自然地穴實景 ＆ 固定柱狀獨立 Hitbox】
         ════════════════════════════════════════════════════════════════ */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto p-2 sm:p-4 flex items-center justify-center overflow-hidden">
        
        {/* 16:9 比例地穴互動舞台 */}
        <div className="relative w-full aspect-[16/9] max-h-[78vh]">
          {HOLE_POSITIONS.map((holePos) => {
            const holeMole = holes[holePos.id];
            const hasActiveMole = holeMole !== null && holeMole.status !== 'hidden';

            // 動態垂直位移：emerging/visible/hit 為 0 (探出)，retreating 為 115% (沉沒)
            const isEmerged = hasActiveMole && (holeMole.status === 'emerging' || holeMole.status === 'visible' || holeMole.status === 'hit');

            return (
              <div
                key={holePos.id}
                style={{
                  left: `${holePos.x}%`,
                  top: `${holePos.y}%`,
                  transform: `translate(-50%, -100%) scale(${holePos.scale})`,
                  zIndex: holePos.zIndex
                }}
                /* 
                   【核心架構：獨立柱狀 Hitbox】
                   只要該洞有安排老鼠，整根垂直柱狀區域均可點擊（即使老鼠剛探頭亦可敲擊），
                   垂直高度嚴格限制在 14%，上排、中排、下排各自完全獨立，前後排 100% 絕不交疊遮蔽！
                   無老鼠時 pointer-events: none 完全穿透。
                */
                onClick={() => hasActiveMole && handleWhack(holePos.id)}
                className={`absolute w-[20%] sm:w-[17%] md:w-[15%] h-[14%] sm:h-[14.5%] flex flex-col justify-end items-center cursor-pointer select-none ${
                  hasActiveMole ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
              >
                
                {/* ── 地穴垂直升降井道（overflow-hidden 實現真物理鑽出／沒入，老鼠頂多探出上半身 1/3 ~ 1/2） ── */}
                <div className="relative w-full h-[90%] overflow-hidden flex flex-col justify-end items-center pointer-events-none">
                  
                  {/* 地鼠實體角色（平滑 translateY 垂直動畫，露出頭部、臉部與木牌，腹部在洞內） */}
                  {hasActiveMole && (
                    <div
                      className={`relative w-full flex flex-col items-center justify-end transform transition-transform ${
                        isEmerged ? 'translate-y-[12%] duration-[450ms] ease-out' : 'translate-y-[115%] duration-[450ms] ease-in'
                      }`}
                    >
                      
                      {/* 地鼠精工透明立體角色圖 */}
                      <img
                        src={
                          holeMole.status === 'hit'
                            ? MOLE_DIZZY
                            : holeMole.isGold
                            ? MOLE_GOLD
                            : holeMole.isPrank
                            ? MOLE_PRANK
                            : MOLE_NORMAL
                        }
                        alt="Mole"
                        className={`w-[92%] sm:w-[88%] h-auto object-contain select-none pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] ${
                          holeMole.status === 'hit' ? 'scale-90 rotate-12 duration-150' : 'scale-100'
                        }`}
                      />

                      {/* 地鼠手舉木牌 / 金牌上的清晰單字 (完全嵌入木牌中央) */}
                      {holeMole.status !== 'hit' && !holeMole.isPrank && (
                        <div className="absolute left-[8%] right-[8%] top-[53%] bottom-[20%] flex items-center justify-center pointer-events-none z-10 px-1">
                          <span className={`font-heading font-black text-center tracking-wide select-none leading-none drop-shadow ${
                            holeMole.isGold
                              ? 'text-amber-950 text-xs sm:text-base md:text-lg font-black'
                              : 'text-[#3e2712] text-xs sm:text-base md:text-lg font-black drop-shadow-[0_1px_1px_rgba(255,248,220,0.85)]'
                          }`}>
                            {holeMole.word}
                          </span>
                        </div>
                      )}

                      {/* 蜂巢搗蛋鼠：蜜蜂已繪於身體兩側，手舉蜂巢本體即為視覺警示 */}
                      {holeMole.isPrank && holeMole.status !== 'hit' && (
                        <div className="absolute left-[15%] right-[15%] top-[54%] flex items-center justify-center pointer-events-none z-10">
                          <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] sm:text-xs shadow-lg animate-pulse border border-rose-300">
                            ⚠️ 搗蛋蜂
                          </span>
                        </div>
                      )}

                      {/* 被擊中時的跳出反饋（眼冒金星 ＋ 飄字） */}
                      {holeMole.status === 'hit' && holeMole.hitResult && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                          <span className={`text-xl sm:text-3xl font-black font-heading animate-bounce drop-shadow-[0_0_12px_rgba(0,0,0,0.9)] ${
                            holeMole.hitResult.includes('+') ? 'text-yellow-300' : 'text-rose-400'
                          }`}>
                            {holeMole.hitResult}
                          </span>
                        </div>
                      )}

                      {/* 皇冠彩蛋鼠的金色星芒光環 */}
                      {holeMole.isGold && (
                        <Sparkles className="absolute top-1 right-2 w-7 h-7 text-yellow-300 animate-spin" />
                      )}

                    </div>
                  )}

                </div>

                {/* ── 洞口前唇遮蔽泥土與青苔石塊立體邊緣遮擋層（z-index 25 蓋在地鼠井道下緣） ── */}
                <div className="w-[94%] h-5 sm:h-7 md:h-9 rounded-[50%] bg-gradient-to-t from-stone-950 via-stone-900/60 to-transparent border-b-2 border-stone-800/90 shadow-2xl pointer-events-none -mt-3 z-25" />

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
