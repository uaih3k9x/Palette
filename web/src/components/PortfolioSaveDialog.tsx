import { FiringResult, color3ToCss } from '../lib/glaze';
import { useLocale } from '../lib/i18n';

interface Props {
  result: FiringResult;
  matchScore: number;
  orderName: string;
  onSave: () => void;
  onDiscard: () => void;
}

export default function PortfolioSaveDialog({ result, matchScore, orderName, onSave, onDiscard }: Props) {
  const { t } = useLocale();

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-xl p-6 max-w-sm w-full mx-4 space-y-4">
        <h3 className="text-lg font-bold text-center">{t('save.title')}</h3>
        <p className="text-sm text-stone-400 text-center">{t('save.desc')}</p>

        <div className="flex items-center justify-center gap-3">
          <div
            className="w-12 h-12 rounded-lg border border-stone-600"
            style={{ backgroundColor: color3ToCss(result.surfaceColor) }}
          />
          <div className="text-sm">
            <div className="font-semibold">{orderName}</div>
            <div className="text-stone-400">{t('portfolio.score')}: {matchScore.toFixed(0)}</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onDiscard}
            className="flex-1 py-2 rounded-lg bg-stone-700 hover:bg-stone-600 font-semibold transition-colors"
          >
            {t('save.no')}
          </button>
          <button
            onClick={onSave}
            className="flex-1 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 font-semibold transition-colors"
          >
            {t('save.yes')}
          </button>
        </div>
      </div>
    </div>
  );
}
