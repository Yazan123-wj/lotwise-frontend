import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { countForCategory, getCategories } from '@/services/catalog'
import { cx } from '@/utils/cx'

const links = [
  { label: 'About', to: '/about' },
  { label: 'Certificates', to: '/quality' },
  { label: 'Referral', to: '/account/profile' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
  { label: 'Account', to: '/account' },
]

export function MobileNavigation({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  const categories = getCategories().filter((category) => category.active)

  return (
    <div className="fixed inset-0 z-40">
      <button type="button" className="absolute inset-0 bg-navy/45" aria-label="Close menu" onClick={onClose} />
      <div
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="absolute inset-y-0 left-0 flex w-[min(100%,26rem)] flex-col bg-white shadow-lg"
      >
        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-wire-muted">Catalog</p>
          <button ref={closeRef} type="button" className="inline-flex h-10 w-10 items-center justify-center text-navy" onClick={onClose}>
            <X aria-hidden="true" size={18} />
            <span className="sr-only">Close menu</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-8">
          <ul className="divide-y divide-wire-line">
            {categories.map((category) => (
              <li key={category.id}>
                <Link to={`/categories/${category.slug}`} className="flex items-start justify-between gap-4 py-4" onClick={onClose}>
                  <span>
                    <span className="block text-sm font-medium text-navy">{category.name}</span>
                    <span className="mt-1 block text-xs leading-5 text-wire-muted">{category.description}</span>
                  </span>
                  <span className="text-sm text-wire-muted">{countForCategory(category)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/shop" className="mt-2 inline-flex text-sm font-medium uppercase tracking-[0.14em] text-navy" onClick={onClose}>
            All records
          </Link>
          <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.16em] text-wire-muted">Company</p>
          <ul className="mt-2">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => cx('block py-2 text-sm text-navy', isActive && 'font-medium text-royal')}
                  onClick={onClose}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link
            to="/contact"
            className="mt-6 block rounded-2xl bg-navy px-4 py-4 text-white"
            onClick={onClose}
          >
            <span className="block text-sm font-medium">Ask about availability</span>
            <span className="mt-1 block text-xs text-white/70">Contact the team</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
