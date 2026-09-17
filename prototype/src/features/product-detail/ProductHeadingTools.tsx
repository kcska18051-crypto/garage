import { useEffect, useRef, useState, type ReactNode } from 'react'

type Props = {
  sku: string
  favorite: boolean
  compared: boolean
  onToggleFavorite: () => void
  onToggleCompare: () => void
  productPath: string
  children: ReactNode
}

export function ProductHeadingTools({ sku, favorite, compared, onToggleFavorite, onToggleCompare, productPath, children }: Props) {
  const [feedback, setFeedback] = useState('')
  const [shareOpen, setShareOpen] = useState(false)
  const shareRoot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!shareOpen) return
    const closeOnPointer = (event: PointerEvent) => {
      if (!shareRoot.current?.contains(event.target as Node)) setShareOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShareOpen(false)
    }
    document.addEventListener('pointerdown', closeOnPointer)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnPointer)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [shareOpen])

  const copy = async (value: string, message: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setFeedback(message)
    } catch {
      setFeedback('Не удалось скопировать')
    }
  }
  const shareUrl = window.location.pathname.includes('/product/')
    ? window.location.href
    : new URL(productPath, window.location.origin).href

  return <>
    <div className="product-heading__bar">
      <div className="product-heading__meta">
        <button className="product-sku-copy" type="button" aria-label={`Скопировать артикул ${sku}`} title="Скопировать артикул" onClick={() => copy(sku, 'Артикул скопирован')}>
          <span>Артикул {sku}</span><span aria-hidden="true">⧉</span>
        </button>
        {children}
      </div>
      <div className="product-heading__actions">
        <button type="button" title="В избранное" aria-label="В избранное" aria-pressed={favorite} onClick={onToggleFavorite}><span aria-hidden="true">♡</span></button>
        <button type="button" title="Сравнить" aria-label="Сравнить" aria-pressed={compared} onClick={onToggleCompare}><span aria-hidden="true">≡</span></button>
        <div className="product-share" ref={shareRoot}>
          <button type="button" title="Поделиться" aria-label="Поделиться" aria-expanded={shareOpen} aria-haspopup="menu" onClick={() => setShareOpen((open) => !open)}><span aria-hidden="true">↗</span></button>
          {shareOpen && <div className="product-share__menu" role="menu" aria-label="Способы поделиться">
            <button type="button" role="menuitem" onClick={() => { void copy(shareUrl, 'Ссылка на товар скопирована'); setShareOpen(false) }}>Скопировать ссылку</button>
            <button type="button" role="menuitem" onClick={() => { setFeedback('Отправка в Telegram показана в демонстрационном режиме'); setShareOpen(false) }}>Отправить в Telegram</button>
            <button type="button" role="menuitem" onClick={() => { setFeedback('Отправка в WhatsApp показана в демонстрационном режиме'); setShareOpen(false) }}>Отправить в WhatsApp</button>
          </div>}
        </div>
      </div>
    </div>
    {feedback && <p className="product-heading__feedback" role="status">{feedback}</p>}
  </>
}
