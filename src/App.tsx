import { AppRouter } from '@/app/router/AppRouter'
import { CartProvider } from '@/hooks/useCart'
import { DemoAccountProvider } from '@/hooks/useDemoAccount'

export default function App() {
  return (
    <DemoAccountProvider>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </DemoAccountProvider>
  )
}
