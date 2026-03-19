import { PlayerProfile, getLevelConfig } from '../lib/player';
import { useLocale } from '../lib/i18n';
import LocaleSwitcher from './LocaleSwitcher';

interface Props {
  profile: PlayerProfile;
  onLogout: () => void;
}

export default function PlayerBar({ profile, onLogout }: Props) {
  const { t } = useLocale();
  const currentLevel = getLevelConfig(profile.level);
  const nextLevel = getLevelConfig(profile.level + 1);
  const xpProgress = profile.level >= 10 ? 100 :
    ((profile.xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100;

  return (
    <div className="rounded-xl bg-stone-800 p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center font-bold">
          {profile.level}
        </div>
        <div>
          <div className="font-semibold">{profile.username}</div>
          <div className="text-xs text-stone-400">
            {profile.level >= 10 ? t('player.maxLevel') : `${profile.xp} / ${nextLevel.xpRequired} XP`}
          </div>
        </div>
        <div className="px-2 py-1 rounded bg-yellow-700/50 text-yellow-300 text-xs font-semibold">
          {profile.gold}g
        </div>
      </div>

      {profile.level < 10 && (
        <div className="flex-1 max-w-xs">
          <div className="h-2 bg-stone-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-300"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <LocaleSwitcher />
        <button
          onClick={onLogout}
          className="px-3 py-1 rounded bg-stone-700 hover:bg-stone-600 text-sm transition-colors"
        >
          {t('player.logout')}
        </button>
      </div>
    </div>
  );
}
