import {useCallback,useEffect,useState} from 'react'
import {DemoLink as Link} from '../app/DemoLink'
import {hoseService,repairDirections} from '../data/servicesData'
import {additionalServiceDirections,serviceCenterRequest,serviceCenterSteps} from '../data/serviceCenterData'
import {regionalPhones} from '../data/regionalPhones'
import type {ServiceRequest} from '../data/serviceTypes'
import {Breadcrumbs} from '../features/catalog/Breadcrumbs'
import {ServiceRequestEntry} from '../features/services/ServiceRequestEntry'
import {ServiceSection,ServiceProcess} from '../features/services/ServiceEditorial'
import './ServiceCenterShowcase.css'
import './ServiceCenterEditorial.css'

const tools:Record<string,{description:string;path:string;accent:string}>={
 'impact-wrench-repair':{description:'Пневматический и электрический инструмент для работы с крепежом.',path:'M9 18h26v13H9z M35 21h10v7H35 M45 22h10v5H45 M14 31l-3 19h11l5-19 M15 50v5h10 M9 21H5v7h4 M15 21v7m5-7v7 M28 25h3',accent:'M14 31l-3 19h11l5-19Z'},
 'angle-grinder-repair':{description:'Запуск, привод и работа угловой шлифовальной машины.',path:'M16 31l22-12 8 14-22 12z M8 35l8-4 8 14-8 4z M38 19l5-3 7 13-4 4 M43 16l5-3 M33 19l-3-8-6 2 3 8 M47 29a12 12 0 1 1-3 21 M47 30l-3 20 M13 49l-3 9',accent:'M8 35l8-4 8 14-8 4Z'},
 'polisher-repair':{description:'Роторные и эксцентриковые полировальные машинки.',path:'M10 25l24-8 5 14-24 8z M10 25l-4 2 4 12 5-1 M34 17h10l5 9-10 5 M42 31v9 M33 45c0-4 6-7 13-7s13 3 13 7-6 7-13 7-13-3-13-7Z M33 45v5c0 4 6 7 13 7s13-3 13-7v-5 M20 19l-3-7 7-3 3 8',accent:'M33 45c0-4 6-7 13-7s13 3 13 7-6 7-13 7-13-3-13-7Z'},
 'pressure-washer-repair':{description:'Давление, подача воды и работа аппарата.',path:'M14 20h24l5 29H9z M18 20V7h16v13 M19 7V3h14v4 M17 29h12v12H17z M14 55a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm23 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M43 30h9V17l6-8 M48 17l6 3 M43 41c13 0 15 13 7 15',accent:'M14 20h24l5 29H9Z'},
}
function Arrow(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>}
function ToolArt({id}:{id:string}){const tool=tools[id];return <svg className="service-hub__tool" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="32" cy="32" r="29" fill="#FFF9E7" stroke="none"/><path d={tool.accent} fill="#FFCC00" stroke="none"/><path d={tool.path}/></svg>}

const requestHref=(id:string)=>`/services/request?kind=repair&item=${id}&from=%2Fservices%2Fservice-center`
export function ServiceCenterShowcase(){
 const [request,setRequest]=useState<ServiceRequest|null>(null)
 const close=useCallback(()=>setRequest(null),[])
 const compressor=repairDirections[0]
 useEffect(()=>{const old=document.title;document.title='Сервисный центр «Гараж» — ремонт инструмента и оборудования';return()=>{document.title=old}},[])
 return <main className="service-editorial service-hub service-center-editorial">
 <Breadcrumbs items={[{label:'Главная',to:'/'},{label:'Услуги',to:'/services'},{label:'Сервисный центр по ремонту'}]}/>
 <header className="service-hub__hero"><div><h1>Сервисный центр <br/>по ремонту</h1><p className="service-hub__lead">Инструмент и гаражное оборудование — от диагностики до выдачи.</p><p>Ремонтируем и обслуживаем технику любых брендов и года выпуска в Ярославле, Вологде и Череповце. От бытового шуруповёрта до профессионального оборудования автосервиса.</p><div className="service-editorial-hero__actions"><Link className="service-editorial-button" to={requestHref(serviceCenterRequest.id)}>Обсудить ремонт</Link><a className="service-editorial-text-link" href="#center-directions">Выбрать направление</a></div></div><figure className="center-hero-photo"><img src="/garage/style-check/review-assets/about-company-workshop.png" width="1536" height="1024" alt="Оборудование и инструмент в профессиональной мастерской" fetchPriority="high"/><figcaption>Полный цикл обслуживания<span>Диагностика · ремонт · проверка</span></figcaption></figure></header>
 <div className="center-assurance"><span>Профильные инженеры</span><span>Смета до начала работ</span><span>Гарантия на ремонт</span></div>
 <section className="service-hub__directions" id="center-directions" aria-labelledby="service-hub-directions"><header className="service-editorial-heading"><h2 id="service-hub-directions">Что нужно отремонтировать?</h2><p>Выберите технику, чтобы узнать о ремонте или сразу оставить заявку.</p></header>
   <div className="service-hub__grid">
    <article className="service-hub__compressors"><div><h3><Link to={compressor.href!}>Ремонт компрессоров</Link></h3><p>Винтовые, поршневые и дизельные установки.</p></div><Link className="service-hub__compressor-photo" to={compressor.href!} aria-label="Выбрать тип компрессора"><img src="/garage/style-check/review-assets/piston-compressor-diagnostics.png" width="1448" height="1086" alt="Поршневой компрессор в сервисной мастерской" loading="lazy"/></Link><nav className="service-hub__types" aria-label="Тип компрессора">{[['screw','Винтовые'],['piston','Поршневые'],['diesel','Дизельные']].map(([slug,title])=><Link key={slug} to={`${compressor.href}/${slug}`}>{title}<Arrow/></Link>)}</nav><div className="service-hub__actions"><Link className="service-hub__button" to={compressor.href!}>Выбрать тип<Arrow/></Link><button className="service-hub__text-action" type="button" aria-label={`Оставить заявку: ${compressor.title}`} onClick={()=>setRequest({kind:'repair',title:compressor.title,itemId:compressor.id})}>Оставить заявку</button></div></article>
    {repairDirections.slice(1).map(item=><article className="service-hub__direction" key={item.id}><ToolArt id={item.id}/><h3>{item.title}</h3><p>{tools[item.id].description}</p><button className="service-hub__button" type="button" aria-label={`Оставить заявку: ${item.title}`} onClick={()=>setRequest({kind:'repair',title:item.title,itemId:item.id})}>Оставить заявку<Arrow/></button></article>)}
   </div>
  </section>

 <section className="center-more" aria-labelledby="center-more-heading"><header><h3 id="center-more-heading">Также ремонтируем и обслуживаем</h3><p>Раскройте направление, чтобы посмотреть примеры техники и оставить заявку.</p></header><div>{additionalServiceDirections.map(item=><details key={item.id}><summary>{item.label}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary><div><p>{item.text}</p><Link className="service-editorial-text-link" aria-label={`Оставить заявку: ${item.label}`} to={requestHref(item.id)}>Оставить заявку</Link></div></details>)}</div></section>
 <Link className="center-hose-banner" to={hoseService.href}><div><h2>Шланги для моек высокого давления</h2><p>Изготовим под ваш аппарат. Подберём рукав и соединения, выполним опрессовку и проверку давлением.</p><span>Подробнее об услуге<Arrow/></span></div><img src="/garage/style-check/review-assets/hose-assembly.svg" width="660" height="360" alt="" loading="lazy"/></Link>
 <ServiceSection title="Специалист по вашей технике" intro="«Гараж» — полноценная мастерская с диагностическим оборудованием, складом запчастей и инженерами по конкретным группам техники.">
 <div className="center-expertise"><figure><img src="/garage/style-check/review-assets/repair-photo.jpg" alt="Рабочее место с профессиональными инструментами" width="1200" height="800" loading="lazy"/><figcaption>Работаем с техникой независимо от места покупки</figcaption></figure><div className="center-principles">{[
 ['Профильный подход','Электроинструмент, пневматика, двигатели и автосервисное оборудование — каждым направлением занимается специалист.'],
 ['Диагностика и понятная смета','До ремонта определяем причину неисправности. Согласуем перечень работ, стоимость, необходимые детали и сроки.'],
 ['Запчасти с вашим согласованием','Оригинальные комплектующие или сертифицированные аналоги. Выбор обсуждаем по цене и срокам, ходовые детали есть на складе.'],
 ['Гарантия и связь на каждом этапе','Сообщаем о ходе ремонта и изменениях. Если неисправность повторится по той же причине, устраним её за свой счёт.'],
 ].map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></div>
 </ServiceSection>
 <ServiceSection title="Как проходит ремонт" intro="На каждом этапе вы понимаете, что происходит с техникой. К ремонту приступаем после согласования сметы и сроков."><ServiceProcess steps={serviceCenterSteps}/></ServiceSection>
 <ServiceSection title="Рядом с вашей мастерской" intro="Три города — единый стандарт обслуживания. Уточните условия приёмки в ближайшем сервисном центре."><div className="center-locations">{regionalPhones.map((point,i)=><article key={point.city}><h3>{point.city}</h3><p>{i===0?'Для города и Ярославской области':i===1?'Для города и Вологодской области':'Для города и западной части Вологодской области'}</p><a className="center-locations__phone" href={point.href}>{point.phone}</a><Link className="service-editorial-text-link" to={`/contacts/${['yaroslavl','vologda','cherepovets'][i]}`}>Контакты и карта<Arrow/></Link></article>)}</div><aside className="service-editorial-note"><strong>Крупное оборудование</strong><p>Для компрессоров, подъёмников, окрасочных камер и стендов сход-развала возможен выезд специалиста. Условия согласуйте с менеджером.</p></aside></ServiceSection>
 <section className="service-editorial-cta" aria-labelledby="center-cta"><div><h2 id="center-cta">Начнём с вашей задачи</h2><p>Расскажите, что произошло с инструментом или оборудованием. Поможем определить следующий шаг. Решение о ремонте остаётся за вами.</p></div><div><Link className="service-editorial-button" to={requestHref(serviceCenterRequest.id)}>Оставить заявку на ремонт</Link><Link className="service-editorial-text-link" to="/contacts">Контакты сервисных центров</Link></div></section>
 <Link className="service-hub__back" to="/services">← Все услуги</Link>
 {request&&<ServiceRequestEntry key={request.itemId} request={request} onClose={close}/>}
 </main>
}
