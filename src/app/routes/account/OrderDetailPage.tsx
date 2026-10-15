import { Link, useParams } from 'react-router-dom'
import { AccountGate } from '@/components/account/AccountGate'
import { ErrorState } from '@/components/feedback/ErrorState'
import { usePageTitle } from '@/hooks/usePageTitle'
import { fulfilmentLabel, getOrder, getPreviewCustomer, paymentLabel, readDemoReceipt } from '@/services/commerce'
import { formatDateTime, formatMoney } from '@/utils/format'

export function OrderDetailPage() {
  const { orderId = '' } = useParams()
  const customer = getPreviewCustomer()
  const receipt = readDemoReceipt()
  const sample = getOrder(orderId)
  const demo = receipt?.id === orderId ? receipt : null
  const order = sample?.customerId === customer.id ? sample : null
  usePageTitle(demo?.orderNumber ?? order?.orderNumber ?? 'Order')

  return (
    <AccountGate>
      {!demo && !order ? (
        <ErrorState
          title="Order not in this preview"
          description="That record is not part of the sample account or this browser’s demonstration checkout."
          action={
            <Link to="/account/orders" className="underline-offset-2 hover:underline">
              Back to orders
            </Link>
          }
        />
      ) : (
        <article className="space-y-4">
          <h2 className="text-xl font-bold">{demo?.orderNumber ?? order?.orderNumber}</h2>
          <p className="text-sm text-wire-muted">
            {demo
              ? 'Demonstration confirmation from this browser. It is not a placed order.'
              : `${order ? formatDateTime(order.placedAt) : ''} · sample record`}
          </p>
          <p className="text-sm">
            Status: {order ? fulfilmentLabel(order.fulfilmentStatus) : 'Demonstration only'} · Payment:{' '}
            {paymentLabel((demo ?? order)!.paymentStatus)}
          </p>
          <ul className="space-y-2 text-sm">
            {(demo?.items ?? order?.items ?? []).map((item) => (
              <li key={item.id} className="border border-wire-line bg-white p-3">
                {item.name} · {item.variationLabel} · {item.sku} × {item.quantity} · {formatMoney(item.unitPrice)}
              </li>
            ))}
          </ul>
          <p className="text-sm">Provisional total {formatMoney((demo ?? order)!.provisionalTotal)}</p>
          {order ? <p className="text-sm text-wire-muted">{order.note}</p> : null}
        </article>
      )}
    </AccountGate>
  )
}
