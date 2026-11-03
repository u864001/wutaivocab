/**
 * 霧臺國小 學生背包道具自動摺疊、堆疊與全域元數據解析模組
 * 1. 徹底消滅「無名快遞紙箱 📦」：自動將字串 ID 映射為真實神山寶物 (陶甕 🏺, 禮刀 🗡️, 琉璃珠 📿, 蜜蘋果 🍎 等)
 * 2. 道具摺疊堆疊：同類道具自動摺疊堆疊，在右下角以 xN 數量角標呈現
 * 3. 概括統計：提供通行證快速概括（幾類幾樣），杜絕冗長橫向捲軸
 */

import { TOWN_ITEMS } from '../games/town/townData.js';

// 建立全域知名道具字典 (ID、中文名、英文名多重索引)
const KNOWN_ITEMS_MAP = new Map();
if (Array.isArray(TOWN_ITEMS)) {
  TOWN_ITEMS.forEach((it) => {
    if (it.id) KNOWN_ITEMS_MAP.set(it.id, it);
    if (it.nameZh) KNOWN_ITEMS_MAP.set(it.nameZh, it);
    if (it.nameEn) KNOWN_ITEMS_MAP.set(it.nameEn.toLowerCase(), it);
  });
}

// 額外原民神山文化寶物與寶箱
const EXTRA_ITEMS = {
  treasure_box: {
    id: 'treasure_box',
    nameZh: '守護者寶箱',
    nameEn: 'Guardian Treasure Chest',
    price: 100,
    icon: '🎁',
    category: 'special',
    description: '大武山守護者頒贈的榮譽寶箱，蘊藏滿滿祝福。'
  },
  mountain_gem: {
    id: 'mountain_gem',
    nameZh: '神山七彩寶石',
    nameEn: 'Sacred Mountain Gem',
    price: 80,
    icon: '💎',
    category: 'special',
    description: '在神山溪谷中採得的晶瑩寶石，泛出璀璨光芒。'
  }
};
Object.values(EXTRA_ITEMS).forEach((it) => {
  KNOWN_ITEMS_MAP.set(it.id, it);
  KNOWN_ITEMS_MAP.set(it.nameZh, it);
});

// 常見舊版字串或簡易別名對照表 (確保所有歷史物品都能匹配出正確美觀圖標)
const ALIASES = {
  pencil: 'pencil_item',
  eraser: 'eraser_item',
  ruler: 'ruler_item',
  marker: 'marker_item',
  workbook: 'workbook_item',
  backpack: 'backpack_item',
  apple: 'apple_item',
  banana: 'banana_item',
  sandwich: 'sandwich_item',
  milk: 'milk_item',
  juice: 'juice_item',
  pizza: 'pizza_item',
  ticket: 'bus_ticket',
  busticket: 'bus_ticket',
  trainticket: 'train_ticket',
  bell: 'bicycle_bell',
  lozenge: 'throat_lozenge',
  candy: 'throat_lozenge',
  patch: 'cooling_patch',
  bottle: 'water_bottle_item',
  lily: 'lily_badge',
  bead: 'glass_bead',
  necklace: 'glass_bead',
  hat: 'warrior_hat',
  tshirt: 'totem_tshirt',
  pottery: 'sacred_urn',
  urn: 'sacred_urn',
  knife: 'ceremonial_knife',
  sword: 'ceremonial_knife',
  feather: 'eagle_feather',
  box: 'treasure_box',
  reward_box: 'treasure_box',
  item_1: 'sacred_urn',
  item_2: 'ceremonial_knife',
  item_3: 'eagle_feather',
  item_4: 'glass_bead'
};

/**
 * 解析單件道具之完整元數據（告別紙箱）
 */
export const resolveItemMetadata = (rawItem) => {
  if (!rawItem) return null;

  if (typeof rawItem === 'string') {
    const trimmed = rawItem.trim();
    const aliasTarget = ALIASES[trimmed.toLowerCase()] || trimmed;
    const matched = KNOWN_ITEMS_MAP.get(aliasTarget) || KNOWN_ITEMS_MAP.get(trimmed);
    if (matched) {
      return { ...matched, count: 1 };
    }
    // 兜底保護：若為未知字串，給予「神山珍寶」形象，絕對不使用紙箱 📦
    return {
      id: trimmed,
      nameZh: trimmed.startsWith('item_') ? '神山守護古物' : trimmed,
      nameEn: 'Mountain Relic',
      price: 50,
      icon: '🏺',
      category: 'special',
      description: '深藏在大武山林之中的神秘原民珍寶，散發歷史氣息。',
      count: 1
    };
  }

  // 若為物件
  const id = rawItem.id || rawItem.nameZh || rawItem.name;
  const aliasTarget = typeof id === 'string' ? (ALIASES[id.toLowerCase()] || id) : id;
  const matched = KNOWN_ITEMS_MAP.get(aliasTarget) || KNOWN_ITEMS_MAP.get(id);

  const icon = (rawItem.icon && rawItem.icon !== '📦') ? rawItem.icon : (matched?.icon || '🏺');
  const nameZh = rawItem.nameZh || rawItem.name || matched?.nameZh || '神山寶物';
  const nameEn = rawItem.nameEn || matched?.nameEn || 'Mountain Treasure';
  const category = rawItem.category || matched?.category || 'special';
  const description = rawItem.description || matched?.description || '深藏在大武山林之中的神秘原民珍寶。';

  return {
    ...rawItem,
    id: id || 'curio_item',
    nameZh,
    nameEn,
    icon,
    category,
    description,
    count: rawItem.count || 1
  };
};

/**
 * 道具列表自動摺疊分組（自動解析真實元數據並堆疊）
 */
export const groupInventoryItems = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) return [];

  const map = new Map();

  items.forEach((item) => {
    if (!item) return;

    const resolved = resolveItemMetadata(item);
    if (!resolved) return;

    const key = resolved.id || resolved.nameZh;
    const existing = map.get(key);

    if (existing) {
      existing.count += (resolved.count || 1);
    } else {
      map.set(key, { ...resolved });
    }
  });

  return Array.from(map.values());
};

/**
 * 取得特定道具在學生背包中的總持有數量
 */
export const getItemQuantity = (items = [], itemOrId) => {
  if (!Array.isArray(items) || items.length === 0 || !itemOrId) return 0;
  const targetId = typeof itemOrId === 'string' ? itemOrId : (itemOrId.id || itemOrId.nameZh);

  return items.reduce((total, it) => {
    if (!it) return total;
    const itId = typeof it === 'string' ? it : (it.id || it.nameZh);
    if (itId === targetId) {
      return total + (it.count || 1);
    }
    return total;
  }, 0);
};

/**
 * 取得背包概括統計數據（供個人通行證單頁展示，免滾動條）
 */
export const getInventorySummary = (items = []) => {
  const grouped = groupInventoryItems(items);
  const totalCount = items.length;
  const categories = new Set(grouped.map(it => it.category || 'special'));

  // 取得主要分類統計
  const categoryMap = {
    special: '部落珍寶',
    stationery: '學習文具',
    food: '山林美食',
    clothing: '守護裝備',
    ticket: '客運聯票'
  };

  return {
    totalCount,
    categoryCount: categories.size,
    groupedCount: grouped.length,
    categoryNames: Array.from(categories).map(cat => categoryMap[cat] || '珍寶')
  };
};
