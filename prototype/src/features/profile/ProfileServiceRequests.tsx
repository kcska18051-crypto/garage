import {Link,useLocation,useSearchParams} from 'react-router-dom'
import {useAuth} from '../../state/AuthState'
import {useProfile} from '../../state/ProfileState'
import {canViewServiceRequest,serviceRequestHref,type ProfileServiceRequest} from '../../state/serviceRequests'
import {normalizePhoneIdentity} from '../../utils/phoneIdentity'
import './ProfileServiceRequests.css'

const kindLabels={repair:'Ремонт оборудования',paint:'Подбор автоэмали',rental:'Аренда оборудования'}
const formatDate=(value:string)=>new Date(value).toLocaleString('ru-RU',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})
const demoNotice='Локальная демонстрация: история хранится в этом браузере. Реальной отправки менеджеру, бронирования и серверной проверки доступа нет. Код 1234 показывает сценарий, а не безопасную авторизацию.'
export function ProfileServiceRequests(){
  const {identity}=useAuth()
  const {serviceRequests,serviceStorageError}=useProfile()
  const records=serviceRequests.filter(record=>canViewServiceRequest(record,identity))
  return <div className="profile-section service-account"><header className="profile-section__heading"><h1>Заявки на услуги</h1><Link className="profile-button profile-button--primary" to="/services">Новая заявка</Link></header><p className="profile-info">{demoNotice}</p>{serviceStorageError&&<p role="alert">{serviceStorageError}</p>}{records.length?<div className="profile-request-list">{records.map(record=><article className="profile-panel profile-request" key={record.id}><div><small>Заявка № {record.number} · {formatDate(record.createdAt)}</small><h2>{record.title}</h2></div><span className="profile-status"><i/>{record.status}</span><div><span>{kindLabels[record.kind]}</span><small>{record.seed?'Исторический демопример':'Локальная заявка'}</small></div><Link className="profile-link-button" to={serviceRequestHref(record.id)}>Подробнее</Link></article>)}</div>:<section className="profile-empty"><h2>Заявок пока нет</h2><p>Здесь появятся обращения этого демопрофиля. Для гостевой заявки подтвердите её телефон.</p><Link to="/services">Выбрать услугу</Link></section>}</div>
}
function RequestFields({record}:{record:ProfileServiceRequest}){
  const f=record.fields
  const rows=[['Тип',kindLabels[record.kind]],['Услуга / позиция',record.title],['Дата обращения',formatDate(record.createdAt)],['Имя',f.name],['Контактный телефон',f.phone],...(record.kind==='repair'?[['Модель оборудования',f.model],['Описание неисправности',f.description]]:record.kind==='paint'?[['Автомобиль',f.car],['Комментарий',f.comment]]:[['Дата начала',f.start],['Дата окончания',f.end],['Количество',f.quantity],['Комментарий',f.comment]])]
  return <dl className="service-account-fields">{rows.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value||'Не указано в демопримере'}</dd></div>)}</dl>
}
export function ProfileServiceRequestDetail(){
  const [params]=useSearchParams()
  const {identity,openAuth}=useAuth()
  const {serviceRequests,serviceStorageError}=useProfile()
  const location=useLocation()
  const record=serviceRequests.find(item=>item.id===params.get('id'))
  if(!record||!canViewServiceRequest(record,identity)){
    const claiming=record&&!record.ownerPhone&&identity?.phoneConfirmed&&normalizePhoneIdentity(record.fields.phone)===identity.phone&&!serviceStorageError
    if(claiming)return <section className="profile-panel service-account"><h1>Открываем заявку</h1><p role="status">Сохраняем связь с подтверждённым демопрофилем…</p></section>
    return <section className="profile-panel service-account"><h1>Заявка недоступна</h1><p>Заявка не найдена в доступной истории этого браузера или относится к другому телефону. Подтвердите телефон, указанный при её создании. Чужие данные не отображаются.</p>{serviceStorageError&&<p role="alert">{serviceStorageError}</p>}<button className="profile-button profile-button--primary" type="button" onClick={()=>openAuth('login',{returnTo:location.pathname+location.search,requirePhoneConfirmation:true})}>Подтвердить телефон заявки</button><Link className="service-account-back" to="/profile/services">Все заявки на услуги</Link></section>
  }
  const stages=record.kind==='rental'?['Ожидает подтверждения','Уточняем детали','Согласовано','Выполнено']:['Новая заявка','Уточняем детали','Согласовано','Выполнено']
  const current=stages.indexOf(record.status)
  return <div className="profile-section service-account"><header className="profile-section__heading"><h1>Заявка № {record.number}</h1></header><p className="profile-info">{demoNotice}</p><section className="profile-panel"><h2>{record.title}</h2><p className="profile-status"><i/>{record.status}</p>{record.kind==='rental'&&<p>Заявка ожидает согласования, не является бронью и не подтверждает стоимость или доступность оборудования.</p>}<RequestFields record={record}/><p className="service-account-photo">{record.photoAttached?'Фото было приложено к форме. Сам файл не сохранён; после закрытия или перезагрузки предпросмотр недоступен.':'Фото к этой заявке не приложено.'}</p></section><section className="profile-panel"><h2>Этапы обращения</h2><ol className="service-account-timeline">{stages.map((stage,index)=><li key={stage} aria-current={stage===record.status?'step':undefined} className={index<=current?'is-complete':''}>{stage}</li>)}<li className={record.status==='Отменено'?'is-complete':''}>Отменено — отдельный возможный исход</li></ol><p>Это демонстрация этапов. Последующие статусы меняет менеджер в рабочей системе; в прототипе согласование и выполнение клиентом не доступны.</p></section><Link className="service-account-back" to="/profile/services">Все заявки на услуги</Link></div>
}
