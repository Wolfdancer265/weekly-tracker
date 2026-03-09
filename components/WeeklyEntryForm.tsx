"use client";

import { useMemo, useState, useTransition } from "react";
import { defaultWeeklyEntryFormData, weeklyEntryToFormData } from "@/lib/transformers";
import { calculateShowedUp, normalizeFormData, validateWeeklyEntryFormData } from "@/lib/validation";
import { formatWeekLabel, normalizeWeekOfDate } from "@/lib/date-helpers";
import type { WeeklyEntry, WeeklyEntryFormData } from "@/types";

interface WeeklyEntryFormProps {
  entries: WeeklyEntry[];
  currentWeek: string;
}

type SaveState =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const numberFieldClass =
  "mt-1 w-full rounded-xl border border-sand-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none transition focus:border-moss-500";
const textFieldClass =
  "mt-1 w-full rounded-xl border border-sand-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none transition focus:border-moss-500";

function fieldError(errors: Partial<Record<keyof WeeklyEntryFormData, string>>, key: keyof WeeklyEntryFormData) {
  return errors[key] ? <p className="mt-1 text-xs text-red-700">{errors[key]}</p> : null;
}

export function WeeklyEntryForm({ entries, currentWeek }: WeeklyEntryFormProps) {
  const [allEntries, setAllEntries] = useState(entries);
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [formData, setFormData] = useState<WeeklyEntryFormData>(() => {
    const existing = entries.find((entry) => entry.weekOf === currentWeek);
    return existing ? weeklyEntryToFormData(existing) : defaultWeeklyEntryFormData(currentWeek);
  });
  const [errors, setErrors] = useState<Partial<Record<keyof WeeklyEntryFormData, string>>>({});
  const [saveState, setSaveState] = useState<SaveState>({ type: "idle" });
  const [isPending, startTransition] = useTransition();

  const existingWeekSet = useMemo(() => new Set(allEntries.map((entry) => entry.weekOf)), [allEntries]);
  const isEditingExisting = existingWeekSet.has(selectedWeek);

  const sortedWeeks = useMemo(
    () => allEntries.slice().sort((a, b) => b.weekOf.localeCompare(a.weekOf)).map((entry) => entry.weekOf),
    [allEntries]
  );

  function loadWeek(weekOf: string) {
    const normalizedWeek = normalizeWeekOfDate(weekOf);
    setSelectedWeek(normalizedWeek);
    const existing = allEntries.find((entry) => entry.weekOf === normalizedWeek);
    setErrors({});
    setSaveState({ type: "idle" });

    if (existing) {
      setFormData(weeklyEntryToFormData(existing));
      return;
    }

    setFormData(defaultWeeklyEntryFormData(normalizedWeek));
  }

  function updateField<K extends keyof WeeklyEntryFormData>(key: K, value: WeeklyEntryFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    const normalized = normalizeFormData({ ...formData, weekOf: selectedWeek });
    const validation = validateWeeklyEntryFormData(normalized);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setSaveState({ type: "error", message: "Please fix the highlighted fields." });
      return;
    }

    setErrors({});

    startTransition(async () => {
      try {
        const response = await fetch("/api/weekly-entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(normalized)
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Failed to save entry.");
        }

        const savedEntry = payload.data as WeeklyEntry;
        setAllEntries((prev) => {
          const index = prev.findIndex((entry) => entry.weekOf === savedEntry.weekOf);
          if (index === -1) {
            return [savedEntry, ...prev];
          }

          const next = prev.slice();
          next[index] = savedEntry;
          return next;
        });

        setSelectedWeek(savedEntry.weekOf);
        setFormData(weeklyEntryToFormData(savedEntry));
        setSaveState({ type: "success", message: `Saved ${formatWeekLabel(savedEntry.weekOf)}.` });
      } catch (error) {
        setSaveState({
          type: "error",
          message: error instanceof Error ? error.message : "Unable to save your check-in right now."
        });
      }
    });
  }

  return (
    <section className="rounded-xl2 border border-sand-200 bg-white p-6 shadow-card sm:p-8">
      <div className="mb-7 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <label className="text-xs uppercase tracking-wide text-ink-700">Week</label>
          <input
            type="date"
            value={selectedWeek}
            onChange={(event) => loadWeek(event.target.value)}
            className={textFieldClass}
          />
          {fieldError(errors, "weekOf")}
          <p className="mt-2 text-xs text-ink-700">
            {isEditingExisting ? "Editing an existing weekly record." : "This will create a new weekly record."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadWeek(currentWeek)}
          className="h-10 rounded-full border border-sand-200 px-4 text-sm text-ink-900 transition hover:bg-sand-100"
        >
          Jump to Current Week
        </button>
      </div>

      {sortedWeeks.length > 0 ? (
        <div className="mb-8">
          <p className="mb-2 text-xs uppercase tracking-wide text-ink-700">Existing Weeks</p>
          <div className="flex flex-wrap gap-2">
            {sortedWeeks.map((week) => (
              <button
                key={week}
                type="button"
                onClick={() => loadWeek(week)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  selectedWeek === week
                    ? "border-moss-600 bg-moss-600 text-white"
                    : "border-sand-200 bg-white text-ink-700 hover:bg-sand-100"
                }`}
              >
                {week}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-8">
        <fieldset className="space-y-4">
          <legend className="font-serif text-xl text-ink-900">Inner Wolves</legend>
          <div>
            <label className="text-sm text-ink-700">Focus</label>
            <input
              type="text"
              value={formData.innerWolvesFocus}
              onChange={(event) => updateField("innerWolvesFocus", event.target.value)}
              className={textFieldClass}
            />
            {fieldError(errors, "innerWolvesFocus")}
          </div>

          <div>
            <label className="text-sm text-ink-700">Key Actions (one per line)</label>
            <textarea
              value={formData.innerWolvesKeyActions.join("\n")}
              onChange={(event) =>
                updateField(
                  "innerWolvesKeyActions",
                  event.target.value
                    .split("\n")
                    .map((action) => action.trim())
                    .filter(Boolean)
                )
              }
              rows={4}
              className={textFieldClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-ink-700">Progress Score (1-5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={formData.innerWolvesProgressScore}
                onChange={(event) => updateField("innerWolvesProgressScore", Number(event.target.value))}
                className={numberFieldClass}
              />
              {fieldError(errors, "innerWolvesProgressScore")}
            </div>
          </div>

          <div>
            <label className="text-sm text-ink-700">Notes</label>
            <textarea
              value={formData.innerWolvesNotes}
              onChange={(event) => updateField("innerWolvesNotes", event.target.value)}
              rows={4}
              className={textFieldClass}
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-serif text-xl text-ink-900">Sapphire Dragon</legend>
          <p className="text-xs uppercase tracking-wide text-ink-700">
            Track manuscript movement by chapter, not by word count.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-sm text-ink-700">Writing Sessions</label>
              <input
                type="number"
                min={0}
                value={formData.sapphireDragonWritingSessions}
                onChange={(event) => updateField("sapphireDragonWritingSessions", Number(event.target.value))}
                className={numberFieldClass}
              />
            </div>
            <div>
              <label className="text-sm text-ink-700">Current Chapter (optional)</label>
              <input
                type="text"
                value={formData.sapphireDragonCurrentChapter ?? ""}
                onChange={(event) => updateField("sapphireDragonCurrentChapter", event.target.value)}
                className={textFieldClass}
                placeholder="e.g. Chapter 14"
              />
            </div>
            <div>
              <label className="text-sm text-ink-700">Chapters Drafted</label>
              <input
                type="number"
                min={0}
                value={formData.sapphireDragonChaptersDrafted}
                onChange={(event) => updateField("sapphireDragonChaptersDrafted", Number(event.target.value))}
                className={numberFieldClass}
              />
            </div>
            <div>
              <label className="text-sm text-ink-700">Chapters Revised</label>
              <input
                type="number"
                min={0}
                value={formData.sapphireDragonChaptersRevised}
                onChange={(event) => updateField("sapphireDragonChaptersRevised", Number(event.target.value))}
                className={numberFieldClass}
              />
            </div>
          </div>

          <div className="rounded-xl border border-sand-200 bg-sand-50 px-4 py-3 text-sm text-ink-900">
            Showed Up Status: {calculateShowedUp(formData.sapphireDragonWritingSessions) ? "Yes (3+ sessions)" : "Not yet"}
          </div>

          <div>
            <label className="text-sm text-ink-700">Notes</label>
            <textarea
              value={formData.sapphireDragonNotes}
              onChange={(event) => updateField("sapphireDragonNotes", event.target.value)}
              rows={4}
              className={textFieldClass}
              placeholder="What shifted in this chapter arc, scene, or revision pass?"
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-serif text-xl text-ink-900">Physical Vitality</legend>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-sm text-ink-700">Training Sessions</label>
              <input
                type="number"
                min={0}
                value={formData.physicalVitalityTrainingSessions}
                onChange={(event) => updateField("physicalVitalityTrainingSessions", Number(event.target.value))}
                className={numberFieldClass}
              />
            </div>
            <div>
              <label className="text-sm text-ink-700">Nutrition Anchor Days</label>
              <input
                type="number"
                min={0}
                value={formData.physicalVitalityNutritionAnchorDays}
                onChange={(event) => updateField("physicalVitalityNutritionAnchorDays", Number(event.target.value))}
                className={numberFieldClass}
              />
            </div>
            <div>
              <label className="text-sm text-ink-700">Average Energy (1-5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={formData.physicalVitalityAvgEnergy}
                onChange={(event) => updateField("physicalVitalityAvgEnergy", Number(event.target.value))}
                className={numberFieldClass}
              />
              {fieldError(errors, "physicalVitalityAvgEnergy")}
            </div>
            <div>
              <label className="text-sm text-ink-700">Weight (optional)</label>
              <input
                type="number"
                min={0}
                step="0.1"
                value={formData.physicalVitalityWeight ?? ""}
                onChange={(event) =>
                  updateField(
                    "physicalVitalityWeight",
                    event.target.value ? Number(event.target.value) : undefined
                  )
                }
                className={numberFieldClass}
              />
              {fieldError(errors, "physicalVitalityWeight")}
            </div>
          </div>

          <div>
            <label className="text-sm text-ink-700">Notes</label>
            <textarea
              value={formData.physicalVitalityNotes}
              onChange={(event) => updateField("physicalVitalityNotes", event.target.value)}
              rows={4}
              className={textFieldClass}
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-serif text-xl text-ink-900">Reflection</legend>
          <div>
            <label className="text-sm text-ink-700">What meaningful progress happened in Inner Wolves?</label>
            <textarea
              value={formData.reflectionInnerWolves}
              onChange={(event) => updateField("reflectionInnerWolves", event.target.value)}
              rows={3}
              className={textFieldClass}
            />
          </div>
          <div>
            <label className="text-sm text-ink-700">Did I show up to the manuscript for Sapphire Dragon?</label>
            <textarea
              value={formData.reflectionSapphireDragon}
              onChange={(event) => updateField("reflectionSapphireDragon", event.target.value)}
              rows={3}
              className={textFieldClass}
            />
          </div>
          <div>
            <label className="text-sm text-ink-700">How did my body feel this week?</label>
            <textarea
              value={formData.reflectionPhysicalVitality}
              onChange={(event) => updateField("reflectionPhysicalVitality", event.target.value)}
              rows={3}
              className={textFieldClass}
            />
          </div>
          <div>
            <label className="text-sm text-ink-700">What one adjustment should I make next week?</label>
            <textarea
              value={formData.reflectionAdjustment}
              onChange={(event) => updateField("reflectionAdjustment", event.target.value)}
              rows={3}
              className={textFieldClass}
            />
          </div>
        </fieldset>
      </div>

      <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="rounded-full bg-moss-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-moss-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Saving..." : "Save Weekly Check-In"}
        </button>

        {saveState.type === "success" ? <p className="text-sm text-green-700">{saveState.message}</p> : null}
        {saveState.type === "error" ? <p className="text-sm text-red-700">{saveState.message}</p> : null}
      </div>
    </section>
  );
}
