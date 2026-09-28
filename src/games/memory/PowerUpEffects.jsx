import React, { useEffect, useRef } from 'react';
import {
  Eye, Snowflake, Gem, Coins, Lock, Satellite, Zap, Handshake,
  Sparkles, CheckCircle2, AlertTriangle, Play
} from 'lucide-react';
import { POWER_UP_DEFS } from './powerUpData';
export { POWER_UP_DEFS };
/**
 * 頂部滑入宣告橫幅 (Sliding Announcement Banner)
 * 當玩家翻到某卡時從頂部以彈力曲線滑入，2秒後自動滑出
 */
export const AnnouncementBanner = ({ announcement, onComplete }) => {
  useEffect(() => {
    if (!announcement) return;
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2200);
    return () => clearTimeout(timer);
  }, [announcement, onComplete]);

  if (!announcement) return null;

  const def = POWER_UP_DEFS[announcement.cardId] || {
    name: announcement.cardName || '神秘卡牌',
    color: '#facc15',
    icon: Sparkles
  };
  const Icon = def.icon;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-slideDown pointer-events-none">
      <div className="px-6 py-3.5 rounded-2xl bg-slate-900/95 border-2 border-amber-400/80 shadow-[0_0_30px_rgba(251,191,36,0.5)] backdrop-blur-xl flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner"
          style={{ backgroundColor: `${def.color}25`, border: `1.5px solid ${def.color}` }}
        >
          <Icon className="w-6 h-6 animate-pulse" style={{ color: def.color }} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-300">
            {announcement.playerName || '玩家'} 翻到了功能牌！
          </span>
          <span className="text-lg font-black tracking-wide" style={{ color: def.color }}>
            【{def.name}】 {def.spirit ? `• ${def.spirit.split(' ')[0]}` : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * 微縮實戰動畫模擬畫布 (Mini Preview Sandbox Canvas)
 * 供圖鑑介紹區角落 160x120 小畫布無限循環演示卡牌觸發效果
 */
export const MiniSandboxCanvas = ({ cardId, width = 160, height = 120 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const render = (timeMs) => {
      const t = timeMs / 1000;
      ctx.clearRect(0, 0, width, height);

      // 深色星空微型棋盤背景
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // 4 張微縮卡牌位置
      const cardPositions = [
        { x: 20, y: 20, w: 50, h: 36 },
        { x: 90, y: 20, w: 50, h: 36 },
        { x: 20, y: 65, w: 50, h: 36 },
        { x: 90, y: 65, w: 50, h: 36 }
      ];

      // 繪製微縮卡牌基底
      cardPositions.forEach((pos, idx) => {
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(pos.x, pos.y, pos.w, pos.h, 6);
        ctx.fill();
        ctx.stroke();
      });

      // ── 依據不同卡牌繪製其專屬動態模擬效果 ──
      if (cardId === 'peek') {
        // 偷看卡：神之眼紫光掃描前 2 張牌
        const cycle = t % 3.0;
        const alpha = Math.sin((cycle / 3.0) * Math.PI);
        if (alpha > 0) {
          ctx.save();
          // 紫光透視
          [cardPositions[0], cardPositions[1]].forEach(pos => {
            ctx.fillStyle = `rgba(129, 140, 248, ${0.4 * alpha})`;
            ctx.strokeStyle = '#818cf8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(pos.x, pos.y, pos.w, pos.h, 6);
            ctx.fill();
            ctx.stroke();

            // 浮現透視單字
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('CAT', pos.x + pos.w / 2, pos.y + pos.h / 2 + 3);
          });
          // 紫色神眸光束
          ctx.strokeStyle = `rgba(192, 132, 252, ${alpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, 14, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      } else if (cardId === 'lightning') {
        // 閃電卡：金雷轟頂，電弧熔接連線卡牌
        const cycle = t % 2.5;
        if (cycle < 1.2) {
          ctx.save();
          ctx.strokeStyle = '#fde047';
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 10;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cardPositions[0].x + 25, cardPositions[0].y + 18);
          // 折線電弧
          ctx.lineTo(70, 35 + Math.sin(t * 40) * 8);
          ctx.lineTo(cardPositions[3].x + 25, cardPositions[3].y + 18);
          ctx.stroke();

          // 成功配對金光
          [cardPositions[0], cardPositions[3]].forEach(pos => {
            ctx.fillStyle = 'rgba(250, 204, 21, 0.4)';
            ctx.strokeStyle = '#facc15';
            ctx.beginPath();
            ctx.roundRect(pos.x, pos.y, pos.w, pos.h, 6);
            ctx.fill();
            ctx.stroke();
          });
          ctx.restore();
        }
      } else if (cardId === 'freeze') {
        // 冰凍卡：暴風雪與極寒冰晶凍結
        ctx.save();
        const iceCycle = t % 2.8;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.fillRect(80, 55, 70, 50);
        ctx.strokeRect(80, 55, 70, 50);

        ctx.fillStyle = '#bae6fd';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('❄️ 敵隊已凍結', 115, 82);
        ctx.fillText('SKIP TURN', 115, 96);
        ctx.restore();
      } else if (cardId === 'bonus') {
        // 加分卡：寶石綠光與巨大 +30 粒子噴發
        const cycle = (t * 1.5) % 2.0;
        const rise = cycle * 22;
        ctx.save();
        ctx.fillStyle = '#34d399';
        ctx.font = 'black 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 8;
        ctx.fillText('+30 pt', width / 2, 60 - rise);
        ctx.restore();
      } else if (cardId === 'radar') {
        // 雷達卡：全息同心圓擴散
        const r1 = ((t * 40) % 70) + 5;
        ctx.save();
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, r1, 0, Math.PI * 2);
        ctx.stroke();

        // 卡牌全息微光
        cardPositions.forEach((pos, idx) => {
          ctx.fillStyle = 'rgba(74, 222, 128, 0.15)';
          ctx.fillRect(pos.x, pos.y, pos.w, pos.h);
        });
        ctx.restore();
      } else if (cardId === 'lock') {
        // 上鎖卡：鐵鍊纏繞與金鎖
        ctx.save();
        const lockPos = cardPositions[2];
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(lockPos.x, lockPos.y);
        ctx.lineTo(lockPos.x + lockPos.w, lockPos.y + lockPos.h);
        ctx.moveTo(lockPos.x + lockPos.w, lockPos.y);
        ctx.lineTo(lockPos.x, lockPos.y + lockPos.h);
        ctx.stroke();

        ctx.fillStyle = '#facc15';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔒', lockPos.x + lockPos.w / 2, lockPos.y + lockPos.h / 2 + 5);
        ctx.restore();
      } else if (cardId === 'coin') {
        // 金幣雨：金幣從天而降
        ctx.save();
        for (let i = 0; i < 5; i++) {
          const cy = ((t * 60 + i * 35) % (height + 20)) - 10;
          const cx = 25 + i * 28;
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(cx, cy, 5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      } else if (cardId === 'winwin') {
        // 雙贏卡：友誼契約光束連線
        ctx.save();
        ctx.strokeStyle = '#f472b6';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(45, 38);
        ctx.lineTo(115, 83);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#fb7185';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🤝', 80, 65);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [cardId, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-xl border border-slate-700/80 shadow-inner bg-slate-950"
    />
  );
};
