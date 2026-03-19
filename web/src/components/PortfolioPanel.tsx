import { PortfolioItem } from '../lib/player';
import { color3ToCss } from '../lib/glaze';
import { calculateHiddenQuality, getNpcPrice } from '../lib/economy';
import { useLocale } from '../lib/i18n';

interface Props {
  portfolio: PortfolioItem[];
  onSubmitOrder: (pieceId: number) => void;
  onSellNpc: (pieceId: number) => void;
  onListAuction: (pieceId: number) => void;
  onDelete: (pieceId: number) => void;
}

export default function PortfolioPanel({ portfolio, onSubmitOrder, onSellNpc, onListAuction, onDelete }: Props) {
  const { t } = useLocale();

  if (portfolio.length === 0) {
    return (
      <div className="rounded-xl bg-stone-800 p-6 text-center text-stone-500 text-sm">
        {t('portfolio.empty')}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {portfolio.map(piece => {
        const quality = calculateHiddenQuality(piece.result);
        const npcPrice = getNpcPrice(quality);

        return (
          <div key={piece.id} className="rounded-xl bg-stone-800 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg border border-stone-600 flex-shrink-0"
                style={{ backgroundColor: color3ToCss(piece.result.surfaceColor) }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{piece.orderName}</div>
                <div className="text-xs text-stone-400 flex gap-3">
                  <span>{t('portfolio.score')}: {piece.matchScore.toFixed(0)}</span>
                  <span>{t('portfolio.quality')}: {quality}</span>
                  <span>{t('economy.npcPrice')}: {npcPrice}g</span>
                </div>
              </div>
              <div className="text-xs text-stone-500">
                {new Date(piece.timestamp).toLocaleDateString()}
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => onSubmitOrder(piece.id)}
                className="px-3 py-1 rounded bg-green-700 hover:bg-green-600 text-xs font-semibold transition-colors"
              >
                {t('portfolio.submitOrder')}
              </button>
              <button
                onClick={() => onSellNpc(piece.id)}
                className="px-3 py-1 rounded bg-yellow-700 hover:bg-yellow-600 text-xs font-semibold transition-colors"
              >
                {t('portfolio.sellNpc')} ({npcPrice}g)
              </button>
              <button
                onClick={() => onListAuction(piece.id)}
                className="px-3 py-1 rounded bg-blue-700 hover:bg-blue-600 text-xs font-semibold transition-colors"
              >
                {t('portfolio.listAuction')}
              </button>
              <button
                onClick={() => { if (confirm(t('portfolio.confirmDelete'))) onDelete(piece.id); }}
                className="px-3 py-1 rounded bg-red-800 hover:bg-red-700 text-xs font-semibold transition-colors"
              >
                {t('portfolio.delete')}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
