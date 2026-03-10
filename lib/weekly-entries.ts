import {
  getWeeklyEntriesForAnalytics,
  getWeeklyEntryByWeek,
  listWeeklyEntries,
  upsertWeeklyEntry
} from "@/lib/prisma/weekly-entries";
import { normalizeFormData, validateWeeklyEntryFormData } from "@/lib/validation";
import type { WeeklyEntry, WeeklyEntryFormData } from "@/types";

export interface DataResult<T> {
  data: T;
  error?: string;
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected database error.";
}

export function getConfigStatus(): { configured: boolean; message?: string } {
  return {
    configured: true,
    message: `Using PostgreSQL database via Prisma.`
  };
}

export async function fetchWeeklyEntries(): Promise<DataResult<WeeklyEntry[]>> {
  try {
    return { data: await listWeeklyEntries() };
  } catch (error) {
    return { data: [], error: toErrorMessage(error) };
  }
}

export async function fetchWeeklyEntryByWeek(weekOf: string): Promise<DataResult<WeeklyEntry | null>> {
  try {
    return { data: await getWeeklyEntryByWeek(weekOf) };
  } catch (error) {
    return { data: null, error: toErrorMessage(error) };
  }
}

export async function saveWeeklyEntry(input: Partial<WeeklyEntryFormData>): Promise<DataResult<WeeklyEntry>> {
  const normalized = normalizeFormData(input);
  const validation = validateWeeklyEntryFormData(normalized);

  if (!validation.isValid) {
    const firstError = Object.values(validation.errors)[0] ?? "Invalid weekly entry.";
    return { data: {} as WeeklyEntry, error: firstError };
  }

  try {
    const saved = await upsertWeeklyEntry(normalized);
    return { data: saved };
  } catch (error) {
    return { data: {} as WeeklyEntry, error: toErrorMessage(error) };
  }
}

export async function fetchAnalyticsEntries(): Promise<DataResult<WeeklyEntry[]>> {
  try {
    return { data: await getWeeklyEntriesForAnalytics() };
  } catch (error) {
    return { data: [], error: toErrorMessage(error) };
  }
}
