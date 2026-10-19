import type {
  Address,
  Affiliate,
  Category,
  Customer,
  Discount,
  SampleOrder,
} from "../types.ts"

export const categories: Category[] = [
  {
    id: "cat_vials",
    slug: "sample-vials",
    name: "Vials",
    description: "Individual vial records from the catalogue.",
    imagePath: "/images/lotwise-vial.png",
    displayOrder: 1,
    active: true,
    featured: true,
  },
  {
    id: "cat_reference",
    slug: "reference-materials",
    name: "Reference",
    description: "Reference records kept beside the vial lots.",
    imagePath: "/images/categories/reference-materials.jpg",
    displayOrder: 2,
    active: true,
    featured: true,
  },
  {
    id: "cat_kits",
    slug: "sample-kits",
    name: "Kits",
    description: "Kit and collection records from the catalogue.",
    imagePath: "/images/categories/sample-kits.jpg",
    displayOrder: 3,
    active: true,
    featured: true,
  },
  {
    id: "cat_empty",
    slug: "awaiting-items",
    name: "Awaiting Items",
    description:
      "Empty sample category so the catalogue empty state can be reviewed. It is not a commercial category.",
    imagePath: "/images/categories/awaiting-items.jpg",
    displayOrder: 4,
    active: true,
    featured: false,
  },
]

export const sampleAddress: Address = {
  line1: "100 Sample Street",
  line2: "",
  city: "Sample City",
  region: "Sample Region",
  postalCode: "00000",
  country: "Sample Country",
}

export const customers: Customer[] = [
  {
    id: "cus_01",
    name: "Sample Customer",
    email: "sample.customer@example.com",
    phone: "555-0100",
    address: sampleAddress,
  },
  {
    id: "cus_02",
    name: "Preview Buyer",
    email: "preview.buyer@example.com",
    phone: "555-0101",
    address: { ...sampleAddress, line1: "200 Sample Street" },
  },
  {
    id: "cus_03",
    name: "Demo Account",
    email: "demo.account@example.com",
    phone: "555-0102",
    address: { ...sampleAddress, line1: "300 Sample Street" },
  },
]

export const discounts: Discount[] = [
  {
    id: "dsc_demo10",
    code: "DEMO10",
    type: "percentage",
    value: 10,
    minOrderValue: 0,
    usageLimit: 100,
    usageCount: 14,
    startsOn: "2026-01-01",
    endsOn: "2026-12-31",
    active: true,
  },
  {
    id: "dsc_fixed5",
    code: "FIXED5",
    type: "fixed",
    value: 5,
    minOrderValue: 40,
    usageLimit: 50,
    usageCount: 3,
    startsOn: "2026-01-01",
    endsOn: "2026-12-31",
    active: true,
  },
  {
    id: "dsc_lapsed",
    code: "LAPSED",
    type: "percentage",
    value: 15,
    minOrderValue: 0,
    usageLimit: 20,
    usageCount: 20,
    startsOn: "2025-01-01",
    endsOn: "2025-12-31",
    active: false,
  },
]

export const affiliates: Affiliate[] = [
  {
    id: "aff_01",
    name: "Sample Partner A",
    email: "partner.a@example.com",
    code: "PARTNERA",
    linkPath: "/shop?ref=PARTNERA",
    visits: 120,
    orders: 4,
    active: true,
  },
  {
    id: "aff_02",
    name: "Sample Partner B",
    email: "partner.b@example.com",
    code: "PARTNERB",
    linkPath: "/shop?ref=PARTNERB",
    visits: 36,
    orders: 1,
    active: false,
  },
]

export const shippingMethods = [
  { id: "ship_standard", label: "Standard — rate not quoted" },
  { id: "ship_express", label: "Express — rate not quoted" },
]

export const faqs = [
  {
    id: "faq_prices",
    question: "How should prices on this wireframe be read?",
    answer:
      "Prices are sample figures for layout review. They are not a quote, and the cart total is a provisional calculation in this browser.",
  },
  {
    id: "faq_payment",
    question: "Does checkout take payment?",
    answer:
      "No. The payment area is an integration placeholder. Card numbers and other payment credentials are not collected, and placing a demonstration order does not charge anyone.",
  },
  {
    id: "faq_products",
    question: "Where will approved product information appear?",
    answer:
      "Names, descriptions, options, and research-use statements on product pages will be replaced with client-approved catalogue content. The current text is placeholder copy.",
  },
  {
    id: "faq_contact",
    question: "How do I contact LotWise Labs?",
    answer:
      "Official email, phone, and business address have not been added yet. The contact page collects a message only as a form demonstration and does not send it.",
  },
]

export const policies = [
  {
    slug: "terms",
    title: "Terms",
    summary:
      "Client-approved terms have not been provided. The headings below show the intended structure only.",
    sections: [
      {
        heading: "Using the store",
        body: "Approved terms of use will appear in this section.",
      },
      {
        heading: "Orders",
        body: "Approved order terms will appear in this section. Demonstration checkout does not create an order.",
      },
      {
        heading: "Research use",
        body: "Any research-use or purchasing-eligibility statement must be supplied by LotWise Labs and reviewed for applicable requirements before it is published.",
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy",
    summary:
      "A privacy notice has not been provided. This page does not describe a real data practice.",
    sections: [
      {
        heading: "Information the future store may collect",
        body: "Account, order, and contact fields will need an approved privacy notice before launch.",
      },
      {
        heading: "This wireframe",
        body: "Catalogue forms stay in this browser. Account registration, sign-in, referral visits, and signed-in demonstration orders are sent to the referral service for this project.",
      },
    ],
  },
  {
    slug: "referral",
    title: "Referral terms",
    summary:
      "Referral program terms have not been supplied by LotWise Labs. The program records visits and new accounts. It does not promise a reward unless an administrator configures one.",
    sections: [
      {
        heading: "Attribution",
        body: "Opening a referral link stores an anonymous visit. If the same browser opens another valid link before creating an account, the latest link is the one that is kept. Creating an account locks that relationship. Later links do not move it. A customer cannot refer their own account, and an existing account is not attached to a new referral.",
      },
      {
        heading: "Qualification",
        body: "Qualification follows the rule stored for the program: either a new account, or a paid order that meets the configured minimum. Clicks alone do not qualify a referral. Unpaid, failed, cancelled, and refunded orders do not qualify. A waiting period or manual review, when configured, keeps the reward pending.",
      },
      {
        heading: "Rewards",
        body: "No discount, store credit, or other reward is offered until an administrator sets the type and amount. Each qualifying relationship can produce one referrer reward and one friend benefit. A later refund reverses a reward that was created from that order.",
      },
    ],
  },
  {
    slug: "shipping-returns",
    title: "Shipping and returns",
    summary:
      "Shipping and returns copy has not been provided. Rates are not quoted anywhere in this wireframe.",
    sections: [
      {
        heading: "Shipping",
        body: "Carrier options, regions, and rates will replace the checkout shipping placeholder after they are confirmed.",
      },
      {
        heading: "Returns",
        body: "Return conditions will be published here only after they are approved. None are offered by this wireframe.",
      },
    ],
  },
]

export const certificates = [
  {
    id: "coa",
    title: "Certificate of Analysis",
    image: "/images/certificates/analysis.svg",
    note: "Document LW-COA. Test results are not printed on this file.",
  },
  {
    id: "quality",
    title: "Quality certificate",
    image: "/images/certificates/quality.svg",
    note: "Document type only. Certificate numbers are not published here.",
  },
  {
    id: "batch",
    title: "Batch certificate",
    image: "/images/certificates/batch.svg",
    note: "Document type only. This is not a laboratory batch lookup.",
  },
]

export const banners = [
  { id: "hero-vial", label: "Hero vial", image: "/images/hero-vial.png", active: true },
  { id: "hero-lab", label: "Hero lab", image: "/images/banners/hero-lab.jpg", active: true },
  { id: "hero-bench", label: "Hero bench", image: "/images/banners/hero-bench.jpg", active: true },
  { id: "hero-vials", label: "Hero vials", image: "/images/lotwise-vial.png", active: true },
  { id: "collection", label: "Collection", image: "/images/banners/collection.jpg", active: true },
]

export const companyLinks = [
  { label: "About", to: "/about" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
  { label: "Account", to: "/account" },
  { label: "Referral", to: "/referral" },
]

export const policyLinks = [
  { label: "Terms", to: "/policies/terms" },
  { label: "Privacy", to: "/policies/privacy" },
  { label: "Shipping and returns", to: "/policies/shipping-returns" },
]

export const adminNav = [
  { label: "Dashboard", to: "/admin" },
  { label: "Products", to: "/admin/products" },
  { label: "Categories", to: "/admin/categories" },
  { label: "Inventory", to: "/admin/inventory" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Customers", to: "/admin/customers" },
  { label: "Discounts", to: "/admin/discounts" },
  { label: "Affiliates", to: "/admin/affiliates" },
  { label: "Referrals", to: "/admin/referrals" },
  { label: "Homepage content", to: "/admin/homepage-content" },
  { label: "Users", to: "/admin/users" },
  { label: "Settings", to: "/admin/settings" },
]

export const sampleOrders: SampleOrder[] = [
  {
    id: "ord_1001",
    orderNumber: "LW-DEMO-1001",
    customerId: "cus_01",
    customerName: "Sample Customer",
    email: "sample.customer@example.com",
    phone: "555-0100",
    placedAt: "2026-09-28T15:04:00.000Z",
    paymentStatus: "placeholder-pending",
    fulfilmentStatus: "processing",
    shippingAddress: sampleAddress,
    items: [
      {
        id: "line_1001_a",
        productId: "prd_lw_01",
        variationId: "var_lw_01_a",
        name: "Sample Vial LW-01",
        sku: "LW-01-A",
        variationLabel: "Placeholder size A",
        quantity: 1,
        unitPrice: 42,
      },
      {
        id: "line_1001_b",
        productId: "prd_lw_05",
        variationId: "var_lw_05_a",
        name: "Sample Kit LW-05",
        sku: "LW-05-A",
        variationLabel: "Placeholder kit",
        quantity: 1,
        unitPrice: 120,
      },
    ],
    subtotal: 162,
    discountAmount: 0,
    discountCode: null,
    provisionalTotal: 162,
    note: "Sample order for the wireframe. Not a real purchase.",
  },
  {
    id: "ord_1002",
    orderNumber: "LW-DEMO-1002",
    customerId: "cus_02",
    customerName: "Preview Buyer",
    email: "preview.buyer@example.com",
    phone: "555-0101",
    placedAt: "2026-09-12T11:20:00.000Z",
    paymentStatus: "placeholder-recorded",
    fulfilmentStatus: "fulfilled",
    shippingAddress: { ...sampleAddress, line1: "200 Sample Street" },
    items: [
      {
        id: "line_1002_a",
        productId: "prd_lw_04",
        variationId: "var_lw_04_a",
        name: "Sample Reference LW-04",
        sku: "LW-04-A",
        variationLabel: "Placeholder size A",
        quantity: 2,
        unitPrice: 64,
      },
    ],
    subtotal: 128,
    discountAmount: 12.8,
    discountCode: "DEMO10",
    provisionalTotal: 115.2,
    note: "Sample order showing a demonstration discount. Payment was not collected.",
  },
  {
    id: "ord_1003",
    orderNumber: "LW-DEMO-1003",
    customerId: "cus_01",
    customerName: "Sample Customer",
    email: "sample.customer@example.com",
    phone: "555-0100",
    placedAt: "2026-10-02T09:45:00.000Z",
    paymentStatus: "not-collected",
    fulfilmentStatus: "placed",
    shippingAddress: sampleAddress,
    items: [
      {
        id: "line_1003_a",
        productId: "prd_lw_02",
        variationId: "var_lw_02_a",
        name: "Sample Vial LW-02",
        sku: "LW-02-A",
        variationLabel: "Placeholder size A",
        quantity: 1,
        unitPrice: 54,
      },
    ],
    subtotal: 54,
    discountAmount: 0,
    discountCode: null,
    provisionalTotal: 54,
    note: "Sample order awaiting a fulfilment status change in the admin wireframe.",
  },
  {
    id: "ord_1004",
    orderNumber: "LW-DEMO-1004",
    customerId: "cus_03",
    customerName: "Demo Account",
    email: "demo.account@example.com",
    phone: "555-0102",
    placedAt: "2026-08-19T18:12:00.000Z",
    paymentStatus: "not-collected",
    fulfilmentStatus: "cancelled",
    shippingAddress: { ...sampleAddress, line1: "300 Sample Street" },
    items: [
      {
        id: "line_1004_a",
        productId: "prd_lw_06",
        variationId: "var_lw_06_a",
        name: "Sample Collection LW-06",
        sku: "LW-06-A",
        variationLabel: "Placeholder collection",
        quantity: 1,
        unitPrice: 96,
      },
    ],
    subtotal: 96,
    discountAmount: 0,
    discountCode: null,
    provisionalTotal: 96,
    note: "Cancelled sample order. No refund or payment exists.",
  },
]

export const previewCustomer = customers[0]
