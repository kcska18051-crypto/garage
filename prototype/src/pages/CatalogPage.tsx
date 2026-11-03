import { catalogBrands, catalogCategories } from '../data/catalogData'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { CatalogRootGrid } from '../features/catalog/CategoryGrid'
import { CatalogMobileList } from '../features/catalog/CatalogMobileList'
import '../features/catalog/Catalog.css'
import '../features/catalog/CatalogLanding.css'

export function CatalogPage() {
  return <main className="catalog-page catalog-landing"><Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Каталог' }]} /><header className="catalog-page__header"><h1>Каталог товаров</h1></header><section className="catalog-root-desktop" aria-label="Основные разделы каталога"><CatalogRootGrid items={catalogCategories} /></section><CatalogMobileList items={catalogCategories} /><div className="catalog-root-supporting"><section className="catalog-brand-section" aria-labelledby="catalog-brands-title"><div><h2 id="catalog-brands-title">Популярные бренды</h2></div><div className="catalog-brand-grid">{catalogBrands.map((brand) => <div key={brand.id}><span aria-hidden="true" />{brand.name}</div>)}</div></section><section className="catalog-info"><h2>Оборудование для вашей мастерской</h2><p>Компрессоры, подъёмное оборудование, инструмент и материалы для кузовного ремонта. Выберите раздел, чтобы перейти к нужному оборудованию и подкатегориям.</p></section></div></main>
}
