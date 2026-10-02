import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useI18n } from '../../context/I18nContext';
import { enterFullscreen, exitFullscreen } from '../../services/fullscreen';
import { soundEngine, speakEnglish } from '../../services/audio';
import { generateAlphabetMaze, getRecommendedGridSize } from './mazeGenerator';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';
import confetti from 'canvas-confetti';
import {
  Compass, ArrowLeft, RotateCcw, Volume2, VolumeX,
  Sparkles, Trophy, Award, CheckCircle2, ChevronRight,
  HelpCircle, Eye, EyeOff, Maximize2, Flag, Footprints,
  Play, Settings, Flame, ShieldAlert, Mountain, Rocket
} from 'lucide-react';

const ALPHABET_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const ALPHABET_LOWER = 'abcdefghijklmnopqrstuvwxyz'.split('');

export const AlphabetMazeGame = ({ onBack, qualifyingBook }) => {
  const { t, lang } = useI18n();

  // ── 遊戲模式狀態 ──
  // 'menu' (選單), 'playing' (遊戲中), 'settlement' (通關結算)
  const [gameState, setGameState] = useState('menu');

  // 模式層級：'beginner' (新手級), 'standard' (標準級), 'challenge' (挑戰級 10x10)
  const [tier, setTier] = useState('standard');

  // 大小寫切換：false = 大寫 (A-Z), true = 小寫 (a-z)
  const [isLowercase, setIsLowercase] = useState(false);

  // 主題外觀：'snake' (霧台神山百步蛇), 'cosmic' (星際光軌巡航)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('wutai_maze_theme') || 'snake';
  });

  // ── 新手級自選起訖字母 ──
  const [startChar, setStartChar] = useState('A');
  const [endChar, setEndChar] = useState('H');

  // ── 迷宮資料結構與玩家足跡 ──
  const [mazeData, setMazeData] = useState(null);
  // trail: 已走過的路徑儲存陣列 [{ r, c, char, index }]
  const [trail, setTrail] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [poppedCell, setPoppedCell] = useState(null); // 反悔回退時的吐出動畫目標

  // ── 計時與計分狀態 (挑戰級使用) ──
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  // ── 觸控與手勢安全防護 ──
  const gridContainerRef = useRef(null);
  const lastTouchCellRef = useRef(null);

  // 卸載時還原全螢幕
  useEffect(() => {
    return () => {
      exitFullscreen();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleToggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('wutai_maze_theme', newTheme);
    soundEngine.click();
  };

  // ── 根據難度與設定計算目標序列與網格大小 ──
  const { sequence, gridRows, gridCols } = useMemo(() => {
    const alphabet = isLowercase ? ALPHABET_LOWER : ALPHABET_UPPER;

    if (tier === 'beginner') {
      const sIdx = alphabet.indexOf(isLowercase ? startChar.toLowerCase() : startChar.toUpperCase());
      const eIdx = alphabet.indexOf(isLowercase ? endChar.toLowerCase() : endChar.toUpperCase());
      const validS = Math.max(0, sIdx === -1 ? 0 : sIdx);
      const validE = Math.max(validS + 1, eIdx === -1 ? validS + 3 : eIdx);
      const seq = alphabet.slice(validS, validE + 1);
      const { rows, cols } = getRecommendedGridSize(seq.length);
      return { sequence: seq, gridRows: rows, gridCols: cols };
    }

    if (tier === 'standard') {
      return { sequence: alphabet, gridRows: 8, gridCols: 8 };
    }

    // 挑戰級：固定 10x10 網格
    return { sequence: alphabet, gridRows: 10, gridCols: 10 };
  }, [tier, isLowercase, startChar, endChar]);

  // ── 初始化或重新生成迷宮 ──
  const startNewMaze = useCallback(() => {
    try {
      const generated = generateAlphabetMaze({
        rows: gridRows,
        cols: gridCols,
        sequence,
        isLowercase
      });
      setMazeData(generated);
      setTrail([]);
      setPoppedCell(null);
      setElapsedTime(0);
      setTimerRunning(false);
      lastTouchCellRef.current = null;
    } catch (e) {
      console.error('Maze generation error:', e);
    }
  }, [gridRows, gridCols, sequence, isLowercase]);

  // 進入遊戲畫面
  const handleLaunchGame = (selectedTier = tier) => {
    enterFullscreen();
    soundEngine.click();
    setTier(selectedTier);
    setGameState('playing');
    // 生成全新迷宮
    const alphabet = isLowercase ? ALPHABET_LOWER : ALPHABET_UPPER;
    let seq = alphabet;
    let r = 8, c = 8;

    if (selectedTier === 'beginner') {
      const sIdx = alphabet.indexOf(isLowercase ? startChar.toLowerCase() : startChar.toUpperCase());
      const eIdx = alphabet.indexOf(isLowercase ? endChar.toLowerCase() : endChar.toUpperCase());
      const validS = Math.max(0, sIdx === -1 ? 0 : sIdx);
      const validE = Math.max(validS + 1, eIdx === -1 ? validS + 3 : eIdx);
      seq = alphabet.slice(validS, validE + 1);
      const rec = getRecommendedGridSize(seq.length);
      r = rec.rows;
      c = rec.cols;
    } else if (selectedTier === 'challenge') {
      r = 10;
      c = 10;
    }

    const generated = generateAlphabetMaze({
      rows: r,
      cols: c,
      sequence: seq,
      isLowercase
    });
    setMazeData(generated);
    setTrail([]);
    setPoppedCell(null);
    setElapsedTime(0);
    setTimerRunning(false);
    lastTouchCellRef.current = null;
  };

  // 計時器管理
  useEffect(() => {
    if (timerRunning) {
      startTimeRef.current = Date.now() - elapsedTime * 1000;
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  // ── 通關判定與勝利結算 ──
  const handleVictory = useCallback(() => {
    setTimerRunning(false);
    soundEngine.win();
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
    setGameState('settlement');
  }, []);

  // ── 核心路徑推進與反悔回退判定 ──
  const handleStepTo = useCallback((r, c) => {
    if (!mazeData) return;
    const { grid, sequence } = mazeData;
    const targetCell = grid[r]?.[c];
    if (!targetCell) return;

    setTrail(prevTrail => {
      // 情況 A：如果目前尚未踩在起點上
      if (prevTrail.length === 0) {
        if (targetCell.isStart) {
          // 正式踩入起點！
          soundEngine.correct();
          speakEnglish(targetCell.char);
          setTimerRunning(true);
          return [{ r, c, char: targetCell.char, index: 0 }];
        }
        return prevTrail;
      }

      const currentHead = prevTrail[prevTrail.length - 1];

      // 情況 B：點擊或滑動到當前蛇頭 (無動作)
      if (currentHead.r === r && currentHead.c === c) {
        return prevTrail;
      }

      // 情況 C：滑動反悔回退 (BACKTRACKING)
      // 若碰觸的是上一格 (prevTrail[length - 2])，立即吐回最後一顆字母！
      if (prevTrail.length >= 2) {
        const prevStep = prevTrail[prevTrail.length - 2];
        if (prevStep.r === r && prevStep.c === c) {
          // 觸發吐回字母動畫與音效
          soundEngine.laser();
          setPoppedCell({ r: currentHead.r, c: currentHead.c, char: currentHead.char, time: Date.now() });
          setTimeout(() => setPoppedCell(null), 400);
          return prevTrail.slice(0, prevTrail.length - 1);
        }
      }

      // 情況 D：檢查是否為正交相鄰移動 (嚴格正交：曼哈頓距離為 1)
      const dist = Math.abs(currentHead.r - r) + Math.abs(currentHead.c - c);
      if (dist !== 1) {
        // 斜角或非相鄰：禁止移動
        return prevTrail;
      }

      // 檢查是否回頭撞到自己的蛇身 (Self-avoiding)
      const alreadyInTrail = prevTrail.some(step => step.r === r && step.c === c);
      if (alreadyInTrail) {
        soundEngine.wrong();
        return prevTrail;
      }

      // 檢查字母是否為序列中下一個期待的字母
      const expectedChar = sequence[prevTrail.length];
      if (targetCell.char === expectedChar) {
        // 成功吞食推進！
        soundEngine.correct();
        speakEnglish(targetCell.char);

        const newTrail = [
          ...prevTrail,
          { r, c, char: targetCell.char, index: prevTrail.length }
        ];

        // 檢查是否成功到達終點 (最後一個字母)
        if (newTrail.length === sequence.length) {
          setTimeout(() => handleVictory(), 300);
        }

        return newTrail;
      } else {
        // 踩到錯誤字母 (在新手與標準模式發出輕柔提示聲)
        if (tier !== 'challenge') {
          soundEngine.wrong();
        }
        return prevTrail;
      }
    });
  }, [mazeData, tier, handleVictory]);

  // ── 觸控與指標座標轉換 ──
  const getCellFromCoords = (clientX, clientY) => {
    if (!gridContainerRef.current || !mazeData) return null;
    const rect = gridContainerRef.current.getBoundingClientRect();
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      return null;
    }
    const c = Math.floor(((clientX - rect.left) / rect.width) * mazeData.cols);
    const r = Math.floor(((clientY - rect.top) / rect.height) * mazeData.rows);
    if (r >= 0 && r < mazeData.rows && c >= 0 && c < mazeData.cols) {
      return { r, c };
    }
    return null;
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    const cell = getCellFromCoords(e.clientX, e.clientY);
    if (cell) {
      lastTouchCellRef.current = `${cell.r},${cell.c}`;
      handleStepTo(cell.r, cell.c);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const cell = getCellFromCoords(e.clientX, e.clientY);
    if (cell) {
      const key = `${cell.r},${cell.c}`;
      if (lastTouchCellRef.current !== key) {
        lastTouchCellRef.current = key;
        handleStepTo(cell.r, cell.c);
      }
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    lastTouchCellRef.current = null;
  };

  // 點擊格子支援 (供偏好逐格點擊的低年級學生)
  const handleCellClick = (r, c) => {
    handleStepTo(r, c);
  };

  // ── 計算下一格的期待提示 (僅限新手級與標準級) ──
  const nextTargetInfo = useMemo(() => {
    if (!mazeData || tier === 'challenge') return null;
    const { sequence, grid, rows, cols } = mazeData;
    if (trail.length === 0) {
      return {
        expectedChar: sequence[0],
        nextCells: [mazeData.startCell]
      };
    }
    if (trail.length >= sequence.length) return null;

    const expectedChar = sequence[trail.length];
    const head = trail[trail.length - 1];

    // 尋找正交相鄰且字元相符的下一格
    const validNeighbors = [];
    const dirs = [
      { dr: -1, dc: 0 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 }
    ];

    for (const { dr, dc } of dirs) {
      const nr = head.r + dr;
      const nc = head.c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        if (grid[nr][nc].char === expectedChar && !trail.some(t => t.r === nr && t.c === nc)) {
          validNeighbors.push({ r: nr, c: nc });
        }
      }
    }

    return { expectedChar, nextCells: validNeighbors };
  }, [mazeData, trail, tier]);

  // 退出至大廳
  const handleBackToLobby = () => {
    exitFullscreen();
    onBack();
  };

  // 退出至迷宮模式選單
  const handleBackToMenu = () => {
    setGameState('menu');
    setTrail([]);
    setTimerRunning(false);
  };

  // ─── 畫面 1：迷宮主選單與難度設定 ───
  if (gameState === 'menu') {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-6 animate-fadeIn pb-16">
        {/* 頂部導覽列 */}
        <div className="flex items-center justify-between">
          <Button3D variant="slate" size="sm" onClick={handleBackToLobby} icon={ArrowLeft}>
            {t.backToVocabLobby || '回單字學習館'}
          </Button3D>

          {/* 雙主題切換鈕 */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => handleToggleTheme('snake')}
              className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                theme === 'snake'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Mountain className="w-3.5 h-3.5" />
              <span>百步蛇巡航</span>
            </button>
            <button
              onClick={() => handleToggleTheme('cosmic')}
              className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                theme === 'cosmic'
                  ? 'bg-indigo-600 text-white shadow-md font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>星際光軌</span>
            </button>
          </div>
        </div>

        {/* 歡迎橫幅 */}
        <GlassCard className="text-center p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border-2 border-amber-300 dark:border-amber-700/60 shadow-lg">
          <div className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-tr from-amber-500 to-yellow-400 text-stone-950 shadow-xl shadow-amber-500/30">
            {theme === 'snake' ? (
              <span className="text-5xl select-none animate-bounce">🐍</span>
            ) : (
              <Compass className="w-10 h-10 text-white animate-spin-slow" />
            )}
          </div>

          <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-800 dark:text-white mb-2">
            {theme === 'snake' ? '⛰️ 霧台神山 • 百步蛇字母巡航' : '🌌 星際字母巡航迷宮'}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            {theme === 'snake'
              ? '化身排灣與魯貴族守護神百步蛇，手指靈活劃過蜿蜒山徑，按照字母順序一路吃下字母直抵出口！'
              : '專為國小低年級打造的英文字母迷宮！手指從入口 A 順著字母順序滑向出口 Z，鍛鍊空間與字母敏捷力！'}
          </p>

          {/* 大小寫即時切換 */}
          <div className="mt-5 inline-flex items-center gap-2 p-1.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 shadow-sm">
            <button
              onClick={() => { setIsLowercase(false); soundEngine.click(); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                !isLowercase
                  ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              🔤 大寫字母 (A - Z)
            </button>
            <button
              onClick={() => { setIsLowercase(true); soundEngine.click(); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                isLowercase
                  ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              🔡 小寫字母 (a - z)
            </button>
          </div>
        </GlassCard>

        {/* ── 三大難度層級便當卡 ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. 新手級 (Beginner) */}
          <GlassCard className="p-6 flex flex-col justify-between border-2 border-emerald-300/80 dark:border-emerald-700/60 relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500 text-white shadow-sm">
                  🌱 入門啟蒙
                </span>
                <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400">
                  {gridRows}x{gridCols} 網格
                </span>
              </div>

              <h3 className="text-xl font-black font-heading text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span>新手級</span>
              </h3>

              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                自選起訖字母區間，動態調整網格大小 (5x5 ~ 8x8)，全程發光引導，適合低年級初期練習！
              </p>

              {/* 新手級自選字母區塊 */}
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-slate-700 dark:text-slate-200">
                  <span>起點字母：</span>
                  <select
                    value={startChar}
                    onChange={(e) => {
                      setStartChar(e.target.value);
                      if (e.target.value >= endChar) {
                        const alpha = isLowercase ? ALPHABET_LOWER : ALPHABET_UPPER;
                        const idx = alpha.indexOf(e.target.value);
                        setEndChar(alpha[Math.min(alpha.length - 1, idx + 3)]);
                      }
                    }}
                    className="p-1 px-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-black text-xs outline-none"
                  >
                    {(isLowercase ? ALPHABET_LOWER : ALPHABET_UPPER).slice(0, 22).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs font-black text-slate-700 dark:text-slate-200">
                  <span>終點字母：</span>
                  <select
                    value={endChar}
                    onChange={(e) => setEndChar(e.target.value)}
                    className="p-1 px-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-black text-xs outline-none"
                  >
                    {(isLowercase ? ALPHABET_LOWER : ALPHABET_UPPER)
                      .slice(
                        (isLowercase ? ALPHABET_LOWER : ALPHABET_UPPER).indexOf(startChar) + 2
                      )
                      .map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                  </select>
                </div>

                <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 text-center pt-1 border-t border-emerald-200/60 dark:border-emerald-800/60">
                  🎯 區間共 {sequence.length} 個字母 • 自動適配 {gridRows}x{gridCols}
                </div>
              </div>
            </div>

            <Button3D
              variant="emerald"
              size="md"
              onClick={() => handleLaunchGame('beginner')}
              className="w-full mt-4"
            >
              開始新手練習
            </Button3D>
          </GlassCard>

          {/* 2. 標準級 (Standard) */}
          <GlassCard className="p-6 flex flex-col justify-between border-2 border-blue-300/80 dark:border-blue-700/60 relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-500 text-white shadow-sm">
                  ⭐ 全字母巡航
                </span>
                <span className="text-xs font-mono font-black text-blue-600 dark:text-blue-400">
                  8x8 網格
                </span>
              </div>

              <h3 className="text-xl font-black font-heading text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span>標準級</span>
              </h3>

              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                完整 26 個英文字母 ({isLowercase ? 'a-z' : 'A-Z'})，在 8x8 網格中依序巡航。提供即時回饋與發音引導，適合熟練全字母順序！
              </p>

              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>從入口 {isLowercase ? 'a' : 'A'} 直通出口 {isLowercase ? 'z' : 'Z'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>附帶語音發音與下一步發光引導</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>不計入排行榜，輕鬆練功</span>
                </div>
              </div>
            </div>

            <Button3D
              variant="blue"
              size="md"
              onClick={() => handleLaunchGame('standard')}
              className="w-full mt-4"
            >
              進入標準巡航
            </Button3D>
          </GlassCard>

          {/* 3. 挑戰級 (Challenge - 10x10) */}
          <GlassCard className="p-6 flex flex-col justify-between border-2 border-amber-400/90 dark:border-amber-600/80 relative overflow-hidden bg-gradient-to-b from-amber-500/5 to-orange-500/10">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-sm flex items-center gap-1">
                  <Flame className="w-3 h-3 animate-pulse" />
                  <span>Top 50 英雄榜</span>
                </span>
                <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400">
                  10x10 大網格
                </span>
              </div>

              <h3 className="text-xl font-black font-heading text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span>挑戰級</span>
              </h3>

              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                100 格巨型迷宮！全程不提供任何提示或發光引導，純憑實力眼力巡航！通關記錄秒數角逐全校 Top 50 榮譽榜！
              </p>

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>零提示盲走挑戰（考驗空間辨識）</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>通關登記秒數登頂全校排行榜</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Footprints className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>支援反悔回退（滑回上一格即可重走）</span>
                </div>
              </div>
            </div>

            <Button3D
              variant="amber"
              size="md"
              onClick={() => handleLaunchGame('challenge')}
              className="w-full mt-4"
            >
              挑戰 10x10 英雄榜
            </Button3D>
          </GlassCard>
        </div>
      </div>
    );
  }

  // ─── 畫面 2：遊戲進行中 (滿版防誤觸全螢幕設計) ───
  if (gameState === 'playing' && mazeData) {
    const isIndigenous = theme === 'snake';
    const isChallenge = tier === 'challenge';
    const currentStep = trail.length;
    const totalSteps = mazeData.sequence.length;
    const progressPercent = Math.round((currentStep / totalSteps) * 100);

    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-between p-2 sm:p-4 select-none touch-none overscroll-none overflow-hidden"
        style={{
          backgroundColor: isIndigenous ? '#0f172a' : '#090d16',
          backgroundImage: isIndigenous
            ? 'radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)'
            : 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.12) 0%, rgba(9, 13, 22, 0.98) 100%)'
        }}
      >
        {/* ── 頂部 HUD 資訊防卡死控制列 ── */}
        <div className="w-full max-w-2xl flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            {/* 防遊戲卡死必備按鈕：點擊立刻返回迷宮選單 */}
            <button
              onClick={handleBackToMenu}
              className="px-3 py-2 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-black flex items-center gap-1.5 border border-white/20 shadow-md transition-all cursor-pointer"
              title="回迷宮選單"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">回選單</span>
            </button>

            {/* 快速返回單字學習館 */}
            <button
              onClick={handleBackToLobby}
              className="px-3 py-2 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300 hover:text-white text-xs font-black flex items-center gap-1 border border-white/15 shadow-md transition-all cursor-pointer"
              title="回單字學習館"
            >
              <span>回單字館</span>
            </button>

            {/* 重新生成迷宮按鈕 */}
            <button
              onClick={startNewMaze}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/20 shadow-md transition-all cursor-pointer"
              title="重新生成地圖"
            >
              <RotateCcw className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

          {/* 模式標籤與計時器 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-black/40 border border-white/10 text-white font-mono font-black text-xs sm:text-sm">
              <span className="text-amber-400">⏱️</span>
              <span>{elapsedTime}s</span>
            </div>

            <div className="px-3 py-1 rounded-full text-xs font-black shadow-sm flex items-center gap-1 bg-white/15 text-white border border-white/20">
              {isIndigenous ? '🐍' : '🚀'}
              <span>{tier === 'beginner' ? '新手級' : tier === 'standard' ? '標準級' : '挑戰級 10x10'}</span>
            </div>
          </div>
        </div>

        {/* ── 進度提示條與目前目標字母 (HUD) ── */}
        <div className="w-full max-w-2xl px-2 my-1 shrink-0 flex items-center justify-between gap-3 text-xs font-black">
          <div className="flex-1 bg-white/10 h-3 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isIndigenous
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400'
                  : 'bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="text-white shrink-0 font-mono">
            <span className="text-amber-400 text-sm font-black">{currentStep}</span> / {totalSteps}
          </div>

          {/* 新手與標準級：下一步提示徽章 */}
          {!isChallenge && nextTargetInfo && (
            <div className="px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center gap-1 animate-pulse">
              <span>目標:</span>
              <span className="text-base font-black text-amber-200 underline">{nextTargetInfo.expectedChar}</span>
            </div>
          )}
        </div>

        {/* ── 核心字母迷宮網格 (零捲動全螢幕適配) ── */}
        <div className="w-full flex-1 flex items-center justify-center p-1 sm:p-2">
          <div
            ref={gridContainerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative aspect-square w-full max-w-[min(88vw,70vh)] max-h-[70vh] rounded-3xl p-2 sm:p-3 shadow-2xl border-2 select-none touch-none"
            style={{
              backgroundColor: isIndigenous ? '#1e293b' : '#0f172a',
              borderColor: isIndigenous ? 'rgba(245, 158, 11, 0.4)' : 'rgba(99, 102, 241, 0.4)',
              boxShadow: isIndigenous
                ? '0 0 30px rgba(245, 158, 11, 0.15)'
                : '0 0 30px rgba(99, 102, 241, 0.2)'
            }}
          >
            {/* ── 百步蛇 / 光軌 SVG 連線身體圖層 (細長身軀，約 38% 格寬) ── */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox={`0 0 ${mazeData.cols * 100} ${mazeData.rows * 100}`}
            >
              <defs>
                <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
                <linearGradient id="cosmicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>

              {/* 繪製平滑相連的蛇身軌跡線 (寬度 36，優雅細長) */}
              {trail.length >= 2 && (
                <polyline
                  points={trail
                    .map(step => `${step.c * 100 + 50},${step.r * 100 + 50}`)
                    .join(' ')}
                  fill="none"
                  stroke={isIndigenous ? 'url(#snakeGradient)' : 'url(#cosmicGradient)'}
                  strokeWidth="36"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity="0.85"
                />
              )}

              {/* 百步蛇排灣幾何菱形骨節花紋 (沿著蛇身點綴) */}
              {isIndigenous && trail.length >= 1 && trail.map((step, idx) => {
                const cx = step.c * 100 + 50;
                const cy = step.r * 100 + 50;
                return (
                  <polygon
                    key={`diamond-${idx}`}
                    points={`${cx},${cy - 12} ${cx + 12},${cy} ${cx},${cy + 12} ${cx - 12},${cy}`}
                    fill="#78350f"
                    stroke="#fef08a"
                    strokeWidth="2"
                    opacity="0.9"
                  />
                );
              })}
            </svg>

            {/* ── 網格本體 (CSS Grid) ── */}
            <div
              className="w-full h-full grid gap-1 sm:gap-1.5"
              style={{
                gridTemplateRows: `repeat(${mazeData.rows}, minmax(0, 1fr))`,
                gridTemplateColumns: `repeat(${mazeData.cols}, minmax(0, 1fr))`
              }}
            >
              {mazeData.grid.map((row, r) =>
                row.map((cell, c) => {
                  const trailIndex = trail.findIndex(t => t.r === r && t.c === c);
                  const isVisited = trailIndex !== -1;
                  const isHead = isVisited && trailIndex === trail.length - 1;
                  const isStart = cell.isStart;
                  const isEnd = cell.isEnd;

                  // 檢查是否為新手/標準模式下的「下一步提示候選格」
                  const isNextHint = !isChallenge && nextTargetInfo?.nextCells.some(nc => nc.r === r && nc.c === c);

                  // 檢查是否剛被吐回反悔
                  const isPopping = poppedCell && poppedCell.r === r && poppedCell.c === c;

                  return (
                    <div
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      className={`
                        relative rounded-xl sm:rounded-2xl flex items-center justify-center font-heading font-black
                        transition-all duration-150 cursor-pointer select-none
                        ${cell.char.length > 1 ? 'text-xs' : 'text-sm sm:text-base md:text-lg'}
                        ${
                          isHead
                            ? isIndigenous
                              ? 'bg-amber-400 text-stone-950 scale-105 shadow-lg shadow-amber-400/50 z-20 border-2 border-white'
                              : 'bg-cyan-400 text-slate-950 scale-105 shadow-lg shadow-cyan-400/50 z-20 border-2 border-white'
                            : isVisited
                            ? isIndigenous
                              ? 'bg-amber-600/50 text-amber-100 border border-amber-400/40 z-10'
                              : 'bg-indigo-600/50 text-indigo-100 border border-indigo-400/40 z-10'
                            : isNextHint
                            ? 'bg-amber-500/25 text-amber-200 border-2 border-amber-400 animate-pulse scale-100 shadow-md'
                            : isStart
                            ? 'bg-emerald-500/30 text-emerald-300 border-2 border-emerald-400 hover:scale-105'
                            : isEnd
                            ? 'bg-rose-500/30 text-rose-300 border-2 border-rose-400 hover:scale-105'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                        }
                        ${isPopping ? 'animate-ping' : ''}
                      `}
                    >
                      {/* 格子字母 */}
                      <span className={`tracking-tight ${isHead ? 'scale-110 font-extrabold' : ''}`}>
                        {cell.char}
                      </span>

                      {/* 蛇頭專屬圖示 (百步蛇頭 / 太空船頭) */}
                      {isHead && (
                        <div className="absolute -top-3.5 -right-2 text-base select-none animate-bounce pointer-events-none">
                          {isIndigenous ? '🐍' : '🚀'}
                        </div>
                      )}

                      {/* 入口 START 標記 */}
                      {isStart && !isVisited && (
                        <span className="absolute -top-1 -left-1 px-1 py-0.2 rounded-md bg-emerald-500 text-white font-mono font-black text-[8px] sm:text-[9px] shadow-sm pointer-events-none">
                          IN
                        </span>
                      )}

                      {/* 出口 EXIT 標記 */}
                      {isEnd && !isVisited && (
                        <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-md bg-rose-500 text-white font-mono font-black text-[8px] sm:text-[9px] shadow-sm pointer-events-none">
                          OUT
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ── 底部操作導引提示 ── */}
        <div className="w-full max-w-2xl px-2 py-1 shrink-0 flex items-center justify-between text-slate-400 text-[11px] font-bold">
          <span>💡 手指沿著字母滑動或點擊前進</span>
          <span className="text-amber-400/80">滑回上一格即可反悔回退重走</span>
        </div>
      </div>
    );
  }

  // ─── 畫面 3：遊戲結算畫面 (通關榮譽登榜) ───
  if (gameState === 'settlement') {
    const isChallenge = tier === 'challenge';
    const isIndigenous = theme === 'snake';
    // 挑戰級分數計算：完成獲得基底分，耗時越短分數越高 (配合 SQL order by score desc, time asc)
    const challengeScore = Math.max(10, 1000 - elapsedTime * 5);

    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 animate-fadeIn">
        <GlassCard className="max-w-md w-full text-center p-6 sm:p-8 border shadow-2xl relative overflow-hidden">
          {/* 通關勳章 */}
          <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center bg-gradient-to-tr from-amber-500 to-yellow-300 text-stone-950 shadow-xl shadow-amber-500/30">
            {isIndigenous ? (
              <span className="text-4xl">👑</span>
            ) : (
              <Trophy className="w-10 h-10 text-stone-950 animate-bounce" />
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-800 dark:text-slate-100 mb-1">
            {isIndigenous ? '⛰️ 百步蛇巡航通關！' : '🎉 字母迷宮巡航成功！'}
          </h2>

          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-5">
            成功從入口一路連接至出口 • 耗費時間：
            <span className="text-amber-500 font-black text-lg ml-1 font-mono">
              {elapsedTime} 秒
            </span>
          </p>

          {/* 模式成果看板 */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 mb-6 flex flex-col items-center">
            <span className="text-3xl font-black text-amber-500 font-mono">
              {isChallenge ? `${challengeScore} 分` : `${mazeData?.sequence.length} / ${mazeData?.sequence.length}`}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
              {isChallenge ? '挑戰級巡航競技積分' : '已完成全部目標字母順序'}
            </span>
          </div>

          {/* 挑戰級專屬：提報全校 Top 50 榮譽榜 */}
          {isChallenge ? (
            <HonorSubmissionCard
              mode={isLowercase ? 'maze-lower' : 'maze-upper'}
              book={qualifyingBook || '1'}
              score={challengeScore}
              time={elapsedTime}
              totalCount={mazeData?.sequence.length || 26}
              rangeText={isLowercase ? '10x10 小寫字母迷宮' : '10x10 大寫字母迷宮'}
              reviewWords={[]}
            />
          ) : (
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-xs font-bold text-slate-600 dark:text-slate-300 mb-4">
              🌟 本模式為引導練習模式。若想登錄全校 Top 50 英雄榜，歡迎前往挑戰「挑戰級 10x10 網格」！
            </div>
          )}

          {/* 按鈕群組 */}
          <div className="space-y-2 mt-4">
            <Button3D
              variant="amber"
              size="lg"
              onClick={() => handleLaunchGame(tier)}
              className="w-full text-base"
            >
              再玩一次
            </Button3D>

            <Button3D
              variant="blue"
              size="md"
              onClick={handleBackToMenu}
              className="w-full"
            >
              回迷宮選單
            </Button3D>

            <Button3D
              variant="slate"
              size="md"
              onClick={handleBackToLobby}
              className="w-full"
            >
              {t.backToVocabLobby || '回單字學習館'}
            </Button3D>
          </div>
        </GlassCard>
      </div>
    );
  }

  return null;
};
