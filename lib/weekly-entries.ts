import { PrismaClient, WeeklyCheckIn } from "@prisma/client";
import {
  formatDbRowToWeeklyEntry,
  formatWeeklyEntryToDbPayload,
} from "@/lib/transformers";
import type { WeeklyEntry, WeeklyEntryFormData, WeeklyEntryDbRow } from "@/types";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // In development, reuse the connection to avoid exhausting the pool
  const globalForPrisma = global as unknown as { prisma: PrismaClient };
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  prisma = globalForPrisma.prisma;
}

// Helper function to convert Prisma row to WeeklyEntryDbRow
function convertPrismaRowToDbRow(row: WeeklyCheckIn): WeeklyEntryDbRow {
  const dbRow: any = {
    id: row.id,
    weekOf: row.weekDate.toISOString().split('T')[0],
    innerWolvesFocus: row.innerWolvesFocus || "",
    innerWolvesKeyActions: row.innerWolvesKeyActions || "",
    innerWolvesProgressScore: row.innerWolvesProgressScore || 0,
    innerWolvesNotes: row.innerWolvesNotes || "",
    sapphireDragonWritingSessions: row.sapphireDragonWritingSessions || 0,
    sapphireDragonCurrentChapter: row.sapphireDragonCurrentChapter || "",
    sapphireDragonChaptersDrafted: row.sapphireDragonChaptersDrafted || 0,
    sapphireDragonChaptersRevised: row.sapphireDragonChaptersRevised || 0,
    sapphireDragonShowedUp: row.sapphireDragonShowedUpStatus || "",
    sapphireDragonNotes: row.sapphireDragonNotes || "",
    physicalVitalityTrainingSessions: row.physicalVitalityTrainingSessions || 0,
    physicalVitalityNutritionAnchorDays: row.physicalVitalityNutritionAnchorDays || 0,
    physicalVitalityAvgEnergy: row.physicalVitalityAverageEnergy || 0,
    physicalVitalityWeight: row.physicalVitalityWeight || undefined,
    physicalVitalityNotes: row.physicalVitalityNotes || "",
    reflectionInnerWolves: row.reflectionInnerWolves || "",
    reflectionSapphireDragon: row.reflectionManuscript || "",
    reflectionPhysicalVitality: row.reflectionBodyFeel || "",
    reflectionAdjustment: row.reflectionNextWeekAdjustment || "",
  };
  return dbRow as WeeklyEntryDbRow;
}

export async function listWeeklyEntries(): Promise<WeeklyEntry[]> {
  try {
    const entries = await prisma.weeklyCheckIn.findMany({
      orderBy: { weekDate: "desc" },
    });
    return entries.map((row) => formatDbRowToWeeklyEntry(convertPrismaRowToDbRow(row)));
  } catch (error) {
    console.error("Error listing weekly entries:", error);
    throw error;
  }
}

export async function getWeeklyEntryByWeek(
  weekOf: string
): Promise<WeeklyEntry | null> {
  try {
    const weekDate = new Date(`${weekOf}T00:00:00Z`);
    const entry = await prisma.weeklyCheckIn.findUnique({
      where: { weekDate },
    });
    
    if (!entry) return null;
    return formatDbRowToWeeklyEntry(convertPrismaRowToDbRow(entry));
  } catch (error) {
    console.error("Error fetching weekly entry:", error);
    throw error;
  }
}

export async function createWeeklyEntry(
  data: WeeklyEntryFormData
): Promise<WeeklyEntry> {
  try {
    const weekDate = new Date(`${data.weekOf}T00:00:00Z`);
    const payload = formatWeeklyEntryToDbPayload(data);

    const created = await prisma.weeklyCheckIn.create({
      data: {
        weekDate,
        weekOf: data.weekOf,
        innerWolvesFocus: payload.innerWolvesFocus || "",
        innerWolvesKeyActions: payload.innerWolvesKeyActions || "",
        innerWolvesProgressScore: payload.innerWolvesProgressScore || 0,
        innerWolvesNotes: payload.innerWolvesNotes || "",
        sapphireDragonWritingSessions: payload.sapphireDragonWritingSessions || 0,
        sapphireDragonCurrentChapter: payload.sapphireDragonCurrentChapter || "",
        sapphireDragonChaptersDrafted: payload.sapphireDragonChaptersDrafted || 0,
        sapphireDragonChaptersRevised: payload.sapphireDragonChaptersRevised || 0,
        sapphireDragonShowedUpStatus: String(payload.sapphireDragonShowedUp || ""),
        sapphireDragonNotes: payload.sapphireDragonNotes || "",
        physicalVitalityTrainingSessions: payload.physicalVitalityTrainingSessions || 0,
        physicalVitalityNutritionAnchorDays: payload.physicalVitalityNutritionAnchorDays || 0,
        physicalVitalityAverageEnergy: payload.physicalVitalityAvgEnergy || 0,
        physicalVitalityWeight: payload.physicalVitalityWeight ? String(payload.physicalVitalityWeight) : null,
        physicalVitalityNotes: payload.physicalVitalityNotes || "",
        reflectionInnerWolves: payload.reflectionInnerWolves || "",
        reflectionManuscript: payload.reflectionSapphireDragon || "",
        reflectionBodyFeel: payload.reflectionPhysicalVitality || "",
        reflectionNextWeekAdjustment: payload.reflectionAdjustment || "",
      },
    });

    return formatDbRowToWeeklyEntry(convertPrismaRowToDbRow(created));
  } catch (error) {
    console.error("Error creating weekly entry:", error);
    throw error;
  }
}

export async function updateWeeklyEntry(
  weekOf: string,
  data: WeeklyEntryFormData
): Promise<WeeklyEntry> {
  try {
    const weekDate = new Date(`${weekOf}T00:00:00Z`);
    const payload = formatWeeklyEntryToDbPayload(data);

    const updated = await prisma.weeklyCheckIn.update({
      where: { weekDate },
      data: {
        innerWolvesFocus: payload.innerWolvesFocus || "",
        innerWolvesKeyActions: payload.innerWolvesKeyActions || "",
        innerWolvesProgressScore: payload.innerWolvesProgressScore || 0,
        innerWolvesNotes: payload.innerWolvesNotes || "",
        sapphireDragonWritingSessions: payload.sapphireDragonWritingSessions || 0,
        sapphireDragonCurrentChapter: payload.sapphireDragonCurrentChapter || "",
        sapphireDragonChaptersDrafted: payload.sapphireDragonChaptersDrafted || 0,
        sapphireDragonChaptersRevised: payload.sapphireDragonChaptersRevised || 0,
        sapphireDragonShowedUpStatus: String(payload.sapphireDragonShowedUp || ""),
        sapphireDragonNotes: payload.sapphireDragonNotes || "",
        physicalVitalityTrainingSessions: payload.physicalVitalityTrainingSessions || 0,
        physicalVitalityNutritionAnchorDays: payload.physicalVitalityNutritionAnchorDays || 0,
        physicalVitalityAverageEnergy: payload.physicalVitalityAvgEnergy || 0,
        physicalVitalityWeight: payload.physicalVitalityWeight ? String(payload.physicalVitalityWeight) : null,
        physicalVitalityNotes: payload.physicalVitalityNotes || "",
        reflectionInnerWolves: payload.reflectionInnerWolves || "",
        reflectionManuscript: payload.reflectionSapphireDragon || "",
        reflectionBodyFeel: payload.reflectionPhysicalVitality || "",
        reflectionNextWeekAdjustment: payload.reflectionAdjustment || "",
      },
    });

    return formatDbRowToWeeklyEntry(convertPrismaRowToDbRow(updated));
  } catch (error) {
    console.error("Error updating weekly entry:", error);
    throw error;
  }
}

export async function upsertWeeklyEntry(
  data: WeeklyEntryFormData
): Promise<WeeklyEntry> {
  try {
    const weekDate = new Date(`${data.weekOf}T00:00:00Z`);
    const payload = formatWeeklyEntryToDbPayload(data);

    const upserted = await prisma.weeklyCheckIn.upsert({
      where: { weekDate },
      create: {
        weekDate,
        weekOf: data.weekOf,
        innerWolvesFocus: payload.innerWolvesFocus || "",
        innerWolvesKeyActions: payload.innerWolvesKeyActions || "",
        innerWolvesProgressScore: payload.innerWolvesProgressScore || 0,
        innerWolvesNotes: payload.innerWolvesNotes || "",
        sapphireDragonWritingSessions: payload.sapphireDragonWritingSessions || 0,
        sapphireDragonCurrentChapter: payload.sapphireDragonCurrentChapter || "",
        sapphireDragonChaptersDrafted: payload.sapphireDragonChaptersDrafted || 0,
        sapphireDragonChaptersRevised: payload.sapphireDragonChaptersRevised || 0,
        sapphireDragonShowedUpStatus: String(payload.sapphireDragonShowedUp || ""),
        sapphireDragonNotes: payload.sapphireDragonNotes || "",
        physicalVitalityTrainingSessions: payload.physicalVitalityTrainingSessions || 0,
        physicalVitalityNutritionAnchorDays: payload.physicalVitalityNutritionAnchorDays || 0,
        physicalVitalityAverageEnergy: payload.physicalVitalityAvgEnergy || 0,
        physicalVitalityWeight: payload.physicalVitalityWeight ? String(payload.physicalVitalityWeight) : null,
        physicalVitalityNotes: payload.physicalVitalityNotes || "",
        reflectionInnerWolves: payload.reflectionInnerWolves || "",
        reflectionManuscript: payload.reflectionSapphireDragon || "",
        reflectionBodyFeel: payload.reflectionPhysicalVitality || "",
        reflectionNextWeekAdjustment: payload.reflectionAdjustment || "",
      },
      update: {
        innerWolvesFocus: payload.innerWolvesFocus || "",
        innerWolvesKeyActions: payload.innerWolvesKeyActions || "",
        innerWolvesProgressScore: payload.innerWolvesProgressScore || 0,
        innerWolvesNotes: payload.innerWolvesNotes || "",
        sapphireDragonWritingSessions: payload.sapphireDragonWritingSessions || 0,
        sapphireDragonCurrentChapter: payload.sapphireDragonCurrentChapter || "",
        sapphireDragonChaptersDrafted: payload.sapphireDragonChaptersDrafted || 0,
        sapphireDragonChaptersRevised: payload.sapphireDragonChaptersRevised || 0,
        sapphireDragonShowedUpStatus: String(payload.sapphireDragonShowedUp || ""),
        sapphireDragonNotes: payload.sapphireDragonNotes || "",
        physicalVitalityTrainingSessions: payload.physicalVitalityTrainingSessions || 0,
        physicalVitalityNutritionAnchorDays: payload.physicalVitalityNutritionAnchorDays || 0,
        physicalVitalityAverageEnergy: payload.physicalVitalityAvgEnergy || 0,
        physicalVitalityWeight: payload.physicalVitalityWeight ? String(payload.physicalVitalityWeight) : null,
        physicalVitalityNotes: payload.physicalVitalityNotes || "",
        reflectionInnerWolves: payload.reflectionInnerWolves || "",
        reflectionManuscript: payload.reflectionSapphireDragon || "",
        reflectionBodyFeel: payload.reflectionPhysicalVitality || "",
        reflectionNextWeekAdjustment: payload.reflectionAdjustment || "",
      },
    });

    return formatDbRowToWeeklyEntry(convertPrismaRowToDbRow(upserted));
  } catch (error) {
    console.error("Error upserting weekly entry:", error);
    throw error;
  }
}

export async function getWeeklyEntriesForAnalytics(): Promise<WeeklyEntry[]> {
  try {
    const entries = await prisma.weeklyCheckIn.findMany({
      orderBy: { weekDate: "asc" },
    });
    return entries.map((row) => formatDbRowToWeeklyEntry(convertPrismaRowToDbRow(row)));
  } catch (error) {
    console.error("Error fetching analytics entries:", error);
    throw error;
  }
}

// ===== Wrapper functions for backwards compatibility =====

export async function fetchWeeklyEntries(): Promise<{ data: WeeklyEntry[] } & { error?: string }> {
  try {
    const entries = await listWeeklyEntries();
    return { data: entries };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error fetching entries";
    return { data: [], error: errorMessage };
  }
}

export async function fetchWeeklyEntryByWeek(weekOf: string): Promise<{ data: WeeklyEntry | null } & { error?: string }> {
  try {
    const entry = await getWeeklyEntryByWeek(weekOf);
    return { data: entry };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error fetching entry";
    return { data: null, error: errorMessage };
  }
}

export async function fetchAnalyticsEntries(): Promise<{ data: WeeklyEntry[] } & { error?: string }> {
  try {
    const entries = await getWeeklyEntriesForAnalytics();
    return { data: entries };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error fetching analytics";
    return { data: [], error: errorMessage };
  }
}

export async function saveWeeklyEntry(data: WeeklyEntryFormData): Promise<{ data: WeeklyEntry | null } & { error?: string }> {
  try {
    const entry = await upsertWeeklyEntry(data);
    return { data: entry };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error saving entry";
    return { data: null, error: errorMessage };
  }
}

// @ts-ignore - Page handles promise correctly at runtime
export async function getConfigStatus() {
  try {
    const count = await prisma.weeklyCheckIn.count();
    return { configured: count > 0 };
  } catch (error) {
    console.error("Error checking config status:", error);
    return { configured: false };
  }
}