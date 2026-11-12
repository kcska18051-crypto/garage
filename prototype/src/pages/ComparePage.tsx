import {useEffect,useMemo,useRef,useState,type CSSProperties} from 'react'
import {Link} from 'react-router-dom'
import {compareCategories,compareProducts,demoCompareIds,money,type CompareProduct} from '../data/compareData'
import {catalogProducts} from '../data/catalogData'
import {styleCheckProductPhotos} from '../data/styleCheckAssets'
import {compressorCategoryImages} from '../features/catalog/compressorCategoryImages'
import {Breadcrumbs} from '../features/catalog/Breadcrumbs'
import {RoundedIcon} from '../features/header/RoundedIcon'
import {useCommerce} from '../state/CommerceState'
import {productDetail} from '../data/productDetailData'
import './ComparePage.css'

function imageFor(product:CompareProduct) {
 const catalog=catalogProducts.find(item=>item.id===product.id)
 return styleCheckProductPhotos[product.name]||(catalog?compressorCategoryImages[catalog.subcategoryId]:product.specs['Тип компрессора']==='Винтовой'?compressorCategoryImages['screw-compressors']:undefined)
}
function ProductImage({product}:{product:CompareProduct}) {
 const image=imageFor(product)
 return image?<img src={image} alt={product.name} width="240" height="150" loading="lazy"/>:<span className="compare-photo-pending"><RoundedIcon name="catalog"/><small>Фото уточняется</small></span>
}
function CompareCard({product,onRemove}:{product:CompareProduct;onRemove():void}) {
 const commerce=useCommerce()
 return <article className="compare-card" data-testid="compare-product-card">
  <button className="compare-card__remove" type="button" aria-label={`Убрать из сравнения: ${product.name}`} onClick={onRemove}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 6 8 8M14 6l-8 8"/></svg></button>
  <Link className="compare-card__media" to={product.href} aria-label={`Открыть товар: ${product.name}`}><ProductImage product={product}/></Link>
  <div className="compare-card__price"><strong>{product.purchaseMode==='quote'?'Цена по запросу':money(product.price)}</strong>{product.oldPrice&&<del>{money(product.oldPrice)}</del>}</div>
  <Link className="compare-card__name" to={product.href}>{product.name}</Link>
  {product.id===productDetail.id?<Link className="compare-card__rating" to={product.href+'#reviews'}><span>★ {productDetail.rating}</span> · {productDetail.reviewCount}</Link>:<span className="compare-card__rating" aria-hidden="true">&nbsp;</span>}
  <p className="compare-card__sku">Артикул: {product.sku}</p>
  <p className="compare-card__availability" data-in-stock={product.availability.startsWith('В наличии')}>{product.availability}</p>
  {product.purchaseMode==='quote'?<Link className="compare-card__cart" to={product.href}>Запросить цену</Link>:<button className="compare-card__cart" type="button" onClick={()=>commerce.addToCart(product.id)}>{commerce.cartIds.has(product.id)?'В корзине':'В корзину'}</button>}
 </article>
}
export function ComparePage() {
 const commerce=useCommerce()
 const [activeCategory,setActiveCategory]=useState<(typeof compareCategories)[number]['id']|'all'>(()=>compareProducts.find(product=>commerce.compareIds.has(product.id))?.categoryId??'compressors')
 const [onlyDifferences,setOnlyDifferences]=useState(false),[pickerOpen,setPickerOpen]=useState(false),[pickerQuery,setPickerQuery]=useState(''),[pickerLimit,setPickerLimit]=useState(12)
 const scroller=useRef<HTMLDivElement>(null)
 useEffect(()=>commerce.ensureDemoCompare(demoCompareIds),[])
 const selectedProducts=compareProducts.filter(product=>commerce.compareIds.has(product.id))
 const visibleProducts=selectedProducts.filter(product=>activeCategory==='all'||product.categoryId===activeCategory)
 const tabs=compareCategories.filter(category=>category.id===activeCategory||selectedProducts.some(product=>product.categoryId===category.id))
 const candidates=compareProducts.filter(product=>(activeCategory==='all'||product.categoryId===activeCategory)&&!commerce.compareIds.has(product.id)&&`${product.name} ${product.sku}`.toLocaleLowerCase().includes(pickerQuery.trim().toLocaleLowerCase()))
 const showDifferences=onlyDifferences&&visibleProducts.length>1
 const specNames=useMemo(()=>{
  const names=[...new Set(visibleProducts.flatMap(product=>Object.keys(product.specs)))]
  return showDifferences?names.filter(name=>new Set(visibleProducts.map(product=>product.specs[name]??'—')).size>1):names
 },[showDifferences,visibleProducts])
 const different=(name:string)=>new Set(visibleProducts.map(product=>product.specs[name]??'—')).size>1
 const activeIds=visibleProducts.map(product=>product.id)
 const changeCategory=(id:typeof activeCategory)=>{setActiveCategory(id);setPickerOpen(false);setPickerQuery('');setPickerLimit(12);if(scroller.current)scroller.current.scrollLeft=0}
 return <main className="compare-page">
  <Breadcrumbs items={[{label:'Главная',to:'/'},{label:'Сравнение товаров'}]}/>
  <header className="compare-heading"><div><h1>Сравнение товаров</h1><p>Сравните характеристики и выберите оборудование под свою задачу.</p></div>{commerce.compareIds.size>0&&<button type="button" onClick={()=>commerce.clearCompare()}>Очистить всё</button>}</header>
  {selectedProducts.length>0&&<div className="compare-tabs" role="tablist" aria-label="Категории сравнения">{tabs.map(category=><button key={category.id} role="tab" type="button" aria-selected={activeCategory===category.id} onClick={()=>changeCategory(category.id)}>{category.label} <span>{selectedProducts.filter(product=>product.categoryId===category.id).length}</span></button>)}<button role="tab" type="button" aria-selected={activeCategory==='all'} onClick={()=>changeCategory('all')}>Все товары <span>{selectedProducts.length}</span></button></div>}
  <section className="compare-toolbar" aria-label="Настройки сравнения"><label><input type="checkbox" checked={showDifferences} onChange={e=>setOnlyDifferences(e.target.checked)} disabled={visibleProducts.length<2}/>Показывать только различия</label><div><button className="compare-add" type="button" aria-expanded={pickerOpen} aria-controls="compare-picker" onClick={()=>setPickerOpen(!pickerOpen)}><span aria-hidden="true">+</span> Добавить товар</button><button className="compare-clear-category" type="button" onClick={()=>commerce.clearCompare(activeIds)} disabled={!activeIds.length}>{activeCategory==='all'?'Очистить все товары':'Очистить категорию'}</button></div></section>
  {pickerOpen&&<section id="compare-picker" className="compare-picker" aria-label="Добавление товара"><div className="compare-picker__heading"><h2>Добавить в сравнение</h2><button type="button" aria-label="Закрыть выбор товара" onClick={()=>setPickerOpen(false)}>×</button></div><label className="compare-picker__search">Название или артикул<input type="search" value={pickerQuery} onChange={e=>{setPickerQuery(e.target.value);setPickerLimit(12)}} placeholder="Найти товар для сравнения"/></label>{candidates.length?<><div className="compare-picker__items">{candidates.slice(0,pickerLimit).map(product=><button type="button" key={product.id} aria-label={`Добавить ${product.name}`} onClick={()=>{commerce.addCompare(product.id);setPickerOpen(false)}}><span className="compare-picker__art"><ProductImage product={product}/></span><span><strong>{product.name}</strong><small>{product.sku} · {product.purchaseMode==='quote'?'Цена по запросу':money(product.price)}</small></span><b aria-hidden="true">+</b></button>)}</div>{candidates.length>pickerLimit&&<button className="compare-picker__more" type="button" onClick={()=>setPickerLimit(pickerLimit+12)}>Показать ещё</button>}</>:<p>Нет подходящих товаров. Измените запрос или продолжите выбор в <Link to="/catalog">каталоге</Link>.</p>}</section>}
  {visibleProducts.length>0?<>
   <div className="compare-scroll" ref={scroller} data-testid="compare-scroll-area" tabIndex={0} role="region" aria-label="Товары и характеристики. Прокрутка по горизонтали">
    <table className="compare-table" aria-label="Сравнение характеристик" style={{'--compare-count':visibleProducts.length} as CSSProperties}>
     <colgroup><col className="compare-table__labels"/>{visibleProducts.map(product=><col key={product.id}/>)}</colgroup>
     <thead><tr><th scope="col" className="compare-table__intro"><span>Выбранные товары</span><small>{visibleProducts.length} в сравнении</small>{visibleProducts.length<2&&<p>Добавьте ещё один товар, чтобы увидеть различия.</p>}</th>{visibleProducts.map(product=><th scope="col" key={product.id}><CompareCard product={product} onRemove={()=>commerce.removeCompare(product.id)}/></th>)}</tr></thead>
     <tbody>{!specNames.length&&!showDifferences&&<tr><th scope="row">Характеристики</th>{visibleProducts.map(product=><td key={product.id}>Уточняются</td>)}</tr>}{specNames.map(name=><tr key={name} data-different={different(name)}><th scope="row">{name}</th>{visibleProducts.map(product=><td key={product.id}>{product.specs[name]??'—'}</td>)}</tr>)}</tbody>
    </table>
   </div>
   {showDifferences&&!specNames.length&&<p className="compare-no-differences" role="status">Различий в доступных характеристиках нет.</p>}
   <p className="compare-swipe-hint"><span aria-hidden="true">↔</span> Листайте таблицу в сторону, чтобы увидеть остальные товары.</p>
  </>:<section className="compare-empty"><span className="compare-empty__icon"><RoundedIcon name="compare"/></span><h2>В этой категории пока нет товаров</h2><p>Добавьте товары кнопкой выше или выберите их в каталоге.</p><Link className="compare-catalog" to="/catalog">Перейти в каталог</Link></section>}
 </main>
}
