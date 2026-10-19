import { categories, discounts } from "../data/content.ts"
import { products } from "../data/products.ts"
import type { Product, StockStatus, Variation } from "../types.ts"

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(value),
  )
}

export function visibleProducts() {
  return products.filter((product) => product.visible)
}

export function categoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug)
}

export function productBySlug(slug: string) {
  return products.find((product) => product.visible && product.slug === slug)
}

export function productByCode(code: string) {
  const needle = code.trim().toLowerCase()
  if (!needle) return undefined
  return products.find(
    (product) =>
      product.visible &&
      (product.baseSku.toLowerCase() === needle ||
        product.variations.some((variation) => variation.sku.toLowerCase() === needle)),
  )
}

export function categoryName(slug: string) {
  return categoryBySlug(slug)?.name ?? slug
}

export function minPrice(product: Product) {
  return Math.min(...product.variations.map((variation) => variation.price))
}

export function priceLabel(product: Product) {
  const prices = product.variations.map((variation) => variation.price)
  const low = Math.min(...prices)
  const high = Math.max(...prices)
  return low === high ? formatMoney(low) : `From ${formatMoney(low)}`
}

export function variationStock(quantity: number): StockStatus {
  if (quantity <= 0) return "out-of-stock"
  if (quantity <= 5) return "low-stock"
  return "in-stock"
}

export function productStock(product: Product): StockStatus {
  const quantities = product.variations.map((variation) => variation.stockQuantity)
  if (quantities.every((quantity) => quantity <= 0)) return "out-of-stock"
  if (quantities.every((quantity) => quantity <= 5)) return "low-stock"
  return "in-stock"
}

export function stockLabel(status: StockStatus) {
  if (status === "out-of-stock") return "Out of stock"
  if (status === "low-stock") return "Low stock"
  return "In stock"
}

export function defaultVariation(product: Product) {
  return (
    product.variations.find((variation) => variation.stockQuantity > 0) ??
    product.variations[0]
  )
}

export function searchProducts(query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return []
  return visibleProducts().filter((product) => {
    const haystack = [
      product.name,
      product.baseSku,
      product.shortDescription,
      product.description,
      categoryName(product.categorySlug),
      ...product.variations.flatMap((variation) => [variation.sku, variation.label]),
    ]
      .join(" ")
      .toLowerCase()
    return terms.every((term) => haystack.includes(term))
  })
}

export function relatedProducts(product: Product) {
  return visibleProducts()
    .filter(
      (item) => item.categorySlug === product.categorySlug && item.id !== product.id,
    )
    .slice(0, 4)
}

export function countInCategory(slug: string) {
  return visibleProducts().filter((product) => product.categorySlug === slug).length
}

export function activeAreas() {
  return categories.filter(
    (category) => category.active && countInCategory(category.slug) > 0,
  )
}

export type SortKey = "featured" | "name" | "price-asc" | "price-desc"

export function sortProducts(list: Product[], sort: SortKey) {
  const next = [...list]
  next.sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name)
    if (sort === "price-asc") return minPrice(a) - minPrice(b)
    if (sort === "price-desc") return minPrice(b) - minPrice(a)
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return a.name.localeCompare(b.name)
  })
  return next
}

export function quoteDiscount(subtotal: number, rawCode: string) {
  const code = rawCode.trim()
  if (!code) {
    return { amount: 0, applied: null as string | null, message: null as string | null }
  }
  const found = discounts.find(
    (discount) => discount.code.toLowerCase() === code.toLowerCase(),
  )
  if (!found) {
    return {
      amount: 0,
      applied: null,
      message: "That code is not in the sample list.",
    }
  }
  const today = "2026-10-19"
  const inactive =
    !found.active ||
    found.endsOn < today ||
    found.startsOn > today ||
    found.usageCount >= found.usageLimit
  if (inactive) {
    return {
      amount: 0,
      applied: null,
      message: "That code is not active on this wireframe.",
    }
  }
  if (subtotal < found.minOrderValue) {
    return {
      amount: 0,
      applied: null,
      message: `The sample subtotal must reach ${formatMoney(found.minOrderValue)} before this code applies.`,
    }
  }
  const amount =
    found.type === "percentage"
      ? Math.round(subtotal * found.value) / 100
      : found.value
  return {
    amount: Math.min(subtotal, amount),
    applied: found.code,
    message: null,
  }
}

export function lineFor(product: Product, variation: Variation, quantity: number) {
  return {
    key: `${product.id}:${variation.id}`,
    productId: product.id,
    variationId: variation.id,
    slug: product.slug,
    name: product.name,
    sku: variation.sku,
    variationLabel: variation.label,
    image: product.imagePaths[0] ?? "",
    unitPrice: variation.price,
    quantity,
    stockQuantity: variation.stockQuantity,
  }
}
