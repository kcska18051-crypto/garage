import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { contactPoints, primaryContacts } from '../data/contactsData'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { ContactDialog, type ContactDialogMode } from '../features/forms/ContactDialog'
import { cityCenters, CoordinateMap } from '../features/maps/CoordinateMap'
import { useRegion } from '../state/RegionState'
import './ContactsPage.css'

export function ContactsPage() {
  const { region, setRegion } = useRegion()
  const [search,setSearch]=useSearchParams()
  const requestedCity=search.get('city')
  const previousCityQuery=useRef<string|null|undefined>(undefined)
  const previousRegion=useRef(region)
  useEffect(()=>{
    if(requestedCity!==previousCityQuery.current) {
      previousCityQuery.current=requestedCity
      previousRegion.current=region
      if(requestedCity && contactPoints.some(point=>point.city===requestedCity)) setRegion(requestedCity)
      return
    }
    if(region!==previousRegion.current) {
      previousRegion.current=region
      if(region===requestedCity) return
      const next=new URLSearchParams(search)
      next.set('city',region)
      setSearch(next,{replace:true})
    }
  },[requestedCity,region,search,setSearch,setRegion])
  const selectCity=(city:string)=>{setRegion(city);const next=new URLSearchParams(search);next.set('city',city);setSearch(next,{replace:true})}
  const [activeId, setActiveId] = useState(contactPoints[0].id)
  const [dialog, setDialog] = useState<ContactDialogMode | null>(null)
  const dialogTrigger = useRef<HTMLButtonElement | null>(null)
  const points = contactPoints.filter(point => point.city === region)
  const activePoint = points.find(point => point.id === activeId) ?? points[0]
  const cities = [...new Set(contactPoints.map(point => point.city))]

  const openDialog = (mode: ContactDialogMode, event: MouseEvent<HTMLButtonElement>) => {
    dialogTrigger.current = event.currentTarget
    setDialog(mode)
  }
  const closeDialog = () => {
    setDialog(null)
    window.setTimeout(() => dialogTrigger.current?.focus(), 0)
  }

  return <main className="contacts-page">
    <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Контакты' }]} />
    <header className="contacts-heading">
      <h1>Контакты</h1>
      <p>Контактные данные на странице демонстрационные. Реальные адреса, график работы и способы связи предоставит клиент.</p>
    </header>

    <section className="contacts-locations" aria-labelledby="contact-points-title">
      <header>
        <h2 id="contact-points-title">Магазины и точки обслуживания</h2>
        <div className="contacts-city-tabs" role="tablist" aria-label="Город контактов" onKeyDown={event => {
          if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return
          const tabs = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role=tab]')]
          const index = tabs.indexOf(document.activeElement as HTMLButtonElement)
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? cities.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + cities.length) % cities.length
          event.preventDefault(); selectCity(cities[next]); tabs[next]?.focus()
        }}>{cities.map((city,index) => <button key={city} id={`contact-city-${index}`} type="button" role="tab" aria-selected={region === city} aria-controls="contact-city-panel" tabIndex={region === city || (!cities.includes(region) && index === 0) ? 0 : -1} onClick={() => selectCity(city)}>{city}</button>)}</div>
        <p>Выберите город — покажем адрес, часы работы и способы связи.</p>
      </header>
      <div className="contacts-locations__grid" id="contact-city-panel" role="tabpanel" aria-labelledby={cities.includes(region) ? `contact-city-${cities.indexOf(region)}` : undefined} aria-label={!cities.includes(region) ? `Контактные точки: ${region}` : undefined}>
        <div className="contact-point-list">
          {points.map((point) => <article className="contact-point" data-testid="contact-point" key={point.id} data-active={point.id === activePoint?.id}>
            <Link className="contact-point__page-link" to={`/contacts/${point.id}?city=${encodeURIComponent(region)}`} aria-label={`Открыть страницу: ${point.name}`}><small>{point.kind} · {point.city}</small><strong>{point.name}<span aria-hidden="true"> ↗</span></strong><span>{point.address}</span><span>{point.hours}</span></Link>
            <div className="contact-point__links"><a href={`tel:${point.phone.replace(/[^+\d]/g, '')}`}>{point.phone}</a><a href={`mailto:${point.email}`}>{point.email}</a></div>
            <Link className="contact-point__details" to={`/contacts/${point.id}?city=${encodeURIComponent(region)}`} aria-label={`Фото и как добраться: ${point.name}`}>Фото и как добраться</Link>
          </article>)}
          {!points.length && <p role="status">В городе «{region}» контактные точки пока не указаны. Выберите другой город.</p>}
        </div>
        {activePoint && <section className="contacts-map-panel" aria-label="Карта контактных точек"><CoordinateMap center={activePoint.coordinates ?? cityCenters[region]} selectedMarkerId={activePoint.id} markers={points.map(point => ({ id: point.id, label: point.name, point: point.coordinates }))} onMarker={setActiveId}/><div className="contacts-map__caption" aria-live="polite"><span>Показана на карте · {region}</span><h3>{activePoint.name}</h3><p>{activePoint.address}</p><p>Демонстрационные координаты</p></div></section>}
      </div>
    </section>

    <section className="contacts-bottom">
      <article className="contacts-primary"><h2>Основные контакты</h2><dl><div><dt>Телефон</dt><dd><a href="tel:+70000000000">{primaryContacts.phone}</a></dd></div><div><dt>Email</dt><dd><a href={`mailto:${primaryContacts.email}`}>{primaryContacts.email}</a></dd></div></dl></article>
      <article className="contacts-request"><h2>Связаться с нами</h2><p>Нужна помощь с товаром, заказом или услугой? Напишите нам или закажите обратный звонок.</p><div><button className="button button--dark" type="button" onClick={(event) => openDialog('message', event)}>Написать сообщение</button><button className="button" type="button" onClick={(event) => openDialog('callback', event)}>Заказать звонок</button></div><small className="contacts-form-note">Демонстрационная форма: данные никуда не отправляются.</small></article>
    </section>
    {dialog && <ContactDialog mode={dialog} onClose={closeDialog} />}
  </main>
}
