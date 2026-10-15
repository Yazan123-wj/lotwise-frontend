import type { SortOption } from '@/types'

export function SortSelector({ value, onChange }: { value: SortOption; onChange: (value: SortOption) => void }) {
  return (
    <label className="flex h-11 items-center gap-3 text-sm text-navy">
      <span className="shrink-0 font-medium">Sort</span>
      <select
        className="h-11 min-w-0 flex-1 border border-wire-line bg-white px-3 text-sm text-navy sm:w-56 sm:flex-none"
        value={value}
        onChange={(event) => onChange(event.target.value as SortOption)}
      >
        <option value="featured">Featured</option>
        <option value="name-asc">Name, A to Z</option>
        <option value="price-asc">Sample price, low to high</option>
        <option value="price-desc">Sample price, high to low</option>
      </select>
    </label>
  )
}
