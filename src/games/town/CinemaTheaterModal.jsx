import React, { useState, useEffect, useRef } from 'react';
import { X, Film, Sparkles, Popcorn, Play, ChevronRight, Award, Maximize2, Minimize2, Clock, Calendar, ArrowLeft, Ticket } from 'lucide-react';
import { UNIT_VIDEO_LIBRARY, CINEMA_HALL_SCHEDULES } from '../../data/unitVideoQuestionData';
import { soundEngine } from '../../services/audio';
import { useStudent } from '../../context/StudentContext';

export const CinemaTheaterModal = ({ onClose, initialMovieId = null, initialHall = 'ALL' }) => {
  const { addQuestPoints, addCoins } = useStudent();
  
  // 檢視模式：'schedule' (放映時刻表看板) | 'player' (大螢幕放映中)
  const [viewMode, setViewMode] = useState(initialMovieId ? 'player' : 'schedule');
  const [selectedMovieId, setSelectedMovieId] = useState(initialMovieId || UNIT_VIDEO_LIBRARY[0].id);
  const [hallFilter, setHallFilter] = useState(initialHall); // 'ALL' | 'A' | 'B'
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

  // 進入放映廳時自動暫停背景音樂，離開時自動恢復；並監聽 iframe 回上頁訊號
  useEffect(() => {
    soundEngine.pauseSceneBgm();

    const handleMessage = (event) => {
      if (event.data?.type === 'CLOSE_CINEMA') {
        soundEngine.click();
        if (onClose) onClose();
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      soundEngine.resumeSceneBgm();
    };
  }, [onClose]);

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

  const handleSelectMovieAndPlay = (movieId) => {
    soundEngine.win();
    setSelectedMovieId(movieId);
    setViewMode('player');
  };

  const displayedHalls = hallFilter === 'ALL'
    ? CINEMA_HALL_SCHEDULES
    : CINEMA_HALL_SCHEDULES.filter(h => h.hallId === hallFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/90 backdrop-blur-md animate-fadeIn select-none">
      {/* 影廳主體：天鵝絨紅色電影院風格 */}
      <div className="relative w-full max-w-5xl bg-gradient-to-b from-stone-950 via-rose-950/85 to-stone-950 border-4 border-amber-600/70 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white max-h-[95vh]">
        
        {/* ── 頂部 HUD (時刻表看板 / 播放廳通用) ── */}
        <div className="px-4 py-3 bg-gradient-to-r from-red-950 via-stone-900 to-red-950 border-b-2 border-amber-500/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 text-xl border border-amber-500/30">
              🐗
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black font-heading text-amber-200">
                  {viewMode === 'schedule' ? '山豬影城 • 今日放映時刻表' : `山豬影城 • ${activeMovie.hallName || '放映廳'}`}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  viewMode === 'schedule' ? 'bg-amber-600 text-stone-950' : 'bg-rose-600 text-white animate-pulse'
                }`}>
                  {viewMode === 'schedule' ? '場次時刻表' : '放映中'}
                </span>
              </div>
              <p className="text-xs text-amber-300/70 font-bold hidden sm:block">
                {viewMode === 'schedule'
                  ? '野豬售票員為您剪票！點選下方放映廳與時段，即可取票入場觀看全片'
                  : `正在放映：${activeMovie.title}（片長約 ${activeMovie.totalDuration} 秒）`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 放映中隨時切換回時刻表按鈕 */}
            {viewMode === 'player' && (
              <button
                onClick={() => {
                  soundEngine.click();
                  setViewMode('schedule');
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500/25 hover:bg-amber-500/40 text-amber-200 border border-amber-400/50 text-xs font-black flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                title="返回時刻表挑選其他電影"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>換看其他場次</span>
              </button>
            )}

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
              <span>{claimedReward ? '已領爆米花 (+2)' : '吃爆米花領積分 (+2)'}</span>
            </button>

            {/* 關閉影城 */}
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

        {/* ── 模式一：今日放映時刻表看板 (Schedule Board) ── */}
        {viewMode === 'schedule' ? (
          <div className="flex-1 p-3 sm:p-5 flex flex-col gap-3.5 overflow-y-auto bg-stone-950/90 scrollbar-thin">
            
            {/* 野豬售票員親切提示與廳別篩選列 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-2xl bg-stone-900/80 border border-amber-500/30 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs text-amber-200">
                <span className="text-xl">🐗</span>
                <span>
                  <strong className="text-amber-300 font-heading">野豬售票員：</strong>
                  「歡迎光臨山豬影城！點擊想看的場次票根，即可剪票入場觀看全片喔！」
                </span>
              </div>

              {/* 廳別分頁按鈕 */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    soundEngine.click();
                    setHallFilter('ALL');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    hallFilter === 'ALL'
                      ? 'bg-amber-500 text-stone-950 shadow-md ring-1 ring-amber-300'
                      : 'bg-stone-800 text-slate-300 hover:bg-stone-700'
                  }`}
                >
                  全部場次
                </button>
                <button
                  onClick={() => {
                    soundEngine.click();
                    setHallFilter('A');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                    hallFilter === 'A'
                      ? 'bg-rose-600 text-white shadow-md ring-1 ring-rose-300'
                      : 'bg-stone-800 text-slate-300 hover:bg-stone-700'
                  }`}
                >
                  <span>🏛️</span>
                  <span>A 廳 (微電影)</span>
                </button>
                <button
                  onClick={() => {
                    soundEngine.click();
                    setHallFilter('B');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                    hallFilter === 'B'
                      ? 'bg-indigo-600 text-white shadow-md ring-1 ring-indigo-300'
                      : 'bg-stone-800 text-slate-300 hover:bg-stone-700'
                  }`}
                >
                  <span>🎪</span>
                  <span>B 廳 (生活美語)</span>
                </button>
              </div>
            </div>

            {/* 各影廳時刻表區塊 */}
            {displayedHalls.map((hall) => {
              const hallMovies = UNIT_VIDEO_LIBRARY.filter(m => hall.movieIds.includes(m.id));

              return (
                <div
                  key={hall.hallId}
                  className={`rounded-2xl border-2 ${hall.accentBorder} bg-gradient-to-br ${hall.themeColor} p-3.5 sm:p-4.5 shadow-xl flex flex-col gap-3`}
                >
                  {/* 影廳標題列 */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/40 font-mono">
                        {hall.tag}
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-white font-heading">
                        {hall.hallName}
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-300 font-bold hidden sm:inline">
                      {hall.hallSubtitle}
                    </span>
                  </div>

                  {/* 票根卡片網格 (一目瞭然，不需往右滑動) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* 上映中片單 */}
                    {hallMovies.map((movie) => (
                      <div
                        key={movie.id}
                        className="rounded-2xl bg-black/60 hover:bg-black/80 border border-white/15 hover:border-amber-400/80 p-3 flex flex-col sm:flex-row gap-3 shadow-lg transition-all group"
                      >
                        {/* 左：16:9 封面縮圖 */}
                        <div className="relative w-full sm:w-40 aspect-video rounded-xl overflow-hidden shrink-0 bg-stone-900 border border-white/10">
                          <img
                            src={movie.thumbnail || '/assets/langlab/halloween/full_frames/S01_A_arrival.png'}
                            alt={movie.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = '/assets/langlab/halloween/full_frames/S01_A_arrival.png';
                            }}
                          />
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/80 text-[10px] font-mono font-bold text-amber-300 border border-white/10">
                            {movie.totalDuration}s
                          </span>
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-rose-600/90 text-[9px] font-black text-white">
                            {movie.badge}
                          </span>
                        </div>

                        {/* 右：場次資訊與剪票按鈕 */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-black font-mono">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{movie.showtimeLabel || `場次 ${movie.showtime}`}</span>
                            </div>
                            <h5 className="text-xs sm:text-sm font-black text-white mt-1 leading-snug line-clamp-2">
                              {movie.title}
                            </h5>
                            <p className="text-[11px] text-slate-300 font-bold mt-1 line-clamp-1">
                              {movie.description}
                            </p>
                          </div>

                          <div className="pt-2">
                            <button
                              onClick={() => handleSelectMovieAndPlay(movie.id)}
                              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-500 text-stone-950 font-black text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-yellow-300"
                            >
                              <Ticket className="w-4 h-4 text-stone-900" />
                              <span>🎟️ 剪票入場 (Watch Now)</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* 籌備中空白場次 (Coming Soon) */}
                    {hall.comingSoon?.map((cs) => (
                      <div
                        key={cs.id}
                        className="rounded-2xl bg-black/30 border border-dashed border-white/20 p-3 flex flex-col justify-between gap-2 text-slate-400 select-none opacity-80"
                      >
                        <div>
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{cs.showtimeLabel}</span>
                            <span className="px-1.5 py-0.2 rounded bg-white/10 text-[9px] font-mono text-slate-300 ml-auto">
                              {cs.badge}
                            </span>
                          </div>
                          <h5 className="text-xs sm:text-sm font-black text-slate-300 mt-1 leading-snug">
                            {cs.title}
                          </h5>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {cs.description}
                          </p>
                        </div>

                        <div className="pt-2">
                          <button
                            disabled
                            className="w-full py-1.5 px-3 rounded-xl bg-white/5 border border-white/10 text-slate-500 font-black text-xs flex items-center justify-center gap-1 cursor-not-allowed"
                          >
                            <span>🔒 籌備中 (Coming Soon)</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

          </div>
        ) : (
          /* ── 模式二：影廳主螢幕全片播放 (Theater Player Screen) ── */
          <div className="flex-1 p-3 sm:p-5 flex flex-col items-center justify-center bg-black/80 overflow-y-auto">
            <div
              ref={theaterRef}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-2xl bg-black group"
            >
              {activeMovie.isLocalPlayer ? (
                <iframe
                  key={activeMovie.id}
                  src={activeMovie.localUrl}
                  title={activeMovie.title}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              ) : (
                <iframe
                  key={activeMovie.youtubeId}
                  src={`https://www.youtube-nocookie.com/embed/${activeMovie.youtubeId}?autoplay=1&rel=0&modestbranding=1&controls=1`}
                  title={activeMovie.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              )}

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
        )}

      </div>
    </div>
  );
};
