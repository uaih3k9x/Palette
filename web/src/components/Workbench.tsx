import { MineralStack, StarterMineralKind, ALL_MINERAL_KINDS, makeStarterMineral } from '../lib/glaze';
import { useLocale } from '../lib/i18n';

interface Props {
  recipe: MineralStack[];
  onChange: (recipe: MineralStack[]) => void;
  maxSlots: number;
  unlockedMinerals: StarterMineralKind[];
  disabled?: boolean;
}

export default function Workbench({ recipe, onChange, maxSlots, unlockedMinerals, disabled }: Props) {
  const { t } = useLocale();
  const update = (i: number, parts: number) => {
    const next = [...recipe];
    next[i] = { ...next[i], parts };
    onChange(next);
  };
  const remove = (i: number) => onChange(recipe.filter((_, idx) => idx !== i));
  const add = (kind: StarterMineralKind) => {
    onChange([...recipe, { mineral: makeStarterMineral(kind), parts: 0.10 }]);
  };

  const usedIds = new Set(recipe.map(s => s.mineral.mineralId));

  return (
    <div className="rounded-xl bg-stone-800 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wide">
        {t('workbench.title')} ({recipe.length} / {maxSlots})
      </h3>
      {recipe.map((stack, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-28 text-sm truncate">{stack.mineral.displayName}</span>
          <input type="range" min={0} max={1} step={0.01} value={stack.parts}
            onChange={e => update(i, +e.target.value)}
            disabled={disabled}
            className="flex-1 accent-amber-500 disabled:opacity-50" />
          <span className="w-10 text-xs text-right text-stone-400">{stack.parts.toFixed(2)}</span>
          <button onClick={() => remove(i)} disabled={disabled}
            className="text-stone-500 hover:text-red-400 text-sm disabled:opacity-30">&times;</button>
        </div>
      ))}
      {recipe.length < maxSlots && (
        <select
          className="w-full bg-stone-700 rounded px-2 py-1 text-sm disabled:opacity-50"
          value=""
          onChange={e => { if (e.target.value) add(e.target.value as StarterMineralKind); }}
          disabled={disabled}
        >
          <option value="">{t('workbench.add')}</option>
          {ALL_MINERAL_KINDS.map(k => {
            const isUsed = usedIds.has(k);
            const isUnlocked = unlockedMinerals.includes(k);
            if (isUsed) return null;
            return (
              <option key={k} value={k} disabled={!isUnlocked}>
                {isUnlocked ? makeStarterMineral(k).displayName : `🔒 ${makeStarterMineral(k).displayName}`}
              </option>
            );
          })}
        </select>
      )}
    </div>
  );
}
