import { adminResources, adminRoles, adminUsers, permissionActions, storeSettings } from '@/data/admin'
import { affiliates } from '@/data/affiliates'
import { storeActivity } from '@/data/mock-orders'
import { getOrders } from '@/services/commerce'
import { getDiscountCodes } from '@/services/pricing'
import { listInventory } from '@/services/catalog'
import { roundMoney } from '@/utils/format'

export function getAdminUsers() {
  return adminUsers
}

export function getAdminRoles() {
  return adminRoles
}

export function getAdminResources() {
  return adminResources
}

export function getPermissionActions() {
  return permissionActions
}

export function getAffiliates() {
  return affiliates
}

export function getStoreSettings() {
  return storeSettings
}

export function getActivity() {
  return storeActivity
}

export function getDashboardModel() {
  const orderList = getOrders()
  const inventory = listInventory()
  const units = new Map<string, number>()
  for (const order of orderList) {
    for (const item of order.items) {
      units.set(item.name, (units.get(item.name) ?? 0) + item.quantity)
    }
  }

  return {
    orderCount: orderList.length,
    sampleSales: roundMoney(orderList.reduce((sum, order) => sum + order.provisionalTotal, 0)),
    recentOrders: [...orderList].sort((a, b) => b.placedAt.localeCompare(a.placedAt)),
    productPerformance: [...units.entries()].map(([name, quantity]) => ({ name, quantity })),
    inventoryCounts: {
      inStock: inventory.filter((record) => record.status === 'in-stock').length,
      lowStock: inventory.filter((record) => record.status === 'low-stock').length,
      outOfStock: inventory.filter((record) => record.status === 'out-of-stock').length,
    },
    lowStock: inventory.filter((record) => record.status !== 'in-stock'),
    discounts: getDiscountCodes(),
    activity: getActivity(),
  }
}
