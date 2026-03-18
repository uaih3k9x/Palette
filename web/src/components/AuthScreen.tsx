import { useState } from 'react';
import { PlayerProfile, createPlayer, loadPlayer, savePlayer } from '../lib/player';

interface Props {
  onLogin: (profile: PlayerProfile) => void;
}

export default function AuthScreen({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();

    if (trimmed.length < 3 || trimmed.length > 16) {
      setError('Username must be 3-16 characters');
      return;
    }

    const existing = loadPlayer();
    if (existing && existing.username === trimmed) {
      onLogin(existing);
    } else {
      const newPlayer = createPlayer(trimmed);
      savePlayer(newPlayer);
      onLogin(newPlayer);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="rounded-xl bg-stone-800 p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Palette</h1>
          <p className="text-stone-400 text-sm">Glaze Lab</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="Enter your username"
              className="w-full bg-stone-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-orange-600 hover:bg-orange-500 font-semibold transition-colors"
          >
            Start
          </button>
        </form>

        <p className="text-xs text-stone-500 text-center">
          New players start at Level 1 with 3 minerals and 1 firing slot
        </p>
      </div>
    </div>
  );
}
