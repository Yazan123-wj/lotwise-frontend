import { Link, useParams } from 'react-router-dom'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PageContainer } from '@/components/layout/PageContainer'
import { CatalogueBrowser } from '@/components/products/CatalogueBrowser'
import { CatalogueImage } from '@/components/ui/CatalogueImage'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getCategory } from '@/services/catalog'

export function CategoryPage() {
  const { slug = '' } = useParams()
  const category = getCategory(slug)
  usePageTitle(category?.name ?? 'Category')

  if (!category) {
    return (
      <PageContainer>
        <ErrorState
          title="Category not found"
          description="That sample category is not in the wireframe."
          action={
            <Link to="/shop" className="underline-offset-2 hover:underline">
              Back to the shop
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
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Shop', to: '/shop' },
        { label: category.name },
      ]}
      banner={
        category.imagePath ? (
          <div className="min-w-0 overflow-hidden bg-[#eef3f8]">
            <CatalogueImage className="aspect-[21/9] max-h-80" src={category.imagePath} alt="" />
          </div>
        ) : undefined
      }
    />
  )
}
