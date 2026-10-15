import { Link } from 'react-router-dom'
import { AccountGate } from '@/components/account/AccountGate'
import { usePageTitle } from '@/hooks/usePageTitle'
import { fulfilmentLabel, getOrdersForCustomer, getPreviewCustomer, paymentLabel, readDemoReceipt } from '@/services/commerce'

export function OverviewPage() {
  usePageTitle('Account')
  const customer = getPreviewCustomer()
  const orders = getOrdersForCustomer(customer.id)
  const receipt = readDemoReceipt()

  return (
    <AccountGate>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Overview</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <p className="border border-wire-line bg-white p-3 text-sm">
            <span className="block text-wire-muted">Name</span>
            {customer.firstName} {customer.lastName}
          </p>
          <p className="border border-wire-line bg-white p-3 text-sm">
            <span className="block text-wire-muted">Email</span>
            {customer.email}
          </p>
          <p className="border border-wire-line bg-white p-3 text-sm">
            <span className="block text-wire-muted">Sample orders</span>
            {orders.length}
          </p>
        </div>
        <section className="space-y-2">
          <h3 className="font-bold">Recent sample orders</h3>
          <ul className="space-y-2">
            {receipt ? (
              <li className="border border-wire-line bg-white p-3 text-sm">
                <Link to={`/account/orders/${receipt.id}`} className="font-medium underline-offset-2 hover:underline">
                  {receipt.orderNumber}
                </Link>
                <p>Demonstration confirmation · {paymentLabel(receipt.paymentStatus)}</p>
              </li>
            ) : null}
            {orders.slice(0, 3).map((order) => (
              <li key={order.id} className="border border-wire-line bg-white p-3 text-sm">
                <Link to={`/account/orders/${order.id}`} className="font-medium underline-offset-2 hover:underline">
                  {order.orderNumber}
                </Link>
                <p>
                  {fulfilmentLabel(order.fulfilmentStatus)} · {paymentLabel(order.paymentStatus)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AccountGate>
  )
}
