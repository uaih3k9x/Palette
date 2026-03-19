import { TargetProfile, MatchResult, color3ToCss } from '../lib/glaze';
import { Submission } from '../lib/player';
import { Difficulty } from '../lib/random-orders';
import { useLocale } from '../lib/i18n';

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
  hasPortfolioPieces?: boolean;
  onSubmitFromPortfolio?: () => void;
  submission?: Submission | null;
}

export default function OrderPanel({ orderIndex, orderName, target, lastMatch, totalOrders, onPrev, onNext, canAdvance, difficulty, hasPortfolioPieces, onSubmitFromPortfolio, submission }: Props) {
  const { t } = useLocale();
  const difficultyColors = {
    easy: 'bg-green-600',
    medium: 'bg-yellow-600',
    hard: 'bg-red-600',
  };

  const difficultyI18n: Record<string, string> = {
    easy: t('difficulty.easy'),
    medium: t('difficulty.medium'),
    hard: t('difficulty.hard'),
  };

  return (
    <div className="rounded-xl bg-stone-800 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={onPrev} disabled={orderIndex === 0}
          className="px-2 py-1 rounded bg-stone-700 disabled:opacity-30">&larr;</button>
        <span className="text-sm text-stone-400">{t('order.label')} {orderIndex + 1} / {totalOrders}</span>
        <button onClick={onNext} disabled={!canAdvance}
          className="px-2 py-1 rounded bg-stone-700 disabled:opacity-30">&rarr;</button>
      </div>
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-lg font-semibold">{orderName}</h2>
        {difficulty && (
          <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${difficultyColors[difficulty]}`}>
            {difficultyI18n[difficulty]}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg border border-stone-600"
          style={{ backgroundColor: color3ToCss(target.targetColor) }} />
        <div className="text-xs text-stone-400 space-y-0.5">
          <div>{t('order.roughness')}: {target.targetRoughness.toFixed(2)}</div>
          <div>{t('order.speckle')}: {target.targetSpeckle.toFixed(2)}</div>
          <div>{t('order.mottling')}: {target.targetMottling.toFixed(2)}</div>
        </div>
      </div>

      {submission ? (
        <div className="space-y-1">
          <div className="text-center text-2xl font-bold text-green-400">
            {submission.score.toFixed(0)}
            <span className="text-sm text-stone-400 ml-1">{t('order.pts')}</span>
          </div>
          <div className="text-center text-xs text-green-500">
            {t('order.submitted')} · +{submission.xpGained} XP
          </div>
          <div className="text-center text-xs text-stone-500">
            {new Date(submission.timestamp).toLocaleString()}
          </div>
        </div>
      ) : (
        <>
          <div className="text-center text-2xl font-bold">
            {lastMatch ? `${lastMatch.score.toFixed(0)}` : '--'}
            <span className="text-sm text-stone-400 ml-1">{t('order.pts')}</span>
          </div>
          {hasPortfolioPieces && onSubmitFromPortfolio && (
            <button
              onClick={onSubmitFromPortfolio}
              className="w-full py-2 rounded-lg bg-green-700 hover:bg-green-600 text-sm font-semibold transition-colors"
            >
              {t('order.submitFromPortfolio')}
            </button>
          )}
        </>
      )}
    </div>
  );
}
