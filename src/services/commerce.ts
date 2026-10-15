import { previewCustomer, customers } from '@/data/customers'
import { orders } from '@/data/mock-orders'
import type { DemoReceipt, Order } from '@/types'

const RECEIPT_KEY = 'lotwise-demo-receipt'

export function getOrders() {
  return orders
}

export function getOrder(id: string) {
  return orders.find((order) => order.id === id)
}

export function getCustomers() {
  return customers
}

export function getCustomer(id: string) {
  return customers.find((customer) => customer.id === id)
}

export function getPreviewCustomer() {
  return previewCustomer
}

export function getOrdersForCustomer(customerId: string) {
  return orders.filter((order) => order.customerId === customerId)
}

export function saveDemoReceipt(receipt: DemoReceipt) {
  sessionStorage.setItem(RECEIPT_KEY, JSON.stringify(receipt))
}

export function readDemoReceipt(): DemoReceipt | null {
  try {
    const raw = sessionStorage.getItem(RECEIPT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as DemoReceipt
    if (!parsed || typeof parsed.orderNumber !== 'string' || !Array.isArray(parsed.items)) return null
    return parsed
  } catch {
    return null
  }
}

export function paymentLabel(status: Order['paymentStatus'] | DemoReceipt['paymentStatus']) {
  if (status === 'placeholder-pending') return 'Placeholder pending'
  if (status === 'placeholder-recorded') return 'Placeholder recorded'
  return 'Not collected'
}

export function fulfilmentLabel(status: Order['fulfilmentStatus']) {
  if (status === 'processing') return 'Processing'
  if (status === 'fulfilled') return 'Fulfilled'
  if (status === 'cancelled') return 'Cancelled'
  return 'Placed'
}
