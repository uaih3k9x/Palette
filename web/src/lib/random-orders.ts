import { TargetProfile } from './glaze';
import { mulberry32 } from './prng';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface RandomOrder {
  name: string;
  nameZh: string;
  target: TargetProfile;
  difficulty: Difficulty;
  seed: number;
}

const ADJECTIVES = [
  'Jade', 'Crimson', 'Azure', 'Amber', 'Obsidian', 'Pearl', 'Coral', 'Indigo',
  'Emerald', 'Ruby', 'Sapphire', 'Topaz', 'Onyx', 'Ivory', 'Scarlet', 'Violet',
];

const ADJECTIVES_ZH = [
  '翡翠', '绯红', '蔚蓝', '琥珀', '黑曜', '珍珠', '珊瑚', '靛蓝',
  '碧绿', '红宝', '蓝宝', '黄玉', '玛瑙', '象牙', '猩红', '紫罗兰',
];

const NOUNS = [
  'Mist', 'Dawn', 'Dusk', 'Storm', 'Whisper', 'Echo', 'Shadow', 'Flame',
  'Frost', 'Bloom', 'Tide', 'Breeze', 'Ember', 'Veil', 'Haze', 'Glow',
];

const NOUNS_ZH = [
  '薄雾', '晨曦', '暮色', '风暴', '低语', '回响', '暗影', '焰火',
  '霜华', '花开', '潮汐', '微风', '余烬', '轻纱', '烟霭', '微光',
];

export function getDailySeed(): number {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function generateRandomOrder(seed: number, difficulty: Difficulty): RandomOrder {
  const rng = mulberry32(seed);

  const adjIdx = Math.floor(rng() * ADJECTIVES.length);
  const nounIdx = Math.floor(rng() * NOUNS.length);
  const name = `${ADJECTIVES[adjIdx]} ${NOUNS[nounIdx]}`;
  const nameZh = `${ADJECTIVES_ZH[adjIdx]}${NOUNS_ZH[nounIdx]}`;

  const targetColor: [number, number, number] = [
    rng() * 0.8 + 0.1,
    rng() * 0.8 + 0.1,
    rng() * 0.8 + 0.1,
  ];

  const targetRoughness = rng() * 0.6 + 0.2;
  const targetSpeckle = rng() * 0.4;
  const targetMottling = rng() * 0.4;

  const tolerances = {
    easy: { colorTolerance: 0.22, surfaceTolerance: 0.25 },
    medium: { colorTolerance: 0.16, surfaceTolerance: 0.18 },
    hard: { colorTolerance: 0.10, surfaceTolerance: 0.12 },
  };

  const { colorTolerance, surfaceTolerance } = tolerances[difficulty];

  return {
    name,
    nameZh,
    target: {
      targetColor,
      targetRoughness,
      targetSpeckle,
      targetMottling,
      colorTolerance,
      surfaceTolerance,
      colorWeight: 1.0,
      surfaceWeight: 0.65,
    },
    difficulty,
    seed,
  };
}

export function generateDailyOrders(): RandomOrder[] {
  const baseSeed = getDailySeed();
  return [
    generateRandomOrder(baseSeed, 'easy'),
    generateRandomOrder(baseSeed + 1, 'medium'),
    generateRandomOrder(baseSeed + 2, 'hard'),
  ];
}
