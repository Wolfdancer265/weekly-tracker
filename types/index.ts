export interface WeeklyEntry {
  id?: number;
  weekOf: string;
  innerWolvesFocus: string;
  innerWolvesKeyActions: string[];
  innerWolvesProgressScore: number;
  innerWolvesNotes: string;
  sapphireDragonWritingSessions: number;
  sapphireDragonCurrentChapter?: string;
  sapphireDragonChaptersDrafted: number;
  sapphireDragonChaptersRevised: number;
  sapphireDragonShowedUp: boolean;
  sapphireDragonNotes: string;
  physicalVitalityTrainingSessions: number;
  physicalVitalityNutritionAnchorDays: number;
  physicalVitalityAvgEnergy: number;
  physicalVitalityWeight?: number;
  physicalVitalityNotes: string;
  reflectionInnerWolves: string;
  reflectionSapphireDragon: string;
  reflectionPhysicalVitality: string;
  reflectionAdjustment: string;
  createdAt?: string;
  updatedAt?: string;
}

export type WeeklyEntryFormData = Omit<
  WeeklyEntry,
  "id" | "createdAt" | "updatedAt" | "sapphireDragonShowedUp"
>;

export interface WeeklyEntryDbRow {
  id: number;
  weekOf: string;
  innerWolvesFocus: string;
  innerWolvesKeyActions: string;
  innerWolvesProgressScore: number;
  innerWolvesNotes: string;
  sapphireDragonWritingSessions: number;
  sapphireDragonCurrentChapter: string | null;
  sapphireDragonChaptersDrafted: number;
  sapphireDragonChaptersRevised: number;
  sapphireDragonShowedUp: number;
  sapphireDragonNotes: string;
  physicalVitalityTrainingSessions: number;
  physicalVitalityNutritionAnchorDays: number;
  physicalVitalityAvgEnergy: number;
  physicalVitalityWeight: number | null;
  physicalVitalityNotes: string;
  reflectionInnerWolves: string;
  reflectionSapphireDragon: string;
  reflectionPhysicalVitality: string;
  reflectionAdjustment: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsPoint {
  weekOf: string;
  label: string;
  innerWolvesProgressScore: number;
  sapphireDragonWritingSessions: number;
  sapphireDragonChaptersDrafted: number;
  sapphireDragonChaptersRevised: number;
  physicalVitalityTrainingSessions: number;
  physicalVitalityAvgEnergy: number;
  physicalVitalityWeight?: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof WeeklyEntryFormData, string>>;
}
