#pragma once

#include "CoreMinimal.h"
#include "Engine/DataTable.h"

#include "GlazeLabTypes.generated.h"

UENUM(BlueprintType)
enum class EGlazeAtmosphere : uint8
{
    Oxidation,
    Neutral,
    Reduction
};

UENUM(BlueprintType)
enum class EStarterMineralKind : uint8
{
    IronOxide,
    CopperCarbonate,
    CobaltOxide,
    ManganeseDioxide,
    TitaniumDioxide,
    ChromiumOxide
};

USTRUCT(BlueprintType)
struct PALETTE_API FGlazeMineralDefinition : public FTableRowBase
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Identity")
    FName MineralId = TEXT("Mineral");

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Identity")
    FText DisplayName;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Color")
    FLinearColor BaseTint = FLinearColor(0.5f, 0.5f, 0.5f, 1.0f);

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Color")
    FLinearColor OxidationTint = FLinearColor::Black;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Color")
    FLinearColor ReductionTint = FLinearColor::Black;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Color", meta = (ClampMin = "0.05", ClampMax = "3.0"))
    float ColorStrength = 1.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Surface", meta = (ClampMin = "-1.0", ClampMax = "1.0"))
    float RoughnessDelta = 0.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Surface", meta = (ClampMin = "-1.0", ClampMax = "1.0"))
    float MetallicDelta = 0.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Surface", meta = (ClampMin = "0.0", ClampMax = "2.0"))
    float SpeckleDelta = 0.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Surface", meta = (ClampMin = "0.0", ClampMax = "2.0"))
    float MottlingDelta = 0.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Surface", meta = (ClampMin = "-1.0", ClampMax = "1.0"))
    float OpacityDelta = 0.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Kiln", meta = (ClampMin = "-1.0", ClampMax = "1.0"))
    float TemperatureResponse = 0.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Kiln", meta = (ClampMin = "-1.0", ClampMax = "1.0"))
    float CoolingResponse = 0.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Kiln", meta = (ClampMin = "-1.0", ClampMax = "1.0"))
    float AtmosphereResponse = 0.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Failure", meta = (ClampMin = "0.0", ClampMax = "1.0"))
    float StableMaxShare = 0.25f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Failure", meta = (ClampMin = "0.0", ClampMax = "5.0"))
    float FailureRiskPerExcess = 1.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Failure")
    FLinearColor FailureTint = FLinearColor(0.15f, 0.12f, 0.10f, 1.0f);

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Notes")
    FText ShortNote;
};

USTRUCT(BlueprintType)
struct PALETTE_API FGlazeMineralStack
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Recipe")
    FGlazeMineralDefinition Mineral;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Recipe", meta = (ClampMin = "0.0", ClampMax = "1.0"))
    float Parts = 0.0f;
};

USTRUCT(BlueprintType)
struct PALETTE_API FGlazeKilnSettings
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Kiln", meta = (ClampMin = "900.0", ClampMax = "1320.0", UIMin = "980.0", UIMax = "1280.0"))
    float TemperatureCelsius = 1220.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Kiln")
    EGlazeAtmosphere Atmosphere = EGlazeAtmosphere::Oxidation;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Kiln", meta = (ClampMin = "0.0", ClampMax = "1.0"))
    float GlazeThickness = 0.55f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Kiln", meta = (ClampMin = "0.0", ClampMax = "1.0"))
    float CoolingRate = 0.45f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Kiln", meta = (ClampMin = "0.0", ClampMax = "1.0"))
    float ClayWarmth = 0.55f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Kiln", meta = (ClampMin = "0.0", ClampMax = "1.0"))
    float SurfaceVariance = 0.12f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Kiln")
    int32 VariationSeed = 1337;
};

USTRUCT(BlueprintType)
struct PALETTE_API FGlazeFiringResult
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Result")
    FLinearColor SurfaceColor = FLinearColor(0.45f, 0.35f, 0.28f, 1.0f);

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Result")
    FLinearColor RimColor = FLinearColor(0.50f, 0.38f, 0.30f, 1.0f);

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Result", meta = (ClampMin = "0.0", ClampMax = "1.0"))
    float Roughness = 0.65f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Result", meta = (ClampMin = "0.0", ClampMax = "1.0"))
    float Metallic = 0.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Result", meta = (ClampMin = "0.0", ClampMax = "1.0"))
    float Speckle = 0.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Result", meta = (ClampMin = "0.0", ClampMax = "1.0"))
    float Mottling = 0.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Result", meta = (ClampMin = "0.0", ClampMax = "1.0"))
    float Opacity = 0.5f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Result", meta = (ClampMin = "0.0", ClampMax = "1.0"))
    float BurnRisk = 0.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Result", meta = (ClampMin = "0.0", ClampMax = "1.0"))
    float Stability = 1.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Result")
    bool bLikelyFailed = false;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Result")
    TArray<FText> Notes;
};

USTRUCT(BlueprintType)
struct PALETTE_API FGlazeTargetProfile
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Target")
    FLinearColor TargetColor = FLinearColor(0.38f, 0.56f, 0.44f, 1.0f);

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Target", meta = (ClampMin = "0.0", ClampMax = "1.0"))
    float TargetRoughness = 0.45f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Target", meta = (ClampMin = "0.0", ClampMax = "1.0"))
    float TargetSpeckle = 0.15f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Target", meta = (ClampMin = "0.0", ClampMax = "1.0"))
    float TargetMottling = 0.20f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Target", meta = (ClampMin = "0.01", ClampMax = "1.0"))
    float ColorTolerance = 0.16f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Target", meta = (ClampMin = "0.01", ClampMax = "1.0"))
    float SurfaceTolerance = 0.18f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Target", meta = (ClampMin = "0.1", ClampMax = "5.0"))
    float ColorWeight = 1.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Target", meta = (ClampMin = "0.1", ClampMax = "5.0"))
    float SurfaceWeight = 0.65f;
};

USTRUCT(BlueprintType)
struct PALETTE_API FGlazeMatchResult
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Match")
    float Score = 0.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Match")
    float ColorDistance = 1.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Match")
    float SurfaceDistance = 1.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Match")
    bool bWithinTolerance = false;
};

USTRUCT(BlueprintType)
struct PALETTE_API FGlazeMaterialParameterNames
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Material")
    FName SurfaceColorParameter = TEXT("GlazeColor");

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Material")
    FName RimColorParameter = TEXT("RimColor");

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Material")
    FName RoughnessParameter = TEXT("GlazeRoughness");

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Material")
    FName MetallicParameter = TEXT("GlazeMetallic");

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Material")
    FName SpeckleParameter = TEXT("SpeckleAmount");

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Material")
    FName MottlingParameter = TEXT("MottlingAmount");

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Material")
    FName OpacityParameter = TEXT("GlazeOpacity");

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Material")
    FName BurnRiskParameter = TEXT("BurnRisk");
};

