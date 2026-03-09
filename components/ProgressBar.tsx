interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
}

export function ProgressBar({ value, max = 5, label }: ProgressBarProps) {
  const safeValue = Math.min(Math.max(value, 0), max);
  const percentage = (safeValue / max) * 100;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-ink-700">
        <span>{label ?? "Progress"}</span>
        <span>{safeValue}/{max}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-sand-100">
        <div className="h-full rounded-full bg-moss-500 transition-all duration-300" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
