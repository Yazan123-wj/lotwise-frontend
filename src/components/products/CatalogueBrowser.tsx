import { useMemo, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { SearchBar } from '@/components/navigation/SearchBar'
import { ProductFilters } from '@/components/products/ProductFilters'
import { ProductGrid } from '@/components/products/ProductGrid'
import { SortSelector } from '@/components/products/SortSelector'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { CATALOGUE_PAGE_SIZE, getCategories, queryProducts } from '@/services/catalog'
import type { AvailabilityFilter, Crumb, SortOption } from '@/types'

function parseSort(value: string | null): SortOption {
  if (value === 'name-asc' || value === 'price-asc' || value === 'price-desc' || value === 'featured') return value
  return 'featured'
}

function parseAvailability(value: string | null): AvailabilityFilter {
  if (value === 'in-stock' || value === 'out-of-stock') return value
  return 'all'
}

export function CatalogueBrowser({
  heading,
  introduction,
  breadcrumbs,
  lockedCategorySlug,
  banner,
  requireQuery = false,
}: {
  heading: string
  introduction?: string
  breadcrumbs: Crumb[]
  lockedCategorySlug?: string
  banner?: ReactNode
  requireQuery?: boolean
}) {
  const [params, setParams] = useSearchParams()
  const [preview, setPreview] = useState<'ready' | 'loading' | 'error'>('ready')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const text = params.get('q') ?? ''
  const sort = parseSort(params.get('sort'))
  const availability = parseAvailability(params.get('availability'))
  const categoryKey = lockedCategorySlug ?? params.get('category') ?? ''
  const categorySlugs = useMemo(() => categoryKey.split(',').filter(Boolean), [categoryKey])
  const requestedPage = Number(params.get('page') ?? '1')

  const results = useMemo(() => {
    if (requireQuery && !text.trim()) return []
    return queryProducts({ text, categorySlugs, availability, sort })
  }, [availability, categorySlugs, requireQuery, sort, text])

  const pageCount = Math.max(1, Math.ceil(results.length / CATALOGUE_PAGE_SIZE))
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, pageCount) : 1
  const visible = results.slice((page - 1) * CATALOGUE_PAGE_SIZE, page * CATALOGUE_PAGE_SIZE)
  const awaitingQuery = requireQuery && !text.trim()

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

  function toggleCategory(slug: string) {
    const next = categorySlugs.includes(slug) ? categorySlugs.filter((item) => item !== slug) : [...categorySlugs, slug]
    update({ category: next.join(',') || null })
  }

  return (
    <PageContainer className="space-y-6">
      <Breadcrumbs items={breadcrumbs} />
      <header className="space-y-2">
        <h1 className="text-3xl font-medium tracking-tight text-navy sm:text-4xl">{heading}</h1>
        {introduction ? <p className="max-w-2xl text-sm text-wire-muted">{introduction}</p> : null}
      </header>
      {banner}
      <p className="text-sm">
        {awaitingQuery ? 'No query submitted.' : `${results.length} sample product${results.length === 1 ? '' : 's'}`}
      </p>
      <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <div className={filtersOpen ? 'block' : 'hidden lg:block'}>
        <ProductFilters
          categories={getCategories().filter((category) => category.active)}
          selected={categorySlugs}
          availability={availability}
          showCategories={!lockedCategorySlug}
          onToggleCategory={toggleCategory}
          onAvailability={(value) => update({ availability: value === 'all' ? null : value })}
        />
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 lg:hidden">
            <Button variant="secondary" onClick={() => setFiltersOpen((current) => !current)} aria-expanded={filtersOpen}>
              {filtersOpen ? 'Hide filters' : 'Filters'}
            </Button>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <SearchBar label={`Search ${heading}`} initialValue={text} onSearch={(query) => update({ q: query || null })} />
            </div>
            <SortSelector value={sort} onChange={(value) => update({ sort: value === 'featured' ? null : value })} />
          </div>
          {preview === 'loading' ? <LoadingState /> : null}
          {preview === 'error' ? (
            <ErrorState
              title="Sample catalogue unavailable"
              description="This is a preview of the error state. The sample data is still available."
              action={
                <Button variant="secondary" onClick={() => setPreview('ready')}>
                  Show results
                </Button>
              }
            />
          ) : null}
          {preview === 'ready' && awaitingQuery ? (
            <EmptyState
              title="Search the sample catalogue"
              description="Enter a word from a placeholder name, such as vial, kit, or reference."
            />
          ) : null}
          {preview === 'ready' && !awaitingQuery && results.length === 0 ? (
            <EmptyState
              title="No sample products match"
              description="Clear a filter or try another word. The catalogue itself has not changed."
            />
          ) : null}
          {preview === 'ready' && !awaitingQuery && results.length > 0 ? (
            <>
              <ProductGrid products={visible} />
              <Pagination page={page} pageCount={pageCount} onPage={(next) => update({ page: String(next) }, false)} />
            </>
          ) : null}
          <details className="text-sm text-wire-muted">
            <summary className="cursor-pointer text-navy">Preview states</summary>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => setPreview('ready')}>
                Results
              </Button>
              <Button variant="secondary" onClick={() => setPreview('loading')}>
                Loading
              </Button>
              <Button variant="secondary" onClick={() => setPreview('error')}>
                Error
              </Button>
            </div>
          </details>
        </div>
      </div>
    </PageContainer>
  )
}
