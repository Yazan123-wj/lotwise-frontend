import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export const SITE_ORIGIN = "https://www.lotwiselabs.com"

type JsonLd = Record<string, unknown>

type SeoOptions = {
  description?: string
  index?: boolean
  jsonLd?: JsonLd | JsonLd[]
}

function upsertMeta(name: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!element) {
    element = document.createElement("meta")
    element.setAttribute("name", name)
    document.head.appendChild(element)
  }
  element.setAttribute("content", content)
}

function upsertCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!element) {
    element = document.createElement("link")
    element.setAttribute("rel", "canonical")
    document.head.appendChild(element)
  }
  element.setAttribute("href", href)
}

function upsertJsonLd(data: JsonLd | JsonLd[] | undefined) {
  const existing = document.head.querySelector<HTMLScriptElement>("script[data-seo-jsonld]")
  if (!data) {
    existing?.remove()
    return
  }
  const element = existing ?? document.createElement("script")
  element.type = "application/ld+json"
  element.setAttribute("data-seo-jsonld", "")
  element.textContent = JSON.stringify(Array.isArray(data) ? { "@context": "https://schema.org", "@graph": data } : data)
  if (!existing) document.head.appendChild(element)
}

export function canonicalUrl(pathname: string) {
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "") || "/"
  return `${SITE_ORIGIN}${path}`
}

export function useTitle(title: string, options: SeoOptions = {}) {
  const { pathname } = useLocation()
  const description = options.description ?? `${title} from LotWise Labs.`
  const index = options.index !== false
  const jsonLdKey = JSON.stringify(options.jsonLd ?? null)

  useEffect(() => {
    document.title = title === "LotWise Labs" ? title : `${title} · LotWise Labs`
    upsertMeta("description", description)
    upsertMeta("robots", index ? "index, follow" : "noindex, follow")
    upsertCanonical(canonicalUrl(pathname))
    upsertJsonLd(jsonLdKey === "null" ? undefined : (JSON.parse(jsonLdKey) as JsonLd | JsonLd[]))
  }, [description, index, jsonLdKey, pathname, title])
}
