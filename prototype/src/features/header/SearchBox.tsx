import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { prototypeData } from '../../data/prototypeData'
import { addSearchHistory, clearSearchHistory, readSearchHistory, removeSearchHistory } from '../../utils/searchHistory'

const popular = ['Компрессоры', 'Инструмент для мастерской', 'Краскопульты']

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState(readSearchHistory)
  const [active, setActive] = useState(-1)
  const inputId = useId()
  const navigate = useNavigate()
  const root = useRef<HTMLFormElement>(null)
  const suggestions = useMemo(() => query.trim().length > 1 ? prototypeData.products.filter((item) => `${item.name} ${item.sku}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())).slice(0, 5) : [], [query])
  useEffect(() => { const close = (event: MouseEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false) }; document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close) }, [])
  const remember = (value: string) => { addSearchHistory(value); setHistory(readSearchHistory()) }
  const submit = () => { const value = query.trim(); if (!value) return; remember(value); setOpen(false); navigate(`/search?q=${encodeURIComponent(value)}`) }

  return (
    <form ref={root} className={`search-box${compact ? ' search-box--compact' : ''}`} role="search" onSubmit={(event) => { event.preventDefault(); submit() }}>
      <label className="sr-only" htmlFor={inputId}>Поиск по товарам, брендам и артикулам</label>
      <input id={inputId} type="search" placeholder="Товары, бренды, артикулы" value={query} onFocus={() => setOpen(true)} onChange={(event) => { setQuery(event.target.value); setOpen(true); setActive(-1) }} onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); if (suggestions.length && event.key === 'ArrowDown') { event.preventDefault(); setActive((value) => Math.min(value + 1, suggestions.length - 1)) } if (suggestions.length && event.key === 'ArrowUp') { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)) } if (event.key === 'Enter' && active >= 0) { event.preventDefault(); const item = suggestions[active]; remember(item.name); setOpen(false); navigate(item.href) } }} autoComplete="off" aria-expanded={open} />
      <button type="submit" aria-label="Найти">⌕</button>
      {open && (
        <div className="search-box__suggestions">
          {query.trim().length > 1 ? <><p>Быстрые результаты</p><ul role="listbox" aria-label="Подсказки поиска">{suggestions.map((item, index) => <li key={item.id} role="option" aria-selected={active === index}><Link onClick={() => { remember(item.name); setOpen(false) }} to={item.href}><span className="mini-placeholder" aria-hidden="true" /><span><strong>{item.name}</strong><small>{item.sku} · {item.price}</small></span></Link></li>)}</ul>{!suggestions.length && <p className="search-box__empty">Подходящих быстрых результатов нет</p>}<button type="submit" className="search-box__all">Показать все результаты</button></> : <><div className="search-box__panel-head"><p>История поиска</p>{history.length > 0 && <button type="button" onClick={() => { clearSearchHistory(); setHistory([]) }}>Очистить</button>}</div>{history.length > 0 && <ul className="search-box__history">{history.map((item) => <li key={item}><button type="button" onClick={() => { setQuery(item); remember(item); setOpen(false); navigate(`/search?q=${encodeURIComponent(item)}`) }}>{item}</button><button type="button" aria-label={`Удалить ${item}`} onClick={() => { removeSearchHistory(item); setHistory(readSearchHistory()) }}>×</button></li>)}</ul>}<p>Популярные запросы</p><div className="search-box__chips">{popular.map((item) => <button type="button" key={item} onClick={() => { setQuery(item); remember(item); setOpen(false); navigate(`/search?q=${encodeURIComponent(item)}`) }}>{item}</button>)}</div><Link className="search-box__promo" to="/actions" onClick={() => setOpen(false)}>Акции и специальные предложения →</Link></>}
        </div>
      )}
    </form>
  )
}
