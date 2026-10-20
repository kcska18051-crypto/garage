import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { money, productDetail, type ProductOffer } from '../../data/productDetailData'
import './CommercialProposal.css'
import { checkoutProducts } from '../../data/checkoutData'
import type { CartLine } from '../../state/CommerceState'

type Props = { offer?: ProductOffer; quantity?: number; lines?: CartLine[]; onClose(): void }

export function CommercialProposal({ offer = productDetail.offers[0], quantity = 1, lines, onClose }: Props) {
  const [feedback, setFeedback] = useState('')
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.classList.add('proposal-overlay-open')
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      document.body.classList.remove('proposal-overlay-open')
    }
  }, [onClose])
  return createPortal(<div className="product-modal product-modal--proposal" role="dialog" aria-modal="true" aria-label="Коммерческое предложение" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="proposal-modal">
      <button className="product-modal__close" type="button" aria-label="Закрыть коммерческое предложение" onClick={onClose}>×</button>
      <p className="proposal-modal__eyebrow">Предпросмотр документа</p>
      <h2>Коммерческое предложение</h2>
      <div className="proposal-modal__sheet">
        <span>ГАРАЖ · ПРОТОТИП</span>
        {lines ? <><table><thead><tr><th>Товар / артикул</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr></thead><tbody>{lines.map(line => { const p = checkoutProducts.find(p => p.id === line.id); return <tr key={line.id}><td>{p?.name} / {p?.sku}</td><td>{line.quantity}</td><td>{money(p?.price ?? 0)}</td><td>{money((p?.price ?? 0)*line.quantity)}</td></tr> })}</tbody></table><strong>Итого: {money(lines.reduce((sum,line) => sum+(checkoutProducts.find(p => p.id === line.id)?.price ?? 0)*line.quantity,0))}</strong></> : <><h3>{productDetail.name}</h3><dl><div><dt>Артикул</dt><dd>{offer.sku}</dd></div><div><dt>Вариант</dt><dd>{Object.values(offer.options).join(' · ')}</dd></div><div><dt>Количество</dt><dd>{quantity} шт.</dd></div><div><dt>Стоимость</dt><dd>{money(offer.price * quantity)}</dd></div></dl></>}
        <small>Условия, срок действия и реквизиты будут сформированы после подключения данных клиента.</small>
      </div>
      <div className="proposal-modal__actions"><button className="button button--dark" type="button" onClick={() => window.print()}>Печать / сохранить PDF</button><button className="button" type="button" onClick={() => setFeedback('Отправка показана в демонстрационном режиме')}>Отправить на e-mail</button></div>
      {feedback && <p className="product-feedback" role="status">{feedback}</p>}
    </section>
  </div>, document.body)
}
