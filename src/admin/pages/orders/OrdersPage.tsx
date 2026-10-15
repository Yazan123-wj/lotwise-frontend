import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminPageHeader } from '@/admin/components/AdminPageHeader'
import { DataTable } from '@/admin/components/DataTable'
import { StatusBadge } from '@/admin/components/StatusBadge'
import { TableFilters } from '@/admin/components/TableFilters'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { usePageTitle } from '@/hooks/usePageTitle'
import { fulfilmentLabel, getOrders, paymentLabel } from '@/services/commerce'
import type { FulfilmentStatus, Order, PaymentStatus } from '@/types'
import { fieldClass } from '@/utils/fields'
import { formatMoney } from '@/utils/format'

const fulfilmentOptions: FulfilmentStatus[] = ['placed', 'processing', 'fulfilled', 'cancelled']
const paymentOptions: PaymentStatus[] = ['not-collected', 'placeholder-pending', 'placeholder-recorded']

export function OrdersPage() {
  usePageTitle('Orders')
  const [orders, setOrders] = useState<Order[]>(() => getOrders())
  const [query, setQuery] = useState('')
  const [fulfilment, setFulfilment] = useState('all')
  const [payment, setPayment] = useState('all')
  const [notice, setNotice] = useState('')
  const filtered = useMemo(
    () =>
      orders.filter((order) => {
        const text = query.trim().toLowerCase()
        const matchesText = !text || `${order.orderNumber} ${order.customerName} ${order.email}`.toLowerCase().includes(text)
        return matchesText && (fulfilment === 'all' || order.fulfilmentStatus === fulfilment) && (payment === 'all' || order.paymentStatus === payment)
      }),
    [fulfilment, orders, payment, query],
  )

  function patch(id: string, partial: Partial<Order>, message: string) {
    setOrders((current) => current.map((order) => (order.id === id ? { ...order, ...partial } : order)))
    setNotice(message)
  }

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Orders"
        description="Sample orders. Status changes are labels in this view, not fulfilment."
        crumbs={[{ label: 'Orders' }]}
      />
      {notice ? <DemoNotice>{notice}</DemoNotice> : null}
      <TableFilters label="Search orders" query={query} onQuery={setQuery}>
        <label className="text-sm">
          <span className="sr-only">Fulfilment</span>
          <select className={fieldClass} value={fulfilment} onChange={(event) => setFulfilment(event.target.value)}>
            <option value="all">All fulfilment</option>
            {fulfilmentOptions.map((option) => (
              <option key={option} value={option}>{fulfilmentLabel(option)}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="sr-only">Payment</span>
          <select className={fieldClass} value={payment} onChange={(event) => setPayment(event.target.value)}>
            <option value="all">All payment labels</option>
            {paymentOptions.map((option) => (
              <option key={option} value={option}>{paymentLabel(option)}</option>
            ))}
          </select>
        </label>
      </TableFilters>
      <DataTable
        rows={filtered}
        getRowId={(order) => order.id}
        emptyLabel="No sample orders match those filters."
        columns={[
          { id: 'number', header: 'Order', cell: (order) => <Link to={`/admin/orders/${order.id}`} className="underline">{order.orderNumber}</Link> },
          { id: 'customer', header: 'Customer', cell: (order) => order.customerName },
          { id: 'total', header: 'Sample total', cell: (order) => formatMoney(order.provisionalTotal) },
          {
            id: 'fulfilment',
            header: 'Fulfilment',
            cell: (order) => (
              <select
                aria-label={`Fulfilment for ${order.orderNumber}`}
                className="h-11 border border-wire-line bg-white px-2"
                value={order.fulfilmentStatus}
                onChange={(event) =>
                  patch(order.id, { fulfilmentStatus: event.target.value as FulfilmentStatus }, 'Fulfilment label changed in this view only.')
                }
              >
                {fulfilmentOptions.map((option) => (
                  <option key={option} value={option}>{fulfilmentLabel(option)}</option>
                ))}
              </select>
            ),
          },
          {
            id: 'payment',
            header: 'Payment',
            cell: (order) => (
              <select
                aria-label={`Payment label for ${order.orderNumber}`}
                className="h-11 border border-wire-line bg-white px-2"
                value={order.paymentStatus}
                onChange={(event) =>
                  patch(order.id, { paymentStatus: event.target.value as PaymentStatus }, 'Payment label changed in this view only. No payment was recorded.')
                }
              >
                {paymentOptions.map((option) => (
                  <option key={option} value={option}>{paymentLabel(option)}</option>
                ))}
              </select>
            ),
          },
          { id: 'badge', header: 'Note', cell: () => <StatusBadge tone="brand">Demo</StatusBadge> },
        ]}
      />
    </div>
  )
}
