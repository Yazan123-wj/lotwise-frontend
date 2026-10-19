import { Hash, Layers, Package, ScrollText } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { ErrorState } from '@/components/feedback/ErrorState'
import { FormField } from '@/components/forms/FormField'
import { PageContainer } from '@/components/layout/PageContainer'
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
import { validateContact, type FieldErrors } from '@/utils/validation'

const facts = [
  { icon: Layers, label: 'Area' },
  { icon: Hash, label: 'SKU' },
  { icon: Package, label: 'Sample stock' },
  { icon: ScrollText, label: 'Use' },
] as const

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
  const [question, setQuestion] = useState({ name: '', email: '', message: '' })
  const [questionErrors, setQuestionErrors] = useState<FieldErrors>({})
  const [questionSent, setQuestionSent] = useState(false)
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
  const area = categoryName(product.categorySlug)
  const stock = availabilityForQuantity(variation.stockQuantity)
  const factValues = [area, variation.sku, String(variation.stockQuantity), 'Research use only']

  function add(goToCheckout: boolean) {
    const ok = addItem(product!.id, variation!.id, quantity)
    if (!ok) {
      setNote('That sample option cannot be added.')
      return
    }
    if (goToCheckout) navigate('/checkout')
    else setNote('Added to your cart.')
  }

  const fileRows = [
    ['Record', product.name],
    ['Area', area],
    ['Option', `${variation.label} · ${variation.sku}`],
    ['Catalogue note', product.description],
    ['Research use', 'Listed for catalogue review. Not offered for human or veterinary use.'],
    ['Shipping', 'Shipping is confirmed with the account. This page does not quote a rate.'],
  ]

  return (
    <>
      <div className="bg-white">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-14">
          <ProductGallery key={product.id} paths={product.imagePaths} alt={product.name} />
          <div className="lg:max-w-md lg:justify-self-end lg:pt-4">
            <Breadcrumbs
              items={[
                { label: 'Home', to: '/' },
                { label: 'Catalog', to: '/shop' },
                { label: area, to: `/categories/${product.categorySlug}` },
                { label: product.baseSku },
              ]}
            />
            <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.18em] text-wire-muted">{area}</p>
            <h1 className="mt-2 font-sans text-4xl font-medium tracking-[-0.03em] text-navy sm:text-5xl">{product.name}</h1>
            <p className="mt-5 font-sans text-2xl font-medium tracking-normal text-navy">
              {formatMoney(variation.price)}
              <span className="ml-2 text-sm font-normal text-wire-muted">per record</span>
            </p>
            <p className="mt-3 text-sm leading-6 text-wire-muted">{product.shortDescription}</p>

            <fieldset className="mt-8 border-t border-wire-line pt-6">
              <legend className="text-[11px] font-medium uppercase tracking-[0.16em] text-wire-muted">Option</legend>
              <div className="mt-3 grid gap-2">
                {product.variations.map((item) => {
                  const selected = item.id === variation.id
                  return (
                    <label
                      key={item.id}
                      className={`grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border px-3 py-3 text-sm ${selected ? 'border-navy bg-wire-bg' : 'border-wire-line bg-white hover:border-navy/40'}`}
                    >
                      <input
                        type="radio"
                        name="variation"
                        checked={selected}
                        onChange={() => {
                          setVariationId(item.id)
                          setQuantity(1)
                          setNote('')
                        }}
                      />
                      <span>
                        <span className="block font-medium text-navy">{item.label}</span>
                        <span className="mt-0.5 block text-xs text-wire-muted">{item.sku}</span>
                      </span>
                      <span className="text-navy">{formatMoney(item.price)}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-wire-muted" id="quantity-label">
                  Quantity
                </p>
                <div className="mt-2">
                  <QuantitySelector
                    id="product-quantity"
                    value={Math.min(quantity, Math.max(variation.stockQuantity, 1))}
                    max={variation.stockQuantity}
                    onChange={setQuantity}
                  />
                </div>
              </div>
              <StockStatus status={stock} />
            </div>

            <button
              type="button"
              className="mt-6 flex min-h-12 w-full items-center justify-center rounded-lg bg-navy text-sm font-medium text-white hover:bg-royal disabled:cursor-not-allowed disabled:opacity-40"
              disabled={variation.stockQuantity < 1}
              onClick={() => add(false)}
            >
              Add to cart
            </button>
            <button
              type="button"
              className="mt-2 flex min-h-12 w-full items-center justify-center rounded-lg border border-navy/15 text-sm font-medium text-navy hover:border-navy disabled:cursor-not-allowed disabled:opacity-40"
              disabled={variation.stockQuantity < 1}
              onClick={() => add(true)}
            >
              Buy now
            </button>
            {note ? (
              <p role="status" className="mt-3 text-sm text-navy">
                {note}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <ul className="grid border-y border-wire-line bg-white sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((fact, index) => (
          <li key={fact.label} className="flex items-center gap-3 border-wire-line px-6 py-5 not-last:border-b sm:nth-[2n]:border-b-0 lg:border-b-0 lg:not-last:border-r">
            <fact.icon aria-hidden="true" size={16} strokeWidth={1.75} className="shrink-0 text-royal" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-wire-muted">{fact.label}</p>
              <p className="mt-0.5 text-sm font-medium text-navy">{factValues[index]}</p>
            </div>
          </li>
        ))}
      </ul>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-16" aria-labelledby="record-file">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-wire-muted">On file</p>
          <h2 id="record-file" className="mt-3 font-sans text-3xl font-medium tracking-[-0.03em] text-navy sm:text-4xl">
            {product.baseSku}, documented
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-wire-muted">
            What this page keeps with the record. Test numbers and handling instructions are not published here.
          </p>
        </div>
        <dl className="border-t border-navy/10">
          {fileRows.map(([label, value]) => (
            <div key={label} className="grid gap-2 border-b border-navy/10 py-5 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-6">
              <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-wire-muted">{label}</dt>
              <dd className="text-sm leading-6 text-navy">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-t border-wire-line bg-white" aria-labelledby="sample-prices">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-16">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-wire-muted">Prices</p>
            <h2 id="sample-prices" className="mt-3 font-sans text-3xl font-medium tracking-[-0.03em] text-navy sm:text-4xl">
              Sample prices
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-wire-muted">
              Each option is a sample figure on this record. Quantity discounts are not listed.
            </p>
          </div>
          <div>
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Sample prices for {product.name}</caption>
              <thead>
                <tr className="border-b border-navy/15 text-[11px] font-medium uppercase tracking-[0.14em] text-wire-muted">
                  <th className="py-3 pr-4 font-medium">Option</th>
                  <th className="px-4 py-3 font-medium">SKU</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="py-3 pl-4 text-right font-medium">Stock</th>
                </tr>
              </thead>
              <tbody>
                {product.variations.map((item) => (
                  <tr key={item.id} className="border-b border-navy/10">
                    <th className="py-5 pr-4 font-sans text-sm font-medium text-navy" scope="row">
                      {item.label}
                      {item.id === variation.id ? <span className="mt-1 block text-[11px] font-normal tracking-[0.12em] text-royal uppercase">Selected</span> : null}
                    </th>
                    <td className="px-4 py-5 text-wire-muted">{item.sku}</td>
                    <td className="px-4 py-5 font-medium text-navy">{formatMoney(item.price)}</td>
                    <td className="py-5 pl-4 text-right text-wire-muted">{item.stockQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-16" aria-labelledby="record-question">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-wire-muted">Contact</p>
          <h2 id="record-question" className="mt-3 max-w-sm font-sans text-3xl font-medium tracking-[-0.03em] text-navy sm:text-4xl">
            A question about this record?
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-wire-muted">
            The form stays on this page. It does not send or store a message. Official contact details are still to be confirmed.
          </p>
        </div>
        <form
          className="space-y-4 rounded-2xl bg-white p-6 shadow-[0_16px_40px_rgba(2,9,46,0.06)] sm:p-8"
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            const next = validateContact(question)
            setQuestionErrors(next)
            const ok = Object.keys(next).length === 0
            setQuestionSent(ok)
            if (ok) setQuestion({ name: '', email: '', message: '' })
          }}
        >
          <FormField id="record-name" label="Name" required error={questionErrors.name}>
            <input autoComplete="name" value={question.name} onChange={(event) => setQuestion({ ...question, name: event.target.value })} className="rounded-lg" />
          </FormField>
          <FormField id="record-email" label="Email" required error={questionErrors.email}>
            <input type="email" autoComplete="email" value={question.email} onChange={(event) => setQuestion({ ...question, email: event.target.value })} className="rounded-lg" />
          </FormField>
          <FormField id="record-message" label="Message" required error={questionErrors.message}>
            <textarea
              className="min-h-28 rounded-lg"
              placeholder={`Question about ${product.name}`}
              value={question.message}
              onChange={(event) => setQuestion({ ...question, message: event.target.value })}
            />
          </FormField>
          <Button type="submit" className="rounded-lg bg-navy hover:bg-royal">
            Preview message
          </Button>
          {questionSent ? <DemoNotice>The message was not sent or stored.</DemoNotice> : null}
        </form>
      </section>

      <section className="border-t border-wire-line bg-white" aria-labelledby="related-records">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-wire-muted">Same area</p>
              <h2 id="related-records" className="mt-2 font-sans text-3xl font-medium tracking-[-0.03em] text-navy">
                Related records
              </h2>
            </div>
            <Link to={`/categories/${product.categorySlug}`} className="shrink-0 text-sm text-navy underline-offset-4 hover:underline">
              {area}
            </Link>
          </div>
          <div className="mt-10">
            {related.length > 0 ? (
              <ProductGrid products={related} />
            ) : (
              <p className="text-sm text-wire-muted">No other sample products are in this category.</p>
            )}
          </div>
        </div>
      </section>

      <div className="bg-white">
        <p className="mx-auto max-w-6xl px-4 py-8 font-sans text-[clamp(4.5rem,14vw,8.5rem)] leading-[0.8] font-black tracking-[-0.05em] text-navy uppercase sm:px-6 sm:py-12">
          Lotwise
        </p>
      </div>
    </>
  )
}
