export type Variation = {
  id: string
  sku: string
  label: string
  price: number
  stockQuantity: number
}

export type Product = {
  id: string
  slug: string
  name: string
  baseSku: string
  shortDescription: string
  description: string
  categorySlug: string
  featured: boolean
  visible: boolean
  imagePaths: string[]
  variations: Variation[]
}

export type Category = {
  id: string
  slug: string
  name: string
  description: string
  imagePath: string
  displayOrder: number
  active: boolean
  featured: boolean
}

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock"

export type Address = {
  line1: string
  line2: string
  city: string
  region: string
  postalCode: string
  country: string
}

export type CartLine = {
  key: string
  productId: string
  variationId: string
  slug: string
  name: string
  sku: string
  variationLabel: string
  image: string
  unitPrice: number
  quantity: number
  stockQuantity: number
}

export type OrderItem = {
  id: string
  productId: string
  variationId: string
  name: string
  sku: string
  variationLabel: string
  quantity: number
  unitPrice: number
}

export type SampleOrder = {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  email: string
  phone: string
  placedAt: string
  paymentStatus: string
  fulfilmentStatus: string
  shippingAddress: Address
  items: OrderItem[]
  subtotal: number
  discountAmount: number
  discountCode: string | null
  provisionalTotal: number
  note: string
}

export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  address: Address
}

export type Discount = {
  id: string
  code: string
  type: "percentage" | "fixed"
  value: number
  minOrderValue: number
  usageLimit: number
  usageCount: number
  startsOn: string
  endsOn: string
  active: boolean
}

export type Affiliate = {
  id: string
  name: string
  email: string
  code: string
  linkPath: string
  visits: number
  orders: number
  active: boolean
}

export type Receipt = {
  reference: string
  createdAt: string
  name: string
  email: string
  phone: string
  shippingAddress: Address
  shippingMethodLabel: string
  items: OrderItem[]
  subtotal: number
  discountAmount: number
  discountCode: string | null
  total: number
  referral: string | null
  note: string
}
