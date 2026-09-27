// ── 霧臺國小 官方榮譽獎狀高解析度 Canvas 繪製與匯出引擎 (300 DPI 印刷級) ──

// 計算民國年日期字串 (依據當前系統年份動態計算)
export const getROCDateString = (date = new Date()) => {
  const rocYear = date.getFullYear() - 1911;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `中華民國 ${rocYear} 年 ${month} 月 ${day} 日`;
};

// 依據答對率給予客觀、精確之評語與勳章等級
export const getAccuracyLevel = (accuracyRate) => {
  const acc = Math.round(accuracyRate);
  if (acc >= 100) {
    return {
      title: '本次全對・單字挑戰達人',
      subtitle: 'Flawless Performance • 完美全對通關',
      color: '#d97706', // amber-600
      badge: '👑'
    };
  } else if (acc >= 90) {
    return {
      title: '出類拔萃・英文小達人',
      subtitle: 'Outstanding Achiever • 卓越優秀表現',
      color: '#059669', // emerald-600
      badge: '🌟'
    };
  } else if (acc >= 80) {
    return {
      title: '認真練習・穩健達標',
      subtitle: 'Great Focus • 穩定發揮實力',
      color: '#2563eb', // blue-600
      badge: '🚀'
    };
  } else if (acc >= 70) {
    return {
      title: '潛力無窮・明日之星',
      subtitle: 'Promising Star • 基礎穩健茁壯',
      color: '#7c3aed', // purple-600
      badge: '🌱'
    };
  } else {
    return {
      title: '勤勉不懈・再接再厲',
      subtitle: 'Keep Practicing • 堅持必有成果',
      color: '#ea580c', // orange-600
      badge: '💪'
    };
  }
};

// 產生 300 DPI 印刷級超高解析度獎狀圖片 Data URL (2480 x 1754 px，標準 A4 橫向)
export const generateCertificateDataUrl = async ({
  studentName = '優秀學生',
  rangeText = '全冊精選單元',
  totalCount = 20,
  correctCount = 18,
  accuracy = 90
}) => {
  const width = 2480;
  const height = 1754;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // 1. 底色：雅緻象牙金米白細緻漸層
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#fefefe');
  bgGrad.addColorStop(0.5, '#faf8f2');
  bgGrad.addColorStop(1, '#f7f4ea');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. 燙金多重飾紋邊框 (300 DPI 精準比例)
  ctx.save();
  // 外框金色粗線
  ctx.strokeStyle = '#b48a3c';
  ctx.lineWidth = 18;
  ctx.strokeRect(55, 55, width - 110, height - 110);

  // 中間細線
  ctx.strokeStyle = '#dfc378';
  ctx.lineWidth = 5;
  ctx.strokeRect(80, 80, width - 160, height - 160);

  // 內框古典細線
  ctx.strokeStyle = '#b48a3c';
  ctx.lineWidth = 3;
  ctx.strokeRect(92, 92, width - 184, height - 184);

  // 四個角落幾何花角裝飾
  const corners = [
    [100, 100],
    [width - 100, 100],
    [100, height - 100],
    [width - 100, height - 100]
  ];
  ctx.fillStyle = '#b48a3c';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // 3. 載入校徽 (public/logo.jpg)
  try {
    const logoImg = await new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = '/logo.jpg';
    });

    if (logoImg) {
      const logoW = 150;
      const logoH = 150;
      const logoX = width / 2 - logoW / 2;
      const logoY = 140;

      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, logoY + logoH / 2, logoW / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, logoY + logoH / 2, logoW / 2 + 5, 0, Math.PI * 2);
      ctx.strokeStyle = '#b48a3c';
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.restore();
    }
  } catch (e) {}

  // 4. 學校抬頭
  ctx.textAlign = 'center';
  ctx.fillStyle = '#451a03'; // amber-950
  ctx.font = 'bold 54px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillText('屏東縣霧臺鄉霧臺國民小學', width / 2, 350);

  ctx.fillStyle = '#78350f';
  ctx.font = '600 30px "PingFang TC", sans-serif';
  ctx.fillText('Pingtung County Wutai Elementary School', width / 2, 400);

  // 5. 獎狀主標題
  ctx.save();
  ctx.shadowColor = 'rgba(180, 138, 60, 0.4)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = '#854d0e'; // dark gold
  ctx.font = '900 115px "Songti TC", "Biaukai", "PingFang TC", serif';
  ctx.fillText('榮  譽  獎  狀', width / 2, 550);
  ctx.restore();

  ctx.fillStyle = '#a16207';
  ctx.font = 'bold 34px "PingFang TC", sans-serif';
  ctx.fillText('— CERTIFICATE OF ACHIEVEMENT —', width / 2, 605);

  // 6. 受獎人抬頭
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 66px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillText(`恭 喜   ${studentName || '優秀'}   同 學`, width / 2, 730);

  // 7. 內文表揚語句
  ctx.fillStyle = '#475569';
  ctx.font = 'normal 38px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillText('參加校園英語星際學習宇宙自主挑戰，表現優異，特頒此狀以資表揚。', width / 2, 815);

  // 8. 成果評估便當框
  const cardX = 380;
  const cardY = 880;
  const cardW = width - 760;
  const cardH = 390;

  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.05)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  ctx.fillRect(cardX, cardY, cardW, cardH);

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.strokeRect(cardX, cardY, cardW, cardH);
  ctx.restore();

  // 成果細節項目文字
  ctx.textAlign = 'left';
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 42px "PingFang TC", sans-serif';
  ctx.fillText(`📘 練習範圍：`, cardX + 70, cardY + 95);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 42px "PingFang TC", sans-serif';
  const trimmedRange = rangeText.length > 25 ? rangeText.substring(0, 24) + '...' : rangeText;
  ctx.fillText(trimmedRange, cardX + 325, cardY + 95);

  ctx.fillStyle = '#334155';
  ctx.fillText(`🎯 挑戰成果：`, cardX + 70, cardY + 195);

  ctx.fillStyle = '#0f172a';
  ctx.fillText(`共作答 ${totalCount} 題，答對 ${correctCount} 題`, cardX + 325, cardY + 195);

  ctx.fillStyle = '#334155';
  ctx.fillText(`📈 整體表現：`, cardX + 70, cardY + 295);

  const level = getAccuracyLevel(accuracy);
  ctx.fillStyle = level.color;
  ctx.font = '900 52px "PingFang TC", sans-serif';
  ctx.fillText(`${Math.round(accuracy)}%  ${level.badge} ${level.title}`, cardX + 375, cardY + 298);

  // 9. 頒獎印鑑戳記與中華民國官方日期
  ctx.textAlign = 'right';
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 38px "Songti TC", "PingFang TC", serif';
  ctx.fillText(getROCDateString(), width - 380, 1460);

  ctx.font = 'bold 42px "PingFang TC", serif';
  ctx.fillText('屏東縣霧臺國民小學 教務處', width - 380, 1530);

  // 10. 紅色官方認證印鑑戳記章 (文字調整為學習紀念章)
  const sealX = width - 310;
  const sealY = 1490;
  ctx.save();
  ctx.translate(sealX, sealY);
  ctx.rotate(-0.06);

  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 7;
  ctx.strokeRect(-90, -90, 180, 180);

  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3;
  ctx.strokeRect(-78, -78, 156, 156);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#dc2626';
  ctx.font = '900 36px "Songti TC", "Biaukai", serif';
  ctx.fillText('霧臺國小', 0, -22);
  ctx.fillText('學習紀念', 0, 26);
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('ENGLISH', 0, 62);
  ctx.restore();

  return canvas.toDataURL('image/png');
};
