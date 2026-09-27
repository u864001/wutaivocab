import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useI18n } from '../../context/I18nContext';
import { soundEngine, speakEnglish } from '../../services/audio';
import { supabase, getDeviceId, recordBattleWin } from '../../services/supabase';
import { generateSmartOptions } from '../../services/distractorHelper';
import confetti from 'canvas-confetti';
import {
  ArrowLeft, Swords, Users, Shield, Heart, Zap,
  Trophy, Play, RefreshCw, QrCode, Lock, CheckCircle2, AlertCircle
} from 'lucide-react';

// ── 全校固定三大限定擂台 (嚴格限制全校同時最多 3 場對戰，徹底防護連線數與廣播配額) ──
const FIXED_ARENAS = [
  {
    id: 'arena-1',
    code: '1001',
    name: '🔴 烈焰擂台',
    color: 'rose',
    bgGradient: 'from-rose-500/20 via-orange-500/20 to-rose-600/20',
    border: 'border-rose-400 dark:border-rose-700'
  },
  {
    id: 'arena-2',
    code: '1002',
    name: '🟢 翡翠擂台',
    color: 'emerald',
    bgGradient: 'from-emerald-500/20 via-teal-500/20 to-emerald-600/20',
    border: 'border-emerald-400 dark:border-emerald-700'
  },
  {
    id: 'arena-3',
    code: '1003',
    name: '🔵 星空擂台',
    color: 'blue',
    bgGradient: 'from-blue-500/20 via-indigo-500/20 to-blue-600/20',
    border: 'border-blue-400 dark:border-blue-700'
  }
];

export const BattleGame = ({
  settings,
  words = [],
  onBack
}) => {
  const { t } = useI18n();
  const [view, setView] = useState('menu'); // 'menu' | 'lobby' | 'playing' | 'result'
  const [selectedArena, setSelectedArena] = useState(FIXED_ARENAS[0]);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('wutai_player_name') || '');
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // 三大擂台全域狀態監控 ({ 'arena-1': { count, isBattling, hostName, playerNames } })
  const [arenaStates, setArenaStates] = useState({
    'arena-1': { count: 0, isBattling: false, hostName: '', playerNames: [] },
    'arena-2': { count: 0, isBattling: false, hostName: '', playerNames: [] },
    'arena-3': { count: 0, isBattling: false, hostName: '', playerNames: [] }
  });
  const [isConnecting, setIsConnecting] = useState(null); // 當前正在連線檢查的 arena.id
  const [isProbing, setIsProbing] = useState(false);
  const [probeCounter, setProbeCounter] = useState(0);

  // 戰鬥狀態
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [myHealth, setMyHealth] = useState(100);
  const [isDead, setIsDead] = useState(false);
  const [winnerName, setWinnerName] = useState('');

  const channelRef = useRef(null);
  const myDeviceIdRef = useRef(getDeviceId());
  const battleUnitsRef = useRef(settings?.selectedUnits || []);
  const lastAttackTimeRef = useRef(0);
  const hostDisconnectTimerRef = useRef(null);

  // ── 大廳零長連線架構：1-Shot 快照探測 (取得狀態 1.5 秒後立即斷開銷毀，絕不長期佔用連線) ──
  useEffect(() => {
    if (view !== 'menu') return;

    let isCancelled = false;
    setIsProbing(true);

    // 建立 3 擂台輕量探測頻道 (不調用 track，不計入玩家名單)
    const probeChannels = FIXED_ARENAS.map(arena => {
      const ch = supabase.channel(`battle-${arena.id}`);
      ch.on('presence', { event: 'sync' }, () => {
        if (isCancelled) return;
        const state = ch.presenceState();
        const list = Object.values(state).flat();
        const host = list.find(p => p.isHost);
        const isBattling = list.some(p => p.status === 'battling');

        setArenaStates(prev => ({
          ...prev,
          [arena.id]: {
            count: list.length,
            isBattling,
            hostName: host ? host.name : '',
            playerNames: list.map(p => p.name)
          }
        }));
      });
      ch.subscribe();
      return ch;
    });

    // 1.5 秒後準時銷毀所有探測頻道，大廳保持 0 條持續 WebSocket 連線！
    const timer = setTimeout(() => {
      if (!isCancelled) {
        probeChannels.forEach(ch => supabase.removeChannel(ch));
        setIsProbing(false);
      }
    }, 1500);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      probeChannels.forEach(ch => supabase.removeChannel(ch));
      setIsProbing(false);
    };
  }, [view, probeCounter]);

  // 退出對戰清理
  const handleLeaveRoom = () => {
    if (hostDisconnectTimerRef.current) {
      clearTimeout(hostDisconnectTimerRef.current);
      hostDisconnectTimerRef.current = null;
    }

    if (channelRef.current) {
      if (isHost) {
        try {
          channelRef.current.send({
            type: 'broadcast',
            event: 'host-left',
            payload: {}
          });
        } catch (e) {}
      }
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    setIsHost(false);
    setIsConnecting(null);
    setPlayers([]);
    setView('menu');
  };

  // 開立指定擂台 (房主)
  const handleHostArena = (arena) => {
    if (!playerName.trim()) {
      setErrorMsg(t.enterNicknameError);
      return;
    }
    if (!settings.selectedUnits || settings.selectedUnits.length === 0) {
      setErrorMsg(t.selectScopeError);
      return;
    }

    // 檢查該擂台是否已被佔用
    const cur = arenaStates[arena.id];
    if (cur && (cur.count > 0 || cur.isBattling)) {
      setErrorMsg(`【${arena.name}】剛已被搶先開立或正在對戰中，請選擇其他空房！`);
      return;
    }

    localStorage.setItem('wutai_player_name', playerName.trim());
    setSelectedArena(arena);
    setIsHost(true);
    battleUnitsRef.current = settings.selectedUnits;
    connectToArenaChannel(arena, true);
  };

  // 加入指定擂台 (成員)
  const handleJoinArena = (arena) => {
    if (!playerName.trim()) {
      setErrorMsg(t.enterNicknameError);
      return;
    }

    // 檢查該擂台是否正在對戰中或已滿 4 人
    const cur = arenaStates[arena.id];
    if (cur && cur.isBattling) {
      setErrorMsg(`【${arena.name}】正在激烈激戰中，已被鎖定！請選擇其他擂台。`);
      return;
    }
    if (cur && cur.count >= 4) {
      setErrorMsg(`【${arena.name}】已滿員 (4/4 人)！請選擇其他擂台。`);
      return;
    }

    localStorage.setItem('wutai_player_name', playerName.trim());
    setSelectedArena(arena);
    setIsHost(false);
    connectToArenaChannel(arena, false);
  };

  // 連接至特定擂台頻道 (按需即時連線，含滿員防爆與雙房主確定性仲裁)
  const connectToArenaChannel = (arena, hostFlag) => {
    setErrorMsg('');
    setIsConnecting(arena.id);

    const channelName = `battle-${arena.id}`;
    const channel = supabase.channel(channelName, {
      config: { presence: { key: myDeviceIdRef.current } }
    });

    const myJoinTimestamp = Date.now();

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const activeList = Object.values(state).flat();
        setPlayers(activeList);

        // 1. 激戰中防插隊判定
        const isBattlingNow = activeList.some(p => p.status === 'battling' && p.deviceId !== myDeviceIdRef.current);
        if (isBattlingNow) {
          setErrorMsg(`【${arena.name}】正在激烈決戰中 (已鎖定)，請選擇其他擂台或稍後再戰！`);
          handleLeaveRoom();
          return;
        }

        // 2. 超員即時退出判定 (全校每房最多 4 人)
        if (activeList.length > 4) {
          setErrorMsg(`【${arena.name}】已滿員 (4/4 人)！請選擇其他擂台或先挑戰單人模式。`);
          handleLeaveRoom();
          return;
        }

        // 3. 雙房主競態仲裁 (Deterministic Tie-Breaker)
        const hosts = activeList.filter(p => p.isHost);
        if (hosts.length > 1) {
          // 依 joinedAt 時間戳排序；若毫秒完全相同，則以 deviceId 字典順序仲裁
          hosts.sort((a, b) => (a.joinedAt || 0) - (b.joinedAt || 0) || a.deviceId.localeCompare(b.deviceId));
          const trueHost = hosts[0];
          if (myDeviceIdRef.current !== trueHost.deviceId) {
            // 本人非最早開立者，自動降級為挑戰者成員，避免房間分裂
            setIsHost(false);
            channel.track({
              deviceId: myDeviceIdRef.current,
              name: playerName.trim(),
              isHost: false,
              status: 'waiting',
              isDead: false,
              joinedAt: myJoinTimestamp
            });
            setErrorMsg(`同學 ${trueHost.name} 搶先開立，已為您自動轉為加入挑戰！`);
          }
        }

        // 4. 房主斷線寬限判定 (寬限 3 秒，防止短暫網路抖動誤退)
        if (!hostFlag) {
          const hasHost = activeList.some(p => p.isHost);
          if (!hasHost && activeList.length > 0) {
            if (!hostDisconnectTimerRef.current) {
              hostDisconnectTimerRef.current = setTimeout(() => {
                setErrorMsg('房主已離開房間，對戰結束。');
                handleLeaveRoom();
              }, 3000);
            }
          } else if (hasHost && hostDisconnectTimerRef.current) {
            clearTimeout(hostDisconnectTimerRef.current);
            hostDisconnectTimerRef.current = null;
          }
        }
      })
      .on('broadcast', { event: 'host-left' }, () => {
        if (!hostFlag) {
          setErrorMsg('房主已退出房間，對戰結束。');
          handleLeaveRoom();
        }
      })
      .on('broadcast', { event: 'game-start' }, ({ payload }) => {
        if (payload?.selectedUnits && payload.selectedUnits.length > 0) {
          battleUnitsRef.current = payload.selectedUnits;
        }
        startGame();
      })
      .on('broadcast', { event: 'player-attack' }, ({ payload }) => {
        if (payload.targetId === myDeviceIdRef.current) {
          soundEngine.wrong();
          setMyHealth(h => {
            const next = Math.max(0, h - 25);
            if (next <= 0) handlePlayerDead();
            return next;
          });
        }
      })
      .on('broadcast', { event: 'player-dead' }, ({ payload }) => {
        setPlayers(prev =>
          prev.map(p => (p.deviceId === payload.deviceId ? { ...p, isDead: true } : p))
        );
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            deviceId: myDeviceIdRef.current,
            name: playerName.trim(),
            isHost: hostFlag,
            status: 'waiting',
            isDead: false,
            joinedAt: myJoinTimestamp
          });
          setIsConnecting(null);
          setView('lobby');
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setIsConnecting(null);
          setErrorMsg('連線異常，請檢查網路或稍後重試。');
        }
      });

    channelRef.current = channel;
  };

  // 房主啟動遊戲並廣播 (鎖定房間)
  const handleStartGameBroadcast = async () => {
    if (channelRef.current) {
      // 標註為對戰中，鎖定該擂台不接受新成員
      await channelRef.current.track({
        deviceId: myDeviceIdRef.current,
        name: playerName.trim(),
        isHost: true,
        status: 'battling',
        isDead: false
      });

      channelRef.current.send({
        type: 'broadcast',
        event: 'game-start',
        payload: { selectedUnits: battleUnitsRef.current }
      });
      startGame();
    }
  };

  const startGame = () => {
    setView('playing');
    setMyHealth(100);
    setIsDead(false);
    nextQuestion();
  };

  const nextQuestion = () => {
    const units = battleUnitsRef.current;
    let pool = words.filter(w => units.includes(`${w.book}-${w.lesson}`));
    if (pool.length === 0) pool = words;

    const target = pool[Math.floor(Math.random() * pool.length)];
    setCurrentQuestion(target);

    // 依據誘答模式產生選項 (預設為同選定範圍 strict)
    const opts = generateSmartOptions(
      target,
      pool,
      words,
      'en',
      settings.distractorMode || 'strict'
    );
    setOptions(opts);
  };

  const handleAnswer = (opt) => {
    if (!currentQuestion || isDead) return;

    if (opt.isCorrect) {
      soundEngine.correct();

      // 防刷廣播節流保護：發送前立即更新 performance.now() 時間戳，杜絕連續誤按
      const now = performance.now();
      const otherPlayers = players.filter(p => p.deviceId !== myDeviceIdRef.current && !p.isDead);
      if (otherPlayers.length > 0 && channelRef.current && now - lastAttackTimeRef.current > 1200) {
        lastAttackTimeRef.current = now; // 發送前鎖定
        const target = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
        channelRef.current.send({
          type: 'broadcast',
          event: 'player-attack',
          payload: { targetId: target.deviceId, attackerName: playerName }
        });
      }

      nextQuestion();
    } else {
      soundEngine.wrong();
      setMyHealth(h => {
        const next = Math.max(0, h - 15);
        if (next <= 0) handlePlayerDead();
        return next;
      });
    }
  };

  const handlePlayerDead = () => {
    setIsDead(true);
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'player-dead',
        payload: { deviceId: myDeviceIdRef.current }
      });
    }
  };

  // 監聽是否只剩最後一名生還者
  useEffect(() => {
    if (view === 'playing') {
      const alivePlayers = players.filter(p => !p.isDead);
      if (alivePlayers.length === 1 && players.length > 1) {
        const winner = alivePlayers[0];
        setWinnerName(winner.name);
        setView('result');
        soundEngine.win();
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });

        if (winner.deviceId === myDeviceIdRef.current) {
          const book = battleUnitsRef.current[0]?.split('-')[0] || '1';
          recordBattleWin({ book, name: playerName.trim() });
        }
      }
    }
  }, [players, view]);

  // 離線清理 (iPad 關閉分頁、背景睡眠防幽靈連線)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  // ── 畫面 1：全校三大限定擂台大廳 (Arena Selection) ──
  if (view === 'menu') {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-4 animate-fadeIn pb-12">
        {/* 頂部說明卡 */}
        <div className="flex items-center justify-between mb-4">
          <Button3D variant="slate" size="sm" onClick={onBack} icon={ArrowLeft}>
            {t.backLobby}
          </Button3D>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setProbeCounter(c => c + 1)}
              disabled={isProbing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95"
              title="重新檢查三大擂台即時狀態"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProbing ? 'animate-spin text-rose-500' : ''}`} />
              <span>{isProbing ? '探測中...' : '探測擂台'}</span>
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-black">
              <Swords className="w-4 h-4" />
              全校限定三大即時對戰擂台
            </div>
          </div>
        </div>

        <GlassCard className="p-6 mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 font-heading mb-2">
            ⚔️ 星際連線死鬥競技場
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-4">
            全校最多同時開放 3 組擂台（每組 2~4 人），題目自動同步房主所選範圍！請選擇有空位的擂台開立或加入。
          </p>

          {/* 學生暱稱輸入列 */}
          <div className="max-w-md mx-auto relative mb-2">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="請輸入你的戰鬥暱稱（例：501小明）"
              className="w-full p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800 text-center font-black text-slate-800 dark:text-slate-100 outline-none focus:border-rose-500 pr-20 shadow-inner"
            />
            {playerName && (
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('wutai_player_name');
                  setPlayerName('');
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-xs font-black bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-300"
                title="切換其他同學"
              >
                換人
              </button>
            )}
          </div>

          {errorMsg && (
            <div className="max-w-md mx-auto mt-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-black text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </GlassCard>

        {/* ── 三大固定擂台狀態卡 ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FIXED_ARENAS.map((arena) => {
            const state = arenaStates[arena.id] || { count: 0, isBattling: false, hostName: '', playerNames: [] };
            const isEmpty = state.count === 0 && !state.isBattling;
            const isWaiting = state.count > 0 && state.count < 4 && !state.isBattling;
            const isFullOrBattling = state.isBattling || state.count >= 4;

            return (
              <GlassCard
                key={arena.id}
                className={`p-5 flex flex-col justify-between border-2 transition-all relative overflow-hidden ${arena.border} ${
                  isFullOrBattling ? 'opacity-85' : 'hover:scale-[1.02]'
                }`}
              >
                {/* 頂部標籤與房號 */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-heading font-black text-base text-slate-800 dark:text-slate-100">
                    {arena.name}
                  </span>
                  <span className="font-mono text-xs font-black px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300">
                    PIN: {arena.code}
                  </span>
                </div>

                {/* 狀態卡內容 */}
                <div className="my-3 min-h-[90px] flex flex-col justify-center">
                  {isEmpty && (
                    <div className="text-center">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-black mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 空房可開立
                      </div>
                      <p className="text-xs font-bold text-slate-400">目前尚無同學使用，點下方開立擂台</p>
                    </div>
                  )}

                  {isWaiting && (
                    <div className="text-center">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-black mb-1">
                        <Users className="w-3.5 h-3.5" /> 等待加入中 ({state.count}/4 人)
                      </div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                        房主：<strong className="text-amber-600 dark:text-amber-400">{state.hostName}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        成員：{state.playerNames.join(', ')}
                      </p>
                    </div>
                  )}

                  {isFullOrBattling && (
                    <div className="text-center">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs font-black mb-1">
                        <Lock className="w-3.5 h-3.5" /> 激戰進行中 (已鎖定)
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 mt-1">
                        對戰中：{state.playerNames.slice(0, 4).join('、')}
                      </p>
                    </div>
                  )}
                </div>

                {/* 底部操作按鈕 */}
                <div className="mt-3">
                  {isConnecting === arena.id ? (
                    <Button3D variant="slate" size="md" disabled className="w-full">
                      <RefreshCw className="w-4 h-4 animate-spin inline mr-1" />
                      連線確認中...
                    </Button3D>
                  ) : isEmpty ? (
                    <Button3D
                      variant={arena.color === 'rose' ? 'rose' : arena.color === 'emerald' ? 'emerald' : 'blue'}
                      size="md"
                      onClick={() => handleHostArena(arena)}
                      className="w-full"
                    >
                      開立此擂台
                    </Button3D>
                  ) : isWaiting ? (
                    <Button3D
                      variant="amber"
                      size="md"
                      onClick={() => handleJoinArena(arena)}
                      className="w-full"
                    >
                      立即加入 ({state.count}/4)
                    </Button3D>
                  ) : (
                    <Button3D
                      variant="slate"
                      size="md"
                      disabled
                      className="w-full cursor-not-allowed opacity-60"
                    >
                      對戰中請稍候
                    </Button3D>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* 滿員友善分流引導 */}
        {Object.values(arenaStates).every(s => s.isBattling || s.count >= 4) && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 text-center animate-fadeIn">
            <p className="text-sm font-black text-amber-800 dark:text-amber-200 mb-1">
              ⚔️ 全校三大擂台目前全數客滿激戰中 (12/12 滿員)！
            </p>
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
              建議同學先前往【星空防衛戰】或【單字貪食蛇】暖身練習，稍後點擊右上角「探測擂台」搶進！
            </p>
          </div>
        )}
      </div>
    );
  }

  // ── 畫面 2：擂台等待備戰室 (Waiting Room) ──
  if (view === 'lobby') {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
      window.location.origin + '?join=' + selectedArena.code
    )}`;

    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full text-center p-6 sm:p-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-rose-100 text-rose-700">
              {selectedArena.name} 備戰中
            </span>
            <span className="font-mono text-xs font-black text-slate-400">
              {players.length}/4 人
            </span>
          </div>

          <h2 className="text-4xl font-black text-slate-800 dark:text-slate-100 font-mono tracking-widest my-2">
            {selectedArena.code}
          </h2>
          <p className="text-xs font-bold text-slate-500 mb-4">
            請同學選擇「{selectedArena.name}」或輸入 PIN 碼進入
          </p>

          {/* QR Code 掃碼加入區 */}
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
              <img
                src={qrUrl}
                alt="掃描加入房間"
                className="w-32 h-32 object-contain mx-auto"
              />
              <span className="text-[10px] font-bold text-slate-400 block mt-1">iPad 相機掃碼直接加入</span>
            </div>
          </div>

          {/* 已加入成員名單 */}
          <div className="space-y-2 mb-6">
            {players.map((p, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between font-black text-sm text-slate-800 dark:text-slate-100"
              >
                <span>{p.name} {p.deviceId === myDeviceIdRef.current ? '(你)' : ''}</span>
                {p.isHost && <span className="text-xs text-amber-500 font-bold">房主 👑</span>}
              </div>
            ))}
          </div>

          {isHost ? (
            <Button3D
              variant="rose"
              size="lg"
              disabled={players.length < 2}
              onClick={handleStartGameBroadcast}
              className="w-full mb-3"
              icon={Play}
            >
              {players.length < 2 ? '等待至少 2 人加入...' : '開戰！(鎖定擂台)'}
            </Button3D>
          ) : (
            <p className="text-xs font-black text-slate-500 animate-pulse mb-4">
              等待房主按下開戰...
            </p>
          )}

          <Button3D variant="slate" size="sm" onClick={handleLeaveRoom} className="w-full">
            退出擂台
          </Button3D>
        </GlassCard>
      </div>
    );
  }

  // ── 畫面 3：對戰勝利結算 (Result) ──
  if (view === 'result') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 animate-fadeIn">
        <GlassCard className="max-w-md w-full text-center p-8">
          <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-3 animate-bounce" />
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 font-heading mb-1">
            死鬥大贏家！
          </h2>
          <p className="text-xl font-black text-amber-500 my-4">
            👑 {winnerName} 活到了最後！
          </p>

          <Button3D variant="slate" size="lg" onClick={handleLeaveRoom} className="w-full">
            返回擂台大廳
          </Button3D>
        </GlassCard>
      </div>
    );
  }

  // ── 畫面 4：即時對戰進行中 (Playing) ──
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 flex flex-col items-center">
      {/* 頂部血條與防線 */}
      <div className="w-full mb-4 p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Button3D variant="slate" size="sm" onClick={handleLeaveRoom} icon={ArrowLeft}>
              退出擂台
            </Button3D>
            <span className="font-heading font-black text-sm flex items-center gap-1.5 text-slate-800 dark:text-slate-100">
              <Shield className="w-4 h-4 text-blue-500" />
              防衛線安全度 ({selectedArena.name})
            </span>
          </div>
          <span className={`font-black text-sm ${myHealth < 30 ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`}>
            {myHealth}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              myHealth < 30 ? 'bg-rose-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${myHealth}%` }}
          />
        </div>
      </div>

      {isDead ? (
        <GlassCard className="w-full text-center p-8 bg-rose-950/80 text-white">
          <h3 className="text-3xl font-black font-heading mb-2">防線已失守！</h3>
          <p className="text-sm font-bold opacity-80">
            你已戰敗，觀戰中...
          </p>
        </GlassCard>
      ) : (
        currentQuestion && (
          <GlassCard className="w-full text-center p-8">
            <span className="text-xs font-bold text-slate-400 mb-2 block">
              快速看中文選出正確英文發動突襲：
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-800 dark:text-slate-100 font-heading mb-8">
              {currentQuestion.zh}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {options.map((opt) => (
                <Button3D
                  key={opt.id}
                  variant="rose"
                  size="lg"
                  onClick={() => handleAnswer(opt)}
                  className="py-4 text-lg"
                >
                  {opt.text}
                </Button3D>
              ))}
            </div>
          </GlassCard>
        )
      )}
    </div>
  );
};
