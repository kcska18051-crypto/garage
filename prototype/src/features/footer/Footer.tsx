import { Link } from 'react-router-dom'
import { useCookiePreference } from '../../state/CookiePreferenceState'
import './Footer.css'

const groups = [{ title: 'Каталог', links: [['Все категории', '/catalog'], ['Новинки', '/new'], ['Бренды', '/brands'], ['Акции', '/actions']] }, { title: 'Покупателям', links: [['Доставка', '/delivery'], ['Оплата', '/payment'], ['Гарантия на товар', '/warranty'], ['Личный кабинет', '/profile']] }, { title: 'Материалы', links: [['Новости', '/news'], ['Статьи', '/articles'], ['Обзоры', '/reviews']] }, { title: 'Компания', links: [['О компании', '/about'], ['Услуги', '/services'], ['Контакты', '/contacts']] }]
export function Footer() {
  const { openSettings } = useCookiePreference()
  return <footer className="site-footer"><div className="site-footer__top"><Link className="logo" to="/"><span aria-hidden="true" />ГАРАЖ</Link><p>Оборудование, инструмент и материалы для профессиональных задач.</p><a href="tel:+70000000000">+7 (000) 000-00-00</a></div><div className="footer-groups">{groups.map((group) => <details key={group.title} open><summary>{group.title}</summary><nav aria-label={group.title}>{group.links.map(([label, href]) => <Link key={label} to={href}>{label}</Link>)}</nav></details>)}</div><div className="site-footer__bottom"><span>© «Гараж», прототип</span><div className="site-footer__legal"><Link to="/privacy">Политика конфиденциальности</Link><Link to="/user-agreement">Пользовательское соглашение</Link><Link to="/personal-data-consent">Согласие на обработку персональных данных</Link><button type="button" onClick={openSettings}>Настройки куки (cookie)</button></div><span>Нейтральная айдентика</span></div></footer>
}
