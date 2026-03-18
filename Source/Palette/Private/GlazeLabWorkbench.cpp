#include "GlazeLabWorkbench.h"

#include "Components/SceneComponent.h"
#include "Components/StaticMeshComponent.h"
#include "GlazeLabBPLibrary.h"
#include "Materials/MaterialInstanceDynamic.h"

AGlazeLabWorkbench::AGlazeLabWorkbench()
{
    PrimaryActorTick.bCanEverTick = false;

    SceneRoot = CreateDefaultSubobject<USceneComponent>(TEXT("SceneRoot"));
    SetRootComponent(SceneRoot);

    PotteryMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("PotteryMesh"));
    PotteryMesh->SetupAttachment(SceneRoot);
    PotteryMesh->SetCollisionEnabled(ECollisionEnabled::NoCollision);

    CurrentRecipe = UGlazeLabBPLibrary::MakeStarterRecipe();
    KilnSettings = UGlazeLabBPLibrary::MakeStarterKilnSettings();
}

void AGlazeLabWorkbench::OnConstruction(const FTransform& Transform)
{
    Super::OnConstruction(Transform);

    if (bPreviewInEditor)
    {
        RebuildPreview();
    }
}

void AGlazeLabWorkbench::BeginPlay()
{
    Super::BeginPlay();
    RebuildPreview();
}

void AGlazeLabWorkbench::ResetToStarterRecipe()
{
    CurrentRecipe = UGlazeLabBPLibrary::MakeStarterRecipe();
    KilnSettings = UGlazeLabBPLibrary::MakeStarterKilnSettings();
    RebuildPreview();
}

void AGlazeLabWorkbench::RebuildPreview()
{
    PreviewResult = UGlazeLabBPLibrary::SimulateFiring(CurrentRecipe, KilnSettings);

    if (UMaterialInstanceDynamic* Material = EnsurePreviewMaterial())
    {
        UGlazeLabBPLibrary::ApplyFiringResultToMaterial(Material, PreviewResult, MaterialParameterNames);
    }
}

FGlazeFiringResult AGlazeLabWorkbench::FireCurrentRecipe()
{
    RebuildPreview();
    return PreviewResult;
}

UMaterialInstanceDynamic* AGlazeLabWorkbench::EnsurePreviewMaterial()
{
    if (!PotteryMesh)
    {
        return nullptr;
    }

    if (!PreviewMaterial || PotteryMesh->GetMaterial(MaterialSlot) != PreviewMaterial)
    {
        PreviewMaterial = PotteryMesh->CreateDynamicMaterialInstance(MaterialSlot);
    }

    return PreviewMaterial;
}
