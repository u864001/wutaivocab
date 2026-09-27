// ── 霧臺國小 官方榮譽獎狀高解析度 Canvas 繪製與匯出引擎 ──

// 計算民國年日期字串
export const getROCDateString = (date = new Date()) => {
  const rocYear = date.getFullYear() - 1911;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `中華民國 ${rocYear} 年 ${month} 月 ${day} 日`;
};

// 依據答對率給予評語與勳章等級
export const getAccuracyLevel = (accuracyRate) => {
  const acc = Math.round(accuracyRate);
  if (acc >= 100) {
    return {
      title: '登峰造極・雙語小博士',
      subtitle: 'Flawless Master • 完美無瑕全對',
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
      title: '勇往直前・學習進步王',
      subtitle: 'Great Effort & Focus • 積極專注挑戰',
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

// 產生高解析度獎狀圖片 Data URL (1600 x 1131, 接近 A4 比例 1.414:1)
export const generateCertificateDataUrl = async ({
  studentName = '優秀學生',
  rangeText = '全冊精選單元',
  totalCount = 20,
  correctCount = 18,
  accuracy = 90
}) => {
  const width = 1600;
  const height = 1131;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // 1. 底色：雅緻象牙金米白漸層
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#fefdf9');
  bgGrad.addColorStop(0.5, '#fcfaf2');
  bgGrad.addColorStop(1, '#fbf8eb');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. 燙金多重飾紋邊框
  ctx.save();
  // 外框金色粗線
  ctx.strokeStyle = '#b48a3c';
  ctx.lineWidth = 14;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  // 中間細線
  ctx.strokeStyle = '#dfc378';
  ctx.lineWidth = 3;
  ctx.strokeRect(52, 52, width - 104, height - 104);

  // 內框古典細線
  ctx.strokeStyle = '#b48a3c';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 60, width - 120, height - 120);

  // 四個角落古典花角裝飾
  const cornerSize = 40;
  const corners = [
    [64, 64],
    [width - 64, 64],
    [64, height - 64],
    [width - 64, height - 64]
  ];
  ctx.fillStyle = '#b48a3c';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // 3. 載入校徽 (public/logo.jpg)
  try {
    const logoImg = await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null); // 若找不到圖片安全回退
      img.src = '/logo.jpg';
    });

    if (logoImg) {
      const logoW = 100;
      const logoH = 100;
      const logoX = width / 2 - logoW / 2;
      const logoY = 90;

      // 圓形裁切校徽並帶柔和金框
      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, logoY + logoH / 2, logoW / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, logoY + logoH / 2, logoW / 2 + 3, 0, Math.PI * 2);
      ctx.strokeStyle = '#b48a3c';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
    }
  } catch (e) {
    // 忽略校徽載入錯誤
  }

  // 4. 學校抬頭
  ctx.textAlign = 'center';
  ctx.fillStyle = '#451a03'; // amber-950
  ctx.font = 'bold 36px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillText('屏東縣霧臺鄉霧臺國民小學', width / 2, 230);

  ctx.fillStyle = '#78350f';
  ctx.font = '600 20px "PingFang TC", sans-serif';
  ctx.fillText('Pingtung County Wutai Elementary School', width / 2, 260);

  // 5. 獎狀大大字主標題 (附燙金立體陰影)
  ctx.save();
  ctx.shadowColor = 'rgba(180, 138, 60, 0.4)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = '#854d0e'; // dark gold
  ctx.font = '900 76px "Songti TC", "Biaukai", "PingFang TC", serif';
  ctx.fillText('榮  譽  獎  狀', width / 2, 360);
  ctx.restore();

  ctx.fillStyle = '#a16207';
  ctx.font = 'bold 22px "PingFang TC", sans-serif';
  ctx.fillText('— CERTIFICATE OF ACHIEVEMENT —', width / 2, 396);

  // 6. 受獎人抬頭
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 44px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillText(`恭 喜   ${studentName || '優秀'}   同 學`, width / 2, 480);

  // 7. 內文表揚語句
  ctx.fillStyle = '#475569';
  ctx.font = 'normal 26px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillText('參加校園英語星際學習宇宙自主挑戰，表現優異，特頒此狀以資表揚。', width / 2, 535);

  // 8. 成果評估便當框
  const cardX = 260;
  const cardY = 575;
  const cardW = width - 520;
  const cardH = 260;

  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;
  ctx.fillRect(cardX, cardY, cardW, cardH);

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.strokeRect(cardX, cardY, cardW, cardH);
  ctx.restore();

  // 成果細節項目文字
  ctx.textAlign = 'left';
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 28px "PingFang TC", sans-serif';
  ctx.fillText(`📘 練習範圍：`, cardX + 45, cardY + 65);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 28px "PingFang TC", sans-serif';
  // 範圍名稱若過長則截斷
  const trimmedRange = rangeText.length > 25 ? rangeText.substring(0, 24) + '...' : rangeText;
  ctx.fillText(trimmedRange, cardX + 215, cardY + 65);

  ctx.fillStyle = '#334155';
  ctx.fillText(`🎯 挑戰成果：`, cardX + 45, cardY + 130);

  ctx.fillStyle = '#0f172a';
  ctx.fillText(`共作答 ${totalCount} 題，答對 ${correctCount} 題`, cardX + 215, cardY + 130);

  ctx.fillStyle = '#334155';
  ctx.fillText(`📈 整體答對率：`, cardX + 45, cardY + 195);

  const level = getAccuracyLevel(accuracy);
  ctx.fillStyle = level.color;
  ctx.font = '900 36px "PingFang TC", sans-serif';
  ctx.fillText(`${Math.round(accuracy)}%  ${level.badge} ${level.title}`, cardX + 250, cardY + 197);

  // 9. 頒獎印鑑戳記與中華民國官方日期
  ctx.textAlign = 'right';
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 26px "Songti TC", "PingFang TC", serif';
  ctx.fillText(getROCDateString(), width - 260, 940);

  ctx.font = 'bold 28px "PingFang TC", serif';
  ctx.fillText('屏東縣霧臺國民小學 教務處', width - 260, 990);

  // 10. 紅色官方認證印鑑戳記章
  const sealX = width - 220;
  const sealY = 960;
  ctx.save();
  ctx.translate(sealX, sealY);
  ctx.rotate(-0.06); // 微微傾斜模擬蓋章真實質感

  ctx.strokeStyle = '#dc2626'; // 印泥紅
  ctx.lineWidth = 5;
  ctx.strokeRect(-60, -60, 120, 120);

  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.strokeRect(-52, -52, 104, 104);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#dc2626';
  ctx.font = '900 24px "Songti TC", "Biaukai", serif';
  ctx.fillText('霧臺國小', 0, -15);
  ctx.fillText('學習認證', 0, 18);
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('VERIFIED', 0, 42);
  ctx.restore();

  return canvas.toDataURL('image/png');
};
