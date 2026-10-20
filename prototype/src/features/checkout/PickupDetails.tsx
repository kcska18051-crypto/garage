import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { ContactPoint } from '../../data/contactsData'
import { CoordinateMap } from '../maps/CoordinateMap'
import './PickupChoices.css'

export function PickupDetails({ point, onClose }: { point: ContactPoint; onClose(): void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const dialog = dialogRef.current!
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (typeof dialog.showModal === 'function') dialog.showModal()
    else dialog.setAttribute('open', '')
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = overflow
      if (typeof dialog.close === 'function') dialog.close()
      if (opener?.isConnected) opener.focus()
    }
  }, [])
  return createPortal(<dialog ref={dialogRef} className="pickup-details" aria-labelledby="pickup-details-title" aria-modal="true"
    onCancel={event => { event.preventDefault(); onClose() }}
    onKeyDown={event => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return }
      if (event.key !== 'Tab') return
      const elements = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), [tabindex="0"]')]
      const first = elements[0], last = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }}>
    <header className="pickup-details__heading"><div><small>Фото и как добраться</small><h2 id="pickup-details-title">{point.name} — {point.city}</h2></div><button ref={closeRef} type="button" aria-label="Закрыть информацию о пункте" onClick={onClose}>×</button></header>
    <div className="pickup-details__body">
      <p className="pickup-details__notice">Демонстрационные данные: адрес, координаты, контакты и фотографии требуют подтверждения клиентом.</p>
      <p>{point.kind}. Здесь можно уточнить комплектацию и получение заказа.</p>
      <div className="pickup-details__photos">{['Фасад', 'Вход'].map(label => <figure key={label}><div role="img" aria-label={`Место для фотографии: ${label}`}>{label}</div><figcaption>Демозаглушка · {label}</figcaption></figure>)}</div>
      <dl><div><dt>Адрес</dt><dd>{point.city}, {point.address}</dd></div><div><dt>Часы работы</dt><dd>{point.hours}</dd></div><div><dt>Контакты</dt><dd><a href={`tel:${point.phone.replace(/[^+\d]/g, '')}`}>{point.phone}</a><br/><a href={`mailto:${point.email}`}>{point.email}</a></dd></div></dl>
      <h3>Как добраться</h3><p>Вход и ориентиры уточняются. Карта показывает демонстрационную точку.</p>
      <CoordinateMap center={point.coordinates} value={point.coordinates}/>
      <a className="pickup-details__route" href={`https://www.openstreetmap.org/directions?to=${point.coordinates.lat},${point.coordinates.lng}`} target="_blank" rel="noreferrer">Построить маршрут к демо-точке ↗</a>
      <p>Маршрут откроется в новой вкладке. Оформление заказа останется на месте.</p>
    </div>
  </dialog>, document.body)
}
