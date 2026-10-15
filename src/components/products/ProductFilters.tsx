import type { AvailabilityFilter, ProductCategory } from '@/types'

export function ProductFilters({
  categories,
  selected,
  availability,
  showCategories,
  onToggleCategory,
  onAvailability,
}: {
  categories: ProductCategory[]
  selected: string[]
  availability: AvailabilityFilter
  showCategories: boolean
  onToggleCategory: (slug: string) => void
  onAvailability: (value: AvailabilityFilter) => void
}) {
  return (
    <div className="space-y-6 border border-wire-line bg-white p-4">
      {showCategories ? (
        <fieldset>
          <legend className="text-sm font-medium">Categories</legend>
          <div className="mt-2 space-y-2">
            {categories.map((category) => (
              <label key={category.id} className="flex min-h-11 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selected.includes(category.slug)}
                  onChange={() => onToggleCategory(category.slug)}
                />
                {category.name}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
      <fieldset>
        <legend className="text-sm font-medium">Availability</legend>
        <div className="mt-2 space-y-2">
          {(
            [
              ['all', 'All sample items'],
              ['in-stock', 'In stock'],
              ['out-of-stock', 'Out of stock'],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="radio"
                name="availability"
                checked={availability === value}
                onChange={() => onAvailability(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
