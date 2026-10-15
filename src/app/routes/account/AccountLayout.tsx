import { Link, Outlet, useLocation } from 'react-router-dom'
import { AccountNav } from '@/components/account/AccountNav'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { PageContainer } from '@/components/layout/PageContainer'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { useDemoAccount } from '@/hooks/useDemoAccount'
import { getPreviewCustomer } from '@/services/commerce'

const titles: Record<string, string> = {
  '/account': 'Overview',
  '/account/profile': 'Profile',
  '/account/addresses': 'Addresses',
  '/account/orders': 'Orders',
  '/account/sign-in': 'Sign in',
  '/account/register': 'Register',
  '/account/reset': 'Reset password',
}

export function AccountLayout() {
  const { pathname } = useLocation()
  const { preview, stopPreview } = useDemoAccount()
  const customer = getPreviewCustomer()
  const current = titles[pathname] ?? (pathname.startsWith('/account/orders/') ? 'Order' : 'Account')

  return (
    <PageContainer className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Account', to: '/account' },
          { label: current },
        ]}
      />
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">Account</h1>
        {preview ? (
          <DemoNotice>
            Signed-in preview for {customer.firstName} {customer.lastName}. No credentials were checked and no session was created.{' '}
            <button type="button" className="underline" onClick={stopPreview}>
              Leave preview
            </button>
          </DemoNotice>
        ) : (
          <DemoNotice>
            Guest checkout remains available from the cart. Sign-in on this page is a form preview only.{' '}
            <Link to="/checkout" className="underline">
              Go to checkout
            </Link>
          </DemoNotice>
        )}
      </header>
      <div className="grid items-start gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <AccountNav />
        <div>
          <Outlet />
        </div>
      </div>
    </PageContainer>
  )
}
