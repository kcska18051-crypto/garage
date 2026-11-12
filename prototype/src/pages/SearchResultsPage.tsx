import {useMemo,useRef,useState,type FormEvent} from 'react'
import {Link,useSearchParams} from 'react-router-dom'
import {Breadcrumbs} from '../features/catalog/Breadcrumbs'
import {CatalogProductCard} from '../features/catalog/CatalogProductCard'
import {paginateProducts,parseListingState,serializeListingState,sortCatalogProducts} from '../features/catalog/catalogFilters'
import {formatProductCount} from '../data/catalogData'
import type {ListingState} from '../data/catalogTypes'
import {searchCatalogProducts} from '../data/searchResults'
import {RoundedIcon} from '../features/header/RoundedIcon'
import '../features/catalog/Catalog.css'
import './SearchResultsPage.css'

const suggestions=['Компрессоры','Remeza','Краскопульт','Набор инструмента']
export function SearchResultsPage() {
  const [params,setParams]=useSearchParams()
  const query=params.get('q')?.trim()??''
  return <SearchContent key={query} query={query} params={params} onParams={setParams}/>
}
function SearchContent({query,params,onParams}:{query:string;params:URLSearchParams;onParams(params:URLSearchParams):void}) {
  const [input,setInput]=useState(query)
  const heading=useRef<HTMLHeadingElement>(null),formInput=useRef<HTMLInputElement>(null)
  const products=useMemo(()=>query?searchCatalogProducts(query):[],[query])
  const state=parseListingState(new URLSearchParams({sort:params.get('sort')??'',page:params.get('page')??'1'}))
  const results=sortCatalogProducts(products,state.sort)
  const pagination=paginateProducts(results,state.page,12)
  const commit=(next:ListingState)=>{const url=serializeListingState(next);url.set('q',query);onParams(url)}
  const submit=(event:FormEvent)=>{event.preventDefault();onParams(input.trim()?new URLSearchParams({q:input.trim()}):new URLSearchParams())}
  const search=(q:string)=>onParams(new URLSearchParams({q}))
  const goPage=(page:number)=>{commit({...state,page});heading.current?.focus();heading.current?.scrollIntoView({block:'start'})}
  const pages=Array.from({length:pagination.pages},(_,i)=>i+1).filter(page=>page===1||page===pagination.pages||Math.abs(page-pagination.page)<=1)
  return <main className="search-results">
    <Breadcrumbs items={[{label:'Главная',to:'/'},{label:'Поиск'}]}/>
    <header className="search-results__heading"><h1>Результаты поиска</h1>{query&&<p>По запросу <strong>«{query}»</strong></p>}</header>
    <form className="search-results__form" role="search" aria-label="Уточнить поиск" onSubmit={submit}>
      <label className="sr-only" htmlFor="results-query">Изменить поисковый запрос</label>
      <input id="results-query" ref={formInput} type="search" value={input} onChange={e=>setInput(e.target.value)} placeholder="Название, бренд или артикул" autoComplete="off"/>
      <button type="submit" aria-label="Найти"><RoundedIcon name="search"/><span>Найти</span></button>
    </form>
    {products.length>0?<>
        <section className="search-results__products" aria-labelledby="search-products-heading">
          <div className="search-results__toolbar"><h2 id="search-products-heading" ref={heading} tabIndex={-1} aria-live="polite">Найдено {formatProductCount(results.length)}</h2><label>Сортировка<select aria-label="Сортировка" value={state.sort} onChange={e=>commit({...state,sort:e.target.value as ListingState['sort'],page:1})}><option value="popular">По популярности</option><option value="price-asc">Сначала дешевле</option><option value="price-desc">Сначала дороже</option><option value="available">По наличию</option></select></label></div>
          <><div className="catalog-results search-results__grid">{pagination.items.map((product,index)=><CatalogProductCard product={product} index={index} key={product.id} quoteHref={product.purchaseMode==='quote'?'/product/'+product.slug:undefined} mediaFallback={<span className="search-results__missing-photo"><svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="8" y="10" width="32" height="28" rx="4"/><circle cx="19" cy="20" r="3"/><path d="m10 34 10-9 8 7 5-5 7 8"/></svg><small>Фото уточняется</small></span>}/>)}</div>
          {pagination.pages>1&&<nav className="search-results__pagination" aria-label="Страницы поиска"><button type="button" aria-label="Предыдущая страница" disabled={pagination.page===1} onClick={()=>goPage(pagination.page-1)}>‹</button>{pages.map((page,index)=><span key={page}>{index>0&&page-pages[index-1]>1&&<span aria-hidden="true">…</span>}<button type="button" aria-label={`Страница ${page}`} aria-current={pagination.page===page?'page':undefined} onClick={()=>goPage(page)}>{page}</button></span>)}<button type="button" aria-label="Следующая страница" disabled={pagination.page===pagination.pages} onClick={()=>goPage(pagination.page+1)}>›</button></nav>}</>
        </section>
    </>:<section className="search-results__empty search-results__empty--query"><span className="search-results__empty-icon"><RoundedIcon name="search"/></span><div><h2>{query?'По вашему запросу ничего не найдено':'Что вы ищете для мастерской?'}</h2><p>{query?'Проверьте написание или попробуйте более короткое название. Можно искать по бренду или артикулу.':'Введите название товара, бренд или артикул. Или начните с одного из популярных запросов.'}</p><div className="search-results__suggestions">{suggestions.map(q=><button key={q} type="button" onClick={()=>search(q)}>{q}</button>)}</div><Link className="search-results__warm" to="/catalog">Перейти в каталог</Link></div></section>}
  </main>
}
