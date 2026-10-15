import { Link } from 'react-router-dom'
import { QuantitySelector } from '@/components/products/QuantitySelector'
import { Button } from '@/components/ui/Button'
import { CatalogueImage } from '@/components/ui/CatalogueImage'
import { getProductById, getVariation } from '@/services/catalog'
import type { ResolvedCartLine } from '@/types'
import { formatMoney } from '@/utils/format'

export function CartItem({
  line,
  onQuantity,
  onRemove,
}: {
  line: ResolvedCartLine
  onQuantity: (quantity: number) => void
  onRemove: () => void
}) {
  const product = getProductById(line.productId)
  const variation = product ? getVariation(product, line.variationId) : undefined
  const max = variation?.stockQuantity ?? line.quantity

  return (
    <article className="grid gap-4 border border-wire-line bg-white p-4 sm:grid-cols-[7rem_minmax(0,1fr)]">
      <div className="overflow-hidden bg-[#eef3f8]">
        <CatalogueImage fit="contain" className="aspect-square p-2" src={line.imagePath} alt="" />
      </div>
      <div className="space-y-3">
        <div>
          <h2 className="font-bold">
            <Link to={`/products/${line.slug}`} className="underline-offset-2 hover:underline">
              {line.name}
            </Link>
          </h2>
          <p className="text-sm text-wire-muted">
            {line.variationLabel} · {line.sku}
          </p>
          <p className="text-sm text-navy">{formatMoney(line.unitPrice)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <QuantitySelector id={`qty-${line.id}`} value={line.quantity} max={max} onChange={onQuantity} />
          <Button variant="secondary" onClick={onRemove}>
            Remove
          </Button>
          <p className="text-sm">Line {formatMoney(line.lineTotal)}</p>
        </div>
      </div>
    </article>
  )
}
