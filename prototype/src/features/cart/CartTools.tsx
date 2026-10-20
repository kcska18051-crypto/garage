import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkoutProducts, money } from '../../data/checkoutData'
import { type CartLine, useCommerce } from '../../state/CommerceState'
import { CommercialProposal } from '../product-detail/CommercialProposal'
import { ProfileDialog } from '../profile/ProfileDialog'
import { decodeCart, encodeCart } from '../../data/sharedCartData'
import { formatAvailability } from '../../utils/availability'
export { decodeCart } from '../../data/sharedCartData'
export function SharedCart({ encoded }: { encoded: string }) {
  const lines = decodeCart(encoded); const { importCart } = useCommerce(); const navigate = useNavigate()
  return <section className="shared-cart"><h1>Вам поделились корзиной</h1><p>Просмотрите состав. Позиции добавятся к вашей корзине после подтверждения.</p>{lines.length ? <><ul>{lines.map(line => <li key={line.id}>{checkoutProducts.find(p => p.id === line.id)?.name} — {line.quantity} шт.{Object.entries(line.optionParents ?? {}).map(([id,count]) => <p key={id}>Опция для {checkoutProducts.find(p=>p.id===id)?.sku} · {count} шт.</p>)}<p>{(() => { const product = checkoutProducts.find(p=>p.id===line.id)!; return formatAvailability(product.availabilityStatus,product.storeCount) })()}</p></li>)}</ul><button className="button" onClick={() => { importCart(lines); navigate('/cart', { replace: true }) }}>Добавить в мою корзину</button></> : <p role="alert">Ссылка повреждена или не содержит доступных товаров.</p>}</section>
}
export function CartTools({ lines }: { lines: CartLine[] }) {
  const [tool, setTool] = useState<'proposal'|'credit'|'share'|null>(null); const [message, setMessage] = useState(''); const [success, setSuccess] = useState(false)
  const total = lines.reduce((sum,line) => sum + (checkoutProducts.find(p => p.id === line.id)?.price ?? 0) * line.quantity,0)
  const url = new URL(window.location.href); url.search = ''; url.hash = ''; url.searchParams.set('shared', encodeCart(lines))
  return <div className="cart-tools"><div>{[['proposal','Коммерческое предложение'],['credit','Купить в кредит'],['share','Поделиться корзиной']].map(([key,label]) => <button key={key} type="button" onClick={() => { setMessage(''); setSuccess(false); if(!lines.length) setMessage('Выберите хотя бы один товар'); else setTool(key as typeof tool) }}>{label}</button>)}</div>{message && <p role="status">{message}</p>}
    {tool === 'proposal' && <CommercialProposal lines={lines} onClose={() => setTool(null)} />}
    {tool === 'share' && <ProfileDialog title="Поделиться корзиной" onClose={() => setTool(null)}><p>Ссылка содержит товары, количества и связи опций с вариантами оборудования. Персональных данных в ней нет.</p><label>Ссылка на корзину<input aria-label="Ссылка на корзину" readOnly value={url.href}/></label><button onClick={async () => { try { await navigator.clipboard.writeText(url.href); setMessage('Ссылка скопирована') } catch { setMessage('Выделите и скопируйте ссылку вручную') } }}>Копировать ссылку</button><a href={url.href} target="_blank" rel="noreferrer">Открыть общую корзину ↗</a>{message && <p role="status">{message}</p>}</ProfileDialog>}
    {tool === 'credit' && <ProfileDialog title="Купить в кредит" onClose={() => setTool(null)}>{success ? <p role="status">Демонстрационная заявка подготовлена. В банк ничего не отправлено.</p> : <form className="profile-form" onSubmit={e => { e.preventDefault(); setSuccess(true) }}><p>Сумма выбранных товаров: <strong>{money(total)}</strong>. Условия и решение банка в прототипе не рассчитываются.</p><label>Имя<input required name="name" minLength={2}/></label><label>Телефон<input required name="phone" type="tel" pattern="[+0-9() -]{10,20}"/></label><label><input type="checkbox" required/>Понимаю, что это демонстрация без обращения в банк</label><button type="submit">Подготовить заявку</button></form>}</ProfileDialog>}
  </div>
}
