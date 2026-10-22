import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { contactPoints } from '../data/contactsData'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { CoordinateMap } from '../features/maps/CoordinateMap'
import { NotFoundPage } from './NotFoundPage'
import { useRegion } from '../state/RegionState'
import './ContactsPage.css'
export function StorePage() {
  const { storeId } = useParams()
  const [search] = useSearchParams()
  const { region, setRegion } = useRegion()
  const point = contactPoints.find(p => p.id === storeId)
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
    <p className="store-page__notice">Демонстрационные данные: адрес, координаты, контакты и фотографии требуют подтверждения клиентом.</p>
    <section className="store-gallery" aria-label="Фотографии точки">{['Фасад', 'Торговый зал', 'Вход'].map(label => <figure key={label}><div aria-label={`Место для фотографии: ${label}`} role="img">{label}</div><figcaption>Демозаглушка · {label}</figcaption></figure>)}</section>
    <div className="store-page__information">
      <section className="contacts-primary" aria-labelledby="store-visit-title">
        <h2 id="store-visit-title">Посещение и контакты</h2>
        <dl>
          <div><dt>Адрес</dt><dd>{point.city}, {point.address}</dd></div>
          <div><dt>Часы работы</dt><dd>{point.hours}</dd></div>
          <div><dt>Телефон</dt><dd><a href={`tel:${point.phone.replace(/[^+\d]/g, '')}`}>{point.phone}</a></dd></div>
          <div><dt>Email</dt><dd><a href={`mailto:${point.email}`}>{point.email}</a></dd></div>
          <div><dt>Демо-координаты</dt><dd>{point.coordinates.lat}, {point.coordinates.lng}</dd></div>
        </dl>
      </section>
      <section className="store-page__directions" aria-labelledby="store-directions-title">
        <h2 id="store-directions-title">Как добраться</h2>
        <p>Вход и ориентиры уточняются. Карта показывает демонстрационную точку.</p>
        <CoordinateMap center={point.coordinates} value={point.coordinates}/>
        <a className="button" target="_blank" rel="noreferrer" href={`https://www.openstreetmap.org/directions?to=${point.coordinates.lat},${point.coordinates.lng}`}>Построить маршрут к демо-точке ↗</a>
        <p>Маршрут откроется в новой вкладке. Выберите точку отправления на карте маршрута.</p>
      </section>
    </div>
    <Link className="button store-page__back" to={contactsHref}>Вернуться к контактам</Link>
  </main>
}
