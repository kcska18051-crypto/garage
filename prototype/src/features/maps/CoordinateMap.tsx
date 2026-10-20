import { useState } from 'react'
import './CoordinateMap.css'
export type Coordinates = { lat: number; lng: number }
export const cityCenters: Record<string, Coordinates> = { Ярославль: { lat: 57.626, lng: 39.893 }, Вологда: { lat: 59.22, lng: 39.89 }, Череповец: { lat: 59.128, lng: 37.909 } }
const project = (p: Coordinates, zoom: number) => { const n = 2 ** zoom; const lat = p.lat * Math.PI / 180; return { x: (p.lng + 180) / 360 * n * 256, y: (1 - Math.log(Math.tan(lat) + 1 / Math.cos(lat)) / Math.PI) / 2 * n * 256 } }
const unproject = (x: number, y: number, zoom: number): Coordinates => { const n = 2 ** zoom * 256; return { lng: x / n * 360 - 180, lat: Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n))) * 180 / Math.PI } }
export function CoordinateMap({ center, value, onChange, markers = [], onMarker }: { center: Coordinates; value?: Coordinates | null; onChange?(point: Coordinates): void; markers?: Array<{ id: string; label: string; point: Coordinates }>; onMarker?(id: string): void }) {
  const [zoom, setZoom] = useState(12)
  const [failed, setFailed] = useState(false)
  const [dragging, setDragging] = useState(false)
  const c = project(center, zoom); const left = c.x - 384; const top = c.y - 192
  const choose = (event: React.PointerEvent<SVGSVGElement>) => { if (!onChange) return; const r = event.currentTarget.getBoundingClientRect(); const p = unproject(left + (event.clientX - r.left) / r.width * 768, top + (event.clientY - r.top) / r.height * 384, zoom); onChange({ lat: Number(p.lat.toFixed(6)), lng: Number(p.lng.toFixed(6)) }) }
  return <div className="coordinate-map-wrap"><div className="map-controls"><button type="button" aria-label="Приблизить карту" onClick={() => setZoom(v => Math.min(17, v + 1))}>+</button><button type="button" aria-label="Отдалить карту" onClick={() => setZoom(v => Math.max(5, v - 1))}>−</button></div>
    <svg data-testid="coordinate-map" className="coordinate-map" viewBox="0 0 768 384" role="img" aria-label={onChange ? 'Карта выбора точки доставки: нажмите или переместите маркер' : 'Карта пунктов получения'} onPointerDown={e => { if (onChange) { e.currentTarget.setPointerCapture(e.pointerId); setDragging(true); choose(e) } }} onPointerMove={e => { if (dragging) choose(e) }} onPointerUp={() => setDragging(false)}>
      <rect width="768" height="384" fill="#e4e5df" />
      {Array.from({ length: 20 }, (_, i) => { const x = Math.floor(left / 256) + i % 5; const y = Math.floor(top / 256) + Math.floor(i / 5); return <image key={`${zoom}-${x}-${y}`} href={`https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`} x={x * 256 - left} y={y * 256 - top} width="256" height="256" onError={() => setFailed(true)} /> })}
      {markers.map(marker => { const p = project(marker.point, zoom); return <g key={marker.id} role="button" aria-label={`На карте: ${marker.label}`} tabIndex={0} onPointerDown={e => e.stopPropagation()} onClick={() => onMarker?.(marker.id)} onKeyDown={e => { if (e.key === 'Enter') onMarker?.(marker.id) }} transform={`translate(${p.x - left} ${p.y - top})`}><circle r="17" fill="#30302e" stroke="white" strokeWidth="3"/><text textAnchor="middle" y="5" fill="white">●</text></g> })}
      {value && (() => { const p = project(value, zoom); return <g transform={`translate(${p.x - left} ${p.y - top})`}><circle r="12" fill="#252522" stroke="white" strokeWidth="4"/><circle r="3" fill="white"/></g> })()}
    </svg>
    <a className="map-attribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap</a>
    {failed && <p role="status">Подложка карты недоступна. Повторите позже; точку можно выбрать по координатам.</p>}
    {onChange && <div className="coordinate-inputs"><label>Широта<input type="number" min="-85" max="85" step="0.000001" value={value?.lat ?? ''} onChange={e => { const lat = Number(e.target.value); if (lat >= -85 && lat <= 85) onChange({ lat, lng: value?.lng ?? center.lng }) }}/></label><label>Долгота<input type="number" min="-180" max="180" step="0.000001" value={value?.lng ?? ''} onChange={e => { const lng = Number(e.target.value); if (lng >= -180 && lng <= 180) onChange({ lat: value?.lat ?? center.lat, lng }) }}/></label></div>}
  </div>
}
