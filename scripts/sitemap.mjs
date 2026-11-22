import { writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const origin = "https://www.lotwiselabs.com"
const root = join(dirname(fileURLToPath(import.meta.url)), "..")

const staticPaths = [
  ["/", "1.0"],
  ["/shop", "0.9"],
  ["/about", "0.6"],
  ["/contact", "0.5"],
  ["/faq", "0.5"],
  ["/quality", "0.7"],
  ["/referral", "0.5"],
  ["/policies/terms", "0.3"],
  ["/policies/privacy", "0.3"],
  ["/policies/referral", "0.3"],
  ["/policies/shipping-returns", "0.3"],
]

function esc(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

async function loadStore() {
  try {
    const response = await fetch(`${origin}/api/store`)
    if (!response.ok) throw new Error(String(response.status))
    return await response.json()
  } catch (error) {
    console.warn("sitemap: catalogue fetch failed, static pages only", error instanceof Error ? error.message : error)
    return { products: [], categories: [] }
  }
}

const store = await loadStore()
const urls = staticPaths.map(([path, priority]) => ({ path, priority }))

for (const category of store.categories ?? []) {
  if (category.active === false || !category.slug) continue
  urls.push({ path: `/categories/${category.slug}`, priority: "0.7" })
}

for (const product of store.products ?? []) {
  if (product.visible === false || !product.slug) continue
  urls.push({ path: `/products/${product.slug}`, priority: "0.8" })
}

const today = new Date().toISOString().slice(0, 10)
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ path, priority }) => `  <url>
    <loc>${esc(origin + path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`

writeFileSync(join(root, "public/sitemap.xml"), xml)
writeFileSync(
  join(root, "public/robots.txt"),
  `User-agent: *
Allow: /
Allow: /assets/
Allow: /images/
Disallow: /admin
Disallow: /account
Disallow: /cart
Disallow: /checkout
Disallow: /order-confirmation
Disallow: /search
Disallow: /ref/

Sitemap: ${origin}/sitemap.xml
`,
)
console.log(`sitemap: wrote ${urls.length} urls`)
