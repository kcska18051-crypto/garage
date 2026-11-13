import {useCallback,useState} from 'react'
import {Link} from 'react-router-dom'
import {repairDirections} from '../data/servicesData'
import type {ServiceRequest} from '../data/serviceTypes'
import {Breadcrumbs} from '../features/catalog/Breadcrumbs'
import {ServiceRequestEntry} from '../features/services/ServiceRequestEntry'
import './ServiceCenterShowcase.css'

const tools:Record<string,{description:string;path:string;accent:string}>={
 'impact-wrench-repair':{description:'Пневматический и электрический инструмент для работы с крепежом.',path:'M9 18h26v13H9z M35 21h10v7H35 M45 22h10v5H45 M14 31l-3 19h11l5-19 M15 50v5h10 M9 21H5v7h4 M15 21v7m5-7v7 M28 25h3',accent:'M14 31l-3 19h11l5-19Z'},
 'angle-grinder-repair':{description:'Запуск, привод и работа угловой шлифовальной машины.',path:'M16 31l22-12 8 14-22 12z M8 35l8-4 8 14-8 4z M38 19l5-3 7 13-4 4 M43 16l5-3 M33 19l-3-8-6 2 3 8 M47 29a12 12 0 1 1-3 21 M47 30l-3 20 M13 49l-3 9',accent:'M8 35l8-4 8 14-8 4Z'},
 'polisher-repair':{description:'Роторные и эксцентриковые полировальные машинки.',path:'M10 25l24-8 5 14-24 8z M10 25l-4 2 4 12 5-1 M34 17h10l5 9-10 5 M42 31v9 M33 45c0-4 6-7 13-7s13 3 13 7-6 7-13 7-13-3-13-7Z M33 45v5c0 4 6 7 13 7s13-3 13-7v-5 M20 19l-3-7 7-3 3 8',accent:'M33 45c0-4 6-7 13-7s13 3 13 7-6 7-13 7-13-3-13-7Z'},
 'pressure-washer-repair':{description:'Давление, подача воды и работа аппарата.',path:'M14 20h24l5 29H9z M18 20V7h16v13 M19 7V3h14v4 M17 29h12v12H17z M14 55a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm23 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M43 30h9V17l6-8 M48 17l6 3 M43 41c13 0 15 13 7 15',accent:'M14 20h24l5 29H9Z'},
}
const steps=[{title:'Обращение',text:'Выберите оборудование и опишите проблему.'},{title:'Диагностика',text:'Уточните с сервисом условия проверки и передачи оборудования.'},{title:'Согласование',text:'Обсудите состав работ, стоимость и сроки.'},{title:'Ремонт и получение',text:'Согласуйте выполнение работ и возврат оборудования.'}]
function Arrow(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>}
function ToolArt({id}:{id:string}){const tool=tools[id];return <svg className="service-hub__tool" viewBox="0 0 64 64" fill="none" stroke="#29312c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="32" cy="32" r="29" fill="#fff7d6" stroke="none"/><path d={tool.accent} fill="#ffda6d" stroke="none"/><path d={tool.path}/></svg>}
export function ServiceCenterShowcase(){
 const [request,setRequest]=useState<ServiceRequest|null>(null)
 const close=useCallback(()=>setRequest(null),[])
 const compressor=repairDirections[0]
 return <main className="service-hub">
  <Breadcrumbs items={[{label:'Главная',to:'/'},{label:'Услуги',to:'/services'},{label:'Сервисный центр по ремонту'}]}/>
  <header className="service-hub__hero"><div><h1>Сервисный центр <br/>по ремонту</h1><p className="service-hub__lead">Оборудование и инструмент. Одна точка обращения.</p><p>Компрессоры, гайковёрты, шлифовальные и полировальные машинки, аппараты высокого давления. Выберите направление — начнём с вашей задачи.</p><span className="service-hub__terms">Состав работ, стоимость и сроки уточняются индивидуально.</span></div><img src="/garage/style-check/review-assets/about-company-workshop.png" width="1536" height="1024" alt="Оборудование и инструмент в профессиональной мастерской" decoding="async" fetchPriority="high"/></header>
  <section className="service-hub__directions" aria-labelledby="service-hub-directions"><h2 id="service-hub-directions">Что нужно отремонтировать?</h2><p className="service-hub__section-description">Выберите оборудование, чтобы узнать о направлении или оставить заявку.</p>
   <div className="service-hub__grid">
    <article className="service-hub__compressors"><div><h3><Link to={compressor.href!}>Ремонт компрессоров</Link></h3><p>Винтовые, поршневые и дизельные установки.</p></div><Link className="service-hub__compressor-photo" to={compressor.href!} aria-label="Выбрать тип компрессора"><img src="/garage/style-check/review-assets/piston-compressor-diagnostics.png" width="1448" height="1086" alt="Поршневой компрессор в сервисной мастерской" loading="lazy"/></Link><nav className="service-hub__types" aria-label="Тип компрессора">{[['screw','Винтовые'],['piston','Поршневые'],['diesel','Дизельные']].map(([slug,title])=><Link key={slug} to={`${compressor.href}/${slug}`}>{title}<Arrow/></Link>)}</nav><div className="service-hub__actions"><Link className="service-hub__button" to={compressor.href!}>Выбрать тип<Arrow/></Link><button className="service-hub__text-action" type="button" aria-label={`Оставить заявку: ${compressor.title}`} onClick={()=>setRequest({kind:'repair',title:compressor.title,itemId:compressor.id})}>Оставить заявку</button></div></article>
    {repairDirections.slice(1).map(item=><article className="service-hub__direction" key={item.id}><ToolArt id={item.id}/><h3>{item.title}</h3><p>{tools[item.id].description}</p><button className="service-hub__button" type="button" aria-label={`Оставить заявку: ${item.title}`} onClick={()=>setRequest({kind:'repair',title:item.title,itemId:item.id})}>Оставить заявку<Arrow/></button></article>)}
   </div>
  </section>
  <section className="service-hub__process" aria-labelledby="service-hub-process"><h2 id="service-hub-process">Как проходит ремонт</h2><p className="service-hub__section-description">От первого обращения до получения оборудования. <br/>Условия каждого этапа согласовываются с сервисом.</p><ol>{steps.map((step,i)=><li key={step.title}><span>{String(i+1).padStart(2,'0')}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol></section>
  <Link className="service-hub__back" to="/services">← Все услуги</Link>
  {request&&<ServiceRequestEntry key={request.itemId} request={request} onClose={close}/>}
 </main>
}
