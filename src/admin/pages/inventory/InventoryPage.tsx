import { useMemo, useState } from 'react'
import { AdminPageHeader } from '@/admin/components/AdminPageHeader'
import { DataTable } from '@/admin/components/DataTable'
import { StatusBadge } from '@/admin/components/StatusBadge'
import { TableFilters } from '@/admin/components/TableFilters'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { Button } from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'
import { availabilityForQuantity, listInventory } from '@/services/catalog'
import type { InventoryRecord } from '@/types'

export function InventoryPage() {
  usePageTitle('Inventory')
  const [rows, setRows] = useState<InventoryRecord[]>(() => listInventory())
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')
  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase()
    return rows.filter((row) => `${row.productName} ${row.sku} ${row.variationLabel}`.toLowerCase().includes(text))
  }, [query, rows])

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Inventory"
        description="Sample stock by SKU and variation. Updates do not change the storefront."
        crumbs={[{ label: 'Inventory' }]}
      />
      {notice ? <DemoNotice>{notice}</DemoNotice> : null}
      <TableFilters label="Search SKU or product" query={query} onQuery={setQuery} />
      <DataTable
        rows={filtered}
        getRowId={(row) => row.id}
        emptyLabel="No sample inventory matches that search."
        columns={[
          { id: 'product', header: 'Product', cell: (row) => row.productName },
          { id: 'variation', header: 'Variation', cell: (row) => row.variationLabel },
          { id: 'sku', header: 'SKU', cell: (row) => row.sku },
          { id: 'status', header: 'Status', cell: (row) => <StatusBadge>{row.status}</StatusBadge> },
          {
            id: 'qty',
            header: 'Quantity',
            cell: (row) => (
              <div className="flex flex-wrap items-center gap-2">
                <label className="sr-only" htmlFor={`stock-${row.id}`}>
                  Stock for {row.sku}
                </label>
                <input
                  id={`stock-${row.id}`}
                  inputMode="numeric"
                  className="h-11 w-20 border border-wire-line px-2"
                  value={drafts[row.id] ?? String(row.stockQuantity)}
                  onChange={(event) => setDrafts((current) => ({ ...current, [row.id]: event.target.value }))}
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    const quantity = Number(drafts[row.id] ?? row.stockQuantity)
                    if (!Number.isInteger(quantity) || quantity < 0) {
                      setNotice('Enter a whole number that is zero or greater.')
                      return
                    }
                    setRows((current) =>
                      current.map((item) =>
                        item.id === row.id
                          ? { ...item, stockQuantity: quantity, status: availabilityForQuantity(quantity) }
                          : item,
                      ),
                    )
                    setNotice('Stock changed in this view only. The storefront catalogue was not updated.')
                  }}
                >
                  Update view
                </Button>
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}
