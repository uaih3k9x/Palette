import { ShopItem } from '../lib/economy';
import { useLocale } from '../lib/i18n';

interface Props {
  items: ShopItem[];
  gold: number;
  onBuy: (itemId: string) => void;
}

export default function ShopPanel({ items, gold, onBuy }: Props) {
  const { t, locale } = useLocale();

  if (items.length === 0) {
    return (
      <div className="rounded-xl bg-stone-800 p-6 text-center text-stone-500 text-sm">
        {t('shop.empty')}
      </div>
    );
  }

  const minerals = items.filter(i => i.type === 'mineral');
  const slots = items.filter(i => i.type === 'slot');

  const renderItem = (item: ShopItem) => {
    const canAfford = gold >= item.cost;
    const displayName = locale === 'zh' ? item.nameZh : item.name;

    return (
      <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-stone-700">
        <div>
          <div className="text-sm font-semibold">{displayName}</div>
          <div className="text-xs text-yellow-400">{item.cost}{t('unit.gold')}</div>
        </div>
        <button
          onClick={() => onBuy(item.id)}
          disabled={!canAfford}
          className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
            canAfford
              ? 'bg-orange-600 hover:bg-orange-500'
              : 'bg-stone-600 text-stone-400 cursor-not-allowed'
          }`}
          title={!canAfford ? t('shop.notEnoughGold') : ''}
        >
          {t('shop.buy')}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {minerals.length > 0 && (
        <div className="rounded-xl bg-stone-800 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wide">
            {t('shop.minerals')}
          </h3>
          <div className="space-y-2">
            {minerals.map(renderItem)}
          </div>
        </div>
      )}

      {slots.length > 0 && (
        <div className="rounded-xl bg-stone-800 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wide">
            {t('shop.slots')}
          </h3>
          <div className="space-y-2">
            {slots.map(renderItem)}
          </div>
        </div>
      )}
    </div>
  );
}
