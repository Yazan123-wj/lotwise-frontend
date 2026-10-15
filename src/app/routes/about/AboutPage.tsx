import { PageContainer } from '@/components/layout/PageContainer'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getBrandPillars } from '@/services/content'

const colours = [
  { name: 'Midnight Navy', hex: '#02092E', swatch: 'bg-navy' },
  { name: 'Royal Blue', hex: '#1527BE', swatch: 'bg-royal' },
  { name: 'Sky Blue', hex: '#63A0E4', swatch: 'bg-brand-sky' },
  { name: 'Pure White', hex: '#FFFFFF', swatch: 'border border-wire-line bg-white' },
]

export function AboutPage() {
  usePageTitle('About')
  return (
    <PageContainer className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-medium tracking-tight text-navy sm:text-4xl">About LotWise Labs</h1>
        <p className="max-w-2xl text-sm text-wire-muted">
          LotWise Labs is positioned around precision, science, quality, trust, transparency, and research-focused peptide solutions. Company history and approved about copy have not been supplied, so this page keeps to that positioning.
        </p>
      </header>
      <ul className="grid gap-4 md:grid-cols-3">
        {getBrandPillars().map((pillar) => (
          <li key={pillar.title} className="border border-wire-line bg-white p-4">
            <h2 className="font-medium text-navy">{pillar.title}</h2>
            <p className="mt-2 text-sm text-wire-muted">{pillar.copy}</p>
          </li>
        ))}
      </ul>
      <section className="space-y-3">
        <h2 className="text-xl font-medium tracking-tight text-navy">Colour</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {colours.map((colour) => (
            <li key={colour.hex} className="border border-wire-line bg-white p-3 text-sm">
              <span className={`block h-12 ${colour.swatch}`} />
              <span className="mt-2 block font-medium">{colour.name}</span>
              <span className="text-wire-muted">{colour.hex}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-wire-muted">
          Satoshi is the brand typeface. The header uses a text wordmark until the official mark is placed in public/images/brand.
        </p>
      </section>
    </PageContainer>
  )
}
