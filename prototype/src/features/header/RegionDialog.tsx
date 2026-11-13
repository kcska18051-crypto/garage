import { useAnimatedClose } from '../../hooks/useAnimatedClose'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRegion } from '../../state/RegionState'
import './RegionDialog.css'

const cities = ['Ярославль', 'Вологда', 'Череповец', 'Москва', 'Санкт-Петербург', 'Нижний Новгород', 'Екатеринбург', 'Челябинск', 'Краснодар', 'Пермь', 'Воронеж', 'Самара', 'Казань', 'Волгоград', 'Новосибирск', 'Ростов-на-Дону', 'Кострома', 'Иваново', 'Рыбинск', 'Тутаев', 'Углич', 'Ростов Великий', 'Переславль-Залесский']

export function RegionDialog({ onSelect, onClose: onCloseImmediately }: { onSelect(city: string): void; onClose(): void }) {
  const onClose = useAnimatedClose(onCloseImmediately, () => panel.current)
  const { region } = useRegion()
  const [query, setQuery] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const panel = useRef<HTMLElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    document.body.classList.add('region-dialog-open')
    input.current?.focus({ preventScroll: true })
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onCloseRef.current(); return }
      if (event.key !== 'Tab') return
      const nodes = Array.from(panel.current?.querySelectorAll<HTMLElement>('button,input') ?? [])
      const first = nodes[0], last = nodes.at(-1)
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('region-dialog-open')
      document.removeEventListener('keydown', onKey)
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [])
  const normalize = (value: string) => value.trim().toLocaleLowerCase('ru').replaceAll('ё', 'е')
  const filtered = cities.filter(city => normalize(city).includes(normalize(query)))
  return createPortal(<div className="region-overlay" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section className="region-dialog" role="dialog" aria-modal="true" aria-labelledby="region-title" ref={panel}>
      <button className="region-close" type="button" aria-label="Закрыть выбор города" onClick={onClose}>×</button>
      <h2 id="region-title">Выберите свой город</h2>
      <input ref={input} className="region-dialog__search" type="search" aria-label="Населённый пункт или город" placeholder="Населённый пункт или город" value={query} onChange={event => setQuery(event.target.value)} />
      <div className="region-dialog__cities" aria-label="Города">
        {filtered.map(city => <button type="button" key={city} aria-pressed={city === region} onClick={() => onSelect(city)}>{city}{city === region && <span aria-hidden="true">✓</span>}</button>)}
        {!filtered.length && <p role="status">Город не найден. Проверьте название или попробуйте другую часть слова.</p>}
      </div>
    </section>
  </div>, document.body)
}
