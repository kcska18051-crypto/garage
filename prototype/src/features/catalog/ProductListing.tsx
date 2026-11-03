import { useRef, useState } from 'react'
import type { CatalogProduct, FilterGroup, TagGroup } from '../../data/catalogTypes'
import { ActiveFilters } from './ActiveFilters'
import { CatalogProductCard } from './CatalogProductCard'
import { FilterPanel } from './FilterPanel'
import { MobileFilterDrawer } from './MobileFilterDrawer'
import { TagGroups } from './TagGroups'
import { useCatalogListing } from './useCatalogListing'
import {usePageBoundedFilter} from '../../hooks/usePageBoundedFilter'

const resultWord=(count:number)=>count%10===1&&count%100!==11?'товар':[2,3,4].includes(count%10)&&![12,13,14].includes(count%100)?'товара':'товаров'
type Props={products:CatalogProduct[];filterGroups:FilterGroup[];mode:'reduced'|'full';title?:string|null;tagGroups?:TagGroup[];showFilters?:boolean}

export function ProductListing({products,filterGroups,mode,title,tagGroups,showFilters=true}:Props){
 const listing=useCatalogListing({products,pageSize:12});const[filterOpen,setFilterOpen]=useState(false);const[draft,setDraft]=useState(listing.state);const filterTrigger=useRef<HTMLButtonElement>(null)
 const [expanded,setExpanded]=useState<{key:string;from:number}|null>(null)
 const resultKey=listing.results.map(product=>product.id).join(',')+listing.state.view
 const firstPage=expanded?.key===resultKey&&expanded.from<=listing.pagination.page?expanded.from:listing.pagination.page
 const visibleProducts=listing.results.slice((firstPage-1)*12,listing.pagination.page*12)
 const goToPage=(page:number)=>{setExpanded(null);listing.setPage(page)}
 const showMore=()=>{setExpanded({key:resultKey,from:firstPage});listing.setPage(listing.pagination.page+1)}
 const pages=Array.from({length:listing.pagination.pages},(_,index)=>index+1).filter(page=>page===1||page===listing.pagination.pages||Math.abs(page-listing.pagination.page)<=2)
 const filterSlot=useRef<HTMLDivElement>(null),sidebar=useRef<HTMLElement>(null)
 usePageBoundedFilter(filterSlot,sidebar,showFilters)
 const closeFilter=()=>{setFilterOpen(false);window.setTimeout(()=>filterTrigger.current?.focus(),0)};const openFilter=()=>{setDraft({...listing.state,specs:{...listing.state.specs}});setFilterOpen(true)}
 const resolvedTitle=title===null?null:title??(mode==='reduced'?'Все компрессорное оборудование':'Подбор оборудования')
 return <section className={`catalog-listing catalog-listing--${mode}${resolvedTitle?'':' catalog-listing--untitled'}`} aria-label={resolvedTitle?'Товары':'Товарная выдача'}>
  {resolvedTitle?<div className="catalog-listing__title"><div><h2>{resolvedTitle}</h2></div></div>:null}
  <div className={`catalog-listing__layout${showFilters?'':' catalog-listing__layout--no-filters'}`}>
   {showFilters?<div className="catalog-listing__sidebar-slot" ref={filterSlot}><aside ref={sidebar} className="catalog-listing__sidebar" aria-label="Фильтры">
    <div className="catalog-listing__filter-scroll" role="region" aria-label="Параметры фильтра" tabIndex={0}><FilterPanel groups={filterGroups} products={products} state={listing.state} onToggle={listing.toggleFilter} onPrice={listing.setPrice} onClearPrice={listing.clearPrice}/></div>
    <button className="catalog-listing__filter-reset" type="button" onClick={listing.clearAll}>Сбросить фильтры</button>
   </aside></div>:null}
   <div className="catalog-listing__content">{showFilters?<button ref={filterTrigger} className="catalog-mobile-filter-button" type="button" onClick={openFilter}>Фильтры</button>:null}{tagGroups?.length?<TagGroups groups={tagGroups} activeTag={listing.state.tag} onSelect={listing.applyTag}/>:null}<div className="catalog-listing__toolbar"><strong>Найдено {listing.results.length} {resultWord(listing.results.length)}</strong><div className="catalog-listing__controls"><label>Сортировка<select aria-label="Сортировка" value={listing.state.sort} onChange={event=>listing.setSort(event.target.value as typeof listing.state.sort)}><option value="popular">По популярности</option><option value="price-asc">Сначала дешевле</option><option value="price-desc">Сначала дороже</option><option value="new">По новизне</option><option value="available">По наличию</option></select></label><div className="catalog-view-switch" aria-label="Вид выдачи"><button type="button" aria-label="Плитка" aria-pressed={listing.state.view==='grid'} onClick={()=>listing.setView('grid')}>▦</button><button type="button" aria-label="Список" aria-pressed={listing.state.view==='list'} onClick={()=>listing.setView('list')}>☷</button></div></div></div><ActiveFilters state={listing.state} onRemove={listing.removeCriterion} onClear={listing.clearAll}/>{listing.results.length?<><div className={`catalog-results catalog-results--${listing.state.view}`} data-testid="catalog-results">{visibleProducts.map((product,index)=><CatalogProductCard key={product.id} product={product} index={index}/>)}</div><div className="catalog-pagination">{listing.pagination.page<listing.pagination.pages?<button className="catalog-pagination__more" type="button" onClick={showMore}>Показать ещё {Math.min(12,listing.results.length-listing.pagination.page*12)}</button>:null}<nav aria-label="Страницы каталога">{listing.pagination.page>1?<button type="button" aria-label="Предыдущая страница" onClick={()=>goToPage(listing.pagination.page-1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg></button>:null}{pages.map((page,index)=><span className="catalog-pagination__item" key={page}>{index>0&&page-pages[index-1]>1?<span aria-hidden="true">…</span>:null}<button type="button" aria-label={`Страница ${page}`} aria-current={listing.pagination.page===page?'page':undefined} onClick={()=>goToPage(page)}>{page}</button></span>)}{listing.pagination.page<listing.pagination.pages?<button type="button" aria-label="Следующая страница" onClick={()=>goToPage(listing.pagination.page+1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg></button>:null}</nav></div></>:<div className="catalog-empty"><span aria-hidden="true">∅</span><h3>Ничего не найдено</h3><p>Измените параметры или верните исходную выдачу.</p><button className="button button--dark" type="button" onClick={listing.clearAll}>Сбросить параметры</button></div>}</div></div>
  {showFilters&&filterOpen?<MobileFilterDrawer groups={filterGroups} products={products} draft={draft} onDraft={setDraft} onClose={closeFilter} onApply={()=>{listing.applyState(draft);closeFilter()}}/>:null}
 </section>
}
