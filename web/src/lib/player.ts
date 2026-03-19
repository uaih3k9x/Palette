import { StarterMineralKind, MineralStack, KilnSettings, FiringResult } from './glaze';

// ── Types ─────────────────────────────────────────────────────────

export interface PlayerProfile {
  username: string;
  level: number;
  xp: number;
  unlockedMinerals: StarterMineralKind[];
  maxRecipeSlots: number;
  createdAt: number;
  gold: number;
  bonusMinerals: StarterMineralKind[];
  bonusSlots: number;
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

export interface PortfolioItem {
  id: number;
  recipe: MineralStack[];
  kiln: KilnSettings;
  result: FiringResult;
  orderName: string;
  matchScore: number;
  timestamp: number;
}

export interface SavedRecipe {
  id: number;
  name: string;
  recipe: MineralStack[];
  kiln: KilnSettings;
  createdAt: number;
}

export interface AuctionSlot {
  id: number;
  piece: PortfolioItem;
  startedAt: number;
  durationMs: number;
  hiddenQuality: number;
}

export interface Submission {
  id: number;
  orderKey: string;       // e.g. "fixed:3" or "random:2024-03-18:1"
  orderName: string;
  score: number;
  xpGained: number;
  timestamp: number;
}

// ── Level Table ───────────────────────────────────────────────────

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

// ── Player CRUD ───────────────────────────────────────────────────

export function createPlayer(username: string): PlayerProfile {
  return {
    username,
    level: 1,
    xp: 0,
    unlockedMinerals: LEVEL_TABLE[1].minerals,
    maxRecipeSlots: LEVEL_TABLE[1].slots,
    createdAt: Date.now(),
    gold: 0,
    bonusMinerals: [],
    bonusSlots: 0,
  };
}

export function savePlayer(p: PlayerProfile): void {
  localStorage.setItem('palette_player', JSON.stringify(p));
}

export function loadPlayer(): PlayerProfile | null {
  const data = localStorage.getItem('palette_player');
  if (!data) return null;
  const p = JSON.parse(data);
  // Migration: add new fields with defaults
  if (p.gold === undefined) p.gold = 0;
  if (!p.bonusMinerals) p.bonusMinerals = [];
  if (p.bonusSlots === undefined) p.bonusSlots = 0;
  return p;
}

export function awardXP(p: PlayerProfile, xp: number): PlayerProfile {
  const updated = { ...p, xp: p.xp + xp };

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

// ── Effective minerals/slots (level + bonus) ──────────────────────

export function getEffectiveMinerals(p: PlayerProfile): StarterMineralKind[] {
  const set = new Set([...p.unlockedMinerals, ...p.bonusMinerals]);
  return [...set];
}

export function getEffectiveMaxSlots(p: PlayerProfile): number {
  return getLevelConfig(p.level).slots + p.bonusSlots;
}

// ── Firing Slots ──────────────────────────────────────────────────

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

// ── Portfolio CRUD ────────────────────────────────────────────────

export function savePortfolio(items: PortfolioItem[]): void {
  localStorage.setItem('palette_portfolio', JSON.stringify(items));
}

export function loadPortfolio(): PortfolioItem[] {
  const data = localStorage.getItem('palette_portfolio');
  return data ? JSON.parse(data) : [];
}

// ── Saved Recipes CRUD ────────────────────────────────────────────

export function saveRecipes(recipes: SavedRecipe[]): void {
  localStorage.setItem('palette_recipes', JSON.stringify(recipes));
}

export function loadRecipes(): SavedRecipe[] {
  const data = localStorage.getItem('palette_recipes');
  return data ? JSON.parse(data) : [];
}

export function exportRecipe(recipe: SavedRecipe): string {
  return btoa(JSON.stringify(recipe));
}

export function importRecipe(code: string): SavedRecipe | null {
  try {
    const parsed = JSON.parse(atob(code));
    if (parsed && parsed.recipe && parsed.kiln && parsed.name) {
      return { ...parsed, id: Date.now(), createdAt: Date.now() };
    }
    return null;
  } catch {
    return null;
  }
}

// ── Auctions CRUD ─────────────────────────────────────────────────

export function saveAuctions(auctions: AuctionSlot[]): void {
  localStorage.setItem('palette_auctions', JSON.stringify(auctions));
}

export function loadAuctions(): AuctionSlot[] {
  const data = localStorage.getItem('palette_auctions');
  return data ? JSON.parse(data) : [];
}

export function isAuctionComplete(auction: AuctionSlot): boolean {
  const speedMultiplier = getTestSpeedMultiplier();
  const adjustedDuration = auction.durationMs / speedMultiplier;
  return Date.now() >= auction.startedAt + adjustedDuration;
}

export function getAuctionRemainingTime(auction: AuctionSlot): number {
  const speedMultiplier = getTestSpeedMultiplier();
  const adjustedDuration = auction.durationMs / speedMultiplier;
  return Math.max(0, auction.startedAt + adjustedDuration - Date.now());
}

// ── Sleep / Calendar ──────────────────────────────────────────────

// ── Submissions CRUD ─────────────────────────────────────────────

export function saveSubmissions(submissions: Submission[]): void {
  localStorage.setItem('palette_submissions', JSON.stringify(submissions));
}

export function loadSubmissions(): Submission[] {
  const data = localStorage.getItem('palette_submissions');
  return data ? JSON.parse(data) : [];
}

export function getOrderKey(mode: 'fixed' | 'random', orderIndex: number, seed?: number): string {
  if (mode === 'fixed') return `fixed:${orderIndex}`;
  return `random:${seed ?? 0}`;
}

// ── Sleep / Calendar ──────────────────────────────────────────────

export function getNextEventTime(
  firingSlots: FiringSlot[], auctions: AuctionSlot[]
): number | null {
  const speedMultiplier = getTestSpeedMultiplier();
  let earliest: number | null = null;

  for (const slot of firingSlots) {
    const endTime = slot.startedAt + slot.durationMs / speedMultiplier;
    if (endTime > Date.now() && (earliest === null || endTime < earliest)) {
      earliest = endTime;
    }
  }

  for (const auction of auctions) {
    const endTime = auction.startedAt + auction.durationMs / speedMultiplier;
    if (endTime > Date.now() && (earliest === null || endTime < earliest)) {
      earliest = endTime;
    }
  }

  return earliest;
}
