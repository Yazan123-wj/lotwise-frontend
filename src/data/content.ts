import type { FaqItem, PolicyDocument } from '@/types'

export const brandPillars = [
  {
    title: 'Precision',
    copy: 'LotWise Labs is positioned around precise, research-focused peptide solutions. Supporting detail will be published when it is approved.',
  },
  {
    title: 'Quality',
    copy: 'Document types are listed on the quality page. Certificate numbers and test results are not published here.',
  },
  {
    title: 'Transparency',
    copy: 'Product, policy, and company details will be shown plainly once the approved content is supplied.',
  },
]

export const qualitySection = {
  title: 'Quality and research information',
  body: 'This section is reserved for research context and quality documentation approved by LotWise Labs. No certificates, test results, citations, or product claims are shown, because none have been supplied.',
}

export const faqItems: FaqItem[] = [
  {
    id: 'faq_prices',
    question: 'How should prices on this wireframe be read?',
    answer:
      'Prices are sample figures for layout review. They are not a quote, and the cart total is a provisional calculation in this browser.',
  },
  {
    id: 'faq_payment',
    question: 'Does checkout take payment?',
    answer:
      'No. The payment area is an integration placeholder. Card numbers and other payment credentials are not collected, and placing a demonstration order does not charge anyone.',
  },
  {
    id: 'faq_products',
    question: 'Where will approved product information appear?',
    answer:
      'Names, descriptions, options, and research-use statements on product pages will be replaced with client-approved catalogue content. The current text is placeholder copy.',
  },
  {
    id: 'faq_contact',
    question: 'How do I contact LotWise Labs?',
    answer:
      'Official email, phone, and business address have not been added yet. The contact page collects a message only as a form demonstration and does not send it.',
  },
]

export const policies: PolicyDocument[] = [
  {
    slug: 'terms',
    title: 'Terms',
    summary: 'Client-approved terms have not been provided. The headings below show the intended structure only.',
    sections: [
      { heading: 'Using the store', body: 'Approved terms of use will appear in this section.' },
      { heading: 'Orders', body: 'Approved order terms will appear in this section. Demonstration checkout does not create an order.' },
      { heading: 'Research use', body: 'Any research-use or purchasing-eligibility statement must be supplied by LotWise Labs and reviewed for applicable requirements before it is published.' },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy',
    summary: 'A privacy notice has not been provided. This page does not describe a real data practice.',
    sections: [
      { heading: 'Information the future store may collect', body: 'Account, order, and contact fields will need an approved privacy notice before launch.' },
      { heading: 'This wireframe', body: 'Forms on this wireframe keep values in the page or this browser only. They are not sent to a server.' },
    ],
  },
  {
    slug: 'shipping-returns',
    title: 'Shipping and returns',
    summary: 'Shipping and returns copy has not been provided. Rates are not quoted anywhere in this wireframe.',
    sections: [
      { heading: 'Shipping', body: 'Carrier options, regions, and rates will replace the checkout shipping placeholder after they are confirmed.' },
      { heading: 'Returns', body: 'Return conditions will be published here only after they are approved. None are offered by this wireframe.' },
    ],
  },
]

export const shippingMethods = [
  { id: 'ship_standard', label: 'Standard — rate not quoted' },
  { id: 'ship_express', label: 'Express — rate not quoted' },
]
