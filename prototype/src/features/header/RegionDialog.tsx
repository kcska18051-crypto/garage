import { useEffect, useRef } from 'react'

export function RegionDialog({ onSelect, onClose }: { onSelect(city: string): void; onClose(): void }) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    headingRef.current?.focus()
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose() }}>
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="region-title">
        <button className="dialog__close" aria-label="Закрыть выбор города" onClick={onClose}>×</button>
        <p className="eyebrow">Регион влияет на сроки и получение</p>
        <h2 id="region-title" tabIndex={-1} ref={headingRef}>Выберите город</h2>
        <div className="dialog__options">
          {['Ярославль', 'Вологда', 'Череповец', 'Другой город'].map((city) => <button key={city} onClick={() => onSelect(city)}>{city}</button>)}
        </div>
      </section>
    </div>
  )
}
