import { lazy, Suspense, useEffect, useState, type ComponentType, type ReactNode } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { StoreLayout } from "./components/Shell.tsx"
import {
  AboutPage,
  ContactPage,
  FaqPage,
  NotFoundPage,
  PolicyPage,
  QualityPage,
} from "./pages/ContentPages.tsx"
import {
  AccountLayout,
  AddressesPage,
  OrderDetailPage,
  OrdersPage,
  OverviewPage,
  ProfilePage,
  RegisterPage,
  ResetPage,
  SignInPage,
} from "./pages/AccountPages.tsx"
import { CategoryPage, ProductPage, SearchPage, ShopPage } from "./pages/CatalogPages.tsx"
import { CartPage, CheckoutPage, ConfirmationPage } from "./pages/CommercePages.tsx"
import { HomePage } from "./pages/HomePage.tsx"
import { applyStore } from "./lib/live.ts"
import { CartProvider } from "./state/cart.tsx"
import { SessionProvider } from "./state/session.tsx"
import { ReferralDashboardPage, ReferralInfoPage, ReferralLandingPage } from "./pages/ReferralPages.tsx"

function lazyNamed<Module extends Record<string, ComponentType<unknown>>>(
  loader: () => Promise<Module>,
  exportName: keyof Module,
) {
  return lazy(async () => {
    const module = await loader()
    return { default: module[exportName] }
  })
}

const admin = () => import("./pages/AdminPages.tsx")
const AdminLogin = lazyNamed(admin, "AdminLogin")
const AdminLayout = lazyNamed(admin, "AdminLayout")
const DashboardPage = lazyNamed(admin, "DashboardPage")
const ProductsAdmin = lazyNamed(admin, "ProductsAdmin")
const ProductForm = lazyNamed(admin, "ProductForm")
const CategoriesAdmin = lazyNamed(admin, "CategoriesAdmin")
const CategoryForm = lazyNamed(admin, "CategoryForm")
const InventoryAdmin = lazyNamed(admin, "InventoryAdmin")
const OrdersAdmin = lazyNamed(admin, "OrdersAdmin")
const OrderAdminDetail = lazyNamed(admin, "OrderAdminDetail")
const CustomersAdmin = lazyNamed(admin, "CustomersAdmin")
const CustomerDetail = lazyNamed(admin, "CustomerDetail")
const DiscountsAdmin = lazyNamed(admin, "DiscountsAdmin")
const DiscountForm = lazyNamed(admin, "DiscountForm")
const AffiliatesAdmin = lazyNamed(admin, "AffiliatesAdmin")
const AffiliateForm = lazyNamed(admin, "AffiliateForm")
const HomepageAdmin = lazyNamed(admin, "HomepageAdmin")
const UsersAdmin = lazyNamed(admin, "UsersAdmin")
const SettingsAdmin = lazyNamed(admin, "SettingsAdmin")
const ReferralsAdmin = lazy(() => import("./pages/ReferralAdmin.tsx").then((module) => ({ default: module.ReferralsAdmin })))

function CatalogueSync({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState(0)
  useEffect(() => {
    fetch("/api/store")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data?.products?.length) return
        applyStore(data)
        setVersion(1)
      })
      .catch(() => {})
  }, [])
  return <div key={version}>{children}</div>
}

function AdminFallback() {
  return <p className="meta" style={{ padding: 24 }}>Loading…</p>
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <SessionProvider>
        <CatalogueSync>
        <Suspense fallback={<AdminFallback />}>
        <Routes>
          <Route path="admin/login" element={<AdminLogin />} />
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:productId" element={<ProductForm />} />
            <Route path="categories" element={<CategoriesAdmin />} />
            <Route path="categories/new" element={<CategoryForm />} />
            <Route path="categories/:categoryId" element={<CategoryForm />} />
            <Route path="inventory" element={<InventoryAdmin />} />
            <Route path="orders" element={<OrdersAdmin />} />
            <Route path="orders/:orderId" element={<OrderAdminDetail />} />
            <Route path="customers" element={<CustomersAdmin />} />
            <Route path="customers/:customerId" element={<CustomerDetail />} />
            <Route path="discounts" element={<DiscountsAdmin />} />
            <Route path="discounts/new" element={<DiscountForm />} />
            <Route path="discounts/:discountId" element={<DiscountForm />} />
            <Route path="affiliates" element={<AffiliatesAdmin />} />
            <Route path="affiliates/new" element={<AffiliateForm />} />
            <Route path="affiliates/:affiliateId" element={<AffiliateForm />} />
            <Route path="homepage-content" element={<HomepageAdmin />} />
            <Route path="users" element={<UsersAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
            <Route path="referrals" element={<ReferralsAdmin />} />
          </Route>
          <Route element={<StoreLayout />}>
            <Route index element={<HomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="categories/:slug" element={<CategoryPage />} />
            <Route path="products/:slug" element={<ProductPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-confirmation" element={<ConfirmationPage />} />
            <Route path="account" element={<AccountLayout />}>
              <Route index element={<OverviewPage />} />
              <Route path="sign-in" element={<SignInPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="reset" element={<ResetPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="addresses" element={<AddressesPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:orderId" element={<OrderDetailPage />} />
              <Route path="referrals" element={<ReferralDashboardPage />} />
            </Route>
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="policies/:slug" element={<PolicyPage />} />
            <Route path="quality" element={<QualityPage />} />
            <Route path="referral" element={<ReferralInfoPage />} />
            <Route path="ref/:code" element={<ReferralLandingPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        </Suspense>
        </CatalogueSync>
        </SessionProvider>
      </CartProvider>
    </BrowserRouter>
  )
}
