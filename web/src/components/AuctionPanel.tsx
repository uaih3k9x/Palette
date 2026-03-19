import { useState, useEffect } from 'react';
import { AuctionSlot, isAuctionComplete, getAuctionRemainingTime, getTestSpeedMultiplier } from '../lib/player';
import { calculateAuctionPrice } from '../lib/economy';
import { color3ToCss } from '../lib/glaze';
import { useLocale } from '../lib/i18n';

interface Props {
  auctions: AuctionSlot[];
  onCollect: (auctionId: number) => void;
}

export default function AuctionPanel({ auctions, onCollect }: Props) {
  const { t } = useLocale();
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  if (auctions.length === 0) {
    return (
      <div className="rounded-xl bg-stone-800 p-6 text-center text-stone-500 text-sm">
        {t('auction.empty')}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {auctions.map(auction => {
        const complete = isAuctionComplete(auction);
        const remaining = getAuctionRemainingTime(auction);
        const speedMultiplier = getTestSpeedMultiplier();
        const adjustedDuration = auction.durationMs / speedMultiplier;
        const progress = complete ? 100 : ((Date.now() - auction.startedAt) / adjustedDuration) * 100;
        const estimatedPrice = calculateAuctionPrice(auction.hiddenQuality, auction.id);

        return (
          <div key={auction.id} className="rounded-xl bg-stone-800 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg border border-stone-600 flex-shrink-0"
                style={{ backgroundColor: color3ToCss(auction.piece.result.surfaceColor) }}
              />
              <div className="flex-1">
                <div className="font-semibold text-sm">{auction.piece.orderName}</div>
                <div className="text-xs text-stone-400">
                  {t('auction.estimatedPrice')}: ~{estimatedPrice}{t('unit.gold')}
                </div>
              </div>
              {complete && (
                <button
                  onClick={() => onCollect(auction.id)}
                  className="px-3 py-1 rounded bg-green-600 hover:bg-green-500 text-sm font-semibold animate-pulse"
                >
                  {t('auction.collect')} ({estimatedPrice}{t('unit.gold')})
                </button>
              )}
            </div>

            <div className="h-2 bg-stone-600 rounded-full overflow-hidden">
              <div
                className={`h-full ${complete ? 'bg-green-600' : 'bg-blue-600'} transition-all duration-1000`}
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>

            <div className="text-xs text-stone-400 text-center">
              {complete ? t('auction.collect') : `${t('auction.inProgress')} — ${formatTime(remaining)}`}
            </div>
          </div>
        );
      })}
    </div>
  );
}
