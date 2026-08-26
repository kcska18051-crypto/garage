import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UsefulItem } from '../../data/types'

export function UsefulSection({ items }: { items: UsefulItem[] }) {
  const hasNews = items.some((item) => item.kind === 'news')
  const [tab, setTab] = useState<'article' | 'news'>('article')
  const visible = items.filter((item) => item.kind === tab)
  return <section className="home-section useful-section"><div className="section-heading"><div><p className="eyebrow">База знаний</p><h2>Полезное</h2></div><div role="tablist" aria-label="Тип материалов"><button role="tab" aria-selected={tab === 'article'} onClick={() => setTab('article')}>Статьи</button>{hasNews && <button role="tab" aria-selected={tab === 'news'} onClick={() => setTab('news')}>Новости</button>}</div></div><div className="useful-grid" role="tabpanel">{visible.map((item, index) => <Link key={item.id} to={item.href}><div className={`useful-grid__art art-${index}`} aria-hidden="true"><span /></div><p>{item.meta}</p><h3>{item.title}</h3><span>Читать →</span></Link>)}</div></section>
}
