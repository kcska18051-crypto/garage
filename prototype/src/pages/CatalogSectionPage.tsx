import { ProductListing } from '../features/catalog/ProductListing'
import '../features/catalog/CatalogListingApproved.css'
import '../features/catalog/ApprovedProductCards.css'
import { useParams, useSearchParams } from 'react-router-dom'
import { getCatalogCategory, catalogProducts, compressorSubcategories, fullFilterGroups } from '../data/catalogData'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { CatalogSectionGrid, CatalogSectionList } from '../features/catalog/CatalogSectionList'
import { NotFoundPage } from './NotFoundPage'
import '../features/catalog/Catalog.css'
import '../features/catalog/CatalogLanding.css'
import '../features/catalog/CompressorLanding.css'

export function CatalogSectionPage() {
  const { categorySlug } = useParams()
  const [params]=useSearchParams()
  const category = getCatalogCategory(categorySlug ?? 'compressor-equipment')

  if (!category) return <NotFoundPage />

  if(params.get('listing')==='all') {
    const types=compressorSubcategories.slice(0,3)
    const products=catalogProducts.filter(product=>types.some(type=>type.id===product.subcategoryId))
    const filters=[{id:'subcategory',label:'Тип компрессора',type:'checkbox' as const,initiallyOpen:true,options:types.map(type=>({value:type.id,label:type.name}))},...fullFilterGroups]
    return <main className="catalog-page catalog-landing catalog-listing-approved"><Breadcrumbs items={[{label:'Главная',to:'/'},{label:'Каталог',to:'/catalog'},{label:'Компрессоры'}]}/><header className="catalog-page__header catalog-page__header--category"><h1>Компрессоры</h1></header><ProductListing products={products} filterGroups={filters} mode="full" title={null}/></main>
  }

  const usesCompactGrid = category.slug === 'compressor-equipment'

  return (
    <main className={`catalog-page catalog-section-page${usesCompactGrid ? ' catalog-landing compressor-landing' : ''}`}>
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
