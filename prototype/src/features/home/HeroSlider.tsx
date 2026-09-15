import { useEffect, useRef, useState } from 'react'
import type { Slide } from '../../data/types'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import './HeroSlider.css'

export function HeroSlider({ slides, intervalMs = 5000 }: { slides: Slide[]; intervalMs?: number }) {
  const [active, setActive] = useState(0)
  const [engaged, setEngaged] = useState(false)
  const pointerStart = useRef<number | null>(null)
  const reducedMotion = useReducedMotion()
  const go = (delta: number) => setActive((current) => (current + delta + slides.length) % slides.length)

  useEffect(() => {
    if (engaged || reducedMotion || slides.length < 2) return
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), intervalMs)
    return () => window.clearInterval(timer)
  }, [engaged, intervalMs, reducedMotion, slides.length])

  return (
    <section className="hero" aria-label="Главные предложения" onPointerEnter={() => setEngaged(true)} onPointerLeave={() => setEngaged(false)} onFocus={() => setEngaged(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setEngaged(false) }} onPointerDown={(event) => { pointerStart.current = event.clientX }} onPointerUp={(event) => { if (pointerStart.current === null) return; const distance = event.clientX - pointerStart.current; if (Math.abs(distance) > 45) go(distance > 0 ? -1 : 1); pointerStart.current = null }}>
      <div className="hero__stage">
        {slides.map((slide, index) => (
          <article className="hero__slide" key={slide.id} hidden={index !== active} aria-label={`Слайд ${index + 1} из ${slides.length}: ${slide.title}`}>
            <div className={`hero__art hero__art--${index + 1}`} aria-hidden="true"><span /><i /><b>{String(index + 1).padStart(2, '0')}</b></div>
          </article>
        ))}
      </div>
      <div className="hero__pagination">{slides.map((slide, index) => <button key={slide.id} onClick={() => setActive(index)} aria-label={`Перейти к слайду ${index + 1}`} aria-current={index === active ? 'true' : undefined} />)}</div>
    </section>
  )
}
