#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const configuredPath = process.env.SQLITE_DB_PATH;
const dbPath = configuredPath
  ? path.resolve(configuredPath)
  : path.join(process.cwd(), "data", "weekly-goals.db");

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);

db.exec(`
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

db.close();

console.log(`SQLite database initialized at ${dbPath}`);
console.log("No sample data inserted (empty by default).");
