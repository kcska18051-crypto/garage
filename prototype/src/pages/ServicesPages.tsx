import {useCallback,useState,type ReactNode} from 'react'
import {Link,useParams} from 'react-router-dom'
import {serviceDirections,repairServices,rentalItems,repairSteps,paintSteps,rentalSteps} from '../data/servicesData'
import type {ServiceRequest} from '../data/serviceTypes'
import {Breadcrumbs,type BreadcrumbItem} from '../features/catalog/Breadcrumbs'
import {ServiceRequestDialog} from '../features/services/ServiceRequestDialog'
import {NotFoundPage} from './NotFoundPage'
import './ServicesPages.css'

const servicesCrumb={label:'Услуги',to:'/services'}
const repairCrumbs=[servicesCrumb,{label:'Сервисный центр по ремонту',to:'/services/service-center'},{label:'Ремонт компрессоров',to:'/services/service-center/compressor-repair'}]
const demoNote='Демонстрационное наполнение: тексты, изображения, оборудование и условия показаны для обсуждения структуры. Реальные сведения предоставит клиент.'
type Card={id:string;title:string;href:string;text:string;sku?:string}
function ServiceCards({items,rental=false,onRent}:{items:Card[];rental?:boolean;onRent?(item:Card):void}) {
  return <div className="services-grid">{items.map((item,index)=><article key={item.id}><div className={`services-art services-art--${index%3}`} aria-hidden="true"><i/><b/></div><div><h2><Link to={item.href}>{item.title}</Link></h2>{item.sku&&<small>Артикул примера: {item.sku}</small>}<p>{item.text}</p>{rental&&<p className="services-muted">Тариф и залог — уточняются</p>}<Link className="services-card-link" to={item.href}>{rental?'Посмотреть перед арендой':'Подробнее'} →</Link>{onRent&&<button className="button" type="button" aria-label={`Арендовать: ${item.title}`} onClick={()=>onRent(item)}>Арендовать</button>}</div></article>)}</div>
}
function Steps({items}:{items:string[]}) {return <section className="services-section"><h2>Порядок обращения</h2><ol className="services-steps">{items.map(item=><li key={item}>{item}</li>)}</ol><p className="services-muted">Это пример процесса, а не подтверждённые условия обслуживания.</p></section>}
function ServiceLayout({title,crumbs,children}:{title:string;crumbs:BreadcrumbItem[];children:ReactNode}) {
  return <main className="services-page"><Breadcrumbs items={[{label:'Главная',to:'/'},...crumbs,{label:title}]}/><header className="services-heading"><h1>{title}</h1><p>{demoNote}</p></header>{children}</main>
}

export function ServicesIndexPage() {
  return <ServiceLayout title="Услуги" crumbs={[]}><p className="services-lead">Ремонт оборудования, подбор автоэмали и аренда для задач мастерской. Выберите направление, чтобы посмотреть структуру услуги и пример заявки.</p><ServiceCards items={serviceDirections}/></ServiceLayout>
}
export function ServiceCenterPage() {
  return <ServiceLayout title="Сервисный центр по ремонту" crumbs={[servicesCrumb]}><div className="services-intro"><div><h2>От обращения к обсуждению работ</h2><p>В этом разделе показан пример сервисного направления для профессионального оборудования. Начните с категории, затем выберите тип компрессора.</p><p>Неисправность, состав работ, стоимость и сроки обсуждаются отдельно. На странице нет подтверждения реального сервиса или автоматического расчёта.</p></div><div className="services-art" role="img" aria-label="Место для фото сервисного центра"><i/><b/><span>Место для фото сервисного центра</span></div></div><section className="services-section"><h2>Направления ремонта</h2><ServiceCards items={[{id:'compressor-repair',title:'Ремонт компрессоров',href:'/services/service-center/compressor-repair',text:'Винтовые, поршневые и дизельные установки — три примера детализации категории.'}]}/></section><Steps items={repairSteps}/></ServiceLayout>
}
export function CompressorRepairPage() {
  return <ServiceLayout title="Ремонт компрессоров" crumbs={[servicesCrumb,repairCrumbs[1]]}><p className="services-lead">Выберите тип установки. В каждой карточке — пример работ, порядок обращения и демонстрационная заявка с моделью оборудования и описанием неисправности.</p><ServiceCards items={repairServices}/><section className="services-section services-info"><h2>Что подготовить перед обращением</h2><p>Название модели, описание наблюдаемой проблемы и при необходимости фото. Не прикладывайте документы с персональными или секретными данными.</p><p>Стоимость и сроки — уточняются после обсуждения исходных данных.</p></section><Link className="services-back" to="/services/service-center">← Все направления сервисного центра</Link></ServiceLayout>
}
export function RepairDetailPage() {
  const {repairSlug}=useParams()
  const item=repairServices.find(service=>service.id===repairSlug)
  if(!item) return <NotFoundPage/>
  return <ServiceDetail key={item.id} request={{kind:'repair',title:item.title,itemId:item.id}} crumbs={repairCrumbs} description={item.text} steps={repairSteps}/>
}
export function PaintMatchingPage() {
  return <ServiceDetail request={{kind:'paint',title:'Подбор автоэмали',itemId:'paint-matching'}} crumbs={[servicesCrumb]} description="Демонстрационная страница обращения по подбору цвета и материалов для ремонта автомобильного покрытия. Автомобиль и задача передаются в форме, а способ подбора обсуждается отдельно." steps={paintSteps}/>
}
function ServiceDetail({request,crumbs,description,steps}:{request:ServiceRequest;crumbs:BreadcrumbItem[];description:string;steps:string[]}) {
  const [open,setOpen]=useState(false)
  const close=useCallback(()=>setOpen(false),[])
  return <ServiceLayout title={request.title} crumbs={crumbs}><div className="services-intro"><div><h2>Об услуге</h2><p>{description}</p><p>{request.kind==='repair'?'Здесь можно описать подход к первичному осмотру и обсуждению неисправности. Результат диагностики и перечень работ не определяются автоматически.':'Здесь можно рассказать о работе с исходными данными покрытия. Точное совпадение цвета, сроки и результат не обещаются.'}</p><dl className="services-terms"><div><dt>Стоимость</dt><dd>Уточняется</dd></div><div><dt>Сроки</dt><dd>Уточняются</dd></div></dl><button className="button button--dark" type="button" onClick={()=>setOpen(true)}>Оставить заявку</button><p className="services-muted">Форма демонстрационная, реальная отправка не выполняется.</p></div><div className="services-art" role="img" aria-label={`Место для фото: ${request.title}`}><i/><b/><span>Место для фотографии услуги</span></div></div>{request.kind==='repair'&&<section className="services-section"><h2>Примеры работ</h2><ul className="services-examples"><li>Первичный осмотр и уточнение признаков неисправности</li><li>Обсуждение проверки узлов выбранного типа установки</li><li>Подготовка примерного перечня дальнейших действий</li></ul><p className="services-muted">Рыбное содержание. Это не утверждённый перечень выполняемых компанией работ.</p></section>}<Steps items={steps}/><Link className="services-back" to={crumbs[crumbs.length-1]?.to??'/services'}>← Вернуться к направлению</Link>{open&&<ServiceRequestDialog request={request} onClose={close}/>}</ServiceLayout>
}
export function RentalCatalogPage() {
  const [request,setRequest]=useState<ServiceRequest|null>(null)
  const close=useCallback(()=>setRequest(null),[])
  return <ServiceLayout title="Аренда оборудования и инструментов" crumbs={[servicesCrumb]}><p className="services-lead">Выберите пример оборудования и откройте его карточку перед заявкой. Здесь нет реального календаря наличия, онлайн-оплаты и подтверждения брони.</p><ServiceCards items={rentalItems} rental onRent={item=>setRequest({kind:'rental',title:item.title,itemId:item.id})}/><Steps items={rentalSteps}/>{request&&<ServiceRequestDialog request={request} onClose={close}/>}</ServiceLayout>
}
export function RentalDetailPage() {
  const {rentalSlug}=useParams()
  const item=rentalItems.find(product=>product.id===rentalSlug)
  const [open,setOpen]=useState(false)
  const close=useCallback(()=>setOpen(false),[])
  if(!item) return <NotFoundPage/>
  return <ServiceLayout title={item.title} crumbs={[servicesCrumb,{label:'Аренда оборудования и инструментов',to:'/services/rental'}]}><div className="services-intro"><div className={`services-art services-art--${item.art}`} role="img" aria-label={`Место для фото: ${item.title}`}><i/><b/><span>Демонстрационное фото оборудования</span></div><div><p>{item.text}</p><dl className="services-terms"><div><dt>Артикул примера</dt><dd>{item.sku}</dd></div><div><dt>Технические параметры</dt><dd>Уточняются</dd></div><div><dt>Тариф аренды</dt><dd>Уточняется</dd></div><div><dt>Залог</dt><dd>Уточняется</dd></div><div><dt>Условия получения и возврата</dt><dd>Уточняются</dd></div></dl><button className="button button--dark" type="button" onClick={()=>setOpen(true)}>Арендовать</button><p className="services-muted">Заявка не является бронью и не меняет доступность оборудования. Аренда оформляется отдельно от обычной покупки.</p></div></div><Steps items={rentalSteps}/><Link className="services-back" to="/services/rental">← Все позиции аренды</Link>{open&&<ServiceRequestDialog request={{kind:'rental',title:item.title,itemId:item.id}} onClose={close}/>}</ServiceLayout>
}
