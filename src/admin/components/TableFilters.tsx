import type { ReactNode } from 'react'
import { fieldClass } from '@/utils/fields'

export function TableFilters({
  label,
  query,
  onQuery,
  children,
}: {
  label: string
  query: string
  onQuery: (value: string) => void
  children?: ReactNode
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
      <label className="block text-sm">
        <span className="font-medium">{label}</span>
        <input className={`${fieldClass} mt-1`} value={query} onChange={(event) => onQuery(event.target.value)} />
      </label>
      {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
    </div>
  )
}
