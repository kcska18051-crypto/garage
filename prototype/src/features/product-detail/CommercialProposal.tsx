import { useEffect, useState } from 'react'
import { money, productDetail, type ProductOffer } from '../../data/productDetailData'

type Props = { offer: ProductOffer; quantity: number; onClose(): void }

export function CommercialProposal({ offer, quantity, onClose }: Props) {
  const [feedback, setFeedback] = useState('')
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return <div className="product-modal" role="dialog" aria-modal="true" aria-label="Коммерческое предложение" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="proposal-modal">
      <button className="product-modal__close" type="button" aria-label="Закрыть коммерческое предложение" onClick={onClose}>×</button>
      <p className="proposal-modal__eyebrow">Предпросмотр документа</p>
      <h2>Коммерческое предложение</h2>
      <div className="proposal-modal__sheet">
        <span>ГАРАЖ · ПРОТОТИП</span>
        <h3>{productDetail.name}</h3>
        <dl><div><dt>Артикул</dt><dd>{offer.sku}</dd></div><div><dt>Вариант</dt><dd>{Object.values(offer.options).join(' · ')}</dd></div><div><dt>Количество</dt><dd>{quantity} шт.</dd></div><div><dt>Стоимость</dt><dd>{money(offer.price * quantity)}</dd></div></dl>
        <small>Условия, срок действия и реквизиты будут сформированы после подключения данных клиента.</small>
      </div>
      <div className="proposal-modal__actions"><button className="button button--dark" type="button" onClick={() => setFeedback('PDF подготовлен в демонстрационном режиме')}>Скачать PDF</button><button className="button" type="button" onClick={() => setFeedback('Отправка показана в демонстрационном режиме')}>Отправить на e-mail</button></div>
      {feedback && <p className="product-feedback" role="status">{feedback}</p>}
    </section>
  </div>
}
