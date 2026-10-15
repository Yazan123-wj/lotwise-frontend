export function LoadingState({ label = 'Loading sample catalogue' }: { label?: string }) {
  return (
    <div className="border border-wire-line bg-white px-4 py-10 text-center" role="status">
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-1 text-xs text-wire-muted">Preview state. No request is in progress.</p>
    </div>
  )
}
