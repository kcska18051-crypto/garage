import { Route, Routes } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { CatalogPage } from '../pages/CatalogPage'
import { CatalogCategoryPage } from '../pages/CatalogCategoryPage'
import { CatalogSubcategoryPage } from '../pages/CatalogSubcategoryPage'

export type RouteDefinition = { path: string; label: string }

export const prototypeRoutes: RouteDefinition[] = [
  { path: '/catalog/*', label: 'Каталог' }, { path: '/search', label: 'Результаты поиска' },
  { path: '/services/*', label: 'Услуги' }, { path: '/actions', label: 'Акции' },
  { path: '/brands/*', label: 'Бренды' }, { path: '/new', label: 'Новинки' },
  { path: '/product/:slug', label: 'Карточка товара' }, { path: '/favorites', label: 'Избранное' },
  { path: '/compare', label: 'Сравнение' }, { path: '/cart', label: 'Корзина' },
  { path: '/profile', label: 'Личный кабинет' }, { path: '/shops', label: 'Магазины' },
  { path: '/delivery', label: 'Доставка и оплата' }, { path: '/about', label: 'О компании' },
  { path: '/contacts', label: 'Контакты' }, { path: '/articles/:slug', label: 'Статья' },
  { path: '/news/:slug', label: 'Новость' }, { path: '/business', label: 'Юридическим лицам' },
]

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/catalog/compressor-equipment" element={<CatalogCategoryPage />} />
      <Route path="/catalog/compressor-equipment/:subcategorySlug" element={<CatalogSubcategoryPage />} />
      {prototypeRoutes.map((route) => <Route key={route.path} path={route.path} element={<PlaceholderPage title={route.label} />} />)}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
