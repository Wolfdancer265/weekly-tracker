interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <section className="rounded-xl2 border border-sand-200 bg-white p-5 shadow-card sm:p-6">
      <header className="mb-4">
        <h2 className="font-serif text-2xl text-ink-900">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-ink-700">{subtitle}</p> : null}
      </header>
      <div className="h-[280px]">{children}</div>
    </section>
  );
}
