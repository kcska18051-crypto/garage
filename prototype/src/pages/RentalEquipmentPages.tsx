import {useCallback,useState} from 'react'
import {Link,useParams} from 'react-router-dom'
import {rentalCategories,rentalItems} from '../data/rentalData'
import type {ServiceRequest} from '../data/serviceTypes'
import {Breadcrumbs} from '../features/catalog/Breadcrumbs'
import {ServiceRequestEntry} from '../features/services/ServiceRequestEntry'
import {NotFoundPage} from './NotFoundPage'
import './RentalEquipmentPages.css'
type RentalItem=typeof rentalItems[number]
const images:Record<string,string>={'hydraulic-jack':'product-jack.jpg','tool-set':'product-toolset.jpg','piston-compressor':'product-compressor.jpg','screw-compressor':'product-remeza1.jpg'}
const descriptions:Record<string,string>={'hydraulic-jack':'Подкатной домкрат для задач рабочего поста.','tool-set':'Набор ручного инструмента для временных работ.','piston-compressor':'Поршневой компрессор для подачи сжатого воздуха.','screw-compressor':'Винтовой компрессор Remeza для задач мастерской.'}
const root={label:'Аренда оборудования и инструмента',to:'/services/rental'}
function Arrow(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>}
function Specs({item,limit}:{item:RentalItem;limit?:number}){return <dl className="rental-equipment__specs">{item.specs.length?item.specs.slice(0,limit ?? item.specs.length).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>):<div><dt>Характеристики</dt><dd>Уточняются</dd></div>}</dl>}
function Notice(){return <aside className="rental-equipment__notice"><strong>Заявка не является бронью</strong><p>Наличие, тариф, залог, получение и возврат оборудования согласовываются отдельно. Доступность не меняется после отправки заявки.</p></aside>}
function Terms(){return <dl className="rental-equipment__terms"><div><dt>Тариф аренды</dt><dd>Уточняется</dd></div><div><dt>Залог</dt><dd>Уточняется</dd></div></dl>}
export function RentalEquipmentCategory({categoryId}:{categoryId:string}){
 const category=rentalCategories.find(item=>item.id===categoryId)
 const [request,setRequest]=useState<ServiceRequest|null>(null)
 const close=useCallback(()=>setRequest(null),[])
 if(!category)return <NotFoundPage/>
 return <main className="rental-equipment">
  <Breadcrumbs items={[{label:'Главная',to:'/'},{label:'Услуги',to:'/services'},root,{label:category.heading}]}/>
  <header className="rental-equipment__heading"><h1>{category.heading}</h1><p>{categoryId==='compressors'?'Выберите установку и укажите желаемый период аренды.':'Выберите инструмент, чтобы посмотреть параметры и оставить заявку на аренду.'}</p></header>
  <section className="rental-equipment__grid" aria-label={category.heading}>{rentalItems.filter(item=>item.categoryId===categoryId).map(item=><article key={item.id} data-rental-id={item.id}><Link className="rental-equipment__card-image" to={item.href} aria-label={`Подробнее: ${item.title}`}><img src={`/garage/style-check/review-assets/${images[item.id]}`} alt={item.title} decoding="async"/></Link><div className="rental-equipment__card-copy"><h2><Link to={item.href}>{item.title}</Link></h2><span className="rental-equipment__sku">Артикул {item.sku}</span><Specs item={item} limit={2}/><p className="rental-equipment__pending">Тариф и залог уточняются</p><div className="rental-equipment__actions">{categoryId==='compressors'?<><button className="rental-equipment__button" type="button" aria-label={`Арендовать: ${item.title}`} onClick={()=>setRequest({kind:'rental',title:item.title,itemId:item.id})}>Арендовать<Arrow/></button><Link className="rental-equipment__text-link" to={item.href}>Подробнее</Link></>:<Link className="rental-equipment__button" to={item.href}>Подробнее<Arrow/></Link>}</div></div></article>)}</section>
  <Notice/><p className="rental-equipment__demo">Демонстрационные параметры. Характеристики и фактическая комплектация требуют подтверждения.</p>
  <Link className="rental-equipment__back" to="/services/rental">← Все направления аренды</Link>
  {request&&<ServiceRequestEntry key={request.itemId} request={request} onClose={close}/>}
 </main>
}
export function RentalEquipmentDetail(){
 const {rentalSlug}=useParams()
 const item=rentalItems.find(product=>product.id===rentalSlug)
 const [open,setOpen]=useState(false)
 const close=useCallback(()=>setOpen(false),[])
 if(!item)return <NotFoundPage/>
 const category=rentalCategories.find(category=>category.id===item.categoryId)!
 return <main className="rental-equipment rental-equipment--detail">
  <Breadcrumbs items={[{label:'Главная',to:'/'},{label:'Услуги',to:'/services'},root,{label:category.heading,to:category.href},{label:item.title}]}/>
  <header className="rental-equipment__heading"><h1>{item.title}</h1><span className="rental-equipment__sku">Артикул {item.sku}</span></header>
  <div className="rental-equipment__detail"><div className="rental-equipment__detail-image"><img src={`/garage/style-check/review-assets/${images[item.id]}`} alt={item.title} decoding="async" fetchPriority="high"/></div><div className="rental-equipment__detail-copy"><p className="rental-equipment__description">{descriptions[item.id]}</p><h2>Основные параметры</h2><Specs item={item}/><p className="rental-equipment__demo">Демонстрационные параметры. Характеристики и фактическая комплектация требуют подтверждения.</p><Terms/><button className="rental-equipment__button" type="button" onClick={()=>setOpen(true)}>Арендовать<Arrow/></button><p className="rental-equipment__hint">В заявке можно указать даты и количество оборудования.</p></div></div>
  <Notice/>
  <section className="rental-equipment__steps" aria-labelledby="rental-equipment-next"><h2 id="rental-equipment-next">После заявки</h2><ol>{[{title:'Наличие и период',text:'Уточните доступность на нужные даты и количество.'},{title:'Стоимость и условия',text:'Согласуйте тариф, залог и порядок оформления аренды.'},{title:'Получение и возврат',text:'Обсудите передачу оборудования и условия его возврата.'}].map((step,i)=><li key={step.title}><span>{String(i+1).padStart(2,'0')}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol></section>
  <Link className="rental-equipment__back" to={category.href}>← Все позиции аренды</Link>
  {open&&<ServiceRequestEntry request={{kind:'rental',title:item.title,itemId:item.id}} onClose={close}/>}
 </main>
}
