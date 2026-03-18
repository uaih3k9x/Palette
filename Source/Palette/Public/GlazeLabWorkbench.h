#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"

#include "GlazeLabTypes.h"
#include "GlazeLabWorkbench.generated.h"

class UMaterialInstanceDynamic;
class USceneComponent;
class UStaticMeshComponent;

UCLASS(Blueprintable)
class PALETTE_API AGlazeLabWorkbench : public AActor
{
    GENERATED_BODY()

public:
    AGlazeLabWorkbench();

    virtual void OnConstruction(const FTransform& Transform) override;
    virtual void BeginPlay() override;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Workbench")
    TObjectPtr<USceneComponent> SceneRoot;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Workbench")
    TObjectPtr<UStaticMeshComponent> PotteryMesh;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Recipe")
    TArray<FGlazeMineralStack> CurrentRecipe;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Kiln")
    FGlazeKilnSettings KilnSettings;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Preview")
    FGlazeMaterialParameterNames MaterialParameterNames;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Preview", meta = (ClampMin = "0"))
    int32 MaterialSlot = 0;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Preview")
    bool bPreviewInEditor = true;

    UPROPERTY(BlueprintReadOnly, Category = "Preview")
    FGlazeFiringResult PreviewResult;

    UFUNCTION(BlueprintCallable, CallInEditor, Category = "Glaze Lab")
    void ResetToStarterRecipe();

    UFUNCTION(BlueprintCallable, CallInEditor, Category = "Glaze Lab")
    void RebuildPreview();

    UFUNCTION(BlueprintCallable, Category = "Glaze Lab")
    FGlazeFiringResult FireCurrentRecipe();

protected:
    UPROPERTY(Transient)
    TObjectPtr<UMaterialInstanceDynamic> PreviewMaterial;

private:
    UMaterialInstanceDynamic* EnsurePreviewMaterial();
};
