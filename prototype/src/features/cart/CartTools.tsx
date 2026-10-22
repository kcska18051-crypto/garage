import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkoutProducts, money } from '../../data/checkoutData'
import { type CartLine, useCommerce } from '../../state/CommerceState'
import { CommercialProposal } from '../product-detail/CommercialProposal'
import { CartDialog as ProfileDialog } from './CartDialog'
import { getCartPricing } from './cartPricing'
import { decodeCart, encodeCart } from '../../data/sharedCartData'
import { formatAvailability } from '../../utils/availability'
import { ShareCartDialog } from './ShareCartDialog'
export { decodeCart } from '../../data/sharedCartData'
export function SharedCart({ encoded }: { encoded: string }) {
  const lines = decodeCart(encoded); const { importCart } = useCommerce(); const navigate = useNavigate()
  return <section className="shared-cart"><h1>Вам поделились корзиной</h1><p>Просмотрите состав. Позиции добавятся к вашей корзине после подтверждения.</p>{lines.length ? <><ul>{lines.map(line => <li key={line.id}>{checkoutProducts.find(p => p.id === line.id)?.name} — {line.quantity} шт.{Object.entries(line.optionParents ?? {}).map(([id,count]) => <p key={id}>Опция для {checkoutProducts.find(p=>p.id===id)?.sku} · {count} шт.</p>)}<p>{(() => { const product = checkoutProducts.find(p=>p.id===line.id)!; return formatAvailability(product.availabilityStatus,product.storeCount) })()}</p></li>)}</ul><button className="button" onClick={() => { importCart(lines); navigate('/cart', { replace: true }) }}>Добавить в мою корзину</button></> : <p role="alert">Ссылка повреждена или не содержит доступных товаров.</p>}</section>
}
export function CartTools({ lines, placement = 'summary' }: { lines: CartLine[]; placement?: 'summary'|'toolbar' }) {
  const { checkout } = useCommerce()
  const [tool, setTool] = useState<'proposal'|'credit'|'share'|null>(null); const [message, setMessage] = useState(''); const [success, setSuccess] = useState(false)
  const pricing = getCartPricing(lines, checkout.promoCode)
  const total = pricing.totalCents / 100
  const url = new URL(window.location.href); url.search = ''; url.hash = ''; url.searchParams.set('shared', encodeCart(lines))
  const actions = placement === 'toolbar' ? [['share','Поделиться корзиной']] : [['proposal','Коммерческое предложение'],['credit','Купить в кредит']]
  return <div className={`cart-tools${placement === 'toolbar' ? ' cart-tools--toolbar' : ''}`}><div>{actions.map(([key,label]) => <button key={key} type="button" onClick={() => { setMessage(''); setSuccess(false); if(!lines.length) setMessage('Выберите хотя бы один товар'); else if(key === 'credit' && !pricing.currentCents) setMessage('Для кредита нужна подтверждённая стоимость товаров'); else setTool(key as typeof tool) }}>{key === 'share' && <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="6" cy="12" r="3"/><circle cx="18" cy="5" r="3"/><circle cx="18" cy="19" r="3"/><path d="m9 10 6-4M9 14l6 4"/></svg>}{label}</button>)}</div>{message && <p role="status">{message}</p>}
    {tool === 'proposal' && <CommercialProposal lines={lines} pricing={pricing} onClose={() => setTool(null)} />}
    {tool === 'share' && <ShareCartDialog url={url.href} onClose={() => setTool(null)}/>}
    {tool === 'credit' && <ProfileDialog title="Купить в кредит" onClose={() => setTool(null)}>{success ? <p role="status">Демонстрационная заявка подготовлена. В банк ничего не отправлено.</p> : <form className="profile-form" onSubmit={e => { e.preventDefault(); setSuccess(true) }}><p>Сумма выбранных товаров: <strong>{money(total)}</strong>. Условия и решение банка в прототипе не рассчитываются.</p><label>Имя<input required name="name" minLength={2}/></label><label>Телефон<input required name="phone" type="tel" pattern="[+0-9() -]{10,20}"/></label><label><input type="checkbox" required/>Понимаю, что это демонстрация без обращения в банк</label><button type="submit">Подготовить заявку</button></form>}</ProfileDialog>}
  </div>
}
