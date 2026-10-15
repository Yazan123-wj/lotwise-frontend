import { Menu, ShoppingBag, User } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { BrandLockup } from '@/components/navigation/BrandLockup'
import { MainNavigation } from '@/components/navigation/MainNavigation'
import { MobileNavigation } from '@/components/navigation/MobileNavigation'
import { SearchBar } from '@/components/navigation/SearchBar'
import { useCart } from '@/hooks/useCart'

export function SiteHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const { itemCount, statusMessage } = useCart()
  const [open, setOpen] = useState(false)
  const [openPath, setOpenPath] = useState(location.pathname)
  const close = useCallback(() => setOpen(false), [])
  if (openPath !== location.pathname) {
    setOpenPath(location.pathname)
    setOpen(false)
  }

  function search(query: string) {
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : '/search')
  }

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-30 border-b border-wire-line bg-white">
        <div className="mx-auto grid h-[4.5rem] max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr]">
          <BrandLockup />
          <div className="flex justify-center">
            <div className="hidden lg:block">
              <MainNavigation />
            </div>
          </div>
          <div className="flex items-center justify-end gap-1">
          <div className="mr-2 hidden w-52 xl:block">
            <SearchBar label="Search catalogue" placeholder="Search" variant="bar" onSearch={search} />
          </div>
          <nav aria-label="Account and cart" className="flex items-center gap-1">
            <Link
              to="/account"
              className="inline-flex h-10 w-10 items-center justify-center text-navy hover:text-royal"
              aria-label="Account"
            >
              <User aria-hidden="true" size={18} strokeWidth={1.75} />
            </Link>
            <Link
              to="/cart"
              className="relative inline-flex h-10 w-10 items-center justify-center text-navy hover:text-royal"
              aria-label={`Cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
            >
              <ShoppingBag aria-hidden="true" size={18} strokeWidth={1.75} />
              <span className="absolute top-1 right-0.5 flex h-4 min-w-4 items-center justify-center bg-royal px-1 text-[10px] font-medium text-white">
                {itemCount}
              </span>
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center text-navy lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen(true)}
            >
              <Menu aria-hidden="true" size={18} strokeWidth={1.75} />
              <span className="sr-only">Open menu</span>
            </button>
          </nav>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-3 sm:px-6 xl:hidden">
          <SearchBar label="Search catalogue" placeholder="Search" variant="bar" onSearch={search} />
        </div>
        <p className="sr-only" aria-live="polite">
          {statusMessage}
        </p>
      </header>
      <MobileNavigation open={open} onClose={close} />
    </>
  )
}
