# Palette

UE5 game jam prototype scaffold for a pottery glaze lab game.

## What is included

- A C++ Unreal project skeleton.
- A glaze simulation library that maps mineral recipe input to previewable surface parameters.
- Starter mineral presets for iron, copper, cobalt, manganese, titanium, and chromium.
- A `GlazeLabWorkbench` actor that can drive a pottery mesh with dynamic material parameters.
- A scoring function for order-style gameplay where the player matches a target glaze.

## Quick start in Unreal

1. Open `Palette.uproject` in Unreal Engine 5 and let Unreal generate project files.
2. Build the C++ module when prompted.
3. Create a material for your pottery mesh with these parameters:
   - `GlazeColor` (Vector)
   - `RimColor` (Vector)
   - `GlazeRoughness` (Scalar)
   - `GlazeMetallic` (Scalar)
   - `SpeckleAmount` (Scalar)
   - `MottlingAmount` (Scalar)
   - `GlazeOpacity` (Scalar)
   - `BurnRisk` (Scalar)
4. Drop a `GlazeLabWorkbench` actor into the level.
5. Assign your pottery mesh and material to the actor.
6. Use `Reset To Starter Recipe` in the Details panel for a safe default setup.
7. Change `Current Recipe` and `Kiln Settings`, then call `Rebuild Preview`.

## Notes on the simulation model

- This is intentionally rule-driven, not physically accurate ceramic chemistry.
- `Parts` are relative colorant weights inside the playable system, not a full glaze batch formula.
- `CoolingRate` assumes `0.0` is fast cooling and `1.0` is slow cooling.
- `ClayWarmth` controls how warm or cool the clay body shows through under thin glaze.
- `SurfaceVariance` is for game feel. Raising it makes the kiln less predictable.

## Suggested next steps

- Build a UMG control panel for sliders and buttons.
- Add 10 to 20 target glaze orders using `FGlazeTargetProfile`.
- Store successful recipes in a simple notebook save system.
- Add audio, kiln VFX, and a reveal animation when firing completes.

