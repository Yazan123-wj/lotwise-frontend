import type { Affiliate } from '@/types'

/** Affiliate visits and orders are mock counts. Nothing is tracked. */
export const affiliates: Affiliate[] = [
  {
    id: 'aff_01',
    name: 'Sample Partner A',
    email: 'partner.a@example.com',
    code: 'PARTNERA',
    linkPath: '/shop?ref=PARTNERA',
    visits: 120,
    orders: 4,
    active: true,
  },
  {
    id: 'aff_02',
    name: 'Sample Partner B',
    email: 'partner.b@example.com',
    code: 'PARTNERB',
    linkPath: '/shop?ref=PARTNERB',
    visits: 36,
    orders: 1,
    active: false,
  },
]
