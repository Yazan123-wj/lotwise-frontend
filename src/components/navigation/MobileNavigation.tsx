import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { cx } from '@/utils/cx'
import { getMainNavigation } from '@/services/content'

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

  const items = getMainNavigation()

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button type="button" className="absolute inset-0 bg-navy/45" aria-label="Close menu" onClick={onClose} />
      <div
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile"
        className="absolute inset-y-0 right-0 flex w-[min(100%,22rem)] flex-col bg-white p-5 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-navy">Menu</p>
          <button ref={closeRef} type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center text-navy" onClick={onClose}>
            <X aria-hidden="true" size={18} />
            <span className="sr-only">Close menu</span>
          </button>
        </div>
        <nav aria-label="Mobile" className="mt-4 space-y-4 overflow-y-auto">
          {items.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-wire-muted">{item.label}</p>
                  <ul className="mt-2 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.to}>
                        <NavLink
                          to={child.to}
                          className={({ isActive }) =>
                            cx('block min-h-11 py-2 text-sm text-navy', isActive && 'font-medium text-royal')
                          }
                          onClick={onClose}
                        >
                          {child.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cx('block py-2 text-base font-medium text-navy', isActive && 'text-royal underline decoration-2 underline-offset-4')
                  }
                  onClick={onClose}
                >
                  {item.label}
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
