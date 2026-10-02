import { Link } from 'react-router-dom'
import './NotFoundPage.css'

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <strong aria-hidden="true">404</strong>
      <h1>Страница не найдена</h1>
      <div className="not-found-page__actions">
        <Link className="button button--dark" to="/">На главную</Link>
        <Link className="button" to="/catalog">В каталог</Link>
      </div>
    </main>
  )
}
