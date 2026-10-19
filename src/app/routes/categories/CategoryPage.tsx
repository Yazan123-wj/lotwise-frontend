import { Link, useParams } from 'react-router-dom'
import { CatalogHero } from '@/components/home/CatalogHero'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PageContainer } from '@/components/layout/PageContainer'
import { CatalogueBrowser } from '@/components/products/CatalogueBrowser'
import { usePageTitle } from '@/hooks/usePageTitle'
import { countForCategory, getCategory, getProductsForCategory } from '@/services/catalog'

export function CategoryPage() {
  const { slug = '' } = useParams()
  const category = getCategory(slug)
  usePageTitle(category?.name ?? 'Category')

  if (!category) {
    return (
      <PageContainer>
        <ErrorState
          title="Category not found"
          description="That category is not in the catalogue."
          action={
            <Link to="/shop" className="underline-offset-2 hover:underline">
              Back to the catalog
            </Link>
          }
        />
      </PageContainer>
    )
  }

  return (
    <CatalogueBrowser
      heading={category.name}
      introduction={category.description}
      lockedCategorySlug={category.slug}
      hideHeading
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Catalog', to: '/shop' },
        { label: category.name },
      ]}
      banner={
        <CatalogHero
          heading="h1"
          eyebrow={`${countForCategory(category)} records`}
          title="LotWise"
          subtitle={category.name}
          copy={category.description}
          images={getProductsForCategory(category.slug)
            .slice(0, 3)
            .map((product) => product.imagePaths[0])}
          figures={[
            { label: 'Records', value: String(countForCategory(category)).padStart(2, '0') },
            { label: 'Area', value: category.name },
          ]}
        />
      }
    />
  )
}
