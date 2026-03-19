import { useLocale } from '../lib/i18n';
import { FiringSlot, AuctionSlot, getRemainingTime, getAuctionRemainingTime } from '../lib/player';

interface Props {
  firingSlots: FiringSlot[];
  auctions: AuctionSlot[];
  nextEventTime: number | null;
  onSleep: () => void;
}

function formatDuration(ms: number): string {
  if (ms <= 0) return '0m';
  const hours = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export default function CalendarPanel({ firingSlots, auctions, nextEventTime, onSleep }: Props) {
  const { t } = useLocale();

  const events: { label: string; remaining: number; type: 'firing' | 'auction' }[] = [];

  for (const slot of firingSlots) {
    const rem = getRemainingTime(slot);
    if (rem > 0) {
      events.push({ label: `${t('calendar.firingDue')} #${slot.id % 1000}`, remaining: rem, type: 'firing' });
    }
  }

  for (const auction of auctions) {
    const rem = getAuctionRemainingTime(auction);
    if (rem > 0) {
      events.push({ label: `${t('calendar.auctionDue')} #${auction.id % 1000}`, remaining: rem, type: 'auction' });
    }
  }

  events.sort((a, b) => a.remaining - b.remaining);

  const maxRemaining = events.length > 0 ? Math.max(...events.map(e => e.remaining)) : 0;

  return (
    <div className="rounded-xl bg-stone-800 p-4 space-y-4">
      <h2 className="text-lg font-bold text-stone-200">{t('calendar.title')}</h2>

      {events.length === 0 ? (
        <p className="text-stone-500 text-sm">{t('calendar.noEvents')}</p>
      ) : (
        <div className="space-y-2">
          {events.map((event, i) => {
            const pct = maxRemaining > 0 ? (event.remaining / maxRemaining) * 100 : 0;
            return (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className={event.type === 'firing' ? 'text-orange-400' : 'text-blue-400'}>
                    {event.label}
                  </span>
                  <span className="text-stone-400">{formatDuration(event.remaining)}</span>
                </div>
                <div className="w-full h-2 bg-stone-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      event.type === 'firing' ? 'bg-orange-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={onSleep}
        disabled={nextEventTime === null}
        className={`w-full py-2 rounded-lg font-semibold transition-colors ${
          nextEventTime !== null
            ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
            : 'bg-stone-700 text-stone-500 cursor-not-allowed'
        }`}
      >
        {t('calendar.sleep')}
      </button>
    </div>
  );
}
