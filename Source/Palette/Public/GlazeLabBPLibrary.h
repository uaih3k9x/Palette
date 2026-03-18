#pragma once

#include "CoreMinimal.h"
#include "Kismet/BlueprintFunctionLibrary.h"

#include "GlazeLabTypes.h"
#include "GlazeLabBPLibrary.generated.h"

class UMaterialInstanceDynamic;

UCLASS()
class PALETTE_API UGlazeLabBPLibrary : public UBlueprintFunctionLibrary
{
    GENERATED_BODY()

public:
    UFUNCTION(BlueprintPure, Category = "Glaze Lab")
    static FGlazeMineralDefinition MakeStarterMineral(EStarterMineralKind Kind);

    UFUNCTION(BlueprintPure, Category = "Glaze Lab")
    static TArray<FGlazeMineralStack> MakeStarterRecipe();

    UFUNCTION(BlueprintPure, Category = "Glaze Lab")
    static FGlazeKilnSettings MakeStarterKilnSettings();

    UFUNCTION(BlueprintPure, Category = "Glaze Lab")
    static FGlazeFiringResult SimulateFiring(const TArray<FGlazeMineralStack>& Recipe, const FGlazeKilnSettings& KilnSettings);

    UFUNCTION(BlueprintPure, Category = "Glaze Lab")
    static FGlazeMatchResult EvaluateAgainstTarget(const FGlazeFiringResult& Result, const FGlazeTargetProfile& Target);

    UFUNCTION(BlueprintCallable, Category = "Glaze Lab")
    static void ApplyFiringResultToMaterial(UMaterialInstanceDynamic* MaterialInstance, const FGlazeFiringResult& Result, const FGlazeMaterialParameterNames& ParameterNames);
};

