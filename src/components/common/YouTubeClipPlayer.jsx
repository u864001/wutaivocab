import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Volume2, Film, Sparkles, Maximize2, Minimize2 } from 'lucide-react';
import { soundEngine } from '../../services/audio';

export const YouTubeClipPlayer = ({
  youtubeId = 'zMdq9jSaNLg',
  startSeconds = 0,
  endSeconds = 10,
  autoplay = true,
  onClipFinished = null,
  captionShield = false,
  isAnswered = false,
  hideControls = false,
  className = ''
}) => {
  const [playCount, setPlayCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
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
      }
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [youtubeId, startSeconds, endSeconds, playCount, duration, onClipFinished]);

  const handleToggleFullscreen = () => {
    soundEngine.click();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleReplay = () => {
    soundEngine.click();
    setPlayCount(c => c + 1);
  };

  const formatSec = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // YouTube 官方防追蹤無干擾嵌入網址 (含精確 start 與 end，強制預設不載入 CC 字幕)
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?start=${startSeconds}&end=${endSeconds}&autoplay=1&rel=0&modestbranding=1&controls=${hideControls ? 0 : 1}&cc_load_policy=0&iv_load_policy=3&enablejsapi=1`;

  return (
    <div className={`relative flex flex-col rounded-2xl overflow-hidden bg-slate-950 border-2 border-amber-500/60 shadow-xl ${className}`}>
      {/* 頂部播放片段狀態條 */}
      <div className="px-3 py-1.5 bg-gradient-to-r from-stone-900 via-amber-950/80 to-stone-900 flex items-center justify-between text-xs text-amber-200 border-b border-amber-500/30 font-mono">
        <div className="flex items-center gap-1.5 font-bold">
          <Film className="w-3.5 h-3.5 text-amber-400" />
          <span>片段區間: {formatSec(startSeconds)} ～ {formatSec(endSeconds)}</span>
          <span className="text-slate-400 font-normal">({duration} 秒)</span>
        </div>

        <div className="flex items-center gap-2">
          {isPlaying ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/40 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              播放中
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/40">
              片段播畢，請選出正確句子！
            </span>
          )}

          <button
            onClick={handleReplay}
            className="px-2.5 py-0.5 rounded-lg bg-amber-500/30 hover:bg-amber-500/50 text-amber-200 font-black text-[11px] flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
            title="重新播放這段影片"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重播片段</span>
          </button>
        </div>
      </div>

      {/* 16:9 YouTube 影音容器 */}
      <div className="relative w-full aspect-video bg-black overflow-hidden">
        <iframe
          key={`${youtubeId}_${startSeconds}_${endSeconds}_${playCount}`}
          src={embedUrl}
          title="YouTube Video Question Clip"
          className="w-full h-full border-0 pointer-events-auto"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        {/* 🎧 聽力特訓遮罩（遮蔽 YouTube 底部字幕區，答題完畢自動揭曉） */}
        {captionShield && !isAnswered && (
          <div className="absolute bottom-0 left-0 right-0 h-[22%] bg-gradient-to-t from-black via-black/95 to-transparent flex items-center justify-center pointer-events-none z-10 transition-opacity duration-300">
            <span className="px-3 py-1 rounded-full bg-purple-950/85 border border-purple-400/50 text-[10px] sm:text-[11px] font-black text-purple-200 shadow-lg flex items-center gap-1.5 backdrop-blur-md">
              <span>🎧</span>
              <span>聽力測驗中 • 字幕已遮蔽 (選答後揭曉)</span>
            </span>
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
    </div>
  );
};
