import { CatalogRecord } from '@/components/products/CatalogRecord'
import type { Product } from '@/types'

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) return null

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <CatalogRecord product={product} />
        </li>
      ))}
    </ul>
  )
}
