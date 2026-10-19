import { CatalogHero } from '@/components/home/CatalogHero'
import { CatalogueBrowser } from '@/components/products/CatalogueBrowser'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getFeaturedCategories, getFeaturedProducts, visibleProducts } from '@/services/catalog'

export function ShopPage() {
  usePageTitle('Catalog')
  const catalogue = visibleProducts()
  const records = catalogue.length
  const areas = getFeaturedCategories().length

  return (
    <CatalogueBrowser
      heading="All records"
      hideHeading
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Catalog' },
      ]}
      banner={
        <CatalogHero
          heading="h1"
          eyebrow={`${records} records · ${areas} areas`}
          title="LotWise"
          subtitle="Research catalog"
          copy="Filter by area or type, then open a record. Prices and option labels are sample figures."
          images={getFeaturedProducts().slice(0, 3).map((product) => product.imagePaths[0])}
          figures={[
            { label: 'Records', value: String(records).padStart(2, '0') },
            { label: 'Areas', value: String(areas).padStart(2, '0') },
            { label: 'On this page', value: 'All' },
          ]}
        />
      }
    />
  )
}
