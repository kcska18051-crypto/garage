import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../features/products/ProductCard'
import { prototypeData } from '../data/prototypeData'
import './SearchResultsPage.css'

export function SearchResultsPage() {
  const [params] = useSearchParams(); const query = params.get('q')?.trim() ?? ''; const needle = query.toLocaleLowerCase()
  const results = prototypeData.products.filter((item) => !needle || `${item.name} ${item.sku}`.toLocaleLowerCase().includes(needle))
  return <main className="search-results container"><h1>Результаты поиска{query && <>: «{query}»</>}</h1><p>{results.length ? `Найдено: ${results.length}` : 'По вашему запросу ничего не найдено'}</p>{results.length > 0 && <div className="search-results__grid">{results.map((item, index) => <ProductCard product={item} index={index} key={item.id}/>)}</div>}</main>
}
