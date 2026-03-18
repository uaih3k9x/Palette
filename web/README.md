# Palette — Web

React + Vite web port of the UE5 pottery glaze lab game.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Build

```bash
npm run build
npm run preview
```

## Game Flow

1. Start with Order 1 and the default starter recipe
2. Adjust mineral parts and kiln settings
3. Fire the kiln to see results
4. Match the target color and surface properties
5. Score ≥70 and within tolerance → advance to next order
6. Complete all 10 orders

## Simulation

All glaze simulation logic is ported 1:1 from `Source/Palette/Private/GlazeLabBPLibrary.cpp` with identical numeric constants and algorithms.
