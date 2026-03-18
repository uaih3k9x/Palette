import { StarterMineralKind, MineralStack, KilnSettings } from './glaze';

export interface PlayerProfile {
  username: string;
  level: number;
  xp: number;
  unlockedMinerals: StarterMineralKind[];
  maxRecipeSlots: number;
  createdAt: number;
}

export interface FiringSlot {
  id: number;
  recipe: MineralStack[];
  kiln: KilnSettings;
  startedAt: number;
  durationMs: number;
  orderIndex: number;
  orderMode: 'fixed' | 'random';
  randomSeed?: number;
  randomDifficulty?: 'easy' | 'medium' | 'hard';
}

interface LevelConfig {
  xpRequired: number;
  minerals: StarterMineralKind[];
  slots: number;
  durationHours: number;
}

const LEVEL_TABLE: Record<number, LevelConfig> = {
  1: { xpRequired: 0, minerals: ['IronOxide', 'TitaniumDioxide', 'CopperCarbonate'], slots: 1, durationHours: 8 },
  2: { xpRequired: 100, minerals: ['IronOxide', 'TitaniumDioxide', 'CopperCarbonate', 'ManganeseDioxide'], slots: 1, durationHours: 7.5 },
  3: { xpRequired: 250, minerals: ['IronOxide', 'TitaniumDioxide', 'CopperCarbonate', 'ManganeseDioxide'], slots: 2, durationHours: 7 },
  4: { xpRequired: 450, minerals: ['IronOxide', 'TitaniumDioxide', 'CopperCarbonate', 'ManganeseDioxide', 'CobaltOxide'], slots: 2, durationHours: 6.5 },
  5: { xpRequired: 700, minerals: ['IronOxide', 'TitaniumDioxide', 'CopperCarbonate', 'ManganeseDioxide', 'CobaltOxide'], slots: 2, durationHours: 6 },
  6: { xpRequired: 1000, minerals: ['IronOxide', 'TitaniumDioxide', 'CopperCarbonate', 'ManganeseDioxide', 'CobaltOxide', 'ChromiumOxide'], slots: 3, durationHours: 5.5 },
  7: { xpRequired: 1400, minerals: ['IronOxide', 'TitaniumDioxide', 'CopperCarbonate', 'ManganeseDioxide', 'CobaltOxide', 'ChromiumOxide'], slots: 3, durationHours: 5 },
  8: { xpRequired: 1900, minerals: ['IronOxide', 'TitaniumDioxide', 'CopperCarbonate', 'ManganeseDioxide', 'CobaltOxide', 'ChromiumOxide'], slots: 3, durationHours: 4.5 },
  9: { xpRequired: 2500, minerals: ['IronOxide', 'TitaniumDioxide', 'CopperCarbonate', 'ManganeseDioxide', 'CobaltOxide', 'ChromiumOxide'], slots: 4, durationHours: 4 },
  10: { xpRequired: 3200, minerals: ['IronOxide', 'TitaniumDioxide', 'CopperCarbonate', 'ManganeseDioxide', 'CobaltOxide', 'ChromiumOxide'], slots: 4, durationHours: 3.5 },
};

export function createPlayer(username: string): PlayerProfile {
  return {
    username,
    level: 1,
    xp: 0,
    unlockedMinerals: LEVEL_TABLE[1].minerals,
    maxRecipeSlots: LEVEL_TABLE[1].slots,
    createdAt: Date.now(),
  };
}

export function savePlayer(p: PlayerProfile): void {
  localStorage.setItem('palette_player', JSON.stringify(p));
}

export function loadPlayer(): PlayerProfile | null {
  const data = localStorage.getItem('palette_player');
  return data ? JSON.parse(data) : null;
}

export function awardXP(p: PlayerProfile, xp: number): PlayerProfile {
  const updated = { ...p, xp: p.xp + xp };

  // Check for level up
  for (let level = p.level + 1; level <= 10; level++) {
    if (updated.xp >= LEVEL_TABLE[level].xpRequired) {
      updated.level = level;
      updated.unlockedMinerals = LEVEL_TABLE[level].minerals;
      updated.maxRecipeSlots = LEVEL_TABLE[level].slots;
    } else {
      break;
    }
  }

  return updated;
}

export function getLevelConfig(level: number): LevelConfig {
  return LEVEL_TABLE[Math.min(10, Math.max(1, level))];
}

export function saveFiringSlots(slots: FiringSlot[]): void {
  localStorage.setItem('palette_firings', JSON.stringify(slots));
}

export function loadFiringSlots(): FiringSlot[] {
  const data = localStorage.getItem('palette_firings');
  return data ? JSON.parse(data) : [];
}

export function isFiringComplete(slot: FiringSlot): boolean {
  const speedMultiplier = getTestSpeedMultiplier();
  const adjustedDuration = slot.durationMs / speedMultiplier;
  return Date.now() >= slot.startedAt + adjustedDuration;
}

export function getXPForScore(score: number, difficulty: 'easy' | 'medium' | 'hard'): number {
  const baseXP = Math.floor(score);
  const multiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
  return Math.floor(baseXP * multiplier);
}

// Test acceleration (set to 1 for production, higher for testing)
// e.g., 360 = 1 hour becomes 10 seconds
export function getTestSpeedMultiplier(): number {
  return +(localStorage.getItem('palette_test_speed') || '1');
}

export function setTestSpeedMultiplier(multiplier: number): void {
  localStorage.setItem('palette_test_speed', multiplier.toString());
}

export function getRemainingTime(slot: FiringSlot): number {
  const speedMultiplier = getTestSpeedMultiplier();
  const adjustedDuration = slot.durationMs / speedMultiplier;
  return Math.max(0, slot.startedAt + adjustedDuration - Date.now());
}
