import { useState, useCallback, useEffect } from 'react';
import {
  MineralStack, KilnSettings, FiringResult, MatchResult,
  makeStarterRecipe, makeStarterKilnSettings,
  simulateFiring, evaluateAgainstTarget,
} from './lib/glaze';
import { ORDERS } from './lib/orders';
import {
  PlayerProfile, FiringSlot, loadPlayer, savePlayer, loadFiringSlots,
  saveFiringSlots, getLevelConfig, awardXP, getXPForScore,
} from './lib/player';
import { generateDailyOrders, RandomOrder } from './lib/random-orders';
import AuthScreen from './components/AuthScreen';
import PlayerBar from './components/PlayerBar';
import OrderPanel from './components/OrderPanel';
import Workbench from './components/Workbench';
import KilnSettingsPanel from './components/KilnSettings';
import PotteryPreview from './components/PotteryPreview';
import ResultPanel from './components/ResultPanel';
import FiringSlotPanel from './components/FiringSlotPanel';

export default function App() {
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [recipe, setRecipe] = useState<MineralStack[]>(makeStarterRecipe);
  const [kiln, setKiln] = useState<KilnSettings>(makeStarterKilnSettings);
  const [orderIdx, setOrderIdx] = useState(0);
  const [result, setResult] = useState<FiringResult | null>(null);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [firingSlots, setFiringSlots] = useState<FiringSlot[]>([]);
  const [mode, setMode] = useState<'fixed' | 'random'>('fixed');
  const [dailyOrders, setDailyOrders] = useState<RandomOrder[]>([]);
  const [collectingSlotId, setCollectingSlotId] = useState<number | null>(null);

  useEffect(() => {
    const saved = loadPlayer();
    if (saved) {
      setPlayer(saved);
      setFiringSlots(loadFiringSlots());
      setDailyOrders(generateDailyOrders());
    }
  }, []);

  const handleLogin = (profile: PlayerProfile) => {
    setPlayer(profile);
    setFiringSlots(loadFiringSlots());
    setDailyOrders(generateDailyOrders());
  };

  const handleLogout = () => {
    setPlayer(null);
    setRecipe(makeStarterRecipe());
    setKiln(makeStarterKilnSettings());
    setOrderIdx(0);
    setResult(null);
    setMatch(null);
    setFiringSlots([]);
    setMode('fixed');
  };

  const startFiring = useCallback(() => {
    if (!player) return;

    const levelConfig = getLevelConfig(player.level);
    const hasSpace = firingSlots.length < levelConfig.slots;
    if (!hasSpace) return;

    const newSlot: FiringSlot = {
      id: Date.now(),
      recipe: [...recipe],
      kiln: { ...kiln },
      startedAt: Date.now(),
      durationMs: levelConfig.durationHours * 60 * 60 * 1000,
      orderIndex: orderIdx,
      orderMode: mode,
      randomSeed: mode === 'random' ? dailyOrders[orderIdx]?.seed : undefined,
      randomDifficulty: mode === 'random' ? dailyOrders[orderIdx]?.difficulty : undefined,
    };

    const updated = [...firingSlots, newSlot];
    setFiringSlots(updated);
    saveFiringSlots(updated);
  }, [player, recipe, kiln, orderIdx, mode, dailyOrders, firingSlots]);

  const collectFiring = useCallback((slotId: number) => {
    const slot = firingSlots.find(s => s.id === slotId);
    if (!slot || !player) return;

    setCollectingSlotId(slotId);

    const firingResult = simulateFiring(slot.recipe, slot.kiln);
    const currentOrder = slot.orderMode === 'fixed'
      ? ORDERS[slot.orderIndex]
      : dailyOrders[slot.orderIndex];

    const matchResult = evaluateAgainstTarget(firingResult, currentOrder.target);

    setResult(firingResult);
    setMatch(matchResult);

    const xpGained = slot.orderMode === 'random' && slot.randomDifficulty
      ? getXPForScore(matchResult.score, slot.randomDifficulty)
      : Math.floor(matchResult.score);

    const updatedPlayer = awardXP(player, xpGained);
    setPlayer(updatedPlayer);
    savePlayer(updatedPlayer);

    const remainingSlots = firingSlots.filter(s => s.id !== slotId);
    setFiringSlots(remainingSlots);
    saveFiringSlots(remainingSlots);

    setTimeout(() => setCollectingSlotId(null), 100);
  }, [firingSlots, player, dailyOrders]);

  if (!player) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const levelConfig = getLevelConfig(player.level);
  const orders = mode === 'fixed' ? ORDERS : dailyOrders;
  const currentOrder = orders[orderIdx];
  const canFire = firingSlots.length < levelConfig.slots;
  const firingLabel = `Start Firing (${levelConfig.durationHours}h)`;

  return (
    <div className="min-h-screen p-4 max-w-6xl mx-auto space-y-4">
      <PlayerBar profile={player} onLogout={handleLogout} />

      <div className="flex justify-center gap-2">
        <button
          onClick={() => { setMode('fixed'); setOrderIdx(0); setResult(null); setMatch(null); }}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            mode === 'fixed' ? 'bg-orange-600' : 'bg-stone-700 hover:bg-stone-600'
          }`}
        >
          Fixed Orders
        </button>
        <button
          onClick={() => { setMode('random'); setOrderIdx(0); setResult(null); setMatch(null); }}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            mode === 'random' ? 'bg-orange-600' : 'bg-stone-700 hover:bg-stone-600'
          }`}
        >
          Daily Random
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="space-y-4">
          <OrderPanel
            orderIndex={orderIdx}
            orderName={currentOrder.name}
            target={currentOrder.target}
            lastMatch={match}
            totalOrders={orders.length}
            onPrev={() => { setOrderIdx(orderIdx - 1); setResult(null); setMatch(null); }}
            onNext={() => { setOrderIdx(orderIdx + 1); setResult(null); setMatch(null); }}
            canAdvance={orderIdx < orders.length - 1}
            difficulty={mode === 'random' ? dailyOrders[orderIdx]?.difficulty : undefined}
          />
          <PotteryPreview result={result} />
          <FiringSlotPanel
            slots={firingSlots}
            maxSlots={levelConfig.slots}
            onCollect={collectFiring}
          />
        </div>

        <div className="space-y-4">
          <Workbench
            recipe={recipe}
            onChange={setRecipe}
            maxSlots={levelConfig.slots}
            unlockedMinerals={player.unlockedMinerals}
            disabled={collectingSlotId !== null}
          />
        </div>

        <div className="space-y-4 lg:col-span-2">
          <KilnSettingsPanel
            settings={kiln}
            onChange={setKiln}
            onFire={startFiring}
            disabled={collectingSlotId !== null}
            firingLabel={firingLabel}
            canFire={canFire}
          />
          <ResultPanel result={result} match={match} />
        </div>
      </div>
    </div>
  );
}
