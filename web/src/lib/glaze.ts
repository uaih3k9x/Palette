// ── Types ──────────────────────────────────────────────────────────

export type Color3 = [number, number, number];

export type Atmosphere = 'Oxidation' | 'Neutral' | 'Reduction';

export interface MineralDefinition {
  mineralId: string;
  displayName: string;
  baseTint: Color3;
  oxidationTint: Color3;
  reductionTint: Color3;
  colorStrength: number;
  roughnessDelta: number;
  metallicDelta: number;
  speckleDelta: number;
  mottlingDelta: number;
  opacityDelta: number;
  temperatureResponse: number;
  coolingResponse: number;
  atmosphereResponse: number;
  stableMaxShare: number;
  failureRiskPerExcess: number;
  failureTint: Color3;
  shortNote: string;
}

export interface MineralStack {
  mineral: MineralDefinition;
  parts: number;
}

export interface KilnSettings {
  temperatureCelsius: number;
  atmosphere: Atmosphere;
  glazeThickness: number;
  coolingRate: number;
  clayWarmth: number;
  surfaceVariance: number;
  variationSeed: number;
}

export interface FiringResult {
  surfaceColor: Color3;
  rimColor: Color3;
  roughness: number;
  metallic: number;
  speckle: number;
  mottling: number;
  opacity: number;
  burnRisk: number;
  stability: number;
  likelyFailed: boolean;
  notes: string[];
}

export interface TargetProfile {
  targetColor: Color3;
  targetRoughness: number;
  targetSpeckle: number;
  targetMottling: number;
  colorTolerance: number;
  surfaceTolerance: number;
  colorWeight: number;
  surfaceWeight: number;
}

export interface MatchResult {
  score: number;
  colorDistance: number;
  surfaceDistance: number;
  withinTolerance: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const clampColor = (c: Color3): Color3 => [clamp(c[0],0,1), clamp(c[1],0,1), clamp(c[2],0,1)];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const lerpColor = (a: Color3, b: Color3, t: number): Color3 => [
  lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t),
];

const addColor = (a: Color3, b: Color3): Color3 => [a[0]+b[0], a[1]+b[1], a[2]+b[2]];

const scaleColor = (c: Color3, s: number): Color3 => [c[0]*s, c[1]*s, c[2]*s];

function temperatureToAlpha(tempC: number): number {
  return clamp((tempC - 980) / (1280 - 980), 0, 1);
}

function getClayBase(warmth: number): Color3 {
  const cool: Color3 = [0.34, 0.30, 0.27];
  const warm: Color3 = [0.52, 0.38, 0.25];
  const t = clamp(warmth, 0, 1);
  return lerpColor(cool, warm, t);
}

function distance3(a: Color3, b: Color3): number {
  const dx = a[0]-b[0], dy = a[1]-b[1], dz = a[2]-b[2];
  return Math.sqrt(dx*dx + dy*dy + dz*dz) / 1.7320508076;
}

// ── Starter Minerals ───────────────────────────────────────────────

export type StarterMineralKind =
  | 'IronOxide' | 'CopperCarbonate' | 'CobaltOxide'
  | 'ManganeseDioxide' | 'TitaniumDioxide' | 'ChromiumOxide';

const D: Partial<MineralDefinition> = {
  roughnessDelta: 0, metallicDelta: 0, speckleDelta: 0,
  mottlingDelta: 0, opacityDelta: 0,
};

export function makeStarterMineral(kind: StarterMineralKind): MineralDefinition {
  switch (kind) {
    case 'IronOxide': return { ...D, mineralId: 'IronOxide', displayName: 'Iron Oxide',
      baseTint:[0.46,0.28,0.14], oxidationTint:[0.18,0.09,0.01], reductionTint:[0.05,0.03,0.02],
      colorStrength:1.05, roughnessDelta:0.08, speckleDelta:0.08,
      temperatureResponse:-0.35, coolingResponse:0.10, atmosphereResponse:-0.15,
      stableMaxShare:0.55, failureRiskPerExcess:1.0, failureTint:[0.16,0.12,0.08],
      shortNote:'Reliable earth browns; can go near-black when pushed hot.' } as MineralDefinition;
    case 'CopperCarbonate': return { ...D, mineralId: 'CopperCarbonate', displayName: 'Copper Carbonate',
      baseTint:[0.08,0.36,0.30], oxidationTint:[0.04,0.28,0.22], reductionTint:[0.62,0.10,0.08],
      colorStrength:1.20, metallicDelta:0.06, mottlingDelta:0.10, opacityDelta:0.06,
      temperatureResponse:0.20, coolingResponse:0.18, atmosphereResponse:0.80,
      stableMaxShare:0.18, failureRiskPerExcess:1.45, failureTint:[0.22,0.16,0.11],
      shortNote:'Reduction can flip copper from green to a smoky red.' } as MineralDefinition;
    case 'CobaltOxide': return { ...D, mineralId: 'CobaltOxide', displayName: 'Cobalt Oxide',
      baseTint:[0.08,0.18,0.65], oxidationTint:[0.02,0.12,0.30], reductionTint:[0.08,0.04,0.20],
      colorStrength:2.35, mottlingDelta:0.05, opacityDelta:-0.04,
      temperatureResponse:0.15, coolingResponse:0.05, atmosphereResponse:-0.10,
      stableMaxShare:0.10, failureRiskPerExcess:2.00, failureTint:[0.05,0.07,0.15],
      shortNote:'Very strong. Small amounts dominate the palette quickly.' } as MineralDefinition;
    case 'ManganeseDioxide': return { ...D, mineralId: 'ManganeseDioxide', displayName: 'Manganese Dioxide',
      baseTint:[0.28,0.16,0.20], oxidationTint:[0.12,0.08,0.10], reductionTint:[0.08,0.07,0.08],
      colorStrength:0.95, roughnessDelta:0.10, speckleDelta:0.22, mottlingDelta:0.12,
      temperatureResponse:-0.10, coolingResponse:0.28, atmosphereResponse:-0.20,
      stableMaxShare:0.25, failureRiskPerExcess:1.10, failureTint:[0.10,0.08,0.08],
      shortNote:'Adds mottling, speckles, and smoky violet-brown breaks.' } as MineralDefinition;
    case 'TitaniumDioxide': return { ...D, mineralId: 'TitaniumDioxide', displayName: 'Titanium Dioxide',
      baseTint:[0.60,0.54,0.38], oxidationTint:[0.10,0.10,0.08], reductionTint:[0.08,0.07,0.06],
      colorStrength:0.58, roughnessDelta:0.05, speckleDelta:0.10, mottlingDelta:0.16, opacityDelta:0.24,
      temperatureResponse:0.12, coolingResponse:0.55, atmosphereResponse:0.00,
      stableMaxShare:0.45, failureRiskPerExcess:0.80, failureTint:[0.42,0.38,0.30],
      shortNote:'Creams the glaze and helps slow cooling produce clustered breaks.' } as MineralDefinition;
    case 'ChromiumOxide': default: return { ...D, mineralId: 'ChromiumOxide', displayName: 'Chromium Oxide',
      baseTint:[0.12,0.36,0.14], oxidationTint:[0.04,0.18,0.05], reductionTint:[0.12,0.10,0.04],
      colorStrength:1.35, roughnessDelta:0.04, mottlingDelta:0.08, opacityDelta:0.05,
      temperatureResponse:-0.05, coolingResponse:0.10, atmosphereResponse:-0.35,
      stableMaxShare:0.14, failureRiskPerExcess:1.40, failureTint:[0.14,0.12,0.07],
      shortNote:'Clean greens in oxidation, muddier olive under heavy reduction.' } as MineralDefinition;
  }
}

export const ALL_MINERAL_KINDS: StarterMineralKind[] = [
  'IronOxide','CopperCarbonate','CobaltOxide','ManganeseDioxide','TitaniumDioxide','ChromiumOxide',
];

export function makeStarterRecipe(): MineralStack[] {
  return [
    { mineral: makeStarterMineral('IronOxide'), parts: 0.28 },
    { mineral: makeStarterMineral('TitaniumDioxide'), parts: 0.22 },
    { mineral: makeStarterMineral('CopperCarbonate'), parts: 0.08 },
    { mineral: makeStarterMineral('ManganeseDioxide'), parts: 0.10 },
  ];
}

export function makeStarterKilnSettings(): KilnSettings {
  return {
    temperatureCelsius: 1220,
    atmosphere: 'Oxidation',
    glazeThickness: 0.55,
    coolingRate: 0.45,
    clayWarmth: 0.55,
    surfaceVariance: 0.12,
    variationSeed: 1337,
  };
}

// ── SimulateFiring ─────────────────────────────────────────────────

export function simulateFiring(recipe: MineralStack[], kiln: KilnSettings): FiringResult {
  const notes: string[] = [];
  const thickness = clamp(kiln.glazeThickness, 0, 1);
  const coolingRate = clamp(kiln.coolingRate, 0, 1);
  const variance = clamp(kiln.surfaceVariance, 0, 1);
  const tempAlpha = temperatureToAlpha(kiln.temperatureCelsius);
  const clayBase = getClayBase(kiln.clayWarmth);

  let totalParts = 0;
  for (const s of recipe) totalParts += Math.max(0, s.parts);

  if (totalParts <= 1e-6) {
    return {
      surfaceColor: clayBase, rimColor: clampColor(scaleColor(clayBase, 1.08)),
      roughness: 0.78, metallic: 0, speckle: 0, mottling: 0, opacity: 0.12,
      burnRisk: 0, stability: 1, likelyFailed: false,
      notes: ['No mineral load applied. You are mostly seeing the clay body.'],
    };
  }

  let colorAcc: Color3 = [0,0,0];
  let failAcc: Color3 = [0,0,0];
  let roughness = 0.62 - 0.12 * tempAlpha + 0.08 * thickness;
  let metallic = 0.01;
  let speckle = 0.02 + 0.04 * thickness;
  let mottling = 0.03 + 0.04 * variance;
  let opacity = 0.30 + 0.42 * thickness;
  let burnRisk = Math.max(0, tempAlpha - 0.82) * 0.32;
  let stabilityPenalty = 0;

  for (const stack of recipe) {
    if (stack.parts <= 0 || !stack.mineral.mineralId) continue;
    const m = stack.mineral;
    const share = stack.parts / totalParts;

    let atmosTint: Color3 = scaleColor(addColor(m.oxidationTint, m.reductionTint), 0.5);
    if (kiln.atmosphere === 'Oxidation') {
      atmosTint = m.oxidationTint;
      roughness += share * Math.max(0, -m.atmosphereResponse) * 0.08;
    } else if (kiln.atmosphere === 'Reduction') {
      atmosTint = m.reductionTint;
      metallic += share * Math.max(0, m.atmosphereResponse) * 0.10;
      burnRisk += share * Math.max(0, m.atmosphereResponse) * 0.05;
    }

    let mineralTint = clampColor(addColor(m.baseTint, atmosTint));
    const tempScale = m.temperatureResponse >= 0
      ? lerp(1, 1 + m.temperatureResponse * 0.35, tempAlpha)
      : lerp(1, 1 + m.temperatureResponse * 0.45, tempAlpha);
    mineralTint = clampColor(scaleColor(mineralTint, tempScale));
    colorAcc = addColor(colorAcc, scaleColor(mineralTint, share * m.colorStrength * lerp(0.85, 1.15, thickness)));

    roughness += share * m.roughnessDelta;
    metallic += share * m.metallicDelta;
    speckle += share * m.speckleDelta;
    mottling += share * (m.mottlingDelta + m.coolingResponse * coolingRate * 0.35);
    opacity += share * m.opacityDelta;

    const excess = Math.max(0, share - m.stableMaxShare);
    if (excess > 0) {
      const excessRisk = excess * m.failureRiskPerExcess * (0.65 + tempAlpha * 0.85);
      burnRisk += excessRisk;
      stabilityPenalty += excessRisk * 0.55;
      failAcc = addColor(failAcc, scaleColor(m.failureTint, share));
      notes.push(`${m.displayName} is above its stable range and may muddy the firing.`);
    }
  }

  const coverage = clamp(0.35 + thickness * 0.42 + opacity * 0.10, 0.15, 0.95);
  let surfaceColor = lerpColor(clayBase, clampColor(colorAcc), coverage);
  const failBlend = clamp((burnRisk - 0.55) / 0.40, 0, 1);
  if (failBlend > 0) {
    surfaceColor = lerpColor(surfaceColor, clampColor(addColor(scaleColor(failAcc, 1.2), scaleColor(clayBase, 0.45))), failBlend);
  }

  const finalSurface = clampColor(surfaceColor);
  const rimColor = clampColor(lerpColor(scaleColor(finalSurface, 1.08), clayBase, (1 - thickness) * 0.35));
  const clampedBurn = clamp(burnRisk, 0, 1);
  const stability = clamp(1 - clampedBurn * 0.65 - stabilityPenalty - variance * 0.10, 0, 1);
  const likelyFailed = clampedBurn >= 0.78 || stability <= 0.20;

  if (likelyFailed) {
    notes.push('The kiln run is unstable and likely scorched or muddied the glaze.');
  } else if (coolingRate >= 0.70) {
    notes.push('Slow cooling pushed more mottling and crystal-like breaks into the glaze.');
  } else if (kiln.atmosphere === 'Reduction') {
    notes.push('Reduction deepened warm minerals and flattened some bright oxidation colors.');
  } else {
    notes.push('The firing stayed mostly clean and readable, good for matching a target order.');
  }

  return {
    surfaceColor: finalSurface, rimColor,
    roughness: clamp(roughness, 0.05, 1), metallic: clamp(metallic, 0, 0.35),
    speckle: clamp(speckle, 0, 1), mottling: clamp(mottling, 0, 1),
    opacity: clamp(opacity, 0.05, 1), burnRisk: clampedBurn, stability, likelyFailed, notes,
  };
}

// ── EvaluateAgainstTarget ──────────────────────────────────────────

export function evaluateAgainstTarget(result: FiringResult, target: TargetProfile): MatchResult {
  const colorDist = distance3(result.surfaceColor, target.targetColor);
  const surfDist =
    Math.abs(result.roughness - target.targetRoughness) * 0.40 +
    Math.abs(result.speckle - target.targetSpeckle) * 0.30 +
    Math.abs(result.mottling - target.targetMottling) * 0.30;

  const weightedDist =
    colorDist * target.colorWeight +
    surfDist * target.surfaceWeight +
    (result.likelyFailed ? 0.20 : 0);

  const weightTotal = target.colorWeight + target.surfaceWeight + 0.20;
  const score = clamp(100 * (1 - weightedDist / weightTotal), 0, 100);
  const withinTolerance =
    colorDist <= target.colorTolerance &&
    surfDist <= target.surfaceTolerance &&
    !result.likelyFailed;

  return { score, colorDistance: colorDist, surfaceDistance: surfDist, withinTolerance };
}

// ── Color utility for CSS ──────────────────────────────────────────

export function color3ToCss(c: Color3): string {
  return `rgb(${Math.round(c[0]*255)},${Math.round(c[1]*255)},${Math.round(c[2]*255)})`;
}
