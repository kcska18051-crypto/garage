import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { prototypeData } from '../../../src/data/prototypeData'
import { useReducedMotion } from '../../../src/hooks/useReducedMotion'
import { images } from './images'
import { Icon } from './Icon'

const slides = [prototypeData.slides[1], prototypeData.slides[0], prototypeData.slides[2]]
const photos: Record<string, string> = { paint: images['photo-hero-paint'], intro: images['photo-hero-workshop'], service: images['photo-hero-service'] }
export function Hero() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const start = useRef<number | null>(null)
  const reduced = useReducedMotion()
  const go = (delta: number) => setActive(value => (value + delta + slides.length) % slides.length)
  useEffect(() => { if (paused || reduced) return; const timer = window.setInterval(() => go(1), 7000); return () => clearInterval(timer) }, [paused, reduced])
  const slide = slides[active]
  return <section className="sc-hero" aria-label="Главные предложения" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false) }} onPointerDown={event => { start.current = event.clientX }} onPointerUp={event => { if (start.current !== null && Math.abs(event.clientX - start.current) > 45) go(event.clientX < start.current ? 1 : -1); start.current = null }}>
    <div className="sc-hero-panel"><img className="sc-hero-image" src={photos[slide.id]} alt="" fetchPriority="high" /><div className="sc-hero-copy"><p className="sc-kicker">Гараж · оборудование, инструмент, материалы</p><h2>{slide.title}</h2><p className="sc-hero-description">{slide.text}</p><Link to={slide.href} className="sc-hero-cta">{slide.cta}<Icon name="arrow" size={20} /></Link></div><div className="sc-hero-controls"><div className="sc-hero-dots">{slides.map((item, index) => <button key={item.id} onClick={() => setActive(index)} aria-label={`Перейти к слайду ${index + 1}: ${item.title}`} aria-current={index === active ? 'true' : undefined} />)}</div><div className="sc-hero-arrows"><button aria-label="Предыдущий слайд" onClick={() => go(-1)}><Icon name="left" size={18} /></button><button aria-label="Следующий слайд" onClick={() => go(1)}><Icon name="right" size={18} /></button></div></div></div>
  </section>
}
