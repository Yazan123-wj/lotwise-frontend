import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { countForCategory, getCategory } from '@/services/catalog'
import { getMainNavigation } from '@/services/content'
import { cx } from '@/utils/cx'

function MenuThumb({ src }: { src?: string }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return <span className="block h-full w-full bg-wire-bg" />
  return <img src={src} alt="" className="h-full w-full object-cover" onError={() => setFailed(true)} />
}

function itemClass(active: boolean) {
  return cx(
    'relative inline-flex h-11 items-center gap-1.5 px-3 text-sm font-medium text-navy transition-colors hover:text-royal',
    active && 'text-royal',
  )
}

function ActiveRule({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cx('absolute inset-x-3 bottom-1 h-0.5 bg-royal', active ? 'opacity-100' : 'opacity-0')}
    />
  )
}

export function MainNavigation() {
  const items = getMainNavigation()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [openPath, setOpenPath] = useState(pathname)
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  if (openPath !== pathname) {
    setOpenPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <nav aria-label="Primary" className="flex items-center">
      {items.map((item) =>
        item.children ? (
          <div key={item.label} className="relative" ref={rootRef}>
            <button
              type="button"
              className={itemClass(pathname.startsWith('/categories'))}
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((current) => !current)}
            >
              {item.label}
              <ChevronDown aria-hidden="true" size={15} strokeWidth={1.75} className={cx('transition-transform', open && 'rotate-180')} />
              <ActiveRule active={pathname.startsWith('/categories')} />
            </button>
            {open ? (
              <div id={menuId} className="absolute top-full left-1/2 z-20 mt-3 w-80 -translate-x-1/2 border border-wire-line bg-white p-2 shadow-[0_18px_50px_rgba(2,9,46,0.1)]">
                <p className="px-3 pt-2 pb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-wire-muted">Catalogue</p>
                <ul>
                  {item.children.map((child) => {
                    const slug = child.to.split('/').pop() ?? ''
                    const category = getCategory(slug)
                    const count = category ? countForCategory(category) : 0
                    const countLabel = `${count} ${count === 1 ? 'product' : 'products'}`
                    return (
                      <li key={child.to}>
                        <NavLink
                          to={child.to}
                          className={({ isActive }) =>
                            cx('group flex items-center gap-3 px-2 py-2 hover:bg-wire-bg', isActive && 'bg-wire-bg')
                          }
                          onClick={() => setOpen(false)}
                        >
                          <span className="h-12 w-12 shrink-0 overflow-hidden bg-wire-bg">
                            <MenuThumb src={category?.imagePath} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-navy group-hover:text-royal">{child.label}</span>
                            <span className="mt-0.5 block text-xs text-wire-muted">{countLabel}</span>
                          </span>
                        </NavLink>
                      </li>
                    )
                  })}
                </ul>
                <div className="mt-1 border-t border-wire-line">
                  <Link
                    to="/shop"
                    className="flex items-center justify-between px-3 py-3 text-sm font-medium text-royal hover:text-navy"
                    onClick={() => setOpen(false)}
                  >
                    All products
                    <ArrowUpRight aria-hidden="true" size={15} strokeWidth={1.75} />
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => itemClass(isActive)}>
            {({ isActive }) => (
              <>
                {item.label}
                <ActiveRule active={isActive} />
              </>
            )}
          </NavLink>
        ),
      )}
    </nav>
  )
}
