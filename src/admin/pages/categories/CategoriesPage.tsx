import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminPageHeader } from '@/admin/components/AdminPageHeader'
import { DataTable } from '@/admin/components/DataTable'
import { DemoFlash } from '@/admin/components/DemoFlash'
import { StatusBadge } from '@/admin/components/StatusBadge'
import { ConfirmationDialog } from '@/components/feedback/ConfirmationDialog'
import { buttonClass } from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'
import { countForCategory, getCategories } from '@/services/catalog'
import type { ProductCategory } from '@/types'

export function CategoriesPage() {
  usePageTitle('Categories')
  const [categories, setCategories] = useState<ProductCategory[]>(() => getCategories())
  const [pending, setPending] = useState<ProductCategory | null>(null)
  const [notice, setNotice] = useState('')

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Categories"
        description="Sample categories, including the empty wireframe fixture."
        crumbs={[{ label: 'Categories' }]}
        actions={
          <Link to="/admin/categories/new" className={buttonClass()}>
            Add category
          </Link>
        }
      />
      <DemoFlash />
      {notice ? <p role="status" className="text-sm">{notice}</p> : null}
      <DataTable
        rows={categories}
        getRowId={(category) => category.id}
        emptyLabel="No sample categories."
        columns={[
          { id: 'name', header: 'Category', cell: (category) => category.name },
          { id: 'order', header: 'Display order', cell: (category) => category.displayOrder },
          { id: 'count', header: 'Products', cell: (category) => countForCategory(category) },
          { id: 'status', header: 'Status', cell: (category) => <StatusBadge>{category.active ? 'Active' : 'Inactive'}</StatusBadge> },
          {
            id: 'actions',
            header: 'Actions',
            cell: (category) => (
              <div className="flex gap-2">
                <Link to={`/admin/categories/${category.id}`} className="underline">Edit</Link>
                <button type="button" className="underline" onClick={() => setPending(category)}>Delete</button>
              </div>
            ),
          },
        ]}
      />
      <ConfirmationDialog
        open={Boolean(pending)}
        title="Remove this category from the view?"
        description="The sample category returns on refresh. The storefront is not changed."
        confirmLabel="Remove from view"
        onClose={() => setPending(null)}
        onConfirm={() => {
          if (!pending) return
          setCategories((current) => current.filter((category) => category.id !== pending.id))
          setNotice(`${pending.name} was removed from this view only.`)
        }}
      />
    </div>
  )
}
