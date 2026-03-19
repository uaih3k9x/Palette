import { FiringResult, StarterMineralKind } from './glaze';

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function calculateHiddenQuality(result: FiringResult): number {
  const colorSaturation = Math.sqrt(
    result.surfaceColor[0] ** 2 + result.surfaceColor[1] ** 2 + result.surfaceColor[2] ** 2,
  ) / 1.732;

  const speckleSweet = 1 - Math.abs(result.speckle - 0.35) * 2;
  const mottlingSweet = 1 - Math.abs(result.mottling - 0.30) * 2;
  const opacitySweet = 1 - Math.abs(result.opacity - 0.55) * 2;

  const score =
    result.stability * 40
    - result.burnRisk * 25
    + colorSaturation * 20
    + speckleSweet * 8
    + mottlingSweet * 8
    + result.metallic * 15
    + opacitySweet * 6
    - (result.likelyFailed ? 50 : 0);

  return clamp(Math.round(score), 0, 100);
}

export function getNpcPrice(quality: number): number {
  return Math.floor(quality * 2 + 10);
}

export function calculateAuctionPrice(quality: number, seed: number): number {
  const pseudoRandom = Math.sin(seed * 9301 + 49297) % 1;
  const jitter = Math.floor(pseudoRandom * 41) - 20;
  return Math.floor(quality * 3 + 20 + jitter);
}

export interface ShopItem {
  id: string;
  type: 'mineral' | 'slot';
  name: string;
  nameZh: string;
  mineralKind?: StarterMineralKind;
  cost: number;
  owned: boolean;
}

export function getShopItems(
  ownedMinerals: StarterMineralKind[],
  bonusSlots: number,
): ShopItem[] {
  const mineralItems: ShopItem[] = [
    { id: 'mineral_iron', type: 'mineral', name: 'Iron Oxide', nameZh: '氧化铁', mineralKind: 'IronOxide', cost: 200, owned: ownedMinerals.includes('IronOxide') },
    { id: 'mineral_copper', type: 'mineral', name: 'Copper Carbonate', nameZh: '碳酸铜', mineralKind: 'CopperCarbonate', cost: 200, owned: ownedMinerals.includes('CopperCarbonate') },
    { id: 'mineral_cobalt', type: 'mineral', name: 'Cobalt Oxide', nameZh: '氧化钴', mineralKind: 'CobaltOxide', cost: 500, owned: ownedMinerals.includes('CobaltOxide') },
    { id: 'mineral_manganese', type: 'mineral', name: 'Manganese Dioxide', nameZh: '二氧化锰', mineralKind: 'ManganeseDioxide', cost: 200, owned: ownedMinerals.includes('ManganeseDioxide') },
    { id: 'mineral_titanium', type: 'mineral', name: 'Titanium Dioxide', nameZh: '二氧化钛', mineralKind: 'TitaniumDioxide', cost: 200, owned: ownedMinerals.includes('TitaniumDioxide') },
    { id: 'mineral_chromium', type: 'mineral', name: 'Chromium Oxide', nameZh: '氧化铬', mineralKind: 'ChromiumOxide', cost: 800, owned: ownedMinerals.includes('ChromiumOxide') },
  ];

  const slotItems: ShopItem[] = [];
  for (let i = 1; i <= 2; i++) {
    slotItems.push({
      id: `slot_${i}`,
      type: 'slot',
      name: `Extra Slot #${i}`,
      nameZh: `额外槽位 #${i}`,
      cost: 300,
      owned: bonusSlots >= i,
    });
  }

  return [...mineralItems.filter(m => !m.owned), ...slotItems.filter(s => !s.owned)];
}

export const AUCTION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours
