import { TargetProfile, MatchResult, color3ToCss } from '../lib/glaze';
import { Difficulty } from '../lib/random-orders';

interface Props {
  orderIndex: number;
  orderName: string;
  target: TargetProfile;
  lastMatch: MatchResult | null;
  totalOrders: number;
  onPrev: () => void;
  onNext: () => void;
  canAdvance: boolean;
  difficulty?: Difficulty;
}

export default function OrderPanel({ orderIndex, orderName, target, lastMatch, totalOrders, onPrev, onNext, canAdvance, difficulty }: Props) {
  const difficultyColors = {
    easy: 'bg-green-600',
    medium: 'bg-yellow-600',
    hard: 'bg-red-600',
  };

  return (
    <div className="rounded-xl bg-stone-800 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={onPrev} disabled={orderIndex === 0}
          className="px-2 py-1 rounded bg-stone-700 disabled:opacity-30">&larr;</button>
        <span className="text-sm text-stone-400">Order {orderIndex + 1} / {totalOrders}</span>
        <button onClick={onNext} disabled={!canAdvance}
          className="px-2 py-1 rounded bg-stone-700 disabled:opacity-30">&rarr;</button>
      </div>
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-lg font-semibold">{orderName}</h2>
        {difficulty && (
          <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${difficultyColors[difficulty]}`}>
            {difficulty}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg border border-stone-600"
          style={{ backgroundColor: color3ToCss(target.targetColor) }} />
        <div className="text-xs text-stone-400 space-y-0.5">
          <div>Roughness: {target.targetRoughness.toFixed(2)}</div>
          <div>Speckle: {target.targetSpeckle.toFixed(2)}</div>
          <div>Mottling: {target.targetMottling.toFixed(2)}</div>
        </div>
      </div>
      <div className="text-center text-2xl font-bold">
        {lastMatch ? `${lastMatch.score.toFixed(0)}` : '--'}
        <span className="text-sm text-stone-400 ml-1">pts</span>
      </div>
    </div>
  );
}
