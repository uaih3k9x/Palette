import { MatchResult, FiringResult } from '../lib/glaze';

interface Props {
  result: FiringResult | null;
  match: MatchResult | null;
}

export default function ResultPanel({ result, match }: Props) {
  if (!result || !match) {
    return (
      <div className="rounded-xl bg-stone-800 p-4 text-center text-stone-500 text-sm">
        Fire the kiln to see results.
      </div>
    );
  }

  const scoreColor = match.score >= 70 ? 'text-green-400' : match.score >= 40 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="rounded-xl bg-stone-800 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className={`text-3xl font-bold ${scoreColor}`}>{match.score.toFixed(0)}</span>
        {match.withinTolerance && (
          <span className="px-2 py-0.5 rounded-full bg-green-800 text-green-300 text-xs font-semibold">
            Within Tolerance
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-stone-400">
        <div>Color Distance: {match.colorDistance.toFixed(3)}</div>
        <div>Surface Distance: {match.surfaceDistance.toFixed(3)}</div>
      </div>
      {result.notes.length > 0 && (
        <ul className="text-xs text-stone-400 space-y-1 list-disc list-inside">
          {result.notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      )}
    </div>
  );
}
