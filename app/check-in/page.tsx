import { PageHeader } from "@/components/PageHeader";
import { WeeklyEntryForm } from "@/components/WeeklyEntryForm";
import { getCurrentWeekStart } from "@/lib/date-helpers";
import { fetchWeeklyEntries, getConfigStatus } from "@/lib/weekly-entries";

export default async function CheckInPage() {
  const currentWeek = getCurrentWeekStart();
  const result = await fetchWeeklyEntries();
  const config = getConfigStatus();

  return (
    <div className="space-y-6 pb-6">
      <PageHeader
        title="Weekly Check-In"
        subtitle="Capture what mattered this week, then update with one clear adjustment for next week."
      />

      {!config.configured ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{config.message}</div>
      ) : null}

      {result.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{result.error}</div>
      ) : null}

      <WeeklyEntryForm entries={result.data} currentWeek={currentWeek} />
    </div>
  );
}
