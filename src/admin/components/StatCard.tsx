export function StatCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <article className="border border-wire-line bg-white p-5">
      <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-wire-muted">{label}</h2>
      <p className="mt-3 text-2xl font-medium tracking-tight text-navy">{value}</p>
      <p className="mt-2 text-xs text-wire-muted">{note ?? 'Demo data'}</p>
    </article>
  )
}
