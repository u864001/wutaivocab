import React, { useState } from 'react';
import { Button3D } from '../../components/ui/Button3D';
import { useStudent } from '../../context/StudentContext';
import { speakEnglish, soundEngine } from '../../services/audio';
import {
  Package, X, Volume2, Sparkles, Utensils,
  BookOpen, Ticket, Shield, CheckCircle2, Heart
} from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'all', label: '全部物品' },
  { id: 'stationery', label: '文具圖書' },
  { id: 'food', label: '美食點心' },
  { id: 'ticket', label: '交通車票' },
  { id: 'clothing', label: '服飾圖騰' },
  { id: 'special', label: '特殊寶物' }
];

export const BackpackModal = ({ onClose }) => {
  const { currentStudent, inventory, updateInventory } = useStudent();
  const [activeCategory, setActiveCategory] = useState('all');
  const [useToast, setUseToast] = useState(null);

  const items = inventory || [];

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(it => it.category === activeCategory);

  const handleUseItem = async (item, index) => {
    soundEngine.correct();

    // 依類別給予不同趣味反饋
    if (item.category === 'food') {
      setUseToast(`😋 你品嘗了香甜的「${item.nameZh}」！充滿了精神與活力！`);
    } else if (item.category === 'clothing' || item.category === 'special') {
      setUseToast(`✨ 你佩戴上了「${item.nameZh}」！整個人神采奕奕，散發魯凱勇士風采！`);
    } else if (item.category === 'stationery') {
      setUseToast(`📝 你使用「${item.nameZh}」寫下了一句漂亮的英文！`);
    } else {
      setUseToast(`🎫 你拿出了「${item.nameZh}」！隨時準備好出發探險！`);
    }

    setTimeout(() => setUseToast(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-lime-400 dark:border-lime-600 overflow-hidden relative max-h-[85vh] flex flex-col animate-scaleUp">
        {/* 頂部倉庫橫幅 */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-lime-500/20 via-emerald-500/20 to-teal-500/20 flex items-center justify-between shrink-0 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-md flex items-center justify-center text-2xl shrink-0">
              🎒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-heading font-black text-slate-800 dark:text-white">
                  學生溫馨的家 • 探險個人背包
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-lime-600 text-white">
                  共 {items.length} 件寶物
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                持有者：{currentStudent?.nickname || '好學生'} ({currentStudent?.student_id || '訪客'})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            title="關閉背包"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 道具使用提示 */}
        {useToast && (
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-lime-600 text-white font-black text-xs flex items-center gap-2 shadow-md animate-fadeIn">
            <Sparkles className="w-4 h-4 shrink-0 animate-bounce" />
            <span>{useToast}</span>
          </div>
        )}

        {/* 分類標籤切換 */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                soundEngine.click();
                setActiveCategory(tab.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-lime-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 道具物品清單 */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center text-slate-400 font-bold space-y-2">
              <Package className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-sm">這個分類目前空空如也！</p>
              <p className="text-xs text-slate-400">
                快去小鎮上的黑熊超市、雲豹書局或集會所，使用金幣採買精彩的道具吧！
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:border-lime-400 dark:hover:border-lime-500 transition-all shadow-sm"
                >
                  <div className="flex items-start gap-3 mb-2">
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
                          title="朗讀英文單字"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 font-mono">
                        {item.nameEn}
                      </span>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">
                      類別: {item.category}
                    </span>
                    <Button3D
                      variant="emerald"
                      size="sm"
                      onClick={() => handleUseItem(item, idx)}
                    >
                      {item.category === 'food' ? '享用美味 🍴' : '佩戴 / 使用 ✨'}
                    </Button3D>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部按鈕 */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 text-center shrink-0">
          <Button3D variant="slate" size="sm" onClick={onClose} className="w-full sm:w-auto">
            返回小鎮地圖
          </Button3D>
        </div>
      </div>
    </div>
  );
};
