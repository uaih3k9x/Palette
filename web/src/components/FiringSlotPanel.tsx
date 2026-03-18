import { useState, useEffect } from 'react';
import { FiringSlot, isFiringComplete, getRemainingTime, getTestSpeedMultiplier } from '../lib/player';
import { useLocale } from '../lib/i18n';

interface Props {
  slots: FiringSlot[];
  maxSlots: number;
  onCollect: (slotId: number) => void;
}

export default function FiringSlotPanel({ slots, maxSlots, onCollect }: Props) {
  const { t } = useLocale();
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getSlotStatus = (slot: FiringSlot) => {
    if (isFiringComplete(slot)) {
      return { status: 'complete', label: t('firing.ready'), color: 'bg-green-600' };
    }
    const remaining = getRemainingTime(slot);
    return { status: 'firing', label: formatTime(remaining), color: 'bg-orange-600' };
  };

  return (
    <div className="rounded-xl bg-stone-800 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wide">
        {t('firing.title')} ({slots.length} / {maxSlots})
      </h3>

      {Array.from({ length: maxSlots }).map((_, i) => {
        const slot = slots[i];
        if (!slot) {
          return (
            <div key={i} className="p-3 rounded-lg bg-stone-700 text-center text-stone-500 text-sm">
              {t('firing.available')}
            </div>
          );
        }

        const { status, label, color } = getSlotStatus(slot);
        const speedMultiplier = getTestSpeedMultiplier();
        const adjustedDuration = slot.durationMs / speedMultiplier;
        const progress = status === 'firing'
          ? ((Date.now() - slot.startedAt) / adjustedDuration) * 100
          : 100;

        return (
          <div key={slot.id} className="p-3 rounded-lg bg-stone-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('firing.slot')} {i + 1}</span>
              {status === 'complete' && (
                <button
                  onClick={() => onCollect(slot.id)}
                  className="px-3 py-1 rounded bg-green-600 hover:bg-green-500 text-sm font-semibold animate-pulse"
                >
                  {t('firing.collect')}
                </button>
              )}
            </div>

            <div className="h-2 bg-stone-600 rounded-full overflow-hidden">
              <div
                className={`h-full ${color} transition-all duration-1000`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="text-xs text-stone-400 text-center">{label}</div>
          </div>
        );
      })}
    </div>
  );
}
