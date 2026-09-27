import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useI18n } from '../../context/I18nContext';
import { soundEngine, speakEnglish } from '../../services/audio';
import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';
import confetti from 'canvas-confetti';
import {
  ArrowLeft, Heart, Trophy, Sparkles,
  ArrowUp, ArrowDown, ArrowLeft as DpadLeft, ArrowRight as DpadRight
} from 'lucide-react';

const GRID_W = 20;
const GRID_H = 12;

export const SnakeGame = ({
  settings,
  words = [],
  qualifyingBook,
  onBack
}) => {
  const { t } = useI18n();
  const [gameMode, setGameMode] = useState('normal'); // 'easy' | 'normal' | 'survival'
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [currentWord, setCurrentWord] = useState(null);
  const [spelledChars, setSpelledChars] = useState('');
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [timeLeft, setTimeLeft] = useState(60);
  const [survivalTime, setSurvivalTime] = useState(0);

  const canvasRef = useRef(null);
  const snakeRef = useRef([{ x: 6, y: 6 }, { x: 5, y: 6 }]);
  const dirRef = useRef('RIGHT');
  const lettersRef = useRef([]); // [{ char, x, y, id }]
  const wordQueueRef = useRef([]);
  const startTimeRef = useRef(0);

  // 初始化題庫
  useEffect(() => {
    let filtered = words.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
    wordQueueRef.current = [...filtered].sort(() => 0.5 - Math.random());
  }, [settings, words]);

  const loadNextWord = () => {
    if (wordQueueRef.current.length === 0) {
      const filtered = words.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
      wordQueueRef.current = [...filtered].sort(() => 0.5 - Math.random());
    }
    const next = wordQueueRef.current.shift();
    setCurrentWord(next);
    setSpelledChars('');
    speakEnglish(next.en);

    // 在場上生成目標單字的所有字母與干擾字母
    const targetLetters = next.en.toLowerCase().split('');
    const extraLetters = 'abcdefghijklmnopqrstuvwxyz'
      .split('')
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const allChars = [...targetLetters, ...extraLetters].sort(() => 0.5 - Math.random());

    const placed = [];
    allChars.forEach((ch, idx) => {
      let x, y;
      let tries = 0;
      do {
        x = Math.floor(Math.random() * (GRID_W - 2)) + 1;
        y = Math.floor(Math.random() * (GRID_H - 2)) + 1;
        tries++;
      } while (
        tries < 50 &&
        (placed.some(p => p.x === x && p.y === y) ||
          snakeRef.current.some(s => s.x === x && s.y === y))
      );

      placed.push({ char: ch, x, y, id: `${ch}-${idx}-${Date.now()}` });
    });

    lettersRef.current = placed;
  };

  const handleStart = (mode) => {
    const filtered = words.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
    if (filtered.length === 0) {
      alert('請先在主畫面勾選複習範圍！');
      return onBack();
    }
    wordQueueRef.current = [...filtered].sort(() => 0.5 - Math.random());
    setGameMode(mode);
    setHasStarted(true);
    setScore(0);
    setHearts(5);
    setTimeLeft(60);
    startTimeRef.current = Date.now();
    snakeRef.current = [{ x: 6, y: 6 }, { x: 5, y: 6 }];
    dirRef.current = 'RIGHT';

    loadNextWord();
  };

  // 鍵盤操作監聽
  useEffect(() => {
    if (!hasStarted || isFinished) return;

    const handleKeyDown = (e) => {
      const cur = dirRef.current;
      if ((e.key === 'ArrowUp' || e.key === 'w') && cur !== 'DOWN') dirRef.current = 'UP';
      else if ((e.key === 'ArrowDown' || e.key === 's') && cur !== 'UP') dirRef.current = 'DOWN';
      else if ((e.key === 'ArrowLeft' || e.key === 'a') && cur !== 'RIGHT') dirRef.current = 'LEFT';
      else if ((e.key === 'ArrowRight' || e.key === 'd') && cur !== 'LEFT') dirRef.current = 'RIGHT';
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, isFinished]);

  // 遊戲主迴圈
  useEffect(() => {
    if (!hasStarted || isFinished) return;

    const speed = gameMode === 'easy' ? 220 : 160;
    const interval = setInterval(() => {
      // 1. 移動蛇頭
      const head = { ...snakeRef.current[0] };
      const dir = dirRef.current;
      if (dir === 'UP') head.y -= 1;
      else if (dir === 'DOWN') head.y += 1;
      else if (dir === 'LEFT') head.x -= 1;
      else if (dir === 'RIGHT') head.x += 1;

      // 穿牆循環 (Wrap around)
      if (head.x < 0) head.x = GRID_W - 1;
      if (head.x >= GRID_W) head.x = 0;
      if (head.y < 0) head.y = GRID_H - 1;
      if (head.y >= GRID_H) head.y = 0;

      // 撞到自己
      const hitSelf = snakeRef.current.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
      if (hitSelf) {
        soundEngine.wrong();
        setHearts(h => {
          if (h <= 1) finishGame();
          return h - 1;
        });
      }

      // 檢查是否吃到字母
      const letterIndex = lettersRef.current.findIndex(l => l.x === head.x && l.y === head.y);
      if (letterIndex !== -1) {
        const eaten = lettersRef.current[letterIndex];
        const nextChar = currentWord.en.toLowerCase()[spelledChars.length];

        if (eaten.char === nextChar) {
          // 吃到正確字母
          soundEngine.correct();
          const newSpelled = spelledChars + eaten.char;
          setSpelledChars(newSpelled);
          lettersRef.current.splice(letterIndex, 1);

          // 完成整字拼字
          if (newSpelled === currentWord.en.toLowerCase()) {
            soundEngine.combo(3);
            setScore(s => s + 10);
            confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
            setTimeout(() => loadNextWord(), 400);
          }
        } else {
          // 吃錯字母
          soundEngine.wrong();
          setHearts(h => {
            if (h <= 1) finishGame();
            return h - 1;
          });
        }
      } else {
        snakeRef.current.pop();
      }

      snakeRef.current.unshift(head);
      draw();
    }, speed);

    return () => clearInterval(interval);
  }, [hasStarted, isFinished, spelledChars, currentWord, gameMode]);

  // 計時器 (一般模式)
  useEffect(() => {
    if (!hasStarted || isFinished || gameMode !== 'normal') return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          finishGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, isFinished, gameMode]);

  const finishGame = () => {
    setIsFinished(true);
    setSurvivalTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    soundEngine.win();
  };

  // Canvas 繪圖渲染
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const tileW = canvas.width / GRID_W;
    const tileH = canvas.height / GRID_H;

    // 清空背景 (草地綠)
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 棋盤格紋草地
    for (let x = 0; x < GRID_W; x++) {
      for (let y = 0; y < GRID_H; y++) {
        if ((x + y) % 2 === 0) {
          ctx.fillStyle = '#059669';
          ctx.fillRect(x * tileW, y * tileH, tileW, tileH);
        }
      }
    }

    // 繪製字母水果
    lettersRef.current.forEach(l => {
      const isNextTarget =
        gameMode === 'easy' &&
        currentWord &&
        l.char === currentWord.en.toLowerCase()[spelledChars.length];

      // 字母背景圓形
      ctx.beginPath();
      ctx.arc(l.x * tileW + tileW / 2, l.y * tileH + tileH / 2, tileW * 0.44, 0, Math.PI * 2);
      ctx.fillStyle = isNextTarget ? '#facc15' : '#ffffff';
      ctx.fill();
      ctx.strokeStyle = isNextTarget ? '#ca8a04' : '#d1d5db';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 字母文字
      ctx.fillStyle = isNextTarget ? '#78350f' : '#1e293b';
      ctx.font = 'bold 18px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(l.char.toUpperCase(), l.x * tileW + tileW / 2, l.y * tileH + tileH / 2);
    });

    // 繪製貪食蛇身
    snakeRef.current.forEach((seg, idx) => {
      ctx.beginPath();
      ctx.arc(seg.x * tileW + tileW / 2, seg.y * tileH + tileH / 2, tileW * 0.42, 0, Math.PI * 2);
      ctx.fillStyle = idx === 0 ? '#38bdf8' : '#60a5fa';
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 蛇眼
      if (idx === 0) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(seg.x * tileW + tileW / 2 - 4, seg.y * tileH + tileH / 2 - 3, 3, 0, Math.PI * 2);
        ctx.arc(seg.x * tileW + tileW / 2 + 4, seg.y * tileH + tileH / 2 - 3, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(seg.x * tileW + tileW / 2 - 4, seg.y * tileH + tileH / 2 - 3, 1.5, 0, Math.PI * 2);
        ctx.arc(seg.x * tileW + tileW / 2 + 4, seg.y * tileH + tileH / 2 - 3, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  const touchStartRef = useRef(null);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e) => {
    if (e.cancelable) e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 20) {
      if (absX > absY) {
        handleDpad(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        handleDpad(dy > 0 ? 'DOWN' : 'UP');
      }
    }
    touchStartRef.current = null;
  };

  const handleDpad = (newDir) => {
    const cur = dirRef.current;
    if (newDir === 'UP' && cur !== 'DOWN') dirRef.current = 'UP';
    if (newDir === 'DOWN' && cur !== 'UP') dirRef.current = 'DOWN';
    if (newDir === 'LEFT' && cur !== 'RIGHT') dirRef.current = 'LEFT';
    if (newDir === 'RIGHT' && cur !== 'LEFT') dirRef.current = 'RIGHT';
  };

  if (!hasStarted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full text-center p-8">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Sparkles className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2 font-heading">
            {t.snakeTitle}
          </h2>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-6">
            {t.snakeHelp}
          </p>

          <div className="space-y-3">
            <Button3D variant="emerald" size="lg" onClick={() => handleStart('easy')} className="w-full">
              {t.snakeEasy}
            </Button3D>
            <Button3D variant="amber" size="lg" onClick={() => handleStart('normal')} className="w-full">
              {t.snakeNormal}
            </Button3D>
            <Button3D variant="blue" size="lg" onClick={() => handleStart('survival')} className="w-full">
              {t.snakeSurvival}
            </Button3D>
            <Button3D variant="slate" size="md" onClick={onBack} className="w-full mt-2">
              {t.backLobby}
            </Button3D>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 animate-fadeIn">
        <GlassCard className="max-w-md w-full text-center p-8">
          <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-3 animate-bounce" />
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 font-heading mb-1">
            {t.snakeResults}
          </h2>
          <p className="text-xs font-bold text-slate-500 mb-6">
            {t.survivalTime}<span className="text-emerald-600 font-black text-lg">{survivalTime} 秒</span>
          </p>

          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 mb-6">
            <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
              {score} {t.unitPoints}
            </span>
            <p className="text-xs font-bold text-slate-500 mt-1">{t.adventureScore}</p>
          </div>

          {/* 榮譽榜破紀錄留名判定卡 */}
          <HonorSubmissionCard
            mode={`snake-${gameMode}`}
            book={qualifyingBook}
            score={score}
            time={survivalTime}
          />

          <Button3D variant="slate" size="lg" onClick={onBack} className="w-full">
            {t.backLobby}
          </Button3D>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2 flex flex-col items-center">
      {/* 頂部資訊列 */}
      <div className="w-full flex items-center justify-between mb-2">
        <Button3D variant="slate" size="sm" onClick={onBack} icon={ArrowLeft}>
          {t.backLobby}
        </Button3D>

        <div className="flex items-center gap-1.5">
          {[...Array(5)].map((_, i) => (
            <Heart
              key={i}
              className={`w-5 h-5 transition-all ${
                i < hearts ? 'text-rose-500 fill-rose-500 animate-pulse' : 'text-slate-300 dark:text-slate-700'
              }`}
            />
          ))}
        </div>

        {gameMode === 'normal' && (
          <div className="px-3.5 py-1 rounded-xl bg-amber-400 text-amber-950 font-black text-sm">
            ⏱ {timeLeft}s
          </div>
        )}

        <div className="px-3.5 py-1 rounded-xl bg-emerald-500 text-white font-black text-sm shadow-md">
          得分: {score}
        </div>
      </div>

      {/* 目標單字拼字進度條 */}
      {currentWord && (
        <div className="w-full mb-3 p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <span className="text-xl font-heading font-black text-slate-800 dark:text-slate-100">
            {currentWord.zh}
          </span>
          <div className="flex gap-2">
            {currentWord.en.split('').map((char, idx) => (
              <span
                key={idx}
                className={`w-8 h-9 rounded-xl flex items-center justify-center font-black text-lg ${
                  idx < spelledChars.length
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                }`}
              >
                {idx < spelledChars.length ? char.toUpperCase() : '_'}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* HTML5 Canvas 遊戲區 (支援觸控滑動手勢) */}
      <div className="w-full flex justify-center mb-3">
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full max-w-3xl h-auto rounded-3xl shadow-xl border-4 border-emerald-600 bg-emerald-600 aspect-[5/3] touch-none cursor-pointer"
        />
      </div>

      {/* 虛擬十字鍵 (平板 iPad、觸控大屏與手機皆可操控) */}
      <div className="flex flex-col items-center gap-1">
        <Button3D variant="slate" size="sm" onClick={() => handleDpad('UP')} className="w-16 h-10">
          <ArrowUp className="w-5 h-5" />
        </Button3D>
        <div className="flex gap-4">
          <Button3D variant="slate" size="sm" onClick={() => handleDpad('LEFT')} className="w-16 h-10">
            <DpadLeft className="w-5 h-5" />
          </Button3D>
          <Button3D variant="slate" size="sm" onClick={() => handleDpad('DOWN')} className="w-16 h-10">
            <ArrowDown className="w-5 h-5" />
          </Button3D>
          <Button3D variant="slate" size="sm" onClick={() => handleDpad('RIGHT')} className="w-16 h-10">
            <DpadRight className="w-5 h-5" />
          </Button3D>
        </div>
      </div>
    </div>
  );
};
