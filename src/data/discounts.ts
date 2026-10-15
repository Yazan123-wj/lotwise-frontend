import type { DiscountCode } from '@/types'

/** Demonstration codes. Applying one changes only the local cart preview. */
export const discountCodes: DiscountCode[] = [
  {
    id: 'dsc_demo10',
    code: 'DEMO10',
    type: 'percentage',
    value: 10,
    minOrderValue: 0,
    usageLimit: 100,
    usageCount: 14,
    startsOn: '2026-01-01',
    endsOn: '2026-12-31',
    active: true,
  },
  {
    id: 'dsc_fixed5',
    code: 'FIXED5',
    type: 'fixed',
    value: 5,
    minOrderValue: 40,
    usageLimit: 50,
    usageCount: 3,
    startsOn: '2026-01-01',
    endsOn: '2026-12-31',
    active: true,
  },
  {
    id: 'dsc_lapsed',
    code: 'LAPSED',
    type: 'percentage',
    value: 15,
    minOrderValue: 0,
    usageLimit: 20,
    usageCount: 20,
    startsOn: '2025-01-01',
    endsOn: '2025-12-31',
    active: false,
  },
]
