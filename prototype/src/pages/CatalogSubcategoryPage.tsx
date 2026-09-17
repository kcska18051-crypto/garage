import { Navigate, useParams } from 'react-router-dom'
import { catalogProducts, fullFilterGroups, getSubcategory } from '../data/catalogData'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { ProductListing } from '../features/catalog/ProductListing'
import { ChildCategoryGrid } from '../features/catalog/ChildCategoryGrid'
import '../features/catalog/Catalog.css'

export function CatalogSubcategoryPage() {
  const { subcategorySlug } = useParams()
  const subcategory = getSubcategory(subcategorySlug)
  const products = catalogProducts.filter((product) => product.subcategoryId === subcategory?.id)
  if (!subcategory) return <Navigate to="/catalog/compressor-equipment" replace />
  return <main className="catalog-page"><Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Каталог', to: '/catalog' }, { label: 'Компрессорное оборудование', to: '/catalog/compressor-equipment' }, { label: subcategory.name }]} /><header className="catalog-page__header catalog-page__header--category"><div><div className="catalog-page__title-row"><h1>{subcategory.name}</h1></div><p>{subcategory.description}</p></div></header><ChildCategoryGrid items={subcategory.childSections} /><ProductListing products={products} filterGroups={fullFilterGroups} mode="full" title={null} tagGroups={subcategory.tagGroups} /><section className="catalog-seo-tail" aria-label={subcategory.id === 'screw-compressors' ? 'О винтовых компрессорах' : `О категории ${subcategory.name}`}><h2>О категории «{subcategory.name}»</h2><p>Используйте технические параметры, быстрые подборки и сортировку, чтобы сузить список оборудования. Состав, цены, наличие и сроки в интерактивном прототипе демонстрационные и будут уточнены после интеграции с каталогом.</p></section></main>
}
