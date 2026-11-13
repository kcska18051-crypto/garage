import {useCallback,useState} from 'react'
import {Link} from 'react-router-dom'
import {repairServices} from '../data/servicesData'
import {Breadcrumbs} from '../features/catalog/Breadcrumbs'
import {ServiceRequestEntry} from '../features/services/ServiceRequestEntry'
import './CompressorRepairOverview.css'
const content:Record<string,{photo:string;alt:string;description:string}>={
 screw:{photo:'screw-compressor-diagnostics.png',alt:'Винтовой компрессор с открытым сервисным отсеком',description:'Компрессорный блок, привод, система управления и узлы подготовки воздуха.'},
 piston:{photo:'piston-compressor-diagnostics.png',alt:'Поршневой компрессор с горизонтальным ресивером',description:'Поршневая группа, привод и система регулирования давления.'},
 diesel:{photo:'diesel-compressor-diagnostics.png',alt:'Передвижной компрессор с дизельным приводом',description:'Дизельный двигатель, компрессорная часть и рабочие системы установки.'},
}
function Arrow(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>}
export function CompressorRepairOverview(){
 const [open,setOpen]=useState(false)
 const close=useCallback(()=>setOpen(false),[])
 return <main className="compressor-overview">
  <Breadcrumbs items={[{label:'Главная',to:'/'},{label:'Услуги',to:'/services'},{label:'Сервисный центр по ремонту',to:'/services/service-center'},{label:'Ремонт компрессоров'}]}/>
  <header className="compressor-overview__heading"><h1>Ремонт компрессоров</h1><p>Выберите тип установки</p><span>Узнайте о направлении ремонта и оставьте заявку на странице вашего оборудования.</span></header>
  <section aria-label="Тип компрессора" className="compressor-overview__grid">{repairServices.map(item=><article key={item.id}><Link to={item.href} className="compressor-overview__card" aria-label={item.title}><div className="compressor-overview__photo"><img src={`/garage/style-check/review-assets/${content[item.id].photo}`} width="1448" height="1086" alt={content[item.id].alt} decoding="async"/></div><div className="compressor-overview__copy"><h2>{item.title}</h2><p>{content[item.id].description}</p><span className="compressor-overview__action">Подробнее<Arrow/></span></div></Link></article>)}</section>
  <section className="compressor-overview__help" aria-labelledby="compressor-help-title"><div><h2 id="compressor-help-title">Не знаете тип компрессора?</h2><p>Укажите модель и опишите проблему. Фото оборудования можно добавить по желанию.</p></div><button className="compressor-overview__button" type="button" onClick={()=>setOpen(true)}>Оставить заявку<Arrow/></button></section>
  <p className="compressor-overview__terms">Состав работ, стоимость и сроки уточняются индивидуально.</p>
  <Link className="compressor-overview__back" to="/services/service-center">← Все направления сервисного центра</Link>
  {open&&<ServiceRequestEntry request={{kind:'repair',title:'Ремонт компрессоров',itemId:'compressor-repair'}} onClose={close}/>}
 </main>
}
