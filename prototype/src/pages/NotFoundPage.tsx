import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import './NotFoundPage.css'

export function NotFoundPage() {
  useEffect(() => {
    const previousTitle = document.title
    const existingRobots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    const previousRobots = existingRobots?.getAttribute('content')
    const robots = existingRobots ?? document.head.appendChild(Object.assign(document.createElement('meta'), { name: 'robots' }))
    document.title = 'Страница не найдена — Гараж'
    robots.content = 'noindex, follow'
    return () => {
      document.title = previousTitle
      if (!existingRobots) robots.remove()
      else if (previousRobots === null) robots.removeAttribute('content')
      else robots.content = previousRobots ?? ''
    }
  }, [])
  return (
    <main className="not-found-page">
      <strong aria-hidden="true">404</strong>
      <h1>Страница не найдена</h1>
      <p>Возможно, страница была удалена или в адресе есть опечатка.</p>
      <div className="not-found-page__actions">
        <Link className="button button--dark" to="/">На главную</Link>
        <Link className="button" to="/catalog">В каталог</Link>
      </div>
    </main>
  )
}
