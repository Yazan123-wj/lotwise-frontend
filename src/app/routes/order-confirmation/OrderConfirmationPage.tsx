import { Link } from 'react-router-dom'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageContainer } from '@/components/layout/PageContainer'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { usePageTitle } from '@/hooks/usePageTitle'
import { paymentLabel, readDemoReceipt } from '@/services/commerce'
import { formatMoney } from '@/utils/format'

export function OrderConfirmationPage() {
  usePageTitle('Order confirmation')
  const receipt = readDemoReceipt()

  return (
    <PageContainer className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Order confirmation' },
        ]}
      />
      <h1 className="text-3xl font-bold">Demonstration confirmation</h1>
      {!receipt ? (
        <EmptyState
          title="No demonstration order in this browser"
          description="Complete the checkout form to preview this page. Doing so still does not place an order."
          action={
            <Link to="/shop" className="underline-offset-2 hover:underline">
              Continue shopping
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          <DemoNotice>
            Order number {receipt.orderNumber} exists only in this browser session. Payment status: {paymentLabel(receipt.paymentStatus)}. No payment was taken and no order was placed.
          </DemoNotice>
          <section className="border border-wire-line bg-white p-4">
            <h2 className="font-bold">Order summary</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {receipt.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-4">
                  <span>
                    {item.name} · {item.sku} × {item.quantity}
                  </span>
                  <span>{formatMoney(item.unitPrice * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm">Provisional total {formatMoney(receipt.provisionalTotal)} · sample prices, shipping excluded</p>
          </section>
          <section className="border border-wire-line bg-white p-4 text-sm">
            <h2 className="font-bold">Shipping information</h2>
            <p className="mt-2">{receipt.customerName}</p>
            <p>{receipt.email}</p>
            <p>{receipt.phone}</p>
            <p className="mt-2">
              {receipt.shippingAddress.line1}
              {receipt.shippingAddress.line2 ? `, ${receipt.shippingAddress.line2}` : ''}
              <br />
              {receipt.shippingAddress.city}, {receipt.shippingAddress.region} {receipt.shippingAddress.postalCode}
              <br />
              {receipt.shippingAddress.country}
            </p>
            <p className="mt-2">{receipt.shippingMethodLabel}</p>
          </section>
          <section className="border border-wire-line bg-white p-4 text-sm">
            <h2 className="font-bold">Payment status</h2>
            <p className="mt-2">{paymentLabel(receipt.paymentStatus)}. A payment provider is not connected.</p>
          </section>
          <Link to="/shop" className="inline-flex min-h-11 items-center border border-wire-ink px-4 text-sm">
            Continue shopping
          </Link>
        </div>
      )}
    </PageContainer>
  )
}
