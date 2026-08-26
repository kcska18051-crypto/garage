import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { prototypeData } from '../../data/prototypeData'

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState('')
  const inputId = useId()
  const navigate = useNavigate()
  const suggestions = query.trim().length > 1
    ? prototypeData.products.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
    : []

  return (
    <form className={`search-box${compact ? ' search-box--compact' : ''}`} role="search" onSubmit={(event) => { event.preventDefault(); navigate(`/search?q=${encodeURIComponent(query)}`) }}>
      <label className="sr-only" htmlFor={inputId}>Поиск по товарам, брендам и артикулам</label>
      <input id={inputId} type="search" placeholder="Товары, бренды, артикулы" value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" />
      <button type="submit" aria-label="Найти">⌕</button>
      {query.trim().length > 1 && (
        <div className="search-box__suggestions">
          <p>Быстрые результаты</p>
          <ul role="listbox" aria-label="Подсказки поиска">
            {(suggestions.length ? suggestions : prototypeData.products.slice(0, 2)).map((item) => (
              <li key={item.id} role="option" aria-selected="false"><a href={item.href}><span className="mini-placeholder" aria-hidden="true" />{item.name}</a></li>
            ))}
          </ul>
          <button type="submit" className="search-box__all">Показать все результаты</button>
        </div>
      )}
    </form>
  )
}
