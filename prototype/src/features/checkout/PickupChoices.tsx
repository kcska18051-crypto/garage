import { useCallback, useState } from 'react'
import type { ContactPoint } from '../../data/contactsData'
import { CoordinateMap, cityCenters } from '../maps/CoordinateMap'
import { PickupDetails } from './PickupDetails'
import './PickupChoices.css'

export function PickupChoices({ city, points, selectedId, onSelect }: { city: string; points: ContactPoint[]; selectedId?: string; onSelect(id: string): void }) {
  const [details, setDetails] = useState<ContactPoint | null>(null)
  const closeDetails = useCallback(() => setDetails(null), [])
  const selected = points.find(point => point.id === selectedId)
  return <>
    <div className="pickup-list" role="radiogroup" aria-label="Пункт самовывоза">
      {points.map(point => <article key={point.id} className={`pickup-card${selectedId === point.id ? ' is-selected' : ''}`}>
        <label className="pickup-card__choice">
          <input type="radio" name="pickup-point" checked={selectedId === point.id} onChange={() => onSelect(point.id)} aria-label={`${point.name}, ${point.address}, ${point.hours}`}/>
          <span><strong>{point.name}</strong><span>{point.address}</span><small>{point.hours}</small>{selectedId === point.id && <span className="pickup-card__selected"><span aria-hidden="true">✓</span><span>Выбран</span></span>}</span>
        </label>
        <button className="pickup-card__details" type="button" aria-label={`Фото и как добраться: ${point.name}`} onClick={() => setDetails(point)}>Фото и как добраться</button>
      </article>)}
    </div>
    <CoordinateMap center={selected?.coordinates ?? cityCenters[city]} selectedMarkerId={selected?.id} markers={points.map(point => ({ id: point.id, label: point.name, point: point.coordinates }))} onMarker={onSelect}/>
    {details && <PickupDetails point={details} onClose={closeDetails}/>}
  </>
}
