import type { ReactNode } from 'react'
import { EmptyState } from '@/components/feedback/EmptyState'

export type TableColumn<T> = {
  id: string
  header: string
  cell: (row: T) => ReactNode
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  emptyLabel,
}: {
  columns: TableColumn<T>[]
  rows: T[]
  getRowId: (row: T) => string
  emptyLabel: string
}) {
  if (rows.length === 0) {
    return <EmptyState title="Nothing to show" description={emptyLabel} />
  }

  return (
    <div className="overflow-x-auto border border-wire-line bg-white">
      <p className="px-3 py-2 text-xs text-wire-muted md:hidden">Scroll horizontally to see every column.</p>
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-wire-line bg-wire-bg">
            {columns.map((column) => (
              <th key={column.id} scope="col" className="px-3 py-3 text-[11px] font-medium uppercase tracking-[0.12em] text-wire-muted">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowId(row)} className="border-b border-wire-line align-top last:border-b-0">
              {columns.map((column) => (
                <td key={column.id} className="px-3 py-2">
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
