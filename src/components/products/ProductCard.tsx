import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { CatalogueImage } from '@/components/ui/CatalogueImage'
import { useCart } from '@/hooks/useCart'
import { categoryName, lowestPrice } from '@/services/catalog'
import type { Product } from '@/types'
import { formatMoney } from '@/utils/format'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const variation = product.variations.find((item) => item.stockQuantity > 0) ?? product.variations[0]
  const from = product.variations.length > 1

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-wire-line bg-white transition duration-300 hover:-translate-y-0.5 hover:border-royal/30 hover:shadow-[0_18px_40px_rgba(2,9,46,0.08)]">
      <div className="relative overflow-hidden rounded-t-2xl bg-[#eef3f8]">
        <Link to={`/products/${product.slug}`} className="block min-w-0" tabIndex={-1} aria-hidden="true">
          <CatalogueImage
            src={product.imagePaths[0]}
            alt=""
            className="aspect-[4/3] transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </Link>
        <p className="catalogue-tag">{categoryName(product.categorySlug)}</p>
      </div>
      <div className="flex flex-1 flex-col px-4 pt-4 pb-4">
        <h3 className="text-base font-medium tracking-tight text-navy">
          <Link to={`/products/${product.slug}`} className="hover:text-royal">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-wire-muted">{product.baseSku}</p>
        <p className="mt-3 text-xs text-wire-muted">Research use only</p>
        <p className="mt-3 text-base font-medium text-navy">
          {from ? <span className="mr-1 text-xs font-normal text-wire-muted">From</span> : null}
          {formatMoney(lowestPrice(product))}
        </p>
        <Button
          className="mt-4 w-full rounded-full"
          disabled={!variation || variation.stockQuantity < 1}
          onClick={() => variation && addItem(product.id, variation.id, 1)}
        >
          {variation && variation.stockQuantity > 0 ? 'Add to cart' : 'Out of stock'}
        </Button>
      </div>
    </article>
  )
}
