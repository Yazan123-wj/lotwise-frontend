import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AdminPageHeader } from '@/admin/components/AdminPageHeader'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { ErrorState } from '@/components/feedback/ErrorState'
import { usePageTitle } from '@/hooks/usePageTitle'
import { fulfilmentLabel, getOrder, paymentLabel } from '@/services/commerce'
import type { FulfilmentStatus, PaymentStatus } from '@/types'
import { formatDateTime, formatMoney } from '@/utils/format'

const fulfilmentOptions: FulfilmentStatus[] = ['placed', 'processing', 'fulfilled', 'cancelled']
const paymentOptions: PaymentStatus[] = ['not-collected', 'placeholder-pending', 'placeholder-recorded']

export function OrderDetailPage() {
  const { orderId = '' } = useParams()
  const source = getOrder(orderId)
  usePageTitle(source?.orderNumber ?? 'Order')
  const [fulfilment, setFulfilment] = useState<FulfilmentStatus>(source?.fulfilmentStatus ?? 'placed')
  const [payment, setPayment] = useState<PaymentStatus>(source?.paymentStatus ?? 'not-collected')
  const [notice, setNotice] = useState('')

  if (!source) {
    return (
      <ErrorState
        title="Sample order not found"
        description="That order is not in the wireframe data."
        action={<Link to="/admin/orders" className="underline">Back to orders</Link>}
      />
    )
  }

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title={source.orderNumber}
        description={source.note}
        crumbs={[{ label: 'Orders', to: '/admin/orders' }, { label: source.orderNumber }]}
      />
      {notice ? <DemoNotice>{notice}</DemoNotice> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="border border-wire-line bg-white p-4 text-sm">
          <h2 className="font-bold">Customer</h2>
          <p className="mt-2">{source.customerName}</p>
          <p>{source.email}</p>
          <p>{source.phone}</p>
          <p className="mt-2">{formatDateTime(source.placedAt)}</p>
          <h3 className="mt-4 font-bold">Shipping address</h3>
          <p>{source.shippingAddress.line1}</p>
          <p>
            {source.shippingAddress.city}, {source.shippingAddress.region} {source.shippingAddress.postalCode}
          </p>
          <p>{source.shippingAddress.country}</p>
        </section>
        <section className="space-y-3 border border-wire-line bg-white p-4 text-sm">
          <h2 className="font-bold">Status controls</h2>
          <label className="block">
            Fulfilment
            <select
              className="mt-1 h-11 w-full border border-wire-line px-2"
              value={fulfilment}
              onChange={(event) => {
                setFulfilment(event.target.value as FulfilmentStatus)
                setNotice('Fulfilment label changed on this page only.')
              }}
            >
              {fulfilmentOptions.map((option) => (
                <option key={option} value={option}>{fulfilmentLabel(option)}</option>
              ))}
            </select>
          </label>
          <label className="block">
            Payment label
            <select
              className="mt-1 h-11 w-full border border-wire-line px-2"
              value={payment}
              onChange={(event) => {
                setPayment(event.target.value as PaymentStatus)
                setNotice('Payment label changed on this page only. No payment was recorded.')
              }}
            >
              {paymentOptions.map((option) => (
                <option key={option} value={option}>{paymentLabel(option)}</option>
              ))}
            </select>
          </label>
        </section>
      </div>
      <section className="space-y-2">
        <h2 className="font-bold">Items</h2>
        <ul className="space-y-2 text-sm">
          {source.items.map((item) => (
            <li key={item.id} className="border border-wire-line bg-white p-3">
              {item.name} · {item.variationLabel} · {item.sku} × {item.quantity} · {formatMoney(item.unitPrice)}
            </li>
          ))}
        </ul>
        <p className="text-sm">
          Subtotal {formatMoney(source.subtotal)} · Discount {formatMoney(source.discountAmount)} · Provisional total {formatMoney(source.provisionalTotal)}
        </p>
      </section>
    </div>
  )
}
