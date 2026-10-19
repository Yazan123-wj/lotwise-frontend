import { Link } from 'react-router-dom'
import { CatalogueImage } from '@/components/ui/CatalogueImage'
import { countForCategory, getFeaturedCategories, getProductsForCategory } from '@/services/catalog'

export function AreaBoard() {
  const areas = getFeaturedCategories()

  return (
    <section aria-labelledby="catalogue-areas">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-royal">Areas</p>
          <h2 id="catalogue-areas" className="mt-2 text-3xl font-medium tracking-tight text-navy sm:text-4xl">
            Browse by record type
          </h2>
        </div>
        <Link to="/shop" className="shrink-0 text-sm text-navy underline-offset-4 hover:underline">
          Full catalog
        </Link>
      </div>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {areas.map((category, index) => {
          const image = getProductsForCategory(category.slug)[0]?.imagePaths[0]
          const count = countForCategory(category)
          return (
            <li key={category.id}>
              <Link
                to={`/categories/${category.slug}`}
                className="group relative flex min-h-80 flex-col justify-end overflow-hidden rounded-[1.5rem] bg-navy p-6 text-white"
              >
                {image ? (
                  <CatalogueImage
                    src={image}
                    alt=""
                    className="absolute inset-0 h-full transition duration-700 group-hover:scale-105"
                  />
                ) : null}
                <span className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-transparent" />
                <span className="relative text-[11px] font-medium uppercase tracking-[0.18em] text-brand-sky">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="relative mt-2 text-3xl font-medium tracking-tight">{category.name}</span>
                <span className="relative mt-2 max-w-xs text-sm leading-6 text-white/75">{category.description}</span>
                <span className="relative mt-5 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em]">
                  {count} records
                  <span aria-hidden="true" className="transition group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}