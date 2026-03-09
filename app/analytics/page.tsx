import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { buildAnalyticsPoints } from "@/lib/transformers";
import { fetchAnalyticsEntries } from "@/lib/weekly-entries";

export default async function AnalyticsPage() {
  const result = await fetchAnalyticsEntries();
  const points = buildAnalyticsPoints(result.data);

  return (
    <div className="space-y-6 pb-6">
      <PageHeader
        title="Analytics"
        subtitle="Lightweight trends to support weekly reflection without clutter or pressure."
      />

      {result.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{result.error}</div>
      ) : null}

      {points.length < 2 ? (
        <EmptyState
          title="Not Enough Data Yet"
          description="Add at least two weekly entries to unlock trend charts."
          actionLabel="Complete Weekly Check-In"
          actionHref="/check-in"
        />
      ) : (
        <AnalyticsCharts data={points} />
      )}
    </div>
  );
}
