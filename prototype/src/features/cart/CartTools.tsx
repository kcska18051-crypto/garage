import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkoutProducts, money } from '../../data/checkoutData'
import { type CartLine, useCommerce } from '../../state/CommerceState'
import { CommercialProposal } from '../product-detail/CommercialProposal'
import { ProfileDialog } from '../profile/ProfileDialog'
const allowed = new Set(checkoutProducts.map(p => p.id))
export function decodeCart(value: string): CartLine[] { try { const data = JSON.parse(atob(value)); if (!Array.isArray(data) || data.length > 100) return []; return data.filter((p: unknown): p is CartLine => !!p && typeof p === 'object' && 'id' in p && 'quantity' in p && typeof p.id === 'string' && allowed.has(p.id) && Number.isInteger(p.quantity) && Number(p.quantity) > 0 && Number(p.quantity) <= 999).map(p => ({ id: p.id, quantity: p.quantity })) } catch { return [] } }
export function SharedCart({ encoded }: { encoded: string }) {
  const lines = decodeCart(encoded); const { addToCart } = useCommerce(); const navigate = useNavigate()
  return <section className="shared-cart"><h1>Вам поделились корзиной</h1><p>Просмотрите состав. Позиции добавятся к вашей корзине после подтверждения.</p>{lines.length ? <><ul>{lines.map(line => <li key={line.id}>{checkoutProducts.find(p => p.id === line.id)?.name} — {line.quantity} шт.</li>)}</ul><button className="button" onClick={() => { lines.forEach(line => addToCart(line.id, line.quantity)); navigate('/cart', { replace: true }) }}>Добавить в мою корзину</button></> : <p role="alert">Ссылка повреждена или не содержит доступных товаров.</p>}</section>
}
export function CartTools({ lines }: { lines: CartLine[] }) {
  const [tool, setTool] = useState<'proposal'|'credit'|'share'|null>(null); const [message, setMessage] = useState(''); const [success, setSuccess] = useState(false)
  const total = lines.reduce((sum,line) => sum + (checkoutProducts.find(p => p.id === line.id)?.price ?? 0) * line.quantity,0)
  const url = new URL(window.location.href); url.search = ''; url.hash = ''; url.searchParams.set('shared', btoa(JSON.stringify(lines.map(({id,quantity}) => ({id,quantity})))))
  return <div className="cart-tools"><div>{[['proposal','Коммерческое предложение'],['credit','Купить в кредит'],['share','Поделиться корзиной']].map(([key,label]) => <button key={key} type="button" onClick={() => { setMessage(''); setSuccess(false); if(!lines.length) setMessage('Выберите хотя бы один товар'); else setTool(key as typeof tool) }}>{label}</button>)}</div>{message && <p role="status">{message}</p>}
    {tool === 'proposal' && <CommercialProposal lines={lines} onClose={() => setTool(null)} />}
    {tool === 'share' && <ProfileDialog title="Поделиться корзиной" onClose={() => setTool(null)}><p>Ссылка содержит только товары и количества.</p><label>Ссылка на корзину<input aria-label="Ссылка на корзину" readOnly value={url.href}/></label><button onClick={async () => { try { await navigator.clipboard.writeText(url.href); setMessage('Ссылка скопирована') } catch { setMessage('Выделите и скопируйте ссылку вручную') } }}>Копировать ссылку</button><a href={url.href} target="_blank" rel="noreferrer">Открыть общую корзину ↗</a>{message && <p role="status">{message}</p>}</ProfileDialog>}
    {tool === 'credit' && <ProfileDialog title="Купить в кредит" onClose={() => setTool(null)}>{success ? <p role="status">Демонстрационная заявка подготовлена. В банк ничего не отправлено.</p> : <form className="profile-form" onSubmit={e => { e.preventDefault(); setSuccess(true) }}><p>Сумма выбранных товаров: <strong>{money(total)}</strong>. Условия и решение банка в прототипе не рассчитываются.</p><label>Имя<input required name="name" minLength={2}/></label><label>Телефон<input required name="phone" type="tel" pattern="[+0-9() -]{10,20}"/></label><label><input type="checkbox" required/>Понимаю, что это демонстрация без обращения в банк</label><button type="submit">Подготовить заявку</button></form>}</ProfileDialog>}
  </div>
}
