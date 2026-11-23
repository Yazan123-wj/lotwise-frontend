import { categories as seedCategories, certificates as seedCertificates, discounts as seedDiscounts, policies } from "../data/content.ts"
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

export type LiveHero = { kicker: string; title: string; lede: string; image?: string }

export type Assurance = { title: string; detail: string; tone: "green" | "blue" | "orange" | "red" }

export type TermsContent = {
  title: string
  summary: string
  sections: Array<{ heading: string; body: string }>
}

const seedTerms = policies.find((policy) => policy.slug === "terms")

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
  kicker: "LotWise Labs",
  title: "Research peptides, vials, and kits.",
  lede: "Browse the live catalogue, add to cart, and place an order. Payment integration is coming next.",
  image: "/images/hero-vial.png",
}
export let assurances: Assurance[] = [
  { title: "Money Back Guarantee", detail: "14-day return policy", tone: "green" },
  { title: "Guaranteed Quality", detail: "HPLC ≥99% tested", tone: "blue" },
  { title: "Customer Support", detail: "Chat & Email", tone: "orange" },
  { title: "Fast Shipping", detail: "Despatched within 48hrs", tone: "red" },
]
export let aboutVideo = ""
export let terms: TermsContent = {
  title: seedTerms?.title ?? "Terms",
  summary: seedTerms?.summary ?? "",
  sections: seedTerms?.sections ?? [],
}

export function applyStore(data: {
  products: Product[]
  categories: Category[]
  certificates: LiveCertificate[]
  discounts: Discount[]
  announcement: string[]
  whatsapp: string
  hero: LiveHero
  assurances?: Assurance[]
  terms?: TermsContent
  aboutVideo?: string
}) {
  products = data.products
  categories = data.categories
  certificates = data.certificates
  discounts = data.discounts
  if (data.announcement?.length) announcement = data.announcement
  if (data.whatsapp) whatsapp = data.whatsapp
  if (data.hero) hero = data.hero
  if (data.assurances?.length) assurances = data.assurances
  if (data.terms?.title) terms = data.terms
  if (typeof data.aboutVideo === "string") aboutVideo = data.aboutVideo
  window.dispatchEvent(new Event("lotwise-store"))
}
