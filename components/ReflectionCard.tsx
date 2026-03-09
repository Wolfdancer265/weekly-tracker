interface ReflectionCardProps {
  title: string;
  prompt: string;
  value?: string;
}

export function ReflectionCard({ title, prompt, value }: ReflectionCardProps) {
  return (
    <article className="rounded-2xl border border-sand-200 bg-sand-50/70 p-4">
      <h3 className="font-medium text-ink-900">{title}</h3>
      <p className="mt-1 text-xs uppercase tracking-wide text-ink-700">{prompt}</p>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-900">{value || "No reflection captured yet."}</p>
    </article>
  );
}
