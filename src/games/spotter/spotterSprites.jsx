import React from 'react';

// ── 《鷹眼神探 • 單字找不同》 20 大目標單字吉卜力手繪動漫高畫質精靈圖庫 ──
// 全面採用仿底圖相同畫風的 Studio Ghibli 水彩手繪透明 WebP 圖檔，100% 融入歐風露天咖啡廣場！

const BASE_ITEM_PATH = '/assets/spotter/items/';

// 1. 果汁 (juice) - 咖啡桌 (840, 460)
export const renderJuiceSprite = (variantKey, isLeft) => {
  const x = 840;
  const y = 460;
  const w = 34;
  const h = 62;

  if (variantKey === 'color') {
    const src = isLeft
      ? `${BASE_ITEM_PATH}juice_green.webp` // 左綠奇異果汁
      : `${BASE_ITEM_PATH}juice_red.webp`;   // 右紅西瓜汁
    return (
      <image
        href={src}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  if (variantKey === 'size') {
    const scale = isLeft ? 1.3 : 0.65;
    const curW = w * scale;
    const curH = h * scale;
    const dy = isLeft ? -4 : 6;
    return (
      <image
        href={`${BASE_ITEM_PATH}juice_default.webp`}
        x={x - curW / 2}
        y={y - curH / 2 + dy}
        width={curW}
        height={curH}
        filter="url(#ghibliShadow)"
      />
    );
  }

  if (variantKey === 'presence') {
    if (!isLeft) return null;
    return (
      <image
        href={`${BASE_ITEM_PATH}juice_default.webp`}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  // Default
  return (
    <image
      href={`${BASE_ITEM_PATH}juice_default.webp`}
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      filter="url(#ghibliShadow)"
    />
  );
};

// 2. 茶 (tea) - 咖啡桌 (895, 455)
export const renderTeaSprite = (variantKey, isLeft) => {
  const x = 895;
  const y = 455;
  const w = 56;
  const h = 46;

  if (variantKey === 'color') {
    const src = isLeft
      ? `${BASE_ITEM_PATH}tea_default.webp` // 左古典琥珀茶
      : `${BASE_ITEM_PATH}tea_purple.webp`;  // 右紫羅蘭花茶
    return (
      <image
        href={src}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  if (variantKey === 'size') {
    const scale = isLeft ? 1.25 : 0.68;
    const curW = w * scale;
    const curH = h * scale;
    const dy = isLeft ? -4 : 5;
    return (
      <image
        href={`${BASE_ITEM_PATH}tea_default.webp`}
        x={x - curW / 2}
        y={y - curH / 2 + dy}
        width={curW}
        height={curH}
        filter="url(#ghibliShadow)"
      />
    );
  }

  if (variantKey === 'presence') {
    if (!isLeft) return null;
    return (
      <image
        href={`${BASE_ITEM_PATH}tea_default.webp`}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  // Default
  return (
    <image
      href={`${BASE_ITEM_PATH}tea_default.webp`}
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      filter="url(#ghibliShadow)"
    />
  );
};

// 3. 冰淇淋 (ice cream) - 咖啡桌 (890, 510)
export const renderIceCreamSprite = (variantKey, isLeft) => {
  const x = 890;
  const y = 510;
  const w = 38;
  const h = 60;

  if (variantKey === 'color') {
    const src = isLeft
      ? `${BASE_ITEM_PATH}icecream_mint.webp`  // 左薄荷綠球聖代
      : `${BASE_ITEM_PATH}icecream_berry.webp`; // 右藍莓藍球聖代
    return (
      <image
        href={src}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  if (variantKey === 'presence') {
    if (!isLeft) return null;
    return (
      <image
        href={`${BASE_ITEM_PATH}icecream_default.webp`}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  if (variantKey === 'size') {
    const scale = isLeft ? 1.3 : 0.65;
    const curW = w * scale;
    const curH = h * scale;
    const dy = isLeft ? -5 : 6;
    return (
      <image
        href={`${BASE_ITEM_PATH}icecream_default.webp`}
        x={x - curW / 2}
        y={y - curH / 2 + dy}
        width={curW}
        height={curH}
        filter="url(#ghibliShadow)"
      />
    );
  }

  // Default
  return (
    <image
      href={`${BASE_ITEM_PATH}icecream_default.webp`}
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      filter="url(#ghibliShadow)"
    />
  );
};

// 4. 月餅 (moon cake) - 咖啡桌 (765, 495)
export const renderMoonCakeSprite = (variantKey, isLeft) => {
  const x = 765;
  const y = 495;
  const w = 50;
  const h = 38;

  if (variantKey === 'presence') {
    if (!isLeft) return null;
    return (
      <image
        href={`${BASE_ITEM_PATH}mooncake_default.webp`}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  if (variantKey === 'quantity') {
    return (
      <g filter="url(#ghibliShadow)">
        <image
          href={`${BASE_ITEM_PATH}mooncake_default.webp`}
          x={x - w / 2 - 8}
          y={y - h / 2}
          width={w * 0.9}
          height={h * 0.9}
        />
        {isLeft && (
          <image
            href={`${BASE_ITEM_PATH}mooncake_default.webp`}
            x={x - w / 2 + 10}
            y={y - h / 2 - 4}
            width={w * 0.9}
            height={h * 0.9}
          />
        )}
      </g>
    );
  }

  // Default
  return (
    <image
      href={`${BASE_ITEM_PATH}mooncake_default.webp`}
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      filter="url(#ghibliShadow)"
    />
  );
};

// 5. 西瓜 (watermelon) - 水果攤木箱 (315, 470)
export const renderWatermelonSprite = (variantKey, isLeft) => {
  const x = 315;
  const y = 470;
  const w = 56;
  const h = 42;

  if (variantKey === 'color') {
    const src = isLeft
      ? `${BASE_ITEM_PATH}watermelon_default.webp` // 左紅肉西瓜
      : `${BASE_ITEM_PATH}watermelon_yellow.webp`;  // 右小玉黃西瓜
    return (
      <image
        href={src}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  if (variantKey === 'size') {
    const scale = isLeft ? 1.3 : 0.65;
    const curW = w * scale;
    const curH = h * scale;
    const dy = isLeft ? -4 : 6;
    return (
      <image
        href={`${BASE_ITEM_PATH}watermelon_default.webp`}
        x={x - curW / 2}
        y={y - curH / 2 + dy}
        width={curW}
        height={curH}
        filter="url(#ghibliShadow)"
      />
    );
  }

  // Default
  return (
    <image
      href={`${BASE_ITEM_PATH}watermelon_default.webp`}
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      filter="url(#ghibliShadow)"
    />
  );
};

// 6. 漢堡 (hamburger) - 咖啡桌 (830, 510)
export const renderHamburgerSprite = (variantKey, isLeft) => {
  const x = 830;
  const y = 510;
  const w = 54;
  const h = 44;

  if (variantKey === 'presence') {
    if (!isLeft) return null;
    return (
      <image
        href={`${BASE_ITEM_PATH}hamburger_default.webp`}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  if (variantKey === 'size') {
    const scale = isLeft ? 1.3 : 0.65;
    const curW = w * scale;
    const curH = h * scale;
    const dy = isLeft ? -4 : 5;
    return (
      <image
        href={`${BASE_ITEM_PATH}hamburger_default.webp`}
        x={x - curW / 2}
        y={y - curH / 2 + dy}
        width={curW}
        height={curH}
        filter="url(#ghibliShadow)"
      />
    );
  }

  // Default
  return (
    <image
      href={`${BASE_ITEM_PATH}hamburger_default.webp`}
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      filter="url(#ghibliShadow)"
    />
  );
};

// 7. 蘋果 (apple) - 水果攤木箱 (345, 420)
export const renderAppleSprite = (variantKey, isLeft) => {
  const x = 345;
  const y = 420;
  const w = 44;
  const h = 52;

  if (variantKey === 'color') {
    const src = isLeft
      ? `${BASE_ITEM_PATH}apple_default.webp` // 左紅蘋果
      : `${BASE_ITEM_PATH}apple_green.webp`;   // 右青蘋果
    return (
      <image
        href={src}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  if (variantKey === 'quantity') {
    return (
      <g filter="url(#ghibliShadow)">
        <image
          href={`${BASE_ITEM_PATH}apple_default.webp`}
          x={x - w / 2 - 8}
          y={y - h / 2}
          width={w * 0.85}
          height={h * 0.85}
        />
        <image
          href={`${BASE_ITEM_PATH}apple_default.webp`}
          x={x - w / 2 + 10}
          y={y - h / 2 + 2}
          width={w * 0.85}
          height={h * 0.85}
        />
        {isLeft && (
          <image
            href={`${BASE_ITEM_PATH}apple_default.webp`}
            x={x - w / 2 + 1}
            y={y - h / 2 - 10}
            width={w * 0.85}
            height={h * 0.85}
          />
        )}
      </g>
    );
  }

  // Default
  return (
    <image
      href={`${BASE_ITEM_PATH}apple_default.webp`}
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      filter="url(#ghibliShadow)"
    />
  );
};

// 8. 熱狗 (hot dog) - 烘焙坊托盤 (85, 535)
export const renderHotDogSprite = (variantKey, isLeft) => {
  const x = 85;
  const y = 535;
  const w = 58;
  const h = 40;

  if (variantKey === 'presence') {
    if (!isLeft) return null;
    return (
      <image
        href={`${BASE_ITEM_PATH}hotdog_default.webp`}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  if (variantKey === 'quantity') {
    return (
      <g filter="url(#ghibliShadow)">
        <image
          href={`${BASE_ITEM_PATH}hotdog_default.webp`}
          x={x - w / 2}
          y={y - h / 2}
          width={w * 0.9}
          height={h * 0.9}
        />
        {isLeft && (
          <image
            href={`${BASE_ITEM_PATH}hotdog_default.webp`}
            x={x - w / 2 + 12}
            y={y - h / 2 - 8}
            width={w * 0.85}
            height={h * 0.85}
          />
        )}
      </g>
    );
  }

  // Default
  return (
    <image
      href={`${BASE_ITEM_PATH}hotdog_default.webp`}
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      filter="url(#ghibliShadow)"
    />
  );
};

// 9. 香蕉 (banana) - 水果架 (415, 380) 或吊鉤 (415, 310)
export const renderBananaSprite = (variantKey, isLeft) => {
  const isMoved = variantKey === 'displacement' && !isLeft;
  const x = 415;
  const y = isMoved ? 310 : 380;
  const w = 56;
  const h = 50;

  if (variantKey === 'color') {
    const src = isLeft
      ? `${BASE_ITEM_PATH}banana_default.webp` // 左成熟黃香蕉
      : `${BASE_ITEM_PATH}banana_green.webp`;   // 右青綠未熟香蕉
    return (
      <image
        href={src}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  // Default & displacement
  return (
    <g filter="url(#ghibliShadow)">
      {isMoved && (
        <line x1={x} y1={y - 25} x2={x} y2={y - 8} stroke="#78350f" strokeWidth="2.5" strokeDasharray="2 2" />
      )}
      <image
        href={`${BASE_ITEM_PATH}banana_default.webp`}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
      />
    </g>
  );
};

// 10. 十六 (sixteen) - 烘焙坊門牌 (200, 250)
export const renderSixteenSprite = (variantKey, isLeft) => {
  const x = 200;
  const y = 250;
  const w = 52;
  const h = 46;

  if (variantKey === 'text') {
    const src = isLeft
      ? `${BASE_ITEM_PATH}sixteen_default.webp` // 左 16 號牌
      : `${BASE_ITEM_PATH}sixteen_20.webp`;      // 右 20 號牌
    return (
      <image
        href={src}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  if (variantKey === 'color') {
    const src = isLeft
      ? `${BASE_ITEM_PATH}sixteen_default.webp` // 左古銅金
      : `${BASE_ITEM_PATH}sixteen_blue.webp`;    // 右深藍色
    return (
      <image
        href={src}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  // Default
  return (
    <image
      href={`${BASE_ITEM_PATH}sixteen_default.webp`}
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      filter="url(#ghibliShadow)"
    />
  );
};

// 11. 披薩 (pizza) - 廣場餐桌 (570, 450)
export const renderPizzaSprite = (variantKey, isLeft) => {
  const x = 570;
  const y = 450;
  const w = 56;
  const h = 40;

  if (variantKey === 'presence') {
    if (!isLeft) return null;
    return (
      <image
        href={`${BASE_ITEM_PATH}pizza_default.webp`}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  if (variantKey === 'quantity') {
    return (
      <g filter="url(#ghibliShadow)">
        <image
          href={`${BASE_ITEM_PATH}pizza_default.webp`}
          x={x - w / 2 - 4}
          y={y - h / 2}
          width={w * 0.9}
          height={h * 0.9}
        />
        {isLeft && (
          <image
            href={`${BASE_ITEM_PATH}pizza_default.webp`}
            x={x - w / 2 + 10}
            y={y - h / 2 - 6}
            width={w * 0.85}
            height={h * 0.85}
          />
        )}
      </g>
    );
  }

  // Default
  return (
    <image
      href={`${BASE_ITEM_PATH}pizza_default.webp`}
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      filter="url(#ghibliShadow)"
    />
  );
};

// 12. 蛋糕 (cake) - 烘焙坊展櫃 (195, 425)
export const renderCakeSprite = (variantKey, isLeft) => {
  const x = 195;
  const y = 425;
  const w = 52;
  const h = 54;

  if (variantKey === 'color') {
    const src = isLeft
      ? `${BASE_ITEM_PATH}cake_default.webp`   // 左草莓鮮奶油蛋糕
      : `${BASE_ITEM_PATH}cake_chocolate.webp`; // 右黑巧克力蛋糕
    return (
      <image
        href={src}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  if (variantKey === 'presence') {
    if (!isLeft) return null;
    return (
      <image
        href={`${BASE_ITEM_PATH}cake_default.webp`}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  // Default
  return (
    <image
      href={`${BASE_ITEM_PATH}cake_default.webp`}
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      filter="url(#ghibliShadow)"
    />
  );
};

// 13. 三明治 (sandwich) - 烘焙坊櫃台 (130, 455)
export const renderSandwichSprite = (variantKey, isLeft) => {
  const x = 130;
  const y = 455;
  const w = 52;
  const h = 48;

  if (variantKey === 'presence') {
    if (!isLeft) return null;
    return (
      <image
        href={`${BASE_ITEM_PATH}sandwich_default.webp`}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  if (variantKey === 'quantity') {
    return (
      <g filter="url(#ghibliShadow)">
        <image
          href={`${BASE_ITEM_PATH}sandwich_default.webp`}
          x={x - w / 2}
          y={y - h / 2}
          width={w * 0.9}
          height={h * 0.9}
        />
        {isLeft && (
          <image
            href={`${BASE_ITEM_PATH}sandwich_default.webp`}
            x={x - w / 2 + 10}
            y={y - h / 2 - 8}
            width={w * 0.85}
            height={h * 0.85}
          />
        )}
      </g>
    );
  }

  // Default
  return (
    <image
      href={`${BASE_ITEM_PATH}sandwich_default.webp`}
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      filter="url(#ghibliShadow)"
    />
  );
};

// 14. 牛奶 (milk) - 咖啡邊桌 (735, 450)
export const renderMilkSprite = (variantKey, isLeft) => {
  const x = 735;
  const y = 450;
  const w = 28;
  const h = 62;

  if (variantKey === 'color') {
    const src = isLeft
      ? `${BASE_ITEM_PATH}milk_default.webp` // 左純白鮮乳
      : `${BASE_ITEM_PATH}milk_pink.webp`;    // 右草莓調味乳
    return (
      <image
        href={src}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  if (variantKey === 'presence') {
    if (!isLeft) return null;
    return (
      <image
        href={`${BASE_ITEM_PATH}milk_default.webp`}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  // Default
  return (
    <image
      href={`${BASE_ITEM_PATH}milk_default.webp`}
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      filter="url(#ghibliShadow)"
    />
  );
};

// 15. 水 (water) - 咖啡桌 (795, 460)
export const renderWaterSprite = (variantKey, isLeft) => {
  const x = 795;
  const y = 460;
  const w = 38;
  const h = 52;

  if (variantKey === 'color') {
    const src = isLeft
      ? `${BASE_ITEM_PATH}water_default.webp` // 左清澈純水
      : `${BASE_ITEM_PATH}water_purple.webp`;  // 右蝶豆花紫水
    return (
      <image
        href={src}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  if (variantKey === 'presence') {
    if (!isLeft) return null;
    return (
      <image
        href={`${BASE_ITEM_PATH}water_default.webp`}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  // Default
  return (
    <image
      href={`${BASE_ITEM_PATH}water_default.webp`}
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      filter="url(#ghibliShadow)"
    />
  );
};

// 16. 柳橙 (orange) - 水果攤編織籃 (385, 455)
export const renderOrangeSprite = (variantKey, isLeft) => {
  const x = 385;
  const y = 455;
  const w = 46;
  const h = 52;

  if (variantKey === 'presence') {
    if (!isLeft) return null;
    return (
      <image
        href={`${BASE_ITEM_PATH}orange_default.webp`}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  if (variantKey === 'quantity') {
    return (
      <g filter="url(#ghibliShadow)">
        <image
          href={`${BASE_ITEM_PATH}orange_default.webp`}
          x={x - w / 2 - 8}
          y={y - h / 2}
          width={w * 0.85}
          height={h * 0.85}
        />
        {isLeft && (
          <image
            href={`${BASE_ITEM_PATH}orange_default.webp`}
            x={x - w / 2 + 8}
            y={y - h / 2 - 6}
            width={w * 0.85}
            height={h * 0.85}
          />
        )}
      </g>
    );
  }

  // Default
  return (
    <image
      href={`${BASE_ITEM_PATH}orange_default.webp`}
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      filter="url(#ghibliShadow)"
    />
  );
};

// 17. 柚子 (pomelo) - 水果攤木箱旁 (415, 490)
export const renderPomeloSprite = (variantKey, isLeft) => {
  const x = 415;
  const y = 490;
  const w = 46;
  const h = 58;

  if (variantKey === 'size') {
    const scale = isLeft ? 1.3 : 0.65;
    const curW = w * scale;
    const curH = h * scale;
    const dy = isLeft ? -5 : 6;
    return (
      <image
        href={`${BASE_ITEM_PATH}pomelo_default.webp`}
        x={x - curW / 2}
        y={y - curH / 2 + dy}
        width={curW}
        height={curH}
        filter="url(#ghibliShadow)"
      />
    );
  }

  if (variantKey === 'presence') {
    if (!isLeft) return null;
    return (
      <image
        href={`${BASE_ITEM_PATH}pomelo_default.webp`}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  // Default
  return (
    <image
      href={`${BASE_ITEM_PATH}pomelo_default.webp`}
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      filter="url(#ghibliShadow)"
    />
  );
};

// 18. 米飯 (rice) - 廣場餐桌 (520, 465)
export const renderRiceSprite = (variantKey, isLeft) => {
  const x = 520;
  const y = 465;
  const w = 52;
  const h = 54;

  if (variantKey === 'presence') {
    if (!isLeft) return null;
    return (
      <image
        href={`${BASE_ITEM_PATH}rice_default.webp`}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        filter="url(#ghibliShadow)"
      />
    );
  }

  if (variantKey === 'quantity') {
    return (
      <g filter="url(#ghibliShadow)">
        <image
          href={`${BASE_ITEM_PATH}rice_default.webp`}
          x={x - w / 2}
          y={y - h / 2}
          width={w * 0.9}
          height={h * 0.9}
        />
        {isLeft && (
          <image
            href={`${BASE_ITEM_PATH}rice_default.webp`}
            x={x - w / 2 + 10}
            y={y - h / 2 - 8}
            width={w * 0.85}
            height={h * 0.85}
          />
        )}
      </g>
    );
  }

  // Default
  return (
    <image
      href={`${BASE_ITEM_PATH}rice_default.webp`}
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      filter="url(#ghibliShadow)"
    />
  );
};

// 19. 晴天太陽 (sunny) - 天空 (440, 65)
export const renderSunnySprite = (variantKey, isLeft) => {
  const x = 440;
  const y = 65;
  const w = 70;
  const h = 70;

  if (variantKey === 'symbol') {
    const src = isLeft
      ? `${BASE_ITEM_PATH}sunny_default.webp`    // 左微笑太陽
      : `${BASE_ITEM_PATH}sunny_sunglasses.webp`; // 右酷墨鏡太陽
    return (
      <image
        href={src}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
      />
    );
  }

  if (variantKey === 'color') {
    const src = isLeft
      ? `${BASE_ITEM_PATH}sunny_default.webp` // 左金黃太陽
      : `${BASE_ITEM_PATH}sunny_crimson.webp`; // 右火紅夕陽
    return (
      <image
        href={src}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
      />
    );
  }

  // Default
  return (
    <image
      href={`${BASE_ITEM_PATH}sunny_default.webp`}
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
    />
  );
};

// 20. 多雲 (cloudy) - 天空 (630, 75)
export const renderCloudySprite = (variantKey, isLeft) => {
  const x = 630;
  const y = 75;
  const w = 76;
  const h = 46;

  if (variantKey === 'quantity') {
    return (
      <g>
        <image
          href={`${BASE_ITEM_PATH}cloudy_default.webp`}
          x={x - w / 2}
          y={y - h / 2}
          width={w}
          height={h}
        />
        {isLeft && (
          <image
            href={`${BASE_ITEM_PATH}cloudy_default.webp`}
            x={x - w / 2 + 25}
            y={y - h / 2 - 14}
            width={w * 0.7}
            height={h * 0.7}
            opacity="0.9"
          />
        )}
      </g>
    );
  }

  if (variantKey === 'color') {
    const src = isLeft
      ? `${BASE_ITEM_PATH}cloudy_default.webp` // 左雪白晴雲
      : `${BASE_ITEM_PATH}cloudy_gray.webp`;    // 右暗灰雨雲
    return (
      <image
        href={src}
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
      />
    );
  }

  // Default
  return (
    <image
      href={`${BASE_ITEM_PATH}cloudy_default.webp`}
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
    />
  );
};

// ── 20 大目標單字繪製映射表 ──
export const SPRITE_RENDERERS = {
  juice: renderJuiceSprite,
  tea: renderTeaSprite,
  'ice cream': renderIceCreamSprite,
  'moon cake': renderMoonCakeSprite,
  watermelon: renderWatermelonSprite,
  hamburger: renderHamburgerSprite,
  apple: renderAppleSprite,
  'hot dog': renderHotDogSprite,
  banana: renderBananaSprite,
  sixteen: renderSixteenSprite,
  pizza: renderPizzaSprite,
  cake: renderCakeSprite,
  sandwich: renderSandwichSprite,
  milk: renderMilkSprite,
  water: renderWaterSprite,
  orange: renderOrangeSprite,
  pomelo: renderPomeloSprite,
  rice: renderRiceSprite,
  sunny: renderSunnySprite,
  cloudy: renderCloudySprite
};
