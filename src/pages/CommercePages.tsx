import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { shippingMethods } from "../data/content.ts"
import SpecularButton from "../components/SpecularButton.tsx"
import { api } from "../lib/api.ts"
import { formatDate, formatMoney, quoteDiscount } from "../lib/catalog.ts"
import { useTitle } from "../lib/useTitle.ts"
import { useCart } from "../state/cart.tsx"
import { sessionError, useSession } from "../state/session.tsx"
import type { Address, Receipt } from "../types.ts"

type PlacedOrder = {
  id: string
  orderNumber: string
  status: string
  subtotal: number
  discountAmount: number
  discountCode: string | null
  total: number
  createdAt: string
  items: Array<{ sku: string; name: string; quantity: number; unitPrice: number }>
  contactName: string
  contactEmail: string
  contactPhone: string
  shippingAddress: Address
  shippingMethod: string
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
      cart.setServerDiscount({ code, amount: 0, applied: null, message: "Sign in to apply a referral reward code." })
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
        <h1 className="display">Your cart</h1>
        <p className="lede">Review items before checkout. Shipping is confirmed after you place the order.</p>
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
            <form className="lookup" style={{ marginTop: 12 }} onSubmit={applyCode}>
              <input aria-label="Discount code" value={code} placeholder="Discount or reward code" onChange={(event) => setCode(event.target.value)} />
              <SpecularButton tone="ghost" type="submit">Apply</SpecularButton>
            </form>
            {cart.discountMessage ? <p className="notice">{cart.discountMessage}</p> : null}
            {cart.appliedCode ? <p className="notice">{cart.appliedCode} applied.</p> : null}
            <div className="totals">
              <div><span>Subtotal</span><span>{formatMoney(cart.subtotal)}</span></div>
              <div><span>Discount</span><span>{formatMoney(cart.discountAmount)}</span></div>
              <div><span>Shipping</span><span>Confirmed after order</span></div>
              <p><strong>Total</strong><strong>{formatMoney(cart.total)}</strong></p>
            </div>
            <p className="meta">Card payment is not collected yet. Your order will be saved as awaiting payment.</p>
            {session.attribution.attached ? <p className="notice">A referral link is attached to this browser.</p> : null}
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
  const [formError, setFormError] = useState("")
  const [busy, setBusy] = useState(false)
  const [address, setAddress] = useState<Address>(emptyAddress)
  const [shipping, setShipping] = useState(shippingMethods[0].id)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!session.customer) {
      setFormError("Sign in to place your order.")
      return
    }
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
    setFormError("")
    if (Object.keys(nextErrors).length || cart.lines.length === 0) return
    const method = shippingMethods.find((item) => item.id === shipping) ?? shippingMethods[0]
    setBusy(true)
    try {
      const response = await api<{ order: PlacedOrder }>("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          lines: cart.lines.map((line) => ({ sku: line.sku, quantity: line.quantity })),
          discountCode: cart.appliedCode,
          name,
          email,
          phone,
          shippingAddress: address,
          shippingMethod: method.label,
        }),
      })
      const order = response.order
      const receipt: Receipt = {
        reference: order.orderNumber,
        createdAt: order.createdAt,
        name: order.contactName,
        email: order.contactEmail,
        phone: order.contactPhone,
        shippingAddress: order.shippingAddress,
        shippingMethodLabel: order.shippingMethod,
        items: order.items.map((item, index) => ({
          id: `${order.id}-${index}`,
          productId: "",
          variationId: "",
          name: item.name,
          sku: item.sku,
          variationLabel: "",
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        subtotal: order.subtotal,
        discountAmount: order.discountAmount,
        discountCode: order.discountCode,
        total: order.total,
        referral: cart.referral,
        note: "Your order is saved and awaiting payment. We will collect payment once checkout integration is live.",
      }
      cart.completeOrder(receipt)
      cart.addAddress(address)
      navigate("/order-confirmation")
    } catch (error) {
      setFormError(sessionError(error, "Your order could not be placed."))
    } finally {
      setBusy(false)
    }
  }

  if (!session.ready) {
    return (
      <div className="wrap" style={{ paddingBottom: 64 }}>
        <p className="meta">Loading checkout…</p>
      </div>
    )
  }

  return (
    <div className="wrap" style={{ paddingBottom: 64 }}>
      <header className="page-hero">
        <p className="eyebrow">Checkout</p>
        <h1 className="display">Place your order</h1>
        <p className="lede">
          Orders are stored on your account as awaiting payment. Card payment will be added once the payment provider is connected.
        </p>
      </header>
      {!session.customer ? (
        <div className="account-empty">
          <h2>Sign in to checkout</h2>
          <p className="lede">Create an account or sign in so we can save your order and show it under Account → Orders.</p>
          <div className="account-empty__actions">
            <SpecularButton tone="primary" to="/account/sign-in">Sign in</SpecularButton>
            <SpecularButton tone="ghost" to="/account/register">Create account</SpecularButton>
          </div>
        </div>
      ) : cart.lines.length === 0 ? (
        <div className="empty">
          <p>Add a product before checking out.</p>
          <SpecularButton tone="primary" to="/shop">Browse catalogue</SpecularButton>
        </div>
      ) : (
        <form className="two" onSubmit={onSubmit}>
          <div className="panel">
            <h2>Contact</h2>
            <label className="field"><span>Name</span><input name="name" defaultValue={session.customer.name} required /><em className="error">{errors.name}</em></label>
            <label className="field"><span>Email</span><input name="email" type="email" defaultValue={session.customer.email} required /><em className="error">{errors.email}</em></label>
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
            <p className="notice">Shipping rates are confirmed after the order. Payment is not collected on this page yet.</p>
            {formError ? <p className="notice">{formError}</p> : null}
            <SpecularButton tone="primary" type="submit" disabled={busy}>{busy ? "Placing order…" : "Place order"}</SpecularButton>
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
              <div><span>Shipping</span><span>Confirmed after order</span></div>
              <p><strong>Total</strong><strong>{formatMoney(cart.total)}</strong></p>
            </div>
            {session.attribution.attached ? <p className="notice">A referral link is attached to this browser.</p> : null}
          </aside>
        </form>
      )}
    </div>
  )
}

export function ConfirmationPage() {
  useTitle("Order confirmation")
  const { receipt } = useCart()
  if (!receipt) {
    return (
      <div className="wrap" style={{ padding: "32px 0 64px" }}>
        <div className="empty">
          <h1 className="display" style={{ fontSize: 48 }}>No order confirmation here.</h1>
          <p>Place an order at checkout to see this page.</p>
          <SpecularButton tone="primary" to="/checkout">Go to checkout</SpecularButton>
        </div>
      </div>
    )
  }
  return (
    <div className="wrap" style={{ paddingBottom: 64 }}>
      <header className="page-hero">
        <p className="eyebrow">Order placed</p>
        <h1 className="display">Thank you</h1>
        <p className="lede">{receipt.note}</p>
      </header>
      <div className="panel">
        <p><strong>{receipt.reference}</strong></p>
        <p className="meta">{formatDate(receipt.createdAt)} · Awaiting payment</p>
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
        <p style={{ marginTop: 12 }}><strong>Total {formatMoney(receipt.total)}</strong></p>
        {receipt.discountCode ? <p className="meta">Code {receipt.discountCode} · {formatMoney(receipt.discountAmount)}</p> : null}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          <SpecularButton tone="primary" to="/account/orders">View orders</SpecularButton>
          <SpecularButton tone="ghost" to="/shop">Continue browsing</SpecularButton>
        </div>
      </div>
    </div>
  )
}
