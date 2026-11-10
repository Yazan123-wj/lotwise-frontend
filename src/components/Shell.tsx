import { useEffect, useId, useState, type AnimationEvent, type MouseEvent as ReactMouseEvent, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import { companyLinks, policyLinks } from "../data/content.ts"
import { announcement, categories, whatsapp } from "../lib/live.ts"
import AnimatedContent from "./AnimatedContent.tsx"
import CardNav from "./CardNav.tsx"
import SpecularButton from "./SpecularButton.tsx"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { countInCategory, formatMoney, searchProducts, visibleProducts } from "../lib/catalog.ts"
import { useCart } from "../state/cart.tsx"

const AGE_KEY = "lotwise-entered"

function hasEntered() {
  try {
    return localStorage.getItem(AGE_KEY) === "1"
  } catch {
    return false
  }
}

function RouterLink({
  href,
  children,
  ...props
}: {
  href?: string
  className?: string
  children?: ReactNode
  tabIndex?: number
  "aria-label"?: string
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void
}) {
  return <Link to={href || "/"} {...props}>{children}</Link>
}

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="8" cy="8" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 12.2 16 16" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}
function IconBag() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M4 6.5h10l-.8 8.2a1 1 0 0 1-1 .8H5.8a1 1 0 0 1-1-.8L4 6.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 6.2V5a2 2 0 0 1 4 0v1.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}
function IconProfile() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="9" cy="6.2" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.8 15.2a5.2 5.2 0 0 1 10.4 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`logo ${className}`} aria-label="LotWise Labs, home">
      <img src="/brand/lotwise-logo.png" alt="" />
    </Link>
  )
}

export function StoreLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const cart = useCart()
  const [solid, setSolid] = useState(location.pathname !== "/")
  const [open, setOpen] = useState<"search" | "cart" | null>(null)
  const [cartLeaving, setCartLeaving] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [ageOk, setAgeOk] = useState(hasEntered)
  const searchId = useId()
  const home = location.pathname === "/"
  const ghost = home && !solid

  useEffect(() => {
    const onScroll = () => setSolid(!home || window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [home])

  useEffect(() => {
    setOpen(null)
    setCartLeaving(false)
    setMenuOpen(false)
    ScrollTrigger.refresh()
  }, [location.pathname])

  useEffect(() => {
    if (ageOk) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [ageOk])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeOverlay()
    }
    document.addEventListener("keydown", onKey)
    if (open !== "cart") return () => document.removeEventListener("keydown", onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previous
    }
  }, [open])

  function closeOverlay() {
    if (open === "cart" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCartLeaving(true)
      return
    }
    setCartLeaving(false)
    setOpen(null)
  }

  useEffect(() => {
    if (!cartLeaving) return
    const timer = window.setTimeout(() => {
      setCartLeaving(false)
      setOpen(null)
    }, 420)
    return () => window.clearTimeout(timer)
  }, [cartLeaving])

  function onCartMotionEnd(event: AnimationEvent<HTMLElement>) {
    if (event.target !== event.currentTarget || event.animationName !== "drawer-out") return
    setCartLeaving(false)
    setOpen(null)
  }

  const results = query.trim() ? searchProducts(query).slice(0, 6) : []

  return (
    <div className={home ? "store-home" : "store"}>
      <a className="skip" href="#main">Skip to content</a>
      <div className={ghost ? "topbar topbar-ghost" : "topbar topbar-solid"}>
        <div className="announce" aria-label={announcement.join(". ")}>
          <div className="announce-track">
            {[0, 1].map((copy) => (
              <p className="announce-group" key={copy} aria-hidden={copy === 1 || undefined}>
                {announcement.map((line) => <span key={line}>{line}</span>)}
              </p>
            ))}
          </div>
        </div>
        <header className="nav">
          <CardNav
            logo="/brand/lotwise-logo.png"
            logoAlt="LotWise Labs, home"
            logoHref="/"
            theme={ghost ? "dark" : "light"}
            surface="glass"
            openOn="click"
            cardEffect="rise"
            ariaLabel="Primary"
            linkComponent={RouterLink}
            open={menuOpen}
            onOpenChange={(next) => {
              setMenuOpen(next)
              if (next) setOpen(null)
            }}
            actions={
              <div className={open === "search" ? "nav-search-slot is-open" : "nav-search-slot"}>
                {open === "search" ? (
                  <label className="nav-search">
                    <IconSearch />
                    <input
                      id={searchId}
                      autoFocus
                      value={query}
                      placeholder="Search"
                      aria-label="Search the catalogue"
                      onChange={(event) => setQuery(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && results[0]) {
                          navigate(`/products/${results[0].slug}`)
                          setQuery("")
                          setOpen(null)
                        }
                      }}
                    />
                    <button type="button" className="nav-search-close" aria-label="Close search" onClick={() => { setQuery(""); setOpen(null) }}>×</button>
                  </label>
                ) : (
                  <button className="icon-btn" type="button" aria-label="Search the catalogue" onClick={() => { setMenuOpen(false); setOpen("search") }}>
                    <IconSearch />
                  </button>
                )}
                <Link className="icon-btn" to="/account" aria-label="Account" aria-current={location.pathname.startsWith("/account") ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                  <IconProfile />
                </Link>
                <button className="cart-btn" type="button" aria-label={`Open cart, ${cart.count} ${cart.count === 1 ? "record" : "records"}`} onClick={() => { setMenuOpen(false); setCartLeaving(false); setOpen("cart") }}>
                  <IconBag />
                  <span className="cart-label">Cart</span>
                  <span className="count">{cart.count}</span>
                </button>
              </div>
            }
            items={[
              {
                label: "Catalog",
                description: "Vial records, reference lots, and kits.",
                links: [
                  { label: `All records · ${visibleProducts().length}`, href: "/shop" },
                  ...categories.map((category) => ({
                    label: `${category.name} · ${countInCategory(category.slug)}`,
                    href: `/categories/${category.slug}`,
                  })),
                ],
              },
              {
                label: "Company",
                description: "About this catalogue, questions, and contact.",
                links: companyLinks.map((link) => ({ label: link.label, href: link.to })),
              },
              {
                label: "Quality",
                description: "Certificates and the policies beside the records.",
                links: [
                  { label: "Certificates", href: "/quality" },
                  ...policyLinks.map((link) => ({ label: link.label, href: link.to })),
                ],
              },
            ]}
          />
          {open === "search" && query.trim() ? (
            <div className="nav-search-drop">
              {results.length === 0 ? <p className="meta">No matching records.</p> : results.map((product) => (
                <Link key={product.id} to={`/products/${product.slug}`} onClick={() => { setQuery(""); setOpen(null) }}>
                  <img src={product.imagePaths[0]} alt="" />
                  <span>
                    <strong>{product.name}</strong>
                    <span className="meta">{product.baseSku} · {formatMoney(Math.min(...product.variations.map((item) => item.price)))}</span>
                  </span>
                </Link>
              ))}
            </div>
          ) : null}
        </header>
      </div>

      <main id="main">
        {home ? (
          <Outlet />
        ) : (
          <AnimatedContent key={location.pathname} distance={100} duration={0.8} ease="power3.out" threshold={0.08}>
            <Outlet />
          </AnimatedContent>
        )}
      </main>

      <footer className="footer">
        <AnimatedContent className="wrap footer-grid" stagger={0.08} distance={40} duration={0.7} ease="power3.out">
          <div>
            <Logo />
            <p className="legal">Catalogue records on this site are for review. They are not offered for human or veterinary use, and they are not offered to diagnose, treat, cure, or prevent any condition.</p>
          </div>
          <div>
            <h2>Catalog</h2>
            <Link to="/shop">All records</Link>
            {categories.map((category) => (
              <Link key={category.id} to={`/categories/${category.slug}`}>{category.name}</Link>
            ))}
          </div>
          <div>
            <h2>Company</h2>
            {companyLinks.map((link) => <Link key={link.to} to={link.to}>{link.label}</Link>)}
            <Link to="/quality">Certificates</Link>
          </div>
          <div>
            <h2>Policies</h2>
            {policyLinks.map((link) => <Link key={link.to} to={link.to}>{link.label}</Link>)}
            <Link to="/cart">Cart</Link>
            <Link to="/checkout">Checkout</Link>
          </div>
        </AnimatedContent>
        <div className="wrap legal">© 2026 LotWise Labs.</div>
      </footer>

      {!ageOk ? createPortal(
        <div className="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-title">
          <div className="panel">
            <p className="eyebrow">Age check</p>
            <h1 id="age-title" className="display">You must be at least 18 to enter this site.</h1>
            <p className="age-statement">Research Use Only — All products sold on this website are intended for laboratory research purposes only. These products are not intended for human or veterinary use, consumption, diagnosis, treatment, or prevention of any disease. The products have not been evaluated or approved by the U.S. Food and Drug Administration (FDA). By purchasing, the customer agrees that all materials will be used solely for lawful research by qualified professionals and in compliance with applicable laws and regulations.</p>
            <div className="age-actions">
              <SpecularButton
                tone="ghost"
                type="button"
                onClick={() => { window.location.replace("https://www.google.com") }}
              >
                No, I'm not
              </SpecularButton>
              <SpecularButton
                tone="primary"
                type="button"
                onClick={() => {
                  localStorage.setItem(AGE_KEY, "1")
                  setAgeOk(true)
                }}
              >
                I am 18 or older
              </SpecularButton>
            </div>
          </div>
        </div>,
        document.body,
      ) : null}

      <a className="whatsapp" href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M20.5 3.5A11 11 0 0 0 2.1 17.8L1 23l5.3-1.1A11 11 0 0 0 12 23a11 11 0 0 0 8.5-19.5zM12 21a9 9 0 0 1-4.6-1.3l-.3-.2-3.1.8.8-3-.2-.3A9 9 0 1 1 12 21zm5-6.8c-.3-.1-1.6-.8-1.8-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.9 1.1-.1.2-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.3c.1-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4 4.7 4.7 0 0 0 3.2.6 2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.3c-.1-.2-.3-.2-.6-.3z" />
        </svg>
      </a>

      {open === "search" ? <button className="search-backdrop" type="button" aria-label="Close search" onClick={() => { setQuery(""); setOpen(null) }} /> : null}

      {open === "cart" ? (
        <>
          <button className={cartLeaving ? "drawer-backdrop is-closing" : "drawer-backdrop"} type="button" aria-label="Close cart" onClick={closeOverlay} />
          <aside className={cartLeaving ? "drawer is-closing" : "drawer"} role="dialog" aria-modal="true" aria-label="Cart" onAnimationEnd={onCartMotionEnd}>
            <div className="drawer-head">
              <h2 className="display" style={{ fontSize: 32 }}>Cart ({cart.count})</h2>
              <SpecularButton tone="ghost" type="button" onClick={closeOverlay}>Close</SpecularButton>
            </div>
            <div className="drawer-body">
              {cart.lines.length === 0 ? (
                <>
                  <p className="display" style={{ fontSize: 28 }}>Your cart is empty.</p>
                  <p className="lede">Add a product from the catalogue to get started.</p>
                  <SpecularButton tone="primary" to="/shop" onClick={() => setOpen(null)} style={{ marginTop: 16 }}>Browse catalogue</SpecularButton>
                </>
              ) : (
                <>
                  {cart.lines.map((line) => (
                    <div className="line" key={line.key}>
                      <img src={line.image} alt="" />
                      <div>
                        <strong>{line.name}</strong>
                        <p className="meta">{line.sku} · {line.variationLabel}</p>
                        <p>{formatMoney(line.unitPrice * line.quantity)}</p>
                      </div>
                      <button className="text-btn" type="button" onClick={() => cart.removeLine(line.key)}>Remove</button>
                    </div>
                  ))}
                  <div className="totals">
                    <div><span>Subtotal</span><span>{formatMoney(cart.subtotal)}</span></div>
                    <div><span>Discount</span><span>{formatMoney(cart.discountAmount)}</span></div>
                    <div><span>Shipping</span><span>Not quoted</span></div>
                    <p><strong>Provisional total</strong><strong>{formatMoney(cart.total)}</strong></p>
                  </div>
                  <div className="buy-row">
                    <SpecularButton tone="ghost" to="/cart" onClick={() => setOpen(null)}>Review cart</SpecularButton>
                    <SpecularButton tone="primary" to="/checkout" onClick={() => setOpen(null)}>Checkout</SpecularButton>
                  </div>
                </>
              )}
            </div>
          </aside>
        </>
      ) : null}
    </div>
  )
}

export function AdminFrame({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  return (
    <div className="admin">
      <aside className="admin-side">
        <Link to="/" className="logo" style={{ marginBottom: 16 }}><img src="/brand/lotwise-logo.png" alt="LotWise Labs" style={{ filter: "brightness(0) invert(1)", height: 40 }} /></Link>
        <p className="meta" style={{ color: "rgba(255,255,255,.65)", padding: "0 10px 12px" }}>Admin catalogue tools live at admin.lotwiselabs.com.</p>
        <NavLink to="/admin" end>Dashboard</NavLink>
        <NavLink to="/admin/products">Products</NavLink>
        <NavLink to="/admin/categories">Categories</NavLink>
        <NavLink to="/admin/inventory">Inventory</NavLink>
        <NavLink to="/admin/orders">Orders</NavLink>
        <NavLink to="/admin/customers">Customers</NavLink>
        <NavLink to="/admin/discounts">Discounts</NavLink>
        <NavLink to="/admin/affiliates">Affiliates</NavLink>
        <NavLink to="/admin/referrals">Referrals</NavLink>
        <NavLink to="/admin/homepage-content">Homepage</NavLink>
        <NavLink to="/admin/users">Users</NavLink>
        <NavLink to="/admin/settings">Settings</NavLink>
        <Link to="/shop">Storefront</Link>
      </aside>
      <div className="admin-main">
        <AnimatedContent key={pathname} distance={60} duration={0.7} ease="power3.out" stagger={0.06}>
          {children}
        </AnimatedContent>
      </div>
    </div>
  )
}
