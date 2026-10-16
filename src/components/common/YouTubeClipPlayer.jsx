import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Volume2, Film, Sparkles, Maximize2, Minimize2, Repeat, CheckCircle } from 'lucide-react';
import { soundEngine } from '../../services/audio';

export const YouTubeClipPlayer = ({
  youtubeId = 'zMdq9jSaNLg',
  startSeconds = 0,
  endSeconds = 10,
  autoplay = true,
  onClipFinished = null,
  captionShield = false,
  isAnswered = false,
  hideControls = true,
  className = ''
}) => {
  const [playCount, setPlayCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isAutoLoop, setIsAutoLoop] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const loopTimeoutRef = useRef(null);
  const duration = Math.max(1, endSeconds - startSeconds);

  // 播放影片時自動暫停背景音樂，結束後恢復
  useEffect(() => {
    soundEngine.pauseSceneBgm();
    return () => {
      soundEngine.resumeSceneBgm();
    };
  }, []);

  // 當秒數或影片改變時，啟動進度倒數與完成回調
  useEffect(() => {
    setIsPlaying(true);
    setProgressPercent(0);
    soundEngine.pauseSceneBgm();

    if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);

    const startTime = Date.now();
    const totalMs = duration * 1000;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / totalMs) * 100);
      setProgressPercent(pct);

      if (elapsed >= totalMs) {
        clearInterval(timerRef.current);
        setIsPlaying(false);
        soundEngine.resumeSceneBgm();
        if (onClipFinished) {
          onClipFinished();
        }

        // 若開啟自動循環聆聽，間隔 1.2 秒後自動重播該句
        if (isAutoLoop && !isAnswered) {
          loopTimeoutRef.current = setTimeout(() => {
            setPlayCount(c => c + 1);
          }, 1200);
        }
      }
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    };
  }, [youtubeId, startSeconds, endSeconds, playCount, duration, isAutoLoop, isAnswered, onClipFinished]);

  const handleToggleFullscreen = () => {
    soundEngine.click();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // 核心：強制僅在 startSeconds ~ endSeconds 區間內重播，絕不跳至片頭 0:00
  const handleReplay = () => {
    soundEngine.click();
    if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    setPlayCount(c => c + 1);
  };

  const formatSec = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // YouTube 官方嵌入：controls=0 關閉 YouTube 原生進度條與原生全片重播鍵，防止學生誤跳至 0:00
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?start=${startSeconds}&end=${endSeconds}&autoplay=1&rel=0&modestbranding=1&controls=0&cc_load_policy=0&iv_load_policy=3&enablejsapi=1`;

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col rounded-2xl overflow-hidden bg-slate-950 border-2 border-amber-500/70 shadow-2xl ${className}`}
    >
      {/* 頂部播放片段狀態條 */}
      <div className="px-3 py-2 bg-gradient-to-r from-stone-900 via-amber-950/90 to-stone-900 flex items-center justify-between text-xs text-amber-200 border-b border-amber-500/30 font-mono">
        <div className="flex items-center gap-1.5 font-bold">
          <Film className="w-3.5 h-3.5 text-amber-400" />
          <span>本題片段: {formatSec(startSeconds)} ～ {formatSec(endSeconds)}</span>
          <span className="text-amber-400/80 font-normal">({duration} 秒)</span>
        </div>

        <div className="flex items-center gap-2">
          {isPlaying ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-black border border-emerald-500/40 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              播放中...
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-black border border-amber-500/40">
              片段播畢
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              soundEngine.click();
              setIsAutoLoop(prev => !prev);
            }}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-black flex items-center gap-1 transition-all cursor-pointer border ${
              isAutoLoop
                ? 'bg-amber-400 text-stone-950 border-amber-300 shadow'
                : 'bg-white/10 text-slate-300 border-white/10 hover:text-white'
            }`}
            title="開關自動循環重播本句"
          >
            <Repeat className="w-3 h-3" />
            <span>{isAutoLoop ? '🔂 自動循環：開' : '自動循環：關'}</span>
          </button>
        </div>
      </div>

      {/* 16:9 YouTube 影音容器 */}
      <div className="relative w-full aspect-video bg-black overflow-hidden group">
        <iframe
          key={`${youtubeId}_${startSeconds}_${endSeconds}_${playCount}`}
          src={embedUrl}
          title="YouTube Video Question Clip"
          className="w-full h-full border-0 pointer-events-auto"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        {/* 🎧 聽力特訓智能防作弊遮罩（遮蔽 YouTube 底部字幕區，答題完畢平滑淡出揭曉） */}
        {captionShield && (
          <div
            className={`absolute bottom-0 left-0 right-0 h-[22%] bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex items-center justify-center pointer-events-none z-10 transition-all duration-500 ease-out ${
              !isAnswered ? 'opacity-100 backdrop-blur-[2px]' : 'opacity-0 backdrop-blur-0'
            }`}
          >
            <div className="px-3.5 py-1 rounded-full bg-slate-900/90 border border-amber-400/50 text-[10px] sm:text-[11px] font-black text-amber-200 shadow-xl flex items-center gap-2 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>🎧 聽力專注特訓中 • 字幕已遮蔽 (選答後自動揭曉)</span>
            </div>
          </div>
        )}

        {/* 播畢浮層引導卡（播畢後置中呈現超大重聽按鈕） */}
        {!isPlaying && (
          <div
            onClick={handleReplay}
            className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-black/35 z-20 group"
          >
            <div className="p-4 sm:p-5 rounded-3xl bg-amber-500/95 hover:bg-amber-400 text-stone-950 shadow-2xl flex flex-col items-center gap-2 border-2 border-amber-200 transition-transform transform group-hover:scale-105 active:scale-95">
              <RotateCcw className="w-8 h-8 sm:w-10 sm:h-10 text-stone-950 animate-spin-slow" />
              <span className="font-black text-xs sm:text-sm font-heading">
                🔁 點擊重聽這句話 ({formatSec(startSeconds)} ~ {formatSec(endSeconds)})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 底部時間進度動態光軌 */}
      <div className="w-full h-1.5 bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-100 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 底部專屬超大控制列（限制重播範圍，絕不回片頭） */}
      <div className="px-3 py-2 bg-slate-900 flex items-center justify-between gap-2 border-t border-white/10">
        <button
          type="button"
          onClick={handleReplay}
          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-200"
          title="僅重新播放這句對話，不回到影片開頭"
        >
          <RotateCcw className="w-4 h-4 text-stone-900" />
          <span>🔁 重播本句對話 ({formatSec(startSeconds)} ～ {formatSec(endSeconds)})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.click();
            setIsAutoLoop(prev => !prev);
          }}
          className={`py-2 px-3 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer border ${
            isAutoLoop
              ? 'bg-amber-500/30 text-amber-300 border-amber-400/60 ring-2 ring-amber-400/30'
              : 'bg-stone-800 text-slate-400 border-white/10 hover:text-white'
          }`}
          title="開啟後會反覆循環播放這句，直到你選出答案"
        >
          <Repeat className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">循環播放</span>
        </button>
      </div>
    </div>
  );
};
