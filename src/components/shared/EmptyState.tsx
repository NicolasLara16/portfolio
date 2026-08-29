export default function EmptyState({ message, hint }: { message: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-600 bg-ink-900/40 px-6 py-12 text-center">
      <p className="text-sm text-slate-400">{message}</p>
      {hint && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
