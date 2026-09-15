import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UsefulItem } from '../../data/types'

export function UsefulSection({ items }: { items: UsefulItem[] }) {
  const tabs = [{ id: 'news', label: 'Новости', allLabel: 'Смотреть все новости', href: '/news' }, { id: 'article', label: 'Статьи', allLabel: 'Смотреть все статьи', href: '/articles' }, { id: 'testimonial', label: 'Отзывы', allLabel: 'Смотреть все отзывы', href: '/reviews' }] as const
  const availableTabs = tabs.filter((candidate) => items.some((item) => item.kind === candidate.id))
  const [tab, setTab] = useState<UsefulItem['kind']>(availableTabs[0]?.id ?? 'article')
  const visible = items.filter((item) => item.kind === tab)
  const selected = availableTabs.find((candidate) => candidate.id === tab) ?? availableTabs[0]
  return <section className="home-section useful-section"><div className="section-heading section-heading--with-tabs"><div><h2>Новости, статьи и отзывы</h2><div role="tablist" aria-label="Материалы">{availableTabs.map((candidate) => <button key={candidate.id} type="button" role="tab" aria-selected={tab === candidate.id} onClick={() => setTab(candidate.id)}>{candidate.label}</button>)}</div></div>{selected && <Link to={selected.href}>{selected.allLabel}</Link>}</div><div className="useful-grid" role="tabpanel">{visible.map((item, index) => <Link key={item.id} to={item.href}><div className={`useful-grid__art art-${index}`} aria-hidden="true"><span /></div><p>{item.meta}</p><h3>{item.title}</h3><span>{tab === 'testimonial' ? 'Все отзывы →' : 'Читать →'}</span></Link>)}</div></section>
}
