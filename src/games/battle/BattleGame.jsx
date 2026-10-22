import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button3D } from '../../components/ui/Button3D';
import { useI18n } from '../../context/I18nContext';
import { useStudent } from '../../context/StudentContext';
import { soundEngine } from '../../services/audio';
import { supabase, getDeviceId, recordBattleWin } from '../../services/supabase';
import { generateSmartOptions } from '../../services/distractorHelper';
import { getProfanityError } from '../../services/profanityFilter';
import confetti from 'canvas-confetti';
import { enterFullscreen, exitFullscreen } from '../../services/fullscreen';
import {
  ArrowLeft, Swords, Users, Heart, Zap,
  Trophy, Play, RefreshCw, Lock, CheckCircle2, AlertCircle,
  Eye, Maximize2, Minimize2, Sparkles, Flame, Skull, Crown,
  UserX, Gamepad2, BookOpen, Check, Settings2, SlidersHorizontal, ChevronRight, X
} from 'lucide-react';
import { MeteorCanvas3D } from '../meteor/MeteorCanvas3D';
import { MeteorEasterEggs2D } from '../meteor/MeteorEasterEggs2D';
import { RightComboDisplay } from '../meteor/RightComboDisplay';
import { EmergencyRaidMeteor } from './EmergencyRaidMeteor';
import { calculateMeteorDuration, calculateMeteorMotionProgress } from '../meteor/meteorPhysics';

const POSTER_BATTLE = '/assets/lobby/theme_battle.jpg';

// ── 全校固定三大限定擂台 (嚴格限制全校同時最多 3 場對戰，徹底防護連線數與廣播配額) ──
const BATTLE_BOOKS = [
  { id: '1', label: '三上 (第1冊)', short: 'B1 三上', grade: 3, semester: 1 },
  { id: '2', label: '三下 (第2冊)', short: 'B2 三下', grade: 3, semester: 2 },
  { id: '3', label: '四上 (第3冊)', short: 'B3 四上', grade: 4, semester: 1 },
  { id: '4', label: '四下 (第4冊)', short: 'B4 四下', grade: 4, semester: 2 },
  { id: '5', label: '五上 (第5冊)', short: 'B5 五上', grade: 5, semester: 1 },
  { id: '6', label: '五下 (第6冊)', short: 'B6 五下', grade: 5, semester: 2 },
  { id: '7', label: '六上 (第7冊)', short: 'B7 六上', grade: 6, semester: 1 },
  { id: '8', label: '六下 (第8冊)', short: 'B8 六下', grade: 6, semester: 2 },
  { id: 'abc', label: 'Aa 字母樂園', short: 'Aa 字母', isAlpha: true }
];

const getUnitsForBook = (bookId, allWords = []) => {
  if (bookId === 'abc') return ['abc'];
  const lessons = new Set();
  allWords.forEach(w => {
    if (String(w.book) === String(bookId)) {
      lessons.add(w.lesson);
    }
  });
  return Array.from(lessons).map(l => `${bookId}-${l}`);
};

const FIXED_ARENAS = [
  {
    id: 'arena-1',
    code: '1001',
    name: '🔴 烈焰擂台',
    enName: 'Blazing Inferno Arena',
    color: 'rose',
    tagline: '赤紅烈火 • 隕石突襲 • 火力全開',
    cardGlow: 'border-rose-500/80 shadow-[0_0_30px_rgba(244,63,94,0.35)]',
    cardBg: 'bg-gradient-to-b from-rose-950/80 via-slate-900/90 to-slate-950/95',
    badgeClass: 'bg-rose-500/25 text-rose-300 border border-rose-400/50',
    accentText: 'text-rose-400',
    btnVariant: 'rose'
  },
  {
    id: 'arena-2',
    code: '1002',
    name: '🟢 翡翠擂台',
    enName: 'Emerald Sanctuary Arena',
    color: 'emerald',
    tagline: '神聖晶石 • 翡翠力場 • 極速對決',
    cardGlow: 'border-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.35)]',
    cardBg: 'bg-gradient-to-b from-emerald-950/80 via-slate-900/90 to-slate-950/95',
    badgeClass: 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/50',
    accentText: 'text-emerald-400',
    btnVariant: 'emerald'
  },
  {
    id: 'arena-3',
    code: '1003',
    name: '🔵 星空擂台',
    enName: 'Celestial Nebula Arena',
    color: 'blue',
    tagline: '浩瀚星雲 • 智慧交鋒 • 跨界連線',
    cardGlow: 'border-blue-500/80 shadow-[0_0_30px_rgba(59,130,246,0.35)]',
    cardBg: 'bg-gradient-to-b from-blue-950/80 via-slate-900/90 to-slate-950/95',
    badgeClass: 'bg-blue-500/25 text-blue-300 border border-blue-400/50',
    accentText: 'text-blue-400',
    btnVariant: 'blue'
  }
];

export const BattleGame = ({
  settings,
  setSettings,
  words = [],
  onBack,
  autoJoinCode = null
}) => {
  const { t } = useI18n();
  const battleUnitsRef = useRef(settings?.selectedUnits || []);
  const [view, setView] = useState('menu'); // 'menu' | 'lobby' | 'playing' | 'result'
  const [selectedArena, setSelectedArena] = useState(FIXED_ARENAS[0]);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('wutai_player_name') || '');
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [gameMode, setGameMode] = useState('meteor'); // 'meteor' | 'memory'
  const hasSelectedUnits = true;
  const { currentStudent, isLoggedIn, addCoins } = useStudent();
  const [isScopeModalOpen, setIsScopeModalOpen] = useState(false);
  const [modalBookId, setModalBookId] = useState('1');

  // 若尚未選取範圍，依據學生年級（或預設第 1 冊）自動填入全冊單元，保證開房暢行無阻！
  useEffect(() => {
    if (!settings?.selectedUnits || settings.selectedUnits.length === 0) {
      let defaultBook = '1';
      const g = currentStudent?.grade;
      if (g === '04' || g === 4) defaultBook = '3';
      else if (g === '05' || g === 5) defaultBook = '5';
      else if (g === '06' || g === 6) defaultBook = '7';
      else if (g === '01' || g === '02') defaultBook = 'abc';

      const defaultUnits = getUnitsForBook(defaultBook, words);
      if (defaultUnits.length > 0) {
        if (typeof setSettings === 'function') {
          setSettings(prev => ({ ...prev, selectedUnits: defaultUnits }));
        }
        battleUnitsRef.current = defaultUnits;
      }
    }
  }, [words, currentStudent?.grade, settings?.selectedUnits, setSettings]);

  // 當前選取範圍描述與字數統計
  const selectedUnits = settings?.selectedUnits || battleUnitsRef.current || [];
  const currentScopeInfo = useMemo(() => {
    if (selectedUnits.includes('abc')) {
      const matchWords = words.filter(w => w.book === 'abc' || w.isAlphabet);
      return {
        title: '【低年級】Aa 字母自然發音樂園',
        bookId: 'abc',
        count: matchWords.length || 26
      };
    }
    const books = Array.from(new Set(selectedUnits.map(u => u.split('-')[0]))).filter(Boolean);
    if (books.length === 1) {
      const bId = books[0];
      const bObj = BATTLE_BOOKS.find(b => b.id === bId);
      const allBookUnits = getUnitsForBook(bId, words);
      const isWholeBook = allBookUnits.length > 0 && allBookUnits.every(u => selectedUnits.includes(u));
      const matchWords = words.filter(w => selectedUnits.includes(`${w.book}-${w.lesson}`));
      return {
        title: `【${bObj?.label || `第 ${bId} 冊`}】${isWholeBook ? '全冊單元' : `自選 ${selectedUnits.length} 單元`}`,
        bookId: bId,
        count: matchWords.length
      };
    }
    const matchWords = words.filter(w => selectedUnits.includes(`${w.book}-${w.lesson}`));
    return {
      title: `跨冊選取 (${selectedUnits.length} 個單元)`,
      bookId: books[0] || '1',
      count: matchWords.length
    };
  }, [selectedUnits, words]);

  // 一鍵切換指定冊次全單元
  const handleQuickSelectBook = (bookId) => {
    soundEngine.click();
    const newUnits = getUnitsForBook(bookId, words);
    battleUnitsRef.current = newUnits;
    if (typeof setSettings === 'function') {
      setSettings(prev => ({ ...prev, selectedUnits: newUnits }));
    }
  };

  // 取得特定冊次的所有可用單元清單
  const getLessonsForBook = (bookId) => {
    if (bookId === 'abc') return [{ id: 'abc', label: 'Aa 字母全套' }];
    const lessons = new Set();
    words.forEach(w => {
      if (String(w.book) === String(bookId)) {
        lessons.add(w.lesson);
      }
    });
    return Array.from(lessons).map(l => ({
      id: `${bookId}-${l}`,
      label: l
    }));
  };

  // 單元勾選切換
  const handleToggleUnitInModal = (unitKey) => {
    soundEngine.click();
    const current = new Set(selectedUnits);
    if (current.has(unitKey)) {
      current.delete(unitKey);
    } else {
      current.add(unitKey);
    }
    const nextUnits = Array.from(current);
    battleUnitsRef.current = nextUnits;
    if (typeof setSettings === 'function') {
      setSettings(prev => ({ ...prev, selectedUnits: nextUnits }));
    }
  };

  // 彈窗全選當前冊次所有單元
  const handleSelectAllUnitsOfBook = (bookId) => {
    soundEngine.click();
    const allOfBook = getUnitsForBook(bookId, words);
    battleUnitsRef.current = allOfBook;
    if (typeof setSettings === 'function') {
      setSettings(prev => ({ ...prev, selectedUnits: allOfBook }));
    }
  };


  // 三大擂台全域狀態監控
  const [arenaStates, setArenaStates] = useState({
    'arena-1': { count: 0, isBattling: false, hostName: '', playerNames: [] },
    'arena-2': { count: 0, isBattling: false, hostName: '', playerNames: [] },
    'arena-3': { count: 0, isBattling: false, hostName: '', playerNames: [] }
  });
  // ── 幽靈房間與閒置防護計時器 (Ghost Room & Inactivity Defenses) ──
  const [lobbyIdleCountdown, setLobbyIdleCountdown] = useState(300); // 5 分鐘等待房無活動自動解散
  const [resultCountdown, setResultCountdown] = useState(60); // 60 秒結算畫面自動釋出擂台
  const lobbyActivityRef = useRef(Date.now());

  const recordLobbyActivity = useCallback(() => {
    lobbyActivityRef.current = Date.now();
    setLobbyIdleCountdown(300);
  }, []);

  const [isConnecting, setIsConnecting] = useState(null);
  const [isProbing, setIsProbing] = useState(false);
  const [probeCounter, setProbeCounter] = useState(0);

  // ── 隕石戰鬥狀態 ──
  const [renderMode, setRenderMode] = useState('3d');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [myLives, setMyLives] = useState(3);
  const [myScore, setMyScore] = useState(0);
  const [myMeteorsDestroyed, setMyMeteorsDestroyed] = useState(0);
  const [myCombo, setMyCombo] = useState(0);
  const [horizonOffset, setHorizonOffset] = useState(0); // 地平線位移 (-30% ~ +30%)
  const [isDead, setIsDead] = useState(false);
  const [hideDeadModal, setHideDeadModal] = useState(false); // 陣亡後允許隱藏彈窗觀戰

  const [currentMeteor, setCurrentMeteor] = useState(null);
  const [options, setOptions] = useState([]);
  const [isExploding, setIsExploding] = useState(false);
  const [laserTrigger, setLaserTrigger] = useState(null);
  const [wordQueue, setWordQueue] = useState([]);

  // 突襲隕石 (Emergency Raid Meteor) 佇列與連續未防守計數
  const [activeRaid, setActiveRaid] = useState(null);
  const [raidMissStreak, setRaidMissStreak] = useState(0); // 連續未防禦墜地計數
  const raidQueueRef = useRef([]);
  const isProcessingRaidRef = useRef(false);
  const raidMissStreakRef = useRef(0);

  // 飄浮動態通知
  const [noticeBanner, setNoticeBanner] = useState(null);
  // 對戰結算金幣獎勵
  const hasAwardedBattleCoinsRef = useRef(false);
  const [battleReward, setBattleReward] = useState(null);

  // 結算數據
  const [finalLeaderboard, setFinalLeaderboard] = useState([]);
  const [winnerName, setWinnerName] = useState('');

  // 內部同步 Ref (防止非同步閉包取得過期資料)
  const channelRef = useRef(null);
  const myDeviceIdRef = useRef(getDeviceId());
  const myJoinTimestampRef = useRef(Date.now());
  const gameStartTimeRef = useRef(0);

  const livesRef = useRef(3);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const horizonRef = useRef(0);
  const destroyedRef = useRef(0);
  const isDeadRef = useRef(false);
  const playersRef = useRef([]);

  const containerRef = useRef(null);
  const meteor2DRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    if (view === 'result' && finalLeaderboard.length > 0 && !hasAwardedBattleCoinsRef.current) {
      hasAwardedBattleCoinsRef.current = true;
      const myIdx = finalLeaderboard.findIndex(p => p.deviceId === myDeviceIdRef.current);
      let coinsDelta = 3;
      let rankText = '榮譽參賽';
      if (myIdx === 0) {
        coinsDelta = 15;
        rankText = '👑 擂台大冠軍';
      } else if (myIdx === 1) {
        coinsDelta = 10;
        rankText = '🥈 榮耀亞軍';
      } else if (myIdx === 2) {
        coinsDelta = 6;
        rankText = '🥉 勇士季軍';
      }
      setBattleReward({ coins: coinsDelta, title: rankText });
      if (isLoggedIn && addCoins) {
        addCoins(coinsDelta);
      }
    }
    if (view !== 'result') {
      hasAwardedBattleCoinsRef.current = false;
      setBattleReward(null);
    }
  }, [view, finalLeaderboard, isLoggedIn, addCoins]);

  // 同步 Refs
  useEffect(() => { livesRef.current = myLives; }, [myLives]);
  useEffect(() => { scoreRef.current = myScore; }, [myScore]);
  useEffect(() => { comboRef.current = myCombo; }, [myCombo]);
  useEffect(() => { horizonRef.current = horizonOffset; }, [horizonOffset]);
  useEffect(() => { destroyedRef.current = myMeteorsDestroyed; }, [myMeteorsDestroyed]);
  useEffect(() => { isDeadRef.current = isDead; }, [isDead]);
  useEffect(() => { playersRef.current = players; }, [players]);
  useEffect(() => { raidMissStreakRef.current = raidMissStreak; }, [raidMissStreak]);
  const viewRef = useRef(view);
  useEffect(() => { viewRef.current = view; }, [view]);

  // 監聽全螢幕
  // 卸載時還原全螢幕
  useEffect(() => {
    return () => {
      exitFullscreen();
    };
  }, []);

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

  const toggleFullscreen = () => {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  // 飄浮通知封裝
  const showNotice = useCallback((text, type = 'info') => {
    setNoticeBanner({ text, type });
    setTimeout(() => {
      setNoticeBanner(prev => (prev?.text === text ? null : prev));
    }, 2800);
  }, []);

  // 閘門 1：開房 5 分鐘無活動自動解散釋出 (Auto-disband on 5-min inactivity in lobby)
  useEffect(() => {
    if (view !== 'lobby') return;

    lobbyActivityRef.current = Date.now();
    setLobbyIdleCountdown(300);

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lobbyActivityRef.current) / 1000);
      const remaining = Math.max(0, 300 - elapsed);
      setLobbyIdleCountdown(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        if (isHost && channelRef.current) {
          try {
            channelRef.current.send({
              type: 'broadcast',
              event: 'room-timeout',
              payload: { arenaId: selectedArena?.id }
            });
          } catch (e) {}
        }
        handleLeaveRoom();
        setErrorMsg('⏰ 此擂台開立後已超過 5 分鐘無操作，系統已自動解散並釋出房間供全校使用。');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [view, isHost, selectedArena]);

  // 閘門 3：結算畫面 60 秒自動清除並釋放擂台 (Auto-release room on settlement expiration)
  useEffect(() => {
    if (view !== 'result') return;

    // 即刻更新 Presence 狀態為 'result'，讓大廳探測能辨識此擂台已可供新局使用
    if (channelRef.current) {
      try {
        channelRef.current.track({
          deviceId: myDeviceIdRef.current,
          name: playerName.trim(),
          isHost: isHost,
          status: 'result',
          isDead: isDeadRef.current,
          lives: livesRef.current,
          score: scoreRef.current,
          joinedAt: myJoinTimestampRef.current,
          lastActiveAt: Date.now()
        });
      } catch (e) {}
    }

    setResultCountdown(60);
    const timer = setInterval(() => {
      setResultCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleLeaveRoom();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [view, isHost, playerName]);

  // ── 大廳零長連線架構：1-Shot 快照探測 ──
  useEffect(() => {
    if (view !== 'menu') return;

    let isCancelled = false;
    setIsProbing(true);

    const probeChannels = FIXED_ARENAS.map(arena => {
      const ch = supabase.channel(`battle-${arena.id}`);
      ch.on('presence', { event: 'sync' }, () => {
        if (isCancelled) return;
        const state = ch.presenceState();
        const list = Object.values(state).flat();
        const host = list.find(p => p.isHost);

        const now = Date.now();
        // 幽靈房精準判定：
        // 1. 全體成員皆處於 'result'（已結算死房）
        // 2. 或全體成員皆為 'waiting' 且加入時間已逾 5 分鐘（無人開局之幽靈大廳）
        const allResult = list.length > 0 && list.every(p => p.status === 'result');
        const isStaleWaiting = list.length > 0 && list.every(p => p.status === 'waiting' && (now - (p.joinedAt || now) > 5 * 60 * 1000));
        const isGhost = allResult || isStaleWaiting;

        const effectiveCount = isGhost ? 0 : list.length;
        const isBattling = !isGhost && list.some(p => p.status === 'battling');

        setArenaStates(prev => ({
          ...prev,
          [arena.id]: {
            count: effectiveCount,
            rawCount: list.length,
            isBattling,
            isGhost,
            ghostReason: allResult ? '已結算釋出' : (isStaleWaiting ? '超過5分鐘無活動' : null),
            hostName: host && !isGhost ? host.name : '',
            playerNames: isGhost ? [] : list.map(p => p.name)
          }
        }));
      });
      ch.subscribe();
      return ch;
    });

    const timer = setTimeout(() => {
      if (!isCancelled) {
        probeChannels.forEach(ch => {
          try {
            if (ch.untrack) ch.untrack();
            supabase.removeChannel(ch);
          } catch (e) {}
        });
        setIsProbing(false);
      }
    }, 1500);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      probeChannels.forEach(ch => {
        try {
          if (ch.untrack) ch.untrack();
          supabase.removeChannel(ch);
        } catch (e) {}
      });
      setIsProbing(false);
    };
  }, [view, probeCounter]);

  // 退出對戰清理
  const handleLeaveRoom = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }

    if (channelRef.current) {
      try {
        if (channelRef.current.untrack) channelRef.current.untrack();
        supabase.removeChannel(channelRef.current);
      } catch (e) {}
      channelRef.current = null;
    }
    setIsHost(false);
    setIsConnecting(null);
    setPlayers([]);
    setActiveRaid(null);
    raidQueueRef.current = [];
    isProcessingRaidRef.current = false;
    setRaidMissStreak(0);
    raidMissStreakRef.current = 0;
    setView('menu');
  };

  // 開立指定擂台 (房主)
  const handleHostArena = (arena) => {
    const cleanName = playerName.trim();
    if (!cleanName) {
      setErrorMsg(t.enterNicknameError);
      return;
    }
    const badWordError = getProfanityError(cleanName);
    if (badWordError) {
      setErrorMsg(badWordError);
      return;
    }

    // 嚴格判定：開立新房間者必須在首頁已選取單元範圍
    if (!settings?.selectedUnits || settings.selectedUnits.length === 0) {
      setErrorMsg('您尚未在首頁選擇單元題庫！請先點擊左上方返回首頁勾選單元，方可開立新擂台。');
      return;
    }

    const cur = arenaStates[arena.id];
    if (cur && !cur.isGhost && (cur.count > 0 || cur.isBattling)) {
      setErrorMsg(`【${arena.name}】剛已被搶先開立或正在對戰中，請選擇其他空房！`);
      return;
    }

    // 若為幽靈房，主動先向該頻道發送 reset 指令清除殘留幽靈 presence
    if (cur?.isGhost) {
      try {
        const cleanupCh = supabase.channel(`battle-${arena.id}`);
        cleanupCh.subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await cleanupCh.send({
              type: 'broadcast',
              event: 'admin_force_reset',
              payload: { reason: 'stale_ghost_override', timestamp: Date.now() }
            });
            supabase.removeChannel(cleanupCh);
          }
        });
      } catch (e) {}
    }

    localStorage.setItem('wutai_player_name', cleanName);
    setSelectedArena(arena);
    setIsHost(true);
    battleUnitsRef.current = settings.selectedUnits;
    connectToArenaChannel(arena, true);
  };

  // 加入指定擂台 (成員：無須選取範圍或模式，依先後順序加入，額滿 4 人防護)
  const handleJoinArena = (arena) => {
    const cleanName = playerName.trim();
    if (!cleanName) {
      setErrorMsg(t.enterNicknameError);
      return;
    }
    const badWordError = getProfanityError(cleanName);
    if (badWordError) {
      setErrorMsg(badWordError);
      return;
    }

    const cur = arenaStates[arena.id];
    if (cur && cur.isBattling) {
      setErrorMsg(`【${arena.name}】正在激烈激戰中，已被鎖定！請選擇其他擂台。`);
      return;
    }
    if (cur && cur.count >= 4) {
      setErrorMsg(`【${arena.name}】已滿員 (4/4 人)！請選擇其他擂台。`);
      return;
    }

    localStorage.setItem('wutai_player_name', cleanName);
    setSelectedArena(arena);
    setIsHost(false);
    connectToArenaChannel(arena, false);
  };

  // 透過 4 碼 PIN 快速加入房間
  const handleQuickJoinByPin = (codeToJoin = pinInput) => {
    const cleanPin = (codeToJoin || '').trim();
    if (!cleanPin) {
      setErrorMsg('請輸入 4 位數擂台 PIN 碼 (例: 1001, 1002, 1003)');
      return;
    }
    const match = FIXED_ARENAS.find(a => a.code === cleanPin);
    if (!match) {
      setErrorMsg(`找不到 PIN 碼為【${cleanPin}】的擂台房間，全校三大擂台固定為 1001、1002、1003！`);
      return;
    }
    handleJoinArena(match);
  };

  // 支援 iPad 相機掃描 QR Code (?join=1001) 即刻鎖定並加入
  useEffect(() => {
    const code = (autoJoinCode || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('join') : '') || '').trim();
    if (code && view === 'menu') {
      const match = FIXED_ARENAS.find(a => a.code === code);
      if (match) {
        setPinInput(code);
        const savedName = localStorage.getItem('wutai_player_name');
        if (savedName && savedName.trim()) {
          handleJoinArena(match);
        } else {
          showNotice(`已鎖定【${match.name} (PIN: ${match.code})】，請輸入戰鬥暱稱後即可加入！`, 'info');
        }
      }
    }
  }, [autoJoinCode, view]);

  // 房主剔除成員 (廣播通知對方退出)
  const handleKickPlayer = (targetDeviceId, targetName) => {
    if (!isHost || !channelRef.current) return;
    if (targetDeviceId === myDeviceIdRef.current) return;

    channelRef.current.send({
      type: 'broadcast',
      event: 'kick-player',
      payload: {
        targetDeviceId,
        targetName
      }
    });

    setPlayers(prev => prev.filter(p => p.deviceId !== targetDeviceId));
    showNotice(`已將【${targetName}】移出房間`, 'info');
  };

  // 房主切換對抗模式 (即時廣播同步至全房)
  const handleSelectGameMode = (newMode) => {
    if (!isHost) return;
    setGameMode(newMode);
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'mode-change',
        payload: { gameMode: newMode }
      });
    }
    showNotice(`對決模式已切換為：${newMode === 'meteor' ? '☄️ 星空防衛戰' : '🃏 星際記憶翻牌'}`, 'info');
  };

  // 廣播個人實時數據 (血量、愛心、得分、連擊、地平線)
  const broadcastMyStats = useCallback((override = {}) => {
    if (!channelRef.current) return;
    const payload = {
      deviceId: myDeviceIdRef.current,
      name: playerName.trim(),
      score: override.score !== undefined ? override.score : scoreRef.current,
      lives: override.lives !== undefined ? override.lives : livesRef.current,
      combo: override.combo !== undefined ? override.combo : comboRef.current,
      horizonOffset: override.horizonOffset !== undefined ? override.horizonOffset : horizonRef.current,
      meteorsDestroyed: override.meteorsDestroyed !== undefined ? override.meteorsDestroyed : destroyedRef.current,
      isDead: override.isDead !== undefined ? override.isDead : isDeadRef.current,
      survivalTime: Math.floor((Date.now() - (gameStartTimeRef.current || Date.now())) / 1000)
    };

    channelRef.current.send({
      type: 'broadcast',
      event: 'player-stats',
      payload
    });
  }, [playerName]);

  // 處理突襲隕石佇列 (Sequential Queue Processor)
  const processNextRaid = useCallback(() => {
    if (isProcessingRaidRef.current) return;
    if (raidQueueRef.current.length === 0) {
      setActiveRaid(null);
      return;
    }

    isProcessingRaidRef.current = true;
    const nextRaid = raidQueueRef.current.shift();
    const currentStreak = raidMissStreakRef.current;
    // 連續 5 顆未理會後，第 6 顆起為烈焰大隕石 (isMega)
    const isMega = currentStreak >= 5;

    setActiveRaid({
      ...nextRaid,
      isMega,
      missStreak: currentStreak
    });
  }, []);

  // 突襲隕石成功攔截 (手速防禦：不給予得分，扣分連鎖歸零重置)
  const handleRaidDefended = useCallback((isMega) => {
    soundEngine.correct();

    // 成功防禦解除危機，墜地扣分連鎖數歸零
    setRaidMissStreak(0);
    raidMissStreakRef.current = 0;

    if (isMega) {
      showNotice('🛡️ 成功擊碎毀滅級烈焰大隕石！危機解除，扣分連鎖歸零！', 'success');
    } else {
      showNotice('🛡️ 成功攔截敵方突襲隕石！防線完好，扣分連鎖歸零！', 'success');
    }

    setActiveRaid(null);
    isProcessingRaidRef.current = false;
    setTimeout(() => {
      processNextRaid();
    }, 500);
  }, [showNotice, processNextRaid]);

  // 自身陣亡處理
  const handlePlayerDead = useCallback(() => {
    if (isDeadRef.current) return;
    setIsDead(true);
    setMyLives(0);
    soundEngine.wrong();

    const deadPayload = {
      deviceId: myDeviceIdRef.current,
      name: playerName.trim(),
      score: scoreRef.current,
      lives: 0,
      isDead: true,
      meteorsDestroyed: destroyedRef.current,
      survivalTime: Math.floor((Date.now() - (gameStartTimeRef.current || Date.now())) / 1000)
    };

    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'player-dead',
        payload: deadPayload
      });

      // 更新 presence
      channelRef.current.track({
        deviceId: myDeviceIdRef.current,
        name: playerName.trim(),
        isHost: isHost,
        status: 'battling',
        isDead: true,
        lives: 0,
        score: scoreRef.current,
        joinedAt: myJoinTimestampRef.current
      });
    }

    showNotice('🛡️ 防衛線已失守！你目前處於觀戰模式。', 'danger');
  }, [playerName, isHost, showNotice]);

  // 突襲隕石撞地逾時懲罰 (扣分加成；連續 5 顆未理會後之第 6 顆起加扣愛心)
  const handleRaidImpact = useCallback((isMega) => {
    soundEngine.explosion();

    const streak = raidMissStreakRef.current;
    const penalty = 10 + streak;
    const nextStreak = streak + 1;

    setRaidMissStreak(nextStreak);
    raidMissStreakRef.current = nextStreak;

    // 扣分機制：每次扣 10 + streak，最低不低於 0 分
    setMyScore(s => {
      const nextScore = Math.max(0, s - penalty);
      broadcastMyStats({ score: nextScore });
      return nextScore;
    });

    // 致命機制：若為連續 5 顆未理會之烈焰大隕石 (isMega)，額外扣除 1 顆愛心！
    if (isMega) {
      soundEngine.wrong();
      showNotice(`💥 毀滅烈焰隕石撞地！扣除 ${penalty} 分並扣除 1 顆愛心💔！`, 'danger');
      setMyLives(prev => {
        const nextLives = Math.max(0, prev - 1);
        broadcastMyStats({ lives: nextLives });
        if (nextLives <= 0) {
          handlePlayerDead();
        }
        return nextLives;
      });
    } else {
      showNotice(`💥 突襲隕石撞地！扣除 ${penalty} 分（連續未防禦 ${nextStreak} 顆）！`, 'danger');
    }

    setActiveRaid(null);
    isProcessingRaidRef.current = false;
    setTimeout(() => {
      processNextRaid();
    }, 500);
  }, [broadcastMyStats, showNotice, processNextRaid, handlePlayerDead]);

  // 計算結算排名榜單 (按規則：1.剩餘愛心降冪 2.總分含愛心加成降冪 3.擊落題數降冪 4.存活時間降冪)
  const calculateLeaderboard = useCallback((activePlayers) => {
    return [...activePlayers].map(p => {
      const remainingLives = p.lives !== undefined ? p.lives : (p.isDead ? 0 : 3);
      const rawScore = p.score || 0;
      const heartBonus = remainingLives > 0 ? remainingLives * 50 : 0;
      const finalScore = rawScore + heartBonus;
      return {
        ...p,
        lives: remainingLives,
        rawScore,
        heartBonus,
        finalScore,
        meteorsDestroyed: p.meteorsDestroyed || 0,
        survivalTime: p.survivalTime || 0
      };
    }).sort((a, b) => {
      // 1. 剩餘愛心數降冪 (存活者在前)
      if (b.lives !== a.lives) return b.lives - a.lives;
      // 2. 最終得分降冪
      if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
      // 3. 擊落單字數降冪
      if (b.meteorsDestroyed !== a.meteorsDestroyed) return b.meteorsDestroyed - a.meteorsDestroyed;
      // 4. 存活時間降冪
      return b.survivalTime - a.survivalTime;
    });
  }, []);

  // 觸發結算 (當存活玩家 <= 1 時權威發起)
  const triggerGameOver = useCallback((currentActivePlayers) => {
    const sorted = calculateLeaderboard(currentActivePlayers);
    const champion = sorted[0];

    setFinalLeaderboard(sorted);
    setWinnerName(champion?.name || '無人生還');
    setView('result');

    soundEngine.win();
    try {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
    } catch (e) {}

    // 若本人是冠軍，記錄勝場
    if (champion && champion.deviceId === myDeviceIdRef.current) {
      const book = battleUnitsRef.current[0]?.split('-')[0] || '1';
      recordBattleWin({ book, name: playerName.trim() });
    }

    // 向全房廣播 game-over 同步切換結算畫面
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'game-over',
        payload: {
          leaderboard: sorted,
          winnerName: champion?.name || ''
        }
      });
    }
  }, [calculateLeaderboard, playerName]);

  // 連接至特定擂台頻道 (即時連線、滿員防爆、房主繼承與競態仲裁)
  const connectToArenaChannel = (arena, hostFlag) => {
    setErrorMsg('');
    setIsConnecting(arena.id);

    // 強制重置個人對戰資料與佇列 (徹底清除上一場歷史殘餘數據)
    setPlayers([]);
    setFinalLeaderboard([]);
    setWinnerName('');
    setActiveRaid(null);
    raidQueueRef.current = [];
    isProcessingRaidRef.current = false;
    setRaidMissStreak(0);
    raidMissStreakRef.current = 0;
    setMyScore(0);
    setMyLives(3);
    setMyCombo(0);
    setHorizonOffset(0);
    setIsDead(false);
    setHideDeadModal(false);

    const channelName = `battle-${arena.id}`;
    const channel = supabase.channel(channelName, {
      config: { presence: { key: myDeviceIdRef.current } }
    });

    const myJoinTimestamp = Date.now();
    myJoinTimestampRef.current = myJoinTimestamp;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const activeList = Object.values(state).flat();
        setPlayers(prev => {
          // 合併既有戰鬥數據，保留實時分數與血量
          const merged = activeList.map(item => {
            const existing = prev.find(p => p.deviceId === item.deviceId);
            return existing ? { ...item, ...existing, name: item.name, isHost: item.isHost } : item;
          });
          return merged;
        });

        // 1. 激戰中防插隊判定 (僅防範外部中途插隊，絕不踢除本房成員)
        if (viewRef.current === 'menu') {
          const isBattlingNow = activeList.some(p => p.status === 'battling' && p.deviceId !== myDeviceIdRef.current);
          if (isBattlingNow) {
            setErrorMsg(`【${arena.name}】正在激烈決戰中 (已鎖定)，請選擇其他擂台或稍後再戰！`);
            handleLeaveRoom();
            return;
          }
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
          hosts.sort((a, b) => (a.joinedAt || 0) - (b.joinedAt || 0) || a.deviceId.localeCompare(b.deviceId));
          const trueHost = hosts[0];
          if (myDeviceIdRef.current !== trueHost.deviceId) {
            setIsHost(false);
            channel.track({
              deviceId: myDeviceIdRef.current,
              name: playerName.trim(),
              isHost: false,
              status: 'waiting',
              isDead: false,
              lives: 3,
              score: 0,
              joinedAt: myJoinTimestamp
            });
            setErrorMsg(`同學 ${trueHost.name} 搶先開立，已為您自動轉為加入挑戰！`);
          }
        }

        // 4. 房主繼承機制 (Host Migration)：若房主離開，最早加入之存活成員接管
        const hasHost = activeList.some(p => p.isHost);
        if (!hasHost && activeList.length > 0) {
          const aliveCandidates = activeList.filter(p => !p.isDead);
          const pool = aliveCandidates.length > 0 ? aliveCandidates : activeList;
          pool.sort((a, b) => (a.joinedAt || 0) - (b.joinedAt || 0) || a.deviceId.localeCompare(b.deviceId));
          const successor = pool[0];

          if (successor && successor.deviceId === myDeviceIdRef.current) {
            setIsHost(true);
            channel.track({
              ...successor,
              deviceId: myDeviceIdRef.current,
              name: playerName.trim(),
              isHost: true
            });
            showNotice('👑 原房主已離線，你已自動接任為新房主！', 'warning');
          }
        }

        // 5. 存活人數即時判定 (支援 2 人、3 人、4 人對決結算與中途全員離線處理)
        if (viewRef.current === 'playing') {
          const alive = activeList.filter(p => !p.isDead && p.status !== 'result');
          // 若全房只剩 1 人，且該人正是自己（所有對手皆斷線或關閉分頁）
          if (activeList.length === 1 && activeList[0].deviceId === myDeviceIdRef.current) {
            showNotice('🏆 所有對手均已離線，判定您奪得本場擂台勝利！', 'success');
            setTimeout(() => {
              triggerGameOver(activeList);
            }, 800);
          } else if (activeList.length >= 1 && alive.length <= 1) {
            setTimeout(() => {
              triggerGameOver(activeList);
            }, 600);
          }
        }
      })
      .on('broadcast', { event: 'room-timeout' }, () => {
        soundEngine.wrong();
        handleLeaveRoom();
        setErrorMsg('⏰ 該擂台在大廳等待超過 5 分鐘無操作，房間已自動解散釋出。');
      })
      .on('broadcast', { event: 'admin_force_reset' }, () => {
        soundEngine.wrong();
        handleLeaveRoom();
        setErrorMsg('⚠️ 此擂台已由教師後台強制重置並釋放。');
      })
      .on('broadcast', { event: 'kick-player' }, ({ payload }) => {
        if (payload?.targetDeviceId === myDeviceIdRef.current) {
          soundEngine.wrong();
          handleLeaveRoom();
          setErrorMsg('您已被房主移出該擂台房間。');
        } else if (payload?.targetDeviceId) {
          setPlayers(prev => prev.filter(p => p.deviceId !== payload.targetDeviceId));
        }
      })
      .on('broadcast', { event: 'mode-change' }, ({ payload }) => {
        if (payload?.gameMode) {
          setGameMode(payload.gameMode);
          showNotice(`房主已切換對決模式為：${payload.gameMode === 'meteor' ? '☄️ 星空防衛戰' : '🃏 星際記憶翻牌'}`, 'info');
        }
      })
      .on('broadcast', { event: 'game-start' }, ({ payload }) => {
        if (payload?.selectedUnits && payload.selectedUnits.length > 0) {
          battleUnitsRef.current = payload.selectedUnits;
        }
        if (payload?.gameMode) {
          setGameMode(payload.gameMode);
        }
        startGame();
      })
      .on('broadcast', { event: 'meteor-raid' }, ({ payload }) => {
        // 收到來自對手的突襲赤紅隕石
        if (payload.attackerId !== myDeviceIdRef.current && !isDeadRef.current) {
          soundEngine.wrong();

          const currentStreak = raidMissStreakRef.current;
          const isMega = currentStreak >= 5;

          if (isMega) {
            showNotice(`🚨 致命警告！來自【${payload.attackerName}】的毀滅烈焰空襲！墜地將扣心！`, 'danger');
          } else {
            showNotice(`⚠️ 來自【${payload.attackerName}】的突襲空襲！速點 5 下防衛！`, 'warning');
          }

          raidQueueRef.current.push({
            id: payload.raidId || Math.random(),
            attackerName: payload.attackerName
          });
          processNextRaid();
        }
      })
      .on('broadcast', { event: 'gravity-shift' }, ({ payload }) => {
        // 受到敵方 5 連擊重力壓制：地平線防線上升 2%
        if (payload.attackerId !== myDeviceIdRef.current && !isDeadRef.current) {
          soundEngine.wrong();
          setHorizonOffset(h => {
            const next = Math.min(30, h + 2);
            broadcastMyStats({ horizonOffset: next });
            return next;
          });
          showNotice(`🌌 受到【${payload.attackerName}】重力壓制！防線上升 2%！`, 'warning');
        }
      })
      .on('broadcast', { event: 'player-stats' }, ({ payload }) => {
        // 更新其他玩家即時戰況
        setPlayers(prev =>
          prev.map(p => (p.deviceId === payload.deviceId ? { ...p, ...payload } : p))
        );
      })
      .on('broadcast', { event: 'player-dead' }, ({ payload }) => {
        // 標記該玩家陣亡
        setPlayers(prev => {
          const updated = prev.map(p =>
            p.deviceId === payload.deviceId ? { ...p, ...payload, isDead: true, lives: 0 } : p
          );

          // 檢查是否只剩 <= 1 位存活者 (提早結束結算判定)
          const alive = updated.filter(p => !p.isDead);
          if (updated.length >= 2 && alive.length <= 1) {
            setTimeout(() => {
              triggerGameOver(updated);
            }, 600);
          }

          return updated;
        });
      })
      .on('broadcast', { event: 'game-over' }, ({ payload }) => {
        // 收到全房結束結算指令
        if (payload?.leaderboard) {
          setFinalLeaderboard(payload.leaderboard);
          setWinnerName(payload.winnerName || '比賽結束');
          setView('result');
          soundEngine.win();
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            deviceId: myDeviceIdRef.current,
            name: playerName.trim(),
            isHost: hostFlag,
            status: 'waiting',
            isDead: false,
            lives: 3,
            score: 0,
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
    if (gameMode === 'memory') {
      showNotice('🃏 星際記憶翻牌多人連線對決現正緊鑼密鼓建置中，敬請期待！請先切換為【☄️ 星空防衛戰】進行開戰！', 'warning');
      return;
    }

    if (channelRef.current) {
      await channelRef.current.track({
        deviceId: myDeviceIdRef.current,
        name: playerName.trim(),
        isHost: true,
        status: 'battling',
        isDead: false,
        lives: 3,
        score: 0,
        joinedAt: myJoinTimestampRef.current
      });

      channelRef.current.send({
        type: 'broadcast',
        event: 'game-start',
        payload: {
          selectedUnits: battleUnitsRef.current,
          gameMode: gameMode
        }
      });
      startGame();
    }
  };

  // ── 開始戰鬥 (Playing Mode Initialization) ──
  const startGame = () => {
    setView('playing');
    setMyLives(3);
    setMyScore(0);
    setMyMeteorsDestroyed(0);
    setMyCombo(0);
    setHorizonOffset(0);
    setIsDead(false);
    setHideDeadModal(false);
    setActiveRaid(null);
    raidQueueRef.current = [];
    isProcessingRaidRef.current = false;
    setRaidMissStreak(0);
    raidMissStreakRef.current = 0;
    gameStartTimeRef.current = Date.now();

    // 請求全螢幕沉浸體驗 (支援 iPad)
    enterFullscreen();

    // 準備單字題庫
    const units = battleUnitsRef.current;
    const isAlpha = units.includes('abc');
    let pool = isAlpha
      ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(c => ({
          id: `abc-${c}`,
          en: c,
          zh: `字母 ${c}`,
          isAlphabet: true
        }))
      : words.filter(w => units.includes(`${w.book}-${w.lesson}`));
    if (pool.length === 0) pool = words;

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setWordQueue(shuffled);
    const firstWord = shuffled[0];
    updateOptionsFor(firstWord, pool);
    spawnMeteor(firstWord, 0);
  };

  // 產生 4 誘答選項
  const updateOptionsFor = (targetWord, pool) => {
    const opts = generateSmartOptions(
      targetWord,
      pool,
      words,
      'en',
      settings?.distractorMode || 'strict'
    );
    setOptions(opts);
  };

  // 召喚單字隕石 (鎖定中心 44%~56% 走廊，徹底與左側空襲 10%~25% 及右側連擊 74%~96% 零遮蔽隔開)
  const spawnMeteor = (wordObj, questionIndex) => {
    const duration = calculateMeteorDuration(questionIndex);
    const xPos = 44 + Math.random() * 12;

    setCurrentMeteor({
      word: wordObj,
      x: xPos,
      duration,
      startTime: performance.now(),
      questionIndex
    });

    setIsExploding(false);
  };

  // 2D 物理落下循環
  useEffect(() => {
    if (view !== 'playing' || !currentMeteor || isExploding || isDead || renderMode !== '2d') return;

    const tick = (now) => {
      const elapsed = (now - currentMeteor.startTime) / 1000;
      const motionProgress = calculateMeteorMotionProgress(
        elapsed,
        currentMeteor.duration,
        currentMeteor.questionIndex
      );

      const y = -10 + motionProgress * 100;
      if (meteor2DRef.current) {
        meteor2DRef.current.style.top = `${y}%`;
      }

      if (elapsed >= currentMeteor.duration) {
        handleMiss();
      } else {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [currentMeteor, view, isExploding, isDead, renderMode]);

  // 3D 模式超時碰撞檢查
  useEffect(() => {
    if (view !== 'playing' || !currentMeteor || isExploding || isDead || renderMode !== '3d') return;

    const timeoutMs = currentMeteor.duration * 1000;
    const timer = setTimeout(() => {
      handleMiss();
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [currentMeteor, view, isExploding, isDead, renderMode]);

  // 單字答錯或逾時撞擊地表扣心
  const handleMiss = () => {
    if (isDeadRef.current) return;
    soundEngine.wrong();
    setIsExploding(true);
    setMyCombo(0);

    setMyLives(prev => {
      const next = Math.max(0, prev - 1);
      broadcastMyStats({ lives: next, combo: 0 });
      if (next <= 0) {
        handlePlayerDead();
      } else {
        setTimeout(() => nextTurn(destroyedRef.current), 800);
      }
      return next;
    });
  };

  // 點擊選項答題
  const handleOptionClick = (opt) => {
    if (!currentMeteor || isExploding || isDead) return;
    soundEngine.laser();

    setLaserTrigger({ isCorrect: opt.isCorrect, timestamp: Date.now() });

    if (opt.isCorrect) {
      soundEngine.explosion();

      // 連擊獎勵計算：
      // 第 1 題 10 分 (bonus 0)
      // 第 2 題 10+1 分 (bonus 1)
      // 第 3 題 10+2 分 (bonus 2) ...
      const streakBonus = comboRef.current;
      const earned = 10 + streakBonus;
      const nextScore = scoreRef.current + earned;
      const nextDestroyed = destroyedRef.current + 1;
      const nextCombo = comboRef.current + 1;

      setMyScore(nextScore);
      setMyMeteorsDestroyed(nextDestroyed);
      setMyCombo(nextCombo);

      if (nextCombo >= 2) soundEngine.combo(nextCombo);

      // ── 互動機制 1：連對 3 題 (Combo 3) 突襲赤紅隕石 ──
      if (nextCombo % 3 === 0) {
        soundEngine.combo(4);
        showNotice('🔥 3連擊！已向所有對手發射突襲赤紅隕石施加干擾！', 'success');
        if (channelRef.current) {
          channelRef.current.send({
            type: 'broadcast',
            event: 'meteor-raid',
            payload: {
              attackerId: myDeviceIdRef.current,
              attackerName: playerName.trim(),
              raidId: `${myDeviceIdRef.current}-${Date.now()}-${nextCombo}`
            }
          });
        }
      }

      // ── 互動機制 2：連對 5 題 (Combo 5) 重力壓制 ──
      let updatedHorizon = horizonRef.current;
      if (nextCombo % 5 === 0) {
        soundEngine.combo(5);
        // 降低自身地平線 10% (爭取更多緩衝時間)
        updatedHorizon = Math.max(-30, horizonRef.current - 10);
        setHorizonOffset(updatedHorizon);

        showNotice('🌌 5連擊重力壓制！自身防線下調10%，對手防線上升2%！', 'success');

        if (channelRef.current) {
          channelRef.current.send({
            type: 'broadcast',
            event: 'gravity-shift',
            payload: {
              attackerId: myDeviceIdRef.current,
              attackerName: playerName.trim()
            }
          });
        }
      }

      // 同步最新戰況至房間成員
      broadcastMyStats({
        score: nextScore,
        meteorsDestroyed: nextDestroyed,
        combo: nextCombo,
        horizonOffset: updatedHorizon
      });

      setIsExploding(true);

      if (renderMode === '2d' && meteor2DRef.current) {
        const rect = meteor2DRef.current.getBoundingClientRect();
        try {
          confetti({
            particleCount: 25,
            spread: 60,
            origin: {
              x: (rect.left + rect.width / 2) / window.innerWidth,
              y: (rect.top + rect.height / 2) / window.innerHeight
            }
          });
        } catch (e) {}
      }

      setTimeout(() => nextTurn(nextDestroyed), renderMode === '3d' ? 650 : 600);
    } else {
      handleMiss();
    }
  };

  // 下一顆題目單字
  const nextTurn = (currentCount) => {
    const units = battleUnitsRef.current;
    let pool = words.filter(w => units.includes(`${w.book}-${w.lesson}`));
    if (pool.length === 0) pool = words;

    const newQueue = [...wordQueue];
    newQueue.shift();

    if (newQueue.length === 0) {
      newQueue.push(...[...pool].sort(() => 0.5 - Math.random()));
    }

    setWordQueue(newQueue);
    const nextWord = newQueue[0];
    updateOptionsFor(nextWord, pool);
    spawnMeteor(nextWord, currentCount);
  };

  // 攔截 UFO 彩蛋處理 (+5分 + 當前連擊加成)
  const handleUfoSuccess = () => {
    soundEngine.combo(3);
    const ufoBonus = Math.max(0, comboRef.current - 1);
    const total = 5 + ufoBonus;

    setMyScore(s => {
      const next = s + total;
      broadcastMyStats({ score: next });
      return next;
    });

    showNotice(`🛸 攔截外星幽浮！+5 ${ufoBonus > 0 ? `(+${ufoBonus} 連擊加成)` : ''}`, 'success');
  };

  // 離線清理 (iPad 關閉分頁、滑掉 App、切換背景防幽靈連線)
  useEffect(() => {
    const handlePageExit = () => {
      if (channelRef.current) {
        try {
          if (channelRef.current.untrack) channelRef.current.untrack();
          supabase.removeChannel(channelRef.current);
        } catch (e) {}
      }
    };
    window.addEventListener('beforeunload', handlePageExit);
    window.addEventListener('pagehide', handlePageExit);
    return () => {
      window.removeEventListener('beforeunload', handlePageExit);
      window.removeEventListener('pagehide', handlePageExit);
      handlePageExit();
    };
  }, []);

  // ── 畫面 1：全校三大限定擂台大廳 (Arena Selection) ──
  if (view === 'menu') {
    return (
      <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden text-white font-sans">
        {/* 電影級多人連線競技場海報背景 */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
          <img
            src={POSTER_BATTLE}
            alt="Multiplayer Live Battle Arena"
            className="w-full h-full object-cover object-center brightness-[0.45] contrast-[1.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-purple-950/35 to-slate-950/95 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-4 animate-fadeIn pb-14">
          <div className="flex items-center justify-between mb-4">
            <Button3D variant="slate" size="sm" onClick={onBack} icon={ArrowLeft}>
              {t.backLobby}
            </Button3D>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setProbeCounter(c => c + 1)}
                disabled={isProbing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-purple-500/40 text-purple-200 text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95"
                title="重新檢查三大擂台即時狀態"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProbing ? 'animate-spin text-purple-400' : 'text-purple-400'}`} />
                <span>{isProbing ? '探測中...' : '探測擂台'}</span>
              </button>
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-200 text-xs font-black shadow-lg shadow-purple-500/20">
                <Swords className="w-4 h-4 text-purple-400" />
                <span>全校三大限定即時對戰擂台</span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 mb-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.2)] text-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-pink-600/20 blur-3xl pointer-events-none" />

            <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-pink-200 to-rose-200 font-heading mb-1 drop-shadow-[0_2px_10px_rgba(217,70,239,0.7)]">
              ⚔️ 星際連線死鬥競技場
            </h2>
            <p className="text-[11px] sm:text-xs font-bold text-purple-200/80 max-w-xl mx-auto mb-3">
              全校最多同時開放 3 組擂台（每組 2~4 人），跨載具秒速連線！連對 3 題發動突襲赤紅隕石，連對 5 題施加重力壓制！
            </p>

            {/* 兩欄並排：左側暱稱輸入、右側 4 碼 PIN 快速加入 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-2xl mx-auto">
              {/* 戰鬥暱稱 */}
              <div className="relative">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="輸入戰鬥暱稱 (例: 501小明)"
                  className="w-full py-2 px-3 rounded-xl border border-purple-400/50 bg-slate-900/90 text-center font-black text-xs sm:text-sm text-white placeholder-purple-300/40 outline-none focus:border-pink-500 pr-14 shadow-inner"
                />
                {playerName && (
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('wutai_player_name');
                      setPlayerName('');
                    }}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-lg text-[10px] font-black bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-400/40 cursor-pointer"
                    title="切換其他同學"
                  >
                    換人
                  </button>
                )}
              </div>

              {/* 4 碼 PIN 快速輸入加入區 */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleQuickJoinByPin();
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  type="text"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="輸入 4 碼 PIN"
                  className="flex-1 py-2 px-2.5 rounded-xl border border-purple-400/40 bg-slate-950 text-center font-mono font-black text-xs sm:text-sm tracking-wider text-pink-300 placeholder-purple-300/40 outline-none focus:border-pink-400"
                />
                <Button3D
                  type="submit"
                  variant="rose"
                  size="sm"
                  className="shrink-0 whitespace-nowrap shadow-md shadow-rose-500/25"
                >
                  🚀 加入
                </Button3D>
              </form>
            </div>

            {errorMsg && (
              <div className="max-w-md mx-auto mt-2.5 p-2 rounded-xl bg-rose-950/80 border border-rose-500/60 text-xs font-black text-rose-300 flex items-center justify-center gap-1.5 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* ── 🎯 連線對戰出題範圍整備控制台 (與單字冒險館全面連動) ── */}
          <div className="mb-4 p-3.5 sm:p-4 rounded-3xl bg-slate-900/90 border-2 border-indigo-500/40 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-xl shadow-inner shrink-0 text-indigo-300">
                  🎯
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-indigo-300 tracking-wider">
                      BATTLE VOCABULARY SCOPE
                    </span>
                    <span className="text-[9px] font-black px-2 py-0.2 rounded-full bg-emerald-500 text-stone-950 shadow-sm">
                      ● 即時連動單字範圍
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-white font-heading">
                    出題範圍：<span className="text-amber-400 font-extrabold">{currentScopeInfo.title}</span>
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="px-2.5 py-1 rounded-xl bg-black/50 border border-white/10 text-xs font-mono font-black text-emerald-400 shrink-0">
                  {currentScopeInfo.count} 個對戰單字
                </span>
                <Button3D
                  variant="amber"
                  size="sm"
                  onClick={() => {
                    soundEngine.click();
                    setModalBookId(currentScopeInfo.bookId || '1');
                    setIsScopeModalOpen(true);
                  }}
                  className="whitespace-nowrap shadow-md cursor-pointer text-xs"
                >
                  ⚙️ 更換單元範圍
                </Button3D>
              </div>
            </div>

            {/* 秒選冊次快速按鈕列 (Book 1 ~ 8 + 低年級字母) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-white/10">
              <span className="text-[10px] font-bold text-slate-400 shrink-0 mr-1 hidden sm:inline">
                秒選冊次：
              </span>
              {BATTLE_BOOKS.map((tab) => {
                const isActive = currentScopeInfo.bookId === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleQuickSelectBook(tab.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer flex items-center gap-1 border ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 border-amber-300 shadow-md scale-105 font-extrabold'
                        : 'bg-black/50 text-slate-300 border-white/10 hover:border-white/30 hover:bg-slate-800'
                    }`}
                  >
                    <span>{tab.short}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 三大擂台狀態卡 (🔴 烈焰擂台、🟢 翡翠擂台、🔵 星空擂台) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FIXED_ARENAS.map((arena) => {
              const state = arenaStates[arena.id] || { count: 0, isBattling: false, hostName: '', playerNames: [] };
              const isEmpty = (state.count === 0 || state.isGhost) && !state.isBattling;
              const isWaiting = !state.isGhost && state.count > 0 && state.count < 4 && !state.isBattling;
              const isFullOrBattling = !state.isGhost && (state.isBattling || state.count >= 4);

              const isEmptyDisabled = false;

              return (
                <div
                  key={arena.id}
                  className={`p-5 rounded-3xl flex flex-col justify-between border-2 transition-all relative overflow-hidden backdrop-blur-md shadow-2xl ${
                    isEmptyDisabled
                      ? 'border-slate-800 bg-slate-950/70 opacity-60 grayscale-[50%]'
                      : isFullOrBattling
                        ? `opacity-85 ${arena.cardBg} border-slate-700`
                        : `${arena.cardBg} ${arena.cardGlow} hover:scale-[1.02]`
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className={`font-heading font-black text-lg block ${arena.accentText}`}>
                        {arena.name}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">
                        {arena.enName}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-slate-900/90 border border-white/15 text-slate-200">
                      PIN: {arena.code}
                    </span>
                  </div>

                  <div className="my-1.5 text-[11px] font-bold text-slate-300/90 text-center py-1 px-2 rounded-xl bg-black/40 border border-white/10">
                    {arena.tagline}
                  </div>

                  <div className="my-3 min-h-[85px] flex flex-col justify-center">
                    {isEmpty && (
                      isEmptyDisabled ? (
                        <div className="text-center">
                          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-black mb-1 border border-slate-700">
                            <Lock className="w-3.5 h-3.5" /> 需選單元方可開房
                          </div>
                          <p className="text-[11px] font-bold text-slate-400 mt-1">
                            未在首頁勾選單元，無法建立新房間。請加入已建立之房間或回首頁勾選。
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          {state.isGhost ? (
                            <div>
                              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-xs font-black mb-1 shadow-sm">
                                <Sparkles className="w-3.5 h-3.5" /> 幽靈已釋出 (可直接開立)
                              </div>
                              <p className="text-xs font-bold text-slate-300">前場已結算完畢或逾時，點擊下方即可立即開立新局！</p>
                            </div>
                          ) : (
                            <div>
                              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs font-black mb-1 shadow-sm">
                                <CheckCircle2 className="w-3.5 h-3.5" /> 空房可開立
                              </div>
                              <p className="text-xs font-bold text-slate-300">目前尚無同學使用，點下方開立擂台</p>
                            </div>
                          )}
                        </div>
                      )
                    )}

                    {isWaiting && (
                      <div className="text-center">
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-black mb-1">
                          <Users className="w-3.5 h-3.5" /> 等待加入中 ({state.count}/4 人)
                        </div>
                        <p className="text-xs font-bold text-slate-200 mt-1">
                          房主：<strong className="text-amber-300">{state.hostName}</strong>
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          成員：{state.playerNames.join(', ')}
                        </p>
                      </div>
                    )}

                    {isFullOrBattling && (
                      <div className="text-center">
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-black mb-1">
                          <Lock className="w-3.5 h-3.5" /> 激戰進行中 (已鎖定)
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 mt-1">
                          對戰中：{state.playerNames.slice(0, 4).join('、')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    {isConnecting === arena.id ? (
                      <Button3D variant="slate" size="md" disabled className="w-full">
                        <RefreshCw className="w-4 h-4 animate-spin inline mr-1" />
                        連線確認中...
                      </Button3D>
                    ) : isEmpty ? (
                      isEmptyDisabled ? (
                        <Button3D
                          variant="slate"
                          size="md"
                          disabled
                          className="w-full cursor-not-allowed opacity-50"
                        >
                          🔒 未選單元無法開立
                        </Button3D>
                      ) : (
                        <Button3D
                          variant={arena.btnVariant || 'rose'}
                          size="md"
                          onClick={() => handleHostArena(arena)}
                          className="w-full shadow-lg"
                        >
                          開立此擂台
                        </Button3D>
                      )
                    ) : isWaiting ? (
                      <Button3D
                        variant="amber"
                        size="md"
                        onClick={() => handleJoinArena(arena)}
                        className="w-full shadow-lg"
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
                </div>
              );
            })}
          </div>

          {Object.values(arenaStates).every(s => s.isBattling || s.count >= 4) && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-950/70 border-2 border-amber-400/50 text-center animate-fadeIn">
              <p className="text-sm font-black text-amber-300 mb-1">
                ⚔️ 全校三大擂台目前全數客滿激戰中 (12/12 滿員)！
              </p>
              <p className="text-xs font-bold text-amber-400/80">
                建議同學先前往【星空防衛戰】單人模式熱身，稍後點擊右上角「探測擂台」搶進！
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── 畫面 2：擂台等待備戰室 (Waiting Room - 100dvh iPad 單頁全景自適應) ──
  if (view === 'lobby') {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
      window.location.origin + '?join=' + selectedArena.code
    )}`;

    return (
      <div onClick={recordLobbyActivity} className="fixed inset-0 w-full h-[100dvh] flex flex-col justify-between p-2.5 sm:p-3 md:p-4 text-white font-sans overflow-hidden select-none z-10 animate-fadeIn">
        {/* 電影級多人連線競技場海報背景 */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
          <img
            src={POSTER_BATTLE}
            alt="Multiplayer Live Battle Arena"
            className="w-full h-full object-cover object-center brightness-[0.4] contrast-[1.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-purple-950/40 to-slate-950/95 backdrop-blur-[1px]" />
        </div>

        {/* ── 頂部 HUD 狀態導覽列 ── */}
        <header className="relative z-20 w-full max-w-5xl mx-auto flex items-center justify-between pb-2 border-b border-white/15 shrink-0">
          <div className="flex items-center gap-2">
            <span className={`text-xs sm:text-sm font-black px-3 py-1 rounded-full ${
              selectedArena.color === 'rose'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : selectedArena.color === 'emerald'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
            }`}>
              {selectedArena.name} 備戰中
            </span>
            <span className="font-mono text-xs font-black text-slate-300 bg-slate-900/80 px-2.5 py-0.5 rounded-lg border border-white/10">
              {players.length}/4 人
            </span>
            <span className="font-mono text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-lg border border-amber-500/40 hidden sm:inline-flex items-center gap-1 shadow-sm">
              ⏳ 閒置釋出：{Math.floor(lobbyIdleCountdown / 60)}:{String(lobbyIdleCountdown % 60).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-300 font-bold hidden sm:inline">
              PIN 碼直接加入：
            </span>
            <span className="font-mono text-base sm:text-lg font-black text-pink-300 tracking-wider bg-purple-950/80 px-2.5 py-0.5 rounded-lg border border-purple-400/50">
              {selectedArena.code}
            </span>
            <Button3D variant="slate" size="sm" onClick={handleLeaveRoom} className="ml-2">
              退出擂台
            </Button3D>
          </div>
        </header>

        {/* ── 核心雙欄舞台 (iPad 768px+ 與電腦水平並排，手機垂直並排，嚴格自適應 100dvh) ── */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex-1 min-h-0 my-2 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 items-stretch overflow-hidden">
          
          {/* ════ 左欄：PIN 碼、QR 碼與對決模式指定 ════ */}
          <div className="p-3 sm:p-4 rounded-3xl bg-slate-950/85 backdrop-blur-md border-2 border-purple-500/40 shadow-xl flex flex-col justify-between overflow-y-auto">
            
            {/* 上半部：大型 PIN 與掃碼區 */}
            <div className="flex items-center justify-between gap-3 bg-purple-950/40 p-2.5 sm:p-3 rounded-2xl border border-purple-500/30">
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold text-purple-300">房間 PIN 碼</span>
                <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-purple-100 to-cyan-200 font-mono tracking-widest my-0.5 drop-shadow">
                  {selectedArena.code}
                </span>
                <span className="text-[10px] text-slate-300 font-medium">
                  iPad 相機直接掃碼，或於首頁輸入 PIN 碼立即加入！
                </span>
              </div>

              {/* QR Code 緊湊高清晰框 */}
              <div className="p-1.5 bg-white rounded-xl shadow-md border border-purple-300/80 shrink-0 text-center">
                <img
                  src={qrUrl}
                  alt="掃描加入房間"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain mx-auto"
                />
                <span className="text-[9px] font-black text-slate-700 block mt-0.5">iPad相機掃碼</span>
              </div>
            </div>

            {/* 中半部：對決遊戲模式選擇 (房主可切換，成員同步) */}
            <div className="my-2 text-left">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black text-slate-200 flex items-center gap-1">
                  <Gamepad2 className="w-3.5 h-3.5 text-pink-400" /> 對決模式：
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {isHost ? '👑 房主點擊切換' : '同步房主指定中'}
                </span>
              </div>

              {isHost ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectGameMode('meteor')}
                    className={`p-2 rounded-xl border-2 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      gameMode === 'meteor'
                        ? 'border-pink-500 bg-pink-500/25 text-pink-200 shadow-[0_0_15px_rgba(236,72,153,0.3)] ring-1 ring-pink-400'
                        : 'border-slate-800 bg-slate-900/70 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-lg">☄️</span>
                    <div className="text-left">
                      <div>星空防衛戰</div>
                      <div className="text-[9px] font-normal text-slate-400">3D/2D 搶答突襲</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectGameMode('memory')}
                    className={`p-2 rounded-xl border-2 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      gameMode === 'memory'
                        ? 'border-purple-500 bg-purple-500/25 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-1 ring-purple-400'
                        : 'border-slate-800 bg-slate-900/70 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-lg">🃏</span>
                    <div className="text-left">
                      <div>星際翻牌</div>
                      <div className="text-[9px] font-normal text-slate-400">功能道具牌對決</div>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl border border-purple-500/30 bg-slate-900/80 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                    {gameMode === 'meteor' ? '☄️ 星空防衛戰 (3D/2D 搶答突襲)' : '🃏 星際記憶翻牌 (八大功能牌對決)'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-purple-300">
                    同步房主中
                  </span>
                </div>
              )}
            </div>

            {/* 下半部：出題單元範圍指示 */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/30 flex items-center justify-between text-left">
              <span className="text-xs font-black text-slate-300">
                📚 出題範圍：
              </span>
              <span className="text-xs font-bold text-pink-400 truncate max-w-[220px]">
                {battleUnitsRef.current && battleUnitsRef.current.length > 0
                  ? `${battleUnitsRef.current.slice(0, 3).join(', ')}${battleUnitsRef.current.length > 3 ? ` 等共 ${battleUnitsRef.current.length} 單元` : ''}`
                  : '全部單元題庫'}
              </span>
            </div>

          </div>

          {/* ════ 右欄：參賽成員名單與開戰按鈕 ════ */}
          <div className="p-3 sm:p-4 rounded-3xl bg-slate-950/85 backdrop-blur-md border-2 border-purple-500/40 shadow-xl flex flex-col justify-between overflow-hidden">
            
            {/* 上半部：成員清單 */}
            <div className="flex-1 min-h-0 flex flex-col justify-start">
              <div className="flex items-center justify-between text-xs font-black text-slate-300 pb-1.5 mb-1.5 border-b border-white/10 shrink-0">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>參賽成員 ({players.length}/4 人)</span>
                </span>
                <span className="text-[11px] text-slate-400">至少 2 人即可開戰</span>
              </div>

              {/* 成員列表 (緊湊且不被切掉) */}
              <div className="space-y-1.5 overflow-y-auto pr-1 flex-1">
                {players.map((p, idx) => (
                  <div
                    key={p.deviceId || idx}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-white/10 flex items-center justify-between font-black text-xs sm:text-sm text-slate-100 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-purple-300 text-[11px] flex items-center justify-center font-mono border border-purple-500/40 shrink-0">
                        {idx + 1}
                      </span>
                      <span className="truncate max-w-[140px] sm:max-w-[180px]">
                        {p.name} {p.deviceId === myDeviceIdRef.current ? '(你)' : ''}
                      </span>
                      {p.isHost && (
                        <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/40 shrink-0">
                          👑 房主
                        </span>
                      )}
                    </div>

                    {isHost && p.deviceId !== myDeviceIdRef.current && (
                      <button
                        type="button"
                        onClick={() => handleKickPlayer(p.deviceId, p.name)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-black bg-rose-950/80 hover:bg-rose-900 text-rose-300 transition-all cursor-pointer active:scale-95 border border-rose-500/40 shrink-0"
                        title={`剔除 ${p.name}`}
                      >
                        <UserX className="w-3 h-3" />
                        <span>剔除</span>
                      </button>
                    )}
                  </div>
                ))}

                {/* 顯示空位等待插槽 */}
                {Array.from({ length: Math.max(0, 4 - players.length) }).map((_, emptyIdx) => (
                  <div
                    key={`empty-${emptyIdx}`}
                    className="p-2 rounded-xl border border-dashed border-white/15 bg-slate-950/40 flex items-center justify-center text-[11px] font-bold text-slate-500 gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-pulse" />
                    <span>等待其他同學加入...</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 下半部：開戰控制按鈕 */}
            <div className="pt-2 border-t border-white/10 shrink-0 mt-2">
              {isHost ? (
                <Button3D
                  variant={players.length >= 2 ? "rose" : "slate"}
                  size="md"
                  disabled={players.length < 2}
                  onClick={handleStartGameBroadcast}
                  className="w-full shadow-lg shadow-rose-500/25"
                  icon={Play}
                >
                  {players.length < 2
                    ? '等待同學加入 (至少 2 人)...'
                    : players.length === 4
                      ? '🚀 開戰！(4 人滿員決戰)'
                      : `🚀 開戰！(${players.length} 人即刻開局)`
                  }
                </Button3D>
              ) : (
                <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-center animate-pulse">
                  <p className="text-xs font-black text-pink-300">
                    ⏳ 等待房主按下開戰 (目前 {players.length} 人已就緒)...
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* ── 底部提示條 ── */}
        <footer className="relative z-20 w-full text-center py-1 shrink-0 text-[10px] text-slate-400 font-bold">
          霧臺國小星際連線擂台 • 自動心跳保活 • 支援 2~4 人跨載具秒速連線
        </footer>
      </div>
    );
  }

  // ── 畫面 3：多人星際大對決終局榮譽榜 (Podium Settlement) ──
  if (view === 'result') {
    return (
      <div className="relative min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-4 text-white font-sans overflow-hidden animate-fadeIn">
        {/* 電影級多人連線競技場海報背景 */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
          <img
            src={POSTER_BATTLE}
            alt="Multiplayer Live Battle Arena"
            className="w-full h-full object-cover object-center brightness-[0.4] contrast-[1.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-purple-950/40 to-slate-950/95 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 max-w-xl w-full max-h-[92vh] overflow-y-auto text-center p-4 sm:p-6 md:p-8 rounded-3xl bg-slate-950/90 backdrop-blur-md border-2 border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.35)]">
          <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-2 animate-bounce drop-shadow-[0_0_25px_rgba(251,191,36,0.7)]" />
          <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 font-heading mb-1 drop-shadow">
            星際死鬥結算榮譽榜
          </h2>
          <p className="text-xs sm:text-sm font-bold text-purple-200/80 mb-6">
            生還者殘存愛心每顆重賞 <strong className="text-emerald-400 font-black">+50 分</strong>！
          </p>
          {/* 對戰宇宙金幣獎勵便當條 */}
          {battleReward && (
            <div className="mb-4 p-3 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-between text-left">
              <div className="flex items-center gap-2">
                <span className="text-xl">🪙</span>
                <div>
                  <span className="text-xs sm:text-sm font-black text-amber-300">
                    {battleReward.title}獎勵：+{battleReward.coins} 宇宙金幣！
                  </span>
                  <p className="text-[10px] text-amber-200/80">
                    {isLoggedIn ? '已存入勇士探險通行證！' : '登入通行證可永久保存金幣！'}
                  </p>
                </div>
              </div>
            </div>
          )}


          {/* 榮譽排列表 */}
          <div className="space-y-3 mb-8">
            {finalLeaderboard.map((item, idx) => {
              const isFirst = idx === 0;
              const isSecond = idx === 1;
              const isThird = idx === 2;
              const isMe = item.deviceId === myDeviceIdRef.current;

              let rankBadge = (
                <span className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 font-black text-xs flex items-center justify-center border border-white/10">
                  #{idx + 1}
                </span>
              );

              if (isFirst) {
                rankBadge = (
                  <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg border border-yellow-200">
                    🥇
                  </span>
                );
              } else if (isSecond) {
                rankBadge = (
                  <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-900 font-black text-sm flex items-center justify-center shadow-md border border-slate-300">
                    🥈
                  </span>
                );
              } else if (isThird) {
                rankBadge = (
                  <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 text-white font-black text-sm flex items-center justify-center shadow-md border border-amber-600">
                    🥉
                  </span>
                );
              }

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl flex items-center justify-between border-2 transition-all ${
                    isFirst
                      ? 'bg-amber-500/20 border-amber-400/90 shadow-[0_0_25px_rgba(251,191,36,0.35)]'
                      : isMe
                      ? 'bg-cyan-500/15 border-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                      : 'bg-slate-900/80 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {rankBadge}
                    <div className="text-left">
                      <div className="font-black text-sm sm:text-base text-white flex items-center gap-1.5">
                        <span>{item.name}</span>
                        {isMe && (
                          <span className="px-1.5 py-0.2 rounded bg-cyan-500 text-white text-[10px] font-black">
                            你
                          </span>
                        )}
                        {isFirst && (
                          <Crown className="w-4 h-4 text-amber-400 inline animate-bounce" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300/80 mt-0.5">
                        {item.lives > 0 ? (
                          <span className="text-rose-400 font-black flex items-center">
                            {'❤️'.repeat(item.lives)} ({item.lives}心生還 +{item.heartBonus})
                          </span>
                        ) : (
                          <span className="text-slate-400 font-bold flex items-center gap-0.5">
                            <Skull className="w-3 h-3 text-slate-400" /> 中途陣亡
                          </span>
                        )}
                        <span>• 擊落 {item.meteorsDestroyed} 題</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-black text-lg sm:text-xl text-amber-300">
                      {item.finalScore}
                    </span>
                    <span className="text-xs font-bold text-slate-400 block">
                      (基礎 {item.rawScore})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs font-bold text-purple-200/90 mb-3 flex items-center justify-center gap-1.5 animate-pulse">
            <span>⏳ 系統將於</span>
            <strong className="font-mono font-black text-amber-400 text-sm px-2 py-0.5 rounded bg-black/40 border border-amber-400/30 shadow-inner">
              {resultCountdown}
            </strong>
            <span>秒後自動退出並釋出擂台...</span>
          </p>

          <Button3D variant="rose" size="lg" onClick={handleLeaveRoom} className="w-full shadow-lg shadow-rose-500/30">
            返回擂台大廳
          </Button3D>
        </div>
      </div>
    );
  }

  // ── 畫面 4：3D 地球防衛多人激戰中 (Playing) ──
  return (
    <div className="fixed inset-0 z-50 bg-[#060814] flex flex-col justify-between p-2 sm:p-4 select-none overflow-hidden touch-none font-sans">
      {/* ── 頂部 HUD：本人數據 + 對手微型戰況卡 + 控制開關 ── */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between gap-2 flex-shrink-0 z-30">
        {/* 左側：退出按鈕與愛心 */}
        <div className="flex items-center gap-2">
          <Button3D variant="slate" size="sm" onClick={handleLeaveRoom} icon={ArrowLeft} className="!p-1.5 sm:!p-2">
            <span className="hidden sm:inline">退出</span>
          </Button3D>

          {/* 本人愛心條 */}
          <div className="flex items-center gap-0.5 px-2 py-1 rounded-xl bg-slate-900/80 border border-slate-700 shadow-md">
            {[1, 2, 3].map((heartIndex) => (
              <Heart
                key={heartIndex}
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                  heartIndex <= myLives
                    ? 'text-rose-500 fill-rose-500 animate-pulse'
                    : 'text-slate-600'
                }`}
              />
            ))}
          </div>

          {/* 本人防線位移指標 */}
          <div className={`px-2 py-1 rounded-xl text-xs font-black font-mono border ${
            horizonOffset > 0
              ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
              : horizonOffset < 0
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
              : 'bg-slate-900/80 border-slate-700 text-slate-300'
          }`}>
            防線 {horizonOffset > 0 ? `+${horizonOffset}%` : `${horizonOffset}%`}
          </div>
        </div>

        {/* 中央：對手微型狀態列 (即時戰況雷達) */}
        <div className="hidden md:flex items-center gap-1.5 max-w-md overflow-x-auto py-1 scrollbar-none">
          {players.filter(p => p.deviceId !== myDeviceIdRef.current).map((opp, idx) => (
            <div
              key={idx}
              className={`px-2 py-1 rounded-xl text-[11px] font-black border flex items-center gap-1.5 transition-all ${
                opp.isDead
                  ? 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60'
                  : 'bg-slate-900/90 border-slate-700 text-slate-200'
              }`}
            >
              <span className="truncate max-w-[65px]">{opp.name}</span>
              <span>
                {opp.isDead ? '💀' : '❤️'.repeat(opp.lives !== undefined ? opp.lives : 3)}
              </span>
              <span className="text-cyan-400 font-mono">{opp.score || 0}分</span>
            </div>
          ))}
        </div>

        {/* 右側：分數、2D/3D、全螢幕 */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {myCombo >= 1 && myCombo < 3 && (
            <div className="px-2 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs shadow-md animate-bounce flex items-center gap-1">
              <span>{myCombo}x 🔥</span>
            </div>
          )}

          <div className="px-2.5 sm:px-3.5 py-1 rounded-xl bg-cyan-600 text-white font-black text-xs sm:text-sm font-mono shadow-md">
            {myScore}分
          </div>

          <button
            onClick={() => setRenderMode(m => m === '3d' ? '2d' : '3d')}
            className="p-1 sm:p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-black flex items-center gap-1"
            title="切換 3D / 2D"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>{renderMode === '3d' ? '3D' : '2D'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1 sm:p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-black"
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

      {/* ── 飄浮通知橫幅 (受到壓制、發動空襲等提示，置於頂部微浮層絕不覆蓋題目) ── */}
      {noticeBanner && (
        <div className="fixed top-14 sm:top-16 inset-x-0 mx-auto w-fit max-w-[90vw] z-50 animate-fadeIn pointer-events-none">
          <div className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-black shadow-2xl flex items-center gap-2 border ${
            noticeBanner.type === 'danger'
              ? 'bg-rose-900/95 border-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.8)]'
              : noticeBanner.type === 'success'
              ? 'bg-emerald-900/95 border-emerald-500 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.8)]'
              : 'bg-amber-900/95 border-amber-500 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.8)]'
          }`}>
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>{noticeBanner.text}</span>
          </div>
        </div>
      )}

      {/* ── 目標單字科幻 HUD 鎖定儀 ── */}
      {currentMeteor && !isDead && (
        <div className="w-full max-w-sm sm:max-w-md mx-auto flex items-center justify-center gap-2 px-3 py-1 my-0.5 sm:my-1 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 text-xs font-black flex-shrink-0 z-20">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>鎖定目標：</span>
          <span className="text-white text-sm font-black tracking-wide">
            {currentMeteor.word.zh}
          </span>
          {myMeteorsDestroyed >= 30 && (
            <span className="ml-1 px-1.5 py-0.5 rounded bg-rose-500/80 text-[10px] text-white font-black animate-pulse">
              超頻極速
            </span>
          )}
        </div>
      )}

      {/* ── 隕石戰鬥核心畫布區域 (flex-1 min-h-0) ── */}
      <div className="flex-1 min-h-0 w-full max-w-4xl mx-auto relative mb-1.5 sm:mb-2 flex items-center justify-center overflow-hidden">
        {/* 右側氣球灌氣連擊階梯顯示 (專屬右側空域 74%~96%，3連對以上展開) */}
        <RightComboDisplay combo={myCombo} />

        {/* 突襲赤紅 / 烈焰大隕石 mini-game (專屬左側空域 10%~25%，絕不遮蔽中央單字與右側連擊！) */}
        {activeRaid && (
          <EmergencyRaidMeteor
            raidData={activeRaid}
            onDefended={handleRaidDefended}
            onImpact={handleRaidImpact}
          />
        )}

        {/* 陣亡觀戰彈窗 (可選擇留在房間觀戰或提早退出) */}
        {isDead && !hideDeadModal && (
          <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-fadeIn border-2 border-rose-600/50">
            <Skull className="w-16 h-16 text-rose-500 mb-2 animate-bounce" />
            <h3 className="text-3xl font-black text-white font-heading mb-1">防衛線已失守！</h3>
            <p className="text-sm font-bold text-slate-300 mb-4 max-w-md">
              你的 3 顆愛心已耗盡，目前處於【觀戰模式】。同房同學分出勝負後將自動為全房進行頒獎結算！
            </p>

            <div className="p-3 mb-6 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 text-xs font-black flex items-center gap-4">
              <span>得分：<strong className="text-cyan-400 font-mono text-base">{myScore}</strong> 分</span>
              <span>擊落：<strong className="text-amber-400 font-mono text-base">{myMeteorsDestroyed}</strong> 題</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setHideDeadModal(true)}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                觀看星際戰場
              </button>
              <button
                onClick={handleLeaveRoom}
                className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-black text-sm transition-transform active:scale-95 cursor-pointer"
              >
                提早退出大廳
              </button>
            </div>
          </div>
        )}

        {/* 觀戰標籤 (已收合陣亡彈窗時常駐角落) */}
        {isDead && hideDeadModal && (
          <div className="absolute top-2 left-2 z-40 px-3 py-1 rounded-full bg-rose-950/90 border border-rose-500 text-rose-300 text-xs font-black flex items-center gap-1.5 shadow-lg">
            <Skull className="w-3.5 h-3.5 text-rose-400" />
            <span>觀戰中 (得分: {myScore}分)</span>
            <button
              onClick={() => setHideDeadModal(false)}
              className="ml-1 text-[10px] text-cyan-300 underline cursor-pointer"
            >
              選單
            </button>
          </div>
        )}

        {/* 3D WebGL 隕石畫布 */}
        {renderMode === '3d' ? (
          <div className="w-full h-full relative">
            <MeteorCanvas3D
              currentMeteor={isDead ? null : currentMeteor}
              subMode="zh-en"
              isExploding={isExploding}
              laserTrigger={laserTrigger}
              questionIndex={myMeteorsDestroyed}
              onUfoSuccess={handleUfoSuccess}
              horizonOffset={horizonOffset}
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
            <MeteorEasterEggs2D onUfoSuccess={handleUfoSuccess} />

            {/* 墜落隕石 (中心 44%~56% 航道) */}
            {currentMeteor && !isDead && (
              <div
                ref={meteor2DRef}
                className="absolute -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none"
                style={{ left: `${currentMeteor.x}%`, top: '-10%' }}
              >
                {isExploding ? (
                  <div className="text-5xl animate-bounce">💥</div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Flame className="w-8 h-8 text-amber-500 -mb-2 animate-pulse" />
                    <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-b from-amber-400 to-rose-600 text-white font-black text-lg sm:text-2xl shadow-xl border-2 border-yellow-200">
                      {currentMeteor.word.zh}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 地表防禦警戒線 (隨 horizonOffset 微調) */}
            <div
              className="absolute inset-x-0 h-4 bg-gradient-to-t from-indigo-500/30 to-transparent border-t border-indigo-400/40 transition-all duration-300"
              style={{ bottom: `${Math.max(0, horizonOffset * 0.5)}%` }}
            />
          </div>
        )}
      </div>

      {/* ── 下方 4 個全息能量戰術選項按鈕 ── */}
      <div className="w-full max-w-4xl mx-auto grid grid-cols-2 gap-2 sm:gap-3 flex-shrink-0 z-20">
        {options.map((opt) => (
          <button
            key={opt.id}
            disabled={isDead}
            onClick={() => handleOptionClick(opt)}
            className={`group relative p-3 sm:p-4 rounded-xl sm:rounded-2xl font-black text-base sm:text-xl transition-all duration-150 active:scale-95 text-center cursor-pointer select-none overflow-hidden ${
              isDead
                ? 'bg-slate-900/40 text-slate-600 border border-slate-800 cursor-not-allowed'
                : 'bg-slate-900/90 text-cyan-100 hover:text-white border-2 border-cyan-500/50 hover:border-cyan-400 shadow-[0_4px_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]'
            }`}
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
