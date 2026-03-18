import { useLocale } from '../lib/i18n';

export default function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-1 bg-stone-700 rounded px-2 py-1">
      <button
        onClick={() => setLocale('en')}
        className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
          locale === 'en' ? 'bg-orange-600 text-white' : 'text-stone-400 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('zh')}
        className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
          locale === 'zh' ? 'bg-orange-600 text-white' : 'text-stone-400 hover:text-white'
        }`}
      >
        中
      </button>
    </div>
  );
}
