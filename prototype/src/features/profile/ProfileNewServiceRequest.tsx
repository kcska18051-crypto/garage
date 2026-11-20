import { productDetail } from '../../data/productDetailData'
import { useRegion } from '../../state/RegionState'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DemoLink as Link } from '../../app/DemoLink'
import { hoseService, repairDirections, repairServices, paintServices, rentalItems } from '../../data/servicesData'
import type { ServiceRequest } from '../../data/serviceTypes'
import { ServiceRequestDialog, type ServiceRequestContact } from '../services/ServiceRequestDialog'
import './ProfileNewServiceRequest.css'

const directions = [
  { kind: 'repair', label: 'Ремонт оборудования' },
  { kind: 'paint', label: 'Подбор автоэмали' },
  { kind: 'rental', label: 'Аренда оборудования' },
] as const
const choices: Record<ServiceRequest['kind'], ServiceRequest[]> = {
  repair: [hoseService, ...repairServices, ...repairDirections, {id:'workshop',title:'Оснащение автосервиса'}].map(item => ({ kind: 'repair', itemId: item.id, title: item.title })),
  paint: [{itemId:'paint-matching',title:'Подбор автоэмали'}, ...paintServices].map(item => ({ kind: 'paint', itemId: item.itemId, title: item.title })),
  rental: rentalItems.map(item => ({ kind: 'rental', itemId: item.id, title: item.title })),
}
export function ProfileNewServiceRequest() {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => { window.scrollTo(0,0); heading.current?.focus({preventScroll:true}) }, [])
  const [params] = useSearchParams()
  const selectedOffer = params.get('kind') === 'rental' && params.get('item') === 'screw-compressor' ? productDetail.offers.find(offer=>offer.id===params.get('product')) : undefined
  const {region} = useRegion()
  const from = params.get('from')
  const returnTo = from === '/services' || from?.startsWith('/services/') || (!!selectedOffer && from === '/product/'+selectedOffer.id) ? from : '/profile/services'
  const initialKind = params.get('kind')
  const [kind, setKind] = useState<ServiceRequest['kind']>(initialKind === 'paint' || initialKind === 'rental' ? initialKind : 'repair')
  const [itemId, setItemId] = useState(params.get('item') ?? '')
  const [showChoice, setShowChoice] = useState(!choices[kind].some(item => item.itemId === params.get('item')))
  const [submitted, setSubmitted] = useState(false)
  const baseRequest = choices[kind].find(item => item.itemId === itemId)
  const directRental = selectedOffer && kind === 'rental' && itemId === 'screw-compressor' && !showChoice ? selectedOffer : undefined
  const variant = directRental ? `${directRental.options.voltage} · ${directRental.options.power} · Артикул ${directRental.sku}` : ''
  const request = baseRequest && directRental ? {...baseRequest, itemId:directRental.id, title:`${productDetail.name} · ${directRental.options.voltage} · ${directRental.options.power}`} : baseRequest
  const [contactDraft, setContactDraft] = useState<ServiceRequestContact>()
  return <div className="profile-section profile-new-service">
    <header className="profile-section__heading"><h1 ref={heading} tabIndex={-1}>{submitted ? 'Заявка на услугу' : directRental ? 'Заявка на аренду' : 'Новая заявка на услугу'}</h1></header>
    <p className="profile-new-service__lead">{submitted ? 'Сохраните номер заявки. Стоимость и сроки будут согласованы отдельно.' : directRental ? 'Оборудование уже выбрано. Укажите даты, количество и контакты. Наличие, стоимость и условия согласуем отдельно; заявка не подтверждает бронь.' : 'Выберите услугу и расскажите о задаче. Стоимость и сроки согласуем после рассмотрения заявки; оплата на этом этапе не требуется.'}</p>

    {!submitted && <section className={`profile-panel profile-new-service__choice${directRental?' profile-new-service__choice--product':''}`} aria-labelledby="service-choice-heading">
      {directRental && <img className="profile-new-service__equipment-photo" src="/garage/style-check/review-assets/catalog-gallery/screw-1.webp" alt={productDetail.name}/>}
      <h2 id="service-choice-heading">{request && !showChoice ? request.title : 'Что вам нужно?'}</h2>
      {directRental && <small className="profile-new-service__equipment-sku">Артикул: {directRental.sku}</small>}
      {request && !showChoice && !directRental && <button className="profile-link-button" type="button" onClick={() => setShowChoice(true)}>Изменить услугу</button>}
      {showChoice && <>
      <div className="profile-tabs" role="group" aria-label="Направление услуги">{directions.map(item => <button className="profile-new-service__direction" key={item.kind} type="button" aria-pressed={kind === item.kind} onClick={() => { if(kind !== item.kind) { setKind(item.kind); setItemId('') } }}>{item.label}</button>)}</div>
      <label className="profile-new-service__field">{kind === 'rental' ? 'Оборудование для аренды' : 'Услуга'}
        <select aria-label={kind === 'rental' ? 'Оборудование для аренды' : 'Услуга'} value={itemId} aria-describedby="service-choice-help" onChange={event => { setItemId(event.target.value) }}>
          <option value="">{kind === 'rental' ? 'Выберите оборудование' : 'Выберите услугу'}</option>
          {choices[kind].map(item => <option key={item.itemId} value={item.itemId}>{item.title}</option>)}
        </select>
      </label>
      </>}
      {!directRental && <p id="service-choice-help" className="profile-new-service__help">{kind === 'repair' ? 'В форме понадобятся модель оборудования и описание неисправности. Стоимость ремонта зависит от диагностики и согласованных работ.' : kind === 'paint' ? 'Укажите контакты; при наличии добавьте марку автомобиля и код краски. Состав материалов и стоимость согласуем отдельно.' : 'Укажите желаемые даты и количество. Заявка не является бронью: наличие, стоимость и условия аренды требуют подтверждения.'}</p>}
    </section>}
    {request && <ServiceRequestDialog key={kind+(directRental?.id??'')} rentalContext={directRental ? {model:variant,city:region} : undefined} inline request={request} contact={contactDraft} preserveEmptyContact={contactDraft !== undefined} onContactChange={setContactDraft} onCreated={() => setSubmitted(true)} onClose={() => {}} />}
    {!submitted && <Link className="profile-link-button" to={returnTo}>{directRental ? 'Вернуться к товару' : from ? 'Вернуться к услуге' : 'Все заявки'}</Link>}

  </div>
}
