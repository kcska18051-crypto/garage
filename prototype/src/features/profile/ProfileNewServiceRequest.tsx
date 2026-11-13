import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { repairDirections, repairServices, paintServices, rentalItems } from '../../data/servicesData'
import type { ServiceRequest } from '../../data/serviceTypes'
import { ServiceRequestDialog } from '../services/ServiceRequestDialog'
import { useAuth } from '../../state/AuthState'
import { useProfile } from '../../state/ProfileState'
import './ProfileNewServiceRequest.css'

const directions = [
  { kind: 'repair', label: 'Ремонт оборудования' },
  { kind: 'paint', label: 'Подбор автоэмали' },
  { kind: 'rental', label: 'Аренда оборудования' },
] as const
const choices: Record<ServiceRequest['kind'], ServiceRequest[]> = {
  repair: [...repairServices, ...repairDirections, {id:'workshop',title:'Оснащение автосервиса'}].map(item => ({ kind: 'repair', itemId: item.id, title: item.title })),
  paint: [{itemId:'paint-matching',title:'Подбор автоэмали'}, ...paintServices].map(item => ({ kind: 'paint', itemId: item.itemId, title: item.title })),
  rental: rentalItems.map(item => ({ kind: 'rental', itemId: item.id, title: item.title })),
}
export function ProfileNewServiceRequest() {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => { window.scrollTo(0,0); heading.current?.focus({preventScroll:true}) }, [])
  const [params] = useSearchParams()
  const from = params.get('from')
  const returnTo = from === '/services' || from?.startsWith('/services/') ? from : '/profile/services'
  const initialKind = params.get('kind')
  const [kind, setKind] = useState<ServiceRequest['kind']>(initialKind === 'paint' || initialKind === 'rental' ? initialKind : 'repair')
  const [itemId, setItemId] = useState(params.get('item') ?? '')
  const [showChoice, setShowChoice] = useState(!choices[kind].some(item => item.itemId === params.get('item')))
  const [submitted, setSubmitted] = useState(false)
  const request = choices[kind].find(item => item.itemId === itemId)
  const { identity, isAuthenticated } = useAuth()
  const { user } = useProfile()
  const [contactDraft, setContactDraft] = useState(() => isAuthenticated ? { name: user.firstName, phone: identity?.phone ? `+${identity.phone}` : user.phone } : { name: '', phone: '' })
  return <div className="profile-section profile-new-service">
    <header className="profile-section__heading"><h1 ref={heading} tabIndex={-1}>{submitted ? 'Заявка на услугу' : 'Новая заявка на услугу'}</h1></header>
    <p className="profile-new-service__lead">{submitted ? 'Сохраните номер заявки. Стоимость и сроки будут согласованы отдельно.' : 'Выберите услугу и расскажите о задаче. Стоимость и сроки согласуем после рассмотрения заявки; оплата на этом этапе не требуется.'}</p>

    {!submitted && <section className="profile-panel profile-new-service__choice" aria-labelledby="service-choice-heading">
      <h2 id="service-choice-heading">{request && !showChoice ? request.title : 'Что вам нужно?'}</h2>
      {request && !showChoice && <button className="profile-link-button" type="button" onClick={() => setShowChoice(true)}>Изменить услугу</button>}
      {showChoice && <>
      <div className="profile-tabs" role="group" aria-label="Направление услуги">{directions.map(item => <button className="profile-new-service__direction" key={item.kind} type="button" aria-pressed={kind === item.kind} onClick={() => { if(kind !== item.kind) { setKind(item.kind); setItemId('') } }}>{item.label}</button>)}</div>
      <label className="profile-new-service__field">{kind === 'rental' ? 'Оборудование для аренды' : 'Услуга'}
        <select aria-label={kind === 'rental' ? 'Оборудование для аренды' : 'Услуга'} value={itemId} aria-describedby="service-choice-help" onChange={event => { setItemId(event.target.value) }}>
          <option value="">{kind === 'rental' ? 'Выберите оборудование' : 'Выберите услугу'}</option>
          {choices[kind].map(item => <option key={item.itemId} value={item.itemId}>{item.title}</option>)}
        </select>
      </label>
      </>}
      <p id="service-choice-help" className="profile-new-service__help">{kind === 'repair' ? 'В форме понадобятся модель оборудования и описание неисправности. Стоимость ремонта зависит от диагностики и согласованных работ.' : kind === 'paint' ? 'Укажите контакты; при наличии добавьте марку автомобиля и код краски. Состав материалов и стоимость согласуем отдельно.' : 'Укажите желаемые даты и количество. Заявка не является бронью: наличие, стоимость и условия аренды требуют подтверждения.'}</p>
    </section>}
    {request && <ServiceRequestDialog key={kind} inline request={request} contact={contactDraft} onContactChange={setContactDraft} onCreated={() => setSubmitted(true)} onClose={() => {}} />}
    {!submitted && <Link className="profile-link-button" to={returnTo}>{from ? 'Вернуться к услуге' : 'Все заявки'}</Link>}

  </div>
}
