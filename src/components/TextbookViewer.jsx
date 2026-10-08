import React, { useState, useRef } from 'react';
import {
  BookOpen,
  ArrowLeft,
  Headphones,
  Maximize2,
  Minimize2,
  ExternalLink,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Send,
  X,
  Layers,
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';

// 課本大綱目錄（對應 Heyzine 48 頁完整教材）
const CHAPTERS = [
  { id: 'cover', titleZh: '封面', titleEn: 'Cover', page: 1 },
  { id: 'alphabet', titleZh: '字母表', titleEn: 'Alphabet', page: 4 },
  { id: 'u1', titleZh: 'U1 招呼與自我介紹', titleEn: 'U1 Hello! This Is Me', page: 5 },
  { id: 'u2', titleZh: 'U2 我的家庭成員', titleEn: 'U2 Meet My Family', page: 13 },
  { id: 'u3', titleZh: 'U3 教室與學校文具', titleEn: 'U3 In My Classroom', page: 21 },
  { id: 'u4', titleZh: 'U4 身體部位與情緒', titleEn: 'U4 Body & Feelings', page: 29 },
  { id: 'u5', titleZh: 'U5 數字、顏色與形狀', titleEn: 'U5 Numbers, Colors', page: 37 },
  { id: 'review', titleZh: '期末挑戰與單字表', titleEn: 'Final Challenge', page: 45 },
  { id: 'audio-hub', titleZh: '🎧 聽力中心', titleEn: 'Audio Hub', page: 47 },
];

// 預設各單元聽力測驗題庫（純文字腳本，0 網路流量，即時語音朗讀）
const DEFAULT_LISTENING_DATA = {
  u1: [
    { id: 1, title: '第 1 題：打招呼', script: "Hello! Good morning. What's your name?", answer: 'My name is Amy.' },
    { id: 2, title: '第 2 題：問候情境', script: 'How are you today? I am fine, thank you.', answer: "I'm great!" },
    { id: 3, title: '第 3 題：道別用語', script: 'Goodbye, see you tomorrow!', answer: 'See you later!' },
  ],
  u2: [
    { id: 1, title: '第 1 題：認識家人', script: 'Who is he? He is my father. He is a brave hunter.', answer: 'Father / 父親' },
    { id: 2, title: '第 2 題：介紹母親', script: 'This is my mother. She weaves beautiful traditional clothes.', answer: 'Mother / 母親' },
    { id: 3, title: '第 3 題：兄弟姊妹', script: 'Is that your sister? Yes, she is.', answer: 'Sister / 姊妹' },
  ],
  u3: [
    { id: 1, title: '第 1 題：教室物品', script: 'Where is my pencil? It is on the desk.', answer: 'On the desk / 在桌上' },
    { id: 2, title: '第 2 題：文具指令', script: 'Open your English book and take out your eraser.', answer: '打開課本與橡皮擦' },
    { id: 3, title: '第 3 題：課堂對話', script: 'Can I borrow your ruler, please? Here you are.', answer: '借尺 / Here you are' },
  ],
  u4: [
    { id: 1, title: '第 1 題：身體指令', script: 'Touch your nose and blink your eyes.', answer: '摸鼻子並眨眼睛' },
    { id: 2, title: '第 2 題：表達感受', script: 'Are you happy today? Yes, I am very happy!', answer: '開心 (Happy)' },
    { id: 3, title: '第 3 題：生病問候', script: 'What is the matter? My stomach hurts.', answer: '肚子痛' },
  ],
  u5: [
    { id: 1, title: '第 1 題：數數辨識', script: 'Look at the basket! There are five red apples.', answer: '5 顆紅蘋果' },
    { id: 2, title: '第 2 題：顏色辨識', script: 'What color is the sky? The sky is blue and bright.', answer: '藍色 (Blue)' },
    { id: 3, title: '第 3 題：幾何圖形', script: 'Draw a yellow circle and a green triangle.', answer: '黃色圓形與綠色三角形' },
  ],
};

export const TextbookViewer = ({ onBack }) => {
  const { lang } = useI18n();
  const [activePage, setActivePage] = useState(1);
  const [isAudioDrawerOpen, setIsAudioDrawerOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState('u1');
  const [customPrompt, setCustomPrompt] = useState('');
  const [playbackSpeed, setPlaybackSpeed] = useState(0.85); // 預設 0.85x 適合國小英語初學者
  const [isPlayingScript, setIsPlayingScript] = useState(null);
  const iframeRef = useRef(null);

  // 跳轉頁面至指定頁碼
  const handleJumpToPage = (pageNum) => {
    setActivePage(pageNum);
    if (iframeRef.current) {
      iframeRef.current.src = `https://heyzine.com/flip-book/962c488fe3.html#page/${pageNum}`;
    }
  };

  // 使用瀏覽器 Web Speech API 朗讀（純文字合成，0 網路流量）
  const speakText = (text, scriptId = null) => {
    if (!('speechSynthesis' in window)) {
      alert('您的瀏覽器不支援語音合成功能');
      return;
    }
    window.speechSynthesis.cancel(); // 停止先前的朗讀

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;

    setIsPlayingScript(scriptId || 'custom');

    utterance.onend = () => {
      setIsPlayingScript(null);
    };
    utterance.onerror = () => {
      setIsPlayingScript(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // 停止朗讀
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingScript(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full h-[calc(100vh-50px)] max-h-screen bg-slate-950 text-white relative overflow-hidden select-none">
      {/* ── 頂部導覽控制列 (Header Bar) ── */}
      <div className="shrink-0 px-3 py-2 sm:px-5 sm:py-2.5 bg-slate-900/90 backdrop-blur-md border-b border-emerald-500/30 flex items-center justify-between gap-2.5 z-20">
        {/* 左側：返回按鈕與標題 */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onBack}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center gap-1.5 text-xs font-black transition-all active:scale-95 cursor-pointer shrink-0"
            title="返回英語學習宇宙首頁"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">回首頁</span>
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shrink-0 shadow-md">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-black text-emerald-300 font-heading truncate">
                霧臺國小雙語教材 • 互動電子書
              </h2>
              <p className="text-[10px] text-slate-400 hidden sm:block truncate">
                48 頁全彩繪本 • 支援 3D 擬真翻頁與雙指放大檢視
              </p>
            </div>
          </div>
        </div>

        {/* 右側：聽力隨身聽開關與外開按鈕 */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAudioDrawerOpen(!isAudioDrawerOpen)}
            className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer ${
              isAudioDrawerOpen
                ? 'bg-amber-500 text-white border-amber-300'
                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-400/50'
            }`}
            title="開啟聽力測驗語音輔助"
          >
            <Headphones className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="text-[11px] sm:text-xs">
              {isAudioDrawerOpen ? '收合聽力' : '🎧 聽力隨身聽'}
            </span>
          </button>

          <a
            href="https://heyzine.com/flip-book/962c488fe3.html"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1 text-xs font-bold transition-all"
            title="在新視窗獨立全螢幕開啟"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">新分頁</span>
          </a>
        </div>
      </div>

      {/* ── 次級快速章節跳轉導覽列 (Quick Jump Chapter Bar) ── */}
      <div className="shrink-0 px-3 py-1.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none z-10">
        <span className="text-[10px] font-black text-slate-400 shrink-0 flex items-center gap-1 pl-1">
          <Layers className="w-3 h-3 text-emerald-400" />
          <span>章節：</span>
        </span>
        {CHAPTERS.map((chap) => {
          const isActive = activePage === chap.page;
          return (
            <button
              key={chap.id}
              onClick={() => handleJumpToPage(chap.page)}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60'
              }`}
            >
              {chap.titleZh}
            </button>
          );
        })}
      </div>

      {/* ── 核心電子書閱讀區 (Heyzine Fullscreen Iframe) ── */}
      <div className="flex-1 relative w-full h-full p-1.5 sm:p-2 bg-slate-950 flex flex-col min-h-0">
        <iframe
          ref={iframeRef}
          src="https://heyzine.com/flip-book/962c488fe3.html"
          title="霧臺國小自編英語電子教科書"
          allow="autoplay; fullscreen; clipboard-write"
          allowFullScreen
          scrolling="no"
          className="w-full flex-1 rounded-xl sm:rounded-2xl border border-emerald-500/20 shadow-2xl bg-slate-900"
        />

        {/* ── 🎧 聽力測驗隨身聽滑出抽屜 (Listening Audio Assistant Drawer) ── */}
        {isAudioDrawerOpen && (
          <div className="absolute top-2 right-2 bottom-2 w-[92vw] sm:w-[380px] bg-slate-900/95 backdrop-blur-xl border-2 border-amber-400/60 rounded-2xl shadow-2xl z-30 flex flex-col overflow-hidden animate-slideLeft text-slate-100">
            {/* 抽屜標題 */}
            <div className="px-4 py-3 bg-gradient-to-r from-amber-600/30 to-orange-600/20 border-b border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  🎧
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-amber-300 font-heading">
                    課本聽力測驗隨身聽
                  </h3>
                  <p className="text-[10px] text-amber-200/80">
                    純本機 Web Speech 合成 • 0 網路流量消耗
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  stopSpeaking();
                  setIsAudioDrawerOpen(false);
                }}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 語速調節列 */}
            <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="text-[11px] text-slate-400">朗讀語速：</span>
              <div className="flex items-center gap-1.5">
                {[
                  { label: '🐢 0.75x 慢速', val: 0.75 },
                  { label: '標準 0.9x', val: 0.9 },
                  { label: '🐰 1.0x 正常', val: 1.0 },
                ].map((s) => (
                  <button
                    key={s.val}
                    onClick={() => setPlaybackSpeed(s.val)}
                    className={`px-2 py-0.5 rounded text-[10px] font-black cursor-pointer ${
                      playbackSpeed === s.val
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 單元選擇標籤 */}
            <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {['u1', 'u2', 'u3', 'u4', 'u5'].map((uKey, idx) => (
                <button
                  key={uKey}
                  onClick={() => setSelectedUnit(uKey)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black shrink-0 cursor-pointer ${
                    selectedUnit === uKey
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Unit {idx + 1}
                </button>
              ))}
            </div>

            {/* 題目朗讀清單 */}
            <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
              <div className="text-[11px] font-bold text-amber-300/90 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Unit {selectedUnit.replace('u', '')} 官方聽力範例題：</span>
              </div>

              {(DEFAULT_LISTENING_DATA[selectedUnit] || []).map((q) => {
                const isPlaying = isPlayingScript === `${selectedUnit}-${q.id}`;
                return (
                  <div
                    key={q.id}
                    className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-amber-400/50 transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-200">
                        {q.title}
                      </span>
                      <button
                        onClick={() => {
                          if (isPlaying) {
                            stopSpeaking();
                          } else {
                            speakText(q.script, `${selectedUnit}-${q.id}`);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                          isPlaying
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>停止</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>播放題目</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] font-mono text-emerald-300">
                      🔊 "{q.script}"
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-between">
                      <span>💡 參考解答 / 提示：{q.answer}</span>
                    </div>
                  </div>
                );
              })}

              {/* 自訂聽力語音朗讀區 (老師可輸入任何教材題目隨打隨唸) */}
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-300 flex items-center gap-1">
                    <span>✍️</span> 自訂聽力題目朗讀
                  </span>
                  <span className="text-[10px] text-slate-500">教師手冊題型支援</span>
                </div>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="在此貼上或輸入教師手冊的聽力英文句子，例如：Listen and check: What is in the classroom?"
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <div className="flex items-center justify-end gap-2">
                  {isPlayingScript === 'custom' && (
                    <button
                      onClick={stopSpeaking}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-rose-400 hover:text-white text-xs font-black cursor-pointer"
                    >
                      停止
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (!customPrompt.trim()) return;
                      speakText(customPrompt.trim(), 'custom');
                    }}
                    disabled={!customPrompt.trim()}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-black flex items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>即時發音</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
