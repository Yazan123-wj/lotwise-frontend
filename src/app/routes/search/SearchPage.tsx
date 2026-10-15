import { useSearchParams } from 'react-router-dom'
import { CatalogueBrowser } from '@/components/products/CatalogueBrowser'
import { usePageTitle } from '@/hooks/usePageTitle'

export function SearchPage() {
  usePageTitle('Search')
  const [params] = useSearchParams()
  const query = params.get('q') ?? ''

  return (
    <CatalogueBrowser
      heading={query ? `Results for “${query}”` : 'Search'}
      introduction="Search compares your words with the sample catalogue in this browser."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Search' },
      ]}
      requireQuery
    />
  )
}
