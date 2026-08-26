import { Link } from 'react-router-dom'

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="placeholder-page">
      <nav aria-label="Хлебные крошки"><Link to="/">Главная</Link><span>/</span><span>{title}</span></nav>
      <div className="placeholder-page__media" aria-hidden="true" />
      <p className="eyebrow">Следующий этап прототипирования</p>
      <h1>{title}</h1>
      <p>Переход работает. Содержание раздела будет согласовано и спроектировано отдельно.</p>
      <Link className="button button--dark" to="/">Вернуться на главную</Link>
    </main>
  )
}
