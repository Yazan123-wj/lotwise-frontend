import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { products } from "../data/products.ts"
import { lineFor, quoteDiscount } from "../lib/catalog.ts"
import type { Address, CartLine, Product, Receipt } from "../types.ts"

const CART_KEY = "lotwise-cart"
const PREVIEW_KEY = "lotwise-preview"
const RECEIPT_KEY = "lotwise-receipt"
const ADDRESS_KEY = "lotwise-addresses"

type CheckoutInput = {
  name: string
  email: string
  phone: string
  shippingAddress: Address
  shippingMethodLabel: string
}

type CartValue = {
  lines: CartLine[]
  count: number
  discountInput: string
  setDiscountInput: (value: string) => void
  appliedCode: string | null
  discountMessage: string | null
  setServerDiscount: (quote: { code: string; amount: number; message: string | null; applied: string | null } | null) => void
  subtotal: number
  discountAmount: number
  total: number
  addItem: (product: Product, variationId: string, quantity: number) => string | null
  setQuantity: (key: string, quantity: number) => void
  removeLine: (key: string) => void
  referral: string | null
  setReferral: (code: string) => void
  preview: boolean
  setPreview: (on: boolean) => void
  receipt: Receipt | null
  placeDemonstration: (input: CheckoutInput) => Receipt | null
  addresses: Address[]
  addAddress: (address: Address) => void
}

const CartContext = createContext<CartValue | null>(null)

function readJson<T>(storage: Storage, key: string): T | null {
  try {
    const raw = storage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function refreshLine(line: CartLine): CartLine | null {
  const product = products.find((item) => item.id === line.productId && item.visible)
  const variation = product?.variations.find((item) => item.id === line.variationId)
  if (!product || !variation || variation.stockQuantity <= 0) return null
  const quantity = Math.min(Math.max(1, line.quantity), variation.stockQuantity)
  return lineFor(product, variation, quantity)
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [discountInput, setDiscountInput] = useState("")
  const [serverDiscount, setServerDiscount] = useState<{ code: string; amount: number; message: string | null; applied: string | null } | null>(null)
  const [referral, setReferralState] = useState<string | null>(null)
  const [preview, setPreviewState] = useState(false)
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = readJson<{ lines: CartLine[]; discountInput: string }>(
      localStorage,
      CART_KEY,
    )
    if (stored?.lines) {
      setLines(stored.lines.map(refreshLine).filter((line): line is CartLine => line !== null))
      setDiscountInput(stored.discountInput ?? "")
    }
    setPreviewState(localStorage.getItem(PREVIEW_KEY) === "1")
    setReceipt(readJson<Receipt>(sessionStorage, RECEIPT_KEY))
    setAddresses(readJson<Address[]>(sessionStorage, ADDRESS_KEY) ?? [])
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(CART_KEY, JSON.stringify({ lines, discountInput }))
  }, [lines, discountInput, ready])

  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)
  const quote = quoteDiscount(subtotal, discountInput)
  const serverMatches = Boolean(serverDiscount && serverDiscount.code.toLowerCase() === discountInput.trim().toLowerCase())
  const discountAmount = quote.applied ? quote.amount : serverMatches && serverDiscount?.applied ? serverDiscount.amount : 0
  const appliedCode = quote.applied ?? (serverMatches && serverDiscount?.applied ? serverDiscount.applied : null)
  const discountMessage = quote.applied || !discountInput.trim() ? quote.message : serverMatches ? serverDiscount?.message ?? quote.message : quote.message

  const value = useMemo<CartValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.quantity, 0)
    return {
      lines,
      count,
      discountInput,
      setDiscountInput,
      appliedCode,
      discountMessage,
      setServerDiscount,
      subtotal,
      discountAmount,
      total: Math.max(0, subtotal - discountAmount),
      addItem: (product, variationId, quantity) => {
        const variation = product.variations.find((item) => item.id === variationId)
        if (!variation || variation.stockQuantity <= 0) return "That option is out of stock."
        setLines((current) => {
          const key = `${product.id}:${variation.id}`
          const existing = current.find((line) => line.key === key)
          const nextQuantity = Math.min(
            variation.stockQuantity,
            (existing?.quantity ?? 0) + quantity,
          )
          const line = lineFor(product, variation, nextQuantity)
          if (existing) return current.map((item) => (item.key === key ? line : item))
          return [...current, line]
        })
        return null
      },
      setQuantity: (key, quantity) => {
        setLines((current) =>
          current.flatMap((line) => {
            if (line.key !== key) return [line]
            const next = Math.min(line.stockQuantity, Math.max(0, quantity))
            if (next <= 0) return []
            return [{ ...line, quantity: next }]
          }),
        )
      },
      removeLine: (key) => setLines((current) => current.filter((line) => line.key !== key)),
      referral,
      setReferral: (code) => {
        const next = code.trim()
        setReferralState(next || null)
      },
      preview,
      setPreview: (on) => {
        localStorage.setItem(PREVIEW_KEY, on ? "1" : "0")
        setPreviewState(on)
      },
      receipt,
      placeDemonstration: (input) => {
        if (lines.length === 0) return null
        const next: Receipt = {
          reference: `LW-PREVIEW-${Date.now().toString(36).toUpperCase()}`,
          createdAt: new Date().toISOString(),
          name: input.name.trim(),
          email: input.email.trim(),
          phone: input.phone.trim(),
          shippingAddress: input.shippingAddress,
          shippingMethodLabel: input.shippingMethodLabel,
          items: lines.map((line) => ({
            id: line.key,
            productId: line.productId,
            variationId: line.variationId,
            name: line.name,
            sku: line.sku,
            variationLabel: line.variationLabel,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
          })),
          subtotal,
          discountAmount,
          discountCode: appliedCode,
          total: Math.max(0, subtotal - discountAmount),
          referral,
          note: "Demonstration confirmation only. No payment was taken and no order was stored.",
        }
        sessionStorage.setItem(RECEIPT_KEY, JSON.stringify(next))
        setReceipt(next)
        setLines([])
        setDiscountInput("")
        return next
      },
      addresses,
      addAddress: (address) => {
        setAddresses((current) => {
          const next = [...current, address]
          sessionStorage.setItem(ADDRESS_KEY, JSON.stringify(next))
          return next
        })
      },
    }
  }, [addresses, appliedCode, discountAmount, discountInput, discountMessage, lines, preview, receipt, referral, subtotal])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error("useCart must be used inside CartProvider")
  return value
}
