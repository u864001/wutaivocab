import React, { useState, useEffect, useRef } from 'react';
import { X, Film, Sparkles, Popcorn, Play, ChevronDown, Award, Maximize2, Minimize2 } from 'lucide-react';
import { UNIT_VIDEO_LIBRARY } from '../../data/unitVideoQuestionData';
import { soundEngine } from '../../services/audio';
import { useStudent } from '../../context/StudentContext';

export const CinemaTheaterModal = ({ onClose }) => {
  const { addQuestPoints, addCoins } = useStudent();
  const [selectedMovieId, setSelectedMovieId] = useState(UNIT_VIDEO_LIBRARY[0].id);
  const theaterRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const [claimedReward, setClaimedReward] = useState(() => {
    try {
      return localStorage.getItem(`wutai_cinema_popcorn_${todayStr}`) === 'true';
    } catch (e) {
      return false;
    }
  });

  // 進入放映廳時自動暫停背景音樂，離開時自動恢復
  useEffect(() => {
    soundEngine.pauseSceneBgm();
    return () => {
      soundEngine.resumeSceneBgm();
    };
  }, []);

  const activeMovie = UNIT_VIDEO_LIBRARY.find(m => m.id === selectedMovieId) || UNIT_VIDEO_LIBRARY[0];

  const handleClaimPopcorn = async () => {
    if (claimedReward) return;
    soundEngine.win();
    setClaimedReward(true);
    try {
      localStorage.setItem(`wutai_cinema_popcorn_${todayStr}`, 'true');
    } catch (e) {}
    if (addQuestPoints) await addQuestPoints(2);
    if (addCoins) await addCoins(1);
  };

  const handleToggleFullscreen = () => {
    soundEngine.click();
    if (!theaterRef.current) return;
    if (!document.fullscreenElement) {
      theaterRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn select-none">
      {/* 影廳主體：天鵝絨紅色電影院風格 */}
      <div className="relative w-full max-w-5xl bg-gradient-to-b from-stone-950 via-rose-950/80 to-stone-950 border-4 border-amber-600/70 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white max-h-[95vh]">
        
        {/* 頂部影廳導覽 HUD */}
        <div className="px-4 py-3 bg-gradient-to-r from-red-950 via-stone-900 to-red-950 border-b-2 border-amber-500/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 text-xl border border-amber-500/30">
              🐗
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black font-heading text-amber-200">
                  山豬影城 • 放映一廳 (Boar Cinema Hall 1)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-[10px] font-black text-white">
                  全片放映
                </span>
              </div>
              <p className="text-xs text-amber-300/70 font-bold hidden sm:block">
                野豬售票員為您放映！零流量 YouTube 官方串流，完整觀賞英語單元微電影
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 爆米花獎勵 */}
            <button
              onClick={handleClaimPopcorn}
              disabled={claimedReward}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                claimedReward
                  ? 'bg-amber-900/40 text-amber-400/60 border border-amber-600/30'
                  : 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-amber-950 font-black shadow-md animate-pulse border border-yellow-300'
              }`}
              title="觀影享用爆米花獲得小鎮探索積分"
            >
              <span>🍿</span>
              <span>{claimedReward ? '已享用爆米花 (+2分)' : '吃爆米花領積分 (+2)'}</span>
            </button>

            <button
              onClick={() => {
                soundEngine.click();
                onClose();
              }}
              className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              title="離開電影院"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 劇目選單欄 */}
        <div className="px-4 py-2 bg-stone-900/90 border-b border-amber-900/40 flex items-center justify-between gap-3 text-xs overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold shrink-0">
            <Film className="w-3.5 h-3.5" />
            <span>上映劇目切換：</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-0.5">
            {UNIT_VIDEO_LIBRARY.map((movie) => (
              <button
                key={movie.id}
                onClick={() => {
                  soundEngine.click();
                  setSelectedMovieId(movie.id);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedMovieId === movie.id
                    ? 'bg-amber-500 text-amber-950 font-black shadow-md ring-1 ring-amber-300'
                    : 'bg-stone-800 text-slate-300 hover:bg-stone-700'
                }`}
              >
                {movie.title}
              </button>
            ))}
          </div>
        </div>

        {/* 影廳主螢幕 (16:9 YouTube 完整連續放映) */}
        <div className="flex-1 p-3 sm:p-5 flex flex-col items-center justify-center bg-black/80 overflow-y-auto">
          <div
            ref={theaterRef}
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-2xl bg-black group"
          >
            <iframe
              key={activeMovie.youtubeId}
              src={`https://www.youtube-nocookie.com/embed/${activeMovie.youtubeId}?autoplay=1&rel=0&modestbranding=1&controls=1`}
              title={activeMovie.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />

            {/* 懸浮全螢幕切換按鈕 */}
            <button
              onClick={handleToggleFullscreen}
              className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 text-amber-300 hover:text-white border border-amber-400/50 text-xs font-black flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer backdrop-blur-md"
              title="切換全螢幕觀看"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span>{isFullscreen ? '離開全螢幕' : '⛶ 全螢幕觀賞'}</span>
            </button>
          </div>

          {/* 影廳座位與售票員溫馨提示 */}
          <div className="w-full max-w-4xl mt-3 flex items-center justify-between text-xs text-stone-300 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">🐗</span>
              <span>
                <strong className="text-amber-300 font-heading">野豬售票員：</strong>
                「這部片涵蓋了完整課文的情境對話！看完後可以去
                <strong className="text-rose-400">【視聽語言教室】</strong>
                挑戰分段選答句喔！」
              </span>
            </div>
            <span className="font-mono text-amber-400 hidden sm:inline">
              片長約 {activeMovie.totalDuration} 秒
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
