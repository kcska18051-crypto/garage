import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { CatalogPage } from '../pages/CatalogPage'
import { CatalogSubcategoryPage } from '../pages/CatalogSubcategoryPage'
import { DemoProductPage } from '../pages/DemoProductPage'
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
import { MaterialDetailPage, MaterialsListPage } from '../pages/MaterialsPages'
import { InfoPage } from '../pages/InfoPage'
import { ContactsPage } from '../pages/ContactsPage'
import { AboutPage } from '../pages/AboutPage'
import { StorePage } from '../pages/StorePage'
import {ServicesIndexPage,ServiceCenterPage,CompressorRepairPage,RepairDetailPage,PaintMatchingPage,PaintDetailPage,RentalCatalogPage,RentalCategoryPage,RentalDetailPage} from '../pages/ServicesPages'
import {ProfileServiceRequestDetail} from '../features/profile/ProfileServiceRequests'
import { LegalDocumentPage } from '../pages/LegalDocumentPage'

export type RouteDefinition = { path: string; label: string }

export const prototypeRoutes: RouteDefinition[] = [
  { path: '/new', label: 'Новинки' },
  { path: '/cart', label: 'Корзина' },
]

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesIndexPage/>}/>
      <Route path="/services/service-center" element={<ServiceCenterPage/>}/>
      <Route path="/services/service-center/compressor-repair" element={<CompressorRepairPage/>}/>
      <Route path="/services/service-center/compressor-repair/:repairSlug" element={<RepairDetailPage/>}/>
      <Route path="/services/paint-matching" element={<PaintMatchingPage/>}/>
      <Route path="/services/paint-matching/:paintSlug" element={<PaintDetailPage/>}/>
      <Route path="/services/rental" element={<RentalCatalogPage/>}/>
      <Route path="/services/rental/compressors" element={<RentalCategoryPage categoryId="compressors"/>}/>
      <Route path="/services/rental/tools" element={<RentalCategoryPage categoryId="tools"/>}/>
      <Route path="/services/rental/:rentalSlug" element={<RentalDetailPage/>}/>
      <Route path="/services/workshop" element={<Navigate to="/services" replace/>}/>
      <Route path="/services/*" element={<NotFoundPage/>}/>
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/catalog/compressor-equipment/:subcategorySlug" element={<CatalogSubcategoryPage />} />
      <Route path="/catalog/compressor-equipment/:subcategorySlug/:childSlug" element={<CatalogSubcategoryPage />} />
      <Route path="/catalog/:categorySlug" element={<CatalogSectionPage />} />
      <Route path="/product/:slug" element={<DemoProductPage />} />
      <Route path="/brands" element={<BrandsPage />} />
      <Route path="/brand/remeza" element={<BrandDetailPage />} />
      <Route path="/actions" element={<ActionsPage />} />
      <Route path="/actions/completed" element={<Navigate to="/actions#archive" replace />} />
      <Route path="/actions/:slug" element={<ActionDetailPage />} />
      <Route path="/news" element={<MaterialsListPage kind="news" />} />
      <Route path="/news/:slug" element={<MaterialDetailPage kind="news" />} />
      <Route path="/articles" element={<MaterialsListPage kind="article" />} />
      <Route path="/articles/:slug" element={<MaterialDetailPage kind="article" />} />
      <Route path="/reviews" element={<MaterialsListPage kind="review" />} />
      <Route path="/reviews/:slug" element={<MaterialDetailPage kind="review" />} />
      <Route path="/delivery" element={<InfoPage page="delivery" />} />
      <Route path="/payment" element={<InfoPage page="payment" />} />
      <Route path="/warranty" element={<InfoPage page="warranty" />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/contacts/:storeId" element={<StorePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/privacy" element={<LegalDocumentPage title="Политика конфиденциальности" />} />
      <Route path="/user-agreement" element={<LegalDocumentPage title="Пользовательское соглашение" />} />
      <Route path="/personal-data-consent" element={<LegalDocumentPage title="Согласие на обработку персональных данных" />} />
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
        <Route path="services/request" element={<ProfileServiceRequestDetail/>}/>
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
