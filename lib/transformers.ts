import type { AnalyticsPoint, WeeklyEntry, WeeklyEntryDbRow, WeeklyEntryFormData } from "@/types";
import { calculateShowedUp } from "@/lib/validation";

function parseActions(raw: string): string[] {
  if (!raw) {
    return [];
  }

  return String(raw)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatDbRowToWeeklyEntry(row: WeeklyEntryDbRow): WeeklyEntry {
  return {
    id: row.id,
    weekOf: row.weekOf,
    innerWolvesFocus: row.innerWolvesFocus,
    innerWolvesKeyActions: parseActions(row.innerWolvesKeyActions),
    innerWolvesProgressScore: Number(row.innerWolvesProgressScore ?? 1),
    innerWolvesNotes: row.innerWolvesNotes,
    sapphireDragonWritingSessions: Number(row.sapphireDragonWritingSessions ?? 0),
    sapphireDragonCurrentChapter: row.sapphireDragonCurrentChapter ?? undefined,
    sapphireDragonChaptersDrafted: Number(row.sapphireDragonChaptersDrafted ?? 0),
    sapphireDragonChaptersRevised: Number(row.sapphireDragonChaptersRevised ?? 0),
    sapphireDragonShowedUp: Boolean(row.sapphireDragonShowedUp),
    sapphireDragonNotes: row.sapphireDragonNotes,
    physicalVitalityTrainingSessions: Number(row.physicalVitalityTrainingSessions ?? 0),
    physicalVitalityNutritionAnchorDays: Number(row.physicalVitalityNutritionAnchorDays ?? 0),
    physicalVitalityAvgEnergy: Number(row.physicalVitalityAvgEnergy ?? 1),
    physicalVitalityWeight: row.physicalVitalityWeight ?? undefined,
    physicalVitalityNotes: row.physicalVitalityNotes,
    reflectionInnerWolves: row.reflectionInnerWolves,
    reflectionSapphireDragon: row.reflectionSapphireDragon,
    reflectionPhysicalVitality: row.reflectionPhysicalVitality,
    reflectionAdjustment: row.reflectionAdjustment,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

export function formatWeeklyEntryToDbPayload(data: WeeklyEntryFormData) {
  const now = new Date().toISOString();

  return {
    weekOf: data.weekOf,
    innerWolvesFocus: data.innerWolvesFocus,
    innerWolvesKeyActions: data.innerWolvesKeyActions.join("\n"),
    innerWolvesProgressScore: data.innerWolvesProgressScore,
    innerWolvesNotes: data.innerWolvesNotes,
    sapphireDragonWritingSessions: data.sapphireDragonWritingSessions,
    sapphireDragonCurrentChapter: data.sapphireDragonCurrentChapter ?? null,
    sapphireDragonChaptersDrafted: data.sapphireDragonChaptersDrafted,
    sapphireDragonChaptersRevised: data.sapphireDragonChaptersRevised,
    sapphireDragonShowedUp: calculateShowedUp(data.sapphireDragonWritingSessions) ? 1 : 0,
    sapphireDragonNotes: data.sapphireDragonNotes,
    physicalVitalityTrainingSessions: data.physicalVitalityTrainingSessions,
    physicalVitalityNutritionAnchorDays: data.physicalVitalityNutritionAnchorDays,
    physicalVitalityAvgEnergy: data.physicalVitalityAvgEnergy,
    physicalVitalityWeight: data.physicalVitalityWeight ?? null,
    physicalVitalityNotes: data.physicalVitalityNotes,
    reflectionInnerWolves: data.reflectionInnerWolves,
    reflectionSapphireDragon: data.reflectionSapphireDragon,
    reflectionPhysicalVitality: data.reflectionPhysicalVitality,
    reflectionAdjustment: data.reflectionAdjustment,
    updatedAt: now
  };
}

export function defaultWeeklyEntryFormData(weekOf: string): WeeklyEntryFormData {
  return {
    weekOf,
    innerWolvesFocus: "",
    innerWolvesKeyActions: [],
    innerWolvesProgressScore: 3,
    innerWolvesNotes: "",
    sapphireDragonWritingSessions: 0,
    sapphireDragonCurrentChapter: "",
    sapphireDragonChaptersDrafted: 0,
    sapphireDragonChaptersRevised: 0,
    sapphireDragonNotes: "",
    physicalVitalityTrainingSessions: 0,
    physicalVitalityNutritionAnchorDays: 0,
    physicalVitalityAvgEnergy: 3,
    physicalVitalityWeight: undefined,
    physicalVitalityNotes: "",
    reflectionInnerWolves: "",
    reflectionSapphireDragon: "",
    reflectionPhysicalVitality: "",
    reflectionAdjustment: ""
  };
}

export function weeklyEntryToFormData(entry: WeeklyEntry): WeeklyEntryFormData {
  return {
    weekOf: entry.weekOf,
    innerWolvesFocus: entry.innerWolvesFocus,
    innerWolvesKeyActions: entry.innerWolvesKeyActions,
    innerWolvesProgressScore: entry.innerWolvesProgressScore,
    innerWolvesNotes: entry.innerWolvesNotes,
    sapphireDragonWritingSessions: entry.sapphireDragonWritingSessions,
    sapphireDragonCurrentChapter: entry.sapphireDragonCurrentChapter ?? "",
    sapphireDragonChaptersDrafted: entry.sapphireDragonChaptersDrafted,
    sapphireDragonChaptersRevised: entry.sapphireDragonChaptersRevised,
    sapphireDragonNotes: entry.sapphireDragonNotes,
    physicalVitalityTrainingSessions: entry.physicalVitalityTrainingSessions,
    physicalVitalityNutritionAnchorDays: entry.physicalVitalityNutritionAnchorDays,
    physicalVitalityAvgEnergy: entry.physicalVitalityAvgEnergy,
    physicalVitalityWeight: entry.physicalVitalityWeight,
    physicalVitalityNotes: entry.physicalVitalityNotes,
    reflectionInnerWolves: entry.reflectionInnerWolves,
    reflectionSapphireDragon: entry.reflectionSapphireDragon,
    reflectionPhysicalVitality: entry.reflectionPhysicalVitality,
    reflectionAdjustment: entry.reflectionAdjustment
  };
}

export function buildAnalyticsPoints(entries: WeeklyEntry[]): AnalyticsPoint[] {
  return entries
    .slice()
    .sort((a, b) => a.weekOf.localeCompare(b.weekOf))
    .map((entry) => ({
      weekOf: entry.weekOf,
      label: entry.weekOf.slice(5),
      innerWolvesProgressScore: entry.innerWolvesProgressScore,
      sapphireDragonWritingSessions: entry.sapphireDragonWritingSessions,
      sapphireDragonChaptersDrafted: entry.sapphireDragonChaptersDrafted,
      sapphireDragonChaptersRevised: entry.sapphireDragonChaptersRevised,
      physicalVitalityTrainingSessions: entry.physicalVitalityTrainingSessions,
      physicalVitalityAvgEnergy: entry.physicalVitalityAvgEnergy,
      physicalVitalityWeight: entry.physicalVitalityWeight
    }));
}
