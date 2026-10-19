import { Link } from 'react-router-dom'
import { CatalogueImage } from '@/components/ui/CatalogueImage'
import { lowestPrice } from '@/services/catalog'
import type { Product } from '@/types'
import { formatMoney } from '@/utils/format'

function kindLabel(product: Product) {
  if (product.categorySlug === 'sample-kits') return 'Kit'
  if (product.categorySlug === 'reference-materials') return 'Reference'
  return 'Vial'
}

export function CatalogRecord({ product }: { product: Product }) {
  const price = lowestPrice(product)
  const from = product.variations.length > 1
  const available = product.variations.some((item) => item.stockQuantity > 0)

  return (
    <article className="group flex h-full flex-col">
      <Link
        to={`/products/${product.slug}`}
        aria-label={product.name}
        className="relative block overflow-hidden rounded-[1.35rem] bg-[#e7eef6] shadow-[0_12px_32px_rgba(2,9,46,0.06)] ring-1 ring-navy/5"
      >
        <span className="absolute top-3 left-3 z-10 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-navy/70 backdrop-blur-sm">
          {kindLabel(product)}
        </span>
        <CatalogueImage src={product.imagePaths[0]} alt="" className="aspect-[4/5] transition duration-700 group-hover:scale-[1.04]" />
      </Link>
      <div className="flex flex-1 flex-col pt-4">
        <h3 className="text-base font-medium tracking-tight text-navy">
          <Link to={`/products/${product.slug}`} className="hover:text-royal">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-navy/70">{product.baseSku}</p>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-wire-muted">Research use only</p>
        <p className="mt-4 text-sm font-medium text-navy">
          {from ? <span className="mr-1 text-xs font-normal text-wire-muted">From</span> : null}
          {formatMoney(price)}
          <span className="text-xs font-normal text-wire-muted"> / record</span>
        </p>
        <p className="mt-1 text-xs text-wire-muted">Set of 10 · {formatMoney(price * 10)}</p>
        {available ? null : <p className="mt-2 text-xs text-wire-muted">Out of stock</p>}
        <Link
          to={`/products/${product.slug}`}
          className="mt-auto inline-flex items-center gap-2 pt-5 text-[11px] font-medium uppercase tracking-[0.14em] text-navy"
        >
          View record
          <span
            aria-hidden="true"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-wire-line transition group-hover:border-navy group-hover:bg-navy group-hover:text-white"
          >
            →
          </span>
        </Link>
      </div>
    </article>
  )
}
