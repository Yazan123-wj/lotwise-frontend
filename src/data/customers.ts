import type { Customer } from '@/types'

/** Fictional sample customers. These records are not people and hold no real contact details. */
export const customers: Customer[] = [
  {
    id: 'cus_01',
    firstName: 'Sample',
    lastName: 'Customer',
    email: 'sample.customer@example.com',
    phone: '555-0100',
    addresses: [
      {
        line1: '100 Sample Street',
        line2: '',
        city: 'Sample City',
        region: 'Sample Region',
        postalCode: '00000',
        country: 'Sample Country',
      },
    ],
  },
  {
    id: 'cus_02',
    firstName: 'Preview',
    lastName: 'Buyer',
    email: 'preview.buyer@example.com',
    phone: '555-0101',
    addresses: [
      {
        line1: '200 Sample Street',
        line2: 'Suite 2',
        city: 'Sample City',
        region: 'Sample Region',
        postalCode: '00000',
        country: 'Sample Country',
      },
    ],
  },
  {
    id: 'cus_03',
    firstName: 'Demo',
    lastName: 'Account',
    email: 'demo.account@example.com',
    phone: '555-0102',
    addresses: [
      {
        line1: '300 Sample Street',
        line2: '',
        city: 'Sample City',
        region: 'Sample Region',
        postalCode: '00000',
        country: 'Sample Country',
      },
    ],
  },
]

export const previewCustomer = customers[0]
