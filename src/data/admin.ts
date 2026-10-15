import type { AdminResource, AdminRole, AdminUser, PermissionAction, StoreSettings } from '@/types'

const all: PermissionAction[] = ['view', 'create', 'edit', 'delete']
const manage: PermissionAction[] = ['view', 'create', 'edit']
const viewOnly: PermissionAction[] = ['view']
const none: PermissionAction[] = []

function permissions(
  map: Partial<Record<AdminResource, PermissionAction[]>>,
): Record<AdminResource, PermissionAction[]> {
  const resources: AdminResource[] = [
    'products',
    'categories',
    'inventory',
    'orders',
    'customers',
    'discounts',
    'affiliates',
    'homepage',
    'users',
    'settings',
  ]
  return Object.fromEntries(resources.map((resource) => [resource, map[resource] ?? none])) as Record<
    AdminResource,
    PermissionAction[]
  >
}

export const adminResources: AdminResource[] = [
  'products',
  'categories',
  'inventory',
  'orders',
  'customers',
  'discounts',
  'affiliates',
  'homepage',
  'users',
  'settings',
]

export const permissionActions: PermissionAction[] = ['view', 'create', 'edit', 'delete']

export const adminRoles: AdminRole[] = [
  {
    id: 'role_owner',
    name: 'Owner',
    description: 'Sample role with every permission category switched on for the visual matrix.',
    permissions: permissions({
      products: all,
      categories: all,
      inventory: all,
      orders: all,
      customers: all,
      discounts: all,
      affiliates: all,
      homepage: all,
      users: all,
      settings: all,
    }),
  },
  {
    id: 'role_catalogue',
    name: 'Catalogue',
    description: 'Sample role for catalogue and homepage content, without order or user controls.',
    permissions: permissions({
      products: manage,
      categories: manage,
      inventory: manage,
      homepage: manage,
      orders: viewOnly,
    }),
  },
  {
    id: 'role_support',
    name: 'Support',
    description: 'Sample role for viewing orders and customers. Delete is intentionally off.',
    permissions: permissions({
      orders: ['view', 'edit'],
      customers: ['view', 'edit'],
      products: viewOnly,
    }),
  },
]

export const adminUsers: AdminUser[] = [
  {
    id: 'adm_01',
    name: 'Sample Owner',
    email: 'owner@example.com',
    roleId: 'role_owner',
    active: true,
  },
  {
    id: 'adm_02',
    name: 'Sample Catalogue',
    email: 'catalogue@example.com',
    roleId: 'role_catalogue',
    active: true,
  },
  {
    id: 'adm_03',
    name: 'Sample Support',
    email: 'support@example.com',
    roleId: 'role_support',
    active: false,
  },
]

export const storeSettings: StoreSettings = {
  storeName: 'LotWise Labs',
  supportEmail: 'To be confirmed',
  phone: 'To be confirmed',
  address: 'To be confirmed',
  currencyCode: 'USD',
}
