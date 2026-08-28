import { Link, Navigate, useParams } from 'react-router-dom'
import { catalogProducts, compressorSubcategories, getSubcategory } from '../data/catalogData'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import '../features/catalog/Catalog.css'

export function CatalogSubcategoryPage() {
  const { subcategorySlug } = useParams()
  const subcategory = getSubcategory(subcategorySlug)
  if (!subcategory) return <Navigate to="/catalog/compressor-equipment" replace />
  const count = catalogProducts.filter((product) => product.subcategoryId === subcategory.id).length
  return <main className="catalog-page"><Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Каталог', to: '/catalog' }, { label: 'Компрессорное оборудование', to: '/catalog/compressor-equipment' }, { label: subcategory.name }]} /><header className="catalog-page__header catalog-page__header--category"><div><p className="eyebrow">Товарная категория</p><h1>{subcategory.name}</h1><p>{subcategory.description}</p></div><strong>{count} товаров</strong></header><nav className="catalog-siblings" aria-label="Соседние подкатегории">{compressorSubcategories.filter((item) => item.id !== subcategory.id).map((item) => <Link key={item.id} to={item.href}>{item.name}</Link>)}</nav><section className="catalog-listing-placeholder" aria-labelledby="subcategory-products-title"><p className="eyebrow">Товарная выдача</p><h2 id="subcategory-products-title">Подбор оборудования</h2><p>Максимальный фильтр, теги и товарные карточки используют единый шаблон категории.</p></section></main>
}
