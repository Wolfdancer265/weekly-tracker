import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const configuredPath = process.env.SQLITE_DB_PATH;
const defaultPath = path.join(process.cwd(), "data", "weekly-goals.db");
const dbPath = configuredPath ? path.resolve(configuredPath) : defaultPath;

declare global {
  // eslint-disable-next-line no-var
  var __weeklyGoalsDb: DatabaseSync | undefined;
}

interface TableInfoRow {
  name: string;
}

function getTableColumns(database: DatabaseSync, tableName: string): Set<string> {
  const rows = database.prepare(`PRAGMA table_info(${tableName})`).all() as unknown as TableInfoRow[];
  return new Set(rows.map((row) => row.name));
}

function ensureColumn(database: DatabaseSync, tableName: string, columnName: string, sqlDefinition: string) {
  const columns = getTableColumns(database, tableName);

  if (!columns.has(columnName)) {
    database.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${sqlDefinition}`);
  }
}

function initializeSchema(database: DatabaseSync) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS weekly_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      weekOf TEXT NOT NULL UNIQUE,
      innerWolvesFocus TEXT NOT NULL DEFAULT '',
      innerWolvesKeyActions TEXT NOT NULL DEFAULT '',
      innerWolvesProgressScore INTEGER NOT NULL DEFAULT 1,
      innerWolvesNotes TEXT NOT NULL DEFAULT '',
      sapphireDragonWritingSessions INTEGER NOT NULL DEFAULT 0,
      sapphireDragonCurrentChapter TEXT,
      sapphireDragonChaptersDrafted INTEGER NOT NULL DEFAULT 0,
      sapphireDragonChaptersRevised INTEGER NOT NULL DEFAULT 0,
      sapphireDragonShowedUp INTEGER NOT NULL DEFAULT 0,
      sapphireDragonNotes TEXT NOT NULL DEFAULT '',
      physicalVitalityTrainingSessions INTEGER NOT NULL DEFAULT 0,
      physicalVitalityNutritionAnchorDays INTEGER NOT NULL DEFAULT 0,
      physicalVitalityAvgEnergy INTEGER NOT NULL DEFAULT 1,
      physicalVitalityWeight REAL,
      physicalVitalityNotes TEXT NOT NULL DEFAULT '',
      reflectionInnerWolves TEXT NOT NULL DEFAULT '',
      reflectionSapphireDragon TEXT NOT NULL DEFAULT '',
      reflectionPhysicalVitality TEXT NOT NULL DEFAULT '',
      reflectionAdjustment TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  // Safe migration support for older rows/databases that predate chapter tracking.
  ensureColumn(database, "weekly_entries", "sapphireDragonCurrentChapter", "TEXT");
  ensureColumn(database, "weekly_entries", "sapphireDragonChaptersDrafted", "INTEGER NOT NULL DEFAULT 0");
  ensureColumn(database, "weekly_entries", "sapphireDragonChaptersRevised", "INTEGER NOT NULL DEFAULT 0");

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_weekly_entries_weekOf
    ON weekly_entries (weekOf DESC);
  `);
}

function createDatabase() {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const database = new DatabaseSync(dbPath);
  initializeSchema(database);
  return database;
}

export function getDb() {
  if (!global.__weeklyGoalsDb) {
    global.__weeklyGoalsDb = createDatabase();
  }

  return global.__weeklyGoalsDb;
}

export function getDbPath() {
  return dbPath;
}
