import { Link } from 'react-router-dom'
import { AdminPageHeader } from '@/admin/components/AdminPageHeader'
import { DataTable } from '@/admin/components/DataTable'
import { DemoFlash } from '@/admin/components/DemoFlash'
import { StatCard } from '@/admin/components/StatCard'
import { StatusBadge } from '@/admin/components/StatusBadge'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getDashboardModel } from '@/services/admin'
import { fulfilmentLabel, paymentLabel } from '@/services/commerce'
import { formatDateTime, formatMoney } from '@/utils/format'

export function DashboardPage() {
  usePageTitle('Admin')
  const model = getDashboardModel()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description="Overview figures are calculated from the local sample files."
        crumbs={[{ label: 'Dashboard' }]}
      />
      <DemoFlash />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total orders" value={String(model.orderCount)} />
        <StatCard label="Sample sales" value={formatMoney(model.sampleSales)} note="Sum of sample order totals. Not revenue." />
        <StatCard label="Low or out of stock" value={String(model.lowStock.length)} note="Demo inventory from the sample catalogue." />
        <StatCard label="Discount codes" value={String(model.discounts.length)} note="Includes inactive sample codes." />
      </div>
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Recent orders</h2>
        <DataTable
          rows={model.recentOrders}
          getRowId={(order) => order.id}
          emptyLabel="No sample orders."
          columns={[
            { id: 'number', header: 'Order', cell: (order) => <Link to={`/admin/orders/${order.id}`}>{order.orderNumber}</Link> },
            { id: 'customer', header: 'Customer', cell: (order) => order.customerName },
            { id: 'fulfilment', header: 'Fulfilment', cell: (order) => <StatusBadge>{fulfilmentLabel(order.fulfilmentStatus)}</StatusBadge> },
            { id: 'payment', header: 'Payment', cell: (order) => paymentLabel(order.paymentStatus) },
            { id: 'total', header: 'Sample total', cell: (order) => formatMoney(order.provisionalTotal) },
          ]}
        />
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Product performance</h2>
          <DataTable
            rows={model.productPerformance}
            getRowId={(row) => row.name}
            emptyLabel="No sample units."
            columns={[
              { id: 'name', header: 'Product', cell: (row) => row.name },
              { id: 'units', header: 'Sample units', cell: (row) => row.quantity },
            ]}
          />
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Inventory status</h2>
          <ul className="space-y-2 text-sm">
            <li className="border border-wire-line bg-white p-3">In stock options: {model.inventoryCounts.inStock}</li>
            <li className="border border-wire-line bg-white p-3">Low stock options: {model.inventoryCounts.lowStock}</li>
            <li className="border border-wire-line bg-white p-3">Out of stock options: {model.inventoryCounts.outOfStock}</li>
          </ul>
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Low-stock products</h2>
        <DataTable
          rows={model.lowStock}
          getRowId={(row) => row.id}
          emptyLabel="No low-stock sample options."
          columns={[
            { id: 'product', header: 'Product', cell: (row) => row.productName },
            { id: 'sku', header: 'SKU', cell: (row) => row.sku },
            { id: 'qty', header: 'Quantity', cell: (row) => row.stockQuantity },
            { id: 'status', header: 'Status', cell: (row) => <StatusBadge>{row.status}</StatusBadge> },
          ]}
        />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Discount-code usage</h2>
        <DataTable
          rows={model.discounts}
          getRowId={(row) => row.id}
          emptyLabel="No sample codes."
          columns={[
            { id: 'code', header: 'Code', cell: (row) => row.code },
            { id: 'used', header: 'Sample uses', cell: (row) => `${row.usageCount} / ${row.usageLimit}` },
            { id: 'active', header: 'Status', cell: (row) => (row.active ? 'Active sample' : 'Inactive sample') },
          ]}
        />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Recent store activity</h2>
        <ul className="space-y-2">
          {model.activity.map((item) => (
            <li key={item.id} className="border border-wire-line bg-white p-3 text-sm">
              <span className="text-wire-muted">{formatDateTime(item.at)}</span>
              <p>{item.message}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
