import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './ShareCartDialog.css'

export function ShareCartDialog({ url, onClose }: { url: string; onClose(): void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [feedback, setFeedback] = useState('')
  const [failed, setFailed] = useState(false)
  const [copying, setCopying] = useState(false)
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const dialog = dialogRef.current!
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (typeof dialog.showModal === 'function') dialog.showModal()
    else dialog.setAttribute('open','')
    closeRef.current?.focus()
    return () => { document.body.style.overflow = overflow; if (typeof dialog.close === 'function') dialog.close(); if (opener?.isConnected) opener.focus() }
  }, [])
  const copy = async () => {
    setCopying(true); setFeedback(''); setFailed(false)
    try { await navigator.clipboard.writeText(url); setFeedback('Ссылка скопирована') }
    catch { setFailed(true); setFeedback('Не удалось скопировать. Скопируйте выделенную ссылку вручную.'); inputRef.current?.focus(); inputRef.current?.select() }
    finally { setCopying(false) }
  }
  return createPortal(<dialog ref={dialogRef} className="share-cart-dialog" aria-labelledby="share-cart-title" aria-modal="true" onCancel={event => { event.preventDefault(); onClose() }} onKeyDown={event => {
    if (event.key === 'Escape') { event.preventDefault(); onClose(); return }
    if (event.key !== 'Tab') return
    const items = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), input, a[href]')]
    const first = items[0], last = items[items.length-1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }}>
    <header><h2 id="share-cart-title">Поделиться корзиной</h2><button ref={closeRef} className="share-cart-dialog__close" type="button" aria-label="Закрыть окно передачи корзины" onClick={onClose}>×</button></header>
    <p>Поделитесь выбранными товарами. Личные данные не передаются.</p>
    <label htmlFor="shared-cart-link">Ссылка на корзину<input ref={inputRef} id="shared-cart-link" type="url" readOnly spellCheck={false} value={url} onFocus={event => event.currentTarget.select()}/></label>
    <div className="share-cart-dialog__actions"><button type="button" disabled={copying} onClick={copy}>{copying ? 'Копируем…' : 'Копировать ссылку'}</button><a href={url} target="_blank" rel="noreferrer">Открыть общую корзину ↗</a></div>
    {feedback && <p className="share-cart-dialog__feedback" role={failed ? 'alert' : 'status'}>{feedback}</p>}
  </dialog>,document.body)
}
