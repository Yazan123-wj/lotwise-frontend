import { Link } from 'react-router-dom'
import { countForCategory, getCategories, visibleProducts } from '@/services/catalog'
import { cx } from '@/utils/cx'

function pillClass(active: boolean) {
  return cx(
    'inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors',
    active ? 'border-navy bg-navy text-white' : 'border-wire-line bg-white text-navy hover:border-navy',
  )
}

export function AreaPills({
  activeSlug,
  onSelect,
}: {
  activeSlug?: string
  onSelect?: (slug: string | null) => void
}) {
  const categories = getCategories().filter((category) => category.active)
  const total = visibleProducts().length
  const allActive = !activeSlug

  const countClass = (active: boolean) => cx('text-xs', active ? 'text-white/65' : 'text-wire-muted')

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" aria-label="Catalogue areas">
      {onSelect ? (
        <button type="button" className={pillClass(allActive)} aria-pressed={allActive} onClick={() => onSelect(null)}>
          All records
          <span className={countClass(allActive)}>{total}</span>
        </button>
      ) : (
        <Link to="/shop" className={pillClass(allActive)} aria-current={allActive ? 'page' : undefined}>
          All records
          <span className={countClass(allActive)}>{total}</span>
        </Link>
      )}
      {categories.map((category) => {
        const active = category.slug === activeSlug
        const label = (
          <>
            {category.name}
            <span className={countClass(active)}>{countForCategory(category)}</span>
          </>
        )
        if (onSelect) {
          return (
            <button key={category.id} type="button" className={pillClass(active)} aria-pressed={active} onClick={() => onSelect(category.slug)}>
              {label}
            </button>
          )
        }
        return (
          <Link
            key={category.id}
            to={`/categories/${category.slug}`}
            className={pillClass(active)}
            aria-current={active ? 'page' : undefined}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
