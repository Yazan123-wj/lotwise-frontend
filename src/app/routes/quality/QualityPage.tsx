import { CertificateGallery } from '@/components/certificates/CertificateGallery'
import { PageContainer } from '@/components/layout/PageContainer'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { usePageTitle } from '@/hooks/usePageTitle'

export function QualityPage() {
  usePageTitle('Certificates')

  return (
    <PageContainer className="space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Certificates' },
        ]}
      />
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-wire-muted">Certifications</p>
        <h1 className="mt-2 text-4xl font-medium tracking-tight text-navy">Certificates</h1>
      </header>
      <CertificateGallery allowAdd />
    </PageContainer>
  )
}
