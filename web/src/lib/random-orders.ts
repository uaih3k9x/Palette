import { TargetProfile } from './glaze';
import { mulberry32 } from './prng';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface RandomOrder {
  name: string;
  target: TargetProfile;
  difficulty: Difficulty;
  seed: number;
}

const ADJECTIVES = [
  'Jade', 'Crimson', 'Azure', 'Amber', 'Obsidian', 'Pearl', 'Coral', 'Indigo',
  'Emerald', 'Ruby', 'Sapphire', 'Topaz', 'Onyx', 'Ivory', 'Scarlet', 'Violet',
];

const NOUNS = [
  'Mist', 'Dawn', 'Dusk', 'Storm', 'Whisper', 'Echo', 'Shadow', 'Flame',
  'Frost', 'Bloom', 'Tide', 'Breeze', 'Ember', 'Veil', 'Haze', 'Glow',
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
