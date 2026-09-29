import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useI18n } from '../../context/I18nContext';
import { soundEngine, speakEnglish } from '../../services/audio';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';
import { generateSmartOptions } from '../../services/distractorHelper';
import { calculateMeteorDuration, calculateMeteorMotionProgress } from './meteorPhysics';
import { MeteorCanvas3D } from './MeteorCanvas3D';
import { MeteorEasterEggs2D } from './MeteorEasterEggs2D';
import { RightComboDisplay } from './RightComboDisplay';
import { enterFullscreen, exitFullscreen } from '../../services/fullscreen';
import confetti from 'canvas-confetti';
import {
  ArrowLeft, Rocket, Trophy, Flame,
  Shield, Zap, Target, Eye, Maximize2, Minimize2, Sparkles
} from 'lucide-react';

const PTS_PER_METEOR = 10;
const PTS_PER_UFO = 5;

export const MeteorGame = ({
  settings,
  words = [],
  qualifyingBook,
  onBack
}) => {
  const { t } = useI18n();
  const [subMode, setSubMode] = useState('zh-en'); // 'zh-en' | 'en-zh' | 'abc'
  const [renderMode, setRenderMode] = useState('3d'); // '3d' | '2d'
  const [queue, setQueue] = useState([]);
  const [currentMeteor, setCurrentMeteor] = useState(null);
  const [options, setOptions] = useState([]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0); // 總得分
  const [meteorsDestroyed, setMeteorsDestroyed] = useState(0); // 擊落隕石數
  const [ufoCount, setUfoCount] = useState(0); // 攔截 UFO 彩蛋數
  const [totalStreakBonus, setTotalStreakBonus] = useState(0); // 累計連擊加成總分
  const [combo, setCombo] = useState(0); // 連續答對次數
  const [maxCombo, setMaxCombo] = useState(0);
  const [lastGainNotice, setLastGainNotice] = useState(null); // 動態加分懸浮提示
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [survivalTime, setSurvivalTime] = useState(0);
  const [laserTrigger, setLaserTrigger] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef(null);
  const meteorRef = useRef(null);
  const animFrameRef = useRef(null);
  const encounteredWordsRef = useRef(new Map());
  const mistakeIdsRef = useRef(new Set());

  // 卸載時還原全螢幕
  useEffect(() => {
    return () => {
      exitFullscreen();
    };
  }, []);

  // 監聽全螢幕狀態
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement || document.webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 智慧全螢幕切換
  const toggleFullscreen = () => {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  // 安全退出遊戲 (還原全螢幕)
  const handleExitGame = () => {
    exitFullscreen();
    onBack();
  };

  const subModeRef = useRef(subMode);
  useEffect(() => {
    subModeRef.current = subMode;
  }, [subMode]);

  // 取得當前模式的「選取範圍單字庫」
  const getSelectedPool = (targetSubMode = subModeRef.current) => {
    if (targetSubMode === 'abc') {
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((l, i) => ({
        id: `abc-${i}`,
        book: 'ABC',
        lesson: '1',
        en: l,
        zh: l.toLowerCase()
      }));
    }
    const filtered = words.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
    return filtered;
  };

  useEffect(() => {
    if (hasStarted) return;
    const pool = getSelectedPool();
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setQueue(shuffled);
  }, [settings, words, subMode, hasStarted]);

  const updateOptionsFor = (targetWord, targetSubMode = subModeRef.current) => {
    const ansKey = targetSubMode === 'en-zh' ? 'zh' : (targetSubMode === 'abc' ? 'zh' : 'en');
    const selectedPool = getSelectedPool(targetSubMode);
    const fullPool = targetSubMode === 'abc' ? selectedPool : words;

    const opts = generateSmartOptions(
      targetWord,
      selectedPool,
      fullPool,
      ansKey,
      settings?.distractorMode || 'strict'
    );
    setOptions(opts);
  };

  const spawnMeteor = (wordObj, currentDestroyedCount, targetSubMode = subModeRef.current) => {
    if (wordObj && wordObj.id) {
      encounteredWordsRef.current.set(wordObj.id, { id: wordObj.id, en: wordObj.en, zh: wordObj.zh });
    }

    // 依據題數計算該顆隕石的掉落時長 (31題以上急速縮短)
    const questionIndex = currentDestroyedCount !== undefined ? currentDestroyedCount : meteorsDestroyed;
    const duration = calculateMeteorDuration(questionIndex);
    const xPos = 18 + Math.random() * 64;

    setCurrentMeteor({
      word: wordObj,
      x: xPos,
      duration,
      startTime: performance.now(),
      questionIndex
    });

    setIsExploding(false);
    if (targetSubMode !== 'zh-en' && targetSubMode !== 'abc') {
      speakEnglish(wordObj.en);
    }
  };

  const handleStart = (mode) => {
    subModeRef.current = mode;
    setSubMode(mode);
    setHasStarted(true);
    setLives(3);
    setScore(0);
    setMeteorsDestroyed(0);
    setUfoCount(0);
    setTotalStreakBonus(0);
    setCombo(0);
    setMaxCombo(0);
    setGameStartTime(Date.now());
    encounteredWordsRef.current.clear();
    mistakeIdsRef.current.clear();

    // 點擊開始為合法使用者手勢，自動請求全螢幕體驗 (支援 iPad)
    enterFullscreen();

    const pool = getSelectedPool(mode);

    if (pool.length === 0) {
      alert('請先在主畫面勾選複習範圍！');
      return onBack();
    }

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setQueue(shuffled);
    const first = shuffled[0];
    updateOptionsFor(first, mode);
    spawnMeteor(first, 0, mode);
  };

  // 2D 備援模式下的物理落下循環 (與 3D 物理引擎 100% 同步)
  useEffect(() => {
    if (!hasStarted || isFinished || !currentMeteor || isExploding || renderMode !== '2d') return;

    const tick = (now) => {
      const elapsed = (now - currentMeteor.startTime) / 1000;
      const motionProgress = calculateMeteorMotionProgress(
        elapsed,
        currentMeteor.duration,
        currentMeteor.questionIndex
      );

      // -10% -> 90% 區間映射
      const y = -10 + motionProgress * 100;

      if (meteorRef.current) {
        meteorRef.current.style.top = `${y}%`;
      }

      if (elapsed >= currentMeteor.duration) {
        handleMiss();
      } else {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [currentMeteor, hasStarted, isFinished, isExploding, renderMode]);

  // 3D 模式下的下墜逾時檢查
  useEffect(() => {
    if (!hasStarted || isFinished || !currentMeteor || isExploding || renderMode !== '3d') return;

    const timeoutSec = currentMeteor.duration * 1000;
    const timer = setTimeout(() => {
      handleMiss();
    }, timeoutSec);

    return () => clearTimeout(timer);
  }, [currentMeteor, hasStarted, isFinished, isExploding, renderMode]);

  const handleMiss = () => {
    soundEngine.wrong();
    setIsExploding(true);
    setCombo(0); // 答錯或逾時，連擊與 bonus 歸零
    if (currentMeteor?.word?.id) {
      mistakeIdsRef.current.add(currentMeteor.word.id);
    }

    setLives(prev => {
      const next = prev - 1;
      if (next <= 0) {
        setSurvivalTime(Math.floor((Date.now() - gameStartTime) / 1000));
        exitFullscreen();
        setTimeout(() => setIsFinished(true), 900);
      } else {
        setTimeout(() => nextTurn(meteorsDestroyed), 900);
      }
      return next;
    });
  };

  // 成功攔截 UFO 彩蛋處理：5分 + 同享當前連對 bonus 加成
  const handleUfoSuccess = (basePoints = PTS_PER_UFO) => {
    soundEngine.combo(3);
    // UFO 同享目前連擊之加成 (第4與第5題間點擊，享受第4題連擊加成)
    const ufoBonus = Math.max(0, combo - 1);
    const totalGained = basePoints + ufoBonus;

    setScore(s => s + totalGained);
    setUfoCount(c => c + 1);
    setTotalStreakBonus(b => b + ufoBonus);

    setLastGainNotice({
      text: ufoBonus > 0 ? `🛸 UFO 攔截！+${basePoints} (+${ufoBonus} 連擊加成)` : `🛸 UFO 攔截！+${basePoints} 分`,
      type: 'ufo'
    });
    setTimeout(() => setLastGainNotice(null), 2200);
  };

  const handleOptionClick = (opt) => {
    if (!currentMeteor || isExploding) return;
    soundEngine.laser();

    // 觸發 3D 雷射防衛光束
    setLaserTrigger({ isCorrect: opt.isCorrect, timestamp: Date.now() });

    if (opt.isCorrect) {
      soundEngine.explosion();

      // 連續答對 bonus 累加機制：
      // 第 1 題得 10 分 (bonus=0)
      // 第 2 題得 10+1 分 (bonus=1)
      // 第 3 題得 10+2 分 (bonus=2)
      // 第 4 題得 10+3 分 (bonus=3)
      // 第 5 題得 10+4 分 (bonus=4) ...以此類推
      const streakBonus = combo;
      const earnedPoints = PTS_PER_METEOR + streakBonus;

      setScore(s => s + earnedPoints);
      setTotalStreakBonus(b => b + streakBonus);

      const nextDestroyed = meteorsDestroyed + 1;
      setMeteorsDestroyed(nextDestroyed);

      setCombo(c => {
        const nextC = c + 1;
        setMaxCombo(m => Math.max(m, nextC));
        if (nextC >= 2) soundEngine.combo(nextC);
        return nextC;
      });

      // 飄浮得分提示
      setLastGainNotice({
        text: streakBonus > 0 ? `+${PTS_PER_METEOR} (+${streakBonus} 連擊)` : `+${PTS_PER_METEOR}`,
        type: 'meteor'
      });
      setTimeout(() => setLastGainNotice(null), 1500);

      setIsExploding(true);

      // 2D 備援模式下的碎屑紙花
      if (renderMode === '2d' && meteorRef.current) {
        const rect = meteorRef.current.getBoundingClientRect();
        confetti({
          particleCount: 35,
          spread: 60,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight
          },
          colors: ['#f87171', '#fbbf24', '#facc15']
        });
      }

      setTimeout(() => nextTurn(nextDestroyed), renderMode === '3d' ? 650 : 600);
    } else {
      handleMiss();
    }
  };

  const nextTurn = (currentDestroyedCount) => {
    const newQueue = [...queue];
    newQueue.shift();

    if (newQueue.length === 0) {
      newQueue.push(...getSelectedPool(subModeRef.current).sort(() => 0.5 - Math.random()));
    }

    setQueue(newQueue);
    const nextWord = newQueue[0];
    updateOptionsFor(nextWord, subModeRef.current);
    spawnMeteor(nextWord, currentDestroyedCount, subModeRef.current);
  };

  // 模式選擇前導頁
  if (!hasStarted) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full text-center p-8">
          <div className="w-20 h-20 rounded-3xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 animate-float-slow">
            <Rocket className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1 font-heading">
            {t.meteorTitle} 3D
          </h2>
          <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mb-2">
            ● 地球守衛戰：攔截星際隕石群
          </p>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-6">
            {t.selectDefenseMode}
          </p>

          <div className="space-y-3">
            <Button3D variant="blue" size="lg" onClick={() => handleStart('zh-en')} className="w-full">
              {t.meteorZhEn}
            </Button3D>
            <Button3D variant="emerald" size="lg" onClick={() => handleStart('en-zh')} className="w-full">
              {t.meteorEnZh}
            </Button3D>
            <Button3D variant="amber" size="lg" onClick={() => handleStart('abc')} className="w-full">
              {t.meteorAbc}
            </Button3D>
            <Button3D variant="slate" size="md" onClick={onBack} className="w-full mt-2">
              {t.backLobby}
            </Button3D>
          </div>
        </GlassCard>
      </div>
    );
  }

  // 結算畫面
  if (isFinished) {
    // 依實際題目答對率計算精準的 totalCount，不受額外 bonus 影響證書答對率
    const totalCountForAccuracy = Math.round(
      (score * (meteorsDestroyed + (3 - lives))) / Math.max(1, meteorsDestroyed)
    );

    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 animate-fadeIn">
        <GlassCard className="max-w-md w-full text-center p-8">
          <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-3 animate-bounce" />
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 font-heading mb-1">
            {t.defenseOver}
          </h2>
          <p className="text-xs font-bold text-slate-500 mb-4">
            {t.survivalTime}<span className="text-indigo-600 font-black text-lg">{survivalTime} 秒</span>
          </p>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {score}
              </span>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5">總得分 (分)</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800">
              <span className="text-3xl font-black text-cyan-600 dark:text-cyan-400">
                {meteorsDestroyed}
              </span>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5">{t.meteorsDestroyed}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                +{totalStreakBonus} 分
              </span>
              <p className="text-[10px] font-bold text-slate-500 mt-0.5">連擊加成總分 (最高 {maxCombo}x)</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {ufoCount} 架
              </span>
              <p className="text-[10px] font-bold text-slate-500 mt-0.5">UFO 攔截彩蛋</p>
            </div>
          </div>

          {/* 榮譽榜破紀錄留名判定卡與獎狀領取 */}
          <HonorSubmissionCard
            mode={`meteor-${subMode}`}
            book={qualifyingBook}
            score={score}
            time={survivalTime}
            totalCount={totalCountForAccuracy}
            rangeText={qualifyingBook ? `第 ${qualifyingBook} 冊` : (subMode === 'abc' ? '英文字母 ABC' : settings.selectedUnits.slice(0, 3).join(', '))}
            reviewWords={Array.from(encounteredWordsRef.current.values()).map(w => ({
              ...w,
              isMistake: mistakeIdsRef.current.has(w.id)
            }))}
          />

          <Button3D variant="slate" size="lg" onClick={handleExitGame} className="w-full mt-2">
            {t.backLobby}
          </Button3D>
        </GlassCard>
      </div>
    );
  }

  // 遊戲進行主畫面 (iPad 滿版零捲動: 100dvh + 彈性畫布)
  return (
    <div className="fixed inset-0 z-40 bg-slate-950 flex flex-col justify-between p-2 sm:p-4 overscroll-none touch-manipulation max-h-[100dvh] h-[100dvh] overflow-hidden select-none animate-fadeIn">
      {/* ── 頂部科幻戰術資訊列 ── */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between flex-shrink-0 gap-2 mb-1">
        <Button3D variant="slate" size="sm" onClick={handleExitGame} icon={ArrowLeft}>
          {t.backLobby}
        </Button3D>

        {/* 護盾防護生命 (Shield Life) */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 shadow-inner">
          <Shield className="w-4 h-4 text-cyan-400" />
          <div className="flex items-center gap-1.5">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className={`w-5 sm:w-6 h-2.5 sm:h-3 rounded-full transition-all duration-300 ${
                  i < lives
                    ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_10px_rgba(56,189,248,0.7)]'
                    : 'bg-slate-700 opacity-40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 連擊、得分與控制按鈕 */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {combo >= 1 && combo < 3 && (
            <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs shadow-md animate-bounce flex items-center gap-1">
              <span>{combo}x 🔥</span>
              <span className="text-[10px] text-amber-200">(+{combo}加成)</span>
            </div>
          )}
          
          <div className="relative">
            <div className="px-3 sm:px-4 py-1.5 rounded-2xl bg-cyan-600 text-white font-black text-xs sm:text-sm shadow-md font-mono flex items-center gap-1.5">
              <Target className="w-4 h-4 text-cyan-200" />
              <span>{score}分</span>
            </div>

            {/* 動態得分/加成漂浮通知 (置於右上方計分區下方，絕不遮蔽中央單字與隕石) */}
            {lastGainNotice && (
              <div
                className={`absolute right-0 top-10 z-50 px-3 py-1 rounded-xl font-black text-xs sm:text-sm shadow-xl animate-float-up-fade flex items-center gap-1.5 whitespace-nowrap pointer-events-none ${
                  lastGainNotice.type === 'ufo'
                    ? 'bg-emerald-500 text-white border border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.8)]'
                    : 'bg-cyan-500 text-white border border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.8)]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>{lastGainNotice.text}</span>
              </div>
            )}
          </div>

          {/* 2D / 3D 切換開關 */}
          <button
            onClick={() => setRenderMode(m => m === '3d' ? '2d' : '3d')}
            className="p-1.5 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-black flex items-center gap-1 transition-all"
            title="點擊切換 3D 沉浸視覺 或 2D 簡約模式"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>{renderMode === '3d' ? '3D' : '2D'}</span>
          </button>

          {/* 全螢幕切換按鈕 */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-black flex items-center transition-all"
            title={isFullscreen ? '結束全螢幕' : '全螢幕體驗'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
            )}
          </button>
        </div>
      </div>

      {/* ── 目標單字科幻 HUD 鎖定儀 ── */}
      {currentMeteor && (
        <div className="w-full max-w-md mx-auto flex items-center justify-center gap-2 px-3 py-1 mb-1 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-black flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>鎖定目標：</span>
          <span className="text-white text-sm font-black tracking-wide">
            {subMode === 'zh-en' ? currentMeteor.word.zh : currentMeteor.word.en}
          </span>
          {meteorsDestroyed >= 30 && (
            <span className="ml-1 px-1.5 py-0.5 rounded bg-rose-500/80 text-[10px] text-white font-black animate-pulse">
              超頻極速
            </span>
          )}
        </div>
      )}

      {/* ── 隕石戰場區域 (彈性自適應高度 flex-1 min-h-0) ── */}
      <div className="flex-1 min-h-0 w-full max-w-4xl mx-auto relative mb-2 sm:mb-3 flex items-center justify-center">
        {/* 右側深空空白區：階梯式氣球灌氣連擊正增強顯示 (3連對以上展開，不干擾中央隕石通道) */}
        <RightComboDisplay combo={combo} />

        {renderMode === '3d' ? (
          <div className="w-full h-full relative">
            <MeteorCanvas3D
              currentMeteor={currentMeteor}
              subMode={subMode}
              isExploding={isExploding}
              laserTrigger={laserTrigger}
              questionIndex={meteorsDestroyed}
              onUfoSuccess={handleUfoSuccess}
            />
          </div>
        ) : (
          /* 2D 簡約備援畫布 */
          <div
            ref={containerRef}
            className="w-full h-full rounded-2xl sm:rounded-3xl bg-slate-900 border-2 border-indigo-500/40 relative overflow-hidden shadow-2xl"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 30%, #1e1b4b 0%, #090d16 80%)'
            }}
          >
            {/* 2D 彩蛋系統 (飛機雲拖曳流星、人造衛星、原地旋轉 UFO) */}
            <MeteorEasterEggs2D onUfoSuccess={handleUfoSuccess} />

            {/* 墜落隕石 */}
            {currentMeteor && (
              <div
                ref={meteorRef}
                className="absolute -translate-x-1/2 flex flex-col items-center z-10 transition-all pointer-events-none"
                style={{ left: `${currentMeteor.x}%`, top: '-10%' }}
              >
                {isExploding ? (
                  <div className="text-5xl animate-bounce">💥</div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Flame className="w-8 h-8 text-amber-500 -mb-2 animate-pulse" />
                    <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-b from-amber-400 to-rose-600 text-white font-black text-lg sm:text-2xl shadow-xl border-2 border-yellow-200">
                      {subMode === 'zh-en' ? currentMeteor.word.zh : currentMeteor.word.en}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 地表防禦警戒線 */}
            <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-indigo-500/30 to-transparent border-t border-indigo-400/40" />
          </div>
        )}
      </div>

      {/* ── 下方 4 個全息能量戰術選項按鈕 ── */}
      <div className="w-full max-w-4xl mx-auto grid grid-cols-2 gap-2 sm:gap-3 flex-shrink-0">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleOptionClick(opt)}
            className="group relative p-3 sm:p-4 rounded-xl sm:rounded-2xl font-black text-base sm:text-xl transition-all duration-150 active:scale-95 text-center cursor-pointer select-none overflow-hidden bg-slate-900/90 text-cyan-100 hover:text-white border-2 border-cyan-500/50 hover:border-cyan-400 shadow-[0_4px_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            
            <div className="relative z-10 flex items-center justify-center gap-2">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all" />
              <span className="font-heading tracking-wide drop-shadow-md">
                {opt.text}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
