import { PlayerProfile, getLevelConfig } from '../lib/player';
import { useLocale } from '../lib/i18n';

interface Props {
  profile: PlayerProfile;
}

export default function LevelTree({ profile }: Props) {
  const { t } = useLocale();
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="rounded-xl bg-stone-800 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wide text-center">
        {t('level.title')}
      </h3>

      <div className="space-y-2">
        {levels.map(level => {
          const config = getLevelConfig(level);
          const isUnlocked = profile.level >= level;
          const isCurrent = profile.level === level;
          const nextLevelXP = level < 10 ? getLevelConfig(level + 1).xpRequired : null;

          return (
            <div
              key={level}
              className={`p-3 rounded-lg border-2 transition-all ${
                isCurrent
                  ? 'border-orange-500 bg-orange-950/30'
                  : isUnlocked
                  ? 'border-green-600/50 bg-green-950/20'
                  : 'border-stone-700 bg-stone-900/50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      isCurrent
                        ? 'bg-orange-600 text-white'
                        : isUnlocked
                        ? 'bg-green-600 text-white'
                        : 'bg-stone-700 text-stone-500'
                    }`}
                  >
                    {level}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">
                      {t('level.label')} {level}
                      {isCurrent && <span className="ml-2 text-orange-400">{t('level.current')}</span>}
                    </div>
                    <div className="text-xs text-stone-400">
                      {config.xpRequired} XP
                      {nextLevelXP && ` → ${nextLevelXP} XP`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-stone-700/50 rounded px-2 py-1">
                  <div className="text-stone-500">{t('level.minerals')}</div>
                  <div className="font-semibold">{config.minerals.length}</div>
                </div>
                <div className="bg-stone-700/50 rounded px-2 py-1">
                  <div className="text-stone-500">{t('level.slots')}</div>
                  <div className="font-semibold">{config.slots}</div>
                </div>
                <div className="bg-stone-700/50 rounded px-2 py-1">
                  <div className="text-stone-500">{t('level.time')}</div>
                  <div className="font-semibold">{config.durationHours}h</div>
                </div>
              </div>

              {level === 2 && (
                <div className="mt-2 text-xs text-amber-400">
                  {t('level.unlocks.manganese')}
                </div>
              )}
              {level === 3 && (
                <div className="mt-2 text-xs text-amber-400">
                  {t('level.unlocks.slot2')}
                </div>
              )}
              {level === 4 && (
                <div className="mt-2 text-xs text-amber-400">
                  {t('level.unlocks.cobalt')}
                </div>
              )}
              {level === 6 && (
                <div className="mt-2 text-xs text-amber-400">
                  {t('level.unlocks.chromiumSlot3')}
                </div>
              )}
              {level === 9 && (
                <div className="mt-2 text-xs text-amber-400">
                  {t('level.unlocks.slot4')}
                </div>
              )}
              {level === 10 && (
                <div className="mt-2 text-xs text-purple-400">
                  {t('level.max')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
