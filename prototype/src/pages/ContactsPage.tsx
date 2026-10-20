import { useCallback, useRef, useState, type MouseEvent } from 'react'
import { contactPoints, primaryContacts } from '../data/contactsData'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { ContactDialog, type ContactDialogMode } from '../features/forms/ContactDialog'
import { cityCenters, CoordinateMap } from '../features/maps/CoordinateMap'
import { PickupDetails } from '../features/checkout/PickupDetails'
import type { ContactPoint } from '../data/contactsData'
import { useRegion } from '../state/RegionState'
import './ContactsPage.css'

export function ContactsPage() {
  const { region, setRegion } = useRegion()
  const [activeId, setActiveId] = useState(contactPoints[0].id)
  const [dialog, setDialog] = useState<ContactDialogMode | null>(null)
  const dialogTrigger = useRef<HTMLButtonElement | null>(null)
  const points = contactPoints.filter(point => point.city === region)
  const activePoint = points.find(point => point.id === activeId) ?? points[0]
  const cities = [...new Set(contactPoints.map(point => point.city))]
  const [details, setDetails] = useState<ContactPoint | null>(null)
  const closeDetails = useCallback(() => setDetails(null), [])

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
        <h2 id="contact-points-title">Контактные точки</h2>
        <div className="contacts-city-tabs" role="tablist" aria-label="Город контактов" onKeyDown={event => {
          if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return
          const tabs = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role=tab]')]
          const index = tabs.indexOf(document.activeElement as HTMLButtonElement)
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? cities.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + cities.length) % cities.length
          event.preventDefault(); setRegion(cities[next]); tabs[next]?.focus()
        }}>{cities.map((city,index) => <button key={city} id={`contact-city-${index}`} type="button" role="tab" aria-selected={region === city} aria-controls="contact-city-panel" tabIndex={region === city || (!cities.includes(region) && index === 0) ? 0 : -1} onClick={() => setRegion(city)}>{city}</button>)}</div>
        <p>Выберите город и точку для просмотра на карте. Это не меняет пункт получения вашего заказа.</p>
      </header>
      <div className="contacts-locations__grid" id="contact-city-panel" role="tabpanel" aria-labelledby={cities.includes(region) ? `contact-city-${cities.indexOf(region)}` : undefined} aria-label={!cities.includes(region) ? `Контактные точки: ${region}` : undefined}>
        <div className="contact-point-list" role="radiogroup" aria-label="Точка для просмотра на карте">
          {points.map((point) => <article className="contact-point" data-testid="contact-point" data-active={activePoint?.id === point.id} key={point.id}>
            <label className="contact-point__choice"><input type="radio" name="contact-point" checked={activePoint?.id === point.id} onChange={() => setActiveId(point.id)} aria-label={`${point.name}, ${point.city}, ${point.address}`}/><span><small>{point.kind} · {point.city}</small><strong>{point.name}</strong><span>{point.address}</span><span>{point.hours}</span>{activePoint?.id === point.id && <b><span aria-hidden="true">✓ </span>Показана на карте</b>}</span></label>
            <div className="contact-point__links"><a href={`tel:${point.phone.replace(/[^+\d]/g, '')}`}>{point.phone}</a><a href={`mailto:${point.email}`}>{point.email}</a></div>
            <button className="contact-point__details" type="button" aria-label={`Фото и как добраться: ${point.name}`} onClick={() => setDetails(point)}>Фото и как добраться</button>
          </article>)}
          {!points.length && <p role="status">В городе «{region}» контактные точки пока не указаны. Выберите другой город.</p>}
        </div>
        {activePoint && <section className="contacts-map-panel" aria-label="Карта контактных точек"><CoordinateMap center={activePoint.coordinates ?? cityCenters[region]} selectedMarkerId={activePoint.id} markers={points.map(point => ({ id: point.id, label: point.name, point: point.coordinates }))} onMarker={setActiveId}/><div className="contacts-map__caption" aria-live="polite"><span>Показана на карте · {region}</span><h3>{activePoint.name}</h3><p>{activePoint.address}</p><p>Демонстрационные координаты</p></div></section>}
      </div>
    </section>

    <section className="contacts-bottom">
      <article className="contacts-primary"><h2>Основные контакты</h2><dl><div><dt>Телефон</dt><dd><a href="tel:+70000000000">{primaryContacts.phone}</a></dd></div><div><dt>Email</dt><dd><a href={`mailto:${primaryContacts.email}`}>{primaryContacts.email}</a></dd></div><div><dt>Адрес</dt><dd>{primaryContacts.address}</dd></div><div><dt>Часы работы</dt><dd>{primaryContacts.hours}</dd></div></dl></article>
      <article className="contacts-request"><h2>Связаться с нами</h2><p>Оставьте демонстрационное обращение. Данные никуда не отправляются и не сохраняются.</p><div><button className="button button--dark" type="button" onClick={(event) => openDialog('message', event)}>Написать сообщение</button><button className="button" type="button" onClick={(event) => openDialog('callback', event)}>Заказать звонок</button></div></article>
    </section>
    {dialog && <ContactDialog mode={dialog} onClose={closeDialog} />}
    {details && <PickupDetails point={details} onClose={closeDetails}/>}
  </main>
}
