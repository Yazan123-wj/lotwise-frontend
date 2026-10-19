import { Menu, Search, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { BrandLockup } from '@/components/navigation/BrandLockup'
import { MobileNavigation } from '@/components/navigation/MobileNavigation'
import { useCart } from '@/hooks/useCart'
import { countForCategory, getCategories, getFeaturedProducts } from '@/services/catalog'

const suggestions = ['Vial', 'Kit', 'Reference', 'LW-01']

export function SiteHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const { itemCount, statusMessage } = useCart()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [openPath, setOpenPath] = useState(location.pathname)
  const close = useCallback(() => setOpen(false), [])
  if (openPath !== location.pathname) {
    setOpenPath(location.pathname)
    setOpen(false)
    setSearchOpen(false)
  }

  function goSearch(value: string) {
    const next = value.trim()
    setSearchOpen(false)
    navigate(next ? `/search?q=${encodeURIComponent(next)}` : '/search')
  }

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-30 border-b border-wire-line bg-white">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 px-1 text-sm font-medium text-navy"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => {
              setSearchOpen(false)
              setOpen(true)
            }}
          >
            <Menu aria-hidden="true" size={18} strokeWidth={1.75} />
            Menu
          </button>
          <div className="absolute left-1/2 -translate-x-1/2">
            <BrandLockup />
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center text-navy"
              aria-expanded={searchOpen}
              aria-label="Search the catalog"
              onClick={() => {
                setOpen(false)
                setSearchOpen((current) => !current)
              }}
            >
              <Search aria-hidden="true" size={18} strokeWidth={1.75} />
            </button>
            <Link
              to="/cart"
              className="inline-flex h-10 items-center gap-2 px-1 text-[11px] font-medium uppercase tracking-[0.16em] text-navy"
              aria-label={`Cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
            >
              <span className="hidden sm:inline">Cart</span>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-navy px-1 text-[10px] font-medium text-white">
                {itemCount}
              </span>
            </Link>
          </div>
        </div>
        {searchOpen ? (
          <div className="border-t border-wire-line bg-white">
            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
              <form
                role="search"
                className="flex items-center gap-3"
                onSubmit={(event) => {
                  event.preventDefault()
                  goSearch(query)
                }}
              >
                <label className="sr-only" htmlFor="header-search">
                  Search the catalog
                </label>
                <input
                  id="header-search"
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search the catalog"
                  className="h-12 min-w-0 flex-1 rounded-full border border-wire-line px-4 text-sm text-navy"
                />
                <button type="button" className="inline-flex h-10 w-10 items-center justify-center text-navy" onClick={() => setSearchOpen(false)}>
                  <X aria-hidden="true" size={18} />
                  <span className="sr-only">Close search</span>
                </button>
              </form>
              <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.16em] text-wire-muted">Suggested</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="rounded-full border border-wire-line px-3 py-1.5 text-sm text-navy hover:border-navy"
                    onClick={() => goSearch(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.16em] text-wire-muted">Browse by area</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {getCategories()
                  .filter((category) => category.active && category.featured)
                  .map((category) => (
                    <li key={category.id}>
                      <Link
                        to={`/categories/${category.slug}`}
                        className="flex items-center justify-between rounded-2xl border border-wire-line px-4 py-3 text-sm text-navy hover:border-navy"
                        onClick={() => setSearchOpen(false)}
                      >
                        {category.name}
                        <span className="text-xs text-wire-muted">{countForCategory(category)}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
              <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.16em] text-wire-muted">Selected records</p>
              <ul className="mt-3 divide-y divide-wire-line">
                {getFeaturedProducts()
                  .slice(0, 4)
                  .map((product) => (
                    <li key={product.id}>
                      <Link
                        to={`/products/${product.slug}`}
                        className="flex items-center justify-between py-3 text-sm text-navy hover:text-royal"
                        onClick={() => setSearchOpen(false)}
                      >
                        {product.name}
                        <span className="text-xs text-wire-muted">{product.baseSku}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ) : null}
        <p className="sr-only" aria-live="polite">
          {statusMessage}
        </p>
        <nav aria-label="Catalogue areas" className="hidden border-t border-wire-line lg:block">
          <div className="mx-auto flex min-h-11 max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-navy">
            <Link to="/shop" className="text-royal">
              All records
            </Link>
            {getCategories()
              .filter((category) => category.active && category.featured)
              .map((category) => (
                <Link key={category.id} to={`/categories/${category.slug}`} className="text-navy/70 hover:text-navy">
                  {category.name}
                  <span className="ml-1.5 text-navy/35">{countForCategory(category)}</span>
                </Link>
              ))}
            <Link to="/quality" className="ml-auto text-navy/70 hover:text-navy">
              Certificates
            </Link>
            <Link to="/about" className="text-navy/70 hover:text-navy">
              About
            </Link>
          </div>
        </nav>
      </header>
      <nav aria-label="Catalog shortcuts" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-wire-line bg-white lg:hidden">
        <button type="button" className="min-h-14 text-sm font-medium text-navy" onClick={() => setOpen(true)}>
          Menu
        </button>
        <button type="button" className="min-h-14 text-sm font-medium text-navy" onClick={() => setSearchOpen(true)}>
          Search
        </button>
        <Link to="/cart" className="flex min-h-14 items-center justify-center text-sm font-medium text-navy">
          Cart {itemCount}
        </Link>
      </nav>
      <MobileNavigation open={open} onClose={close} />
    </>
  )
}
