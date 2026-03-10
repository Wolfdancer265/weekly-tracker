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
    return entries.map((row: any) => formatDbRowToWeeklyEntry(row));
  } catch (error) {
    console.error("Error listing weekly entries:", error);
    throw error;
  }
}

export async function getWeeklyEntryByWeek(
  weekOf: string
): Promise<WeeklyEntry | null> {
  try {
    const weekDate = new Date(weekOf);
    const entry = await prisma.weeklyCheckIn.findUnique({
      where: { weekDate },
    });
    return entry ? formatDbRowToWeeklyEntry(entry) : null;
  } catch (error) {
    console.error("Error fetching weekly entry:", error);
    throw error;
  }
}

export async function createWeeklyEntry(
  data: WeeklyEntryFormData
): Promise<WeeklyEntry> {
  try {
    const weekDate = new Date(data.weekOf);
    const payload = formatWeeklyEntryToDbPayload(data);

    const created = await prisma.weeklyCheckIn.create({
      data: {
        weekDate,
        ...payload,
      },
    });

    return formatDbRowToWeeklyEntry(created);
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
    const weekDate = new Date(weekOf);
    const payload = formatWeeklyEntryToDbPayload(data);

    const updated = await prisma.weeklyCheckIn.update({
      where: { weekDate },
      data: payload,
    });

    return formatDbRowToWeeklyEntry(updated);
  } catch (error) {
    console.error("Error updating weekly entry:", error);
    throw error;
  }
}

export async function upsertWeeklyEntry(
  data: WeeklyEntryFormData
): Promise<WeeklyEntry> {
  try {
    const weekDate = new Date(data.weekOf);
    const payload = formatWeeklyEntryToDbPayload(data);

    const upserted = await prisma.weeklyCheckIn.upsert({
      where: { weekDate },
      create: {
        weekDate,
        ...payload,
      },
      update: payload,
    });

    return formatDbRowToWeeklyEntry(upserted);
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
    return entries.map((row: any) => formatDbRowToWeeklyEntry(row));
  } catch (error) {
    console.error("Error fetching analytics entries:", error);
    throw error;
  }
}