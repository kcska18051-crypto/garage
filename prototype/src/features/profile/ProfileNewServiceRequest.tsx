import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
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
  repair: [...repairServices, ...repairDirections.filter(item => !item.href)].map(item => ({ kind: 'repair', itemId: item.id, title: item.title })),
  paint: paintServices.map(item => ({ kind: 'paint', itemId: item.itemId, title: item.title })),
  rental: rentalItems.map(item => ({ kind: 'rental', itemId: item.id, title: item.title })),
}
export function ProfileNewServiceRequest() {
  const [kind, setKind] = useState<ServiceRequest['kind']>('repair')
  const [itemId, setItemId] = useState('')
  const [error, setError] = useState('')
  const [request, setRequest] = useState<ServiceRequest | null>(null)
  const select = useRef<HTMLSelectElement>(null)
  const { identity } = useAuth()
  const { user } = useProfile()
  const proceed = () => {
    const selected = choices[kind].find(item => item.itemId === itemId)
    if (!selected) { setError('Выберите услугу или оборудование'); select.current?.focus(); return }
    setError(''); setRequest(selected)
  }
  return <div className="profile-section profile-new-service">
    <header className="profile-section__heading"><h1>Новая заявка на услугу</h1></header>
    <p className="profile-new-service__lead">Выберите услугу и расскажите о задаче. Стоимость и сроки согласуем после рассмотрения заявки; оплата на этом этапе не требуется.</p>
    <ol className="profile-new-service__steps" aria-label="Как оформить заявку"><li>Выберите услугу</li><li>Заполните данные</li><li>Получите номер заявки</li></ol>
    <section className="profile-panel profile-new-service__choice" aria-labelledby="service-choice-heading">
      <h2 id="service-choice-heading">Что вам нужно?</h2>
      <div className="profile-tabs" role="group" aria-label="Направление услуги">{directions.map(item => <button className="profile-new-service__direction" key={item.kind} type="button" aria-pressed={kind === item.kind} onClick={() => { setKind(item.kind); setItemId(''); setError('') }}>{item.label}</button>)}</div>
      <label className="profile-new-service__field">{kind === 'rental' ? 'Оборудование для аренды' : 'Услуга'}
        <select ref={select} aria-label={kind === 'rental' ? 'Оборудование для аренды' : 'Услуга'} value={itemId} aria-invalid={Boolean(error)} aria-describedby={error ? 'service-choice-error' : 'service-choice-help'} onChange={event => { setItemId(event.target.value); setError('') }}>
          <option value="">{kind === 'rental' ? 'Выберите оборудование' : 'Выберите услугу'}</option>
          {choices[kind].map(item => <option key={item.itemId} value={item.itemId}>{item.title}</option>)}
        </select>
      </label>
      <p id="service-choice-help" className="profile-new-service__help">{kind === 'repair' ? 'В форме понадобятся модель оборудования и описание неисправности. Стоимость ремонта зависит от диагностики и согласованных работ.' : kind === 'paint' ? 'Укажите контакты; при наличии добавьте марку автомобиля и код краски. Состав материалов и стоимость согласуем отдельно.' : 'Укажите желаемые даты и количество. Заявка не является бронью: наличие, стоимость и условия аренды требуют подтверждения.'}</p>
      {error && <p id="service-choice-error" className="profile-message profile-message--error" role="alert">{error}</p>}
      <div className="profile-actions"><button className="profile-button profile-button--primary" type="button" onClick={proceed}>Заполнить заявку</button><Link className="profile-button" to="/profile/services">Все заявки</Link></div>
    </section>
    {request && <ServiceRequestDialog request={request} contact={{ name: user.firstName, phone: identity?.phone ? `+${identity.phone}` : user.phone }} onClose={() => setRequest(null)} />}
  </div>
}
