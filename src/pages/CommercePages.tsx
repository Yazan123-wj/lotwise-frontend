import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { shippingMethods } from "../data/content.ts"
import SpecularButton from "../components/SpecularButton.tsx"
import { api } from "../lib/api.ts"
import { formatDate, formatMoney, quoteDiscount } from "../lib/catalog.ts"
import { useTitle } from "../lib/useTitle.ts"
import { useCart } from "../state/cart.tsx"
import { sessionError, useSession } from "../state/session.tsx"
import type { Address } from "../types.ts"

function readRecordedOrder(): { orderNumber?: string; status?: string; error?: string } | null {
  try {
    const raw = sessionStorage.getItem("lotwise-referral-order")
    return raw ? JSON.parse(raw) as { orderNumber?: string; status?: string; error?: string } : null
  } catch {
    return null
  }
}

const emptyAddress: Address = {
  line1: "",
  line2: "",
  city: "",
  region: "",
  postalCode: "",
  country: "",
}

export function CartPage() {
  useTitle("Cart")
  const cart = useCart()
  const session = useSession()
  const [code, setCode] = useState(cart.discountInput)
  async function applyCode(event: FormEvent) {
    event.preventDefault()
    cart.setDiscountInput(code)
    cart.setServerDiscount(null)
    const local = quoteDiscount(cart.subtotal, code)
    if (local.applied || !code.trim()) return
    if (!session.customer) {
      cart.setServerDiscount({ code, amount: 0, applied: null, message: local.message })
      return
    }
    try {
      const quote = await api<{ applied: string | null; amount: number; message: string | null }>("/api/discounts/quote", {
        method: "POST",
        body: JSON.stringify({ code, lines: cart.lines.map((line) => ({ sku: line.sku, quantity: line.quantity })) }),
      })
      cart.setServerDiscount({ code, amount: quote.amount, applied: quote.applied, message: quote.message })
    } catch (error) {
      cart.setServerDiscount({ code, amount: 0, applied: null, message: sessionError(error, "That code could not be checked.") })
    }
  }
  return (
    <div className="wrap" style={{ paddingBottom: 64 }}>
      <header className="page-hero">
        <p className="eyebrow">Cart</p>
        <h1 className="display">Records in this browser</h1>
        <p className="lede">Items stay in this browser. Prices are sample figures and are not reserved.</p>
      </header>
      {cart.lines.length === 0 ? (
        <div className="empty">
          <h2 className="display" style={{ fontSize: 40 }}>Your cart is empty.</h2>
          <SpecularButton tone="primary" to="/shop">Continue browsing</SpecularButton>
        </div>
      ) : (
        <div className="two">
          <div>
            {cart.lines.map((line) => (
              <article className="line" key={line.key}>
                <img src={line.image} alt="" />
                <div>
                  <Link to={`/products/${line.slug}`}><strong>{line.name}</strong></Link>
                  <p className="meta">{line.sku} · {line.variationLabel}</p>
                  <div className="qty" style={{ marginTop: 8 }}>
                    <button type="button" aria-label={`Decrease ${line.name}`} onClick={() => cart.setQuantity(line.key, line.quantity - 1)}>−</button>
                    <span>{line.quantity}</span>
                    <button type="button" aria-label={`Increase ${line.name}`} onClick={() => cart.setQuantity(line.key, line.quantity + 1)}>+</button>
                  </div>
                  <button className="text-btn" type="button" onClick={() => cart.removeLine(line.key)}>Remove</button>
                </div>
                <strong>{formatMoney(line.unitPrice * line.quantity)}</strong>
              </article>
            ))}
          </div>
          <aside className="panel">
            <h2 className="display" style={{ fontSize: 32 }}>Summary</h2>
            <form
              className="lookup"
              style={{ marginTop: 12 }}
              onSubmit={applyCode}
            >
              <input aria-label="Discount code" value={code} placeholder="DEMO10 or FIXED5" onChange={(event) => setCode(event.target.value)} />
              <SpecularButton tone="ghost" type="submit">Apply</SpecularButton>
            </form>
            <p className="meta">DEMO10 and FIXED5 can be previewed in the cart. Usage counts are sample numbers.</p>
            {cart.discountMessage ? <p className="notice">{cart.discountMessage}</p> : null}
            {cart.appliedCode ? <p className="notice">{cart.appliedCode} is attached in this browser.</p> : null}
            <div className="totals">
              <div><span>Subtotal</span><span>{formatMoney(cart.subtotal)}</span></div>
              <div><span>Discount</span><span>{formatMoney(cart.discountAmount)}</span></div>
              <div><span>Shipping</span><span>Not quoted</span></div>
              <p><strong>Provisional total</strong><strong>{formatMoney(cart.total)}</strong></p>
            </div>
            <p className="meta">This total uses sample prices in the browser. It is not server-validated and does not include shipping.</p>
            {session.attribution.attached ? <p className="notice">A referral link is attached to this browser. It does not change this total.</p> : null}
            <SpecularButton tone="primary" to="/checkout" style={{ marginTop: 16 }}>Checkout</SpecularButton>
          </aside>
        </div>
      )}
    </div>
  )
}

export function CheckoutPage() {
  useTitle("Checkout")
  const cart = useCart()
  const session = useSession()
  const navigate = useNavigate()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [address, setAddress] = useState<Address>(emptyAddress)
  const [shipping, setShipping] = useState(shippingMethods[0].id)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get("name") ?? "").trim()
    const email = String(data.get("email") ?? "").trim()
    const phone = String(data.get("phone") ?? "").trim()
    const nextErrors: Record<string, string> = {}
    if (!name) nextErrors.name = "Enter a name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter an email address."
    if (!phone) nextErrors.phone = "Enter a phone number."
    if (!address.line1.trim()) nextErrors.line1 = "Enter an address line."
    if (!address.city.trim()) nextErrors.city = "Enter a city."
    if (!address.region.trim()) nextErrors.region = "Enter a region."
    if (!address.postalCode.trim()) nextErrors.postalCode = "Enter a postal code."
    if (!address.country.trim()) nextErrors.country = "Enter a country."
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length || cart.lines.length === 0) return
    const method = shippingMethods.find((item) => item.id === shipping) ?? shippingMethods[0]
    const lines = cart.lines.map((line) => ({ sku: line.sku, quantity: line.quantity }))
    const discountCode = cart.appliedCode
    const receipt = cart.placeDemonstration({
      name,
      email,
      phone,
      shippingAddress: address,
      shippingMethodLabel: method.label,
    })
    if (!receipt) return
    if (session.customer) {
      try {
        const order = await api<{ orderNumber: string; status: string }>("/api/orders", {
          method: "POST",
          body: JSON.stringify({ lines, discountCode }),
        })
        sessionStorage.setItem("lotwise-referral-order", JSON.stringify(order))
      } catch (error) {
        sessionStorage.setItem("lotwise-referral-order", JSON.stringify({ error: sessionError(error, "The referral order was not recorded.") }))
      }
    } else {
      sessionStorage.removeItem("lotwise-referral-order")
    }
    navigate("/order-confirmation")
  }

  return (
    <div className="wrap" style={{ paddingBottom: 64 }}>
      <header className="page-hero">
        <p className="eyebrow">Checkout</p>
        <h1 className="display">Demonstration checkout</h1>
        <p className="lede">Guest checkout still creates a demonstration confirmation and does not take payment. A signed-in account also records an unpaid order for the referral program.</p>
      </header>
      {cart.lines.length === 0 ? (
        <div className="empty">
          <p>Add a placeholder product before using the checkout form.</p>
          <SpecularButton tone="primary" to="/shop">Browse catalogue</SpecularButton>
        </div>
      ) : (
        <form className="two" onSubmit={onSubmit}>
          <div className="panel">
            <h2>Contact</h2>
            <label className="field"><span>Name</span><input name="name" required /><em className="error">{errors.name}</em></label>
            <label className="field"><span>Email</span><input name="email" type="email" required /><em className="error">{errors.email}</em></label>
            <label className="field"><span>Phone</span><input name="phone" required /><em className="error">{errors.phone}</em></label>
            <h2 style={{ marginTop: 12 }}>Shipping address</h2>
            <label className="field"><span>Address</span><input value={address.line1} onChange={(event) => setAddress({ ...address, line1: event.target.value })} /><em className="error">{errors.line1}</em></label>
            <label className="field"><span>Address line 2</span><input value={address.line2} onChange={(event) => setAddress({ ...address, line2: event.target.value })} /></label>
            <label className="field"><span>City</span><input value={address.city} onChange={(event) => setAddress({ ...address, city: event.target.value })} /><em className="error">{errors.city}</em></label>
            <label className="field"><span>Region</span><input value={address.region} onChange={(event) => setAddress({ ...address, region: event.target.value })} /><em className="error">{errors.region}</em></label>
            <label className="field"><span>Postal code</span><input value={address.postalCode} onChange={(event) => setAddress({ ...address, postalCode: event.target.value })} /><em className="error">{errors.postalCode}</em></label>
            <label className="field"><span>Country</span><input value={address.country} onChange={(event) => setAddress({ ...address, country: event.target.value })} /><em className="error">{errors.country}</em></label>
            <label className="field">
              <span>Shipping method</span>
              <select value={shipping} onChange={(event) => setShipping(event.target.value)}>
                {shippingMethods.map((method) => <option key={method.id} value={method.id}>{method.label}</option>)}
              </select>
            </label>
            <p className="notice">Shipping is confirmed with the account. This page does not quote a rate. Card numbers are not collected.</p>
            <SpecularButton tone="primary" type="submit">Place demonstration confirmation</SpecularButton>
          </div>
          <aside className="panel">
            <h2>Summary</h2>
            {cart.lines.map((line) => (
              <p key={line.key} className="meta" style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span>{line.name} · {line.variationLabel} × {line.quantity}</span>
                <span>{formatMoney(line.unitPrice * line.quantity)}</span>
              </p>
            ))}
            <div className="totals">
              <div><span>Subtotal</span><span>{formatMoney(cart.subtotal)}</span></div>
              <div><span>Discount {cart.appliedCode ?? ""}</span><span>{formatMoney(cart.discountAmount)}</span></div>
              <div><span>Shipping</span><span>Not quoted</span></div>
              <p><strong>Provisional total</strong><strong>{formatMoney(cart.total)}</strong></p>
            </div>
            {session.attribution.attached ? <p className="notice">A referral link is attached to this browser. It does not change this total.</p> : null}
          </aside>
        </form>
      )}
    </div>
  )
}

export function ConfirmationPage() {
  useTitle("Confirmation")
  const { receipt } = useCart()
  const recorded = readRecordedOrder()
  if (!receipt) {
    return (
      <div className="wrap" style={{ padding: "32px 0 64px" }}>
        <div className="empty">
          <h1 className="display" style={{ fontSize: 48 }}>No confirmation in this browser.</h1>
          <p>Complete the checkout form to preview this page. Doing so still does not place an order.</p>
          <SpecularButton tone="primary" to="/checkout">Go to checkout</SpecularButton>
        </div>
      </div>
    )
  }
  return (
    <div className="wrap" style={{ paddingBottom: 64 }}>
      <header className="page-hero">
        <p className="eyebrow">Demonstration</p>
        <h1 className="display">Confirmation preview</h1>
        <p className="lede">{receipt.note}</p>
      </header>
      <div className="panel">
        <p><strong>{receipt.reference}</strong></p>
        <p className="meta">{formatDate(receipt.createdAt)} · Payment not collected</p>
        {recorded?.orderNumber ? <p className="notice">Referral order {recorded.orderNumber} was recorded as {recorded.status}. A purchase-based referral does not qualify until an administrator marks it paid.</p> : null}
        {recorded?.error ? <p className="notice">{recorded.error}</p> : null}
        <p style={{ marginTop: 12 }}>{receipt.name}<br />{receipt.email}<br />{receipt.phone}</p>
        <p className="meta" style={{ marginTop: 12 }}>
          {receipt.shippingAddress.line1}{receipt.shippingAddress.line2 ? `, ${receipt.shippingAddress.line2}` : ""}
          <br />{receipt.shippingAddress.city}, {receipt.shippingAddress.region} {receipt.shippingAddress.postalCode}
          <br />{receipt.shippingAddress.country}
        </p>
        <p className="meta">{receipt.shippingMethodLabel}</p>
        <div style={{ marginTop: 16 }}>
          {receipt.items.map((item) => (
            <p key={item.id}>{item.name} · {item.sku} × {item.quantity} · {formatMoney(item.unitPrice * item.quantity)}</p>
          ))}
        </div>
        <p style={{ marginTop: 12 }}><strong>Provisional total {formatMoney(receipt.total)}</strong></p>
        {receipt.discountCode ? <p className="meta">Code {receipt.discountCode} · {formatMoney(receipt.discountAmount)}</p> : null}
        <SpecularButton tone="ghost" to="/shop" style={{ marginTop: 16 }}>Continue browsing</SpecularButton>
      </div>
    </div>
  )
}
