import {useCallback,useState} from 'react'
import {Link} from 'react-router-dom'
import type {ServiceRequest} from '../data/serviceTypes'
import {Breadcrumbs} from '../features/catalog/Breadcrumbs'
import {ServiceRequestDialog} from '../features/services/ServiceRequestDialog'
import './PaintServiceShowcase.css'
const base='/services/paint-matching'
const content={
 automotive:{title:'Подбор/колеровка автомобильных эмалей',photo:'paint-color-automotive.png',alt:'Сравнение образцов автомобильной эмали с цветом кузовной панели',lead:'Цвет для ремонта автомобильного покрытия.',text:'Укажите марку автомобиля и код краски, если он известен. Задачу и особенности покрытия можно описать в комментарии.',description:'Подбор цвета и колеровка эмалей для ремонта автомобильного покрытия.'},
 polyurethane:{title:'Подбор полиуретановых эмалей',photo:'paint-color-polyurethane.png',alt:'Сравнение цветовых образцов с окрашенной металлической пластиной',lead:'Цвет покрытия с учётом вашей задачи.',text:'Расскажите, какую поверхность нужно окрасить и какой результат требуется. Исходные данные и состав материалов обсуждаются индивидуально.',description:'Подбор полиуретановых эмалей с учётом задачи и исходных данных покрытия.'},
}
const steps=[{title:'Обращение',text:'Оставьте имя и телефон для связи.'},{title:'Исходные данные',text:'При желании добавьте код краски и комментарий к задаче.'},{title:'Подбор материалов',text:'Обсудите исходные данные, способ подбора и необходимые материалы.'},{title:'Согласование',text:'Уточните стоимость, сроки и условия получения.'}]
function Arrow(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>}
function PaintInquiry({request}:{request:ServiceRequest}){const [open,setOpen]=useState(false);const close=useCallback(()=>setOpen(false),[]);return <><button className="paint-editorial__button" type="button" onClick={()=>setOpen(true)}>Узнать стоимость<Arrow/></button>{open&&<ServiceRequestDialog request={request} onClose={close}/>}</>}
export function PaintMatchingShowcase(){return <main className="paint-editorial paint-service-page">
 <Breadcrumbs items={[{label:'Главная',to:'/'},{label:'Услуги',to:'/services'},{label:'Подбор автоэмали'}]}/>
 <header className="paint-editorial__overview-heading"><h1>Подбор автоэмали</h1><p className="paint-editorial__lead">Цвет и материалы для вашей задачи.</p><p className="paint-editorial__description">Выберите автомобильные или полиуретановые эмали. Способ подбора и условия уточняются при обращении.</p><PaintInquiry request={{kind:'paint',title:'Подбор автоэмали',itemId:'paint-matching'}}/></header>
 <section aria-labelledby="paint-choice-title"><h2 id="paint-choice-title">Направления подбора</h2><div className="paint-editorial__directions">{Object.entries(content).map(([slug,item])=><article key={slug}><Link to={`${base}/${slug}`} aria-label={item.title}><img src={`/garage/style-check/review-assets/${item.photo}`} width="1448" height="1086" alt={item.alt} decoding="async"/><div><h3>{item.title}</h3><p>{item.description}</p><span className="paint-editorial__button">Подробнее<Arrow/></span></div></Link></article>)}</div></section>
 <Link className="paint-editorial__back" to="/services">← Все услуги</Link>
 </main>}
export function PaintDetailShowcase({request}:{request:ServiceRequest}){const item=content[request.itemId==='paint-polyurethane'?'polyurethane':'automotive'];return <main className="paint-editorial paint-service-page automotive-paint-page">
 <Breadcrumbs items={[{label:'Главная',to:'/'},{label:'Услуги',to:'/services'},{label:'Подбор автоэмали',to:base},{label:request.title}]}/>
 <header className="paint-editorial__hero"><div><h1>{request.title}</h1><p className="paint-editorial__lead">{item.lead}</p><p className="paint-editorial__description">{item.text}</p><PaintInquiry request={request}/><dl className="paint-editorial__terms"><div><dt>Стоимость</dt><dd>Уточняется</dd></div><div><dt>Сроки</dt><dd>Уточняются</dd></div></dl></div><img src={`/garage/style-check/review-assets/${item.photo}`} width="1448" height="1086" alt={item.alt} decoding="async" fetchPriority="high"/></header>
 <section className="paint-editorial__process" aria-labelledby="paint-editorial-process"><h2 id="paint-editorial-process">Порядок обращения</h2><p className="paint-editorial__description">Начать можно с имени и телефона. Остальные сведения добавьте по желанию.</p><ol>{steps.map((step,i)=><li key={step.title}><span>{String(i+1).padStart(2,'0')}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol></section>
 <Link className="paint-editorial__back" to={base}>← Вернуться к направлению</Link>
 </main>}
