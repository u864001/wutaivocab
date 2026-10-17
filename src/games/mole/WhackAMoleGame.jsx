import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';
import { soundEngine, speakEnglish } from '../../services/audio';
import confetti from 'canvas-confetti';
import {
  ArrowLeft, Heart, Timer, Trophy, Sparkles, RefreshCw,
  CheckCircle2, AlertTriangle, Volume2, Flame, Award, Zap
} from 'lucide-react';

const STAGE_BG = '/assets/mole/stage_bg.jpg';
const MOLE_NORMAL = '/assets/mole/mole_normal.png';
const MOLE_DIZZY = '/assets/mole/mole_dizzy.png';
const MOLE_GOLD = '/assets/mole/mole_gold.png';
const MOLE_PRANK = '/assets/mole/mole_prank.png';

// 9 個自然地洞精準透視錨點百分比 (3x3 自然弧形排列)
const HOLE_POSITIONS = [
  { id: 0, x: 26, y: 53, scale: 0.88, zIndex: 10 },
  { id: 1, x: 50, y: 51, scale: 0.86, zIndex: 10 },
  { id: 2, x: 74, y: 53, scale: 0.88, zIndex: 10 },
  { id: 3, x: 22, y: 69, scale: 0.95, zIndex: 20 },
  { id: 4, x: 50, y: 67, scale: 0.94, zIndex: 20 },
  { id: 5, x: 78, y: 69, scale: 0.95, zIndex: 20 },
  { id: 6, x: 18, y: 86, scale: 1.05, zIndex: 30 },
  { id: 7, x: 50, y: 84, scale: 1.04, zIndex: 30 },
  { id: 8, x: 82, y: 86, scale: 1.05, zIndex: 30 }
];

export const WhackAMoleGame = ({
  settings,
  words = [],
  qualifyingBook,
  onBack
}) => {
  // ── 判斷遊戲範圍（低年級字母模式 vs 中高年級單字模式） ──
  const isAlphabetMode = useMemo(() => {
    return settings?.alphaMode || (settings?.selectedUnits && settings.selectedUnits.includes('abc'));
  }, [settings]);

  // 單字池建置
  const activeWordPool = useMemo(() => {
    if (isAlphabetMode) {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      return letters.map(char => ({
        word: char,
        wordZh: `字母 ${char}`,
        pronounce: char
      }));
    }

    if (words && words.length > 0) {
      // 依勾選之單元範圍篩選
      const filtered = settings?.selectedUnits?.length
        ? words.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`))
        : words;
      if (filtered.length >= 4) return filtered;
    }

    // 預設三年級文具備援單字
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

  // ── 遊戲核心狀態 ──
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'gameover' | 'victory'
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60); // 60 秒極速挑戰
  const [roundCount, setRoundCount] = useState(0);

  // 當前題目目標
  const [targetWordObj, setTargetWordObj] = useState(null);

  // 9 個地洞即時狀態
  // hole: { active: boolean, word: string, wordZh: string, isTarget: boolean, isGold: boolean, isPrank: boolean, status: 'emerging' | 'visible' | 'hit' | 'hiding' }
  const [holes, setHoles] = useState(() => Array(9).fill(null));

  // 木槌打擊特效座標
  const [hammerEffect, setHammerEffect] = useState(null);

  // ── 計時器 ──
  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameOver('timeup');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  // ── 挑選新目標題目 ──
  const pickNewTarget = useCallback(() => {
    if (!activeWordPool || activeWordPool.length === 0) return;
    const randomTarget = activeWordPool[Math.floor(Math.random() * activeWordPool.length)];
    setTargetWordObj(randomTarget);
    // 朗讀目標單字
    if (randomTarget?.word) {
      speakEnglish(randomTarget.word);
    }
  }, [activeWordPool]);

  // 初始化第一題
  useEffect(() => {
    pickNewTarget();
  }, [pickNewTarget]);

  // ── 地鼠探頭核心迴圈 (動態波次生成) ──
  useEffect(() => {
    if (gameState !== 'playing' || !targetWordObj) return;

    // 速度曲線：隨時間與連擊縮短地鼠停留秒數 (2.2s -> 1.2s)
    const baseDuration = Math.max(1200, 2300 - Math.min(25, roundCount) * 45 - combo * 30);

    const spawnMoles = () => {
      // 隨機抽選 2 ~ 3 個不重複的地洞冒出地鼠
      const moleCount = Math.min(3, 2 + (roundCount > 5 ? 1 : 0));
      const availableHoleIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => 0.5 - Math.random());
      const selectedHoles = availableHoleIndices.slice(0, moleCount);

      // 其中 1 個地洞必須是目標正解
      const targetHoleIdx = selectedHoles[0];
      const otherHoleIndices = selectedHoles.slice(1);

      // 抽取干擾單字
      const distractors = activeWordPool
        .filter(w => w.word !== targetWordObj.word)
        .sort(() => 0.5 - Math.random())
        .slice(0, otherHoleIndices.length);

      // 5% 機率彩蛋黃金地鼠，10% 機率搗蛋炸彈地鼠
      const isGoldSpawn = Math.random() < 0.08;
      const isPrankSpawn = !isGoldSpawn && Math.random() < 0.15;

      setHoles(() => {
        const next = Array(9).fill(null);

        // 放正解地鼠
        next[targetHoleIdx] = {
          word: targetWordObj.word,
          wordZh: targetWordObj.wordZh,
          isTarget: true,
          isGold: isGoldSpawn,
          isPrank: false,
          status: 'visible'
        };

        // 放誘答地鼠
        otherHoleIndices.forEach((hIdx, i) => {
          const dist = distractors[i] || activeWordPool[0];
          const prankThis = isPrankSpawn && i === 0;
          next[hIdx] = {
            word: prankThis ? 'BOMB!' : dist.word,
            wordZh: prankThis ? '炸彈蜂' : dist.wordZh,
            isTarget: false,
            isGold: false,
            isPrank: prankThis,
            status: 'visible'
          };
        });

        return next;
      });

      // 設定此波地鼠縮回地洞計時器
      const retreatTimer = setTimeout(() => {
        setHoles(Array(9).fill(null));
        setRoundCount(r => r + 1);
      }, baseDuration);

      return retreatTimer;
    };

    const currentTimer = spawnMoles();
    return () => clearTimeout(currentTimer);
  }, [gameState, targetWordObj, roundCount, combo, activeWordPool]);

  // ── 點擊擊打地鼠處理 ──
  const handleWhack = (holeIdx, e) => {
    if (gameState !== 'playing') return;
    const mole = holes[holeIdx];
    if (!mole || mole.status === 'hit') return;

    // 觸控／點擊座標木槌動效
    const rect = e.currentTarget.getBoundingClientRect();
    setHammerEffect({ x: e.clientX, y: e.clientY });
    setTimeout(() => setHammerEffect(null), 300);

    // 1. 擊中正解地鼠！
    if (mole.isTarget) {
      soundEngine.correct();
      speakEnglish(mole.word);

      // 連擊與加分計算 (正解 10 分 + 連擊獎勵)
      const bonus = mole.isGold ? 50 : combo * 2;
      const earned = 10 + bonus;
      setScore(s => s + earned);

      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setMaxCombo(m => Math.max(m, nextCombo));

      if (nextCombo >= 3 && nextCombo % 3 === 0) {
        soundEngine.combo(Math.min(5, Math.floor(nextCombo / 3) + 1));
      }

      // 彩蛋黃金地鼠特效
      if (mole.isGold) {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
      }

      // 將該地鼠狀態轉為被打扁/眼冒金星
      setHoles(prev => {
        const next = [...prev];
        next[holeIdx] = { ...next[holeIdx], status: 'hit' };
        return next;
      });

      // 快速進入下一題
      setTimeout(() => {
        setHoles(Array(9).fill(null));
        setRoundCount(r => r + 1);
        pickNewTarget();
      }, 400);

    } else if (mole.isPrank) {
      // 2. 誤打搗蛋炸彈地鼠！扣心、扣分
      soundEngine.wrong();
      setCombo(0);
      setScore(s => Math.max(0, s - 30));
      deductLife('💣 敲中搗蛋炸彈蜂！扣 1 顆愛心！');

      setHoles(prev => {
        const next = [...prev];
        next[holeIdx] = { ...next[holeIdx], status: 'hit' };
        return next;
      });

    } else {
      // 3. 敲錯其他單字地鼠！
      soundEngine.wrong();
      setCombo(0);
      setScore(s => Math.max(0, s - 10));
      deductLife(`❌ 敲到「${mole.word}」了！目標是「${targetWordObj.wordZh}」！`);

      setHoles(prev => {
        const next = [...prev];
        next[holeIdx] = { ...next[holeIdx], status: 'hit' };
        return next;
      });
    }
  };

  // 扣心與遊戲結束判定
  const deductLife = (msg) => {
    setLives(l => {
      const next = l - 1;
      if (next <= 0) {
        handleGameOver('dead');
      }
      return Math.max(0, next);
    });
  };

  const handleGameOver = (reason) => {
    setGameState('gameover');
    soundEngine.wrong();
    if (score >= 60) {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.5 } });
    }
  };

  const handleRestart = () => {
    soundEngine.click();
    setScore(0);
    setCombo(0);
    setLives(3);
    setTimeLeft(60);
    setRoundCount(0);
    setHoles(Array(9).fill(null));
    setGameState('playing');
    pickNewTarget();
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none z-20 animate-fadeIn font-sans">
      
      {/* ── 2D 實景一體化自然森林舞台背景 ── */}
      <img
        src={STAGE_BG}
        alt="Whack-a-Mole Stage"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none brightness-[0.9] contrast-[1.05]"
      />

      {/* 景深微暗遮罩，讓前景地洞更聚焦 */}
      <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />

      {/* ════════════════════════════════════════════════════════════════
          【頂部 HUD 一體化儀表板】
          左上：石板碑計分 • 置中：目標題目與日晷倒數 • 右上：琉璃連擊瓶
         ════════════════════════════════════════════════════════════════ */}
      <header className="relative z-30 w-full px-3 sm:px-6 py-2.5 bg-slate-950/70 backdrop-blur-md border-b border-white/15 flex items-center justify-between shadow-xl shrink-0">
        
        {/* 左上角：返回大廳 */}
        <div className="flex items-center gap-2">
          <Button3D variant="slate" size="sm" onClick={onBack} icon={ArrowLeft}>
            {typeof window !== 'undefined' && window.innerWidth < 640 ? '' : '回大廳'}
          </Button3D>

          {/* 自然融入石板計分牌 */}
          <div className="px-3.5 py-1 rounded-xl bg-black/60 border border-amber-400/50 shadow-inner flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-300 hidden sm:inline">得分</span>
            <span className="text-base sm:text-lg font-mono font-black text-amber-300">
              {score}
            </span>
          </div>
        </div>

        {/* 中央出題儀表（顯著目標單字 + 語音播音） */}
        {targetWordObj && (
          <div className="flex items-center gap-2 sm:gap-3 px-4 py-1.5 rounded-2xl bg-black/75 border-2 border-emerald-400/80 shadow-2xl backdrop-blur-md animate-bounce">
            <span className="text-xs font-black text-emerald-300 hidden md:inline">
              🎯 目標：
            </span>
            <span className="text-base sm:text-xl font-heading font-black text-white tracking-wide">
              {targetWordObj.wordZh}
            </span>
            <button
              type="button"
              onClick={() => speakEnglish(targetWordObj.word)}
              className="p-1 rounded-lg bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-200 transition-colors cursor-pointer"
              title="重聽發音"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 右上角：連擊能量瓶 + 愛心與倒數 */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* 連擊瓶 */}
          {combo > 1 && (
            <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-orange-500/30 to-amber-500/30 border border-orange-400/60 shadow-lg flex items-center gap-1.5 animate-pulse">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-mono font-black text-orange-200">
                {combo} COMBO!
              </span>
            </div>
          )}

          {/* 愛心條 */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/60 border border-rose-400/40">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 transition-transform ${
                  i < lives
                    ? 'text-rose-500 fill-rose-500 scale-100'
                    : 'text-slate-600 scale-90'
                }`}
              />
            ))}
          </div>

          {/* 倒數計時 */}
          <div className="px-3 py-1 rounded-xl bg-black/60 border border-white/20 font-mono font-black text-xs sm:text-sm text-amber-300 flex items-center gap-1">
            <Timer className="w-3.5 h-3.5 text-amber-400" />
            <span>{timeLeft}s</span>
          </div>

        </div>

      </header>

      {/* ════════════════════════════════════════════════════════════════
          【主舞台：9 個自然地穴實景】
         ════════════════════════════════════════════════════════════════ */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto p-2 sm:p-4 flex items-center justify-center overflow-hidden">
        
        {/* 16:9 比率地穴互動舞台 */}
        <div className="relative w-full aspect-[16/9] max-h-[78vh]">
          {HOLE_POSITIONS.map((holePos) => {
            const mole = holes[holePos.id];
            const isMoleActive = mole && mole.status !== 'hiding';

            return (
              <div
                key={holePos.id}
                style={{
                  left: `${holePos.x}%`,
                  top: `${holePos.y}%`,
                  transform: `translate(-50%, -50%) scale(${holePos.scale})`,
                  zIndex: holePos.zIndex
                }}
                onClick={(e) => isMoleActive && handleWhack(holePos.id, e)}
                className="absolute w-28 sm:w-36 md:w-44 h-24 sm:h-32 md:h-36 flex flex-col items-center justify-end cursor-pointer group"
              >
                
                {/* ── 地鼠實體角色（從洞中冒出） ── */}
                {isMoleActive && (
                  <div className="relative flex flex-col items-center justify-end animate-in fade-in slide-in-from-bottom-8 duration-200">
                    
                    {/* 地鼠高舉的單字木牌 */}
                    <div className={`px-2.5 sm:px-3 py-1 rounded-lg border-2 shadow-2xl font-black text-xs sm:text-sm md:text-base tracking-wider mb-[-10px] z-20 backdrop-blur-md select-none transition-transform group-hover:scale-105 ${
                      mole.isGold
                        ? 'bg-amber-300 text-stone-950 border-amber-100 ring-4 ring-yellow-400/60 shadow-yellow-500/50'
                        : mole.isPrank
                        ? 'bg-rose-600 text-white border-rose-300 shadow-rose-900/50'
                        : 'bg-stone-900/90 text-amber-300 border-amber-400/80'
                    }`}>
                      {mole.word}
                    </div>

                    {/* 地鼠精工透明立體角色圖 */}
                    <img
                      src={
                        mole.status === 'hit'
                          ? MOLE_DIZZY
                          : mole.isGold
                          ? MOLE_GOLD
                          : mole.isPrank
                          ? MOLE_PRANK
                          : MOLE_NORMAL
                      }
                      alt="Mole"
                      className={`w-24 sm:w-28 md:w-36 h-auto object-contain transition-transform select-none pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] ${
                        mole.status === 'hit' ? 'scale-90 rotate-12 duration-150' : 'scale-100'
                      }`}
                    />

                    {/* 彩蛋黃金星芒微光 */}
                    {mole.isGold && (
                      <Sparkles className="absolute -top-3 -right-2 w-6 h-6 text-yellow-300 animate-spin" />
                    )}

                  </div>
                )}

                {/* 洞口前緣自然泥土與青苔石塊立體邊緣遮擋層 */}
                <div className="w-24 sm:w-32 md:w-40 h-7 sm:h-9 md:h-11 rounded-[50%] bg-gradient-to-t from-stone-950/90 via-stone-900/50 to-transparent border-b-2 border-stone-800/80 shadow-2xl pointer-events-none -mt-4 z-20" />

              </div>
            );
          })}
        </div>

      </main>

      {/* ════════════════════════════════════════════════════════════════
          【結算彈窗 (Game Over & Victory)】
         ════════════════════════════════════════════════════════════════ */}
      {gameState !== 'playing' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <GlassCard className="max-w-md w-full p-6 text-center border-2 border-amber-400 shadow-2xl">
            
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Trophy className="w-10 h-10 animate-bounce text-amber-400" />
            </div>

            <h3 className="text-2xl font-black font-heading text-white mb-1">
              {lives > 0 ? '🎉 挑戰完成！' : '💥 挑戰結束！'}
            </h3>
            
            <p className="text-xs font-bold text-slate-300 mb-4">
              {lives > 0 ? '手速驚人，完美守護了森林字卡！' : '再接再厲，小心不要敲到炸彈蜂喔！'}
            </p>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-black/40 border border-white/15 mb-5 text-center">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">最終得分</span>
                <span className="text-2xl font-mono font-black text-amber-300">{score}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">最高連擊</span>
                <span className="text-2xl font-mono font-black text-orange-400">{maxCombo} COMBO</span>
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
