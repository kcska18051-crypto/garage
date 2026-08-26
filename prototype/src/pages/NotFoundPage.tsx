import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="placeholder-page">
      <p className="eyebrow">Ошибка 404</p>
      <h1>Страница не найдена</h1>
      <p>Такого адреса нет в текущей карте прототипа.</p>
      <Link className="button button--dark" to="/">Вернуться на главную</Link>
    </main>
  )
}
