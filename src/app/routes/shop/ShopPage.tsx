import { CatalogueBrowser } from '@/components/products/CatalogueBrowser'
import { usePageTitle } from '@/hooks/usePageTitle'

export function ShopPage() {
  usePageTitle('Shop')
  return (
    <CatalogueBrowser
      heading="Shop"
      introduction="Sample catalogue for LotWise Labs. These records are placeholders, not verified products."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Shop' },
      ]}
    />
  )
}
