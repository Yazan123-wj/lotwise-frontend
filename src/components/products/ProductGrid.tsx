import { ProductCard } from '@/components/products/ProductCard'
import type { Product } from '@/types'
import { cx } from '@/utils/cx'

export function ProductGrid({
  products,
  className,
  columns = 3,
}: {
  products: Product[]
  className?: string
  columns?: 3 | 5
}) {
  return (
    <ul
      className={cx(
        'grid grid-cols-1 gap-5 sm:grid-cols-2',
        columns === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-3',
        className,
      )}
    >
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}
