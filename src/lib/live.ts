import { categories as seedCategories, certificates as seedCertificates, discounts as seedDiscounts } from "../data/content.ts"
import { products as seedProducts } from "../data/products.ts"
import type { Category, Discount, Product } from "../types.ts"

export type LiveCertificate = {
  id: string
  title: string
  image: string
  alt: string
  note: string
  result: string
  href: string
}

export type LiveHero = { kicker: string; title: string; lede: string }

export let products: Product[] = seedProducts
export let categories: Category[] = seedCategories
export let certificates: LiveCertificate[] = seedCertificates.map((file) => ({
  id: file.id,
  title: file.title,
  image: file.image,
  alt: file.alt,
  note: file.note,
  result: file.result,
  href: file.href,
}))
export let discounts: Discount[] = seedDiscounts
export let announcement = [
  "COA certified every batch tested",
  "Over 99% purity",
  "Free shipping for orders over $350",
]
export let whatsapp = "https://wa.me/"
export let hero: LiveHero = {
  kicker: "LotWise / Catalogue review",
  title: "Vial records, reference lots, and kits.",
  lede: "Listed for review. Prices on this site are sample figures.",
}

export function applyStore(data: {
  products: Product[]
  categories: Category[]
  certificates: LiveCertificate[]
  discounts: Discount[]
  announcement: string[]
  whatsapp: string
  hero: LiveHero
}) {
  products = data.products
  categories = data.categories
  certificates = data.certificates
  discounts = data.discounts
  if (data.announcement?.length) announcement = data.announcement
  if (data.whatsapp) whatsapp = data.whatsapp
  if (data.hero) hero = data.hero
}
