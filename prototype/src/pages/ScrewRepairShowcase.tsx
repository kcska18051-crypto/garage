import {useCallback,useState} from 'react'
import {Link} from 'react-router-dom'
import {Breadcrumbs} from '../features/catalog/Breadcrumbs'
import {ServiceRequestDialog} from '../features/services/ServiceRequestDialog'
import './ScrewRepairShowcase.css'

const request={kind:'repair' as const,title:'Ремонт винтовых компрессоров',itemId:'screw'}
const preparation=[
  {title:'Модель установки',text:'Название производителя, модель и данные с шильдика компрессора.',icon:'M5 4h14v16H5z M8 8h8M8 12h8M8 16h5'},
  {title:'Описание неисправности',text:'Что изменилось в работе, когда появилась проблема и есть ли сообщение об ошибке.',icon:'M12 3 2 21h20L12 3Zm0 6v5m0 3v.01'},
  {title:'Фото оборудования',text:'Общий вид и проблемный узел, если есть возможность его показать. Фото можно приложить к заявке.',icon:'M4 6h4l2-3h4l2 3h4v15H4z M16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'},
]
const steps=[
  {title:'Заявка',text:'Вы описываете оборудование и признаки неисправности.'},
  {title:'Уточнение задачи',text:'Обсуждаем исходные данные и необходимые проверки.'},
  {title:'Согласование',text:'Уточняем диагностику, возможный состав работ, стоимость и сроки.'},
  {title:'Дальнейшие действия',text:'Согласовываем порядок передачи оборудования и выполнения работ.'},
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
        <p className="screw-service__description">Компрессорный блок, привод, система управления и узлы подготовки воздуха. Опишите проблему — начнём с модели установки и условий её работы.</p>
        <button className="screw-service__button" type="button" onClick={()=>setOpen(true)}>Оставить заявку<ServiceIcon path="M4 12h16m-6-6 6 6-6 6"/></button>
        <p className="screw-service__terms">Стоимость и сроки уточняются после обсуждения неисправности.</p>
      </div>
      <div className="screw-service__visual"><img src="/garage/style-check/review-assets/screw-compressor-diagnostics.png" width="1448" height="1086" alt="Диагностика винтового компрессора с открытым сервисным отсеком" decoding="async" fetchPriority="high"/></div>
    </header>
    <section className="screw-service__preparation" aria-labelledby="screw-preparation-title">
      <div className="screw-service__section-intro"><span className="screw-service__eyebrow">Перед обращением</span><h2 id="screw-preparation-title">Помогите увидеть <br/>полную картину</h2><p>Три простые вещи, с которых удобно начать обсуждение ремонта.</p><span className="screw-service__aside-note">Не знаете точную причину?<br/>Достаточно описать, что происходит.</span></div>
      <ul>{preparation.map(item=><li key={item.title}><span className="screw-service__list-icon"><ServiceIcon path={item.icon}/></span><div><h3>{item.title}</h3><p>{item.text}</p></div></li>)}</ul>
    </section>
    <section className="screw-service__process" aria-labelledby="screw-process-title"><div className="screw-service__process-heading"><h2 id="screw-process-title">Как проходит обращение</h2><p>Сначала разбираемся в задаче.<br/>Затем согласовываем дальнейшие шаги.</p></div><ol>{steps.map((step,index)=><li key={step.title}><span className="screw-service__step">{String(index+1).padStart(2,'0')}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol></section>
    <section className="screw-service__closing" aria-labelledby="screw-closing-title"><span className="screw-service__closing-icon"><ServiceIcon path="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5a9.5 9.5 0 1 1 19 0ZM7 9h9M7 13h6"/></span><div><h2 id="screw-closing-title">Начнём с вашей задачи</h2><p>Укажите модель компрессора и опишите неполадку.<br/>Фото оборудования можно добавить по желанию.</p></div><button className="screw-service__button" type="button" onClick={()=>setOpen(true)}>Обсудить ремонт<ServiceIcon path="M4 12h16m-6-6 6 6-6 6"/></button></section>
    <Link className="screw-service__back" to="/services/service-center/compressor-repair">← Все типы компрессоров</Link>
    {open&&<ServiceRequestDialog request={request} onClose={close}/>}
  </main>
}
