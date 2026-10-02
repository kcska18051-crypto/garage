import { useRef, useState, type MouseEvent } from 'react'
import { contactPoints, primaryContacts } from '../data/contactsData'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { ContactDialog, type ContactDialogMode } from '../features/forms/ContactDialog'
import { useRegion } from '../state/RegionState'
import './ContactsPage.css'

export function ContactsPage() {
  const { region } = useRegion()
  const [activeId, setActiveId] = useState(contactPoints[0].id)
  const [dialog, setDialog] = useState<ContactDialogMode | null>(null)
  const dialogTrigger = useRef<HTMLButtonElement | null>(null)
  const activePoint = contactPoints.find((point) => point.id === activeId) ?? contactPoints[0]

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
        <div><h2 id="contact-points-title">Контактные точки</h2><p>Выберите точку, чтобы увидеть её на схематичной карте.</p></div>
        <div className="contacts-location-context"><span>Город сайта: {region}</span><label>Контактная точка<select value={activeId} onChange={(event) => setActiveId(event.target.value)}>{contactPoints.map((point) => <option key={point.id} value={point.id}>{point.name}</option>)}</select></label></div>
      </header>
      <div className="contacts-locations__grid">
        <div className="contact-point-list">
          {contactPoints.map((point) => <article className="contact-point" data-testid="contact-point" data-active={activeId === point.id} key={point.id}>
            <span>{point.kind}</span><h3>{point.name}</h3><p>{point.address}</p><p>{point.hours}</p><a href={`tel:${point.phone.replace(/[^+\d]/g, '')}`}>{point.phone}</a><a href={`mailto:${point.email}`}>{point.email}</a>
            <button type="button" aria-pressed={activeId === point.id} onClick={() => setActiveId(point.id)}>На карте: {point.name}</button>
          </article>)}
        </div>
        <section className="contacts-map" role="region" aria-label="Демонстрационная карта">
          <div className="contacts-map__canvas" aria-hidden="true"><i /><i /><i />{contactPoints.map((point) => <button type="button" tabIndex={-1} key={point.id} className={activeId === point.id ? 'active' : ''} style={{ left: `${point.mapPosition.x}%`, top: `${point.mapPosition.y}%` }} />)}</div>
          <div className="contacts-map__caption"><span>Схема без реальных координат</span><h3>{activePoint.name}</h3><p>{activePoint.address}</p></div>
        </section>
      </div>
    </section>

    <section className="contacts-bottom">
      <article className="contacts-primary"><h2>Основные контакты</h2><dl><div><dt>Телефон</dt><dd><a href="tel:+70000000000">{primaryContacts.phone}</a></dd></div><div><dt>Email</dt><dd><a href={`mailto:${primaryContacts.email}`}>{primaryContacts.email}</a></dd></div><div><dt>Адрес</dt><dd>{primaryContacts.address}</dd></div><div><dt>Часы работы</dt><dd>{primaryContacts.hours}</dd></div></dl></article>
      <article className="contacts-request"><h2>Связаться с нами</h2><p>Оставьте демонстрационное обращение. Данные никуда не отправляются и не сохраняются.</p><div><button className="button button--dark" type="button" onClick={(event) => openDialog('message', event)}>Написать сообщение</button><button className="button" type="button" onClick={(event) => openDialog('callback', event)}>Заказать звонок</button></div></article>
    </section>
    {dialog && <ContactDialog mode={dialog} onClose={closeDialog} />}
  </main>
}
