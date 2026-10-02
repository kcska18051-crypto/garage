import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { CatalogPage } from '../pages/CatalogPage'
import { CatalogSubcategoryPage } from '../pages/CatalogSubcategoryPage'
import { ProductDetailPage } from '../pages/ProductDetailPage'
import { BrandsPage } from '../pages/BrandsPage'
import { BrandDetailPage } from '../pages/BrandDetailPage'
import { CatalogSectionPage } from '../pages/CatalogSectionPage'
import { ActionsPage } from '../pages/ActionsPage'
import { ActionDetailPage } from '../pages/ActionDetailPage'
import { ProfileShell } from '../features/profile/ProfileShell'
import { ProfileAddressesPage, ProfileDataPage, ProfileDocumentsPage, ProfileFavoritesPage, ProfileHelpPage, ProfileOrderDetailPage, ProfileOrdersPage, ProfileOrganizationsPage, ProfileOverviewPage, ProfileRecentlyViewedPage, ProfileReviewsPage, ProfileServicesPage } from '../pages/ProfilePages'
import { CartPage } from '../pages/CartPage'
import { CheckoutDeliveryPage, CheckoutReviewPage, CheckoutSuccessPage } from '../pages/CheckoutPages'
import { SearchResultsPage } from '../pages/SearchResultsPage'
import { ComparePage } from '../pages/ComparePage'
import { AuthRouteBridge } from '../state/AuthState'

export type RouteDefinition = { path: string; label: string }

export const prototypeRoutes: RouteDefinition[] = [
  { path: '/catalog/*', label: 'Каталог' }, { path: '/search', label: 'Результаты поиска' },
  { path: '/services/*', label: 'Услуги' }, { path: '/actions/*', label: 'Акции' },
  { path: '/new', label: 'Новинки' },
  { path: '/product/:slug', label: 'Карточка товара' },
  { path: '/cart', label: 'Корзина' },
  { path: '/delivery', label: 'Доставка и оплата' }, { path: '/about', label: 'О компании' },
  { path: '/contacts', label: 'Контакты' }, { path: '/articles/:slug', label: 'Статья' },
  { path: '/news/*', label: 'Новости' }, { path: '/articles', label: 'Статьи' }, { path: '/reviews', label: 'Обзоры' },
  { path: '/brands/*', label: 'Бренд' },
]

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/catalog/compressor-equipment/:subcategorySlug" element={<CatalogSubcategoryPage />} />
      <Route path="/catalog/compressor-equipment/:subcategorySlug/:childSlug" element={<CatalogSubcategoryPage />} />
      <Route path="/catalog/:categorySlug" element={<CatalogSectionPage />} />
      <Route path="/product/remeza-vk-10-gr-0001" element={<ProductDetailPage />} />
      <Route path="/brands" element={<BrandsPage />} />
      <Route path="/brand/remeza" element={<BrandDetailPage />} />
      <Route path="/actions" element={<ActionsPage />} />
      <Route path="/actions/completed" element={<Navigate to="/actions#archive" replace />} />
      <Route path="/actions/:slug" element={<ActionDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/compare" element={<ComparePage />} />
      <Route path="/checkout/review" element={<CheckoutReviewPage />} />
      <Route path="/checkout/delivery" element={<CheckoutDeliveryPage />} />
      <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/favorites" element={<Navigate to="/profile/favorites" replace />} />
      <Route path="/profile/auth" element={<AuthRouteBridge intent="login" />} />
      <Route path="/profile/recovery" element={<AuthRouteBridge intent="recovery" />} />
      <Route path="/profile" element={<ProfileShell />}>
        <Route index element={<ProfileOverviewPage />} />
        <Route path="orders" element={<ProfileOrdersPage />} />
        <Route path="orders/:id" element={<ProfileOrderDetailPage />} />
        <Route path="organizations" element={<ProfileOrganizationsPage />} />
        <Route path="favorites" element={<ProfileFavoritesPage />} />
        <Route path="recently-viewed" element={<ProfileRecentlyViewedPage />} />
        <Route path="services" element={<ProfileServicesPage />} />
        <Route path="reviews" element={<ProfileReviewsPage />} />
        <Route path="documents" element={<ProfileDocumentsPage />} />
        <Route path="help" element={<ProfileHelpPage />} />
        <Route path="addresses" element={<ProfileAddressesPage />} />
        <Route path="data" element={<ProfileDataPage />} />
      </Route>
      {prototypeRoutes.map((route) => <Route key={route.path} path={route.path} element={<PlaceholderPage title={route.label} />} />)}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
