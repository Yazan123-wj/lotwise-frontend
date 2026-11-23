import { useEffect, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { CatalogBrowser, ProductCard } from "../components/catalog.tsx"
import SpecularButton from "../components/SpecularButton.tsx"
import { assurances, categories, type Assurance } from "../lib/live.ts"
import {
  activeBundle,
  bundleOffers,
  categoryBySlug,
  discountedUnit,
  formatMoney,
  productBySlug,
  productStock,
  relatedProducts,
  searchProducts,
  stockLabel,
  variationStock,
  visibleProducts,
} from "../lib/catalog.ts"
import { mediaSrc } from "../lib/media.ts"
import { canonicalUrl, SITE_ORIGIN, useTitle } from "../lib/useTitle.ts"
import { useCart } from "../state/cart.tsx"

function AssuranceIcon({ tone }: { tone: Assurance["tone"] }) {
  if (tone === "blue") {
    return <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M8.5 12.2 11 14.6 15.8 9.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  }
  if (tone === "orange") {
    return <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13a7 7 0 0 1 14 0v3.2a2 2 0 0 1-2 2H16v-4h3M5 14.2h3v4H7a2 2 0 0 1-2-2V13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M12 19.2v1.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
  }
  if (tone === "red") {
    return <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h11v8H3zM14 11h4l3 3v2h-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="7" cy="18" r="1.6" fill="currentColor" /><circle cx="17" cy="18" r="1.6" fill="currentColor" /></svg>
  }
  return <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7.5v1.2M9.4 10.2c.3-1 1.2-1.5 2.6-1.5 1.5 0 2.5.7 2.5 1.8 0 2.4-5.1 1.3-5.1 4.1 0 1.1 1 1.9 2.6 1.9 1.4 0 2.4-.6 2.7-1.7M12 16.8v1.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
}

function ProductAssurances({ items }: { items: Assurance[] }) {
  if (!items.length) return null
  return (
    <ul className="assurances">
      {items.map((item) => (
        <li className="assurance" key={`${item.tone}-${item.title}`}>
          <span className="assurance-icon" data-tone={item.tone}><AssuranceIcon tone={item.tone} /></span>
          <span>
            <strong>{item.title}</strong>
            <em>{item.detail}</em>
          </span>
        </li>
      ))}
    </ul>
  )
}

export function ShopPage() {
  useTitle("Catalog", {
    description: "Browse the LotWise Labs research catalogue by category, size, and availability.",
  })
  return (
    <CatalogBrowser
      products={visibleProducts()}
      title="LotWise research catalog"
      lede="Filter by area or type, then open a product to choose a size and add it to your cart."
    />
  )
}

export function CategoryPage() {
  const { slug = "" } = useParams()
  const category = categoryBySlug(slug)
  useTitle(category?.name ?? "Category", {
    description: category?.description || "LotWise Labs product category.",
    index: Boolean(category),
    jsonLd: category
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Catalog", item: `${SITE_ORIGIN}/shop` },
            { "@type": "ListItem", position: 2, name: category.name, item: canonicalUrl(`/categories/${category.slug}`) },
          ],
        }
      : undefined,
  })
  if (!category) {
    return (
      <div className="wrap" style={{ padding: "32px 0 64px" }}>
        <div className="error-box">
          <h1 className="display" style={{ fontSize: 48 }}>That category was not found.</h1>
          <SpecularButton tone="primary" to="/shop">Back to catalog</SpecularButton>
        </div>
      </div>
    )
  }
  const products = visibleProducts().filter((product) => product.categorySlug === category.slug)
  return (
    <CatalogBrowser
      products={products.length ? products : []}
      title={category.name}
      lede={category.description}
      lockedArea={category.slug}
    />
  )
}

export function SearchPage() {
  const [params] = useSearchParams()
  const query = params.get("q") ?? ""
  useTitle(query ? `Search “${query}”` : "Search", {
    description: "Search the LotWise Labs catalogue.",
    index: false,
  })
  const results = query.trim() ? searchProducts(query) : []
  return (
    <div className="wrap" style={{ paddingBottom: 64 }}>
      <header className="page-hero">
        <p className="eyebrow">Search</p>
        <h1 className="display">{query.trim() ? `Results for “${query.trim()}”` : "Search the catalogue"}</h1>
        <p className="lede">Search the live catalogue by name or code.</p>
      </header>
      {!query.trim() ? (
        <div className="empty">
          <p>Try a record name, such as vial, kit, or reference.</p>
          <form action="/search" className="lookup" style={{ marginTop: 12 }}>
            <input name="q" aria-label="Search" placeholder="Vial, kit, or reference" />
            <SpecularButton tone="primary" type="submit">Search</SpecularButton>
          </form>
        </div>
      ) : results.length === 0 ? (
        <div className="empty">
          <h2 className="display" style={{ fontSize: 40 }}>No matching records.</h2>
          <p>No products matched that search.</p>
        </div>
      ) : (
        <CatalogBrowser
          products={results}
          title={`${results.length} records`}
          lede={`Showing matches for “${query.trim()}”.`}
        />
      )}
    </div>
  )
}

export function ProductPage() {
  const { slug = "" } = useParams()
  const product = productBySlug(slug)
  const cart = useCart()
  const [variationId, setVariationId] = useState(product?.variations[0]?.id ?? "")
  const [image, setImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState<string | null>(null)
  const category = categories.find((item) => item.slug === product?.categorySlug)
  const prices = product?.variations.map((item) => item.price) ?? []
  const lowPrice = prices.length ? Math.min(...prices) : 0
  const highPrice = prices.length ? Math.max(...prices) : 0
  const inStock = product ? product.variations.some((item) => item.stockQuantity > 0) : false
  useTitle(product?.name ?? "Product", {
    description: product?.shortDescription || "LotWise Labs research product.",
    index: Boolean(product),
    jsonLd: product
      ? [
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
            image: (product.imagePaths.length ? product.imagePaths : ["/images/lotwise-vial.png"]).map((path) =>
              path.startsWith("http") ? path : `${SITE_ORIGIN}${mediaSrc(path)}`,
            ),
            brand: { "@type": "Brand", name: "LotWise Labs" },
            offers: {
              "@type": "AggregateOffer",
              url: canonicalUrl(`/products/${product.slug}`),
              priceCurrency: "USD",
              lowPrice,
              highPrice,
              offerCount: product.variations.length,
              availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            },
          },
        ]
      : undefined,
  })

  useEffect(() => {
    setVariationId(product?.variations[0]?.id ?? "")
    setImage(0)
    setQuantity(1)
    setNote(null)
  }, [product?.id])

  if (!product) {
    return (
      <div className="wrap" style={{ padding: "32px 0 64px" }}>
        <div className="error-box">
          <h1 className="display" style={{ fontSize: 48 }}>That product was not found.</h1>
          <SpecularButton tone="primary" to="/shop">Back to catalog</SpecularButton>
        </div>
      </div>
    )
  }

  const variation = product.variations.find((item) => item.id === variationId) ?? product.variations[0]
  const status = variationStock(variation.stockQuantity)
  const related = relatedProducts(product)
  const offers = bundleOffers(product, variation.price)
  const unitPrice = discountedUnit(variation.price, activeBundle(product, quantity)?.percentOff ?? 0)
  const selectedBundle = [...offers].reverse().find((offer) => quantity >= offer.minQuantity)?.minQuantity ?? 1

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/shop">Catalog</Link>
        <span>/</span>
        {category ? <Link to={`/categories/${category.slug}`}>{category.name}</Link> : null}
        <span>/</span>
        <span>{product.name}</span>
      </nav>
      <div className="product-layout">
        <div className="gallery">
          <div className="gallery-main">
            <img src={mediaSrc(product.imagePaths[image] ?? product.imagePaths[0] ?? "/images/lotwise-vial.png")} alt={product.name} width={682} height={1024} decoding="async" fetchPriority="high" />
          </div>
          {product.imagePaths.length > 1 ? (
            <div className="thumbs">
              {product.imagePaths.map((src, index) => (
                <button key={src} type="button" aria-label={`Image ${index + 1}`} aria-pressed={index === image} onClick={() => setImage(index)}>
                  <img src={mediaSrc(src)} alt="" width={120} height={120} loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          ) : null}
          <ProductAssurances items={assurances} />
        </div>
        <div className="product-copy">
          <p className="eyebrow">{category?.name} · Research use only</p>
          <h1 className="display">{product.name}</h1>
          <p className="meta">Catalogue code {product.baseSku}</p>
          <p className="price" style={{ fontSize: 28, marginTop: 10 }}>{formatMoney(unitPrice)} <span className="meta">· {variation.label}</span></p>
          <p className="meta">This price is only for the selected size. Each size is priced on its own.</p>
          <p className={status === "out-of-stock" ? "stock-out" : status === "low-stock" ? "stock-low" : "stock-in"}>{stockLabel(status)} · {variation.stockQuantity} available</p>
          <p className="prose">{product.shortDescription}</p>
          <div className="size-picker">
            <p className="size-picker__label">Choose size</p>
            <div className="size-chips" role="listbox" aria-label="Choose size">
              {product.variations.map((item) => {
                const itemStatus = variationStock(item.stockQuantity)
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="size-chip"
                    role="option"
                    aria-selected={item.id === variation.id}
                    disabled={item.stockQuantity <= 0}
                    onClick={() => {
                      setVariationId(item.id)
                      setQuantity(1)
                    }}
                  >
                    <strong>{item.label}</strong>
                    <span>{formatMoney(item.price)}</span>
                    <em>{itemStatus === "out-of-stock" ? "Out of stock" : stockLabel(itemStatus)}</em>
                  </button>
                )
              })}
            </div>
          </div>
          {offers.length > 1 ? (
            <fieldset className="bundles">
              <legend>Bundle & Save</legend>
              {offers.map((offer) => {
                const unavailable = variation.stockQuantity < offer.minQuantity
                const selected = offer.minQuantity === selectedBundle
                return (
                  <label key={offer.minQuantity} className={selected ? "bundle is-selected" : "bundle"} aria-disabled={unavailable}>
                    <input
                      type="radio"
                      name={`bundle-${product.id}`}
                      checked={selected}
                      disabled={unavailable}
                      onChange={() => setQuantity(offer.minQuantity)}
                    />
                    <span className="bundle-name">{offer.label}</span>
                    {offer.percentOff > 0 ? <span className="bundle-off">-{Number.isInteger(offer.percentOff) ? offer.percentOff : offer.percentOff.toFixed(1)}%</span> : null}
                    <span className="bundle-price">
                      <strong>{formatMoney(offer.unitPrice)}</strong>
                      {offer.percentOff > 0 ? <s>{formatMoney(variation.price)}</s> : null}
                    </span>
                  </label>
                )
              })}
            </fieldset>
          ) : null}
          <div className="buy-row">
            <div className="qty">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
              <span>{quantity}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => Math.min(variation.stockQuantity, value + 1))} disabled={variation.stockQuantity <= 0}>+</button>
            </div>
            <SpecularButton
              tone="primary"
              type="button"
              disabled={variation.stockQuantity <= 0}
              onClick={() => setNote(cart.addItem(product, variation.id, quantity) ?? "Added to your cart.")}
            >
              Add to cart
            </SpecularButton>
            <SpecularButton tone="ghost" to="/cart">Review cart</SpecularButton>
          </div>
          {note ? <p className="notice">{note}</p> : null}
          {productStock(product) === "out-of-stock" ? (
            <p className="notice">This product is currently out of stock. Purchase actions stay disabled.</p>
          ) : null}
          {product.sections?.length ? (
            <div className="product-sections">
              {product.sections.map((section) => (
                <section key={`${section.title}-${section.subtitle}`}>
                  {section.title ? <h2 className="display">{section.title}</h2> : null}
                  {section.subtitle ? <p>{section.subtitle}</p> : null}
                </section>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      {related.length > 0 ? (
        <section style={{ paddingBottom: 64 }}>
          <h2 className="display" style={{ fontSize: 42, marginBottom: 16 }}>Related records</h2>
          <div className="rail">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      ) : null}
    </div>
  )
}
