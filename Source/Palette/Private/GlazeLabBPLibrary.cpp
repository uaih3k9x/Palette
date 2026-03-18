#include "GlazeLabBPLibrary.h"

#include "Materials/MaterialInstanceDynamic.h"

#define LOCTEXT_NAMESPACE "GlazeLab"

namespace GlazeLab
{
    static FLinearColor ClampColor(const FLinearColor& InColor)
    {
        return FLinearColor(
            FMath::Clamp(InColor.R, 0.0f, 1.0f),
            FMath::Clamp(InColor.G, 0.0f, 1.0f),
            FMath::Clamp(InColor.B, 0.0f, 1.0f),
            1.0f);
    }

    static float TemperatureToAlpha(const float TemperatureCelsius)
    {
        return FMath::GetMappedRangeValueClamped(FVector2D(980.0f, 1280.0f), FVector2D(0.0f, 1.0f), TemperatureCelsius);
    }

    static FLinearColor GetClayBase(const float ClayWarmth)
    {
        const FLinearColor CoolClay(0.34f, 0.30f, 0.27f, 1.0f);
        const FLinearColor WarmClay(0.52f, 0.38f, 0.25f, 1.0f);
        return FLinearColor::LerpUsingHSV(CoolClay, WarmClay, FMath::Clamp(ClayWarmth, 0.0f, 1.0f));
    }

    static float Distance3(const FLinearColor& A, const FLinearColor& B)
    {
        return FVector(A.R - B.R, A.G - B.G, A.B - B.B).Length() / 1.7320508076f;
    }
}

FGlazeMineralDefinition UGlazeLabBPLibrary::MakeStarterMineral(const EStarterMineralKind Kind)
{
    FGlazeMineralDefinition Mineral;

    switch (Kind)
    {
    case EStarterMineralKind::IronOxide:
        Mineral.MineralId = TEXT("IronOxide");
        Mineral.DisplayName = LOCTEXT("IronOxideName", "Iron Oxide");
        Mineral.BaseTint = FLinearColor(0.46f, 0.28f, 0.14f, 1.0f);
        Mineral.OxidationTint = FLinearColor(0.18f, 0.09f, 0.01f, 1.0f);
        Mineral.ReductionTint = FLinearColor(0.05f, 0.03f, 0.02f, 1.0f);
        Mineral.ColorStrength = 1.05f;
        Mineral.RoughnessDelta = 0.08f;
        Mineral.SpeckleDelta = 0.08f;
        Mineral.TemperatureResponse = -0.35f;
        Mineral.CoolingResponse = 0.10f;
        Mineral.AtmosphereResponse = -0.15f;
        Mineral.StableMaxShare = 0.55f;
        Mineral.FailureRiskPerExcess = 1.0f;
        Mineral.FailureTint = FLinearColor(0.16f, 0.12f, 0.08f, 1.0f);
        Mineral.ShortNote = LOCTEXT("IronOxideNote", "Reliable earth browns; can go near-black when pushed hot.");
        break;

    case EStarterMineralKind::CopperCarbonate:
        Mineral.MineralId = TEXT("CopperCarbonate");
        Mineral.DisplayName = LOCTEXT("CopperCarbonateName", "Copper Carbonate");
        Mineral.BaseTint = FLinearColor(0.08f, 0.36f, 0.30f, 1.0f);
        Mineral.OxidationTint = FLinearColor(0.04f, 0.28f, 0.22f, 1.0f);
        Mineral.ReductionTint = FLinearColor(0.62f, 0.10f, 0.08f, 1.0f);
        Mineral.ColorStrength = 1.20f;
        Mineral.MetallicDelta = 0.06f;
        Mineral.MottlingDelta = 0.10f;
        Mineral.OpacityDelta = 0.06f;
        Mineral.TemperatureResponse = 0.20f;
        Mineral.CoolingResponse = 0.18f;
        Mineral.AtmosphereResponse = 0.80f;
        Mineral.StableMaxShare = 0.18f;
        Mineral.FailureRiskPerExcess = 1.45f;
        Mineral.FailureTint = FLinearColor(0.22f, 0.16f, 0.11f, 1.0f);
        Mineral.ShortNote = LOCTEXT("CopperCarbonateNote", "Reduction can flip copper from green to a smoky red.");
        break;

    case EStarterMineralKind::CobaltOxide:
        Mineral.MineralId = TEXT("CobaltOxide");
        Mineral.DisplayName = LOCTEXT("CobaltOxideName", "Cobalt Oxide");
        Mineral.BaseTint = FLinearColor(0.08f, 0.18f, 0.65f, 1.0f);
        Mineral.OxidationTint = FLinearColor(0.02f, 0.12f, 0.30f, 1.0f);
        Mineral.ReductionTint = FLinearColor(0.08f, 0.04f, 0.20f, 1.0f);
        Mineral.ColorStrength = 2.35f;
        Mineral.MottlingDelta = 0.05f;
        Mineral.OpacityDelta = -0.04f;
        Mineral.TemperatureResponse = 0.15f;
        Mineral.CoolingResponse = 0.05f;
        Mineral.AtmosphereResponse = -0.10f;
        Mineral.StableMaxShare = 0.10f;
        Mineral.FailureRiskPerExcess = 2.00f;
        Mineral.FailureTint = FLinearColor(0.05f, 0.07f, 0.15f, 1.0f);
        Mineral.ShortNote = LOCTEXT("CobaltOxideNote", "Very strong. Small amounts dominate the palette quickly.");
        break;

    case EStarterMineralKind::ManganeseDioxide:
        Mineral.MineralId = TEXT("ManganeseDioxide");
        Mineral.DisplayName = LOCTEXT("ManganeseDioxideName", "Manganese Dioxide");
        Mineral.BaseTint = FLinearColor(0.28f, 0.16f, 0.20f, 1.0f);
        Mineral.OxidationTint = FLinearColor(0.12f, 0.08f, 0.10f, 1.0f);
        Mineral.ReductionTint = FLinearColor(0.08f, 0.07f, 0.08f, 1.0f);
        Mineral.ColorStrength = 0.95f;
        Mineral.RoughnessDelta = 0.10f;
        Mineral.SpeckleDelta = 0.22f;
        Mineral.MottlingDelta = 0.12f;
        Mineral.TemperatureResponse = -0.10f;
        Mineral.CoolingResponse = 0.28f;
        Mineral.AtmosphereResponse = -0.20f;
        Mineral.StableMaxShare = 0.25f;
        Mineral.FailureRiskPerExcess = 1.10f;
        Mineral.FailureTint = FLinearColor(0.10f, 0.08f, 0.08f, 1.0f);
        Mineral.ShortNote = LOCTEXT("ManganeseDioxideNote", "Adds mottling, speckles, and smoky violet-brown breaks.");
        break;

    case EStarterMineralKind::TitaniumDioxide:
        Mineral.MineralId = TEXT("TitaniumDioxide");
        Mineral.DisplayName = LOCTEXT("TitaniumDioxideName", "Titanium Dioxide");
        Mineral.BaseTint = FLinearColor(0.60f, 0.54f, 0.38f, 1.0f);
        Mineral.OxidationTint = FLinearColor(0.10f, 0.10f, 0.08f, 1.0f);
        Mineral.ReductionTint = FLinearColor(0.08f, 0.07f, 0.06f, 1.0f);
        Mineral.ColorStrength = 0.58f;
        Mineral.RoughnessDelta = 0.05f;
        Mineral.SpeckleDelta = 0.10f;
        Mineral.MottlingDelta = 0.16f;
        Mineral.OpacityDelta = 0.24f;
        Mineral.TemperatureResponse = 0.12f;
        Mineral.CoolingResponse = 0.55f;
        Mineral.AtmosphereResponse = 0.00f;
        Mineral.StableMaxShare = 0.45f;
        Mineral.FailureRiskPerExcess = 0.80f;
        Mineral.FailureTint = FLinearColor(0.42f, 0.38f, 0.30f, 1.0f);
        Mineral.ShortNote = LOCTEXT("TitaniumDioxideNote", "Creams the glaze and helps slow cooling produce clustered breaks.");
        break;

    case EStarterMineralKind::ChromiumOxide:
    default:
        Mineral.MineralId = TEXT("ChromiumOxide");
        Mineral.DisplayName = LOCTEXT("ChromiumOxideName", "Chromium Oxide");
        Mineral.BaseTint = FLinearColor(0.12f, 0.36f, 0.14f, 1.0f);
        Mineral.OxidationTint = FLinearColor(0.04f, 0.18f, 0.05f, 1.0f);
        Mineral.ReductionTint = FLinearColor(0.12f, 0.10f, 0.04f, 1.0f);
        Mineral.ColorStrength = 1.35f;
        Mineral.RoughnessDelta = 0.04f;
        Mineral.MottlingDelta = 0.08f;
        Mineral.OpacityDelta = 0.05f;
        Mineral.TemperatureResponse = -0.05f;
        Mineral.CoolingResponse = 0.10f;
        Mineral.AtmosphereResponse = -0.35f;
        Mineral.StableMaxShare = 0.14f;
        Mineral.FailureRiskPerExcess = 1.40f;
        Mineral.FailureTint = FLinearColor(0.14f, 0.12f, 0.07f, 1.0f);
        Mineral.ShortNote = LOCTEXT("ChromiumOxideNote", "Clean greens in oxidation, muddier olive under heavy reduction.");
        break;
    }

    return Mineral;
}

TArray<FGlazeMineralStack> UGlazeLabBPLibrary::MakeStarterRecipe()
{
    TArray<FGlazeMineralStack> Recipe;

    FGlazeMineralStack Iron;
    Iron.Mineral = MakeStarterMineral(EStarterMineralKind::IronOxide);
    Iron.Parts = 0.28f;
    Recipe.Add(Iron);

    FGlazeMineralStack Titanium;
    Titanium.Mineral = MakeStarterMineral(EStarterMineralKind::TitaniumDioxide);
    Titanium.Parts = 0.22f;
    Recipe.Add(Titanium);

    FGlazeMineralStack Copper;
    Copper.Mineral = MakeStarterMineral(EStarterMineralKind::CopperCarbonate);
    Copper.Parts = 0.08f;
    Recipe.Add(Copper);

    FGlazeMineralStack Manganese;
    Manganese.Mineral = MakeStarterMineral(EStarterMineralKind::ManganeseDioxide);
    Manganese.Parts = 0.10f;
    Recipe.Add(Manganese);

    return Recipe;
}

FGlazeKilnSettings UGlazeLabBPLibrary::MakeStarterKilnSettings()
{
    return FGlazeKilnSettings();
}

FGlazeFiringResult UGlazeLabBPLibrary::SimulateFiring(const TArray<FGlazeMineralStack>& Recipe, const FGlazeKilnSettings& KilnSettings)
{
    FGlazeFiringResult Result;
    Result.Notes.Reset();

    const float Thickness = FMath::Clamp(KilnSettings.GlazeThickness, 0.0f, 1.0f);
    const float CoolingRate = FMath::Clamp(KilnSettings.CoolingRate, 0.0f, 1.0f);
    const float Variance = FMath::Clamp(KilnSettings.SurfaceVariance, 0.0f, 1.0f);
    const float TemperatureAlpha = GlazeLab::TemperatureToAlpha(KilnSettings.TemperatureCelsius);
    const FLinearColor ClayBase = GlazeLab::GetClayBase(KilnSettings.ClayWarmth);

    float TotalParts = 0.0f;
    for (const FGlazeMineralStack& Stack : Recipe)
    {
        TotalParts += FMath::Max(0.0f, Stack.Parts);
    }

    if (TotalParts <= KINDA_SMALL_NUMBER)
    {
        Result.SurfaceColor = ClayBase;
        Result.RimColor = GlazeLab::ClampColor(ClayBase * 1.08f);
        Result.Roughness = 0.78f;
        Result.Opacity = 0.12f;
        Result.Notes.Add(LOCTEXT("NoMineralsNote", "No mineral load applied. You are mostly seeing the clay body."));
        return Result;
    }

    FRandomStream Random(KilnSettings.VariationSeed);
    FLinearColor ColorAccumulator = FLinearColor::Black;
    FLinearColor FailureAccumulator = FLinearColor::Black;
    float Roughness = 0.62f - (0.12f * TemperatureAlpha) + (0.08f * Thickness);
    float Metallic = 0.01f;
    float Speckle = 0.02f + (0.04f * Thickness);
    float Mottling = 0.03f + (0.04f * Variance);
    float Opacity = 0.30f + (0.42f * Thickness);
    float BurnRisk = FMath::Max(0.0f, TemperatureAlpha - 0.82f) * 0.32f;
    float StabilityPenalty = 0.0f;

    for (const FGlazeMineralStack& Stack : Recipe)
    {
        if (Stack.Parts <= 0.0f || Stack.Mineral.MineralId.IsNone())
        {
            continue;
        }

        const FGlazeMineralDefinition& Mineral = Stack.Mineral;
        const float Share = Stack.Parts / TotalParts;

        FLinearColor AtmosphereTint = (Mineral.OxidationTint + Mineral.ReductionTint) * 0.5f;
        if (KilnSettings.Atmosphere == EGlazeAtmosphere::Oxidation)
        {
            AtmosphereTint = Mineral.OxidationTint;
            Roughness += Share * FMath::Max(0.0f, -Mineral.AtmosphereResponse) * 0.08f;
        }
        else if (KilnSettings.Atmosphere == EGlazeAtmosphere::Reduction)
        {
            AtmosphereTint = Mineral.ReductionTint;
            Metallic += Share * FMath::Max(0.0f, Mineral.AtmosphereResponse) * 0.10f;
            BurnRisk += Share * FMath::Max(0.0f, Mineral.AtmosphereResponse) * 0.05f;
        }

        FLinearColor MineralTint = GlazeLab::ClampColor(Mineral.BaseTint + AtmosphereTint);
        const float TemperatureScale = (Mineral.TemperatureResponse >= 0.0f)
            ? FMath::Lerp(1.0f, 1.0f + (Mineral.TemperatureResponse * 0.35f), TemperatureAlpha)
            : FMath::Lerp(1.0f, 1.0f + (Mineral.TemperatureResponse * 0.45f), TemperatureAlpha);

        MineralTint = GlazeLab::ClampColor(MineralTint * TemperatureScale);
        ColorAccumulator += MineralTint * (Share * Mineral.ColorStrength * FMath::Lerp(0.85f, 1.15f, Thickness));

        Roughness += Share * Mineral.RoughnessDelta;
        Metallic += Share * Mineral.MetallicDelta;
        Speckle += Share * Mineral.SpeckleDelta;
        Mottling += Share * (Mineral.MottlingDelta + (Mineral.CoolingResponse * CoolingRate * 0.35f));
        Opacity += Share * Mineral.OpacityDelta;

        const float ExcessShare = FMath::Max(0.0f, Share - Mineral.StableMaxShare);
        if (ExcessShare > 0.0f)
        {
            const float ExcessRisk = ExcessShare * Mineral.FailureRiskPerExcess * (0.65f + (TemperatureAlpha * 0.85f));
            BurnRisk += ExcessRisk;
            StabilityPenalty += ExcessRisk * 0.55f;
            FailureAccumulator += Mineral.FailureTint * Share;

            const FText MineralName = Mineral.DisplayName.IsEmpty()
                ? FText::FromName(Mineral.MineralId)
                : Mineral.DisplayName;

            Result.Notes.Add(FText::Format(
                LOCTEXT("MineralUnstableFormat", "{0} is above its stable range and may muddy the firing."),
                MineralName));
        }
    }

    const float JitterAmount = Variance * 0.08f;
    ColorAccumulator.R = FMath::Clamp(ColorAccumulator.R + Random.FRandRange(-JitterAmount, JitterAmount), 0.0f, 1.0f);
    ColorAccumulator.G = FMath::Clamp(ColorAccumulator.G + Random.FRandRange(-JitterAmount, JitterAmount), 0.0f, 1.0f);
    ColorAccumulator.B = FMath::Clamp(ColorAccumulator.B + Random.FRandRange(-JitterAmount, JitterAmount), 0.0f, 1.0f);

    Speckle += FMath::Max(0.0f, Random.FRandRange(-Variance * 0.10f, Variance * 0.12f));
    Mottling += FMath::Max(0.0f, Random.FRandRange(-Variance * 0.10f, Variance * 0.14f));
    BurnRisk += FMath::Max(0.0f, Random.FRandRange(-Variance * 0.06f, Variance * 0.10f));

    const float Coverage = FMath::Clamp(0.35f + (Thickness * 0.42f) + (Opacity * 0.10f), 0.15f, 0.95f);
    FLinearColor SurfaceColor = FMath::Lerp(ClayBase, GlazeLab::ClampColor(ColorAccumulator), Coverage);
    const float FailureBlend = FMath::Clamp((BurnRisk - 0.55f) / 0.40f, 0.0f, 1.0f);
    if (FailureBlend > 0.0f)
    {
        SurfaceColor = FMath::Lerp(SurfaceColor, GlazeLab::ClampColor((FailureAccumulator * 1.2f) + (ClayBase * 0.45f)), FailureBlend);
    }

    Result.SurfaceColor = GlazeLab::ClampColor(SurfaceColor);
    Result.RimColor = GlazeLab::ClampColor(FMath::Lerp(Result.SurfaceColor * 1.08f, ClayBase, (1.0f - Thickness) * 0.35f));
    Result.Roughness = FMath::Clamp(Roughness, 0.05f, 1.0f);
    Result.Metallic = FMath::Clamp(Metallic, 0.0f, 0.35f);
    Result.Speckle = FMath::Clamp(Speckle, 0.0f, 1.0f);
    Result.Mottling = FMath::Clamp(Mottling, 0.0f, 1.0f);
    Result.Opacity = FMath::Clamp(Opacity, 0.05f, 1.0f);
    Result.BurnRisk = FMath::Clamp(BurnRisk, 0.0f, 1.0f);
    Result.Stability = FMath::Clamp(1.0f - (Result.BurnRisk * 0.65f) - StabilityPenalty - (Variance * 0.10f), 0.0f, 1.0f);
    Result.bLikelyFailed = (Result.BurnRisk >= 0.78f) || (Result.Stability <= 0.20f);

    if (Result.bLikelyFailed)
    {
        Result.Notes.Add(LOCTEXT("FailureNote", "The kiln run is unstable and likely scorched or muddied the glaze."));
    }
    else if (CoolingRate >= 0.70f)
    {
        Result.Notes.Add(LOCTEXT("SlowCoolNote", "Slow cooling pushed more mottling and crystal-like breaks into the glaze."));
    }
    else if (KilnSettings.Atmosphere == EGlazeAtmosphere::Reduction)
    {
        Result.Notes.Add(LOCTEXT("ReductionNote", "Reduction deepened warm minerals and flattened some bright oxidation colors."));
    }
    else
    {
        Result.Notes.Add(LOCTEXT("CleanFiringNote", "The firing stayed mostly clean and readable, good for matching a target order."));
    }

    return Result;
}

FGlazeMatchResult UGlazeLabBPLibrary::EvaluateAgainstTarget(const FGlazeFiringResult& Result, const FGlazeTargetProfile& Target)
{
    FGlazeMatchResult Match;

    Match.ColorDistance = GlazeLab::Distance3(Result.SurfaceColor, Target.TargetColor);
    Match.SurfaceDistance =
        (FMath::Abs(Result.Roughness - Target.TargetRoughness) * 0.40f) +
        (FMath::Abs(Result.Speckle - Target.TargetSpeckle) * 0.30f) +
        (FMath::Abs(Result.Mottling - Target.TargetMottling) * 0.30f);

    const float WeightedDistance =
        (Match.ColorDistance * Target.ColorWeight) +
        (Match.SurfaceDistance * Target.SurfaceWeight) +
        (Result.bLikelyFailed ? 0.20f : 0.0f);

    const float WeightTotal = Target.ColorWeight + Target.SurfaceWeight + 0.20f;
    Match.Score = FMath::Clamp(100.0f * (1.0f - (WeightedDistance / WeightTotal)), 0.0f, 100.0f);
    Match.bWithinTolerance =
        Match.ColorDistance <= Target.ColorTolerance &&
        Match.SurfaceDistance <= Target.SurfaceTolerance &&
        !Result.bLikelyFailed;

    return Match;
}

void UGlazeLabBPLibrary::ApplyFiringResultToMaterial(
    UMaterialInstanceDynamic* MaterialInstance,
    const FGlazeFiringResult& Result,
    const FGlazeMaterialParameterNames& ParameterNames)
{
    if (!MaterialInstance)
    {
        return;
    }

    MaterialInstance->SetVectorParameterValue(ParameterNames.SurfaceColorParameter, Result.SurfaceColor);
    MaterialInstance->SetVectorParameterValue(ParameterNames.RimColorParameter, Result.RimColor);
    MaterialInstance->SetScalarParameterValue(ParameterNames.RoughnessParameter, Result.Roughness);
    MaterialInstance->SetScalarParameterValue(ParameterNames.MetallicParameter, Result.Metallic);
    MaterialInstance->SetScalarParameterValue(ParameterNames.SpeckleParameter, Result.Speckle);
    MaterialInstance->SetScalarParameterValue(ParameterNames.MottlingParameter, Result.Mottling);
    MaterialInstance->SetScalarParameterValue(ParameterNames.OpacityParameter, Result.Opacity);
    MaterialInstance->SetScalarParameterValue(ParameterNames.BurnRiskParameter, Result.BurnRisk);
}

#undef LOCTEXT_NAMESPACE
