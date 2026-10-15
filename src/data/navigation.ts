import type { NavItem } from '@/types'

export const primaryLinks: NavItem[] = [
  { label: 'Shop', to: '/shop' },
  { label: 'About', to: '/about' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
]

export const supportLinks: NavItem[] = [
  { label: 'Contact', to: '/contact' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Account', to: '/account' },
  { label: 'Cart', to: '/cart' },
]

export const policyLinks: NavItem[] = [
  { label: 'Terms', to: '/policies/terms' },
  { label: 'Privacy', to: '/policies/privacy' },
  { label: 'Shipping and returns', to: '/policies/shipping-returns' },
]

export const adminLinks: NavItem[] = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Products', to: '/admin/products' },
  { label: 'Categories', to: '/admin/categories' },
  { label: 'Inventory', to: '/admin/inventory' },
  { label: 'Orders', to: '/admin/orders' },
  { label: 'Customers', to: '/admin/customers' },
  { label: 'Discounts', to: '/admin/discounts' },
  { label: 'Affiliates', to: '/admin/affiliates' },
  { label: 'Homepage content', to: '/admin/homepage-content' },
  { label: 'Users', to: '/admin/users' },
  { label: 'Settings', to: '/admin/settings' },
]
