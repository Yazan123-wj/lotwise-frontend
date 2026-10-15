import { categories } from '@/data/categories'
import { products } from '@/data/products'
import type {
  Availability,
  AvailabilityFilter,
  CatalogueQuery,
  InventoryRecord,
  Product,
  ProductCategory,
  ProductVariation,
} from '@/types'

export const LOW_STOCK_AT = 5
export const CATALOGUE_PAGE_SIZE = 9

export function availabilityForQuantity(quantity: number): Availability {
  if (quantity <= 0) return 'out-of-stock'
  if (quantity <= LOW_STOCK_AT) return 'low-stock'
  return 'in-stock'
}

export function lowestPrice(product: Product) {
  return Math.min(...product.variations.map((variation) => variation.price))
}

export function productAvailability(product: Product): Availability {
  const quantities = product.variations.map((variation) => variation.stockQuantity)
  if (quantities.every((quantity) => quantity <= 0)) return 'out-of-stock'
  if (quantities.every((quantity) => quantity <= LOW_STOCK_AT)) return 'low-stock'
  return 'in-stock'
}

export function getProducts() {
  return products
}

export function getCategories() {
  return [...categories].sort((a, b) => a.displayOrder - b.displayOrder)
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug)
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug)
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id)
}

export function getVariation(product: Product, variationId: string) {
  return product.variations.find((variation) => variation.id === variationId)
}

export function visibleProducts() {
  const activeSlugs = new Set(categories.filter((category) => category.active).map((category) => category.slug))
  return products.filter((product) => product.visible && activeSlugs.has(product.categorySlug))
}

function matchesAvailability(product: Product, availability: AvailabilityFilter) {
  const status = productAvailability(product)
  if (availability === 'all') return true
  if (availability === 'out-of-stock') return status === 'out-of-stock'
  return status !== 'out-of-stock'
}

function matchesText(product: Product, text: string) {
  const haystack = [
    product.name,
    product.baseSku,
    product.shortDescription,
    ...product.variations.flatMap((variation) => [variation.sku, variation.label]),
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(text)
}

export function queryProducts(query: CatalogueQuery) {
  const text = query.text.trim().toLowerCase()
  const filtered = visibleProducts().filter((product) => {
    if (query.categorySlugs.length > 0 && !query.categorySlugs.includes(product.categorySlug)) return false
    if (!matchesAvailability(product, query.availability)) return false
    if (text && !matchesText(product, text)) return false
    return true
  })

  const sorted = [...filtered]
  sorted.sort((a, b) => {
    if (query.sort === 'name-asc') return a.name.localeCompare(b.name)
    if (query.sort === 'price-asc') return lowestPrice(a) - lowestPrice(b)
    if (query.sort === 'price-desc') return lowestPrice(b) - lowestPrice(a)
    return Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name)
  })
  return sorted
}

export function getFeaturedProducts() {
  return visibleProducts().filter((product) => product.featured)
}

export function getProductsForCategory(slug: string) {
  return visibleProducts().filter((product) => product.categorySlug === slug)
}

export function getRelatedProducts(product: Product) {
  return visibleProducts()
    .filter((item) => item.categorySlug === product.categorySlug && item.id !== product.id)
    .slice(0, 3)
}

export function getFeaturedCategories() {
  return getCategories().filter((category) => category.active && category.featured)
}

export function listInventory(): InventoryRecord[] {
  return products.flatMap((product) =>
    product.variations.map((variation) => toInventoryRecord(product, variation)),
  )
}

export function toInventoryRecord(product: Product, variation: ProductVariation): InventoryRecord {
  return {
    id: variation.id,
    productId: product.id,
    productName: product.name,
    variationId: variation.id,
    variationLabel: variation.label,
    sku: variation.sku,
    stockQuantity: variation.stockQuantity,
    status: availabilityForQuantity(variation.stockQuantity),
  }
}

export function categoryName(slug: string) {
  return getCategory(slug)?.name ?? 'Category'
}

export function countForCategory(category: ProductCategory) {
  return getProductsForCategory(category.slug).length
}
