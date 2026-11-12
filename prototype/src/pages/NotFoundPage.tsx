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
      <div className="not-found-page__content">
        <h1>Страница не найдена</h1>
        <p>Возможно, страница была удалена или в адресе есть опечатка.</p>
        <p className="not-found-page__hint">Продолжите выбор в каталоге или воспользуйтесь поиском товаров в шапке сайта.</p>
        <div className="not-found-page__actions">
          <Link className="button not-found-page__catalog" to="/catalog">В каталог</Link>
          <Link className="button not-found-page__home" to="/">На главную</Link>
        </div>
      </div>
      <div className="not-found-page__art" aria-hidden="true"><strong>404</strong></div>
    </main>
  )
}
