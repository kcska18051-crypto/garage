import { Route, Routes } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { CatalogPage } from '../pages/CatalogPage'
import { CatalogCategoryPage } from '../pages/CatalogCategoryPage'
import { CatalogSubcategoryPage } from '../pages/CatalogSubcategoryPage'
import { ProductDetailPage } from '../pages/ProductDetailPage'
import { BrandsPage } from '../pages/BrandsPage'

export type RouteDefinition = { path: string; label: string }

export const prototypeRoutes: RouteDefinition[] = [
  { path: '/catalog/*', label: 'Каталог' }, { path: '/search', label: 'Результаты поиска' },
  { path: '/services/*', label: 'Услуги' }, { path: '/actions', label: 'Акции' },
  { path: '/new', label: 'Новинки' },
  { path: '/product/:slug', label: 'Карточка товара' }, { path: '/favorites', label: 'Избранное' },
  { path: '/compare', label: 'Сравнение' }, { path: '/cart', label: 'Корзина' },
  { path: '/profile', label: 'Личный кабинет' },
  { path: '/delivery', label: 'Доставка и оплата' }, { path: '/about', label: 'О компании' },
  { path: '/contacts', label: 'Контакты' }, { path: '/articles/:slug', label: 'Статья' },
  { path: '/news/:slug', label: 'Новость' },
]

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/catalog/compressor-equipment" element={<CatalogCategoryPage />} />
      <Route path="/catalog/compressor-equipment/:subcategorySlug" element={<CatalogSubcategoryPage />} />
      <Route path="/catalog/compressor-equipment/:subcategorySlug/:childSlug" element={<CatalogSubcategoryPage />} />
      <Route path="/product/remeza-vk-10-gr-0001" element={<ProductDetailPage />} />
      <Route path="/brands" element={<BrandsPage />} />
      {prototypeRoutes.map((route) => <Route key={route.path} path={route.path} element={<PlaceholderPage title={route.label} />} />)}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
