import { useEffect, useRef, useState } from 'react'
import './CoordinateMap.css'
export type Coordinates = { lat: number; lng: number }
export const cityCenters: Record<string, Coordinates> = { Ярославль: { lat: 57.626, lng: 39.893 }, Вологда: { lat: 59.22, lng: 39.89 }, Череповец: { lat: 59.128, lng: 37.909 } }
const project = (p: Coordinates, zoom: number) => { const n = 2 ** zoom; const lat = p.lat * Math.PI / 180; return { x: (p.lng + 180) / 360 * n * 256, y: (1 - Math.log(Math.tan(lat) + 1 / Math.cos(lat)) / Math.PI) / 2 * n * 256 } }
const unproject = (x: number, y: number, zoom: number): Coordinates => { const n = 2 ** zoom * 256; return { lng: x / n * 360 - 180, lat: Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n))) * 180 / Math.PI } }
function LocationPin({selected = true}:{selected?:boolean}) { return <g className="map-location-pin" aria-hidden="true"><ellipse cx="0" cy="1" rx="10" ry="3" fill="#29312c" opacity=".15"/><path d="M0 0C-5-8-20-23-20-35a20 20 0 1 1 40 0C20-23 5-8 0 0Z" fill={selected?'#ffcc00':'#fff'} stroke="#29312c" strokeWidth="2.5"/><circle cx="0" cy="-35" r="7" fill="#fff" stroke="#29312c" strokeWidth="2.5"/></g> }
export function CoordinateMap({ center, value, onChange, markers = [], onMarker, selectedMarkerId, pinMarkers = false }: { center: Coordinates; value?: Coordinates | null; onChange?(point: Coordinates): void; markers?: Array<{ id: string; label: string; point: Coordinates }>; onMarker?(id: string): void; selectedMarkerId?: string; pinMarkers?: boolean }) {
  const mapRef = useRef<SVGSVGElement>(null)
  const [mapWidth, setMapWidth] = useState(768)
  useEffect(() => {
    if (!pinMarkers || !mapRef.current) return
    const update = () => { const box = mapRef.current!.getBoundingClientRect(); if (box.width && box.height) setMapWidth(box.width / box.height * 384) }
    update()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update); observer.observe(mapRef.current)
    return () => observer.disconnect()
  }, [pinMarkers])
  const [zoom, setZoom] = useState(12)
  const [failed, setFailed] = useState(false)
  const [dragging, setDragging] = useState(false)
  const c = project(center, zoom); const left = c.x - mapWidth / 2; const top = c.y - 192
  const choose = (event: React.PointerEvent<SVGSVGElement>) => { if (!onChange) return; const r = event.currentTarget.getBoundingClientRect(); const p = unproject(left + (event.clientX - r.left) / r.width * mapWidth, top + (event.clientY - r.top) / r.height * 384, zoom); onChange({ lat: Number(p.lat.toFixed(6)), lng: Number(p.lng.toFixed(6)) }) }
  return <div className="coordinate-map-wrap"><div className="map-controls"><button type="button" aria-label="Приблизить карту" onClick={() => setZoom(v => Math.min(17, v + 1))}>+</button><button type="button" aria-label="Отдалить карту" onClick={() => setZoom(v => Math.max(5, v - 1))}>−</button></div>
    <svg ref={mapRef} data-testid="coordinate-map" className="coordinate-map" viewBox={`0 0 ${mapWidth} 384`} role="img" aria-label={onChange ? 'Карта выбора точки доставки: нажмите или переместите маркер' : 'Карта пунктов получения'} onPointerDown={e => { if (onChange) { e.currentTarget.setPointerCapture(e.pointerId); setDragging(true); choose(e) } }} onPointerMove={e => { if (dragging) choose(e) }} onPointerUp={() => setDragging(false)}>
      <rect width={mapWidth} height="384" fill="#e4e5df" />
      {!failed && Array.from({ length: (Math.ceil(mapWidth / 256) + 1) * 3 }, (_, i) => { const x = Math.floor(left / 256) + i % (Math.ceil(mapWidth / 256) + 1); const y = Math.floor(top / 256) + Math.floor(i / (Math.ceil(mapWidth / 256) + 1)); return <image key={`${zoom}-${x}-${y}`} href={`https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`} x={x * 256 - left} y={y * 256 - top} width="256" height="256" onError={() => setFailed(true)} /> })}
      {markers.map(marker => { const p = project(marker.point, zoom); const selected = marker.id === selectedMarkerId; return <g key={marker.id} role="button" aria-label={`На карте: ${marker.label}`} aria-pressed={selected} tabIndex={0} onPointerDown={e => e.stopPropagation()} onClick={() => onMarker?.(marker.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onMarker?.(marker.id) } }} transform={`translate(${p.x - left} ${p.y - top})`}>{pinMarkers ? <LocationPin selected={selected}/> : <>{selected && <circle r="23" fill="none" stroke="#242422" strokeWidth="2"/>}<circle r="17" fill="#30302e" stroke="white" strokeWidth="3"/><text textAnchor="middle" y="5" fill="white">{selected ? '✓' : '●'}</text></>}</g> })}
      {value && (() => { const p = project(value, zoom); return <g transform={`translate(${p.x - left} ${p.y - top})`}>{pinMarkers ? <LocationPin/> : <><circle r="12" fill="#252522" stroke="white" strokeWidth="4"/><circle r="3" fill="white"/></>}</g> })()}
    </svg>
    <a className="map-attribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap</a>
    {failed && <p role="status">Подложка карты недоступна. {onChange ? 'Точку можно выбрать по координатам.' : markers.length ? 'Выберите пункт в списке или по маркеру.' : 'Адрес и ссылка на маршрут доступны в информации о точке.'}</p>}
    {onChange && <div className="coordinate-inputs"><label>Широта<input type="number" min="-85" max="85" step="0.000001" value={value?.lat ?? ''} onChange={e => { const lat = Number(e.target.value); if (lat >= -85 && lat <= 85) onChange({ lat, lng: value?.lng ?? center.lng }) }}/></label><label>Долгота<input type="number" min="-180" max="180" step="0.000001" value={value?.lng ?? ''} onChange={e => { const lng = Number(e.target.value); if (lng >= -180 && lng <= 180) onChange({ lat: value?.lat ?? center.lat, lng }) }}/></label></div>}
  </div>
}
