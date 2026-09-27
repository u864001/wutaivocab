// ── 霧臺國小 官方榮譽獎狀高解析度 Canvas 繪製與匯出引擎 (真正的 300 DPI A4 規格: 3508 x 2480 px) ──

// 計算台灣時間民國年日期字串
export const getROCDateString = (date = new Date()) => {
  // 強制使用台灣時區 (Asia/Taipei)
  const twDateStr = date.toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei', year: 'numeric', month: 'numeric', day: 'numeric' });
  const [yearStr, monthStr, dayStr] = twDateStr.split('/');
  const rocYear = parseInt(yearStr, 10) - 1911;
  return `中華民國 ${rocYear} 年 ${monthStr} 月 ${dayStr} 日`;
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

// 產生真正的 300 DPI A4 橫向印刷級獎狀 (3508 x 2480 px)
export const generateCertificateDataUrl = async ({
  studentName = '優秀學生',
  rangeText = '全冊精選單元',
  totalCount = 20,
  correctCount = 18,
  accuracy = 90
}) => {
  const width = 3508;
  const height = 2480;

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

  // 2. 燙金多重飾紋邊框 (預留 10mm 安全列印邊界)
  ctx.save();
  // 外框金色粗線
  ctx.strokeStyle = '#b48a3c';
  ctx.lineWidth = 24;
  ctx.strokeRect(110, 110, width - 220, height - 220);

  // 中間細線
  ctx.strokeStyle = '#dfc378';
  ctx.lineWidth = 6;
  ctx.strokeRect(145, 145, width - 290, height - 290);

  // 內框古典細線
  ctx.strokeStyle = '#b48a3c';
  ctx.lineWidth = 4;
  ctx.strokeRect(160, 160, width - 320, height - 320);

  // 四個角落花角裝飾
  const corners = [
    [175, 175],
    [width - 175, 175],
    [175, height - 175],
    [width - 175, height - 175]
  ];
  ctx.fillStyle = '#b48a3c';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
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
      const logoW = 210;
      const logoH = 210;
      const logoX = width / 2 - logoW / 2;
      const logoY = 200;

      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, logoY + logoH / 2, logoW / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, logoY + logoH / 2, logoW / 2 + 8, 0, Math.PI * 2);
      ctx.strokeStyle = '#b48a3c';
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.restore();
    }
  } catch (e) {}

  // 4. 學校抬頭
  ctx.textAlign = 'center';
  ctx.fillStyle = '#451a03'; // amber-950
  ctx.font = 'bold 76px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillText('屏東縣霧臺鄉霧臺國民小學', width / 2, 490);

  ctx.fillStyle = '#78350f';
  ctx.font = '600 42px "PingFang TC", sans-serif';
  ctx.fillText('Pingtung County Wutai Elementary School', width / 2, 560);

  // 5. 獎狀主標題
  ctx.save();
  ctx.shadowColor = 'rgba(180, 138, 60, 0.4)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = '#854d0e'; // dark gold
  ctx.font = '900 160px "Songti TC", "Biaukai", "PingFang TC", serif';
  ctx.fillText('榮  譽  獎  狀', width / 2, 780);
  ctx.restore();

  ctx.fillStyle = '#a16207';
  ctx.font = 'bold 48px "PingFang TC", sans-serif';
  ctx.fillText('— CERTIFICATE OF ACHIEVEMENT —', width / 2, 855);

  // 6. 受獎人抬頭
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 92px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillText(`恭 喜   ${studentName || '優秀'}   同 學`, width / 2, 1030);

  // 7. 內文表揚語句
  ctx.fillStyle = '#475569';
  ctx.font = 'normal 52px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillText('參加校園英語星際學習宇宙自主挑戰，表現優異，特頒此狀以資表揚。', width / 2, 1150);

  // 8. 成果評估便當框
  const cardX = 520;
  const cardY = 1240;
  const cardW = width - 1040;
  const cardH = 550;

  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.05)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 12;
  ctx.fillRect(cardX, cardY, cardW, cardH);

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 4;
  ctx.strokeRect(cardX, cardY, cardW, cardH);
  ctx.restore();

  // 成果細節項目文字
  ctx.textAlign = 'left';
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 60px "PingFang TC", sans-serif';
  ctx.fillText(`📘 練習範圍：`, cardX + 100, cardY + 135);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 60px "PingFang TC", sans-serif';
  const trimmedRange = rangeText.length > 25 ? rangeText.substring(0, 24) + '...' : rangeText;
  ctx.fillText(trimmedRange, cardX + 460, cardY + 135);

  ctx.fillStyle = '#334155';
  ctx.fillText(`🎯 挑戰成果：`, cardX + 100, cardY + 275);

  ctx.fillStyle = '#0f172a';
  ctx.fillText(`共作答 ${totalCount} 題，答對 ${correctCount} 題`, cardX + 460, cardY + 275);

  ctx.fillStyle = '#334155';
  ctx.fillText(`📈 整體表現：`, cardX + 100, cardY + 415);

  const level = getAccuracyLevel(accuracy);
  ctx.fillStyle = level.color;
  ctx.font = '900 74px "PingFang TC", sans-serif';
  ctx.fillText(`${Math.round(accuracy)}%  ${level.badge} ${level.title}`, cardX + 530, cardY + 418);

  // 9. 頒獎印鑑戳記與中華民國官方日期
  ctx.textAlign = 'right';
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 54px "Songti TC", "PingFang TC", serif';
  ctx.fillText(getROCDateString(), width - 520, 2060);

  ctx.font = 'bold 60px "PingFang TC", serif';
  ctx.fillText('屏東縣霧臺國民小學 教務處', width - 520, 2160);

  // 10. 紅色官方認證印鑑戳記章 (調整為學習紀念章)
  const sealX = width - 420;
  const sealY = 2100;
  ctx.save();
  ctx.translate(sealX, sealY);
  ctx.rotate(-0.06);

  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 10;
  ctx.strokeRect(-125, -125, 250, 250);

  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 4;
  ctx.strokeRect(-108, -108, 216, 216);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#dc2626';
  ctx.font = '900 50px "Songti TC", "Biaukai", serif';
  ctx.fillText('霧臺國小', 0, -32);
  ctx.fillText('學習紀念', 0, 36);
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('ENGLISH', 0, 88);
  ctx.restore();

  return canvas.toDataURL('image/png');
};
