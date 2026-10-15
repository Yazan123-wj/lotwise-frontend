import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getProductById, getVariation } from '@/services/catalog'
import { evaluateDiscount, priceCart } from '@/services/pricing'
import type { CartItem, CartQuote } from '@/types'

const STORAGE_KEY = 'lotwise-wireframe-cart'

type CartState = {
  lines: CartItem[]
  discountCode: string | null
}

type CartContextValue = {
  quote: CartQuote
  itemCount: number
  statusMessage: string
  addItem: (productId: string, variationId: string, quantity: number) => boolean
  updateQuantity: (lineId: string, quantity: number) => void
  removeItem: (lineId: string) => void
  applyDiscount: (code: string) => { ok: boolean; message: string }
  clearDiscount: () => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function emptyState(): CartState {
  return { lines: [], discountCode: null }
}

function sanitize(value: unknown): CartState {
  if (!value || typeof value !== 'object') return emptyState()
  const record = value as { lines?: unknown; discountCode?: unknown }
  if (!Array.isArray(record.lines)) return emptyState()
  const lines: CartItem[] = []
  for (const line of record.lines) {
    if (!line || typeof line !== 'object') continue
    const item = line as Partial<CartItem>
    if (typeof item.productId !== 'string' || typeof item.variationId !== 'string') continue
    const product = getProductById(item.productId)
    const variation = product ? getVariation(product, item.variationId) : undefined
    if (!product || !variation || variation.stockQuantity < 1) continue
    const quantity = Number(item.quantity)
    if (!Number.isInteger(quantity) || quantity < 1) continue
    lines.push({
      id: `${item.productId}:${item.variationId}`,
      productId: item.productId,
      variationId: item.variationId,
      quantity: Math.min(quantity, variation.stockQuantity),
    })
  }
  return {
    lines,
    discountCode: typeof record.discountCode === 'string' ? record.discountCode : null,
  }
}

function readState(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? sanitize(JSON.parse(raw)) : emptyState()
  } catch {
    return emptyState()
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>(readState)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const quote = useMemo(() => priceCart(state.lines, state.discountCode), [state])

  const value = useMemo<CartContextValue>(() => {
    return {
      quote,
      itemCount: quote.lines.reduce((sum, line) => sum + line.quantity, 0),
      statusMessage,
      addItem: (productId, variationId, quantity) => {
        const product = getProductById(productId)
        const variation = product ? getVariation(product, variationId) : undefined
        if (!product || !variation || variation.stockQuantity < 1 || quantity < 1) {
          setStatusMessage('That sample option cannot be added.')
          return false
        }
        setState((current) => {
          const id = `${productId}:${variationId}`
          const existing = current.lines.find((line) => line.id === id)
          const nextQuantity = Math.min(variation.stockQuantity, (existing?.quantity ?? 0) + quantity)
          const lines = existing
            ? current.lines.map((line) => (line.id === id ? { ...line, quantity: nextQuantity } : line))
            : [...current.lines, { id, productId, variationId, quantity: nextQuantity }]
          return { ...current, lines }
        })
        setStatusMessage(`${product.name} was added to the demonstration cart.`)
        return true
      },
      updateQuantity: (lineId, quantity) => {
        setState((current) => ({
          ...current,
          lines: current.lines.flatMap((line) => {
            if (line.id !== lineId) return [line]
            const product = getProductById(line.productId)
            const variation = product ? getVariation(product, line.variationId) : undefined
            if (!variation) return []
            const next = Math.min(variation.stockQuantity, Math.max(1, quantity))
            return [{ ...line, quantity: next }]
          }),
        }))
      },
      removeItem: (lineId) => {
        setState((current) => ({ ...current, lines: current.lines.filter((line) => line.id !== lineId) }))
        setStatusMessage('The item was removed from the demonstration cart.')
      },
      applyDiscount: (code) => {
        const subtotal = priceCart(state.lines, null).subtotal
        const result = evaluateDiscount(code, subtotal)
        if (!result.ok) {
          setStatusMessage(result.message)
          return result
        }
        setState((current) => ({ ...current, discountCode: result.discount.code }))
        const message = `${result.discount.code} will preview a discount in this browser only.`
        setStatusMessage(message)
        return { ok: true, message }
      },
      clearDiscount: () => {
        setState((current) => ({ ...current, discountCode: null }))
        setStatusMessage('The demonstration discount was cleared.')
      },
      clearCart: () => {
        setState(emptyState())
        setStatusMessage('The demonstration cart was cleared.')
      },
    }
  }, [quote, state.lines, statusMessage])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error('useCart must be used within CartProvider')
  return value
}
