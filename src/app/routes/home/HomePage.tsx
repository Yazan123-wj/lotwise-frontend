import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CertificateGallery } from '@/components/certificates/CertificateGallery'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { FormField } from '@/components/forms/FormField'
import { CatalogueImage } from '@/components/ui/CatalogueImage'
import { Button } from '@/components/ui/Button'
import { certificates } from '@/data/certifications'
import { usePageTitle } from '@/hooks/usePageTitle'
import {
  categoryName,
  countForCategory,
  getCategories,
  getFeaturedCategories,
  getFeaturedProducts,
  getProductsForCategory,
  lowestPrice,
  visibleProducts,
} from '@/services/catalog'
import type { Product } from '@/types'
import { formatMoney } from '@/utils/format'
import { validateContact, type FieldErrors } from '@/utils/validation'

const rail = ['Vials', 'Reference', 'Kits', 'Certificates', 'Sample prices']

const steps = [
  { n: '01', title: 'Explore', body: 'Open the catalog and filter by area.', to: '/shop', label: 'Open the catalog' },
  { n: '02', title: 'Review', body: 'Open a record and its sample options.', to: '/products/sample-vial-lw-01', label: 'Open a record' },
  { n: '03', title: 'Add', body: 'Put the record in the cart on this browser.', to: '/cart', label: 'View the cart' },
  { n: '04', title: 'Confirm', body: 'Checkout writes a demonstration receipt. It does not take payment.', to: '/checkout', label: 'Go to checkout' },
]

const pages = [
  { n: '01', title: 'Catalog', body: 'Every visible record.', to: '/shop' },
  { n: '02', title: 'Certificates', body: 'The files held with the catalogue.', to: '/quality' },
  { n: '03', title: 'About', body: 'What this catalogue is.', to: '/about' },
  { n: '04', title: 'FAQ', body: 'Short answers already on the site.', to: '/faq' },
  { n: '05', title: 'Contact', body: 'A form that stays on this site.', to: '/contact' },
]

function findRecord(code: string) {
  const query = code.trim().toLowerCase()
  if (!query) return undefined
  return (
    visibleProducts().find((product) => {
      const haystack = [product.baseSku, product.name, ...product.variations.map((item) => item.sku)].join(' ').toLowerCase()
      return haystack.includes(query)
    }) ?? null
  )
}

export function HomePage() {
  usePageTitle('')
  const featured = getFeaturedProducts()
  const lead = featured[0]
  const catalogue = visibleProducts()
  const areas = getCategories().filter((category) => category.active)
  const featuredAreas = getFeaturedCategories()
  const primaryArea = featuredAreas[0]
  const primaryImage = primaryArea ? getProductsForCategory(primaryArea.slug)[0]?.imagePaths[0] : undefined
  const [code, setCode] = useState('')
  const [match, setMatch] = useState<Product | null | undefined>(undefined)
  const [question, setQuestion] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [sent, setSent] = useState(false)

  return (
    <div>
      <section className="flex h-[calc(100svh-9.5rem)] flex-col overflow-hidden bg-[#02092E] text-white lg:h-[calc(100svh-8.8125rem)]">
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="relative z-0 flex min-h-0 flex-1 items-center px-4 sm:px-8">
            <h1 className="w-full text-center font-sans text-[clamp(4.4rem,min(16.4vw,20svh),13.5rem)] font-black leading-[0.78] tracking-[-0.055em] text-white uppercase">
              Lotwise
            </h1>
          </div>
          <img
            src="/images/hero-vial.png"
            alt="Sample vial"
            className="pointer-events-none absolute top-[42%] left-1/2 z-10 h-[68%] w-auto max-w-[34%] -translate-x-1/2 -translate-y-1/2 object-contain"
          />
          <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 pb-5 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:pb-6">
            <div className="max-w-[16rem]">
              <p className="text-base leading-6 font-medium text-white sm:text-lg">Vial records, reference lots, and kits.</p>
              <p className="mt-2 text-sm leading-6 text-white/70">Listed for review. Prices on this site are sample figures.</p>
            </div>
            <Link
              to="/shop"
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-navy hover:bg-brand-sky"
            >
              View catalog
              <span aria-hidden="true">›</span>
            </Link>
          </div>
        </div>
        <ol className="relative z-10 mx-auto flex w-full max-w-7xl shrink-0 gap-6 overflow-x-auto border-t border-white/10 px-4 py-3 sm:px-6">
          {rail.map((item, index) => (
            <li key={item} className="flex shrink-0 items-baseline gap-3 text-sm text-white/80">
              <span className="text-[11px] text-brand-sky">{String(index + 1).padStart(2, '0')}</span>
              {item}
            </li>
          ))}
        </ol>
        <div className="relative z-10 shrink-0 overflow-hidden border-t border-white/10 py-2" aria-hidden="true">
          <div className="marquee-track flex w-max">
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex gap-10 pr-10">
                {rail.map((item) => (
                  <li key={`${copy}-${item}`} className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">
                    {item}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6" aria-labelledby="browse-areas">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-royal">Start here</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h2 id="browse-areas" className="text-4xl text-navy sm:text-5xl">
            Browse by area
          </h2>
          <p className="text-sm text-wire-muted">
            {catalogue.length} records · {featuredAreas.length} areas
          </p>
          <Link to="/shop" className="text-sm text-navy underline-offset-4 hover:underline">
            Full catalog
          </Link>
        </div>
        <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {primaryArea ? (
            <Link to={`/categories/${primaryArea.slug}`} className="group relative flex min-h-80 flex-col justify-end overflow-hidden rounded-[1.5rem] bg-navy p-6 text-white">
              {primaryImage ? <CatalogueImage src={primaryImage} alt="" className="absolute inset-0 h-full transition duration-700 group-hover:scale-105" /> : null}
              <span className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
              <span className="relative text-[11px] uppercase tracking-[0.16em] text-brand-sky">
                Area 01 · {countForCategory(primaryArea)} records
              </span>
              <span className="relative mt-2 text-3xl">{primaryArea.name}</span>
              <span className="relative mt-2 max-w-sm text-sm leading-6 text-white/75">{primaryArea.description}</span>
              <span className="relative mt-6 text-[11px] uppercase tracking-[0.16em]">View collection →</span>
            </Link>
          ) : null}
          <ul className="divide-y divide-wire-line border-y border-wire-line">
            {areas.map((category) => (
              <li key={category.id}>
                <Link to={`/categories/${category.slug}`} className="flex items-center justify-between gap-4 py-4 hover:text-royal">
                  <span>
                    <span className="block text-lg text-navy">{category.name}</span>
                    <span className="mt-1 block text-sm text-wire-muted">{category.description}</span>
                  </span>
                  <span className="shrink-0 text-sm text-navy">{countForCategory(category)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-wire-line" aria-labelledby="catalogue-notes">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-royal">Catalogue</p>
            <h2 id="catalogue-notes" className="mt-3 max-w-md text-4xl text-navy sm:text-5xl">
              Built around the records.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-wire-muted">
              LotWise lists sample records for review. Names, options, and prices on these pages are catalogue figures.
            </p>
            <ol className="mt-8 space-y-6">
              <li>
                <p className="text-[11px] text-royal">01</p>
                <h3 className="mt-1 font-sans text-lg font-medium text-navy">Records</h3>
                <p className="mt-1 text-sm leading-6 text-wire-muted">Each item has a name, a code, and at least one sample option.</p>
              </li>
              <li>
                <p className="text-[11px] text-royal">02</p>
                <h3 className="mt-1 font-sans text-lg font-medium text-navy">Files</h3>
                <p className="mt-1 text-sm leading-6 text-wire-muted">Certificate images sit on the certificates page. They name the document type.</p>
              </li>
              <li>
                <p className="text-[11px] text-royal">03</p>
                <h3 className="mt-1 font-sans text-lg font-medium text-navy">Cart</h3>
                <p className="mt-1 text-sm leading-6 text-wire-muted">A record can be added here, then reviewed at checkout as a demonstration.</p>
              </li>
            </ol>
            <Link to="/about" className="mt-8 inline-flex text-sm text-navy underline-offset-4 hover:underline">
              About LotWise
            </Link>
          </div>
          {lead ? (
            <figure>
              <div className="overflow-hidden rounded-[1.5rem] bg-[#eef2f6]">
                <CatalogueImage src={lead.imagePaths[0]} alt="" className="aspect-[4/5]" />
              </div>
              <figcaption className="mt-3 text-sm text-wire-muted">
                Fig. 01 — {lead.name}
                <span className="mt-1 block text-[11px] uppercase tracking-[0.14em]">Research use only</span>
              </figcaption>
            </figure>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6" aria-labelledby="the-catalogue">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-royal">Selected records</p>
        <h2 id="the-catalogue" className="mt-3 text-4xl text-navy sm:text-5xl">
          The catalogue
        </h2>
        <ul className="mt-10 flex items-end justify-center">
          {featured.slice(0, 5).map((product, index) => (
            <li key={product.id} className={index === 0 ? '' : '-ml-6 sm:-ml-10'} style={{ zIndex: 5 - index }}>
              <Link to={`/products/${product.slug}`} aria-label={product.name} className="block w-28 overflow-hidden rounded-[1.25rem] bg-[#eef2f6] shadow-[0_16px_40px_rgba(2,9,46,0.12)] ring-1 ring-white sm:w-36">
                <CatalogueImage src={product.imagePaths[0]} alt="" className="aspect-[3/4]" />
              </Link>
            </li>
          ))}
        </ul>
        {lead ? (
          <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-[1.5rem] bg-[#eef2f6]">
              <CatalogueImage src={lead.imagePaths[0]} alt={lead.name} className="aspect-[4/5]" />
              <ul className="absolute inset-x-0 bottom-0 space-y-1 bg-gradient-to-t from-navy via-navy/75 to-transparent px-5 pt-16 pb-5 text-sm text-white">
                <li>Record name</li>
                <li>Catalogue code {lead.baseSku}</li>
                <li>Research use only</li>
                <li>Sample price</li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-royal">{categoryName(lead.categorySlug)}</p>
              <h3 className="mt-3 font-display text-5xl text-navy">{lead.name}</h3>
              <p className="mt-4 text-2xl text-navy">
                {formatMoney(lowestPrice(lead))}
                <span className="ml-2 font-sans text-sm text-wire-muted">/ record</span>
              </p>
              <p className="mt-4 max-w-md text-sm leading-6 text-wire-muted">{lead.shortDescription}</p>
              <Link to={`/products/${lead.slug}`} className="mt-6 inline-flex min-h-11 items-center rounded-full bg-navy px-5 text-sm font-medium text-white hover:bg-royal">
                View record
              </Link>
            </div>
          </div>
        ) : null}
      </section>

      <section className="bg-navy text-white" aria-labelledby="files-band">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-brand-sky">Files</p>
            <h2 id="files-band" className="mt-3 max-w-lg text-4xl sm:text-5xl">
              Held with the record.
            </h2>
            <ul className="mt-8 space-y-3 text-sm text-white/80">
              {certificates.map((certificate) => (
                <li key={certificate.id} className="flex items-center gap-3">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-sky" />
                  {certificate.title}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-md text-sm leading-6 text-white/65">
              These files name the document type. Test results are not printed on them.
            </p>
            <Link to="/quality" className="mt-8 inline-flex min-h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-navy hover:bg-brand-sky">
              Certificates
            </Link>
          </div>
          {lead ? (
            <div className="overflow-hidden rounded-[1.5rem] bg-white/5 ring-1 ring-white/10">
              <CatalogueImage src={featured[1]?.imagePaths[0] ?? lead.imagePaths[0]} alt="" className="aspect-[4/5]" />
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2" aria-labelledby="find-record">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-royal">Lookup</p>
          <h2 id="find-record" className="mt-3 text-4xl text-navy sm:text-5xl">
            Find a record.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-wire-muted">
            Enter a catalogue code, such as LW-01. This checks the records on this site. It does not look up a laboratory batch.
          </p>
          <form
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault()
              setMatch(findRecord(code))
            }}
          >
            <label className="min-w-0 flex-1">
              <span className="sr-only">Catalogue code</span>
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="LW-01"
                className="h-12 w-full rounded-full border border-wire-line bg-white px-4 text-sm text-navy"
              />
            </label>
            <Button type="submit" className="rounded-full">
              Find record
            </Button>
          </form>
          {match ? (
            <p className="mt-5 text-sm text-navy">
              {match.name} · {match.baseSku} · {formatMoney(lowestPrice(match))}{' '}
              <Link to={`/products/${match.slug}`} className="underline-offset-4 hover:underline">
                View record
              </Link>
            </p>
          ) : null}
          {match === null ? <p className="mt-5 text-sm text-navy">That code is not in the catalogue.</p> : null}
        </div>
        {lead ? (
          <div className="overflow-hidden rounded-[1.5rem] bg-[#eef2f6]">
            <CatalogueImage src={lead.imagePaths[0]} alt="" className="aspect-[4/5]" />
          </div>
        ) : null}
      </section>

      <section className="border-t border-wire-line" aria-labelledby="catalogue-steps">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-royal">How it works</p>
          <h2 id="catalogue-steps" className="mt-3 max-w-xl text-4xl text-navy sm:text-5xl">
            From the catalogue to checkout
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-wire-muted">Four steps on this site, from the list to a demonstration receipt.</p>
          <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <li key={step.n}>
                <p className="text-[11px] text-royal">{step.n}</p>
                <h3 className="mt-2 font-sans text-xl font-medium text-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-wire-muted">{step.body}</p>
                <Link to={step.to} className="mt-4 inline-flex text-sm text-navy underline-offset-4 hover:underline">
                  {step.label}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]" aria-labelledby="site-pages">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-royal">On this site</p>
          <h2 id="site-pages" className="mt-3 max-w-lg text-4xl text-navy sm:text-5xl">
            Around the catalogue.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-wire-muted">
            These are the pages already published here. A separate research library is not part of this site.
          </p>
          <ol className="mt-8 divide-y divide-wire-line border-y border-wire-line">
            {pages.map((page) => (
              <li key={page.to}>
                <Link to={page.to} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-3 py-4 hover:text-royal">
                  <span className="text-[11px] text-royal">{page.n}</span>
                  <span>
                    <span className="block text-lg text-navy">{page.title}</span>
                    <span className="mt-1 block text-sm text-wire-muted">{page.body}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
        {featured[2] ? (
          <div className="overflow-hidden rounded-[1.5rem] bg-[#eef2f6]">
            <CatalogueImage src={featured[2].imagePaths[0]} alt="" className="aspect-[4/5]" />
          </div>
        ) : null}
      </section>

      <section className="bg-navy text-white" aria-labelledby="sample-figures">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-brand-sky">Prices</p>
          <h2 id="sample-figures" className="mt-3 max-w-xl text-4xl sm:text-5xl">
            Sample figures, listed in the open.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/65">
            A product card shows the record price, and a set of ten as that price multiplied by ten. Those lines are not discount tiers.
          </p>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ['Per record', 'The price on the record.'],
              ['Set of 10', 'The same price, times ten.'],
              ['A message', 'The contact form does not send.'],
            ].map(([title, body], index) => (
              <li key={title} className="rounded-2xl border border-white/15 px-5 py-5">
                <p className="text-[11px] text-brand-sky">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 font-sans text-lg font-medium">{title}</h3>
                <p className="mt-2 text-sm text-white/65">{body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="inline-flex min-h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-navy hover:bg-brand-sky">
              View catalog
            </Link>
            <Link to="/contact" className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-5 text-sm font-medium text-white hover:border-white">
              Contact
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-start gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2" aria-labelledby="write-team">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-royal">Contact</p>
          <h2 id="write-team" className="mt-3 text-4xl text-navy sm:text-5xl">
            Write to the team
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-wire-muted">
            The form stays on this page. It does not send or store a message. Official contact details are still to be confirmed.
          </p>
        </div>
        <form
          className="space-y-4 rounded-[1.5rem] border border-wire-line bg-white p-5 sm:p-6"
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            const next = validateContact(question)
            setErrors(next)
            const ok = Object.keys(next).length === 0
            setSent(ok)
            if (ok) setQuestion({ name: '', email: '', message: '' })
          }}
        >
          <FormField id="home-name" label="Name" required error={errors.name}>
            <input autoComplete="name" value={question.name} onChange={(event) => setQuestion({ ...question, name: event.target.value })} className="rounded-xl" />
          </FormField>
          <FormField id="home-email" label="Email" required error={errors.email}>
            <input type="email" autoComplete="email" value={question.email} onChange={(event) => setQuestion({ ...question, email: event.target.value })} className="rounded-xl" />
          </FormField>
          <FormField id="home-message" label="Message" required error={errors.message}>
            <textarea className="min-h-28 rounded-xl" value={question.message} onChange={(event) => setQuestion({ ...question, message: event.target.value })} />
          </FormField>
          <Button type="submit" className="rounded-xl">
            Preview message
          </Button>
          {sent ? <DemoNotice>The message was not sent or stored.</DemoNotice> : null}
        </form>
      </section>

      <section className="border-t border-wire-line bg-white" aria-labelledby="certifications">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-royal">Certifications</p>
              <h2 id="certifications" className="mt-3 text-4xl text-navy sm:text-5xl">
                Certificates
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-6 text-wire-muted">
                The documents held with the catalogue. Open the certificates page to add an image in this browser.
              </p>
            </div>
            <Link to="/quality" className="text-sm text-navy underline-offset-4 hover:underline">
              All certificates
            </Link>
          </div>
          <div className="mt-10">
            <CertificateGallery />
          </div>
        </div>
      </section>

      <div className="border-t border-wire-line bg-white">
        <p className="mx-auto max-w-7xl px-4 py-10 font-display text-[clamp(4.5rem,14vw,9.5rem)] leading-[0.85] text-navy sm:px-6 sm:py-14">LotWise</p>
      </div>
    </div>
  )
}
