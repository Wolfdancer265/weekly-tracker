import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { PillarCard } from "@/components/PillarCard";
import { ProgressBar } from "@/components/ProgressBar";
import { ReflectionCard } from "@/components/ReflectionCard";
import { StatBadge } from "@/components/StatBadge";
import { formatWeekLabel } from "@/lib/date-helpers";
import { fetchWeeklyEntryByWeek } from "@/lib/weekly-entries";

export default async function WeekDetailPage({ params }: { params: { weekOf: string } }) {
  const result = await fetchWeeklyEntryByWeek(params.weekOf);
  const entry = result.data;

  return (
    <div className="space-y-6 pb-6">
      <PageHeader
        title={entry ? formatWeekLabel(entry.weekOf) : "Weekly Detail"}
        subtitle="Full weekly record across the three pillars and end-of-week reflection."
        actions={
          <Link href="/history" className="rounded-full border border-sand-200 px-4 py-2 text-sm text-ink-900 hover:bg-sand-100">
            Back to History
          </Link>
        }
      />

      {result.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{result.error}</div>
      ) : null}

      {!entry ? (
        <EmptyState
          title="Weekly Entry Not Found"
          description="The requested week does not exist yet."
          actionLabel="Open Weekly Check-In"
          actionHref="/check-in"
        />
      ) : (
        <>
          <div className="grid gap-5 lg:grid-cols-3">
            <PillarCard title="Inner Wolves" description={entry.innerWolvesFocus || "No focus captured."}>
              <div className="space-y-4">
                <ProgressBar value={entry.innerWolvesProgressScore} />
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-ink-700">Key Actions</p>
                  {entry.innerWolvesKeyActions.length ? (
                    <ul className="space-y-1 text-sm text-ink-900">
                      {entry.innerWolvesKeyActions.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-ink-700">No key actions recorded.</p>
                  )}
                </div>
                <p className="whitespace-pre-wrap text-sm text-ink-900">{entry.innerWolvesNotes || "No notes."}</p>
              </div>
            </PillarCard>

            <PillarCard title="Sapphire Dragon" description="Chapter-by-chapter manuscript commitment">
              <div className="grid gap-3">
                <StatBadge label="Writing Sessions" value={entry.sapphireDragonWritingSessions} />
                <StatBadge
                  label="Current Chapter"
                  value={entry.sapphireDragonCurrentChapter?.trim() ? entry.sapphireDragonCurrentChapter : "Not set"}
                />
                <StatBadge label="Chapters Drafted" value={entry.sapphireDragonChaptersDrafted} />
                <StatBadge label="Chapters Revised" value={entry.sapphireDragonChaptersRevised} />
                <StatBadge label="Showed Up" value={entry.sapphireDragonShowedUp ? "Yes" : "No"} />
                <p className="whitespace-pre-wrap text-sm text-ink-900">{entry.sapphireDragonNotes || "No notes."}</p>
              </div>
            </PillarCard>

            <PillarCard title="Physical Vitality" description="Health, strength, and sustainable energy">
              <div className="grid gap-3">
                <StatBadge label="Training Sessions" value={entry.physicalVitalityTrainingSessions} />
                <StatBadge label="Nutrition Anchor Days" value={entry.physicalVitalityNutritionAnchorDays} />
                <StatBadge label="Average Energy" value={`${entry.physicalVitalityAvgEnergy}/5`} />
                {entry.physicalVitalityWeight ? <StatBadge label="Weight" value={entry.physicalVitalityWeight} /> : null}
                <p className="whitespace-pre-wrap text-sm text-ink-900">{entry.physicalVitalityNotes || "No notes."}</p>
              </div>
            </PillarCard>
          </div>

          <section className="space-y-3 rounded-xl2 border border-sand-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-2xl text-ink-900">Reflection</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <ReflectionCard
                title="Inner Wolves"
                prompt="What meaningful progress happened in Inner Wolves?"
                value={entry.reflectionInnerWolves}
              />
              <ReflectionCard
                title="Sapphire Dragon"
                prompt="Did I show up to the manuscript for Sapphire Dragon?"
                value={entry.reflectionSapphireDragon}
              />
              <ReflectionCard
                title="Physical Vitality"
                prompt="How did my body feel this week?"
                value={entry.reflectionPhysicalVitality}
              />
              <ReflectionCard
                title="Adjustment"
                prompt="What one adjustment should I make next week?"
                value={entry.reflectionAdjustment}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
