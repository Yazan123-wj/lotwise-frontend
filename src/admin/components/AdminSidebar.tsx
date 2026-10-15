import {
  BadgePercent,
  ClipboardList,
  FolderTree,
  Images,
  LayoutDashboard,
  Link2,
  Package,
  Settings,
  UserCog,
  Users,
  Warehouse,
  type LucideIcon,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { getAdminLinks } from '@/services/content'
import { cx } from '@/utils/cx'

const icons: Record<string, LucideIcon> = {
  '/admin': LayoutDashboard,
  '/admin/products': Package,
  '/admin/categories': FolderTree,
  '/admin/inventory': Warehouse,
  '/admin/orders': ClipboardList,
  '/admin/customers': Users,
  '/admin/discounts': BadgePercent,
  '/admin/affiliates': Link2,
  '/admin/homepage-content': Images,
  '/admin/users': UserCog,
  '/admin/settings': Settings,
}

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open ? (
        <button type="button" className="fixed inset-0 z-30 bg-navy/45 md:hidden" aria-label="Close admin menu" onClick={onClose} />
      ) : null}
      <aside
        className={cx(
          'fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto bg-navy p-5 text-white md:static md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand-sky">Administration</p>
        <p className="mt-2 text-base font-medium">LotWise Labs</p>
        <nav aria-label="Admin" className="mt-8">
          <ul className="space-y-1">
            {getAdminLinks().map((link) => {
              const Icon = icons[link.to] ?? LayoutDashboard
              return (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/admin'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cx(
                        'flex min-h-11 items-center gap-2 px-3 text-sm text-white/75 hover:bg-white/10 hover:text-white',
                        isActive && 'bg-white/10 font-medium text-white',
                      )
                    }
                  >
                    <Icon aria-hidden="true" size={16} strokeWidth={1.75} />
                    {link.label}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}
