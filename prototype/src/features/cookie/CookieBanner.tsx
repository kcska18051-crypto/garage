import { Link } from 'react-router-dom'
import { useCookiePreference } from '../../state/CookiePreferenceState'
import './CookieBanner.css'

export function CookieBanner() {
  const { isOpen, choose } = useCookiePreference()
  if (!isOpen) return null

  return (
    <section className="cookie-banner" role="region" aria-label="Настройки cookie">
      <div className="cookie-banner__copy">
        <p>
          Мы используем файлы cookie для вашего удобства. Продолжая пользоваться сайтом, вы соглашаетесь с политикой использования cookie.{' '}
          <Link to="/privacy">Подробнее</Link>
        </p>
      </div>
      <div className="cookie-banner__actions">
        <button type="button" className="button button--dark" onClick={() => choose('all')}>Я согласен</button>
      </div>
    </section>
  )
}
