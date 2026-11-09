import {useCallback,useState} from 'react'
import {Link} from 'react-router-dom'
import type {ServiceRequest} from '../data/serviceTypes'
import {paintSteps} from '../data/servicesData'
import {Breadcrumbs} from '../features/catalog/Breadcrumbs'
import {ServiceRequestDialog} from '../features/services/ServiceRequestDialog'
import './AutomotivePaintPage.css'

export function AutomotivePaintPage({request}:{request:ServiceRequest}) {
  const [open,setOpen]=useState(false)
  const close=useCallback(()=>setOpen(false),[])
  return <main className="services-page paint-service-page automotive-paint-page">
    <Breadcrumbs items={[{label:'Главная',to:'/'},{label:'Услуги',to:'/services'},{label:'Подбор автоэмали',to:'/services/paint-matching'},{label:request.title}]}/>
    <header className="automotive-paint-heading"><h1>{request.title}</h1></header>
    <section className="paint-service-hero automotive-paint-hero" aria-labelledby="automotive-about-title">
      <div><h2 id="automotive-about-title">Об услуге</h2><p className="paint-service-lead">Подбор цвета и колеровка автомобильных эмалей для ремонта автомобильного покрытия.</p>
        <dl className="automotive-paint-terms"><div><dt>Стоимость</dt><dd>Уточняется</dd></div><div><dt>Сроки</dt><dd>Уточняются</dd></div></dl>
        <button className="paint-service-button" type="button" onClick={()=>setOpen(true)}>Узнать стоимость</button>
      </div>
      <img className="paint-service-photo" src="/garage/style-check/review-assets/campaigns/mixing-photo.webp" width="1000" height="667" alt="Материалы для подбора цвета и колеровки автомобильных эмалей" decoding="async"/>
    </section>
    <section className="automotive-paint-process" aria-labelledby="automotive-process-title"><h2 id="automotive-process-title">Порядок обращения</h2><ol>{paintSteps.map((step,index)=><li key={step}><span aria-hidden="true">{String(index+1).padStart(2,'0')}</span><p>{step}</p></li>)}</ol></section>
    <Link className="paint-services-back" to="/services/paint-matching">← Вернуться к направлению</Link>
    {open&&<ServiceRequestDialog request={request} onClose={close}/>}
  </main>
}
