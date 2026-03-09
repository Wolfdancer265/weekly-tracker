import type { ValidationResult, WeeklyEntryFormData } from "@/types";
import { normalizeWeekOfDate } from "@/lib/date-helpers";

function toSafeInteger(value: unknown, fallback = 0): number {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue) || !Number.isFinite(numberValue)) {
    return fallback;
  }

  return Math.max(0, Math.round(numberValue));
}

export function calculateShowedUp(writingSessions: number): boolean {
  return writingSessions >= 3;
}

export function normalizeFormData(input: Partial<WeeklyEntryFormData>): WeeklyEntryFormData {
  return {
    weekOf: normalizeWeekOfDate(String(input.weekOf ?? "")),
    innerWolvesFocus: String(input.innerWolvesFocus ?? "").trim(),
    innerWolvesKeyActions: Array.isArray(input.innerWolvesKeyActions)
      ? input.innerWolvesKeyActions.filter(Boolean).map((item) => item.trim())
      : String(input.innerWolvesKeyActions ?? "")
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
    innerWolvesProgressScore: toSafeInteger(input.innerWolvesProgressScore, 1),
    innerWolvesNotes: String(input.innerWolvesNotes ?? "").trim(),
    sapphireDragonWritingSessions: toSafeInteger(input.sapphireDragonWritingSessions),
    sapphireDragonCurrentChapter: String(input.sapphireDragonCurrentChapter ?? "").trim() || undefined,
    sapphireDragonChaptersDrafted: toSafeInteger(input.sapphireDragonChaptersDrafted),
    sapphireDragonChaptersRevised: toSafeInteger(input.sapphireDragonChaptersRevised),
    sapphireDragonNotes: String(input.sapphireDragonNotes ?? "").trim(),
    physicalVitalityTrainingSessions: toSafeInteger(input.physicalVitalityTrainingSessions),
    physicalVitalityNutritionAnchorDays: toSafeInteger(input.physicalVitalityNutritionAnchorDays),
    physicalVitalityAvgEnergy: toSafeInteger(input.physicalVitalityAvgEnergy, 1),
    physicalVitalityWeight:
      input.physicalVitalityWeight === undefined || input.physicalVitalityWeight === null
        ? undefined
        : Number(input.physicalVitalityWeight),
    physicalVitalityNotes: String(input.physicalVitalityNotes ?? "").trim(),
    reflectionInnerWolves: String(input.reflectionInnerWolves ?? "").trim(),
    reflectionSapphireDragon: String(input.reflectionSapphireDragon ?? "").trim(),
    reflectionPhysicalVitality: String(input.reflectionPhysicalVitality ?? "").trim(),
    reflectionAdjustment: String(input.reflectionAdjustment ?? "").trim()
  };
}

export function validateWeeklyEntryFormData(data: WeeklyEntryFormData): ValidationResult {
  const errors: ValidationResult["errors"] = {};

  if (!data.weekOf) {
    errors.weekOf = "Week date is required.";
  }

  if (!data.innerWolvesFocus) {
    errors.innerWolvesFocus = "Please capture this week's focus.";
  }

  if (data.innerWolvesProgressScore < 1 || data.innerWolvesProgressScore > 5) {
    errors.innerWolvesProgressScore = "Progress score must be between 1 and 5.";
  }

  if (data.physicalVitalityAvgEnergy < 1 || data.physicalVitalityAvgEnergy > 5) {
    errors.physicalVitalityAvgEnergy = "Average energy must be between 1 and 5.";
  }

  if (
    data.physicalVitalityWeight !== undefined &&
    (Number.isNaN(data.physicalVitalityWeight) || data.physicalVitalityWeight <= 0)
  ) {
    errors.physicalVitalityWeight = "Weight must be a positive number.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
