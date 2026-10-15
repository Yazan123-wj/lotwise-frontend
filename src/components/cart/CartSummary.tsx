import { Link } from 'react-router-dom'
import { buttonClass } from '@/components/ui/Button'
import type { CartQuote } from '@/types'
import { formatMoney } from '@/utils/format'

export function CartSummary({ quote, showCheckout = false }: { quote: CartQuote; showCheckout?: boolean }) {
  return (
    <aside className="space-y-4 border border-wire-line bg-white p-4">
      <h2 className="text-lg font-medium text-navy">Summary</h2>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt>Subtotal</dt>
          <dd>{formatMoney(quote.subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Discount{quote.discountCode ? ` (${quote.discountCode})` : ''}</dt>
          <dd>{quote.discountAmount > 0 ? `−${formatMoney(quote.discountAmount)}` : formatMoney(0)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Shipping estimate</dt>
          <dd className="text-right">{quote.shippingLabel}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-wire-line pt-2 font-medium">
          <dt>Provisional total</dt>
          <dd>{formatMoney(quote.provisionalTotal)}</dd>
        </div>
      </dl>
      {quote.discountMessage ? <p className="text-xs text-wire-muted">{quote.discountMessage}</p> : null}
      <p className="text-xs text-wire-muted">
        This total uses sample prices in the browser. It is not server-validated and does not include shipping.
      </p>
      {showCheckout ? (
        <Link to="/checkout" className={buttonClass('primary', 'w-full')}>
          Proceed to checkout
        </Link>
      ) : null}
    </aside>
  )
}
