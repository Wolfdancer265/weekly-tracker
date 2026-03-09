interface StatBadgeProps {
  label: string;
  value: string | number;
}

export function StatBadge({ label, value }: StatBadgeProps) {
  return (
    <div className="rounded-2xl border border-sand-200 bg-sand-50 px-3 py-2">
      <p className="text-xs uppercase tracking-wide text-ink-700">{label}</p>
      <p className="mt-1 text-lg font-medium text-ink-900">{value}</p>
    </div>
  );
}
