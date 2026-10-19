import { useMemo, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { AreaPills } from '@/components/navigation/AreaPills'
import { ProductGrid } from '@/components/products/ProductGrid'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageContainer } from '@/components/layout/PageContainer'
import { Pagination } from '@/components/ui/Pagination'
import { CATALOGUE_PAGE_SIZE, countForCategory, getCategories, getCategory, queryProducts, visibleProducts } from '@/services/catalog'
import type { AvailabilityFilter, Crumb, SortOption } from '@/types'

function parseSort(value: string | null): SortOption {
  if (value === 'name-asc' || value === 'price-asc' || value === 'price-desc' || value === 'featured') return value
  return 'featured'
}

const fieldClass = 'h-11 w-full rounded-full border border-wire-line bg-white px-4 text-sm text-navy'

export function CatalogueBrowser({
  heading,
  introduction,
  breadcrumbs,
  lockedCategorySlug,
  banner,
  requireQuery = false,
  hideHeading = false,
}: {
  heading: string
  introduction?: string
  breadcrumbs: Crumb[]
  lockedCategorySlug?: string
  banner?: ReactNode
  requireQuery?: boolean
  hideHeading?: boolean
}) {
  const [params, setParams] = useSearchParams()
  const [draft, setDraft] = useState(params.get('q') ?? '')
  const [syncedQuery, setSyncedQuery] = useState(params.get('q') ?? '')
  const text = params.get('q') ?? ''
  if (syncedQuery !== text) {
    setSyncedQuery(text)
    setDraft(text)
  }
  const sort = parseSort(params.get('sort'))
  const kind = params.get('kind') === 'kit' || params.get('kind') === 'single' ? params.get('kind') : ''
  const availability: AvailabilityFilter = 'all'
  const categoryKey = lockedCategorySlug ?? params.get('category') ?? ''
  const categorySlugs = useMemo(() => categoryKey.split(',').filter(Boolean), [categoryKey])
  const requestedPage = Number(params.get('page') ?? '1')
  const catalogue = visibleProducts()

  const results = useMemo(() => {
    if (requireQuery && !text.trim()) return []
    return queryProducts({ text, categorySlugs, availability, sort }).filter((product) => {
      if (kind === 'kit') return product.categorySlug === 'sample-kits'
      if (kind === 'single') return product.categorySlug !== 'sample-kits'
      return true
    })
  }, [availability, categorySlugs, kind, requireQuery, sort, text])

  const pageCount = Math.max(1, Math.ceil(results.length / CATALOGUE_PAGE_SIZE))
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, pageCount) : 1
  const visible = results.slice((page - 1) * CATALOGUE_PAGE_SIZE, page * CATALOGUE_PAGE_SIZE)
  const awaitingQuery = requireQuery && !text.trim()
  const activeCategory = categorySlugs.length === 1 ? getCategory(categorySlugs[0]) : undefined
  const sectionTitle = activeCategory?.name ?? heading
  const sectionCopy = lockedCategorySlug ? undefined : (activeCategory?.description ?? introduction)
  const singleCount = catalogue.filter((product) => product.categorySlug !== 'sample-kits').length
  const kitCount = catalogue.length - singleCount
  const filtersActive = Boolean(text || kind || sort !== 'featured' || (!lockedCategorySlug && categorySlugs.length > 0))
  const Title = hideHeading ? 'h2' : 'h1'

  function update(patch: Record<string, string | null>, resetPage = true) {
    setParams((current) => {
      const next = new URLSearchParams(current)
      for (const [key, value] of Object.entries(patch)) {
        if (!value) next.delete(key)
        else next.set(key, value)
      }
      if (resetPage) next.delete('page')
      return next
    })
  }

  return (
    <PageContainer className="space-y-6 py-6 md:py-8">
      <Breadcrumbs items={breadcrumbs} />
      <AreaPills
        activeSlug={lockedCategorySlug ?? (categorySlugs.length === 1 ? categorySlugs[0] : undefined)}
        onSelect={lockedCategorySlug ? undefined : (slug) => update({ category: slug })}
      />
      {banner}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <form
          className="min-w-0 flex-1"
          role="search"
          onSubmit={(event) => {
            event.preventDefault()
            update({ q: draft.trim() || null })
          }}
        >
          <label className="sr-only" htmlFor="catalog-search">
            Search the catalog
          </label>
          <input
            id="catalog-search"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Search the catalog"
            className={fieldClass}
          />
        </form>
        {lockedCategorySlug ? null : (
          <label className="lg:w-48">
            <span className="sr-only">Area</span>
            <select
              className={fieldClass}
              value={categorySlugs[0] ?? ''}
              onChange={(event) => update({ category: event.target.value || null })}
            >
              <option value="">Area: all</option>
              {getCategories()
                .filter((category) => category.active)
                .map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name} ({countForCategory(category)})
                  </option>
                ))}
            </select>
          </label>
        )}
        <label className="lg:w-52">
          <span className="sr-only">Type</span>
          <select className={fieldClass} value={kind ?? ''} onChange={(event) => update({ kind: event.target.value || null })}>
            <option value="">Type: all</option>
            <option value="single">Single record ({singleCount})</option>
            <option value="kit">Kits ({kitCount})</option>
          </select>
        </label>
        <label className="lg:w-56">
          <span className="sr-only">Sort</span>
          <select className={fieldClass} value={sort} onChange={(event) => update({ sort: event.target.value === 'featured' ? null : event.target.value })}>
            <option value="featured">Sort: featured</option>
            <option value="name-asc">Name A–Z</option>
            <option value="price-asc">Price: low–high</option>
            <option value="price-desc">Price: high–low</option>
          </select>
        </label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-wire-muted">
        <p>{awaitingQuery ? 'Search the catalog' : `${results.length} of ${catalogue.length}`}</p>
        {filtersActive ? (
          <button
            type="button"
            className="text-sm text-navy underline-offset-4 hover:underline"
            onClick={() => {
              setDraft('')
              update({
                q: null,
                kind: null,
                sort: null,
                category: lockedCategorySlug ? null : null,
              })
            }}
          >
            Clear filters
          </button>
        ) : null}
      </div>
      <header className="space-y-2">
        <Title className="text-2xl font-medium tracking-tight text-navy sm:text-3xl">{sectionTitle}</Title>
        {sectionCopy ? <p className="max-w-2xl text-sm leading-6 text-wire-muted">{sectionCopy}</p> : null}
      </header>
      {awaitingQuery ? <EmptyState title="Search the catalog" description="Try a record name, such as vial, kit, or reference." /> : null}
      {!awaitingQuery && results.length === 0 ? (
        <EmptyState title="No records match" description="Clear a filter or try another word." />
      ) : null}
      {!awaitingQuery && results.length > 0 ? (
        <>
          <ProductGrid products={visible} />
          <Pagination page={page} pageCount={pageCount} onPage={(next) => update({ page: String(next) }, false)} />
        </>
      ) : null}
      <section className="rounded-[1.75rem] bg-navy px-6 py-10 text-white sm:px-10">
        <h2 className="text-2xl font-medium tracking-tight">Request the catalogue</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
          Share the records you want to review. Availability is confirmed with the account. This preview does not send the message to a server.
        </p>
        <Link
          to="/contact"
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-navy hover:bg-brand-sky"
        >
          Contact
        </Link>
      </section>
    </PageContainer>
  )
}
