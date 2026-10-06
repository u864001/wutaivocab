import React, { useState } from 'react';
import { Button3D } from '../../components/ui/Button3D';
import { useStudent } from '../../context/StudentContext';
import { TOWN_ITEMS, TOWN_LOCATIONS } from './townData';
import { soundEngine, speakEnglish } from '../../services/audio';
import {
  ShoppingBag, X, Coins, Check, AlertCircle, Volume2,
  Sparkles, PackageCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ShopModal = ({ locationId, onClose, onQuestProgress }) => {
  const { currentStudent, coins, spendCoins, inventory, updateInventory, isLoggedIn, openModal } = useStudent();
  const [isBuying, setIsBuying] = useState(false);
  const [purchaseToast, setPurchaseToast] = useState(null);
  const [errorToast, setErrorToast] = useState(null);

  const location = TOWN_LOCATIONS.find(loc => loc.id === locationId) || TOWN_LOCATIONS[1];
  const items = TOWN_ITEMS.filter(it => it.shopId === locationId);

  const handleBuyItem = async (item) => {
    if (isBuying) return;
    soundEngine.click();

    if (!isLoggedIn) {
      setErrorToast('請先登入學生座號，才能使用金幣購買並保留道具喔！');
      setTimeout(() => setErrorToast(null), 3000);
      return;
    }

    if (coins < item.price) {
      soundEngine.wrong();
      setErrorToast(`宇宙金幣不足！還需要 ${item.price - coins} 金幣，快去挑戰單字遊戲獲得金幣吧！`);
      setTimeout(() => setErrorToast(null), 3500);
      return;
    }

    setIsBuying(true);
    try {
      const success = await spendCoins(item.price);
      if (success) {
        soundEngine.correct();
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}

        // 將道具存入背包
        const newInventory = [
          ...(inventory || []),
          {
            ...item,
            purchasedAt: new Date().toISOString()
          }
        ];
        await updateInventory(newInventory);

        setPurchaseToast(`成功購買「${item.nameZh} (${item.nameEn})」！已收入背包。`);
        setTimeout(() => setPurchaseToast(null), 3000);

        // 觸發任務比對 (Action: buy)
        if (onQuestProgress) {
          onQuestProgress('buy', item.category, item.id);
        }
      }
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-amber-400 dark:border-amber-600 overflow-hidden relative max-h-[85vh] flex flex-col animate-scaleUp">
        {/* 頂部商標橫幅 */}
        <div className="relative p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-slate-200 dark:border-slate-800 overflow-hidden">
          {location.bgImage ? (
            <div className="absolute inset-0 pointer-events-none">
              <img src={location.bgImage} alt="" className="w-full h-full object-cover filter brightness-[0.35] contrast-125" />
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />
            </div>
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-r ${location.bgGradient}`} />
          )}

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/90 dark:bg-slate-800/90 shadow-md flex items-center justify-center overflow-hidden shrink-0 border border-white/20">
              {location.npcPortrait ? (
                <img src={location.npcPortrait} alt="" className="w-full h-full object-contain" />
              ) : (
                <span className="text-2xl">{location.npcAvatar}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-heading font-black text-white">
                  {location.nameZh} • 專屬商店
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-sm">
                  Shop
                </span>
              </div>
              <p className="text-xs font-bold text-amber-200">
                店長：{location.npcName}
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            {/* 目前金幣餘額顯示 */}
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/30 border border-amber-400/80 backdrop-blur-md flex items-center gap-1.5 text-amber-200 text-xs font-black shadow-sm">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-sm">{coins}</span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
              title="關閉商店"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 提示橫幅 */}
        {purchaseToast && (
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-md animate-fadeIn">
            <PackageCheck className="w-4 h-4 shrink-0" />
            <span>{purchaseToast}</span>
          </div>
        )}

        {errorToast && (
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-rose-500 text-white font-black text-xs flex items-center gap-2 shadow-md animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorToast}</span>
          </div>
        )}

        {/* 商品陳列網格 */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {items.map((item) => {
              const canAfford = coins >= item.price;
              const alreadyOwnedCount = (inventory || []).filter(inv => inv.id === item.id).length;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:border-amber-400 dark:hover:border-amber-500 transition-all shadow-sm"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center text-2xl shadow-inner shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 font-heading">
                              {item.nameZh}
                            </h4>
                            <button
                              type="button"
                              onClick={() => speakEnglish(item.nameEn)}
                              className="text-slate-400 hover:text-emerald-500"
                              title="朗讀英文名稱"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 font-mono">
                            {item.nameEn}
                          </span>
                        </div>
                      </div>

                      {alreadyOwnedCount > 0 && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          已擁有 x{alreadyOwnedCount}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
                    <div className="flex items-center gap-1 font-mono font-black text-sm text-amber-600 dark:text-amber-400">
                      <Coins className="w-4 h-4 text-amber-500" />
                      <span>{item.price} 金幣</span>
                    </div>

                    <Button3D
                      variant={canAfford ? 'amber' : 'slate'}
                      size="sm"
                      onClick={() => handleBuyItem(item)}
                      disabled={isBuying || (!canAfford && isLoggedIn)}
                    >
                      {isBuying ? '處理中...' : (isLoggedIn ? '立即購買' : '登入購買')}
                    </Button3D>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 底部按鈕 */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 text-center shrink-0">
          <Button3D variant="slate" size="sm" onClick={onClose} className="w-full sm:w-auto">
            離開商店
          </Button3D>
        </div>
      </div>
    </div>
  );
};
