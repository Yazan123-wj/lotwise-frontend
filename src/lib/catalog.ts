import { categories, discounts, products } from "./live.ts"
import type { BundleTier, Product, StockStatus, Variation } from "../types.ts"

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
      ...(product.sections ?? []).flatMap((section) => [section.title, section.subtitle]),
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
      message: "That code is not available.",
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
      message: "That code is not active.",
    }
  }
  if (subtotal < found.minOrderValue) {
    return {
      amount: 0,
      applied: null,
      message: `Your subtotal must reach ${formatMoney(found.minOrderValue)} before this code applies.`,
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

const COUNT_WORDS = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"]

export function bundleTiers(product: Product): BundleTier[] {
  const seen = new Set<number>()
  return (product.bundles ?? [])
    .map((tier) => ({
      minQuantity: Math.round(Number(tier.minQuantity)),
      percentOff: Number(tier.percentOff),
    }))
    .filter((tier) => tier.minQuantity >= 2 && tier.percentOff > 0 && tier.percentOff < 100 && !seen.has(tier.minQuantity) && seen.add(tier.minQuantity))
    .sort((a, b) => a.minQuantity - b.minQuantity)
}

export function discountedUnit(price: number, percentOff: number) {
  if (!(percentOff > 0) || percentOff >= 100) return Math.round(price * 100) / 100
  return Math.round(price * (100 - percentOff)) / 100
}

export function activeBundle(product: Product, quantity: number) {
  let match: BundleTier | null = null
  for (const tier of bundleTiers(product)) {
    if (quantity >= tier.minQuantity) match = tier
  }
  return match
}

export function bundleOffers(product: Product, price: number) {
  const tiers = bundleTiers(product)
  return [
    { minQuantity: 1, percentOff: 0, label: "Buy One", unitPrice: discountedUnit(price, 0) },
    ...tiers.map((tier, index) => ({
      minQuantity: tier.minQuantity,
      percentOff: tier.percentOff,
      label: `Buy ${COUNT_WORDS[tier.minQuantity] ?? tier.minQuantity}${index === tiers.length - 1 ? "+" : ""}`,
      unitPrice: discountedUnit(price, tier.percentOff),
    })),
  ]
}

export function lineFor(product: Product, variation: Variation, quantity: number) {
  const percent = activeBundle(product, quantity)?.percentOff ?? 0
  return {
    key: `${product.id}:${variation.id}`,
    productId: product.id,
    variationId: variation.id,
    slug: product.slug,
    name: product.name,
    sku: variation.sku,
    variationLabel: variation.label,
    image: product.imagePaths[0] ?? "",
    unitPrice: discountedUnit(variation.price, percent),
    quantity,
    stockQuantity: variation.stockQuantity,
  }
}
