import { useState } from 'react';
import { SavedRecipe, exportRecipe, importRecipe } from '../lib/player';
import { useLocale } from '../lib/i18n';

interface Props {
  recipes: SavedRecipe[];
  onSave: (name: string) => void;
  onLoad: (recipe: SavedRecipe) => void;
  onDelete: (id: number) => void;
  onImport: (recipe: SavedRecipe) => void;
}

export default function RecipeBookPanel({ recipes, onSave, onLoad, onDelete, onImport }: Props) {
  const { t } = useLocale();
  const [newName, setNewName] = useState('');
  const [importCode, setImportCode] = useState('');
  const [importError, setImportError] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleSave = () => {
    const name = newName.trim();
    if (!name) return;
    onSave(name);
    setNewName('');
  };

  const handleImport = () => {
    const code = importCode.trim();
    if (!code) return;
    const recipe = importRecipe(code);
    if (recipe) {
      onImport(recipe);
      setImportCode('');
      setImportError(false);
    } else {
      setImportError(true);
    }
  };

  const handleShare = (recipe: SavedRecipe) => {
    const code = exportRecipe(recipe);
    navigator.clipboard.writeText(code);
    setCopiedId(recipe.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Save current recipe */}
      <div className="rounded-xl bg-stone-800 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wide">
          {t('recipe.saveCurrent')}
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder={t('recipe.namePlaceholder')}
            className="flex-1 bg-stone-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
          <button
            onClick={handleSave}
            disabled={!newName.trim()}
            className="px-4 py-2 rounded bg-orange-600 hover:bg-orange-500 text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {t('save.yes')}
          </button>
        </div>
      </div>

      {/* Import */}
      <div className="rounded-xl bg-stone-800 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wide">
          {t('recipe.import')}
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={importCode}
            onChange={e => { setImportCode(e.target.value); setImportError(false); }}
            placeholder={t('recipe.importPlaceholder')}
            className="flex-1 bg-stone-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleImport}
            disabled={!importCode.trim()}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {t('recipe.importBtn')}
          </button>
        </div>
        {importError && (
          <p className="text-xs text-red-400">{t('recipe.importError')}</p>
        )}
      </div>

      {/* Saved recipes list */}
      {recipes.length === 0 ? (
        <div className="rounded-xl bg-stone-800 p-6 text-center text-stone-500 text-sm">
          {t('recipe.empty')}
        </div>
      ) : (
        recipes.map(recipe => (
          <div key={recipe.id} className="rounded-xl bg-stone-800 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">{recipe.name}</div>
                <div className="text-xs text-stone-400">
                  {recipe.recipe.length} {t('recipe.mineralCount')} &middot; {new Date(recipe.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onLoad(recipe)}
                className="px-3 py-1 rounded bg-green-700 hover:bg-green-600 text-xs font-semibold transition-colors"
              >
                {t('recipe.load')}
              </button>
              <button
                onClick={() => handleShare(recipe)}
                className="px-3 py-1 rounded bg-blue-700 hover:bg-blue-600 text-xs font-semibold transition-colors"
              >
                {copiedId === recipe.id ? t('recipe.copied') : t('recipe.share')}
              </button>
              <button
                onClick={() => { if (confirm(t('recipe.confirmDelete'))) onDelete(recipe.id); }}
                className="px-3 py-1 rounded bg-red-800 hover:bg-red-700 text-xs font-semibold transition-colors"
              >
                {t('recipe.delete')}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
