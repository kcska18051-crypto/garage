import { Link } from 'react-router-dom'
import type { SearchPromoItem, SearchSuggestion } from '../../data/searchData'

type Props = {
  query: string
  history: string[]
  popular: string[]
  promotions: SearchPromoItem[]
  suggestions: SearchSuggestion[]
  active: number
  onClearHistory(): void
  onClose(): void
  onHistory(query: string): void
  onPopular(query: string): void
  onRemoveHistory(query: string): void
  onSuggestion(item: SearchSuggestion): void
}

function PromoCard({ item, onClose }: { item: SearchPromoItem; onClose(): void }) {
  return <Link className={`search-promo-card search-promo-card--${item.kind}`} data-testid="search-promo-card" to={item.href} onClick={onClose}>
    <span className="search-promo-card__art" aria-hidden="true"><i /><b /></span>
    <span className="search-promo-card__copy">
      {item.badge && <small>{item.badge}</small>}
      <strong>{item.title}</strong>
      <span>{item.caption}</span>
      {item.price && <span className="search-promo-card__price">{item.oldPrice && <del>{item.oldPrice}</del>}<b>{item.price}</b></span>}
    </span>
  </Link>
}

export function SearchPanel(props: Props) {
  const hasQuery = props.query.trim().length > 1
  return <div className="search-panel" aria-label="Окно поиска">
    <button className="search-panel__close" type="button" aria-label="Закрыть поиск" onClick={props.onClose}>×</button>
    <section className="search-panel__discovery" aria-label="История и подсказки поиска">
      {hasQuery ? <>
        <header className="search-panel__heading"><div><small>Поиск</small><h2>Подсказки</h2></div></header>
        {props.suggestions.length ? <ul className="search-suggestions" role="listbox" aria-label="Подсказки поиска">
          {props.suggestions.map((item, index) => <li id={`search-option-${index}`} key={item.id} role="option" aria-selected={props.active === index}>
            <Link to={item.href} onClick={() => props.onSuggestion(item)}>
              <span className="search-suggestions__icon" aria-hidden="true">{item.kind === 'Товар' ? '▱' : item.kind === 'Категория' ? '▦' : '◎'}</span>
              <span><strong>{item.name}</strong><small>{item.kind} · {item.meta}</small></span>
              <b aria-hidden="true">→</b>
            </Link>
          </li>)}
        </ul> : <div className="search-panel__empty"><span aria-hidden="true">⌕</span><strong>Совпадений не найдено</strong><p>Попробуйте изменить запрос или открыть все результаты поиска.</p></div>}
        <button type="submit" className="search-panel__all">Показать все результаты по запросу</button>
      </> : <>
        <header className="search-panel__heading"><div><small>Недавнее</small><h2>История поиска</h2></div>{props.history.length > 0 && <button type="button" aria-label="Очистить историю" onClick={props.onClearHistory}>Очистить</button>}</header>
        {props.history.length ? <ul className="search-history">{props.history.map((item) => <li key={item}>
          <button className="search-history__query" type="button" onClick={() => props.onHistory(item)}><span aria-hidden="true">↺</span>{item}</button>
          <button type="button" aria-label={`Удалить запрос ${item}`} onClick={() => props.onRemoveHistory(item)}>×</button>
        </li>)}</ul> : <div className="search-panel__empty"><span aria-hidden="true">↺</span><strong>История поиска пока пуста</strong><p>Выполненные запросы будут отображаться здесь.</p></div>}
        <div className="search-popular"><h3>Популярные запросы</h3><div>{props.popular.map((item) => <button type="button" key={item} onClick={() => props.onPopular(item)}>{item}</button>)}</div></div>
      </>}
    </section>
    <section className="search-panel__promos" aria-label="Специальные предложения">
      <header className="search-panel__heading"><div><small>Управляемый блок</small><h2>Сейчас выгодно</h2></div><Link to="/actions" onClick={props.onClose}>Все акции →</Link></header>
      <div className="search-panel__promo-grid">{props.promotions.map((item) => <PromoCard item={item} key={item.id} onClose={props.onClose} />)}</div>
    </section>
  </div>
}
