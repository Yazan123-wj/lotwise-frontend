import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CatalogueImage } from '@/components/ui/CatalogueImage'
import type { ProductCategory } from '@/types'

export function CategoryCard({ category, count }: { category: ProductCategory; count: number }) {
  const label = `${count} ${count === 1 ? 'product' : 'products'}`

  return (
    <article className="h-full">
      <Link to={`/categories/${category.slug}`} className="group block h-full">
        <div className="relative aspect-[4/5] overflow-hidden bg-navy">
          <CatalogueImage
            src={category.imagePath}
            alt=""
            className="absolute inset-0 h-full transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand-sky">{label}</p>
              <h3 className="mt-2 text-2xl font-medium tracking-tight text-white">{category.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/75">{category.description}</p>
            </div>
            <span
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/35 text-white transition-colors duration-200 group-hover:border-white group-hover:bg-white group-hover:text-navy"
              aria-hidden="true"
            >
              <ArrowUpRight size={18} strokeWidth={1.75} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
