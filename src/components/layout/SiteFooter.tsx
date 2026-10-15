import { Link } from 'react-router-dom'
import { BrandLockup } from '@/components/navigation/BrandLockup'
import { getFooterShopLinks, getPolicyLinks, getSupportLinks } from '@/services/content'

function LinkColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-brand-sky">{title}</h2>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.to}>
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
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <BrandLockup tone="light" />
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
            Research-focused peptide solutions, presented with clarity and consistency.
          </p>
        </div>
        <LinkColumn title="Shop" links={getFooterShopLinks()} />
        <LinkColumn title="Support" links={getSupportLinks()} />
        <div>
          <LinkColumn title="Policies" links={getPolicyLinks()} />
          <h2 className="mt-8 text-[11px] font-medium uppercase tracking-[0.16em] text-brand-sky">Contact</h2>
          <ul className="mt-4 space-y-1 text-sm text-white/70">
            <li>Email: To be confirmed</li>
            <li>Phone: To be confirmed</li>
            <li>Address: To be confirmed</li>
            <li>Social profiles: To be confirmed</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-white/55 sm:px-6">
          © 2026 LotWise Labs. Company details will be published when confirmed.
        </p>
      </div>
    </footer>
  )
}
