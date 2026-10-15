import type { Availability } from '@/types'
import { cx } from '@/utils/cx'

const labels: Record<Availability, string> = {
  'in-stock': 'In stock',
  'low-stock': 'Low stock',
  'out-of-stock': 'Out of stock',
}

export function StockStatus({ status }: { status: Availability }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-wire-muted">
      <span
        aria-hidden="true"
        className={cx(
          'size-1.5 rounded-full',
          status === 'in-stock' && 'bg-royal',
          status === 'low-stock' && 'bg-brand-sky',
          status === 'out-of-stock' && 'bg-navy/25',
        )}
      />
      {labels[status]}
    </span>
  )
}
