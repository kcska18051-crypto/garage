import {useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import {useOptionalCommerce} from '../../state/CommerceState'
import {compareProducts,money} from '../../data/compareData'
import {styleCheckProductPhotos} from '../../data/styleCheckAssets'
import {catalogProducts} from '../../data/catalogData'
import {compressorCategoryImages} from '../catalog/compressorCategoryImages'
import './ComparePreview.css'
export function ComparePreview({count}:{count:number}) {
 const commerce=useOptionalCommerce()
 const [open,setOpen]=useState(false)
 useEffect(()=>{if(!open)return;const close=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false)};document.addEventListener('keydown',close);return()=>document.removeEventListener('keydown',close)},[open])
 const products=compareProducts.filter(product=>commerce?.compareIds.has(product.id))
 return <div className="compare-preview" onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)} onFocus={()=>setOpen(true)} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))setOpen(false)}} onKeyDown={event=>{if(event.key==='Escape'){setOpen(false);event.stopPropagation()}}}>
  <Link className="header-action" to="/compare" aria-label={'Сравнение'+(count?': '+count:'')} aria-expanded={open} onClick={()=>setOpen(false)}><span aria-hidden="true">≡</span><small>Сравнение</small>{count>0&&<b>{count}</b>}</Link>
  {open&&<section className="compare-preview__panel" aria-label="Товары в сравнении">
   <div className="compare-preview__heading">В сравнении <span>{products.length}</span></div>
   {products.length?<ul>{products.map(product=>{
    const catalog=catalogProducts.find(item=>item.id===product.id)
    const image=styleCheckProductPhotos[product.name]||(catalog?compressorCategoryImages[catalog.subcategoryId]:undefined)
    return <li key={product.id}><Link to={product.href} onClick={()=>setOpen(false)}>{image&&<img src={image} alt="" width="64" height="64"/>}<span><span className="compare-preview__name">{product.name}</span><strong>{product.purchaseMode==='quote'?'Цена по запросу':money(product.price)}</strong></span></Link></li>
   })}</ul>:<p>Добавьте товары, чтобы сравнить их характеристики.</p>}
   <Link className="compare-preview__cta" to={products.length?'/compare':'/catalog'} onClick={()=>setOpen(false)}>{products.length?'Перейти к сравнению':'Выбрать товары'}</Link>
  </section>}
 </div>
}
