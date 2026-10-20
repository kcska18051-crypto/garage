import { Link, useParams } from 'react-router-dom'
import { contactPoints } from '../data/contactsData'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { CoordinateMap } from '../features/maps/CoordinateMap'
import { NotFoundPage } from './NotFoundPage'
import './ContactsPage.css'
export function StorePage() {
  const { storeId } = useParams(); const point = contactPoints.find(p => p.id === storeId)
  if (!point) return <NotFoundPage />
  return <main className="contacts-page"><Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Контакты', to: '/contacts' }, { label: point.name }]}/><h1>{point.name} — {point.city}</h1><p>Демонстрационная страница точки. Адрес, координаты, контакты и фотографии требуют замены данными клиента.</p><div className="store-gallery">{['Фасад', 'Торговый зал', 'Вход'].map(label => <figure key={label}><div aria-label={`Демонстрационное фото: ${label}`} role="img">{label}</div><figcaption>Место для фотографии · {label}</figcaption></figure>)}</div><section className="contacts-bottom"><article className="contacts-primary"><h2>Посещение и получение заказа</h2><p>{point.kind}. Здесь можно уточнить комплектацию и получение заказа.</p><p>{point.address}</p><p>{point.hours}</p><p><a href={`tel:${point.phone.replace(/[^+\d]/g, '')}`}>{point.phone}</a></p><p><a href={`mailto:${point.email}`}>{point.email}</a></p><a target="_blank" rel="noreferrer" href={`https://www.openstreetmap.org/directions?to=${point.coordinates.lat},${point.coordinates.lng}`}>Построить маршрут к демонстрационной точке ↗</a><p>Схема проезда: выберите маршрут и укажите точку отправления. Вход и ориентиры уточняются.</p><Link to="/checkout/review">Перейти к самовывозу →</Link></article><CoordinateMap center={point.coordinates} value={point.coordinates}/></section></main>
}
