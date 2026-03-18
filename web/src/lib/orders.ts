import { TargetProfile } from './glaze';

export interface Order {
  name: string;
  target: TargetProfile;
}

export const ORDERS: Order[] = [
  { name: 'Celadon Dream',   target: { targetColor: [0.38,0.56,0.44], targetRoughness: 0.45, targetSpeckle: 0.15, targetMottling: 0.20, colorTolerance: 0.16, surfaceTolerance: 0.18, colorWeight: 1.0, surfaceWeight: 0.65 } },
  { name: 'Iron Red',        target: { targetColor: [0.55,0.18,0.08], targetRoughness: 0.35, targetSpeckle: 0.25, targetMottling: 0.30, colorTolerance: 0.16, surfaceTolerance: 0.18, colorWeight: 1.0, surfaceWeight: 0.65 } },
  { name: 'Cobalt Mist',     target: { targetColor: [0.12,0.22,0.58], targetRoughness: 0.40, targetSpeckle: 0.10, targetMottling: 0.15, colorTolerance: 0.16, surfaceTolerance: 0.18, colorWeight: 1.0, surfaceWeight: 0.65 } },
  { name: 'Ash White',       target: { targetColor: [0.78,0.74,0.68], targetRoughness: 0.55, targetSpeckle: 0.20, targetMottling: 0.10, colorTolerance: 0.16, surfaceTolerance: 0.18, colorWeight: 1.0, surfaceWeight: 0.65 } },
  { name: 'Copper Blush',    target: { targetColor: [0.42,0.62,0.50], targetRoughness: 0.38, targetSpeckle: 0.08, targetMottling: 0.28, colorTolerance: 0.16, surfaceTolerance: 0.18, colorWeight: 1.0, surfaceWeight: 0.65 } },
  { name: 'Tenmoku Black',   target: { targetColor: [0.10,0.08,0.06], targetRoughness: 0.30, targetSpeckle: 0.35, targetMottling: 0.40, colorTolerance: 0.16, surfaceTolerance: 0.18, colorWeight: 1.0, surfaceWeight: 0.65 } },
  { name: 'Rutile Blue',     target: { targetColor: [0.28,0.38,0.52], targetRoughness: 0.50, targetSpeckle: 0.30, targetMottling: 0.35, colorTolerance: 0.16, surfaceTolerance: 0.18, colorWeight: 1.0, surfaceWeight: 0.65 } },
  { name: 'Chun Lavender',   target: { targetColor: [0.52,0.42,0.62], targetRoughness: 0.42, targetSpeckle: 0.05, targetMottling: 0.12, colorTolerance: 0.16, surfaceTolerance: 0.18, colorWeight: 1.0, surfaceWeight: 0.65 } },
  { name: 'Shino',           target: { targetColor: [0.68,0.55,0.42], targetRoughness: 0.70, targetSpeckle: 0.40, targetMottling: 0.45, colorTolerance: 0.16, surfaceTolerance: 0.18, colorWeight: 1.0, surfaceWeight: 0.65 } },
  { name: 'Jun Blue-Green',  target: { targetColor: [0.22,0.48,0.55], targetRoughness: 0.48, targetSpeckle: 0.18, targetMottling: 0.38, colorTolerance: 0.16, surfaceTolerance: 0.18, colorWeight: 1.0, surfaceWeight: 0.65 } },
];
