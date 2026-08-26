import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Slide } from '../../data/types'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import './HeroSlider.css'

export function HeroSlider({ slides, intervalMs = 6500 }: { slides: Slide[]; intervalMs?: number }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [engaged, setEngaged] = useState(false)
  const pointerStart = useRef<number | null>(null)
  const reducedMotion = useReducedMotion()
  const go = (delta: number) => setActive((current) => (current + delta + slides.length) % slides.length)

  useEffect(() => {
    if (paused || engaged || reducedMotion || slides.length < 2) return
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), intervalMs)
    return () => window.clearInterval(timer)
  }, [engaged, intervalMs, paused, reducedMotion, slides.length])

  return (
    <section className="hero" aria-label="Главные предложения" onPointerEnter={() => setEngaged(true)} onPointerLeave={() => setEngaged(false)} onFocus={() => setEngaged(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setEngaged(false) }} onPointerDown={(event) => { pointerStart.current = event.clientX }} onPointerUp={(event) => { if (pointerStart.current === null) return; const distance = event.clientX - pointerStart.current; if (Math.abs(distance) > 45) go(distance > 0 ? -1 : 1); pointerStart.current = null }}>
      <div className="hero__stage">
        {slides.map((slide, index) => (
          <article className="hero__slide" key={slide.id} hidden={index !== active} aria-label={`Слайд ${index + 1} из ${slides.length}`}>
            <div className="hero__copy"><p className="eyebrow">{slide.eyebrow}</p>{index === 0 ? <h1>{slide.title}</h1> : <h2>{slide.title}</h2>}<p>{slide.text}</p><Link className="button button--light" to={slide.href}>{slide.cta}<span aria-hidden="true">→</span></Link></div>
            <div className={`hero__art hero__art--${index + 1}`} aria-hidden="true"><span /><i /><b>{String(index + 1).padStart(2, '0')}</b></div>
          </article>
        ))}
      </div>
      <div className="hero__controls">
        <button onClick={() => go(-1)} aria-label="Предыдущий слайд">←</button>
        <div className="hero__indicators">{slides.map((slide, index) => <button key={slide.id} onClick={() => setActive(index)} aria-label={`Перейти к слайду ${index + 1}`} aria-current={index === active ? 'true' : undefined}><span /></button>)}</div>
        <button onClick={() => go(1)} aria-label="Следующий слайд">→</button>
        <button className="hero__pause" onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Запустить автопрокрутку' : 'Остановить автопрокрутку'}>{paused ? '▶' : 'Ⅱ'}</button>
      </div>
    </section>
  )
}
