import React, { useState, useMemo } from 'react';
import {
  X, Sparkles, Volume2, Package, Layers,
  ShoppingBag, CheckCircle2, Shield, ArrowRight, Heart
} from 'lucide-react';
import { Button3D } from '../../components/ui/Button3D';
import { useStudent } from '../../context/StudentContext';
import { speakEnglish, soundEngine } from '../../services/audio';
import { groupInventoryItems, getItemQuantity } from '../../utils/inventoryHelper';
import { TOWN_ITEMS } from './townData';

const TOTAL_SLOTS = 24; // 24 格精緻多寶格置物槽

export const CurioBackpackModal = ({
  cardTheme = 'dark',
  onClose,
  onOpenShop
}) => {
  const { currentStudent, inventory = [] } = useStudent();
  const [activeTheme, setActiveTheme] = useState(cardTheme);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inspectModalItem, setInspectModalItem] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // 自動聚合摺疊同類道具（同 id 聚合為一格並附帶 count 數量）
  const groupedInventory = useMemo(() => groupInventoryItems(inventory), [inventory]);

  // 學生自訂的多寶格位置對應表 (持久化至 localStorage)
  const [slotLayout, setSlotLayout] = useState(() => {
    try {
      const studentId = currentStudent?.student_id || 'guest';
      const saved = localStorage.getItem(`wutai_curio_layout_${studentId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    // 預設將現有物品（自動摺疊同品後的獨特道具）依序放入前幾個槽位
    const initial = {};
    const grouped = groupInventoryItems(inventory || []);
    grouped.forEach((item, idx) => {
      if (idx < TOTAL_SLOTS) {
        initial[idx] = item;
      }
    });
    return initial;
  });

  const isDark = activeTheme === 'dark';

  // 保存槽位擺放
  const updateSlotLayout = (newLayout) => {
    setSlotLayout(newLayout);
    try {
      const studentId = currentStudent?.student_id || 'guest';
      localStorage.setItem(`wutai_curio_layout_${studentId}`, JSON.stringify(newLayout));
    } catch (e) {}
  };

  // 點擊格子
  const handleSlotClick = (slotIdx) => {
    soundEngine.click();
    const itemInSlot = slotLayout[slotIdx];

    if (selectedItem) {
      // 若手中拿著道具，放入該格
      const nextLayout = { ...slotLayout, [slotIdx]: selectedItem };
      updateSlotLayout(nextLayout);
      setSelectedItem(null);
      setSelectedSlotIndex(null);
      soundEngine.pinCard();
      showToast(`📦 已將【${selectedItem.nameZh}】陳列於多寶格第 ${slotIdx + 1} 槽位！`);
    } else if (itemInSlot) {
      // 點選已有道具的格子，展開檢視
      setInspectModalItem({ item: itemInSlot, slotIdx });
      speakEnglish(itemInSlot.nameEn || itemInSlot.nameZh);
    } else {
      setSelectedSlotIndex(slotIdx);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 互動使用/展示道具
  const handleInteractItem = (item) => {
    soundEngine.correct();
    if (item.category === 'food') {
      showToast(`😋 你品嘗了香甜的「${item.nameZh}」！充滿了神山勇士元氣！`);
    } else if (item.category === 'clothing' || item.category === 'special') {
      showToast(`✨ 你佩戴上了「${item.nameZh}」！整個人神采奕奕，散發部落勇者威儀！`);
    } else if (item.category === 'stationery') {
      showToast(`📝 你使用「${item.nameZh}」寫下了一句優美的英文！`);
    } else {
      showToast(`🏺 你擦拭了珍貴的「${item.nameZh}」，散發出璀璨的傳統工藝光芒！`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      {/* 多寶格彈窗主框 */}
      <div
        className={`relative w-full max-w-4xl rounded-3xl border-2 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-scaleUp transition-colors duration-300 ${
          isDark
            ? 'bg-slate-950/95 border-amber-500/40 text-white shadow-[0_0_60px_rgba(245,158,11,0.25)]'
            : 'bg-stone-100/95 border-amber-800/40 text-stone-900 shadow-[0_0_60px_rgba(217,119,6,0.25)]'
        }`}
      >
        {/* 多寶格古老底圖背景 (黑曜石板 / 象牙羊皮) */}
        <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
          <img
            src={isDark ? '/assets/backpack/curio_slate.webp' : '/assets/backpack/curio_parchment.webp'}
            alt="Curio Cabinet Background"
            className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.1] scale-100"
          />
        </div>

        {/* ── 頂部 HUD 標題 ── */}
        <header className="relative z-10 px-4 sm:px-6 py-3 border-b flex items-center justify-between shrink-0 border-amber-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-md border ${
              isDark ? 'bg-amber-950/80 border-amber-400/40 text-amber-300' : 'bg-amber-100 border-amber-600/40 text-amber-800'
            }`}>
              🎒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-heading font-black tracking-wide">
                  神山多寶格虛擬背包與珍寶陳列閣
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm">
                  已收藏 {inventory.length} 件寶物
                </span>
              </div>
              <p className={`text-[11px] font-bold ${isDark ? 'text-amber-200/80' : 'text-stone-600'}`}>
                持有者：{currentStudent?.nickname || '好學生'} • 永久綁定資產（防損壞無損保護）
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 前往小鎮商店快捷鍵 */}
            {onOpenShop && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.click();
                  onClose();
                  onOpenShop();
                }}
                className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black flex items-center gap-1 shadow-md transition-all cursor-pointer active:scale-95"
                title="前往小鎮市集採買陶甕、禮刀與文具"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">前往市集</span>
              </button>
            )}

            {/* 風格切換 (墨岩 / 羊皮) */}
            <button
              type="button"
              onClick={() => {
                soundEngine.click();
                setActiveTheme(prev => prev === 'dark' ? 'parchment' : 'dark');
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 border transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-900 border-white/20 text-amber-300 hover:bg-slate-800'
                  : 'bg-white border-stone-300 text-amber-900 hover:bg-stone-50'
              }`}
              title="切換多寶格石板/羊皮紙風格"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isDark ? '墨岩' : '羊皮'}</span>
            </button>

            {/* 關閉按鈕 */}
            <button
              onClick={() => {
                soundEngine.click();
                onClose();
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 text-white transition-all cursor-pointer border border-white/15"
              title="關閉多寶格"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* 提示訊息吐司條 */}
        {toastMessage && (
          <div className="relative z-20 mx-4 mt-2 p-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center gap-2 shadow-lg animate-fadeIn">
            <Sparkles className="w-4 h-4 shrink-0 animate-bounce" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ── 核心內容區 (上部：24 格多寶格展示櫃；下部：備用道具盤) ── */}
        <div className="relative z-10 flex-1 min-h-0 overflow-y-auto p-3 sm:p-5 flex flex-col gap-4">
          
          {/* 多寶格 24 置物槽 (6 欄 x 4 列) */}
          <div className="p-3 sm:p-4 rounded-3xl bg-black/35 backdrop-blur-md border border-white/10 shadow-inner">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-black flex items-center gap-1.5 text-amber-300">
                <span>🏺 典藏多寶格置物槽（點擊格子檢視或重新陳列寶物）</span>
              </span>
              <span className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                {selectedItem ? `已選取【${selectedItem.nameZh}】，請點擊目標空槽放入` : '點選任一格子檢視道具詳情'}
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
              {Array.from({ length: TOTAL_SLOTS }).map((_, slotIdx) => {
                const item = slotLayout[slotIdx];
                const isTarget = selectedSlotIndex === slotIdx;
                const count = item ? getItemQuantity(inventory, item) : 0;

                return (
                  <button
                    key={slotIdx}
                    type="button"
                    onClick={() => handleSlotClick(slotIdx)}
                    className={`relative aspect-square rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center p-1.5 overflow-hidden group ${
                      isTarget
                        ? 'border-amber-400 bg-amber-500/20 ring-2 ring-amber-400/50 scale-105'
                        : item
                        ? isDark
                          ? 'border-amber-500/30 bg-slate-900/85 hover:border-amber-400 hover:scale-[1.03] shadow-md'
                          : 'border-amber-700/30 bg-white/85 hover:border-amber-600 hover:scale-[1.03] shadow-md'
                        : isDark
                        ? 'border-dashed border-white/15 bg-black/40 hover:border-white/30'
                        : 'border-dashed border-stone-400/30 bg-stone-200/50 hover:border-stone-400'
                    }`}
                    title={item ? `${item.nameZh} (${item.nameEn})${count > 1 ? ` • 持有 x${count}` : ''}` : `第 ${slotIdx + 1} 置物格 (空)`}
                  >
                    {item ? (
                      <>
                        <span className="text-2xl sm:text-3xl filter drop-shadow transition-transform group-hover:scale-110">
                          {item.icon || '🏺'}
                        </span>
                        <span className="text-[10px] font-black truncate max-w-full mt-1 px-1">
                          {item.nameZh}
                        </span>
                        <span className="text-[8px] opacity-75 font-mono truncate max-w-full">
                          {item.nameEn}
                        </span>
                        {/* xN 數量角標 (當持有 2 件以上，如 10 件時以金色立體角標摺疊顯示) */}
                        {count > 1 && (
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-mono font-black text-[9px] shadow-md border border-amber-300">
                            x{count}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-[10px] font-bold opacity-30 font-mono">
                        {slotIdx + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 備用行囊待陳列道具清單 (若學生擁有的道具未放入多寶格，可點選放置) */}
          <div className={`p-3 rounded-2xl border ${
            isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-stone-300'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-amber-400" />
                <span>所有收藏道具清單（點選後可放置到上方多寶格）</span>
              </span>
              <span className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                共 {inventory.length} 件寶物（摺疊為 {groupedInventory.length} 款）
              </span>
            </div>

            {groupedInventory.length === 0 ? (
              <div className="py-6 text-center text-slate-400 font-bold text-xs">
                目前背包尚無道具，可前往小鎮集會所、黑熊超市或雲豹書局採購！
              </div>
            ) : (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {groupedInventory.map((it, idx) => {
                  const isPicked = selectedItem?.id === it.id;
                  return (
                    <button
                      key={it.id || idx}
                      type="button"
                      onClick={() => {
                        soundEngine.click();
                        setSelectedItem(isPicked ? null : it);
                        if (!isPicked) {
                          showToast(`已選取【${it.nameZh}】${it.count > 1 ? `(x${it.count})` : ''}，請點擊上方任一多寶格置物槽放置！`);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-black shrink-0 transition-all cursor-pointer ${
                        isPicked
                          ? 'border-amber-400 bg-amber-500/25 text-amber-300 ring-2 ring-amber-400/60 scale-105'
                          : isDark
                          ? 'border-white/10 bg-slate-950 text-slate-200 hover:border-white/20'
                          : 'border-stone-300 bg-stone-100 text-stone-800 hover:border-stone-400'
                      }`}
                    >
                      <span>{it.icon || '📦'}</span>
                      <span>{it.nameZh}</span>
                      {it.count > 1 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-stone-950 text-[10px] font-mono font-black">
                          x{it.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* ── 道具詳情檢視彈窗 ── */}
        {inspectModalItem && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
            <div className={`w-full max-w-sm rounded-3xl p-5 border-2 shadow-2xl flex flex-col items-center text-center relative animate-scaleUp ${
              isDark ? 'bg-slate-900 border-amber-400/50 text-white' : 'bg-white border-amber-600/50 text-stone-900'
            }`}>
              <button
                onClick={() => setInspectModalItem(null)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-4xl mb-3 shadow-inner">
                {inspectModalItem.item.icon || '🏺'}
              </div>

              <h4 className="text-base font-black font-heading mb-0.5">
                {inspectModalItem.item.nameZh}
              </h4>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-xs font-mono font-bold text-amber-400">
                  {inspectModalItem.item.nameEn}
                </span>
                <button
                  type="button"
                  onClick={() => speakEnglish(inspectModalItem.item.nameEn)}
                  className="p-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors cursor-pointer"
                  title="聆聽發音"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
                {getItemQuantity(inventory, inspectModalItem.item) > 1 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-mono font-black text-[10px] shadow-sm ml-1">
                    持有 x{getItemQuantity(inventory, inspectModalItem.item)}
                  </span>
                )}
              </div>

              <p className={`text-xs font-bold leading-relaxed mb-4 px-2 ${
                isDark ? 'text-slate-300' : 'text-stone-600'
              }`}>
                {inspectModalItem.item.description || '這是一件深受神山守護者珍視的寶物。'}
              </p>

              <div className="w-full flex items-center gap-2">
                <Button3D
                  variant="emerald"
                  size="sm"
                  onClick={() => {
                    handleInteractItem(inspectModalItem.item);
                    setInspectModalItem(null);
                  }}
                  className="flex-1"
                >
                  ✨ 把玩佩戴
                </Button3D>
                <Button3D
                  variant="slate"
                  size="sm"
                  onClick={() => setInspectModalItem(null)}
                  className="shrink-0"
                >
                  收妥回櫃
                </Button3D>
              </div>
            </div>
          </div>
        )}

        {/* ── 底部快捷條 ── */}
        <footer className="relative z-10 px-4 py-2.5 border-t border-white/10 flex items-center justify-between shrink-0 text-xs font-bold text-slate-400 bg-black/30">
          <span>神山多寶格藏寶閣 • 永久收藏不可丟棄 • 與個人通行證即時連通</span>
          <button
            onClick={() => {
              soundEngine.click();
              onClose();
            }}
            className="px-4 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black cursor-pointer transition-all"
          >
            返回個人通行證
          </button>
        </footer>

      </div>
    </div>
  );
};
