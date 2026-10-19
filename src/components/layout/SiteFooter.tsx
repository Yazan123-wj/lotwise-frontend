import { Link } from 'react-router-dom'
import { BrandLockup } from '@/components/navigation/BrandLockup'
import { getFeaturedCategories, countForCategory } from '@/services/catalog'
import { getPolicyLinks } from '@/services/content'

const navigate = [
  { label: 'Catalog', to: '/shop' },
  { label: 'About', to: '/about' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
  { label: 'Referral', to: '/account/profile' },
  { label: 'Account', to: '/account' },
]

const quality = [
  { label: 'Certificates', to: '/quality' },
  { label: 'About', to: '/about' },
]

function LinkColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">{title}</h2>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((link) => (
          <li key={`${title}-${link.to}`}>
            <Link to={link.to} className="text-white/80 underline-offset-4 hover:text-white hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-navy text-white">
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-8 sm:px-6 md:grid-cols-3">
          {getFeaturedCategories().map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.slug}`}
              className="group flex items-end justify-between rounded-2xl border border-white/10 px-4 py-4 hover:border-brand-sky/60 hover:bg-white/5"
            >
              <span>
                <span className="block text-[11px] uppercase tracking-[0.16em] text-white/40">Area</span>
                <span className="mt-1 block text-lg font-medium">{category.name}</span>
              </span>
              <span className="text-sm text-brand-sky">
                {countForCategory(category)}
                <span className="ml-2 text-white/50 transition group-hover:text-white" aria-hidden="true">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <BrandLockup tone="light" />
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/70">
            Research catalogue for LotWise Labs. Records are listed for review.
          </p>
        </div>
        <LinkColumn title="Navigate" links={navigate} />
        <LinkColumn title="Quality" links={quality} />
        <LinkColumn title="Legal" links={getPolicyLinks()} />
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs leading-5 text-white/55 sm:px-6">
          © 2026 LotWise Labs. Catalogue records on this site are for review. They are not offered for human or veterinary use, and they are not offered to diagnose, treat, cure, or prevent any condition.
        </p>
      </div>
    </footer>
  )
}
