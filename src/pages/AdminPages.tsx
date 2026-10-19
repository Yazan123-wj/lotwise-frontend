import { useState, type FormEvent, type ReactNode } from "react"
import { Link, Outlet, useParams } from "react-router-dom"
import { AdminFrame } from "../components/Shell.tsx"
import AnimatedContent from "../components/AnimatedContent.tsx"
import SpecularButton from "../components/SpecularButton.tsx"
import {
  affiliates,
  banners,
  categories,
  customers,
  discounts,
  sampleOrders,
} from "../data/content.ts"
import { products } from "../data/products.ts"
import { formatDate, formatMoney, productStock } from "../lib/catalog.ts"
import { useTitle } from "../lib/useTitle.ts"

function SavedNote({ text }: { text: string }) {
  return <p className="notice">{text} The catalogue was not updated. Refresh restores the sample files.</p>
}

export function AdminLayout() {
  useTitle("Admin")
  return (
    <AdminFrame>
      <Outlet />
    </AdminFrame>
  )
}

export function AdminLogin() {
  useTitle("Admin sign-in")
  const [note, setNote] = useState("")
  return (
    <div className="gate">
      <AnimatedContent trigger="mount" distance={60} duration={0.7} ease="power3.out">
      <form
        className="panel"
        onSubmit={(event) => {
          event.preventDefault()
          setNote("No account was accessed. The password was discarded. This screen is not an access check.")
        }}
      >
        <p className="eyebrow">Admin</p>
        <h1 className="display" style={{ fontSize: 48 }}>Sign-in layout</h1>
        <p className="lede">Opening the admin does not require this form. It does not start a session.</p>
        <label className="field"><span>Email</span><input type="email" required /></label>
        <label className="field"><span>Password</span><input type="password" required /></label>
        <SpecularButton tone="primary" type="submit">Submit form</SpecularButton>
        <SpecularButton tone="ghost" to="/admin">Open the wireframe</SpecularButton>
        {note ? <p className="notice">{note}</p> : null}
      </form>
      </AnimatedContent>
    </div>
  )
}

export function DashboardPage() {
  const units = products.reduce((sum, product) => sum + product.variations.reduce((inner, variation) => inner + variation.stockQuantity, 0), 0)
  const low = products.flatMap((product) => product.variations).filter((variation) => variation.stockQuantity > 0 && variation.stockQuantity <= 5).length
  return (
    <>
      <p className="eyebrow">Dashboard</p>
      <h1 className="display">Sample overview</h1>
      <p className="meta">Overview figures are calculated from the local sample files. They are not revenue.</p>
      <div className="stats">
        <article className="stat"><span className="meta">Sample orders</span><b>{sampleOrders.length}</b></article>
        <article className="stat"><span className="meta">Records</span><b>{products.length}</b></article>
        <article className="stat"><span className="meta">Units in sample file</span><b>{units}</b></article>
        <article className="stat"><span className="meta">Low-stock options</span><b>{low}</b></article>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Note</th></tr></thead>
          <tbody>
            {sampleOrders.map((order) => (
              <tr key={order.id}>
                <td><Link to={`/admin/orders/${order.id}`}>{order.orderNumber}</Link></td>
                <td>{order.customerName}</td>
                <td>{formatMoney(order.provisionalTotal)}</td>
                <td>{order.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function Table({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}

export function ProductsAdmin() {
  const [hidden, setHidden] = useState<string[]>([])
  const [note, setNote] = useState("")
  const rows = products.filter((product) => !hidden.includes(product.id))
  return (
    <>
      <p className="eyebrow">Products</p>
      <h1 className="display">Sample catalogue records</h1>
      <SpecularButton tone="primary" to="/admin/products/new">Add product form</SpecularButton>
      {note ? <SavedNote text={note} /> : null}
      <Table
        headers={["Name", "Code", "Area", "Stock", ""]}
        rows={rows.map((product) => [
          <Link to={`/admin/products/${product.id}`}>{product.name}</Link>,
          product.baseSku,
          product.categorySlug,
          productStock(product),
          <button className="text-btn" type="button" onClick={() => { setHidden([...hidden, product.id]); setNote("This only hides the sample row in this browser view.") }}>Hide</button>,
        ])}
      />
    </>
  )
}

export function ProductForm() {
  const { productId } = useParams()
  const product = products.find((item) => item.id === productId)
  const [note, setNote] = useState("")
  useTitle(product ? product.name : "Product form")
  return (
    <form className="panel" onSubmit={(event: FormEvent) => { event.preventDefault(); setNote("The edit form was submitted in this browser only.") }}>
      <h1 className="display">{product ? product.name : "Add product"}</h1>
      <p className="meta">Fields match the future catalogue model. Saving does not publish to the storefront.</p>
      <label className="field"><span>Name</span><input defaultValue={product?.name ?? ""} required /></label>
      <label className="field"><span>Code</span><input defaultValue={product?.baseSku ?? ""} required /></label>
      <label className="field"><span>Description</span><textarea defaultValue={product?.description ?? ""} /></label>
      <label className="field"><span>Price</span><input defaultValue={product ? String(product.variations[0]?.price ?? "") : ""} /></label>
      <label className="field">
        <span>Category</span>
        <select defaultValue={product?.categorySlug ?? categories[0].slug}>
          {categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
        </select>
      </label>
      <label className="field"><span>Image name</span><input type="file" /></label>
      <SpecularButton tone="primary" type="submit">Submit in this browser</SpecularButton>
      {note ? <SavedNote text={note} /> : null}
    </form>
  )
}

export function CategoriesAdmin() {
  const [hidden, setHidden] = useState<string[]>([])
  const [note, setNote] = useState("")
  return (
    <>
      <h1 className="display">Categories</h1>
      <SpecularButton tone="primary" to="/admin/categories/new">Add category form</SpecularButton>
      {note ? <SavedNote text={note} /> : null}
      <Table
        headers={["Name", "Records", "Order", ""]}
        rows={categories.filter((category) => !hidden.includes(category.id)).map((category) => [
          <Link to={`/admin/categories/${category.id}`}>{category.name}</Link>,
          products.filter((product) => product.categorySlug === category.slug).length,
          category.displayOrder,
          <button className="text-btn" type="button" onClick={() => { setHidden([...hidden, category.id]); setNote("The sample category returns on refresh.") }}>Hide</button>,
        ])}
      />
    </>
  )
}

export function CategoryForm() {
  const { categoryId } = useParams()
  const category = categories.find((item) => item.id === categoryId)
  const [note, setNote] = useState("")
  return (
    <form className="panel" onSubmit={(event) => { event.preventDefault(); setNote("Product assignment is visual.") }}>
      <h1 className="display">{category ? category.name : "Add category"}</h1>
      <label className="field"><span>Name</span><input defaultValue={category?.name ?? ""} required /></label>
      <label className="field"><span>Description</span><textarea defaultValue={category?.description ?? ""} /></label>
      <fieldset>
        <legend>Records</legend>
        {products.map((product) => (
          <label key={product.id} style={{ display: "block" }}>
            <input type="checkbox" defaultChecked={product.categorySlug === category?.slug} /> {product.name}
          </label>
        ))}
      </fieldset>
      <SpecularButton tone="primary" type="submit">Submit in this browser</SpecularButton>
      {note ? <SavedNote text={note} /> : null}
    </form>
  )
}

export function InventoryAdmin() {
  const [note, setNote] = useState("")
  const rows = products.flatMap((product) => product.variations.map((variation) => ({ product, variation })))
  return (
    <>
      <h1 className="display">Inventory</h1>
      <p className="meta">Sample stock by SKU and variation. Updates do not change the storefront.</p>
      {note ? <SavedNote text={note} /> : null}
      <Table
        headers={["SKU", "Record", "Option", "Qty", ""]}
        rows={rows.map(({ product, variation }) => [
          variation.sku,
          product.name,
          variation.label,
          variation.stockQuantity,
          <button className="text-btn" type="button" onClick={() => setNote(`${variation.sku} was not changed on the storefront.`)}>Mark reviewed</button>,
        ])}
      />
    </>
  )
}

export function OrdersAdmin() {
  const [status, setStatus] = useState<Record<string, string>>({})
  return (
    <>
      <h1 className="display">Orders</h1>
      <p className="meta">Sample orders. Status changes are labels in this view, not fulfilment.</p>
      <Table
        headers={["Order", "Customer", "Payment", "Fulfilment"]}
        rows={sampleOrders.map((order) => [
          <Link to={`/admin/orders/${order.id}`}>{order.orderNumber}</Link>,
          order.customerName,
          "Payment not collected",
          <select value={status[order.id] ?? order.fulfilmentStatus} onChange={(event) => setStatus({ ...status, [order.id]: event.target.value })}>
            {["placed", "processing", "fulfilled", "cancelled"].map((item) => <option key={item}>{item}</option>)}
          </select>,
        ])}
      />
    </>
  )
}

export function OrderAdminDetail() {
  const { orderId } = useParams()
  const order = sampleOrders.find((item) => item.id === orderId)
  const [status, setStatus] = useState(order?.fulfilmentStatus ?? "placed")
  if (!order) return <div className="error-box">That record is not in the wireframe data.</div>
  return (
    <article className="panel">
      <h1 className="display">{order.orderNumber}</h1>
      <p>{order.customerName} · {order.email} · {order.phone}</p>
      <p className="meta">{formatDate(order.placedAt)} · {order.note}</p>
      <p>{order.shippingAddress.line1}, {order.shippingAddress.city}</p>
      {order.items.map((item) => <p key={item.id}>{item.name} · {item.sku} × {item.quantity}</p>)}
      <label className="field"><span>Fulfilment label</span>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          {["placed", "processing", "fulfilled", "cancelled"].map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <p className="notice">Payment label stays “not collected”. No payment was recorded. Current label: {status}.</p>
    </article>
  )
}

export function CustomersAdmin() {
  return (
    <>
      <h1 className="display">Customers</h1>
      <p className="meta">Fictional sample customers. These are not real people.</p>
      <Table
        headers={["Name", "Email", "Orders"]}
        rows={customers.map((customer) => [
          <Link to={`/admin/customers/${customer.id}`}>{customer.name}</Link>,
          customer.email,
          sampleOrders.filter((order) => order.customerId === customer.id).length,
        ])}
      />
    </>
  )
}

export function CustomerDetail() {
  const { customerId } = useParams()
  const customer = customers.find((item) => item.id === customerId)
  if (!customer) return <div className="error-box">That record is not in the wireframe data.</div>
  const orders = sampleOrders.filter((order) => order.customerId === customer.id)
  return (
    <article className="panel">
      <h1 className="display">{customer.name}</h1>
      <p>{customer.email} · {customer.phone}</p>
      <p className="meta">{customer.address.line1}, {customer.address.city}</p>
      {orders.map((order) => <p key={order.id}><Link to={`/admin/orders/${order.id}`}>{order.orderNumber}</Link></p>)}
    </article>
  )
}

export function DiscountsAdmin() {
  const [hidden, setHidden] = useState<string[]>([])
  return (
    <>
      <h1 className="display">Discounts</h1>
      <SpecularButton tone="primary" to="/admin/discounts/new">Add discount form</SpecularButton>
      <Table
        headers={["Code", "Type", "Value", "Active", ""]}
        rows={discounts.filter((discount) => !hidden.includes(discount.id)).map((discount) => [
          <Link to={`/admin/discounts/${discount.id}`}>{discount.code}</Link>,
          discount.type,
          discount.type === "percentage" ? `${discount.value}%` : formatMoney(discount.value),
          discount.active ? "Active" : "Inactive",
          <button className="text-btn" type="button" onClick={() => setHidden([...hidden, discount.id])}>Hide</button>,
        ])}
      />
    </>
  )
}

export function DiscountForm() {
  const { discountId } = useParams()
  const discount = discounts.find((item) => item.id === discountId)
  const [note, setNote] = useState("")
  return (
    <form className="panel" onSubmit={(event) => { event.preventDefault(); setNote("The sample code returns on refresh and can still be used in the cart preview.") }}>
      <h1 className="display">{discount ? discount.code : "Add discount"}</h1>
      <label className="field"><span>Code</span><input defaultValue={discount?.code ?? ""} required /></label>
      <label className="field"><span>Type</span>
        <select defaultValue={discount?.type ?? "percentage"}><option value="percentage">Percentage</option><option value="fixed">Fixed</option></select>
      </label>
      <label className="field"><span>Value</span><input defaultValue={discount ? String(discount.value) : ""} /></label>
      <label className="field"><span>Minimum</span><input defaultValue={discount ? String(discount.minOrderValue) : "0"} /></label>
      <SpecularButton tone="primary" type="submit">Submit in this browser</SpecularButton>
      {note ? <SavedNote text={note} /> : null}
    </form>
  )
}

export function AffiliatesAdmin() {
  return (
    <>
      <h1 className="display">Affiliates</h1>
      <p className="meta">Links are placeholders. Visits and orders are not recorded.</p>
      <SpecularButton tone="primary" to="/admin/affiliates/new">Add affiliate form</SpecularButton>
      <Table
        headers={["Partner", "Code", "Visits", "Orders", "Active"]}
        rows={affiliates.map((affiliate) => [
          <Link to={`/admin/affiliates/${affiliate.id}`}>{affiliate.name}</Link>,
          affiliate.code,
          affiliate.visits,
          affiliate.orders,
          affiliate.active ? "Active" : "Inactive",
        ])}
      />
    </>
  )
}

export function AffiliateForm() {
  const { affiliateId } = useParams()
  const affiliate = affiliates.find((item) => item.id === affiliateId)
  const [note, setNote] = useState("")
  return (
    <form className="panel" onSubmit={(event) => { event.preventDefault(); setNote("The link was not published.") }}>
      <h1 className="display">{affiliate ? affiliate.name : "Add affiliate"}</h1>
      <label className="field"><span>Name</span><input defaultValue={affiliate?.name ?? ""} /></label>
      <label className="field"><span>Email</span><input defaultValue={affiliate?.email ?? ""} /></label>
      <label className="field"><span>Code</span><input defaultValue={affiliate?.code ?? ""} /></label>
      <label className="field"><span>Path</span><input defaultValue={affiliate?.linkPath ?? "/shop?ref="} /></label>
      <SpecularButton tone="primary" type="submit">Submit in this browser</SpecularButton>
      {note ? <SavedNote text={note} /> : null}
    </form>
  )
}

export function HomepageAdmin() {
  const [note, setNote] = useState("")
  return (
    <>
      <h1 className="display">Homepage content</h1>
      <p className="meta">Edit promotional slides and banners in this view. The public homepage still reads the original sample file.</p>
      {note ? <SavedNote text={note} /> : null}
      <Table
        headers={["Label", "Image", ""]}
        rows={banners.map((banner) => [
          banner.label,
          banner.image,
          <button className="text-btn" type="button" onClick={() => setNote(`${banner.label} was not published.`)}>Mark reviewed</button>,
        ])}
      />
    </>
  )
}

const sampleUsers = [
  { id: "usr_admin", name: "Sample administrator", email: "sample.admin@example.com", role: "Admin", active: true },
  { id: "usr_content", name: "Sample catalogue editor", email: "sample.editor@example.com", role: "Content", active: true },
]

export function UsersAdmin() {
  const [hidden, setHidden] = useState<string[]>([])
  const [note, setNote] = useState("")
  return (
    <>
      <h1 className="display">Users</h1>
      <p className="meta">Sample administrators. Activation and roles are not security controls. Permission checkboxes do not grant or remove access.</p>
      {note ? <SavedNote text={note} /> : null}
      <Table
        headers={["Name", "Role", "View", "Edit", ""]}
        rows={sampleUsers.filter((user) => !hidden.includes(user.id)).map((user) => [
          user.name,
          user.role,
          <input type="checkbox" defaultChecked aria-label={`${user.name} view`} />,
          <input type="checkbox" defaultChecked={user.role === "Admin"} aria-label={`${user.name} edit`} />,
          <button className="text-btn" type="button" onClick={() => { setHidden([...hidden, user.id]); setNote("The sample administrator returns on refresh. This is not an access change.") }}>Hide</button>,
        ])}
      />
    </>
  )
}

export function SettingsAdmin() {
  const [note, setNote] = useState("")
  return (
    <form className="panel" onSubmit={(event) => { event.preventDefault(); setNote("Store details were not saved.") }}>
      <h1 className="display">Settings</h1>
      <label className="field"><span>Store name</span><input defaultValue="LotWise Labs" /></label>
      <label className="field"><span>Email</span><input defaultValue="To be confirmed" /></label>
      <label className="field"><span>Phone</span><input defaultValue="To be confirmed" /></label>
      <label className="field"><span>Address</span><input defaultValue="To be confirmed" /></label>
      <label className="field"><span>Currency</span><input defaultValue="USD" /></label>
      <SpecularButton tone="primary" type="submit">Submit in this browser</SpecularButton>
      {note ? <SavedNote text={note} /> : null}
    </form>
  )
}
