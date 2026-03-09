import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { PillarCard } from "@/components/PillarCard";
import { StatBadge } from "@/components/StatBadge";
import { formatWeekLabel } from "@/lib/date-helpers";
import { fetchWeeklyEntries } from "@/lib/weekly-entries";

export default async function HistoryPage() {
  const result = await fetchWeeklyEntries();

  return (
    <div className="space-y-6 pb-6">
      <PageHeader
        title="History"
        subtitle="Review previous weeks in reverse chronological order for continuity and perspective."
      />

      {result.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{result.error}</div>
      ) : null}

      {result.data.length === 0 ? (
        <EmptyState
          title="No Weekly History Yet"
          description="Create your first weekly check-in to start building your long-horizon record."
          actionLabel="Go to Weekly Check-In"
          actionHref="/check-in"
        />
      ) : (
        <div className="grid gap-4">
          {result.data.map((entry) => (
            <Link key={entry.weekOf} href={`/history/${entry.weekOf}`}>
              <PillarCard title={formatWeekLabel(entry.weekOf)} description="Open detailed weekly record">
                <div className="grid gap-3 sm:grid-cols-5">
                  <StatBadge label="Inner Wolves" value={`${entry.innerWolvesProgressScore}/5`} />
                  <StatBadge label="Writing Sessions" value={entry.sapphireDragonWritingSessions} />
                  <StatBadge
                    label="Current Chapter"
                    value={entry.sapphireDragonCurrentChapter?.trim() ? entry.sapphireDragonCurrentChapter : "Not set"}
                  />
                  <StatBadge label="Chapters Drafted" value={entry.sapphireDragonChaptersDrafted} />
                  <StatBadge label="Chapters Revised" value={entry.sapphireDragonChaptersRevised} />
                </div>
              </PillarCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
