import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PageContainer } from '@/components/layout/PageContainer'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { ProductGallery } from '@/components/products/ProductGallery'
import { ProductGrid } from '@/components/products/ProductGrid'
import { QuantitySelector } from '@/components/products/QuantitySelector'
import { StockStatus } from '@/components/products/StockStatus'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/hooks/useCart'
import { usePageTitle } from '@/hooks/usePageTitle'
import { availabilityForQuantity, categoryName, getProduct, getRelatedProducts } from '@/services/catalog'
import { formatMoney } from '@/utils/format'

const infoBlocks = [
  ['Catalogue notes', 'Approved catalogue details will replace this block.'],
  [
    'Research use',
    'Research-use and purchasing eligibility copy must be supplied by LotWise Labs before publication. None is stated here.',
  ],
  ['Shipping', 'Shipping terms have not been provided. This block does not quote a rate or promise a delivery.'],
]

export function ProductPage() {
  const { slug = '' } = useParams()
  const product = getProduct(slug)
  usePageTitle(product?.name ?? 'Product')
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [variationId, setVariationId] = useState(product?.variations[0]?.id ?? '')
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState('')
  const [seenProductId, setSeenProductId] = useState(product?.id)
  if (product?.id !== seenProductId) {
    setSeenProductId(product?.id)
    setVariationId(product?.variations[0]?.id ?? '')
    setQuantity(1)
    setNote('')
  }

  if (!product) {
    return (
      <PageContainer>
        <ErrorState
          title="Sample product not found"
          description="That product is not in the sample catalogue."
          action={
            <Link to="/shop" className="underline-offset-2 hover:underline">
              Back to the shop
            </Link>
          }
        />
      </PageContainer>
    )
  }

  const variation = product.variations.find((item) => item.id === variationId) ?? product.variations[0]
  if (!variation) {
    return (
      <PageContainer>
        <ErrorState title="Sample option missing" description="This placeholder has no variations to show." />
      </PageContainer>
    )
  }

  const related = getRelatedProducts(product)

  function add(goToCheckout: boolean) {
    const ok = addItem(product!.id, variation!.id, quantity)
    if (!ok) {
      setNote('That sample option cannot be added.')
      return
    }
    if (goToCheckout) navigate('/checkout')
    else setNote('Added to the demonstration cart. Nothing was reserved.')
  }

  return (
    <PageContainer className="space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Shop', to: '/shop' },
          { label: categoryName(product.categorySlug), to: `/categories/${product.categorySlug}` },
          { label: product.name },
        ]}
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery paths={product.imagePaths} alt={product.name} />
        <div className="space-y-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-royal">{categoryName(product.categorySlug)}</p>
          <h1 className="text-3xl font-medium tracking-tight text-navy sm:text-4xl">{product.name}</h1>
          <p className="text-sm text-wire-muted">SKU {variation.sku}</p>
          <p className="text-2xl font-medium text-navy">
            {formatMoney(variation.price)} <span className="text-sm font-normal text-wire-muted">sample price</span>
          </p>
          <p className="text-sm text-wire-muted">{product.shortDescription}</p>
          <StockStatus status={availabilityForQuantity(variation.stockQuantity)} />
          <fieldset>
            <legend className="text-sm font-medium">Options</legend>
            <div className="mt-2 space-y-2">
              {product.variations.map((item) => (
                <label key={item.id} className={`flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 border bg-white px-3 text-sm ${item.id === variation.id ? 'border-royal' : 'border-wire-line'}`}>
                  <input
                    type="radio"
                    name="variation"
                    checked={item.id === variation.id}
                    onChange={() => {
                      setVariationId(item.id)
                      setQuantity(1)
                      setNote('')
                    }}
                  />
                  <span>{item.label}</span>
                  <span className="text-wire-muted">{item.sku}</span>
                  <span>{formatMoney(item.price)}</span>
                  <span className="text-wire-muted">{item.stockQuantity} in sample stock</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="space-y-2">
            <p className="text-sm font-medium" id="quantity-label">
              Quantity
            </p>
            <QuantitySelector id="product-quantity" value={Math.min(quantity, Math.max(variation.stockQuantity, 1))} max={variation.stockQuantity} onChange={setQuantity} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button size="lg" className="w-full" disabled={variation.stockQuantity < 1} onClick={() => add(false)}>
              Add to cart
            </Button>
            <Button size="lg" variant="outline" className="w-full" disabled={variation.stockQuantity < 1} onClick={() => add(true)}>
              Buy now
            </Button>
          </div>
          {note ? (
            <p role="status" className="text-sm">
              {note}
            </p>
          ) : null}
          <p className="text-sm leading-6">{product.description}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {infoBlocks.map(([title, body]) => (
          <section key={title} className="border-t border-wire-line pt-4">
            <h2 className="font-medium text-navy">{title}</h2>
            <p className="mt-2 text-sm text-wire-muted">{body}</p>
          </section>
        ))}
      </div>
      <section className="space-y-4">
        <SectionHeading title="Related products" description="Other sample records in the same category." />
        {related.length > 0 ? (
          <ProductGrid products={related} />
        ) : (
          <p className="text-sm text-wire-muted">No other sample products are in this category.</p>
        )}
      </section>
    </PageContainer>
  )
}
