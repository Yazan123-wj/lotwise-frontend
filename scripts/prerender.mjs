import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { SITE_ORIGIN, STORE_API, canonicalUrl, pageTitle, pagesFromStore } from "../seo/routes.mjs"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const dist = join(root, "dist")

function esc(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")
}

function jsonLd(data) {
  if (!data) return ""
  const payload = Array.isArray(data) ? { "@context": "https://schema.org", "@graph": data } : data
  return JSON.stringify(payload).replace(/</g, "\\u003c")
}

export function applyHead(template, page) {
  const title = pageTitle(page.title)
  const robots = page.index === false ? "noindex, follow" : "index, follow"
  const canonical = page.path === "/404.html" ? `${SITE_ORIGIN}/404.html` : canonicalUrl(page.path === "/ref/preview" ? "/ref/preview" : page.path)
  let html = template
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
  html = html.replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${esc(page.description)}$2`)
  html = html.replace(/(<meta\s+name="robots"\s+content=")[^"]*(")/, `$1${robots}$2`)
  html = html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${esc(canonical)}$2`)
  const script = jsonLd(page.jsonLd)
  if (script) {
    html = html.replace(
      /<script type="application\/ld\+json" data-seo-jsonld>[\s\S]*?<\/script>/,
      `<script type="application/ld+json" data-seo-jsonld>${script}</script>`,
    )
  } else {
    html = html.replace(/<script type="application\/ld\+json" data-seo-jsonld>[\s\S]*?<\/script>\s*/, "")
  }
  return html
}

function destination(pathname) {
  if (pathname === "/") return join(dist, "index.html")
  if (pathname === "/404.html") return join(dist, "404.html")
  return join(dist, pathname.slice(1), "index.html")
}

async function loadStore() {
  try {
    const response = await fetch(STORE_API)
    if (!response.ok) throw new Error(String(response.status))
    return await response.json()
  } catch (error) {
    console.warn("prerender: catalogue fetch failed, static pages only", error instanceof Error ? error.message : error)
    return { products: [], categories: [] }
  }
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])

if (isDirectRun) {
  const template = readFileSync(join(dist, "index.html"), "utf8")
  const store = await loadStore()
  const pages = pagesFromStore(store)
  for (const page of pages) {
    const file = destination(page.path)
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, applyHead(template, page))
  }
  console.log(`prerender: wrote ${pages.length} pages`)
}
