import { Link } from 'react-router-dom'
import { CartItem } from '@/components/cart/CartItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { DiscountCodeInput } from '@/components/cart/DiscountCodeInput'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageContainer } from '@/components/layout/PageContainer'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { useCart } from '@/hooks/useCart'
import { usePageTitle } from '@/hooks/usePageTitle'

export function CartPage() {
  usePageTitle('Cart')
  const { quote, updateQuantity, removeItem } = useCart()

  return (
    <PageContainer className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Cart' },
        ]}
      />
      <h1 className="text-3xl font-medium tracking-tight text-navy">Cart</h1>
      <DemoNotice>Items stay in this browser. Prices are sample figures and are not reserved.</DemoNotice>
      {quote.lines.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Add a placeholder product to review quantities, removal, and the summary."
          action={
            <Link to="/shop" className="underline-offset-2 hover:underline">
              Continue shopping
            </Link>
          }
        />
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-4">
            {quote.lines.map((line) => (
              <CartItem
                key={line.id}
                line={line}
                onQuantity={(quantity) => updateQuantity(line.id, quantity)}
                onRemove={() => removeItem(line.id)}
              />
            ))}
            <DiscountCodeInput />
            <Link to="/shop" className="inline-block text-sm underline-offset-2 hover:underline">
              Continue shopping
            </Link>
          </div>
          <CartSummary quote={quote} showCheckout />
        </div>
      )}
    </PageContainer>
  )
}
