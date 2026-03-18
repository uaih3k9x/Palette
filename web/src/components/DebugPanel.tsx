import { useState } from 'react';
import { getTestSpeedMultiplier, setTestSpeedMultiplier } from '../lib/player';
import { useLocale } from '../lib/i18n';

interface Props {
  onClearData: () => void;
}

export default function DebugPanel({ onClearData }: Props) {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [speed, setSpeed] = useState(getTestSpeedMultiplier());

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    setTestSpeedMultiplier(newSpeed);
    window.location.reload();
  };

  const presets = [
    { label: '1x (Normal)', value: 1 },
    { label: '60x (1min = 1s)', value: 60 },
    { label: '360x (1h = 10s)', value: 360 },
    { label: '2880x (8h = 10s)', value: 2880 },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg"
        title={t('debug.title')}
      >
        🛠
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 rounded-xl bg-stone-800 border-2 border-purple-600 p-4 shadow-2xl space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-purple-400 uppercase">{t('debug.title')}</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-stone-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-stone-400">{t('debug.timeAccel')}</label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map(preset => (
            <button
              key={preset.value}
              onClick={() => handleSpeedChange(preset.value)}
              className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                speed === preset.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={speed}
            onChange={e => setSpeed(+e.target.value)}
            className="flex-1 bg-stone-700 rounded px-2 py-1 text-sm"
            min="1"
          />
          <button
            onClick={() => handleSpeedChange(speed)}
            className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-xs font-semibold"
          >
            {t('debug.apply')}
          </button>
        </div>
        <p className="text-xs text-stone-500">
          Current: {speed}x {t('debug.speed')}
        </p>
      </div>

      <div className="border-t border-stone-700 pt-3 space-y-2">
        <button
          onClick={onClearData}
          className="w-full px-3 py-2 rounded bg-red-600 hover:bg-red-500 text-sm font-semibold"
        >
          {t('debug.clearAll')}
        </button>
        <p className="text-xs text-stone-500 text-center">
          {t('debug.clearDesc')}
        </p>
      </div>
    </div>
  );
}
