import { useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { categories } from "../data/content.ts"
import {
  categoryName,
  countInCategory,
  formatMoney,
  minPrice,
  priceLabel,
  productStock,
  sortProducts,
  stockLabel,
  type SortKey,
  visibleProducts,
} from "../lib/catalog.ts"
import SpecularButton from "./SpecularButton.tsx"
import { useCart } from "../state/cart.tsx"
import type { Product, StockStatus } from "../types.ts"

const pageSize = 8

const areaBanners: Record<string, { photo?: string; cutout?: string }> = {
  catalog: { cutout: "/images/lotwise-vial.png" },
  "sample-vials": { cutout: "/images/lotwise-vial.png" },
  "reference-materials": { photo: "/images/banners/area-reference.jpg" },
  "sample-kits": { photo: "/images/banners/area-kits.jpg" },
}

function AreaSwitch({
  lockedArea,
  area,
  total,
  onSelect,
}: {
  lockedArea?: string
  area: string
  total: number
  onSelect: (slug: string) => void
}) {
  const items = [
    {
      key: "all",
      name: "All records",
      count: lockedArea ? visibleProducts().length : total,
      href: "/shop",
    },
    ...categories.map((category) => ({
      key: category.slug,
      name: category.name,
      count: countInCategory(category.slug),
      href: `/categories/${category.slug}`,
    })),
  ]
  return (
    <nav className="area-tabs" aria-label="Catalogue areas">
      {items.map((item) => {
        const active = area === item.key
        const body = (
          <>
            {item.name}
            <span className="area-count">{item.count}</span>
          </>
        )
        if (lockedArea) {
          return (
            <Link key={item.key} className={active ? "on" : ""} to={item.href} aria-current={active ? "page" : undefined}>
              {body}
            </Link>
          )
        }
        return (
          <button key={item.key} className={active ? "on" : ""} type="button" aria-pressed={active} onClick={() => onSelect(item.key)}>
            {body}
          </button>
        )
      })}
    </nav>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const cart = useCart()
  const status = productStock(product)
  const [message, setMessage] = useState<string | null>(null)
  const variation = product.variations.find((item) => item.stockQuantity > 0) ?? product.variations[0]
  const available = Boolean(variation && variation.stockQuantity > 0)
  function add() {
    if (!variation || !available) return
    setMessage(cart.addItem(product, variation.id, 1))
  }
  return (
    <article className="product-card">
      <Link to={`/products/${product.slug}`}>
        <div className="media">
          <img src={product.imagePaths[0]} alt="" />
          <span className="chip">{categoryName(product.categorySlug)}</span>
        </div>
        <h3>{product.name}</h3>
      </Link>
      <p className="meta">{product.baseSku} · Research use only</p>
      <p className="price">{priceLabel(product)} <span className="meta">/ record</span></p>
      <p className="meta">Set of 10 · {formatMoney(minPrice(product) * 10)}</p>
      <p className={status === "out-of-stock" ? "stock-out" : status === "low-stock" ? "stock-low" : "stock-in"}>{stockLabel(status)}</p>
      <div className="box-foot">
        <button className="text-btn" type="button" disabled={!available} onClick={add}>
          {available ? "Add to cart" : "Unavailable"}
        </button>
        <button className="round-btn" type="button" disabled={!available} aria-label={available ? "Add to cart" : "Unavailable"} onClick={add}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3.5 8h9M8 3.5v9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {message ? <p className="meta">{message}</p> : null}
    </article>
  )
}

export function CatalogBrowser({
  products,
  title,
  lede,
  lockedArea,
}: {
  products: Product[]
  title: string
  lede: string
  lockedArea?: string
}) {
  const [params, setParams] = useSearchParams()
  const area = lockedArea ?? params.get("area") ?? "all"
  const availability = (params.get("availability") ?? "all") as StockStatus | "all"
  const sort = (params.get("sort") ?? "featured") as SortKey
  const view = params.get("view") === "all" ? "all" : "area"
  const page = Math.max(1, Number(params.get("page") ?? "1") || 1)

  const filtered = useMemo(() => {
    const next = products.filter((product) => {
      if (area !== "all" && product.categorySlug !== area) return false
      if (availability !== "all" && productStock(product) !== availability) return false
      return true
    })
    return sortProducts(next, sort)
  }, [area, availability, products, sort])

  function update(patch: Record<string, string>) {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([key, value]) => {
      if (!value || value === "all" || value === "featured" || value === "area" || value === "1") next.delete(key)
      else next.set(key, value)
    })
    if (!("page" in patch)) next.delete("page")
    setParams(next)
  }

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)
  const groups = categories
    .map((category) => ({
      category,
      items: filtered.filter((product) => product.categorySlug === category.slug),
    }))
    .filter((group) => (area === "all" ? true : group.category.slug === area))

  const activeCategory = categories.find((category) => category.slug === area)
  const activeIndex = categories.findIndex((category) => category.slug === area)
  const bannerTone = activeCategory?.slug ?? "catalog"
  const bannerArt = areaBanners[bannerTone] ?? {}
  const bannerTitle = activeCategory?.name ?? title
  const bannerLede = activeCategory?.description ?? lede
  const bannerKicker = activeCategory
    ? `Area ${String(activeIndex + 1).padStart(2, "0")} · ${countInCategory(activeCategory.slug)} records`
    : `${visibleProducts().length} records · ${categories.filter((item) => countInCategory(item.slug) > 0).length} areas`

  return (
    <div className="wrap" style={{ paddingBottom: 64 }}>
      <section
        className="catalog-banner"
        data-tone={bannerTone}
        style={{ marginTop: 22, backgroundImage: bannerArt.photo ? `url(${bannerArt.photo})` : undefined }}
      >
        <div className="banner-copy">
          <p className="eyebrow">{bannerKicker}</p>
          <h1 className="display">{bannerTitle}</h1>
          <p>{bannerLede}</p>
          {activeCategory && !lockedArea ? (
            <Link className="banner-cta" to={`/categories/${activeCategory.slug}`}>View collection</Link>
          ) : null}
        </div>
        {bannerArt.cutout ? (
          <div className="banner-figure">
            <img className="cutout" src={bannerArt.cutout} alt="" />
          </div>
        ) : null}
      </section>
      <AreaSwitch lockedArea={lockedArea} area={area} total={products.length} onSelect={(slug) => update({ area: slug })} />

      <div className="catalog-tools">
      <div className="filters">
        <label>
          Availability
          <select value={availability} onChange={(event) => update({ availability: event.target.value })}>
            <option value="all">All</option>
            <option value="in-stock">In stock</option>
            <option value="low-stock">Low stock</option>
            <option value="out-of-stock">Out of stock</option>
          </select>
        </label>
        <label>
          Sort
          <select value={sort} onChange={(event) => update({ sort: event.target.value })}>
            <option value="featured">Featured</option>
            <option value="name">Name</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
          </select>
        </label>
      </div>
      <div className="seg">
        <button type="button" aria-pressed={view === "area"} onClick={() => update({ view: "area" })}>By area</button>
        <button type="button" aria-pressed={view === "all"} onClick={() => update({ view: "all" })}>All</button>
        <span className="meta">{filtered.length} of {products.length}</span>
      </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <h2 className="display" style={{ fontSize: 40 }}>No records in this view.</h2>
          <p className="lede">Try another area, or clear the availability filter. Awaiting Items is an empty sample category.</p>
        </div>
      ) : view === "all" ? (
        <>
          <div className="grid-cards">
            {paged.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
          <div className="pager">
            <SpecularButton tone="ghost" type="button" disabled={page <= 1} onClick={() => update({ page: String(page - 1), view: "all", area, availability, sort })}>Previous</SpecularButton>
            <span className="meta">Page {page} of {pages}</span>
            <SpecularButton tone="ghost" type="button" disabled={page >= pages} onClick={() => update({ page: String(page + 1), view: "all", area, availability, sort })}>Next</SpecularButton>
          </div>
        </>
      ) : (
        groups.map((group) => (
          <section className="group" key={group.category.id}>
            {area === "all" ? (
              <div className="group-head">
                <div>
                  <p className="eyebrow">{group.items.length} records</p>
                  <h2 className="display">{group.category.name}</h2>
                  <p className="lede">{group.category.description}</p>
                </div>
                <SpecularButton tone="ghost" to={`/categories/${group.category.slug}`}>View all</SpecularButton>
              </div>
            ) : null}
            {group.items.length === 0 ? (
              <div className="empty">No other sample products are in this category.</div>
            ) : (
              <div className="grid-cards">
                {group.items.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            )}
          </section>
        ))
      )}
    </div>
  )
}
