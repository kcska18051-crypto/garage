import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export function CartDialog({ title, children, onClose }: { title: string; children: ReactNode; onClose(): void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const dialog = ref.current!, overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '')
    dialog.querySelector<HTMLButtonElement>('button')?.focus()
    return () => { document.body.style.overflow = overflow; if (typeof dialog.close === 'function') dialog.close(); if (opener?.isConnected) opener.focus() }
  }, [])
  return createPortal(<dialog ref={ref} className="cart-dialog" aria-label={title} onCancel={event => { event.preventDefault(); onClose() }} onKeyDown={event => {
    if (event.key === 'Escape') { event.preventDefault(); onClose() }
    if (event.key !== 'Tab') return
    const items = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),a[href]')]
    const first = items[0], last = items[items.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }}><header><h2>{title}</h2><button type="button" aria-label="Закрыть диалог" onClick={onClose}>×</button></header>{children}</dialog>, document.body)
}
