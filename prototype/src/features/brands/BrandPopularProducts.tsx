import {useEffect,useRef,useState} from 'react'
import {CatalogProductCard} from '../catalog/CatalogProductCard'
import {remezaProducts} from '../../data/brandDetailData'
export function BrandPopularProducts(){
 const ref=useRef<HTMLDivElement>(null)
 const [position,setPosition]=useState({start:true,end:false})
 const update=()=>{const rail=ref.current;if(rail)setPosition({start:rail.scrollLeft<2,end:rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-2})}
 useEffect(()=>{update();const rail=ref.current;if(!rail)return;const observer=typeof ResizeObserver!=='undefined'?new ResizeObserver(update):null;observer?.observe(rail);return()=>observer?.disconnect()},[])
 const move=(direction:number)=>{const rail=ref.current;if(!rail)return;rail.scrollBy({left:direction*(rail.clientWidth+16),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
 return <section className="brand-detail-section brand-popular-products" aria-label="Популярные товары Remeza"><div className="brand-detail-heading brand-detail-heading--row"><div><h2>Популярные товары Remeza</h2><a href="#brand-products">Смотреть все товары Remeza</a></div><div className="brand-popular-controls"><button type="button" aria-label="Предыдущие популярные товары" onClick={()=>move(-1)} disabled={position.start}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg></button><button type="button" aria-label="Следующие популярные товары" onClick={()=>move(1)} disabled={position.end}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg></button></div></div><div ref={ref} className="brand-popular-products__grid catalog-results" role="group" aria-label="Карусель популярных товаров Remeza" tabIndex={0} onScroll={update}>{remezaProducts.slice(0,8).map((product,index)=><CatalogProductCard key={product.id} product={product} index={index}/>)}</div></section>
}
