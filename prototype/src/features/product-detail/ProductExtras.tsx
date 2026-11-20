import { useState } from 'react'
import { formatAvailability } from '../../utils/availability'
import { equipmentOptions, companionProducts } from '../../data/productRelations'
import { money, defaultOffer, type ProductOffer } from '../../data/productDetailData'
import { useCommerce } from '../../state/CommerceState'

const accessoryDrawings:Record<string,string>={
 'supply-organizer':'M7 13h34v28H7zM7 22h34M18 13v28M30 13v28M12 7h24v6',
 'supply-pad':'M7 21c0-8 34-8 34 0v11c0 8-34 8-34 0ZM7 21c0 8 34 8 34 0M16 19h16',
 'supply-paint':'M7 9h34L28 28v12h-8V28ZM11 15h26M16 22h16',
 'supply-abrasive':'M24 5a19 19 0 1 0 0 38 19 19 0 0 0 0-38ZM24 18a6 6 0 1 0 0 12 6 6 0 0 0 0-12M14 12l3 3M31 33l3 3M12 34l3-3M33 17l3-3',
 'supply-cable':'M12 9v9h10v-9ZM15 9V4M20 9V4M17 18v13c0 13 20 13 20 0V20M32 14h10v7H32zM35 14V9M39 14V9',
 'supply-welding':'M8 12h32v25H8zM12 8h24v4M12 37v4h24v-4M16 12v25M22 12v25M28 12v25M34 12v25',
}
function ExtraImage({ id, name }: { id:string; name:string }) {
  const photo = id === 'option-dryer' ? 'product-dryer.jpg' : id === 'supply-filter' ? 'compressor-categories/filter.webp' : undefined
  return <div className="extra-photo">{photo ? <img src={'/garage/style-check/review-assets/' + photo} alt={name} loading="lazy" /> : <svg viewBox="0 0 48 48" role="img" aria-label={name} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{id === 'supply-oil' ? <><path d="M12 15h19l5 7v18H12zM16 15V8h11v7M16 8h11M18 25h12v8H18zM31 15l5-6h5v9l-5 4"/><path d="M23 22s-3 4-3 6a3 3 0 0 0 6 0c0-2-3-6-3-6Z" fill="#ffcc00" stroke="none"/></> : accessoryDrawings[id] ? <path d={accessoryDrawings[id]}/> : <><rect x="10" y="13" width="28" height="26" rx="4"/><path d="M17 27h14M17 32h8M18 9a9 9 0 0 1 12 0M22 5a4 4 0 0 1 4 0"/><rect x="16" y="19" width="16" height="5" rx="1" fill="#ffcc00" stroke="none"/></>}</svg>}</div>
}
export function ProductExtras({ offer = defaultOffer }: { offer?: ProductOffer }) {
  const { addToCart } = useCommerce()
  const [selected,setSelected] = useState<Record<string,number>>({})
  const [message,setMessage] = useState('')
  const [expanded,setExpanded]=useState(false)
  const [companionMessage,setCompanionMessage]=useState('')
  return <><section className="product-content-section product-options" id="options"><h2>Опции</h2><p>Дополнительные узлы оборудования. Совместимость уточняется при заказе.</p><div className="product-options__grid">{equipmentOptions.map(p => <article key={p.id} className="extra-card">
    <ExtraImage id={p.id} name={p.name}/><div className="extra-card__copy"><div className="extra-card__heading"><h3>{p.name}</h3><strong>{money(p.price)}</strong></div><small>Артикул: {p.sku}</small><p className="extra-card__description">{p.description}</p><span className="extra-card__availability">{formatAvailability(p.availabilityStatus,p.storeCount)}</span></div>
    <div className="extra-card__controls"><label className="extra-card__select"><input type="checkbox" aria-label={'Выбрать опцию ' + p.name} checked={Boolean(selected[p.id])} onChange={e => setSelected(current => ({...current,[p.id]:e.target.checked ? 1 : 0}))}/>Выбрать</label><label className="extra-card__quantity">Количество<input type="number" aria-label={'Количество ' + p.name} min={1} max={99} step={1} value={selected[p.id] || 1} onChange={e => setSelected(current => ({...current,[p.id]:Math.max(1,Math.min(99,Math.floor(Number(e.target.value)) || 1))}))}/></label><button type="button" className="extra-card__cart" onClick={() => {addToCart(p.id,selected[p.id] || 1,offer.id);setMessage(p.name + ' добавлен как опция')}}>В корзину отдельно</button></div>
  </article>)}</div><div className="product-options__footer"><button className="button" type="button" onClick={() => {addToCart(offer.id);Object.entries(selected).filter(([,q])=>q>0).forEach(([id,q])=>addToCart(id,q,offer.id));setMessage('Основной товар и выбранные опции добавлены в корзину')}}>Добавить товар с выбранными опциями</button></div>{message && <p role="status">{message}</p>}</section>
  <section className="product-content-section product-companions" id="companion-products" aria-label="Сопутствующие товары"><h2>Сопутствующие товары</h2><p>Расходные материалы и принадлежности. Демонстрационная подборка; совместимость уточняется при заказе.</p><div className="companion-products">{companionProducts.slice(0,expanded?companionProducts.length:4).map(p => <article key={p.id} className="extra-card" data-companion-id={p.id}><ExtraImage id={p.id} name={p.name}/><div className="extra-card__copy"><h3>{p.name}</h3><small>Артикул: {p.sku}</small><span className="extra-card__availability">{formatAvailability(p.availabilityStatus,p.storeCount)}</span><div className="extra-card__buy"><strong>{money(p.price)}</strong><button type="button" className="extra-card__cart" aria-label={'Добавить в корзину: ' + p.name} onClick={()=>{addToCart(p.id);setCompanionMessage('Добавлено в корзину: ' + p.name)}}>В корзину</button></div></div></article>)}</div><button type="button" className="button product-companions__more" aria-expanded={expanded} onClick={()=>setExpanded(value=>!value)}>{expanded?'Свернуть':`Показать ещё ${Math.max(0,companionProducts.length-4)}`}</button>{companionMessage&&<p role="status">{companionMessage}</p>}</section></>
}
