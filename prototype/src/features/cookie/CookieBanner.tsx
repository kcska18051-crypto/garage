import { Link } from 'react-router-dom'
import { useCookiePreference } from '../../state/CookiePreferenceState'
import './CookieBanner.css'

export function CookieBanner() {
  const { isOpen, choose } = useCookiePreference()
  if (!isOpen) return null

  return (
    <section className="cookie-banner" role="region" aria-label="Настройки cookie">
      <div className="cookie-banner__copy">
        <strong>Cookie в демонстрационном прототипе</strong>
        <p>Необходимые данные браузера поддерживают работу сайта. Необязательные категории показаны как настройка интерфейса; реальные трекеры в прототипе не подключены.</p>
        <Link to="/privacy">Подробнее</Link>
      </div>
      <div className="cookie-banner__actions">
        <button type="button" className="button button--light" onClick={() => choose('necessary')}>Только необходимые</button>
        <button type="button" className="button button--dark" onClick={() => choose('all')}>Согласен</button>
      </div>
    </section>
  )
}
