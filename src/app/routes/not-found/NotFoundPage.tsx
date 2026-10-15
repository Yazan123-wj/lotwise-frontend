import { Link } from 'react-router-dom'
import { buttonClass } from '@/components/ui/Button'
import { PageContainer } from '@/components/layout/PageContainer'
import { usePageTitle } from '@/hooks/usePageTitle'

export function NotFoundPage() {
  usePageTitle('Page not found')
  return (
    <PageContainer className="space-y-4 py-16">
      <p className="text-xs font-medium uppercase tracking-wider text-royal">LotWise Labs</p>
      <h1 className="text-3xl font-medium tracking-tight text-navy">Page not found</h1>
      <p className="max-w-md text-sm text-wire-muted">The address does not match a storefront or content page.</p>
      <div className="flex flex-wrap gap-3 text-sm">
        <Link to="/" className={buttonClass()}>
          Back to the homepage
        </Link>
        <Link to="/shop" className={buttonClass('secondary')}>
          Browse the shop
        </Link>
      </div>
    </PageContainer>
  )
}
