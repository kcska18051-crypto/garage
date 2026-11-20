import {isRemovedDemoPath} from '../../app/demoNavigation'
import { useAnimatedClose } from '../../hooks/useAnimatedClose'
import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { money, productDetail, type ProductOffer } from '../../data/productDetailData'
import './CommercialProposal.css'
import { CartProductImage } from '../cart/CartProductImage'
import { regionalPhones } from '../../data/regionalPhones'
import { useCustomerFormDefaults, useCustomerField } from '../../hooks/useCustomerFormDefaults'
import { checkoutProducts } from '../../data/checkoutData'
import type { CartLine } from '../../state/CommerceState'
import { getCartPricing } from '../cart/cartPricing'

type Props = { offer?: ProductOffer; quantity?: number; lines?: CartLine[]; pricing?: ReturnType<typeof getCartPricing>; onClose(): void }

export function CommercialProposal({ offer = productDetail.offers[0], quantity = 1, lines, pricing = lines ? getCartPricing(lines) : undefined, onClose: onCloseImmediately }: Props) {
  const onClose = useAnimatedClose(onCloseImmediately, () => ref.current)
  const ref = useRef<HTMLDivElement>(null)
  const [feedback, setFeedback] = useState('')
  const [emailOpen, setEmailOpen] = useState(false)
  const customer = useCustomerFormDefaults()
  const [email, setEmail] = useCustomerField(customer.email)
  const prefix = window.location.pathname.includes('/product/') ? window.location.pathname.split('/product/')[0] : window.location.pathname.includes('/cart') ? window.location.pathname.split('/cart')[0] : '/garage'
  const productUrl = (path: string) => new URL(`${prefix}${path}`, window.location.origin).href
  const items = lines ? lines.map(line => {
    const product = checkoutProducts.find(item => item.id === line.id)
    const row = pricing?.rows.find(item => item.id === line.id)
    return { id: line.id, name: product?.name ?? 'Товар уточняется', sku: product?.sku ?? line.id, variant: product?.modification ?? '', href: productUrl(isRemovedDemoPath(product?.href??`/product/${line.id}`)?`/search?q=${encodeURIComponent(product?.name??line.id)}`:product?.href??`/product/${line.id}`), quantity: line.quantity, unitPrice: product?.price ?? 0, total: (row?.totalCents ?? 0) / 100, quote: !product || product.purchaseMode === 'quote' }
  }) : [{id:offer.id,name:productDetail.name,sku:offer.sku,variant:Object.values(offer.options).join(' · '),href:productUrl(`/product/${offer.id}`),quantity,unitPrice:offer.price,total:offer.price*quantity,quote:false}]
  const total = lines ? (pricing?.totalCents ?? 0) / 100 : offer.price * quantity
  const phone = regionalPhones[0]

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    ref.current?.querySelector<HTMLButtonElement>('button')?.focus()
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.classList.add('proposal-overlay-open')
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      document.body.classList.remove('proposal-overlay-open')
      if (opener?.isConnected) opener.focus()
    }
  }, [onClose])
  return createPortal(<div ref={ref} className="product-modal product-modal--proposal" role="dialog" aria-modal="true" aria-label="Коммерческое предложение" onKeyDown={event => { if (event.key !== 'Tab') return; const items = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled])')]; const first = items[0], last = items[items.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() } if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() } }} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="proposal-modal">
      <button className="product-modal__close" type="button" aria-label="Закрыть коммерческое предложение" onClick={onClose}>×</button>
      <p className="proposal-modal__eyebrow">Предпросмотр документа</p>
      <h2>Коммерческое предложение</h2>
      <div className="proposal-modal__sheet">
        <header className="proposal-document__header"><a href="https://www.garageshop.ru/" aria-label="Гараж — сайт магазина"><img src={`${import.meta.env.BASE_URL}style-check/garage-logo.svg`} width="150" height="46" alt="ГАРАЖ"/></a><div><a href="https://www.garageshop.ru/">www.garageshop.ru</a><a href={phone.href}>{phone.phone}</a><small>{phone.city} · магазин оборудования</small></div></header>
        <div className="proposal-document__title"><span>Подборка оборудования</span><h3>Коммерческое предложение</h3><time dateTime={new Date().toISOString().slice(0,10)}>{new Date().toLocaleDateString('ru-RU')}</time></div>
        <div className="proposal-document__intro">Оборудование для вашей задачи</div>
        <table><thead><tr><th>Товар / артикул</th><th>Кол-во</th><th>Цена за шт.</th><th>Сумма</th></tr></thead><tbody>{items.map(item=><tr key={item.id}><td><div className="proposal-document__product"><CartProductImage product={item}/><div><a href={item.href}>{item.name}</a><small>Артикул: {item.sku}</small><small>{item.variant}</small></div></div></td><td data-label="Количество">{item.quantity} шт.</td><td data-label="Цена за шт.">{item.quote?'По запросу':money(item.unitPrice)}</td><td data-label="Сумма">{item.quote?'По запросу':money(item.total)}</td></tr>)}</tbody></table>
        {pricing && pricing.promoDiscountCents > 0 && <p className="proposal-document__discount">Промокод 123 (10%): −{money(pricing.promoDiscountCents / 100)} · учтён в суммах позиций</p>}
        <div className="proposal-document__total"><span>Итого по предложению</span><strong>{items.every(item=>item.quote)?'Уточняется':money(total)}</strong></div>
        {items.some(item=>item.quote) && <p>Позиции с запросом цены не включены в сумму.</p>}
        <p className="proposal-document__terms">Наличие, комплектация, условия оплаты и доставки требуют подтверждения менеджером. Цены в прототипе демонстрационные.</p>
        <footer className="proposal-document__footer"><a href="https://www.garageshop.ru/contact/">Контакты магазинов</a><small>Носит рекомендательный характер и не является публичной офертой.</small></footer>
      </div>
      <div className="proposal-modal__actions"><button className="button button--dark" type="button" onClick={() => window.print()}>Печать / сохранить PDF</button><button className="button" type="button" onClick={() => { setEmailOpen(true); setFeedback('') }}>Отправить на e-mail</button></div>
      {emailOpen && <form className="proposal-email" onSubmit={event=>{event.preventDefault();setFeedback(`Предпросмотр письма для ${email}: документ выше будет содержимым письма. Сервис отправки не подключён.`)}}><label>Email получателя<input type="email" required autoComplete="email" value={email} onChange={event=>setEmail(event.target.value)}/></label><p>Письмо использует тот же оформленный документ, что показан выше и выводится на печать. Реальная отправка пока не подключена.</p><button className="button" type="submit">Предпросмотр письма</button></form>}
      {feedback && <p className="product-feedback" role="status">{feedback}</p>}
    </section>
  </div>, document.body)
}
