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
    imagePath: "/images/banners/area-vials.jpg",
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
  { id: "ship_standard", label: "Standard shipping — rate confirmed after order" },
  { id: "ship_express", label: "Express shipping — rate confirmed after order" },
]

export const faqs = [
  {
    id: "faq_prices",
    question: "How are catalogue prices shown?",
    answer:
      "Prices shown on product pages and in the cart are the current catalogue prices. Shipping is confirmed after you place the order.",
  },
  {
    id: "faq_payment",
    question: "Does checkout take payment yet?",
    answer:
      "Not yet. You can place an order and it is saved on your account as awaiting payment. Card payment will be collected once our payment provider is connected.",
  },
  {
    id: "faq_products",
    question: "What products are listed?",
    answer:
      "The live catalogue is managed in the LotWise Labs admin panel. Product names, options, and stock update from there.",
  },
  {
    id: "faq_contact",
    question: "How do I contact LotWise Labs?",
    answer:
      "Use the WhatsApp button on the site or the contact page to reach the LotWise Labs team.",
  },
]

export const policies = [
  {
    slug: "terms",
    title: "Terms",
    summary:
      "Using the LotWise Labs storefront means you agree to place orders for research use as described on product pages.",
    sections: [
      {
        heading: "Using the store",
        body: "You may browse the catalogue, create an account, and place orders. Account credentials must be kept confidential.",
      },
      {
        heading: "Orders",
        body: "Placing an order creates a pending-payment order on your account. Payment is collected when the payment provider is connected. LotWise Labs may confirm shipping separately.",
      },
      {
        heading: "Research use",
        body: "Catalogue products are offered for research use only, as stated on product pages.",
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy",
    summary:
      "LotWise Labs stores account, order, and referral information needed to run the storefront.",
    sections: [
      {
        heading: "Information we collect",
        body: "Account name and email, order contact and shipping details, cart activity in your browser, and referral visits when you open a referral link.",
      },
      {
        heading: "How it is used",
        body: "We use this information to authenticate you, fulfil orders, operate the referral program, and improve the storefront.",
      },
    ],
  },
  {
    slug: "referral",
    title: "Referral terms",
    summary:
      "The referral program records visits and new accounts. Rewards apply only when an administrator configures them.",
    sections: [
      {
        heading: "Attribution",
        body: "Opening a referral link stores an anonymous visit. If the same browser opens another valid link before creating an account, the latest link is kept. Creating an account locks that relationship. Later links do not move it. A customer cannot refer their own account, and an existing account is not attached to a new referral.",
      },
      {
        heading: "Qualification",
        body: "Qualification follows the rule stored for the program: either a new account, or a paid order that meets the configured minimum. Clicks alone do not qualify. Unpaid, failed, cancelled, and refunded orders do not qualify. A waiting period or manual review, when configured, keeps the reward pending.",
      },
      {
        heading: "Rewards",
        body: "No discount or other reward is offered until an administrator sets the type and amount. Each qualifying relationship can produce one referrer reward and one friend benefit.",
      },
    ],
  },
  {
    slug: "shipping-returns",
    title: "Shipping and returns",
    summary:
      "Shipping rates are confirmed after you place an order. Return conditions follow LotWise Labs fulfilment policy.",
    sections: [
      {
        heading: "Shipping",
        body: "Choose a shipping preference at checkout. Exact carrier rates and timing are confirmed with you after the order is placed.",
      },
      {
        heading: "Returns",
        body: "Contact LotWise Labs about returns. Eligibility depends on the product and fulfilment status.",
      },
    ],
  },
]

export const certificates = [
  {
    id: "janoshik-240241",
    title: "Janoshik test report #240241",
    image: "/images/certificates/janoshik-240241.png",
    alt: "Janoshik test report 240241 for sample RETATURIDE-Lotwiselabs, batch RTD-26-001-05",
    note: "RETATURIDE-Lotwiselabs · Batch RTD-26-001-05",
    result: "Retatrutide 10.34 mg · Purity 99.859%",
    href: "https://verify.janoshik.com/tests/240241-RETATURIDELotwiselabs_A1SM24X2LPSJ",
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
