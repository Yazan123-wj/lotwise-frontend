import { Link } from 'react-router-dom'
import { AccountGate } from '@/components/account/AccountGate'
import { usePageTitle } from '@/hooks/usePageTitle'
import { fulfilmentLabel, getOrdersForCustomer, getPreviewCustomer, paymentLabel, readDemoReceipt } from '@/services/commerce'
import { formatDate, formatMoney } from '@/utils/format'

export function OrdersPage() {
  usePageTitle('Orders')
  const customer = getPreviewCustomer()
  const orders = getOrdersForCustomer(customer.id)
  const receipt = readDemoReceipt()

  return (
    <AccountGate>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Order history</h2>
        <p className="text-sm text-wire-muted">Sample orders plus any demonstration confirmation from this browser.</p>
        <ul className="space-y-2">
          {receipt ? (
            <li className="border border-wire-line bg-white p-3 text-sm">
              <Link to={`/account/orders/${receipt.id}`} className="font-medium underline-offset-2 hover:underline">
                {receipt.orderNumber}
              </Link>
              <p>Demonstration confirmation · {paymentLabel(receipt.paymentStatus)}</p>
              <p>{formatMoney(receipt.provisionalTotal)} provisional</p>
            </li>
          ) : null}
          {orders.map((order) => (
            <li key={order.id} className="border border-wire-line bg-white p-3 text-sm">
              <Link to={`/account/orders/${order.id}`} className="font-medium underline-offset-2 hover:underline">
                {order.orderNumber}
              </Link>
              <p>
                {formatDate(order.placedAt)} · {fulfilmentLabel(order.fulfilmentStatus)} · {paymentLabel(order.paymentStatus)}
              </p>
              <p>{formatMoney(order.provisionalTotal)} sample total</p>
            </li>
          ))}
        </ul>
      </div>
    </AccountGate>
  )
}
