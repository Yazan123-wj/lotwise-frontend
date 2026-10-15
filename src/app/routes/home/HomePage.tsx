import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CategoryCard } from '@/components/categories/CategoryCard'
import { NewsletterForm } from '@/components/home/NewsletterForm'
import { HeroSwiper } from '@/components/home/HeroSwiper'
import { PageContainer } from '@/components/layout/PageContainer'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { ProductGrid } from '@/components/products/ProductGrid'
import { CatalogueImage } from '@/components/ui/CatalogueImage'
import { usePageTitle } from '@/hooks/usePageTitle'
import { countForCategory, getFeaturedCategories, getFeaturedProducts, getProductsForCategory } from '@/services/catalog'
import { getBrandPillars, getQualitySection, getSecondaryBanner } from '@/services/content'

export function HomePage() {
  usePageTitle('')
  const banner = getSecondaryBanner()
  const quality = getQualitySection()
  const kits = getProductsForCategory('sample-kits')

  return (
    <>
    <HeroSwiper />
    <PageContainer className="space-y-14">
      <section className="space-y-4" aria-labelledby="featured-categories">
        <SectionHeading
          id="featured-categories"
          title="Featured categories"
          description="Sample groups from the catalogue. Approved category copy will replace these descriptions."
        />
        <ul className="grid gap-5 md:grid-cols-3">
          {getFeaturedCategories().map((category) => (
            <li key={category.id}>
              <CategoryCard category={category} count={countForCategory(category)} />
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4" aria-labelledby="featured-products">
        <SectionHeading
          id="featured-products"
          title="Featured products"
          description="A selection of catalogue records with sample prices."
          action={
            <Link to="/shop" className="text-sm text-royal underline-offset-4 hover:underline">
              View the catalogue
            </Link>
          }
        />
        <ProductGrid products={getFeaturedProducts()} columns={5} />
      </section>

      {banner ? (
        <section className="relative min-h-[24rem] overflow-hidden bg-navy text-white sm:min-h-[28rem]" aria-labelledby="secondary-banner">
          <CatalogueImage className="absolute inset-0 h-full object-[center_40%]" src={banner.mediaPath} alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/20 sm:bg-gradient-to-r sm:from-navy sm:via-navy/80 sm:to-transparent" />
          <div className="relative z-10 flex min-h-[24rem] max-w-xl flex-col justify-end px-6 py-10 sm:min-h-[28rem] sm:justify-center sm:px-10 lg:px-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-brand-sky">Sample kits</p>
            <h2 id="secondary-banner" className="mt-4 text-4xl font-medium tracking-tight sm:text-5xl">
              {banner.heading}
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-white/80">{banner.supportingCopy}</p>
            <div className="mt-8">
              <Link
                to={banner.ctaDestination}
                className="inline-flex min-h-11 items-center gap-2 bg-white px-5 text-sm font-medium text-navy transition-colors hover:bg-brand-sky"
              >
                {banner.ctaLabel}
                <ArrowRight aria-hidden="true" size={16} strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="space-y-6" aria-labelledby="brand-intro">
        <SectionHeading
          id="brand-intro"
          title="Precision, quality, and transparency"
          description="A research-focused peptide brand. This introduction stays within approved positioning."
        />
        <ul className="grid gap-4 md:grid-cols-3">
          {getBrandPillars().map((pillar, index) => (
            <li
              key={pillar.title}
              className="group border border-wire-line bg-white p-6 transition-colors duration-300 hover:border-navy hover:bg-navy"
            >
              <p className="text-[11px] font-medium tracking-[0.18em] text-royal transition-colors duration-300 group-hover:text-brand-sky">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-4 text-2xl font-medium tracking-tight text-navy transition-colors duration-300 group-hover:text-white">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-wire-muted transition-colors duration-300 group-hover:text-white/75">
                {pillar.copy}
              </p>
            </li>
          ))}
        </ul>
        <div className="max-w-3xl pt-2">
          <h3 id="quality-info" className="text-[11px] font-medium uppercase tracking-[0.18em] text-royal">
            {quality.title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-wire-muted">{quality.body}</p>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="sample-kits">
        <SectionHeading
          id="sample-kits"
          title="Sample kits"
          description="Kits and collections from the sample catalogue."
          action={
            <Link to="/categories/sample-kits" className="text-sm text-royal underline-offset-4 hover:underline">
              View the category
            </Link>
          }
        />
        <ProductGrid products={kits} />
      </section>

      <section aria-labelledby="newsletter">
        <NewsletterForm />
      </section>
    </PageContainer>
    </>
  )
}
