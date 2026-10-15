import { Link, useParams } from 'react-router-dom'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PageContainer } from '@/components/layout/PageContainer'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getPolicy } from '@/services/content'

export function PolicyPage() {
  const { slug = '' } = useParams()
  const policy = getPolicy(slug)
  usePageTitle(policy?.title ?? 'Policy')

  if (!policy) {
    return (
      <PageContainer>
        <ErrorState
          title="Policy page not found"
          description="That policy route is not part of the wireframe."
          action={
            <Link to="/" className="underline-offset-2 hover:underline">
              Back to the homepage
            </Link>
          }
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: policy.title },
        ]}
      />
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{policy.title}</h1>
        <p className="max-w-2xl text-sm text-wire-muted">{policy.summary}</p>
      </header>
      {policy.sections.map((section) => (
        <section key={section.heading} className="border border-wire-line bg-white p-4">
          <h2 className="font-bold">{section.heading}</h2>
          <p className="mt-2 text-sm text-wire-muted">{section.body}</p>
        </section>
      ))}
    </PageContainer>
  )
}
