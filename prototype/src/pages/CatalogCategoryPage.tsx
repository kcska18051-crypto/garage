import { Link } from 'react-router-dom'
import { catalogBrands, catalogProducts, compressorSubcategories } from '../data/catalogData'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { CatalogCategoryGrid } from '../features/catalog/CategoryGrid'
import '../features/catalog/Catalog.css'

export function CatalogCategoryPage() {
  return <main className="catalog-page"><Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Каталог', to: '/catalog' }, { label: 'Компрессорное оборудование' }]} /><header className="catalog-page__header catalog-page__header--category"><div><p className="eyebrow">Категория</p><h1>Компрессорное оборудование</h1><p>Компрессоры и оборудование для подготовки сжатого воздуха в мастерских, сервисах и на производстве.</p></div><strong>{catalogProducts.length} товаров в демонстрационной выдаче</strong></header><section aria-labelledby="compressor-types-title"><div className="catalog-section-heading"><div><p className="eyebrow">Следующий уровень</p><h2 id="compressor-types-title">Выберите тип оборудования</h2></div></div><CatalogCategoryGrid compact items={compressorSubcategories} /></section><section className="catalog-related-brands" aria-labelledby="related-brands-title"><h2 id="related-brands-title">Бренды категории</h2>{catalogBrands.map((brand) => <Link key={brand.id} to={`/catalog/compressor-equipment?brand=${brand.id}`}>{brand.name}<small>{brand.count}</small></Link>)}</section><section className="catalog-listing-placeholder" aria-labelledby="category-products-title"><p className="eyebrow">Товарная выдача</p><h2 id="category-products-title">Все компрессорное оборудование</h2><p>Сокращённый фильтр и интерактивная выдача подключаются к этой общей области.</p></section></main>
}
