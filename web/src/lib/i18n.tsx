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
