import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AdminForm } from '@/admin/components/AdminForm'
import { AdminPageHeader } from '@/admin/components/AdminPageHeader'
import { ImageUploadPlaceholder } from '@/admin/components/ImageUploadPlaceholder'
import { ErrorState } from '@/components/feedback/ErrorState'
import { FormField } from '@/components/forms/FormField'
import { Button } from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getCategories, getProductById } from '@/services/catalog'
import { fieldClass } from '@/utils/fields'
import { slugify } from '@/utils/format'

type VariationDraft = {
  key: string
  label: string
  sku: string
  price: string
  stockQuantity: string
}

type ProductDraft = {
  name: string
  slug: string
  baseSku: string
  shortDescription: string
  description: string
  categorySlug: string
  visible: boolean
  featured: boolean
  variations: VariationDraft[]
}

function emptyVariation(): VariationDraft {
  return { key: `new-${Date.now()}`, label: '', sku: '', price: '', stockQuantity: '0' }
}

function fromProduct(id: string | undefined): ProductDraft | null {
  if (!id) {
    return {
      name: '',
      slug: '',
      baseSku: '',
      shortDescription: '',
      description: '',
      categorySlug: getCategories()[0]?.slug ?? '',
      visible: true,
      featured: false,
      variations: [emptyVariation()],
    }
  }
  const product = getProductById(id)
  if (!product) return null
  return {
    name: product.name,
    slug: product.slug,
    baseSku: product.baseSku,
    shortDescription: product.shortDescription,
    description: product.description,
    categorySlug: product.categorySlug,
    visible: product.visible,
    featured: product.featured,
    variations: product.variations.map((variation) => ({
      key: variation.id,
      label: variation.label,
      sku: variation.sku,
      price: String(variation.price),
      stockQuantity: String(variation.stockQuantity),
    })),
  }
}

export function ProductFormPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const existing = productId ? getProductById(productId) : undefined
  const missing = Boolean(productId && !existing)
  usePageTitle(missing ? 'Product' : productId ? 'Edit product' : 'Add product')
  const [draft, setDraft] = useState<ProductDraft | null>(() => fromProduct(productId))
  const [errors, setErrors] = useState<string[]>([])
  const [seenProductId, setSeenProductId] = useState(productId)
  if (seenProductId !== productId) {
    setSeenProductId(productId)
    setDraft(fromProduct(productId))
    setErrors([])
  }

  if (missing || !draft) {
    return (
      <ErrorState
        title="Sample product not found"
        description="That record is not in the wireframe catalogue."
        action={
          <Link to="/admin/products" className="underline">
            Back to products
          </Link>
        }
      />
    )
  }

  function update<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current))
  }

  function submit() {
    const next: string[] = []
    if (!draft!.name.trim()) next.push('Name is required.')
    if (!draft!.baseSku.trim()) next.push('SKU is required.')
    if (draft!.variations.length === 0) next.push('Add at least one variation.')
    draft!.variations.forEach((variation, index) => {
      if (!variation.label.trim() || !variation.sku.trim()) next.push(`Variation ${index + 1} needs a label and SKU.`)
      if (Number.isNaN(Number(variation.price)) || Number(variation.price) < 0) next.push(`Variation ${index + 1} needs a sample price.`)
    })
    setErrors(next)
    if (next.length > 0) return
    navigate('/admin/products', {
      state: {
        demoMessage: productId
          ? 'The edit form was submitted in this browser only. The catalogue was not updated.'
          : 'The new product form was submitted in this browser only. No product was created.',
      },
    })
  }

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title={productId ? 'Edit product' : 'Add product'}
        description="Fields match the future catalogue model. Saving does not publish to the storefront."
        crumbs={[
          { label: 'Products', to: '/admin/products' },
          { label: productId ? 'Edit' : 'Add' },
        ]}
      />
      <AdminForm onSubmit={submit}>
        <div className="grid gap-4 lg:grid-cols-2">
          <FormField id="product-name" label="Name" required>
            <input
              value={draft.name}
              onChange={(event) => {
                const name = event.target.value
                setDraft((current) =>
                  current
                    ? { ...current, name, slug: current.slug || slugify(name) }
                    : current,
                )
              }}
            />
          </FormField>
          <FormField id="product-slug" label="Slug" required>
            <input value={draft.slug} onChange={(event) => update('slug', slugify(event.target.value))} />
          </FormField>
          <FormField id="product-sku" label="SKU" required>
            <input value={draft.baseSku} onChange={(event) => update('baseSku', event.target.value)} />
          </FormField>
          <FormField id="product-category" label="Category" required>
            <select className={fieldClass} value={draft.categorySlug} onChange={(event) => update('categorySlug', event.target.value)}>
              {getCategories().map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <FormField id="product-short" label="Short description" required>
          <textarea className="min-h-20" value={draft.shortDescription} onChange={(event) => update('shortDescription', event.target.value)} />
        </FormField>
        <FormField id="product-description" label="Description">
          <textarea className="min-h-32" value={draft.description} onChange={(event) => update('description', event.target.value)} />
        </FormField>
        <ImageUploadPlaceholder label="Product image" />
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex min-h-11 items-center gap-2">
            <input type="checkbox" checked={draft.visible} onChange={(event) => update('visible', event.target.checked)} />
            Visible in the catalogue
          </label>
          <label className="flex min-h-11 items-center gap-2">
            <input type="checkbox" checked={draft.featured} onChange={(event) => update('featured', event.target.checked)} />
            Featured
          </label>
        </div>
        <fieldset className="space-y-3">
          <legend className="font-medium">Variations</legend>
          {draft.variations.map((variation, index) => (
            <div key={variation.key} className="grid gap-2 border border-wire-line p-3 md:grid-cols-4">
              <FormField id={`var-label-${variation.key}`} label="Label" required>
                <input
                  value={variation.label}
                  onChange={(event) =>
                    update(
                      'variations',
                      draft.variations.map((item) => (item.key === variation.key ? { ...item, label: event.target.value } : item)),
                    )
                  }
                />
              </FormField>
              <FormField id={`var-sku-${variation.key}`} label="SKU" required>
                <input
                  value={variation.sku}
                  onChange={(event) =>
                    update(
                      'variations',
                      draft.variations.map((item) => (item.key === variation.key ? { ...item, sku: event.target.value } : item)),
                    )
                  }
                />
              </FormField>
              <FormField id={`var-price-${variation.key}`} label="Sample price" required>
                <input
                  inputMode="decimal"
                  value={variation.price}
                  onChange={(event) =>
                    update(
                      'variations',
                      draft.variations.map((item) => (item.key === variation.key ? { ...item, price: event.target.value } : item)),
                    )
                  }
                />
              </FormField>
              <FormField id={`var-qty-${variation.key}`} label="Quantity" required>
                <input
                  inputMode="numeric"
                  value={variation.stockQuantity}
                  onChange={(event) =>
                    update(
                      'variations',
                      draft.variations.map((item) =>
                        item.key === variation.key ? { ...item, stockQuantity: event.target.value } : item,
                      ),
                    )
                  }
                />
              </FormField>
              <Button
                variant="secondary"
                onClick={() => update('variations', draft.variations.filter((item) => item.key !== variation.key))}
                disabled={draft.variations.length === 1}
              >
                Remove variation {index + 1}
              </Button>
            </div>
          ))}
          <Button variant="secondary" onClick={() => update('variations', [...draft.variations, emptyVariation()])}>
            Add variation
          </Button>
        </fieldset>
        {errors.length > 0 ? (
          <ul className="list-disc pl-5 text-sm" role="alert">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        ) : null}
        <Button type="submit">Save demonstration</Button>
      </AdminForm>
    </div>
  )
}
