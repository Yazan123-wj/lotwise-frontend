import { STORE_API, catalogueSets, classify } from "./seo/routes.mjs"

let cached = null

async function catalogue() {
  if (cached && Date.now() - cached.at < 5 * 60 * 1000) return cached.sets
  try {
    const response = await fetch(STORE_API, { headers: { accept: "application/json" } })
    if (!response.ok) return cached?.sets ?? null
    const store = await response.json()
    cached = { at: Date.now(), sets: catalogueSets(store) }
    return cached.sets
  } catch {
    return cached?.sets ?? null
  }
}

export default async function middleware(request) {
  const url = new URL(request.url)
  const path = url.pathname
  if (path.startsWith("/api/") || path.startsWith("/images/") || path.startsWith("/brand/") || path.startsWith("/assets/")) return
  const kind = classify(path, await catalogue())
  if (kind !== "missing") return
  const shell = await fetch(new URL("/404.html", url.origin))
  const html = shell.ok ? await shell.text() : "<!doctype html><title>Not found · LotWise Labs</title><p>That page is not on this site.</p>"
  return new Response(html, {
    status: 404,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "x-robots-tag": "noindex, follow",
    },
  })
}

export const config = {
  matcher: ["/((?!api/|assets/|images/|brand/|favicon.ico|sitemap.xml|robots.txt|404.html|.*\\..*).*)"],
}
