import { discountCodes } from '@/data/discounts'
import { getProductById, getVariation } from '@/services/catalog'
import type { CartItem, CartQuote, DiscountCode, ResolvedCartLine } from '@/types'
import { formatMoney, roundMoney } from '@/utils/format'

const SHIPPING_LABEL = 'Placeholder — not a carrier quote'
const SAMPLE_TODAY = '2026-10-15'

export function getDiscountCodes() {
  return discountCodes
}

export function findDiscount(code: string) {
  const normalized = code.trim().toUpperCase()
  return discountCodes.find((discount) => discount.code.toUpperCase() === normalized)
}

export function evaluateDiscount(
  rawCode: string,
  subtotal: number,
): { ok: true; discount: DiscountCode; amount: number } | { ok: false; message: string } {
  const normalized = rawCode.trim()
  if (!normalized) return { ok: false, message: 'Enter a demonstration code.' }
  const discount = findDiscount(normalized)
  if (!discount || !discount.active) {
    return { ok: false, message: 'That code is not an active demonstration code.' }
  }
  if (discount.startsOn > SAMPLE_TODAY || discount.endsOn < SAMPLE_TODAY) {
    return { ok: false, message: 'That demonstration code is outside its sample dates.' }
  }
  if (discount.usageCount >= discount.usageLimit) {
    return { ok: false, message: 'That demonstration code has reached its sample usage limit.' }
  }
  if (subtotal < discount.minOrderValue) {
    return {
      ok: false,
      message: `The sample subtotal must reach ${formatMoney(discount.minOrderValue)} before this code applies.`,
    }
  }
  const amount =
    discount.type === 'percentage'
      ? roundMoney(subtotal * (discount.value / 100))
      : Math.min(discount.value, subtotal)
  return { ok: true, discount, amount }
}

export function priceCart(items: CartItem[], discountCode: string | null): CartQuote {
  const lines: ResolvedCartLine[] = []
  for (const item of items) {
    const product = getProductById(item.productId)
    if (!product) continue
    const variation = getVariation(product, item.variationId)
    if (!variation || variation.stockQuantity < 1) continue
    const quantity = Math.min(item.quantity, variation.stockQuantity)
    lines.push({
      id: item.id,
      productId: product.id,
      variationId: variation.id,
      name: product.name,
      slug: product.slug,
      sku: variation.sku,
      variationLabel: variation.label,
      unitPrice: variation.price,
      quantity,
      lineTotal: roundMoney(variation.price * quantity),
      imagePath: product.imagePaths[0] ?? '',
    })
  }

  const subtotal = roundMoney(lines.reduce((sum, line) => sum + line.lineTotal, 0))
  let discountAmount = 0
  let appliedCode: string | null = null
  let discountMessage: string | null = null

  if (discountCode) {
    const result = evaluateDiscount(discountCode, subtotal)
    if (result.ok) {
      discountAmount = result.amount
      appliedCode = result.discount.code
      discountMessage = `${result.discount.code} is applied in this browser only. It is not server-validated.`
    } else {
      discountMessage = result.message
    }
  }

  return {
    lines,
    subtotal,
    discountAmount,
    discountCode: appliedCode,
    discountMessage,
    provisionalTotal: roundMoney(subtotal - discountAmount),
    shippingLabel: SHIPPING_LABEL,
  }
}
