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
import {
  AdminLayout,
  AdminLogin,
  AffiliateForm,
  AffiliatesAdmin,
  CategoriesAdmin,
  CategoryForm,
  CustomerDetail,
  CustomersAdmin,
  DashboardPage,
  DiscountForm,
  DiscountsAdmin,
  HomepageAdmin,
  InventoryAdmin,
  OrderAdminDetail,
  OrdersAdmin,
  ProductForm,
  ProductsAdmin,
  SettingsAdmin,
  UsersAdmin,
} from "./pages/AdminPages.tsx"
import { CategoryPage, ProductPage, SearchPage, ShopPage } from "./pages/CatalogPages.tsx"
import { CartPage, CheckoutPage, ConfirmationPage } from "./pages/CommercePages.tsx"
import { HomePage } from "./pages/HomePage.tsx"
import { CartProvider } from "./state/cart.tsx"
import { SessionProvider } from "./state/session.tsx"
import { ReferralDashboardPage, ReferralInfoPage, ReferralLandingPage } from "./pages/ReferralPages.tsx"
import { ReferralsAdmin } from "./pages/ReferralAdmin.tsx"

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <SessionProvider>
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
        </SessionProvider>
      </CartProvider>
    </BrowserRouter>
  )
}
