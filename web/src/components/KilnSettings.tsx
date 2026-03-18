import { KilnSettings, Atmosphere } from '../lib/glaze';

interface Props {
  settings: KilnSettings;
  onChange: (s: KilnSettings) => void;
  onFire: () => void;
  disabled?: boolean;
  firingLabel: string;
  canFire: boolean;
}

const atmospheres: Atmosphere[] = ['Oxidation', 'Neutral', 'Reduction'];

export default function KilnSettingsPanel({ settings, onChange, onFire, disabled, firingLabel, canFire }: Props) {
  const set = <K extends keyof KilnSettings>(k: K, v: KilnSettings[K]) =>
    onChange({ ...settings, [k]: v });

  const slider = (label: string, key: keyof KilnSettings, min: number, max: number, step: number) => (
    <div className="flex items-center gap-2">
      <span className="w-32 text-sm">{label}</span>
      <input type="range" min={min} max={max} step={step}
        value={settings[key] as number}
        onChange={e => set(key, +e.target.value)}
        disabled={disabled}
        className="flex-1 accent-orange-500 disabled:opacity-50" />
      <span className="w-14 text-xs text-right text-stone-400">
        {(settings[key] as number).toFixed(key === 'temperatureCelsius' ? 0 : 2)}
      </span>
    </div>
  );

  return (
    <div className="rounded-xl bg-stone-800 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wide">Kiln</h3>
      {slider('Temperature', 'temperatureCelsius', 900, 1320, 5)}
      {slider('Thickness', 'glazeThickness', 0, 1, 0.01)}
      {slider('Cooling Rate', 'coolingRate', 0, 1, 0.01)}
      {slider('Clay Warmth', 'clayWarmth', 0, 1, 0.01)}
      {slider('Variance', 'surfaceVariance', 0, 1, 0.01)}

      <div className="flex items-center gap-2">
        <span className="w-32 text-sm">Atmosphere</span>
        <div className="flex gap-1">
          {atmospheres.map(a => (
            <button key={a} onClick={() => set('atmosphere', a)}
              disabled={disabled}
              className={`px-2 py-1 rounded text-xs disabled:opacity-50 ${settings.atmosphere === a ? 'bg-orange-600' : 'bg-stone-700'}`}>
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-32 text-sm">Seed</span>
        <input type="number" value={settings.variationSeed}
          onChange={e => set('variationSeed', +e.target.value)}
          disabled={disabled}
          className="w-20 bg-stone-700 rounded px-2 py-1 text-sm disabled:opacity-50" />
      </div>

      <button onClick={onFire}
        disabled={disabled || !canFire}
        className="w-full py-2 rounded-lg bg-orange-600 hover:bg-orange-500 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={!canFire ? 'All firing slots are full' : ''}>
        {firingLabel}
      </button>
    </div>
  );
}
