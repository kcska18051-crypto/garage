import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { findSearchSuggestions, searchPromoItems, type SearchSuggestion } from '../../data/searchData'
import { addSearchHistory, clearSearchHistory, readSearchHistory, removeSearchHistory } from '../../utils/searchHistory'
import { SearchPanel } from './SearchPanel'

const popular = ['Компрессоры', 'Инструмент для мастерской', 'Краскопульты']

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState(readSearchHistory)
  const [active, setActive] = useState(-1)
  const inputId = useId()
  const navigate = useNavigate()
  const root = useRef<HTMLFormElement>(null)
  const suggestions = useMemo(() => findSearchSuggestions(query), [query])
  const close = () => { setOpen(false); setActive(-1) }
  const remember = (value: string) => { addSearchHistory(value); setHistory(readSearchHistory()) }
  const runQuery = (value: string) => { const next = value.trim(); if (!next) return; setQuery(next); remember(next); close(); navigate(`/search?q=${encodeURIComponent(next)}`) }
  const chooseSuggestion = (item: SearchSuggestion) => { remember(query.trim() || item.name); close() }

  useEffect(() => {
    const onPointer = (event: MouseEvent) => { if (!root.current?.contains(event.target as Node)) close() }
    document.addEventListener('mousedown', onPointer)
    return () => document.removeEventListener('mousedown', onPointer)
  }, [])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.classList.add('search-overlay-open')
    return () => {
      document.body.style.overflow = previous
      document.body.classList.remove('search-overlay-open')
    }
  }, [open])

  const submit = () => runQuery(query)
  return <form ref={root} className={`search-box${compact ? ' search-box--compact' : ''}${open ? ' search-box--open' : ''}`} role="search" onSubmit={(event) => { event.preventDefault(); submit() }}>
    <label className="sr-only" htmlFor={inputId}>Поиск по товарам, брендам и артикулам</label>
    <input
      id={inputId}
      type="search"
      placeholder="Товары, бренды, артикулы"
      value={query}
      onFocus={() => setOpen(true)}
      onChange={(event) => { setQuery(event.target.value); setOpen(true); setActive(-1) }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') { event.preventDefault(); close(); return }
        if (suggestions.length && event.key === 'ArrowDown') { event.preventDefault(); setActive((value) => Math.min(value + 1, suggestions.length - 1)); return }
        if (suggestions.length && event.key === 'ArrowUp') { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)); return }
        if (event.key === 'Enter' && active >= 0) { event.preventDefault(); const item = suggestions[active]; chooseSuggestion(item); navigate(item.href) }
      }}
      autoComplete="off"
      aria-expanded={open}
      aria-controls={open ? `${inputId}-panel` : undefined}
      aria-activedescendant={active >= 0 ? `search-option-${active}` : undefined}
    />
    <button className="search-box__submit" type="submit" aria-label="Найти">⌕</button>
    {open && <>
      <button className="search-backdrop" type="button" tabIndex={-1} aria-label="Закрыть поиск" onClick={close} />
      <div id={`${inputId}-panel`}>
        <SearchPanel
          query={query}
          history={history}
          popular={popular}
          promotions={searchPromoItems}
          suggestions={suggestions}
          active={active}
          onClose={close}
          onClearHistory={() => { clearSearchHistory(); setHistory([]) }}
          onHistory={runQuery}
          onPopular={runQuery}
          onRemoveHistory={(value) => { removeSearchHistory(value); setHistory(readSearchHistory()) }}
          onSuggestion={chooseSuggestion}
        />
      </div>
    </>}
  </form>
}
