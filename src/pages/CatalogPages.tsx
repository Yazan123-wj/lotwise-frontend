import { useEffect, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { CatalogBrowser, ProductCard } from "../components/catalog.tsx"
import SpecularButton from "../components/SpecularButton.tsx"
import { categories } from "../data/content.ts"
import {
  categoryBySlug,
  formatMoney,
  minPrice,
  productBySlug,
  productStock,
  relatedProducts,
  searchProducts,
  stockLabel,
  variationStock,
  visibleProducts,
} from "../lib/catalog.ts"
import { useTitle } from "../lib/useTitle.ts"
import { useCart } from "../state/cart.tsx"

export function ShopPage() {
  useTitle("Catalog")
  return (
    <CatalogBrowser
      products={visibleProducts()}
      title="LotWise research catalog"
      lede="Filter by area or type, then open a record. Prices and option labels are sample figures."
    />
  )
}

export function CategoryPage() {
  const { slug = "" } = useParams()
  const category = categoryBySlug(slug)
  useTitle(category?.name ?? "Category")
  if (!category) {
    return (
      <div className="wrap" style={{ padding: "32px 0 64px" }}>
        <div className="error-box">
          <h1 className="display" style={{ fontSize: 48 }}>That record is not in the wireframe data.</h1>
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
  useTitle(query ? `Search “${query}”` : "Search")
  const results = query.trim() ? searchProducts(query) : []
  return (
    <div className="wrap" style={{ paddingBottom: 64 }}>
      <header className="page-hero">
        <p className="eyebrow">Search</p>
        <h1 className="display">{query.trim() ? `Results for “${query.trim()}”` : "Search the catalogue"}</h1>
        <p className="lede">Search compares your words with the sample catalogue in this browser.</p>
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
          <p>That record is not in the wireframe catalogue.</p>
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
  useTitle(product?.name ?? "Record")

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
          <h1 className="display" style={{ fontSize: 48 }}>That product is not in the sample catalogue.</h1>
          <SpecularButton tone="primary" to="/shop">Back to catalog</SpecularButton>
        </div>
      </div>
    )
  }

  const variation = product.variations.find((item) => item.id === variationId) ?? product.variations[0]
  const status = variationStock(variation.stockQuantity)
  const related = relatedProducts(product)
  const category = categories.find((item) => item.slug === product.categorySlug)

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
            <img src={product.imagePaths[image] ?? product.imagePaths[0]} alt="" />
          </div>
          {product.imagePaths.length > 1 ? (
            <div className="thumbs">
              {product.imagePaths.map((src, index) => (
                <button key={src} type="button" aria-label={`Image ${index + 1}`} aria-pressed={index === image} onClick={() => setImage(index)}>
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="product-copy">
          <p className="eyebrow">{category?.name} · Research use only</p>
          <h1 className="display">{product.name}</h1>
          <p className="meta">Catalogue code {product.baseSku}</p>
          <p className="price" style={{ fontSize: 28, marginTop: 10 }}>{formatMoney(variation.price)} <span className="meta">/ record</span></p>
          <p className="meta">Set of 10 · {formatMoney(variation.price * 10)}. The same price, times ten. Not a discount tier.</p>
          {minPrice(product) !== variation.price ? <p className="meta">Other options start at {formatMoney(minPrice(product))}.</p> : null}
          <p className={status === "out-of-stock" ? "stock-out" : status === "low-stock" ? "stock-low" : "stock-in"}>{stockLabel(status)} · {variation.stockQuantity} in the sample file</p>
          <p className="prose">{product.shortDescription}</p>
          <div className="options" role="listbox" aria-label="Sample options">
            {product.variations.map((item) => (
              <button
                key={item.id}
                type="button"
                className="option"
                aria-pressed={item.id === variation.id}
                onClick={() => {
                  setVariationId(item.id)
                  setQuantity(1)
                }}
              >
                <span>
                  <strong>{item.label}</strong>
                  <span className="meta"> {item.sku} · {stockLabel(variationStock(item.stockQuantity))}</span>
                </span>
                <span>{formatMoney(item.price)}</span>
              </button>
            ))}
          </div>
          <p className="meta">Each option is a sample figure on this record. Quantity discounts are not listed.</p>
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
              onClick={() => setNote(cart.addItem(product, variation.id, quantity) ?? "Added to the cart in this browser.")}
            >
              Add to cart
            </SpecularButton>
            <SpecularButton tone="ghost" to="/cart">Review cart</SpecularButton>
          </div>
          {note ? <p className="notice">{note}</p> : null}
          {productStock(product) === "out-of-stock" ? (
            <p className="notice">This sample is intentionally out of stock in the wireframe. Purchase actions stay disabled. No backorder or fulfilment promise is implied.</p>
          ) : null}
          <div className="prose">
            <h2 className="display" style={{ fontSize: 32, marginBottom: 8 }}>About this record</h2>
            <p>{product.description}</p>
          </div>
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
