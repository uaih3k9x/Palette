import { createContext, useContext, useState, ReactNode } from 'react';

export type Locale = 'en' | 'zh';

const translations = {
  en: {
    'app.title': 'Palette — Glaze Lab',
    'auth.title': 'Palette',
    'auth.subtitle': 'Glaze Lab',
    'auth.tagline': "Pottery can't be rushed",
    'auth.username': 'Username',
    'auth.placeholder': 'Enter your username',
    'auth.error': 'Username must be 3-16 characters',
    'auth.start': 'Start',
    'auth.info': 'New players start at Level 1 with 3 minerals and 1 firing slot',
    'player.maxLevel': 'Max Level',
    'player.logout': 'Logout',
    'player.gold': 'Gold',
    'firing.title': 'Firing Slots',
    'firing.available': 'Available',
    'firing.ready': 'Ready to Collect',
    'firing.slot': 'Slot',
    'firing.collect': 'Collect',
    'mode.fixed': 'Fixed Orders',
    'mode.random': 'Daily Random',
    'mode.levelTree': 'Level Tree',
    'workbench.title': 'Recipe',
    'workbench.add': '+ Add mineral…',
    'kiln.title': 'Kiln',
    'kiln.temperature': 'Temperature',
    'kiln.thickness': 'Thickness',
    'kiln.coolingRate': 'Cooling Rate',
    'kiln.clayWarmth': 'Clay Warmth',
    'kiln.variance': 'Variance',
    'kiln.atmosphere': 'Atmosphere',
    'kiln.seed': 'Seed',
    'kiln.slotsFull': 'All firing slots are full',
    'order.label': 'Order',
    'order.roughness': 'Roughness',
    'order.speckle': 'Speckle',
    'order.mottling': 'Mottling',
    'order.pts': 'pts',
    'order.submitFromPortfolio': 'Submit from Portfolio',
    'order.submitted': 'Submitted',
    'result.empty': 'Fire the kiln to see results.',
    'result.withinTolerance': 'Within Tolerance',
    'result.colorDist': 'Color Distance',
    'result.surfaceDist': 'Surface Distance',
    'result.burnRisk': 'Burn Risk',
    'result.stability': 'Stability',
    'level.title': 'Level Progression',
    'level.current': '(Current)',
    'level.minerals': 'Minerals',
    'level.slots': 'Slots',
    'level.time': 'Time',
    'level.max': 'Max Level — All Content Unlocked',
    'debug.title': 'Debug Panel',
    'debug.timeAccel': 'Time Acceleration',
    'debug.apply': 'Apply',
    'debug.speed': 'speed (requires reload)',
    'debug.clearAll': 'Clear All Data',
    'debug.clearDesc': 'Clears player profile and firing slots',
    'debug.confirmClear': 'Clear all data? This will delete your player profile and firing slots.',
    'startFiring': 'Start Firing',
    // Tab navigation
    'tab.orders': 'Orders',
    'tab.portfolio': 'Portfolio',
    'tab.recipeBook': 'Recipes',
    'tab.shop': 'Shop',
    'tab.auction': 'Auction',
    // Portfolio
    'portfolio.title': 'Portfolio',
    'portfolio.empty': 'No saved pieces yet. Fire the kiln and save your work!',
    'portfolio.score': 'Score',
    'portfolio.date': 'Date',
    'portfolio.submitOrder': 'Submit to Order',
    'portfolio.sellNpc': 'Sell to NPC',
    'portfolio.listAuction': 'List for Auction',
    'portfolio.delete': 'Delete',
    'portfolio.quality': 'Quality',
    'portfolio.confirmDelete': 'Delete this piece?',
    // Portfolio Save Dialog
    'save.title': 'Save to Portfolio?',
    'save.desc': 'Would you like to save this piece to your portfolio?',
    'save.yes': 'Save',
    'save.no': 'Discard',
    // Recipe Book
    'recipe.title': 'Recipe Book',
    'recipe.empty': 'No saved recipes yet.',
    'recipe.saveCurrent': 'Save Current Recipe',
    'recipe.nameLabel': 'Recipe Name',
    'recipe.namePlaceholder': 'Enter recipe name...',
    'recipe.load': 'Load',
    'recipe.delete': 'Delete',
    'recipe.share': 'Share',
    'recipe.import': 'Import Recipe',
    'recipe.importPlaceholder': 'Paste share code...',
    'recipe.importBtn': 'Import',
    'recipe.importError': 'Invalid share code',
    'recipe.copied': 'Copied!',
    'recipe.confirmDelete': 'Delete this recipe?',
    // Auction
    'auction.title': 'Auction House',
    'auction.empty': 'No active auctions.',
    'auction.collect': 'Collect',
    'auction.inProgress': 'In Progress',
    'auction.estimatedPrice': 'Est. Price',
    // Shop
    'shop.title': 'Shop',
    'shop.buy': 'Buy',
    'shop.owned': 'Owned',
    'shop.notEnoughGold': 'Not enough gold',
    'shop.minerals': 'Minerals',
    'shop.slots': 'Extra Slots',
    'shop.empty': 'Nothing available to purchase.',
    // Economy
    'economy.goldEarned': 'Earned',
    'economy.npcPrice': 'NPC Price',
    // Intuition
    'intuition.label': 'Intuition',
    'intuition.accuracy': 'Accuracy',
    // Calendar
    'tab.calendar': 'Calendar',
    'calendar.title': 'Schedule',
    'calendar.sleep': 'Sleep until next event',
    'calendar.noEvents': 'No pending events',
    'calendar.firingDue': 'Firing ready',
    'calendar.auctionDue': 'Auction ends',
    // Level Tree extras
    'level.label': 'Level',
    'level.unlocks.manganese': 'Unlocks: Manganese Dioxide',
    'level.unlocks.slot2': 'Unlocks: 2nd Firing Slot',
    'level.unlocks.cobalt': 'Unlocks: Cobalt Oxide',
    'level.unlocks.chromiumSlot3': 'Unlocks: Chromium Oxide + 3rd Slot',
    'level.unlocks.slot4': 'Unlocks: 4th Firing Slot',
    // Debug extras
    'debug.speedNormal': '1x (Normal)',
    'debug.speed60': '60x (1min = 1s)',
    'debug.speed360': '360x (1h = 10s)',
    'debug.speed2880': '2880x (8h = 10s)',
    'debug.current': 'Current',
    // Atmosphere
    'kiln.oxidation': 'Oxidation',
    'kiln.neutral': 'Neutral',
    'kiln.reduction': 'Reduction',
    // Misc
    'levelTree.hide': 'Hide',
    'levelTree.show': 'Show',
    'unit.gold': 'g',
    'recipe.mineralCount': 'minerals',
    // Difficulty
    'difficulty.easy': 'Easy',
    'difficulty.medium': 'Medium',
    'difficulty.hard': 'Hard',
  },
  zh: {
    'app.title': 'Palette — 釉料实验室',
    'auth.title': 'Palette',
    'auth.subtitle': '釉料实验室',
    'auth.tagline': '烧陶器不能急眼',
    'auth.username': '用户名',
    'auth.placeholder': '输入你的用户名',
    'auth.error': '用户名需要 3-16 个字符',
    'auth.start': '开始',
    'auth.info': '新玩家从 1 级开始，拥有 3 种矿物和 1 个烧制槽位',
    'player.maxLevel': '满级',
    'player.logout': '登出',
    'player.gold': '金币',
    'firing.title': '烧制槽位',
    'firing.available': '空闲',
    'firing.ready': '可收取',
    'firing.slot': '槽位',
    'firing.collect': '收取',
    'mode.fixed': '固定订单',
    'mode.random': '每日随机',
    'mode.levelTree': '升级树',
    'workbench.title': '配方',
    'workbench.add': '+ 添加矿物…',
    'kiln.title': '窑炉',
    'kiln.temperature': '温度',
    'kiln.thickness': '厚度',
    'kiln.coolingRate': '冷却速率',
    'kiln.clayWarmth': '陶土温度',
    'kiln.variance': '变化度',
    'kiln.atmosphere': '气氛',
    'kiln.seed': '种子',
    'kiln.slotsFull': '所有槽位已满',
    'order.label': '订单',
    'order.roughness': '粗糙度',
    'order.speckle': '斑点',
    'order.mottling': '斑驳',
    'order.pts': '分',
    'order.submitFromPortfolio': '从作品集提交',
    'order.submitted': '已交单',
    'result.empty': '烧制窑炉以查看结果。',
    'result.withinTolerance': '在容差范围内',
    'result.colorDist': '色彩距离',
    'result.surfaceDist': '表面距离',
    'result.burnRisk': '烧毁风险',
    'result.stability': '稳定性',
    'level.title': '等级进度',
    'level.current': '(当前)',
    'level.minerals': '矿物',
    'level.slots': '槽位',
    'level.time': '时间',
    'level.max': '满级 — 全部内容已解锁',
    'debug.title': '调试面板',
    'debug.timeAccel': '时间加速',
    'debug.apply': '应用',
    'debug.speed': '倍速（需刷新）',
    'debug.clearAll': '清空数据',
    'debug.clearDesc': '清除玩家档案和烧制槽位',
    'debug.confirmClear': '确定清空所有数据？将删除玩家档案和烧制槽位。',
    'startFiring': '开始烧制',
    // Tab navigation
    'tab.orders': '订单',
    'tab.portfolio': '作品集',
    'tab.recipeBook': '配方书',
    'tab.shop': '商店',
    'tab.auction': '拍卖',
    // Portfolio
    'portfolio.title': '作品集',
    'portfolio.empty': '还没有保存的作品。烧制窑炉并保存你的作品！',
    'portfolio.score': '评分',
    'portfolio.date': '日期',
    'portfolio.submitOrder': '提交到订单',
    'portfolio.sellNpc': '卖给NPC',
    'portfolio.listAuction': '上架拍卖',
    'portfolio.delete': '删除',
    'portfolio.quality': '品质',
    'portfolio.confirmDelete': '删除这件作品？',
    // Portfolio Save Dialog
    'save.title': '保存到作品集？',
    'save.desc': '是否将这件作品保存到你的作品集？',
    'save.yes': '保存',
    'save.no': '丢弃',
    // Recipe Book
    'recipe.title': '配方书',
    'recipe.empty': '还没有保存的配方。',
    'recipe.saveCurrent': '保存当前配方',
    'recipe.nameLabel': '配方名称',
    'recipe.namePlaceholder': '输入配方名称…',
    'recipe.load': '加载',
    'recipe.delete': '删除',
    'recipe.share': '分享',
    'recipe.import': '导入配方',
    'recipe.importPlaceholder': '粘贴分享码…',
    'recipe.importBtn': '导入',
    'recipe.importError': '无效的分享码',
    'recipe.copied': '已复制！',
    'recipe.confirmDelete': '删除此配方？',
    // Auction
    'auction.title': '拍卖行',
    'auction.empty': '没有进行中的拍卖。',
    'auction.collect': '收取',
    'auction.inProgress': '进行中',
    'auction.estimatedPrice': '预估价格',
    // Shop
    'shop.title': '商店',
    'shop.buy': '购买',
    'shop.owned': '已拥有',
    'shop.notEnoughGold': '金币不足',
    'shop.minerals': '矿物',
    'shop.slots': '额外槽位',
    'shop.empty': '没有可购买的商品。',
    // Economy
    'economy.goldEarned': '获得',
    'economy.npcPrice': 'NPC价格',
    // Intuition
    'intuition.label': '直觉',
    'intuition.accuracy': '精度',
    // Calendar
    'tab.calendar': '日历',
    'calendar.title': '日程',
    'calendar.sleep': '休眠至下一事件',
    'calendar.noEvents': '没有进行中的事件',
    'calendar.firingDue': '烧制完成',
    'calendar.auctionDue': '拍卖结束',
    // Level Tree extras
    'level.label': '等级',
    'level.unlocks.manganese': '解锁：二氧化锰',
    'level.unlocks.slot2': '解锁：第2个烧制槽位',
    'level.unlocks.cobalt': '解锁：氧化钴',
    'level.unlocks.chromiumSlot3': '解锁：氧化铬 + 第3个槽位',
    'level.unlocks.slot4': '解锁：第4个烧制槽位',
    // Debug extras
    'debug.speedNormal': '1x（正常）',
    'debug.speed60': '60x（1分=1秒）',
    'debug.speed360': '360x（1小时=10秒）',
    'debug.speed2880': '2880x（8小时=10秒）',
    'debug.current': '当前',
    // Atmosphere
    'kiln.oxidation': '氧化',
    'kiln.neutral': '中性',
    'kiln.reduction': '还原',
    // Misc
    'levelTree.hide': '隐藏',
    'levelTree.show': '显示',
    'unit.gold': '金',
    'recipe.mineralCount': '种矿物',
    // Difficulty
    'difficulty.easy': '简单',
    'difficulty.medium': '中等',
    'difficulty.hard': '困难',
  },
} as const;

type TranslationKey = keyof typeof translations.en;

const LOCALE_KEY = 'palette_locale';

export function getLocale(): Locale {
  const stored = localStorage.getItem(LOCALE_KEY);
  return (stored === 'zh' ? 'zh' : 'en') as Locale;
}

export function setLocale(locale: Locale): void {
  localStorage.setItem(LOCALE_KEY, locale);
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getLocale);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    setLocaleState(newLocale);
  };

  const t = (key: TranslationKey): string => {
    return translations[locale][key] || key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
