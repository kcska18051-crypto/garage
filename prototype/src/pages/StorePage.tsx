import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { contactPoints } from '../data/contactsData'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { CoordinateMap } from '../features/maps/CoordinateMap'
import { NotFoundPage } from './NotFoundPage'
import { useRegion } from '../state/RegionState'
import { CartDialog } from '../features/cart/CartDialog'
import './ContactsPage.css'
export function StorePage() {
  const [photo, setPhoto] = useState<number | null>(null)
  const { storeId } = useParams()
  const [search] = useSearchParams()
  const { region, setRegion } = useRegion()
  const point = contactPoints.find(p => p.id === storeId || p.slug === storeId)
  const requestedCity = search.get('city')
  const initialCity = contactPoints.some(p => p.city === requestedCity) ? requestedCity : point?.city
  useEffect(() => { if (point && initialCity) setRegion(initialCity) }, [point, initialCity, setRegion])
  if (!point) return <NotFoundPage />
  const contactsHref = `/contacts?city=${encodeURIComponent(region)}`
  return <main className="contacts-page store-page">
    <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Контакты', to: contactsHref }, { label: point.name }]}/>
    <header className="contacts-heading">
      <h1>{point.name} — {point.city}</h1>
      <p>{point.kind}. Условия посещения и доступные услуги уточняются у точки. Здесь можно уточнить комплектацию и получение заказа.</p>
    </header>
    <section className="store-visit" aria-label="Знакомство с точкой">
      <div className="store-photo-grid" aria-label="Фотографии точки">{[0,1,2].map(index => <button type="button" key={index} aria-label={`Открыть фото ${index + 1}`} onClick={() => setPhoto(index)}><img src={`/garage/style-check/review-assets/${point.id === 'service' ? 'about-company-workshop.png' : 'contact-showroom.png'}`} alt={`Фото ${index + 1}: ${point.name}`} width="1024" height="1024"/><span aria-hidden="true">↗</span></button>)}</div>
      <div className="store-visit__summary"><h2>Планируете приехать?</h2><p>Уточните часы посещения и наличие нужного оборудования перед поездкой.</p><a className="store-contact-action" href={`tel:${point.phone.replace(/[^+\d]/g, '')}`}>Позвонить в магазин</a><a className="store-contact-email" href={`mailto:${point.email}`}>{point.email}</a></div>
    </section>
    <div className="store-page__information">
      <section className="contacts-primary" aria-labelledby="store-visit-title">
        <h2 id="store-visit-title">Посещение и контакты</h2>
        <dl>
          <div><dt>Адрес</dt><dd>{point.city}, {point.address}</dd></div>
          <div><dt>Часы работы</dt><dd>{point.hours}</dd></div>
          <div><dt>Телефон</dt><dd><a href={`tel:${point.phone.replace(/[^+\d]/g, '')}`}>{point.phone}</a></dd></div>
          <div><dt>Email</dt><dd><a href={`mailto:${point.email}`}>{point.email}</a></dd></div>
        </dl>
      </section>
      <section className="store-page__directions" aria-labelledby="store-directions-title">
        <h2 id="store-directions-title">Как добраться</h2>
        <p>Перед поездкой уточните адрес и ориентиры по телефону.</p>
        <CoordinateMap pinMarkers center={point.coordinates} value={point.coordinates}/>
        <a className="button" target="_blank" rel="noreferrer" href={`https://www.openstreetmap.org/directions?to=${point.coordinates.lat},${point.coordinates.lng}`}>Построить маршрут ↗</a>
        <p>Маршрут откроется в новой вкладке. Выберите точку отправления на карте маршрута.</p>
      </section>
    </div>
    {photo !== null && <CartDialog title={`Фото ${photo + 1} из 3`} className="store-photo-viewer" onClose={() => setPhoto(null)}><img src={`/garage/style-check/review-assets/${point.id === 'service' ? 'about-company-workshop.png' : 'contact-showroom.png'}`} alt={`Фото ${photo + 1}: ${point.name}`}/><div className="store-photo-viewer__nav"><button type="button" aria-label="Предыдущее фото" onClick={() => setPhoto((photo + 2) % 3)}>←</button><span>{photo + 1} / 3</span><button type="button" aria-label="Следующее фото" onClick={() => setPhoto((photo + 1) % 3)}>→</button></div></CartDialog>}
    <Link className="button store-page__back" to={contactsHref}>Вернуться к контактам</Link>
  </main>
}
