import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <section className="rounded-xl2 border border-dashed border-sand-200 bg-white/70 p-8 text-center">
      <h2 className="font-serif text-2xl text-ink-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-ink-700">{description}</p>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="mt-5 inline-flex rounded-full bg-moss-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-moss-500"
        >
          {actionLabel}
        </Link>
      ) : null}
    </section>
  );
}
