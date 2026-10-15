import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AdminForm } from '@/admin/components/AdminForm'
import { AdminPageHeader } from '@/admin/components/AdminPageHeader'
import { ImageUploadPlaceholder } from '@/admin/components/ImageUploadPlaceholder'
import { ErrorState } from '@/components/feedback/ErrorState'
import { FormField } from '@/components/forms/FormField'
import { Button } from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getCategories, getProducts } from '@/services/catalog'
import { slugify } from '@/utils/format'

export function CategoryFormPage() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const existing = getCategories().find((category) => category.id === categoryId)
  const missing = Boolean(categoryId && !existing)
  usePageTitle(categoryId ? 'Edit category' : 'Add category')
  const [name, setName] = useState(existing?.name ?? '')
  const [slug, setSlug] = useState(existing?.slug ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [displayOrder, setDisplayOrder] = useState(String(existing?.displayOrder ?? getCategories().length + 1))
  const [active, setActive] = useState(existing?.active ?? true)
  const [assigned, setAssigned] = useState<string[]>(() =>
    getProducts().filter((product) => product.categorySlug === existing?.slug).map((product) => product.id),
  )
  const [error, setError] = useState('')

  if (missing) {
    return (
      <ErrorState
        title="Sample category not found"
        action={<Link to="/admin/categories" className="underline">Back to categories</Link>}
        description="That category is not in the wireframe data."
      />
    )
  }

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title={categoryId ? 'Edit category' : 'Add category'}
        description="Product assignment is visual. It does not move catalogue records."
        crumbs={[{ label: 'Categories', to: '/admin/categories' }, { label: categoryId ? 'Edit' : 'Add' }]}
      />
      <AdminForm
        onSubmit={() => {
          if (!name.trim()) {
            setError('Name is required.')
            return
          }
          navigate('/admin/categories', {
            state: { demoMessage: 'The category form was submitted in this browser only. Nothing was saved.' },
          })
        }}
      >
        <FormField id="category-name" label="Name" required error={error}>
          <input
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              if (!categoryId) setSlug(slugify(event.target.value))
            }}
          />
        </FormField>
        <FormField id="category-slug" label="Slug" required>
          <input value={slug} onChange={(event) => setSlug(slugify(event.target.value))} />
        </FormField>
        <FormField id="category-description" label="Description">
          <textarea className="min-h-28" value={description} onChange={(event) => setDescription(event.target.value)} />
        </FormField>
        <FormField id="category-order" label="Display order" required>
          <input inputMode="numeric" value={displayOrder} onChange={(event) => setDisplayOrder(event.target.value)} />
        </FormField>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />
          Active
        </label>
        <ImageUploadPlaceholder label="Category image" />
        <fieldset>
          <legend className="text-sm font-medium">Product assignment</legend>
          <div className="mt-2 space-y-2">
            {getProducts().map((product) => (
              <label key={product.id} className="flex min-h-11 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={assigned.includes(product.id)}
                  onChange={() =>
                    setAssigned((current) =>
                      current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id],
                    )
                  }
                />
                {product.name}
              </label>
            ))}
          </div>
        </fieldset>
        <Button type="submit">Save demonstration</Button>
      </AdminForm>
    </div>
  )
}
