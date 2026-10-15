import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AdminLayout } from '@/admin/layouts/AdminLayout'
import { AdminNotFoundPage } from '@/admin/pages/not-found/AdminNotFoundPage'
import { AffiliateFormPage } from '@/admin/pages/affiliates/AffiliateFormPage'
import { AffiliatesPage } from '@/admin/pages/affiliates/AffiliatesPage'
import { CategoriesPage } from '@/admin/pages/categories/CategoriesPage'
import { CategoryFormPage } from '@/admin/pages/categories/CategoryFormPage'
import { CustomerDetailPage } from '@/admin/pages/customers/CustomerDetailPage'
import { CustomersPage } from '@/admin/pages/customers/CustomersPage'
import { DashboardPage } from '@/admin/pages/dashboard/DashboardPage'
import { DiscountFormPage } from '@/admin/pages/discounts/DiscountFormPage'
import { DiscountsPage } from '@/admin/pages/discounts/DiscountsPage'
import { HomepageContentPage } from '@/admin/pages/homepage-content/HomepageContentPage'
import { InventoryPage } from '@/admin/pages/inventory/InventoryPage'
import { AdminLoginPage } from '@/admin/pages/login/AdminLoginPage'
import { OrderDetailPage } from '@/admin/pages/orders/OrderDetailPage'
import { OrdersPage } from '@/admin/pages/orders/OrdersPage'
import { ProductFormPage } from '@/admin/pages/products/ProductFormPage'
import { ProductsPage } from '@/admin/pages/products/ProductsPage'
import { SettingsPage } from '@/admin/pages/settings/SettingsPage'
import { UsersPage } from '@/admin/pages/users/UsersPage'
import { StoreLayout } from '@/components/layout/StoreLayout'
import { AboutPage } from '@/app/routes/about/AboutPage'
import { AccountLayout } from '@/app/routes/account/AccountLayout'
import { AddressesPage } from '@/app/routes/account/AddressesPage'
import { OrderDetailPage as AccountOrderDetailPage } from '@/app/routes/account/OrderDetailPage'
import { OrdersPage as AccountOrdersPage } from '@/app/routes/account/OrdersPage'
import { OverviewPage } from '@/app/routes/account/OverviewPage'
import { ProfilePage } from '@/app/routes/account/ProfilePage'
import { RegisterPage } from '@/app/routes/account/RegisterPage'
import { ResetPasswordPage } from '@/app/routes/account/ResetPasswordPage'
import { SignInPage } from '@/app/routes/account/SignInPage'
import { CartPage } from '@/app/routes/cart/CartPage'
import { CategoryPage } from '@/app/routes/categories/CategoryPage'
import { CheckoutPage } from '@/app/routes/checkout/CheckoutPage'
import { ContactPage } from '@/app/routes/contact/ContactPage'
import { FaqPage } from '@/app/routes/faq/FaqPage'
import { HomePage } from '@/app/routes/home/HomePage'
import { NotFoundPage } from '@/app/routes/not-found/NotFoundPage'
import { OrderConfirmationPage } from '@/app/routes/order-confirmation/OrderConfirmationPage'
import { PolicyPage } from '@/app/routes/policies/PolicyPage'
import { ProductPage } from '@/app/routes/products/ProductPage'
import { SearchPage } from '@/app/routes/search/SearchPage'
import { ShopPage } from '@/app/routes/shop/ShopPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:productId" element={<ProductFormPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/new" element={<CategoryFormPage />} />
          <Route path="categories/:categoryId" element={<CategoryFormPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:orderId" element={<OrderDetailPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/:customerId" element={<CustomerDetailPage />} />
          <Route path="discounts" element={<DiscountsPage />} />
          <Route path="discounts/new" element={<DiscountFormPage />} />
          <Route path="discounts/:discountId" element={<DiscountFormPage />} />
          <Route path="affiliates" element={<AffiliatesPage />} />
          <Route path="affiliates/new" element={<AffiliateFormPage />} />
          <Route path="affiliates/:affiliateId" element={<AffiliateFormPage />} />
          <Route path="homepage-content" element={<HomepageContentPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<AdminNotFoundPage />} />
        </Route>
        <Route element={<StoreLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="categories/:slug" element={<CategoryPage />} />
          <Route path="products/:slug" element={<ProductPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="account" element={<AccountLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="sign-in" element={<SignInPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="reset" element={<ResetPasswordPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="addresses" element={<AddressesPage />} />
            <Route path="orders" element={<AccountOrdersPage />} />
            <Route path="orders/:orderId" element={<AccountOrderDetailPage />} />
          </Route>
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="policies/:slug" element={<PolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}
