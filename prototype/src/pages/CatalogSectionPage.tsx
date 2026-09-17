import { useParams } from 'react-router-dom'
import { getCatalogCategory } from '../data/catalogData'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { CatalogSectionGrid, CatalogSectionList } from '../features/catalog/CatalogSectionList'
import { NotFoundPage } from './NotFoundPage'
import '../features/catalog/Catalog.css'

export function CatalogSectionPage() {
  const { categorySlug } = useParams()
  const category = getCatalogCategory(categorySlug)

  if (!category) return <NotFoundPage />

  const usesCompactGrid = category.slug === 'compressor-equipment'

  return (
    <main className="catalog-page catalog-section-page">
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Каталог', to: '/catalog' }, { label: category.name }]} />
      <header className="catalog-page__header catalog-page__header--category">
        {usesCompactGrid ? <h1>{category.name}</h1> : <div><h1>{category.name}</h1><p>{category.description}</p></div>}
      </header>
      {usesCompactGrid ? (
        <>
          <CatalogSectionGrid items={category.subcategories} />
          <CatalogSectionList className="catalog-section-list--mobile-only" items={category.subcategories} />
        </>
      ) : <CatalogSectionList items={category.subcategories} />}
    </main>
  )
}
