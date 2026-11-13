import { useAnimatedClose } from '../../hooks/useAnimatedClose'
import { useEffect, useRef, type ReactNode } from 'react'

export function ProfileDialog({ title, children, onClose: dismiss }: { title: string; children: ReactNode; onClose(): void }) {
  const panel = useRef<HTMLElement>(null)
  const onClose = useAnimatedClose(dismiss, () => panel.current)
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLElement>('button,input,a[href]')?.focus()
    return () => { document.body.style.overflow = overflow; if(opener?.isConnected) opener.focus() }
  }, [])
  return <div className="profile-dialog-backdrop" onMouseDown={event => { if(event.target === event.currentTarget) onClose() }}><section ref={panel} className="profile-dialog approved-dialog" role="dialog" aria-modal="true" aria-label={title} onKeyDown={event => {
    if(event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); return }
    if(event.key !== 'Tab') return
    const items = [...panel.current!.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href]')]
    const first = items[0], last = items.at(-1)
    if(event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
    else if(!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }}><div className="profile-dialog__heading"><h2>{title}</h2><button className="approved-dialog__close" type="button" aria-label="Закрыть диалог" onClick={onClose}>×</button></div>{children}</section></div>
}
