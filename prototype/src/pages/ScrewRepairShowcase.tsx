import {useCallback,useState} from 'react'
import {Link} from 'react-router-dom'
import {Breadcrumbs} from '../features/catalog/Breadcrumbs'
import {ServiceRequestDialog} from '../features/services/ServiceRequestDialog'
import './ScrewRepairShowcase.css'

const request={kind:'repair' as const,title:'Ремонт винтовых компрессоров',itemId:'screw'}
const concerns=[
  {title:'Запуск и управление',text:'Компрессор не включается, останавливается или сообщает об ошибке.',icon:'M13 2v9M7 5a9 9 0 1 0 10 0'},
  {title:'Давление и подача воздуха',text:'Установка не набирает привычное давление или подача воздуха изменилась.',icon:'M4 19a10 10 0 1 1 16 0M12 13l5-5M12 13v.01M6 19h12'},
  {title:'Шум, вибрация, нагрев',text:'В работе появились непривычные звуки, вибрация или повышенный нагрев.',icon:'M9 14.5V5a3 3 0 0 1 6 0v9.5a5 5 0 1 1-6 0ZM12 8v10'},
]
const steps=[
  {title:'Обращение',text:'Вы оставляете контактные данные и описание проблемы.'},
  {title:'Передача и диагностика',text:'Способ передачи оборудования и условия диагностики уточняются при обращении.'},
  {title:'Согласование работ',text:'Обсуждаются необходимый ремонт, стоимость и сроки.'},
  {title:'Ремонт и получение',text:'Порядок выполнения работ и возврата оборудования согласовывается с сервисом.'},
]
function ServiceIcon({path}:{path:string}) {return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={path}/></svg>}

export function ScrewRepairShowcase() {
  const [open,setOpen]=useState(false)
  const close=useCallback(()=>setOpen(false),[])
  return <main className="screw-service">
    <Breadcrumbs items={[{label:'Главная',to:'/'},{label:'Услуги',to:'/services'},{label:'Сервисный центр по ремонту',to:'/services/service-center'},{label:'Ремонт компрессоров',to:'/services/service-center/compressor-repair'},{label:request.title}]}/>
    <header className="screw-service__hero">
      <div className="screw-service__intro">
        <span className="screw-service__eyebrow">Диагностика и ремонт</span>
        <h1>Ремонт винтовых компрессоров</h1>
        <p className="screw-service__lead">От признаков неисправности — к понятному плану ремонта.</p>
        <p className="screw-service__description">Опишите, что изменилось в работе установки. Модель компрессора и признаки неисправности помогут начать обсуждение диагностики и необходимых работ.</p>
        <button className="screw-service__button" type="button" onClick={()=>setOpen(true)}>Оставить заявку<ServiceIcon path="M4 12h16m-6-6 6 6-6 6"/></button>
        <p className="screw-service__terms">Стоимость и сроки уточняются после обсуждения неисправности.</p>
      </div>
      <div className="screw-service__visual"><img src="/garage/style-check/review-assets/screw-compressor-diagnostics.png" width="1448" height="1086" alt="Диагностика винтового компрессора с открытым сервисным отсеком" decoding="async" fetchPriority="high"/></div>
    </header>
    <section className="screw-service__scope" aria-labelledby="screw-scope-title">
      <div className="screw-service__scope-heading"><div><h2 id="screw-scope-title">С какой проблемой вы столкнулись?</h2></div><p>Запуск, подача воздуха или работа узлов — опишите, что изменилось. Точную причину заранее определять не нужно.</p></div>
      <div className="screw-service__concerns">{concerns.map(item=><div key={item.title}><span className="screw-service__list-icon"><ServiceIcon path={item.icon}/></span><h3>{item.title}</h3><p>{item.text}</p></div>)}</div>

    </section>
    <section className="screw-service__process" aria-labelledby="screw-process-title"><div className="screw-service__process-heading"><h2 id="screw-process-title">Как проходит ремонт</h2><p>От первого обращения до получения оборудования. <br/>Условия каждого этапа согласовываются индивидуально.</p></div><ol>{steps.map((step,index)=><li key={step.title}><span className="screw-service__step">{String(index+1).padStart(2,'0')}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol></section>
    <section className="screw-service__closing" aria-labelledby="screw-closing-title"><span className="screw-service__closing-icon"><ServiceIcon path="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5a9.5 9.5 0 1 1 19 0ZM7 9h9M7 13h6"/></span><div><h2 id="screw-closing-title">Начнём с вашей задачи</h2><p>Укажите модель компрессора и опишите неполадку. <br/>Фото оборудования можно добавить по желанию.</p></div><button className="screw-service__button" type="button" onClick={()=>setOpen(true)}>Обсудить ремонт<ServiceIcon path="M4 12h16m-6-6 6 6-6 6"/></button></section>
    <Link className="screw-service__back" to="/services/service-center/compressor-repair">← Все типы компрессоров</Link>
    {open&&<ServiceRequestDialog request={request} onClose={close}/>}
  </main>
}
