# Palette Web — Implementation Complete

## Summary

Successfully implemented all 4 features for the Palette ceramic glaze web game:

### 1. Registration System ✓
- `AuthScreen.tsx` — Login/registration interface
- Username validation (3-16 characters)
- Automatic player creation or loading from localStorage
- Clean, centered card UI

### 2. Real 8-Hour Firing System ✓
- `FiringSlotPanel.tsx` — Real-time firing slot management
- Actual time-based firing (8h → 3.5h based on level)
- Live countdown timers (updates every second)
- Progress bars showing firing completion
- "Collect" button appears when firing completes
- Results calculated only when collected (not when started)

### 3. Daily Random Tasks ✓
- `random-orders.ts` — Daily seed-based random order generation
- 3 difficulty levels: Easy (×1 XP), Medium (×1.5 XP), Hard (×2 XP)
- Different tolerances per difficulty
- Random color/surface properties with adjective+noun names
- Mode toggle between Fixed Orders and Daily Random

### 4. Level & Unlock System ✓
- `player.ts` — Complete progression system (Level 1-10)
- XP awards based on score and difficulty
- Automatic level-up with unlocks:
  - Level 1: 3 minerals, 1 slot, 8h firing
  - Level 10: 6 minerals, 4 slots, 3.5h firing
- Mineral unlock progression (Iron/Titanium/Copper → +Manganese → +Cobalt → +Chromium)
- Recipe slot limits enforced
- Locked minerals shown with 🔒 in dropdown

## Modified Components

### `Workbench.tsx`
- Added `maxSlots`, `unlockedMinerals`, `disabled` props
- Shows current/max slot count
- Locked minerals displayed but not selectable
- All controls disabled during result collection

### `KilnSettings.tsx`
- Added `disabled`, `firingLabel`, `canFire` props
- Button shows firing duration (e.g., "Start Firing (8h)")
- Disabled when slots full or collecting results
- Tooltip on disabled button

### `OrderPanel.tsx`
- Added `difficulty` prop
- Difficulty badge (green/yellow/red) for random tasks

### `App.tsx`
- Complete rewrite with new state management
- Player authentication flow
- Firing slot queue management
- Mode switching (Fixed/Random)
- XP award and level-up logic
- localStorage persistence

## New Components

- `AuthScreen.tsx` — Login interface
- `PlayerBar.tsx` — Top bar with username, level, XP progress
- `FiringSlotPanel.tsx` — Firing queue with live timers

## localStorage Keys

- `palette_player` — PlayerProfile JSON
- `palette_firings` — FiringSlot[] JSON

## Testing

Build successful. Dev server running at http://localhost:5173

### Test Flow
1. Open browser → Login screen → Enter username
2. Level 1: 3 minerals (Iron/Titanium/Copper), 1 slot, 8h firing
3. Adjust recipe → "Start Firing (8h)" → Slot shows countdown
4. (For testing: temporarily change `durationMs` to 10000 in player.ts)
5. Firing completes → "Collect" button appears (animated pulse)
6. Click Collect → Results shown → XP awarded
7. Level up → New minerals/slots unlock
8. Switch to "Daily Random" → 3 tasks (Easy/Medium/Hard)
9. Refresh page → All state restored from localStorage

## Level Progression Table

| Level | XP Required | Minerals | Slots | Duration |
|-------|-------------|----------|-------|----------|
| 1 | 0 | 3 | 1 | 8h |
| 2 | 100 | 4 | 1 | 7.5h |
| 3 | 250 | 4 | 2 | 7h |
| 4 | 450 | 5 | 2 | 6.5h |
| 5 | 700 | 5 | 2 | 6h |
| 6 | 1000 | 6 | 3 | 5.5h |
| 7 | 1400 | 6 | 3 | 5h |
| 8 | 1900 | 6 | 3 | 4.5h |
| 9 | 2500 | 6 | 4 | 4h |
| 10 | 3200 | 6 | 4 | 3.5h |

## Architecture

- Pure frontend (no backend)
- localStorage for persistence
- Real-time countdown with `setInterval`
- Deterministic random generation (mulberry32 PRNG)
- Daily seed based on date string hash
- Modular component structure
- TypeScript for type safety
