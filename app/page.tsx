import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { PillarCard } from "@/components/PillarCard";
import { ProgressBar } from "@/components/ProgressBar";
import { ReflectionCard } from "@/components/ReflectionCard";
import { StatBadge } from "@/components/StatBadge";
import { formatWeekLabel, getCurrentWeekStart } from "@/lib/date-helpers";
import { fetchWeeklyEntryByWeek, fetchWeeklyEntries, getConfigStatus } from "@/lib/weekly-entries";

export default async function DashboardPage() {
  const currentWeek = getCurrentWeekStart();
  const [currentResult, listResult] = await Promise.all([
    fetchWeeklyEntryByWeek(currentWeek),
    fetchWeeklyEntries()
  ]);

  const current = currentResult.data;
  const recent = listResult.data.slice(0, 4);
  const config = getConfigStatus();
  const error = currentResult.error || listResult.error;

  return (
    <div className="space-y-8 pb-6">
      <PageHeader
        title="Weekly Strategic Companion"
        subtitle="A calm weekly rhythm for intellect, chapter progress, and physical vitality."
        actions={
          <Link href="/check-in" className="rounded-full bg-moss-600 px-5 py-2 text-sm font-medium text-white hover:bg-moss-500">
            Edit This Week
          </Link>
        }
      />

      {!config.configured ? (
        <EmptyState
          title="Local Database Ready"
          description={config.message || "SQLite is configured automatically for local persistence."}
          actionLabel="Open Check-In"
          actionHref="/check-in"
        />
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
      ) : null}

      {current ? (
        <>
          <section className="rounded-xl2 border border-sand-200 bg-white p-5 shadow-card sm:p-6">
            <p className="text-xs uppercase tracking-wide text-ink-700">This Week</p>
            <h2 className="mt-2 font-serif text-2xl text-ink-900">{formatWeekLabel(current.weekOf)}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <StatBadge label="Inner Wolves Score" value={`${current.innerWolvesProgressScore}/5`} />
              <StatBadge label="Writing Sessions" value={current.sapphireDragonWritingSessions} />
              <StatBadge label="Training Sessions" value={current.physicalVitalityTrainingSessions} />
            </div>
          </section>

          <div className="grid gap-5 lg:grid-cols-3">
            <PillarCard title="Inner Wolves" description={current.innerWolvesFocus || "No focus captured yet."}>
              <div className="space-y-4">
                <ProgressBar value={current.innerWolvesProgressScore} />
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-ink-700">Key Actions</p>
                  {current.innerWolvesKeyActions.length ? (
                    <ul className="space-y-1 text-sm text-ink-900">
                      {current.innerWolvesKeyActions.slice(0, 3).map((action) => (
                        <li key={action}>• {action}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-ink-700">No actions recorded.</p>
                  )}
                </div>
              </div>
            </PillarCard>

            <PillarCard title="Sapphire Dragon" description="Chapter-by-chapter manuscript movement">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <StatBadge label="Writing Sessions" value={current.sapphireDragonWritingSessions} />
                {current.sapphireDragonCurrentChapter ? (
                  <StatBadge label="Current Chapter" value={current.sapphireDragonCurrentChapter} />
                ) : (
                  <StatBadge label="Current Chapter" value="Not set" />
                )}
                <StatBadge label="Chapters Drafted" value={current.sapphireDragonChaptersDrafted} />
                <StatBadge label="Chapters Revised" value={current.sapphireDragonChaptersRevised} />
                <StatBadge label="Showed Up" value={current.sapphireDragonShowedUp ? "Yes" : "No"} />
              </div>
            </PillarCard>

            <PillarCard title="Physical Vitality" description="Strength, energy, and sustainability">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <StatBadge label="Training" value={current.physicalVitalityTrainingSessions} />
                <StatBadge label="Nutrition Anchor Days" value={current.physicalVitalityNutritionAnchorDays} />
                <StatBadge label="Average Energy" value={`${current.physicalVitalityAvgEnergy}/5`} />
                {current.physicalVitalityWeight ? (
                  <StatBadge label="Weight" value={current.physicalVitalityWeight} />
                ) : null}
              </div>
            </PillarCard>
          </div>

          <section className="space-y-3 rounded-xl2 border border-sand-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-2xl text-ink-900">Reflection</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <ReflectionCard
                title="Inner Wolves"
                prompt="What meaningful progress happened in Inner Wolves?"
                value={current.reflectionInnerWolves}
              />
              <ReflectionCard
                title="Sapphire Dragon"
                prompt="Did I show up to the manuscript for Sapphire Dragon?"
                value={current.reflectionSapphireDragon}
              />
              <ReflectionCard
                title="Physical Vitality"
                prompt="How did my body feel this week?"
                value={current.reflectionPhysicalVitality}
              />
              <ReflectionCard
                title="Adjustment"
                prompt="What one adjustment should I make next week?"
                value={current.reflectionAdjustment}
              />
            </div>
          </section>
        </>
      ) : (
        <EmptyState
          title="No Entry for This Week Yet"
          description="Start your weekly check-in to capture chapter progress and momentum across your three pillars."
          actionLabel="Create This Week's Entry"
          actionHref="/check-in"
        />
      )}

      <section className="rounded-xl2 border border-sand-200 bg-white p-5 shadow-card">
        <h3 className="font-serif text-2xl text-ink-900">Recent Weeks</h3>
        {recent.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((entry) => (
              <Link
                key={entry.weekOf}
                href={`/history/${entry.weekOf}`}
                className="rounded-2xl border border-sand-200 bg-sand-50 p-4 transition hover:bg-sand-100"
              >
                <p className="text-xs uppercase tracking-wide text-ink-700">{entry.weekOf}</p>
                <p className="mt-2 text-sm text-ink-900">Inner Wolves: {entry.innerWolvesProgressScore}/5</p>
                <p className="text-sm text-ink-900">Sessions: {entry.sapphireDragonWritingSessions}</p>
                <p className="text-sm text-ink-900">Drafted/Revised: {entry.sapphireDragonChaptersDrafted}/{entry.sapphireDragonChaptersRevised}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-ink-700">No historical entries yet.</p>
        )}
      </section>
    </div>
  );
}
