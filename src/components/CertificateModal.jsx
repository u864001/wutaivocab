import React, { useState, useEffect } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Button3D } from './ui/Button3D';
import { generateCertificateDataUrl, getAccuracyLevel, getROCDateString } from '../services/certificateGenerator';
import { speakEnglish } from '../services/audio';
import { Award, Download, Printer, X, Volume2, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

export const CertificateModal = ({
  isOpen,
  onClose,
  studentName = '優秀學生',
  rangeText = '全冊精選單元',
  totalCount = 20,
  correctCount = 18,
  accuracy = 90,
  reviewWords = []
}) => {
  const [certDataUrl, setCertDataUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoading(true);

    generateCertificateDataUrl({
      studentName,
      rangeText,
      totalCount,
      correctCount,
      accuracy
    }).then(dataUrl => {
      if (isMounted) {
        setCertDataUrl(dataUrl);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, studentName, rangeText, totalCount, correctCount, accuracy]);

  if (!isOpen) return null;

  const level = getAccuracyLevel(accuracy);

  const handleDownload = () => {
    if (!certDataUrl) return;
    const a = document.createElement('a');
    a.href = certDataUrl;
    a.download = `霧臺國小_學習獎狀_${studentName}_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="max-w-4xl w-full my-auto space-y-4">
        {/* 控制按鈕列 */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 dark:bg-slate-800/90 p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500 animate-bounce" />
            <div>
              <h3 className="font-heading font-black text-slate-800 dark:text-slate-100 text-base sm:text-lg">
                霧臺國小 官方榮譽獎狀
              </h3>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {level.badge} {level.title} • {getROCDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button3D
              variant="amber"
              size="sm"
              onClick={handleDownload}
              disabled={isLoading || !certDataUrl}
              icon={Download}
            >
              點我下載獎狀
            </Button3D>
            <Button3D
              variant="blue"
              size="sm"
              onClick={handlePrint}
              disabled={isLoading || !certDataUrl}
              icon={Printer}
              className="hidden sm:inline-flex"
            >
              列印 (A4)
            </Button3D>
            <Button3D
              variant="slate"
              size="sm"
              onClick={onClose}
              icon={X}
            >
              關閉視窗
            </Button3D>
          </div>
        </div>

        {/* 獎狀圖像預覽區 */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400/80 bg-slate-900/50 flex items-center justify-center min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-white">
              <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-3" />
              <p className="text-sm font-black">正在繪製專屬燙金獎狀...</p>
            </div>
          ) : (
            <img
              src={certDataUrl}
              alt="榮譽獎狀"
              className="w-full h-auto object-contain max-h-[68vh] rounded-2xl select-none"
            />
          )}
        </div>

        {/* 獎狀下方：本次練習單字成果與聽力複習 */}
        {reviewWords && reviewWords.length > 0 && (
          <GlassCard className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <h4 className="font-heading font-black text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                  📖 本次練習單字成果與發音複習 ({reviewWords.length} 字)
                </h4>
              </div>
              <span className="text-xs font-bold text-slate-400">點擊喇叭即可聆聽純正發音</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {reviewWords.map((w, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                    w.isMistake
                      ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'
                      : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="font-mono font-black text-sm text-slate-800 dark:text-slate-100 truncate">
                      {w.en}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">
                      {w.zh}
                    </span>
                    {w.isMistake && (
                      <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300">
                        需複習
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => speakEnglish(w.en)}
                    title="聆聽發音"
                    className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:scale-110 active:scale-95 transition-all shrink-0 ml-1"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};
