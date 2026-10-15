export type Availability = 'in-stock' | 'low-stock' | 'out-of-stock'

export type ProductVariation = {
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
  variations: ProductVariation[]
}

export type ProductCategory = {
  id: string
  slug: string
  name: string
  description: string
  imagePath: string
  imageLabel: string
  displayOrder: number
  active: boolean
  featured: boolean
}

export type CartItem = {
  id: string
  productId: string
  variationId: string
  quantity: number
}

export type ResolvedCartLine = {
  id: string
  productId: string
  variationId: string
  name: string
  slug: string
  sku: string
  variationLabel: string
  unitPrice: number
  quantity: number
  lineTotal: number
  imagePath: string
}

export type CartQuote = {
  lines: ResolvedCartLine[]
  subtotal: number
  discountAmount: number
  discountCode: string | null
  discountMessage: string | null
  provisionalTotal: number
  shippingLabel: string
}

export type Address = {
  line1: string
  line2: string
  city: string
  region: string
  postalCode: string
  country: string
}

export type Customer = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  addresses: Address[]
}

export type PaymentStatus = 'not-collected' | 'placeholder-pending' | 'placeholder-recorded'

export type FulfilmentStatus = 'placed' | 'processing' | 'fulfilled' | 'cancelled'

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

export type Order = {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  email: string
  phone: string
  placedAt: string
  paymentStatus: PaymentStatus
  fulfilmentStatus: FulfilmentStatus
  shippingAddress: Address
  items: OrderItem[]
  subtotal: number
  discountAmount: number
  discountCode: string | null
  provisionalTotal: number
  note: string
}

export type DemoReceipt = {
  id: string
  orderNumber: string
  createdAt: string
  customerName: string
  email: string
  phone: string
  shippingAddress: Address
  shippingMethodLabel: string
  items: OrderItem[]
  subtotal: number
  discountAmount: number
  discountCode: string | null
  provisionalTotal: number
  paymentStatus: 'not-collected'
}

export type DiscountCode = {
  id: string
  code: string
  type: 'percentage' | 'fixed'
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

export type HomepageSwiper = {
  id: string
  heading: string
  supportingCopy: string
  ctaLabel: string
  ctaDestination: string
  mediaKind: 'image' | 'video'
  mediaLabel: string
  mediaPath?: string
  mediaFocus?: string
  displayOrder: number
  active: boolean
}

export type PromotionalBanner = {
  id: string
  placement: string
  heading: string
  supportingCopy: string
  ctaLabel: string
  ctaDestination: string
  mediaLabel: string
  mediaPath?: string
  displayOrder: number
  active: boolean
}

export type Announcement = {
  id: string
  message: string
  href: string
  active: boolean
}

export type NavItem = {
  label: string
  to: string
  children?: NavItem[]
}

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete'

export type AdminResource =
  | 'products'
  | 'categories'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'discounts'
  | 'affiliates'
  | 'homepage'
  | 'users'
  | 'settings'

export type AdminRole = {
  id: string
  name: string
  description: string
  permissions: Record<AdminResource, PermissionAction[]>
}

export type AdminUser = {
  id: string
  name: string
  email: string
  roleId: string
  active: boolean
}

export type InventoryRecord = {
  id: string
  productId: string
  productName: string
  variationId: string
  variationLabel: string
  sku: string
  stockQuantity: number
  status: Availability
}

export type StoreActivity = {
  id: string
  at: string
  message: string
}

export type StoreSettings = {
  storeName: string
  supportEmail: string
  phone: string
  address: string
  currencyCode: string
}

export type SortOption = 'featured' | 'name-asc' | 'price-asc' | 'price-desc'

export type AvailabilityFilter = 'all' | 'in-stock' | 'out-of-stock'

export type CatalogueQuery = {
  text: string
  categorySlugs: string[]
  availability: AvailabilityFilter
  sort: SortOption
}

export type Crumb = {
  label: string
  to?: string
}

export type PolicyDocument = {
  slug: 'terms' | 'privacy' | 'shipping-returns'
  title: string
  summary: string
  sections: { heading: string; body: string }[]
}

export type FaqItem = {
  id: string
  question: string
  answer: string
}
