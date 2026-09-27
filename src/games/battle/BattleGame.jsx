import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useI18n } from '../../context/I18nContext';
import { soundEngine, speakEnglish } from '../../services/audio';
import { supabase, getDeviceId, recordBattleWin } from '../../services/supabase';
import { generateSmartOptions } from '../../services/distractorHelper';
import confetti from 'canvas-confetti';
import { ArrowLeft, Swords, Users, Shield, Heart, Zap, Trophy, Play } from 'lucide-react';

export const BattleGame = ({
  settings,
  words = [],
  onBack
}) => {
  const { t } = useI18n();
  const [view, setView] = useState('menu'); // 'menu' | 'lobby' | 'playing' | 'result'
  const [roomCode, setRoomCode] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('wutai_player_name') || '');
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // 戰鬥狀態
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [myHealth, setMyHealth] = useState(100); // 100% 防線
  const [isDead, setIsDead] = useState(false);
  const [winnerName, setWinnerName] = useState('');

  const channelRef = useRef(null);
  const myDeviceIdRef = useRef(getDeviceId());
  const battleUnitsRef = useRef(settings?.selectedUnits || []);

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setErrorMsg('請先輸入玩家暱稱！');
      return;
    }
    if (!settings.selectedUnits || settings.selectedUnits.length === 0) {
      setErrorMsg('房主請先回到主畫面勾選對戰複習範圍！');
      return;
    }
    localStorage.setItem('wutai_player_name', playerName.trim());
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomCode(code);
    setIsHost(true);
    battleUnitsRef.current = settings.selectedUnits;
    joinRoomChannel(code, true);
  };

  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      setErrorMsg('請先輸入玩家暱稱！');
      return;
    }
    if (joinCodeInput.trim().length !== 4) {
      setErrorMsg('請輸入 4 位數房號！');
      return;
    }
    localStorage.setItem('wutai_player_name', playerName.trim());
    setRoomCode(joinCodeInput.trim());
    setIsHost(false);
    joinRoomChannel(joinCodeInput.trim(), false);
  };

  const joinRoomChannel = (code, hostFlag) => {
    setErrorMsg('');
    const channelName = `battle-room-${code}`;
    const channel = supabase.channel(channelName, {
      config: { presence: { key: myDeviceIdRef.current } }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const activeList = Object.values(state).flat();
        setPlayers(activeList);
      })
      .on('broadcast', { event: 'game-start' }, ({ payload }) => {
        // 全體玩家皆以房主設定的範圍為準！
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
            if (next <= 0) {
              handlePlayerDead();
            }
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
            isDead: false
          });
          setView('lobby');
        }
      });

    channelRef.current = channel;
  };

  const handleStartGameBroadcast = () => {
    if (channelRef.current) {
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
    if (pool.length < 4) pool = words;

    const target = pool[Math.floor(Math.random() * pool.length)];
    setCurrentQuestion(target);

    // 採用智慧誘答演算法生成 4 個選項
    const opts = generateSmartOptions(target, pool, words, 'en');
    setOptions(opts);
  };

  const handleAnswer = (opt) => {
    if (!currentQuestion || isDead) return;

    if (opt.isCorrect) {
      soundEngine.correct();

      // 隨機選一位其他存活玩家發動攻擊
      const otherPlayers = players.filter(p => p.deviceId !== myDeviceIdRef.current && !p.isDead);
      if (otherPlayers.length > 0 && channelRef.current) {
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

  // 監聽是否只剩最後一人
  useEffect(() => {
    if (view === 'playing') {
      const alivePlayers = players.filter(p => !p.isDead);
      if (alivePlayers.length === 1 && players.length > 1) {
        const winner = alivePlayers[0];
        setWinnerName(winner.name);
        setView('result');
        soundEngine.win();
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });

        // 若獲勝者為此裝置，累計勝場至 Supabase (同時刷新最新暱稱)
        if (winner.deviceId === myDeviceIdRef.current) {
          const book = battleUnitsRef.current[0]?.split('-')[0] || '1';
          recordBattleWin({ book, name: playerName.trim() });
        }
      }
    }
  }, [players, view]);

  // 離開清理
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  if (view === 'menu') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full text-center p-8">
          <div className="w-20 h-20 rounded-3xl bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Swords className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2 font-heading">
            {t.battleTitle}
          </h2>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-6">
            2~4 人區網對戰，全員採用房主設定的單字範圍！
          </p>

          <div className="space-y-4 mb-6">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="請輸入你的戰鬥暱稱"
              className="w-full p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800 text-center font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-rose-500"
            />

            {errorMsg && <p className="text-xs font-black text-rose-500">{errorMsg}</p>}

            <Button3D variant="rose" size="lg" onClick={handleCreateRoom} className="w-full">
              建立新房間 (成為房主)
            </Button3D>

            <div className="flex gap-2">
              <input
                type="text"
                maxLength={4}
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                placeholder="4 位數房號"
                className="w-36 p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800 text-center font-black text-lg text-slate-800 dark:text-slate-100 outline-none"
              />
              <Button3D variant="blue" size="md" onClick={handleJoinRoom} className="flex-1">
                加入房間
              </Button3D>
            </div>
          </div>

          <Button3D variant="slate" size="sm" onClick={onBack} className="w-full">
            {t.backLobby}
          </Button3D>
        </GlassCard>
      </div>
    );
  }

  if (view === 'lobby') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full text-center p-8">
          <span className="text-xs font-black px-3 py-1 rounded-full bg-rose-100 text-rose-700">
            戰備等待室
          </span>
          <h2 className="text-4xl font-black text-slate-800 dark:text-slate-100 font-mono tracking-widest my-3">
            {roomCode}
          </h2>
          <p className="text-xs font-bold text-slate-500 mb-6">
            請其他同學輸入此 4 位數房號加入 (題目將自動同步房主範圍)
          </p>

          <div className="space-y-2 mb-6">
            <p className="text-xs font-black text-slate-400 text-left">
              已連線玩家 ({players.length}/4)：
            </p>
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
              disabled={players.length < 1}
              onClick={handleStartGameBroadcast}
              className="w-full"
              icon={Play}
            >
              開戰！
            </Button3D>
          ) : (
            <p className="text-xs font-black text-slate-500 animate-pulse">
              等待房主按下開始...
            </p>
          )}
        </GlassCard>
      </div>
    );
  }

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

          <Button3D variant="slate" size="lg" onClick={onBack} className="w-full">
            {t.backLobby}
          </Button3D>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 flex flex-col items-center">
      {/* 頂部血條與防線 */}
      <div className="w-full mb-6 p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-2">
          <span className="font-heading font-black text-sm flex items-center gap-1.5 text-slate-800 dark:text-slate-100">
            <Shield className="w-4 h-4 text-blue-500" />
            我的防衛線安全度
          </span>
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
