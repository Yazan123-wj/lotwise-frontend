export const SITE_ORIGIN = "https://www.lotwiselabs.com"
export const STORE_API = "https://lotwise-backend-production.up.railway.app/api/store"

export const POLICY_SLUGS = ["terms", "privacy", "referral", "shipping-returns"]

const PRIVATE_ROOTS = ["/account", "/admin", "/cart", "/checkout", "/order-confirmation", "/search"]

export function normalizePath(pathname) {
  const path = String(pathname || "/").split("?")[0].split("#")[0]
  if (path === "" || path === "/") return "/"
  return path.replace(/\/+$/, "")
}

export function isPrivatePath(pathname) {
  const path = normalizePath(pathname)
  if (/^\/ref\/[^/]+$/.test(path)) return true
  return PRIVATE_ROOTS.some((root) => path === root || path.startsWith(`${root}/`))
}

export function classify(pathname, catalogue) {
  const path = normalizePath(pathname)
  if (path === "/404.html") return "file"
  if (FIXED_PUBLIC.some((page) => page.path === path)) return "public"
  if (isPrivatePath(path)) return "private"
  const product = path.match(/^\/products\/([^/]+)$/)
  if (product) {
    if (!catalogue) return "public"
    return catalogue.products.has(decodeURIComponent(product[1])) ? "public" : "missing"
  }
  const category = path.match(/^\/categories\/([^/]+)$/)
  if (category) {
    if (!catalogue) return "public"
    return catalogue.categories.has(decodeURIComponent(category[1])) ? "public" : "missing"
  }
  const policy = path.match(/^\/policies\/([^/]+)$/)
  if (policy) return POLICY_SLUGS.includes(decodeURIComponent(policy[1])) ? "public" : "missing"
  return "missing"
}

export const FAQS = [
  {
    question: "How are catalogue prices shown?",
    answer: "Prices shown on product pages and in the cart are the current catalogue prices. Shipping is confirmed after you place the order.",
  },
  {
    question: "Does checkout take payment yet?",
    answer: "Not yet. You can place an order as a guest or from your account, and it is saved as awaiting payment. Card payment will be collected once our payment provider is connected.",
  },
  {
    question: "What products are listed?",
    answer: "The live catalogue is managed in the LotWise Labs admin panel. Product names, options, and stock update from there.",
  },
  {
    question: "How do I contact LotWise Labs?",
    answer: "Use the WhatsApp button on the site or the contact page to reach the LotWise Labs team.",
  },
]

const POLICIES = {
  privacy: {
    title: "Privacy",
    description: "LotWise Labs stores account, order, and referral information needed to run the storefront.",
  },
  referral: {
    title: "Referral terms",
    description: "The referral program records visits and new accounts. Rewards apply only when an administrator configures them.",
  },
  "shipping-returns": {
    title: "Shipping and returns",
    description: "Shipping rates are confirmed after you place an order. Return conditions follow LotWise Labs fulfilment policy.",
  },
}

export const FIXED_PUBLIC = [
  {
    path: "/",
    title: "LotWise Labs",
    description: "LotWise Labs research peptide catalogue.",
    jsonLd(store) {
      return [
        { "@type": "Organization", name: "LotWise Labs", url: `${SITE_ORIGIN}/`, logo: `${SITE_ORIGIN}/brand/lotwise-logo.png` },
        { "@type": "WebSite", name: "LotWise Labs", url: `${SITE_ORIGIN}/` },
        {
          "@type": "FAQPage",
          mainEntity: FAQS.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        },
      ]
    },
  },
  { path: "/shop", title: "Catalog", description: "Browse the LotWise Labs research catalogue by category, size, and availability." },
  { path: "/about", title: "About", description: "LotWise Labs supplies research peptides with batch certificates and a public catalogue." },
  { path: "/contact", title: "Contact", description: "Contact LotWise Labs about the research catalogue." },
  { path: "/faq", title: "FAQ", description: "Answers about LotWise Labs catalogue prices, orders, and payment." },
  { path: "/quality", title: "Certificates", description: "LotWise Labs certificates of analysis and third-party test reports." },
  { path: "/referral", title: "Referral", description: "Share a LotWise Labs referral link and track visits from your account." },
]

export const PRIVATE_PAGES = [
  { path: "/cart", title: "Cart", description: "Your LotWise Labs cart." },
  { path: "/checkout", title: "Checkout", description: "Place a LotWise Labs order." },
  { path: "/order-confirmation", title: "Order confirmation", description: "LotWise Labs order confirmation." },
  { path: "/search", title: "Search", description: "Search the LotWise Labs catalogue." },
  { path: "/account", title: "Account", description: "Your LotWise Labs account." },
  { path: "/account/sign-in", title: "Account", description: "Your LotWise Labs account." },
  { path: "/account/register", title: "Account", description: "Your LotWise Labs account." },
  { path: "/account/reset", title: "Account", description: "Your LotWise Labs account." },
  { path: "/admin", title: "Admin", description: "LotWise Labs admin." },
  { path: "/admin/login", title: "Admin sign-in", description: "LotWise Labs admin sign-in." },
]

export function pageTitle(title) {
  return title === "LotWise Labs" ? title : `${title} · LotWise Labs`
}

export function canonicalUrl(pathname) {
  return `${SITE_ORIGIN}${normalizePath(pathname)}`
}

function mediaSrc(path) {
  if (path === "/images/hero-vial.png" || path === "/images/lotwise-vial.png") return path.replace(/\.png$/, ".webp")
  if (path === "/images/banners/hero-lab.jpg") return "/images/banners/hero-lab.webp"
  return path
}

export function pagesFromStore(store) {
  const pages = FIXED_PUBLIC.map((page) => {
    if (page.path !== "/") return { ...page, index: true, jsonLd: page.jsonLd?.(store) }
    const description = store?.hero?.lede || page.description
    return { ...page, description, index: true, jsonLd: page.jsonLd?.(store) }
  })

  const terms = store?.terms?.title
    ? { title: store.terms.title, description: store.terms.summary || "LotWise Labs terms." }
    : {
        title: "Terms",
        description: "Using the LotWise Labs storefront means you agree to place orders for research use as described on product pages.",
      }
  pages.push({ path: "/policies/terms", title: terms.title, description: terms.description, index: true })
  for (const slug of POLICY_SLUGS.filter((item) => item !== "terms")) {
    const policy = POLICIES[slug]
    pages.push({ path: `/policies/${slug}`, title: policy.title, description: policy.description, index: true })
  }

  for (const category of store?.categories ?? []) {
    if (category.active === false || !category.slug) continue
    pages.push({
      path: `/categories/${category.slug}`,
      title: category.name || "Category",
      description: category.description || "LotWise Labs product category.",
      index: true,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Catalog", item: `${SITE_ORIGIN}/shop` },
          { "@type": "ListItem", position: 2, name: category.name, item: canonicalUrl(`/categories/${category.slug}`) },
        ],
      },
    })
  }

  for (const product of store?.products ?? []) {
    if (product.visible === false || !product.slug) continue
    const prices = (product.variations ?? []).map((item) => Number(item.price)).filter((price) => Number.isFinite(price))
    const lowPrice = prices.length ? Math.min(...prices) : 0
    const highPrice = prices.length ? Math.max(...prices) : 0
    const inStock = (product.variations ?? []).some((item) => Number(item.stockQuantity) > 0)
    const category = (store.categories ?? []).find((item) => item.slug === product.categorySlug)
    const images = (product.imagePaths?.length ? product.imagePaths : [product.imagePath || "/images/lotwise-vial.png"]).map((path) =>
      String(path).startsWith("http") ? path : `${SITE_ORIGIN}${mediaSrc(path)}`,
    )
    pages.push({
      path: `/products/${product.slug}`,
      title: product.name || "Product",
      description: product.shortDescription || "LotWise Labs research product.",
      index: true,
      jsonLd: [
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Catalog", item: `${SITE_ORIGIN}/shop` },
            ...(category ? [{ "@type": "ListItem", position: 2, name: category.name, item: canonicalUrl(`/categories/${category.slug}`) }] : []),
            { "@type": "ListItem", position: category ? 3 : 2, name: product.name, item: canonicalUrl(`/products/${product.slug}`) },
          ],
        },
        {
          "@type": "Product",
          name: product.name,
          description: product.shortDescription,
          sku: product.baseSku,
          image: images,
          brand: { "@type": "Brand", name: "LotWise Labs" },
          offers: {
            "@type": "AggregateOffer",
            url: canonicalUrl(`/products/${product.slug}`),
            priceCurrency: "USD",
            lowPrice,
            highPrice,
            offerCount: product.variations?.length ?? 0,
            availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          },
        },
      ],
    })
  }

  for (const page of PRIVATE_PAGES) {
    pages.push({ ...page, index: false })
  }
  pages.push({
    path: "/404.html",
    title: "Not found",
    description: "That LotWise Labs page was not found.",
    index: false,
  })
  return pages
}

export function catalogueSets(store) {
  return {
    products: new Set((store?.products ?? []).filter((product) => product.visible !== false && product.slug).map((product) => product.slug)),
    categories: new Set((store?.categories ?? []).filter((category) => category.active !== false && category.slug).map((category) => category.slug)),
  }
}
