import { useState, useCallback, useEffect } from 'react';
import {
  MineralStack, KilnSettings, FiringResult, MatchResult,
  makeStarterRecipe, makeStarterKilnSettings,
  simulateFiring, evaluateAgainstTarget, simulateIntuition,
} from './lib/glaze';
import { ORDERS } from './lib/orders';
import {
  PlayerProfile, FiringSlot, PortfolioItem, SavedRecipe, AuctionSlot, Submission,
  loadPlayer, savePlayer, loadFiringSlots, saveFiringSlots,
  getLevelConfig, awardXP, getXPForScore,
  getEffectiveMinerals, getEffectiveMaxSlots,
  loadPortfolio, savePortfolio,
  loadRecipes, saveRecipes,
  loadAuctions, saveAuctions,
  loadSubmissions, saveSubmissions, getOrderKey,
  getNextEventTime,
} from './lib/player';
import {
  calculateHiddenQuality, getNpcPrice, calculateAuctionPrice,
  getShopItems, AUCTION_DURATION_MS,
} from './lib/economy';
import { generateDailyOrders, RandomOrder } from './lib/random-orders';
import { LocaleProvider, useLocale } from './lib/i18n';
import AuthScreen from './components/AuthScreen';
import PlayerBar from './components/PlayerBar';
import OrderPanel from './components/OrderPanel';
import Workbench from './components/Workbench';
import KilnSettingsPanel from './components/KilnSettings';
import PotteryPreview from './components/PotteryPreview';
import ResultPanel from './components/ResultPanel';
import FiringSlotPanel from './components/FiringSlotPanel';
import DebugPanel from './components/DebugPanel';
import LevelTree from './components/LevelTree';
import PortfolioPanel from './components/PortfolioPanel';
import PortfolioSaveDialog from './components/PortfolioSaveDialog';
import RecipeBookPanel from './components/RecipeBookPanel';
import AuctionPanel from './components/AuctionPanel';
import ShopPanel from './components/ShopPanel';
import CalendarPanel from './components/CalendarPanel';

type ActivePanel = 'orders' | 'portfolio' | 'recipeBook' | 'shop' | 'auction' | 'calendar';

function AppContent() {
  const { t, locale } = useLocale();
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
  const [showLevelTree, setShowLevelTree] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>('orders');

  // New state
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [auctions, setAuctions] = useState<AuctionSlot[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState<{
    result: FiringResult;
    matchScore: number;
    orderName: string;
    slot: FiringSlot;
  } | null>(null);

  // Intuition preview
  const [intuitionResult, setIntuitionResult] = useState<FiringResult | null>(null);

  useEffect(() => {
    const saved = loadPlayer();
    if (saved) {
      setPlayer(saved);
      setFiringSlots(loadFiringSlots());
      setDailyOrders(generateDailyOrders());
      setPortfolio(loadPortfolio());
      setSavedRecipes(loadRecipes());
      setAuctions(loadAuctions());
      setSubmissions(loadSubmissions());
    }
  }, []);

  const handleLogin = (profile: PlayerProfile) => {
    setPlayer(profile);
    setFiringSlots(loadFiringSlots());
    setDailyOrders(generateDailyOrders());
    setPortfolio(loadPortfolio());
    setSavedRecipes(loadRecipes());
    setAuctions(loadAuctions());
    setSubmissions(loadSubmissions());
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
    setPortfolio([]);
    setSavedRecipes([]);
    setAuctions([]);
    setSubmissions([]);
    setActivePanel('orders');
  };

  const handleClearData = () => {
    if (confirm(t('debug.confirmClear'))) {
      localStorage.clear();
      window.location.reload();
    }
  };

  useEffect(() => {
    document.title = t('app.title');
  }, [t]);

  // Update intuition preview when recipe or kiln changes
  useEffect(() => {
    if (!player) return;
    const seed = player.createdAt;
    const hashParts = recipe.reduce((acc, s) => acc + s.parts * 1000, 0);
    const hashKiln = kiln.temperatureCelsius + kiln.coolingRate * 100 + kiln.glazeThickness * 10;
    const combinedSeed = seed + Math.floor(hashParts) + Math.floor(hashKiln);
    setIntuitionResult(simulateIntuition(recipe, kiln, player.level, combinedSeed));
  }, [recipe, kiln, player]);

  const startFiring = useCallback(() => {
    if (!player) return;

    const maxSlots = getEffectiveMaxSlots(player);
    if (firingSlots.length >= maxSlots) return;

    const levelConfig = getLevelConfig(player.level);
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

  // collectFiring now shows save dialog instead of auto-awarding XP
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

    const remainingSlots = firingSlots.filter(s => s.id !== slotId);
    setFiringSlots(remainingSlots);
    saveFiringSlots(remainingSlots);

    // Show save dialog
    setShowSaveDialog({
      result: firingResult,
      matchScore: matchResult.score,
      orderName: locale === 'zh' ? (currentOrder as any).nameZh : currentOrder.name,
      slot,
    });

    setTimeout(() => setCollectingSlotId(null), 100);
  }, [firingSlots, player, dailyOrders, locale]);

  const handleSaveToPortfolio = useCallback(() => {
    if (!showSaveDialog || !player) return;

    const piece: PortfolioItem = {
      id: Date.now(),
      recipe: showSaveDialog.slot.recipe,
      kiln: showSaveDialog.slot.kiln,
      result: showSaveDialog.result,
      orderName: showSaveDialog.orderName,
      matchScore: showSaveDialog.matchScore,
      timestamp: Date.now(),
    };

    const updated = [...portfolio, piece];
    setPortfolio(updated);
    savePortfolio(updated);
    setShowSaveDialog(null);
  }, [showSaveDialog, player, portfolio]);

  const handleDiscardPiece = useCallback(() => {
    setShowSaveDialog(null);
  }, []);

  // Submit portfolio piece to current order
  const submitPortfolioPiece = useCallback((pieceId: number) => {
    const piece = portfolio.find(p => p.id === pieceId);
    if (!piece || !player) return;

    const orders = mode === 'fixed' ? ORDERS : dailyOrders;
    const currentOrder = orders[orderIdx];
    const key = getOrderKey(mode, orderIdx, mode === 'random' ? dailyOrders[orderIdx]?.seed : undefined);

    // Prevent re-submission
    if (submissions.some(s => s.orderKey === key)) return;

    const matchResult = evaluateAgainstTarget(piece.result, currentOrder.target);

    setResult(piece.result);
    setMatch(matchResult);

    const xpGained = mode === 'random' && dailyOrders[orderIdx]?.difficulty
      ? getXPForScore(matchResult.score, dailyOrders[orderIdx].difficulty)
      : Math.floor(matchResult.score);

    const updatedPlayer = awardXP(player, xpGained);
    setPlayer(updatedPlayer);
    savePlayer(updatedPlayer);

    // Record submission
    const submission: Submission = {
      id: Date.now(),
      orderKey: key,
      orderName: locale === 'zh' ? (currentOrder as any).nameZh : currentOrder.name,
      score: matchResult.score,
      xpGained,
      timestamp: Date.now(),
    };
    const updatedSubmissions = [...submissions, submission];
    setSubmissions(updatedSubmissions);
    saveSubmissions(updatedSubmissions);

    // Remove from portfolio
    const updatedPortfolio = portfolio.filter(p => p.id !== pieceId);
    setPortfolio(updatedPortfolio);
    savePortfolio(updatedPortfolio);
  }, [portfolio, player, mode, dailyOrders, orderIdx, submissions, locale]);

  // Sell to NPC for instant gold
  const sellToNpc = useCallback((pieceId: number) => {
    const piece = portfolio.find(p => p.id === pieceId);
    if (!piece || !player) return;

    const quality = calculateHiddenQuality(piece.result);
    const price = getNpcPrice(quality);

    const updatedPlayer = { ...player, gold: player.gold + price };
    setPlayer(updatedPlayer);
    savePlayer(updatedPlayer);

    const updatedPortfolio = portfolio.filter(p => p.id !== pieceId);
    setPortfolio(updatedPortfolio);
    savePortfolio(updatedPortfolio);
  }, [portfolio, player]);

  // List for auction
  const listForAuction = useCallback((pieceId: number) => {
    const piece = portfolio.find(p => p.id === pieceId);
    if (!piece) return;

    const quality = calculateHiddenQuality(piece.result);
    const auctionSlot: AuctionSlot = {
      id: Date.now(),
      piece,
      startedAt: Date.now(),
      durationMs: AUCTION_DURATION_MS,
      hiddenQuality: quality,
    };

    const updatedAuctions = [...auctions, auctionSlot];
    setAuctions(updatedAuctions);
    saveAuctions(updatedAuctions);

    // Remove from portfolio
    const updatedPortfolio = portfolio.filter(p => p.id !== pieceId);
    setPortfolio(updatedPortfolio);
    savePortfolio(updatedPortfolio);
  }, [portfolio, auctions]);

  // Collect auction proceeds
  const collectAuction = useCallback((auctionId: number) => {
    const auction = auctions.find(a => a.id === auctionId);
    if (!auction || !player) return;

    const price = calculateAuctionPrice(auction.hiddenQuality, auction.id);
    const updatedPlayer = { ...player, gold: player.gold + price };
    setPlayer(updatedPlayer);
    savePlayer(updatedPlayer);

    const updatedAuctions = auctions.filter(a => a.id !== auctionId);
    setAuctions(updatedAuctions);
    saveAuctions(updatedAuctions);
  }, [auctions, player]);

  // Delete portfolio piece
  const deletePortfolioPiece = useCallback((pieceId: number) => {
    const updatedPortfolio = portfolio.filter(p => p.id !== pieceId);
    setPortfolio(updatedPortfolio);
    savePortfolio(updatedPortfolio);
  }, [portfolio]);

  // Shop: buy item
  const buyShopItem = useCallback((itemId: string) => {
    if (!player) return;

    const effectiveMinerals = getEffectiveMinerals(player);
    const items = getShopItems(effectiveMinerals, player.bonusSlots);
    const item = items.find(i => i.id === itemId);
    if (!item || player.gold < item.cost) return;

    let updatedPlayer = { ...player, gold: player.gold - item.cost };

    if (item.type === 'mineral' && item.mineralKind) {
      updatedPlayer.bonusMinerals = [...updatedPlayer.bonusMinerals, item.mineralKind];
    } else if (item.type === 'slot') {
      updatedPlayer.bonusSlots = updatedPlayer.bonusSlots + 1;
    }

    setPlayer(updatedPlayer);
    savePlayer(updatedPlayer);
  }, [player]);

  // Recipe book: save current
  const saveCurrentRecipe = useCallback((name: string) => {
    const newRecipe: SavedRecipe = {
      id: Date.now(),
      name,
      recipe: [...recipe],
      kiln: { ...kiln },
      createdAt: Date.now(),
    };
    const updated = [...savedRecipes, newRecipe];
    setSavedRecipes(updated);
    saveRecipes(updated);
  }, [recipe, kiln, savedRecipes]);

  // Recipe book: load
  const loadSavedRecipe = useCallback((saved: SavedRecipe) => {
    setRecipe(saved.recipe);
    setKiln(saved.kiln);
  }, []);

  // Recipe book: delete
  const deleteSavedRecipe = useCallback((id: number) => {
    const updated = savedRecipes.filter(r => r.id !== id);
    setSavedRecipes(updated);
    saveRecipes(updated);
  }, [savedRecipes]);

  // Recipe book: import
  const importSavedRecipe = useCallback((imported: SavedRecipe) => {
    const updated = [...savedRecipes, imported];
    setSavedRecipes(updated);
    saveRecipes(updated);
  }, [savedRecipes]);

  // Sleep: fast-forward to next event
  const handleSleep = useCallback(() => {
    const nextTime = getNextEventTime(firingSlots, auctions);
    if (nextTime === null) return;

    const delta = nextTime - Date.now() + 1000; // +1s buffer
    if (delta <= 0) return;

    // Shift all startedAt backwards by delta
    const updatedSlots = firingSlots.map(s => ({ ...s, startedAt: s.startedAt - delta }));
    setFiringSlots(updatedSlots);
    saveFiringSlots(updatedSlots);

    const updatedAuctions = auctions.map(a => ({ ...a, startedAt: a.startedAt - delta }));
    setAuctions(updatedAuctions);
    saveAuctions(updatedAuctions);
  }, [firingSlots, auctions]);

  if (!player) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const levelConfig = getLevelConfig(player.level);
  const effectiveMaxSlots = getEffectiveMaxSlots(player);
  const effectiveMinerals = getEffectiveMinerals(player);
  const orders = mode === 'fixed' ? ORDERS : dailyOrders;
  const currentOrder = orders[orderIdx];
  const orderDisplayName = (o: { name: string; nameZh: string }) => locale === 'zh' ? o.nameZh : o.name;
  const currentOrderKey = getOrderKey(mode, orderIdx, mode === 'random' ? dailyOrders[orderIdx]?.seed : undefined);
  const currentOrderSubmission = submissions.find(s => s.orderKey === currentOrderKey) ?? null;
  const canFire = firingSlots.length < effectiveMaxSlots;
  const firingLabel = `${t('startFiring')} (${levelConfig.durationHours}h)`;
  const shopItems = getShopItems(effectiveMinerals, player.bonusSlots);

  const tabBtn = (panel: ActivePanel, label: string, badge?: number) => (
    <button
      key={panel}
      onClick={() => setActivePanel(panel)}
      className={`px-4 py-2 rounded-lg font-semibold transition-colors relative ${
        activePanel === panel ? 'bg-orange-600' : 'bg-stone-700 hover:bg-stone-600'
      }`}
    >
      {label}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen p-4 max-w-6xl mx-auto space-y-4">
      <PlayerBar profile={player} onLogout={handleLogout} />

      {/* Tab bar */}
      <div className="flex justify-center gap-2 flex-wrap">
        {tabBtn('orders', t('tab.orders'))}
        {tabBtn('portfolio', t('tab.portfolio'), portfolio.length)}
        {tabBtn('recipeBook', t('tab.recipeBook'))}
        {tabBtn('auction', t('tab.auction'), auctions.length)}
        {tabBtn('shop', t('tab.shop'))}
        {tabBtn('calendar', t('tab.calendar'))}
      </div>

      {/* Orders panel - includes mode toggle, level tree, workbench, kiln */}
      {activePanel === 'orders' && (
        <>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => { setMode('fixed'); setOrderIdx(0); setResult(null); setMatch(null); }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                mode === 'fixed' ? 'bg-orange-600' : 'bg-stone-700 hover:bg-stone-600'
              }`}
            >
              {t('mode.fixed')}
            </button>
            <button
              onClick={() => { setMode('random'); setOrderIdx(0); setResult(null); setMatch(null); }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                mode === 'random' ? 'bg-orange-600' : 'bg-stone-700 hover:bg-stone-600'
              }`}
            >
              {t('mode.random')}
            </button>
            <button
              onClick={() => setShowLevelTree(!showLevelTree)}
              className="px-4 py-2 rounded-lg font-semibold bg-stone-700 hover:bg-stone-600 transition-colors"
            >
              {showLevelTree ? t('levelTree.hide') : t('levelTree.show')} {t('mode.levelTree')}
            </button>
          </div>

          {showLevelTree && (
            <div className="max-w-2xl mx-auto">
              <LevelTree profile={player} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="space-y-4">
              <OrderPanel
                orderIndex={orderIdx}
                orderName={orderDisplayName(currentOrder)}
                target={currentOrder.target}
                lastMatch={match}
                totalOrders={orders.length}
                onPrev={() => { setOrderIdx(orderIdx - 1); setResult(null); setMatch(null); }}
                onNext={() => { setOrderIdx(orderIdx + 1); setResult(null); setMatch(null); }}
                canAdvance={orderIdx < orders.length - 1}
                difficulty={mode === 'random' ? dailyOrders[orderIdx]?.difficulty : undefined}
                hasPortfolioPieces={portfolio.length > 0 && !currentOrderSubmission}
                onSubmitFromPortfolio={() => setActivePanel('portfolio')}
                submission={currentOrderSubmission}
              />
              <PotteryPreview
                result={result ?? intuitionResult}
                isIntuition={!result && !!intuitionResult}
              />
              <FiringSlotPanel
                slots={firingSlots}
                maxSlots={effectiveMaxSlots}
                onCollect={collectFiring}
              />
            </div>

            <div className="space-y-4">
              <Workbench
                recipe={recipe}
                onChange={setRecipe}
                maxSlots={effectiveMaxSlots}
                unlockedMinerals={effectiveMinerals}
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
        </>
      )}

      {/* Portfolio panel */}
      {activePanel === 'portfolio' && (
        <PortfolioPanel
          portfolio={portfolio}
          onSubmitOrder={submitPortfolioPiece}
          onSellNpc={sellToNpc}
          onListAuction={listForAuction}
          onDelete={deletePortfolioPiece}
        />
      )}

      {/* Recipe book panel */}
      {activePanel === 'recipeBook' && (
        <RecipeBookPanel
          recipes={savedRecipes}
          onSave={saveCurrentRecipe}
          onLoad={loadSavedRecipe}
          onDelete={deleteSavedRecipe}
          onImport={importSavedRecipe}
        />
      )}

      {/* Auction panel */}
      {activePanel === 'auction' && (
        <AuctionPanel
          auctions={auctions}
          onCollect={collectAuction}
        />
      )}

      {/* Shop panel */}
      {activePanel === 'shop' && (
        <ShopPanel
          items={shopItems}
          gold={player.gold}
          onBuy={buyShopItem}
        />
      )}

      {/* Calendar panel */}
      {activePanel === 'calendar' && (
        <CalendarPanel
          firingSlots={firingSlots}
          auctions={auctions}
          nextEventTime={getNextEventTime(firingSlots, auctions)}
          onSleep={handleSleep}
        />
      )}

      {/* Save dialog overlay */}
      {showSaveDialog && (
        <PortfolioSaveDialog
          result={showSaveDialog.result}
          matchScore={showSaveDialog.matchScore}
          orderName={showSaveDialog.orderName}
          onSave={handleSaveToPortfolio}
          onDiscard={handleDiscardPiece}
        />
      )}

      <DebugPanel onClearData={handleClearData} />
    </div>
  );
}

export default function App() {
  return (
    <LocaleProvider>
      <AppContent />
    </LocaleProvider>
  );
}
