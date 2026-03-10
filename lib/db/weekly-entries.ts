import { PrismaClient } from "@prisma/client";
import {
  formatDbRowToWeeklyEntry,
  formatWeeklyEntryToDbPayload,
} from "@/lib/transformers";
import type { WeeklyEntry, WeeklyEntryFormData } from "@/types";

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

export async function listWeeklyEntries(): Promise<WeeklyEntry[]> {
  try {
    const entries = await prisma.weeklyCheckIn.findMany({
      orderBy: { weekDate: "desc" },
    });
    return entries.map((row: any) => {
      const dbRow = {
        ...row,
        weekOf: row.weekDate.toISOString().split('T')[0], // Convert DateTime to YYYY-MM-DD
      };
      return formatDbRowToWeeklyEntry(dbRow);
    });
  } catch (error) {
    console.error("Error listing weekly entries:", error);
    throw error;
  }
}

export async function getWeeklyEntryByWeek(
  weekOf: string
): Promise<WeeklyEntry | null> {
  try {
    // Convert weekOf (YYYY-MM-DD) to the start of that day
    const weekDate = new Date(`${weekOf}T00:00:00Z`);
    
    const entry = await prisma.weeklyCheckIn.findUnique({
      where: { weekDate },
    });
    
    if (!entry) return null;
    
    const dbRow = {
      ...entry,
      weekOf: entry.weekDate.toISOString().split('T')[0],
    };
    return formatDbRowToWeeklyEntry(dbRow);
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
        innerWolvesFocus: payload.innerWolvesFocus,
        innerWolvesKeyActions: payload.innerWolvesKeyActions,
        innerWolvesProgressScore: payload.innerWolvesProgressScore,
        innerWolvesNotes: payload.innerWolvesNotes,
        sapphireDragonWritingSessions: payload.sapphireDragonWritingSessions,
        sapphireDragonCurrentChapter: payload.sapphireDragonCurrentChapter,
        sapphireDragonChaptersDrafted: payload.sapphireDragonChaptersDrafted,
        sapphireDragonChaptersRevised: payload.sapphireDragonChaptersRevised,
        sapphireDragonShowedUp: payload.sapphireDragonShowedUp,
        sapphireDragonNotes: payload.sapphireDragonNotes,
        physicalVitalityTrainingSessions: payload.physicalVitalityTrainingSessions,
        physicalVitalityNutritionAnchorDays: payload.physicalVitalityNutritionAnchorDays,
        physicalVitalityAvgEnergy: payload.physicalVitalityAvgEnergy,
        physicalVitalityWeight: payload.physicalVitalityWeight,
        physicalVitalityNotes: payload.physicalVitalityNotes,
        reflectionInnerWolves: payload.reflectionInnerWolves,
        reflectionSapphireDragon: payload.reflectionSapphireDragon,
        reflectionPhysicalVitality: payload.reflectionPhysicalVitality,
        reflectionAdjustment: payload.reflectionAdjustment,
      },
    });

    const dbRow = {
      ...created,
      weekOf: created.weekDate.toISOString().split('T')[0],
    };
    return formatDbRowToWeeklyEntry(dbRow);
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
        innerWolvesFocus: payload.innerWolvesFocus,
        innerWolvesKeyActions: payload.innerWolvesKeyActions,
        innerWolvesProgressScore: payload.innerWolvesProgressScore,
        innerWolvesNotes: payload.innerWolvesNotes,
        sapphireDragonWritingSessions: payload.sapphireDragonWritingSessions,
        sapphireDragonCurrentChapter: payload.sapphireDragonCurrentChapter,
        sapphireDragonChaptersDrafted: payload.sapphireDragonChaptersDrafted,
        sapphireDragonChaptersRevised: payload.sapphireDragonChaptersRevised,
        sapphireDragonShowedUp: payload.sapphireDragonShowedUp,
        sapphireDragonNotes: payload.sapphireDragonNotes,
        physicalVitalityTrainingSessions: payload.physicalVitalityTrainingSessions,
        physicalVitalityNutritionAnchorDays: payload.physicalVitalityNutritionAnchorDays,
        physicalVitalityAvgEnergy: payload.physicalVitalityAvgEnergy,
        physicalVitalityWeight: payload.physicalVitalityWeight,
        physicalVitalityNotes: payload.physicalVitalityNotes,
        reflectionInnerWolves: payload.reflectionInnerWolves,
        reflectionSapphireDragon: payload.reflectionSapphireDragon,
        reflectionPhysicalVitality: payload.reflectionPhysicalVitality,
        reflectionAdjustment: payload.reflectionAdjustment,
      },
    });

    const dbRow = {
      ...updated,
      weekOf: updated.weekDate.toISOString().split('T')[0],
    };
    return formatDbRowToWeeklyEntry(dbRow);
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
        innerWolvesFocus: payload.innerWolvesFocus,
        innerWolvesKeyActions: payload.innerWolvesKeyActions,
        innerWolvesProgressScore: payload.innerWolvesProgressScore,
        innerWolvesNotes: payload.innerWolvesNotes,
        sapphireDragonWritingSessions: payload.sapphireDragonWritingSessions,
        sapphireDragonCurrentChapter: payload.sapphireDragonCurrentChapter,
        sapphireDragonChaptersDrafted: payload.sapphireDragonChaptersDrafted,
        sapphireDragonChaptersRevised: payload.sapphireDragonChaptersRevised,
        sapphireDragonShowedUp: payload.sapphireDragonShowedUp,
        sapphireDragonNotes: payload.sapphireDragonNotes,
        physicalVitalityTrainingSessions: payload.physicalVitalityTrainingSessions,
        physicalVitalityNutritionAnchorDays: payload.physicalVitalityNutritionAnchorDays,
        physicalVitalityAvgEnergy: payload.physicalVitalityAvgEnergy,
        physicalVitalityWeight: payload.physicalVitalityWeight,
        physicalVitalityNotes: payload.physicalVitalityNotes,
        reflectionInnerWolves: payload.reflectionInnerWolves,
        reflectionSapphireDragon: payload.reflectionSapphireDragon,
        reflectionPhysicalVitality: payload.reflectionPhysicalVitality,
        reflectionAdjustment: payload.reflectionAdjustment,
      },
      update: {
        innerWolvesFocus: payload.innerWolvesFocus,
        innerWolvesKeyActions: payload.innerWolvesKeyActions,
        innerWolvesProgressScore: payload.innerWolvesProgressScore,
        innerWolvesNotes: payload.innerWolvesNotes,
        sapphireDragonWritingSessions: payload.sapphireDragonWritingSessions,
        sapphireDragonCurrentChapter: payload.sapphireDragonCurrentChapter,
        sapphireDragonChaptersDrafted: payload.sapphireDragonChaptersDrafted,
        sapphireDragonChaptersRevised: payload.sapphireDragonChaptersRevised,
        sapphireDragonShowedUp: payload.sapphireDragonShowedUp,
        sapphireDragonNotes: payload.sapphireDragonNotes,
        physicalVitalityTrainingSessions: payload.physicalVitalityTrainingSessions,
        physicalVitalityNutritionAnchorDays: payload.physicalVitalityNutritionAnchorDays,
        physicalVitalityAvgEnergy: payload.physicalVitalityAvgEnergy,
        physicalVitalityWeight: payload.physicalVitalityWeight,
        physicalVitalityNotes: payload.physicalVitalityNotes,
        reflectionInnerWolves: payload.reflectionInnerWolves,
        reflectionSapphireDragon: payload.reflectionSapphireDragon,
        reflectionPhysicalVitality: payload.reflectionPhysicalVitality,
        reflectionAdjustment: payload.reflectionAdjustment,
      },
    });

    const dbRow = {
      ...upserted,
      weekOf: upserted.weekDate.toISOString().split('T')[0],
    };
    return formatDbRowToWeeklyEntry(dbRow);
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
    return entries.map((row: any) => {
      const dbRow = {
        ...row,
        weekOf: row.weekDate.toISOString().split('T')[0],
      };
      return formatDbRowToWeeklyEntry(dbRow);
    });
  } catch (error) {
    console.error("Error fetching analytics entries:", error);
    throw error;
  }
}