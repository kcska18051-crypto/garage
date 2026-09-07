import { catalogBrands, catalogCategories } from '../data/catalogData'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { CatalogCategoryGrid } from '../features/catalog/CategoryGrid'
import '../features/catalog/Catalog.css'

export function CatalogPage() {
  return <main className="catalog-page"><Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Каталог' }]} /><header className="catalog-page__header"><h1>Каталог</h1><p>Оборудование, инструмент и материалы для профессионального обслуживания и ремонта автомобилей.</p></header><CatalogCategoryGrid items={catalogCategories} /><section className="catalog-brand-section" aria-labelledby="catalog-brands-title"><div><h2 id="catalog-brands-title">Популярные бренды</h2></div><div className="catalog-brand-grid">{catalogBrands.map((brand) => <div key={brand.id}><span aria-hidden="true" />{brand.name}</div>)}</div></section><section className="catalog-info"><h2>Как устроен каталог</h2><p>Выберите направление, затем уточните тип оборудования. На страницах категорий доступны локальные фильтры, готовые подборки и сравнение характеристик. Количество и наличие в прототипе демонстрационные.</p></section></main>
}
