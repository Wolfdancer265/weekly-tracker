const ONE_DAY = 24 * 60 * 60 * 1000;

export function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getWeekStartDate(date = new Date()): Date {
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utc.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  return new Date(utc.getTime() + diffToMonday * ONE_DAY);
}

export function getCurrentWeekStart(): string {
  return toDateInputValue(getWeekStartDate());
}

export function normalizeWeekOfDate(input: string): string {
  if (!input) {
    return getCurrentWeekStart();
  }

  const source = new Date(`${input}T00:00:00.000Z`);
  if (Number.isNaN(source.getTime())) {
    return getCurrentWeekStart();
  }

  return toDateInputValue(getWeekStartDate(source));
}

export function formatLongDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

export function formatWeekLabel(isoDate: string): string {
  return `Week of ${formatLongDate(isoDate)}`;
}
