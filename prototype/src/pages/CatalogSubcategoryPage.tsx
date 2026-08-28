import { Link, Navigate, useParams } from 'react-router-dom'
import { catalogProducts, compressorSubcategories, fullFilterGroups, getSubcategory } from '../data/catalogData'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { TagGroups } from '../features/catalog/TagGroups'
import { useCatalogListing } from '../features/catalog/useCatalogListing'
import { ProductListing } from '../features/catalog/ProductListing'
import '../features/catalog/Catalog.css'

export function CatalogSubcategoryPage() {
  const { subcategorySlug } = useParams()
  const subcategory = getSubcategory(subcategorySlug)
  const products = catalogProducts.filter((product) => product.subcategoryId === subcategory?.id)
  const listing = useCatalogListing({ products })
  if (!subcategory) return <Navigate to="/catalog/compressor-equipment" replace />
  return <main className="catalog-page"><Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Каталог', to: '/catalog' }, { label: 'Компрессорное оборудование', to: '/catalog/compressor-equipment' }, { label: subcategory.name }]} /><header className="catalog-page__header catalog-page__header--category"><div><p className="eyebrow">Товарная категория</p><h1>{subcategory.name}</h1><p>{subcategory.description}</p></div></header><nav className="catalog-siblings" aria-label="Соседние подкатегории">{compressorSubcategories.filter((item) => item.id !== subcategory.id).map((item) => <Link key={item.id} to={item.href}>{item.name}</Link>)}</nav><TagGroups groups={subcategory.tagGroups} activeTag={listing.state.tag} onSelect={listing.applyTag} /><ProductListing products={products} filterGroups={fullFilterGroups} mode="full" /></main>
}
