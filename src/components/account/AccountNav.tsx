import { NavLink } from 'react-router-dom'
import { cx } from '@/utils/cx'

const links = [
  { label: 'Overview', to: '/account' },
  { label: 'Profile', to: '/account/profile' },
  { label: 'Addresses', to: '/account/addresses' },
  { label: 'Orders', to: '/account/orders' },
  { label: 'Sign in', to: '/account/sign-in' },
  { label: 'Register', to: '/account/register' },
  { label: 'Reset password', to: '/account/reset' },
]

export function AccountNav() {
  return (
    <nav aria-label="Account" className="border border-wire-line bg-white p-2">
      <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.to === '/account'}
              className={({ isActive }) =>
                cx('block px-3 py-2 text-sm', isActive && 'bg-wire-bg font-medium')
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
