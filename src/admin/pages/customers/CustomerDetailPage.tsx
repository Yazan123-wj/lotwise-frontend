import { Link, useParams } from 'react-router-dom'
import { AdminPageHeader } from '@/admin/components/AdminPageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { usePageTitle } from '@/hooks/usePageTitle'
import { fulfilmentLabel, getCustomer, getOrdersForCustomer, paymentLabel } from '@/services/commerce'
import { formatMoney } from '@/utils/format'

export function CustomerDetailPage() {
  const { customerId = '' } = useParams()
  const customer = getCustomer(customerId)
  usePageTitle(customer ? `${customer.firstName} ${customer.lastName}` : 'Customer')

  if (!customer) {
    return (
      <ErrorState
        title="Sample customer not found"
        description="That record is not in the wireframe data."
        action={<Link to="/admin/customers" className="underline">Back to customers</Link>}
      />
    )
  }

  const orders = getOrdersForCustomer(customer.id)

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title={`${customer.firstName} ${customer.lastName}`}
        description="Sample customer profile. No account exists for this person."
        crumbs={[{ label: 'Customers', to: '/admin/customers' }, { label: customer.email }]}
      />
      <section className="border border-wire-line bg-white p-4 text-sm">
        <p>{customer.email}</p>
        <p>{customer.phone}</p>
        {customer.addresses.map((address) => (
          <p key={address.line1} className="mt-2">
            {address.line1}, {address.city}, {address.region} {address.postalCode}, {address.country}
          </p>
        ))}
      </section>
      <section className="space-y-2">
        <h2 className="font-bold">Sample orders</h2>
        <ul className="space-y-2 text-sm">
          {orders.map((order) => (
            <li key={order.id} className="border border-wire-line bg-white p-3">
              <Link to={`/admin/orders/${order.id}`} className="underline">{order.orderNumber}</Link>
              <p>
                {fulfilmentLabel(order.fulfilmentStatus)} · {paymentLabel(order.paymentStatus)} · {formatMoney(order.provisionalTotal)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
