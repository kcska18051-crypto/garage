import { RoundedIcon } from './RoundedIcon'
export function MobileMenuRegion({ region, onRegion }: { region: string; onRegion(): void }) {
 return <div className="unified-menu-region"><button className="unified-menu-city" type="button" onClick={onRegion} aria-label={`Ваш город: ${region}. Изменить город`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></svg><span><small>Ваш город</small><strong>{region}</strong><em>Изменить ⌄</em></span></button><a className="unified-menu-phone" href="tel:+70000000000"><RoundedIcon name="phone"/><span><small>Позвонить нам</small><strong>+7 (000) 000-00-00</strong></span></a></div>
}
