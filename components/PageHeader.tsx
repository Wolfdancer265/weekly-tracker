import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  compact?: boolean;
}

export function AppNav() {
  const items = [
    { href: "/", label: "Dashboard" },
    { href: "/check-in", label: "Weekly Check-In" },
    { href: "/history", label: "History" },
    { href: "/analytics", label: "Analytics" }
  ];

  return (
    <nav className="mb-8 flex flex-wrap items-center gap-2 rounded-full border border-sand-200 bg-white/70 p-2 shadow-sm backdrop-blur">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-full px-4 py-2 text-sm font-medium text-ink-700 transition hover:bg-sand-100 hover:text-ink-900"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function PageHeader({ title, subtitle, actions, compact = false }: PageHeaderProps) {
  return (
    <header className={cn("mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end", compact && "mb-5")}>
      <div>
        <h1 className="font-serif text-3xl text-ink-900 sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-700">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </header>
  );
}
