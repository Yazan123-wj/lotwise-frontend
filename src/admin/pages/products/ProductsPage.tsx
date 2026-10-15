import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminPageHeader } from '@/admin/components/AdminPageHeader'
import { DataTable } from '@/admin/components/DataTable'
import { DemoFlash } from '@/admin/components/DemoFlash'
import { StatusBadge } from '@/admin/components/StatusBadge'
import { TableFilters } from '@/admin/components/TableFilters'
import { ConfirmationDialog } from '@/components/feedback/ConfirmationDialog'
import { buttonClass } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { usePageTitle } from '@/hooks/usePageTitle'
import { categoryName, getProducts, lowestPrice, productAvailability } from '@/services/catalog'
import type { Product } from '@/types'
import { formatMoney } from '@/utils/format'

const PAGE_SIZE = 4

export function ProductsPage() {
  usePageTitle('Products')
  const [products, setProducts] = useState<Product[]>(() => getProducts())
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pending, setPending] = useState<Product | null>(null)
  const [notice, setNotice] = useState('')

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase()
    return products.filter((product) => {
      if (!text) return true
      return `${product.name} ${product.baseSku} ${product.categorySlug}`.toLowerCase().includes(text)
    })
  }, [products, query])
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Products"
        description="Sample catalogue records. Deleting one removes it from this view until refresh."
        crumbs={[{ label: 'Products' }]}
        actions={
          <Link to="/admin/products/new" className={buttonClass()}>
            Add product
          </Link>
        }
      />
      <DemoFlash />
      {notice ? <p role="status" className="text-sm">{notice}</p> : null}
      <TableFilters
        label="Search products"
        query={query}
        onQuery={(value) => {
          setQuery(value)
          setPage(1)
        }}
      />
      <DataTable
        rows={visible}
        getRowId={(product) => product.id}
        emptyLabel="No sample products match that search."
        columns={[
          { id: 'name', header: 'Product', cell: (product) => product.name },
          { id: 'sku', header: 'SKU', cell: (product) => product.baseSku },
          { id: 'category', header: 'Category', cell: (product) => categoryName(product.categorySlug) },
          { id: 'price', header: 'Sample price', cell: (product) => formatMoney(lowestPrice(product)) },
          { id: 'stock', header: 'Availability', cell: (product) => <StatusBadge>{productAvailability(product)}</StatusBadge> },
          { id: 'visible', header: 'Visibility', cell: (product) => (product.visible ? 'Visible' : 'Hidden') },
          {
            id: 'featured',
            header: 'Featured',
            cell: (product) => (product.featured ? 'Featured' : 'Standard'),
          },
          {
            id: 'actions',
            header: 'Actions',
            cell: (product) => (
              <div className="flex flex-wrap gap-2">
                <Link to={`/admin/products/${product.id}`} className="underline">
                  Edit
                </Link>
                <button type="button" className="underline" onClick={() => setPending(product)}>
                  Delete
                </button>
              </div>
            ),
          },
        ]}
      />
      <Pagination page={currentPage} pageCount={pageCount} onPage={setPage} />
      <ConfirmationDialog
        open={Boolean(pending)}
        title="Remove this product from the view?"
        description="This only hides the sample row in this browser view. Refresh brings it back. Nothing is deleted on a server."
        confirmLabel="Remove from view"
        onClose={() => setPending(null)}
        onConfirm={() => {
          if (!pending) return
          setProducts((current) => current.filter((product) => product.id !== pending.id))
          setNotice(`${pending.name} was removed from this view only.`)
        }}
      />
    </div>
  )
}
