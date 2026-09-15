import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { UsefulItem } from '../../data/types'

export function UsefulSection({ items }: { items: UsefulItem[] }) {
  const railRef = useRef<HTMLDivElement>(null)
  const tabs = [{ id: 'news', label: 'Новости', allLabel: 'Все новости', href: '/news' }, { id: 'article', label: 'Статьи', allLabel: 'Все статьи', href: '/articles' }, { id: 'review', label: 'Обзоры', allLabel: 'Все обзоры', href: '/reviews' }] as const
  const availableTabs = tabs.filter((candidate) => items.some((item) => item.kind === candidate.id))
  const [tab, setTab] = useState<UsefulItem['kind']>(availableTabs[0]?.id ?? 'article')
  const visible = items.filter((item) => item.kind === tab)
  const selected = availableTabs.find((candidate) => candidate.id === tab) ?? availableTabs[0]
  const move = (direction: number) => railRef.current?.scrollBy({ left: direction * railRef.current.clientWidth * .75, behavior: 'smooth' })
  return <section className="home-section useful-section"><div className="section-heading section-heading--with-tabs"><div><div role="tablist" aria-label="Материалы">{availableTabs.map((candidate) => <button key={candidate.id} type="button" role="tab" aria-selected={tab === candidate.id} onClick={() => setTab(candidate.id)}>{candidate.label}</button>)}</div></div>{selected && <Link to={selected.href}>{selected.allLabel}</Link>}</div><div className="useful-rail"><button className="useful-rail__control useful-rail__control--previous" type="button" aria-label="Предыдущие материалы" onClick={() => move(-1)}>←</button><div className="useful-grid" role="tabpanel" ref={railRef}>{visible.map((item, index) => <Link key={item.id} to={item.href}><div className={`useful-grid__art art-${index}`} aria-hidden="true"><span /></div><div className="useful-grid__copy"><h3>{item.title}</h3><p>{item.text}</p><span>{item.meta}</span></div></Link>)}</div><button className="useful-rail__control useful-rail__control--next" type="button" aria-label="Следующие материалы" onClick={() => move(1)}>→</button></div></section>
}
