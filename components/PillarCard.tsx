import { cn } from "@/lib/utils";

interface PillarCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function PillarCard({ title, description, children, className }: PillarCardProps) {
  return (
    <section className={cn("rounded-xl2 border border-sand-200 bg-white p-6 shadow-card", className)}>
      <header className="mb-4">
        <h2 className="font-serif text-2xl text-ink-900">{title}</h2>
        {description ? <p className="mt-1 text-sm text-ink-700">{description}</p> : null}
      </header>
      {children}
    </section>
  );
}
