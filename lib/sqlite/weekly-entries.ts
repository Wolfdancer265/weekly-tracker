import { getDb } from "@/lib/sqlite/client";
import { formatDbRowToWeeklyEntry, formatWeeklyEntryToDbPayload } from "@/lib/transformers";
import type { WeeklyEntry, WeeklyEntryDbRow, WeeklyEntryFormData } from "@/types";

const SELECT_FIELDS = `
  id,
  weekOf,
  innerWolvesFocus,
  innerWolvesKeyActions,
  innerWolvesProgressScore,
  innerWolvesNotes,
  sapphireDragonWritingSessions,
  sapphireDragonCurrentChapter,
  sapphireDragonChaptersDrafted,
  sapphireDragonChaptersRevised,
  sapphireDragonShowedUp,
  sapphireDragonNotes,
  physicalVitalityTrainingSessions,
  physicalVitalityNutritionAnchorDays,
  physicalVitalityAvgEnergy,
  physicalVitalityWeight,
  physicalVitalityNotes,
  reflectionInnerWolves,
  reflectionSapphireDragon,
  reflectionPhysicalVitality,
  reflectionAdjustment,
  createdAt,
  updatedAt
`;

function toRow(row: unknown): WeeklyEntryDbRow {
  return row as WeeklyEntryDbRow;
}

function toRows(rows: unknown): WeeklyEntryDbRow[] {
  return rows as WeeklyEntryDbRow[];
}

export async function listWeeklyEntries(): Promise<WeeklyEntry[]> {
  const rows = toRows(getDb().prepare(`SELECT ${SELECT_FIELDS} FROM weekly_entries ORDER BY weekOf DESC`).all());
  return rows.map(formatDbRowToWeeklyEntry);
}

export async function getWeeklyEntryByWeek(weekOf: string): Promise<WeeklyEntry | null> {
  const row = getDb().prepare(`SELECT ${SELECT_FIELDS} FROM weekly_entries WHERE weekOf = ? LIMIT 1`).get(weekOf);
  return row ? formatDbRowToWeeklyEntry(toRow(row)) : null;
}

export async function createWeeklyEntry(data: WeeklyEntryFormData): Promise<WeeklyEntry> {
  const db = getDb();
  const now = new Date().toISOString();
  const payload = formatWeeklyEntryToDbPayload(data);

  db.prepare(
    `INSERT INTO weekly_entries (
      weekOf, innerWolvesFocus, innerWolvesKeyActions, innerWolvesProgressScore,
      innerWolvesNotes, sapphireDragonWritingSessions, sapphireDragonCurrentChapter,
      sapphireDragonChaptersDrafted, sapphireDragonChaptersRevised,
      sapphireDragonShowedUp, sapphireDragonNotes,
      physicalVitalityTrainingSessions, physicalVitalityNutritionAnchorDays,
      physicalVitalityAvgEnergy, physicalVitalityWeight, physicalVitalityNotes,
      reflectionInnerWolves, reflectionSapphireDragon, reflectionPhysicalVitality,
      reflectionAdjustment, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    payload.weekOf,
    payload.innerWolvesFocus,
    payload.innerWolvesKeyActions,
    payload.innerWolvesProgressScore,
    payload.innerWolvesNotes,
    payload.sapphireDragonWritingSessions,
    payload.sapphireDragonCurrentChapter,
    payload.sapphireDragonChaptersDrafted,
    payload.sapphireDragonChaptersRevised,
    payload.sapphireDragonShowedUp,
    payload.sapphireDragonNotes,
    payload.physicalVitalityTrainingSessions,
    payload.physicalVitalityNutritionAnchorDays,
    payload.physicalVitalityAvgEnergy,
    payload.physicalVitalityWeight,
    payload.physicalVitalityNotes,
    payload.reflectionInnerWolves,
    payload.reflectionSapphireDragon,
    payload.reflectionPhysicalVitality,
    payload.reflectionAdjustment,
    now,
    now
  );

  const created = await getWeeklyEntryByWeek(data.weekOf);
  if (!created) {
    throw new Error("Failed to create weekly entry.");
  }

  return created;
}

export async function updateWeeklyEntry(weekOf: string, data: WeeklyEntryFormData): Promise<WeeklyEntry> {
  const db = getDb();
  const payload = formatWeeklyEntryToDbPayload(data);

  db.prepare(
    `UPDATE weekly_entries SET
      innerWolvesFocus = ?,
      innerWolvesKeyActions = ?,
      innerWolvesProgressScore = ?,
      innerWolvesNotes = ?,
      sapphireDragonWritingSessions = ?,
      sapphireDragonCurrentChapter = ?,
      sapphireDragonChaptersDrafted = ?,
      sapphireDragonChaptersRevised = ?,
      sapphireDragonShowedUp = ?,
      sapphireDragonNotes = ?,
      physicalVitalityTrainingSessions = ?,
      physicalVitalityNutritionAnchorDays = ?,
      physicalVitalityAvgEnergy = ?,
      physicalVitalityWeight = ?,
      physicalVitalityNotes = ?,
      reflectionInnerWolves = ?,
      reflectionSapphireDragon = ?,
      reflectionPhysicalVitality = ?,
      reflectionAdjustment = ?,
      updatedAt = ?
    WHERE weekOf = ?`
  ).run(
    payload.innerWolvesFocus,
    payload.innerWolvesKeyActions,
    payload.innerWolvesProgressScore,
    payload.innerWolvesNotes,
    payload.sapphireDragonWritingSessions,
    payload.sapphireDragonCurrentChapter,
    payload.sapphireDragonChaptersDrafted,
    payload.sapphireDragonChaptersRevised,
    payload.sapphireDragonShowedUp,
    payload.sapphireDragonNotes,
    payload.physicalVitalityTrainingSessions,
    payload.physicalVitalityNutritionAnchorDays,
    payload.physicalVitalityAvgEnergy,
    payload.physicalVitalityWeight,
    payload.physicalVitalityNotes,
    payload.reflectionInnerWolves,
    payload.reflectionSapphireDragon,
    payload.reflectionPhysicalVitality,
    payload.reflectionAdjustment,
    payload.updatedAt,
    weekOf
  );

  const updated = await getWeeklyEntryByWeek(weekOf);
  if (!updated) {
    throw new Error("Failed to update weekly entry.");
  }

  return updated;
}

export async function upsertWeeklyEntry(data: WeeklyEntryFormData): Promise<WeeklyEntry> {
  const db = getDb();
  const now = new Date().toISOString();
  const payload = formatWeeklyEntryToDbPayload(data);

  db.prepare(
    `INSERT INTO weekly_entries (
      weekOf, innerWolvesFocus, innerWolvesKeyActions, innerWolvesProgressScore,
      innerWolvesNotes, sapphireDragonWritingSessions, sapphireDragonCurrentChapter,
      sapphireDragonChaptersDrafted, sapphireDragonChaptersRevised,
      sapphireDragonShowedUp, sapphireDragonNotes,
      physicalVitalityTrainingSessions, physicalVitalityNutritionAnchorDays,
      physicalVitalityAvgEnergy, physicalVitalityWeight, physicalVitalityNotes,
      reflectionInnerWolves, reflectionSapphireDragon, reflectionPhysicalVitality,
      reflectionAdjustment, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(weekOf) DO UPDATE SET
      innerWolvesFocus = excluded.innerWolvesFocus,
      innerWolvesKeyActions = excluded.innerWolvesKeyActions,
      innerWolvesProgressScore = excluded.innerWolvesProgressScore,
      innerWolvesNotes = excluded.innerWolvesNotes,
      sapphireDragonWritingSessions = excluded.sapphireDragonWritingSessions,
      sapphireDragonCurrentChapter = excluded.sapphireDragonCurrentChapter,
      sapphireDragonChaptersDrafted = excluded.sapphireDragonChaptersDrafted,
      sapphireDragonChaptersRevised = excluded.sapphireDragonChaptersRevised,
      sapphireDragonShowedUp = excluded.sapphireDragonShowedUp,
      sapphireDragonNotes = excluded.sapphireDragonNotes,
      physicalVitalityTrainingSessions = excluded.physicalVitalityTrainingSessions,
      physicalVitalityNutritionAnchorDays = excluded.physicalVitalityNutritionAnchorDays,
      physicalVitalityAvgEnergy = excluded.physicalVitalityAvgEnergy,
      physicalVitalityWeight = excluded.physicalVitalityWeight,
      physicalVitalityNotes = excluded.physicalVitalityNotes,
      reflectionInnerWolves = excluded.reflectionInnerWolves,
      reflectionSapphireDragon = excluded.reflectionSapphireDragon,
      reflectionPhysicalVitality = excluded.reflectionPhysicalVitality,
      reflectionAdjustment = excluded.reflectionAdjustment,
      updatedAt = excluded.updatedAt`
  ).run(
    payload.weekOf,
    payload.innerWolvesFocus,
    payload.innerWolvesKeyActions,
    payload.innerWolvesProgressScore,
    payload.innerWolvesNotes,
    payload.sapphireDragonWritingSessions,
    payload.sapphireDragonCurrentChapter,
    payload.sapphireDragonChaptersDrafted,
    payload.sapphireDragonChaptersRevised,
    payload.sapphireDragonShowedUp,
    payload.sapphireDragonNotes,
    payload.physicalVitalityTrainingSessions,
    payload.physicalVitalityNutritionAnchorDays,
    payload.physicalVitalityAvgEnergy,
    payload.physicalVitalityWeight,
    payload.physicalVitalityNotes,
    payload.reflectionInnerWolves,
    payload.reflectionSapphireDragon,
    payload.reflectionPhysicalVitality,
    payload.reflectionAdjustment,
    now,
    payload.updatedAt
  );

  const entry = await getWeeklyEntryByWeek(data.weekOf);
  if (!entry) {
    throw new Error("Failed to save weekly entry.");
  }

  return entry;
}

export async function getWeeklyEntriesForAnalytics(): Promise<WeeklyEntry[]> {
  const rows = toRows(getDb().prepare(`SELECT ${SELECT_FIELDS} FROM weekly_entries ORDER BY weekOf ASC`).all());
  return rows.map(formatDbRowToWeeklyEntry);
}
