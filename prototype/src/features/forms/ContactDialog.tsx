import { useEffect, useRef, useState, type FormEvent } from 'react'
import './ContactDialog.css'

export type ContactDialogMode = 'consultation' | 'callback' | 'message'

export function ContactDialog({ mode, onClose }: { mode: ContactDialogMode; onClose(): void }) {
  const [name, setName] = useState(''); const [contact, setContact] = useState(''); const [message, setMessage] = useState(''); const [reply, setReply] = useState<'phone' | 'email'>('phone'); const [consent, setConsent] = useState(false); const [submitted, setSubmitted] = useState(false); const [attempted, setAttempted] = useState(false); const [submitting, setSubmitting] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)
  const isPhoneValid = contact.replace(/\D/g, '').length >= 10
  const contactValid = mode === 'consultation' ? Boolean(contact.trim()) : reply === 'email' && mode === 'message' ? isEmailValid : isPhoneValid
  const messageValid = mode !== 'message' || Boolean(message.trim())
  const consentValid = mode !== 'message' || consent
  const title = mode === 'message' ? 'Написать сообщение' : mode === 'callback' ? 'Заказать звонок' : 'Расскажите, с чем помочь'
  useEffect(() => {
    headingRef.current?.focus(); document.body.classList.add('contact-dialog-open')
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      if (!focusable.length) return
      const first = focusable[0]; const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', key)
    return () => { document.body.classList.remove('contact-dialog-open'); window.removeEventListener('keydown', key) }
  }, [onClose])
  const submit = (event: FormEvent) => { event.preventDefault(); if (submitting) return; setAttempted(true); if (name.trim() && contactValid && messageValid && consentValid) { setSubmitting(true); setSubmitted(true) } }
  const success = mode === 'message' ? 'Сообщение сохранено в демонстрационном режиме' : mode === 'callback' ? 'Запрос звонка сохранён в демонстрационном режиме' : 'Спасибо! Ваше сообщение отправлено'
  return <div className="overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section ref={dialogRef} className="dialog contact-dialog" role="dialog" aria-modal="true" aria-label={title}><button className="dialog__close" aria-label="Закрыть форму" onClick={onClose}>×</button>{submitted ? <div className="contact-success"><span aria-hidden="true">✓</span><h2 tabIndex={-1} ref={headingRef}>Готово</h2><p role="status">{success}</p><p>Реальная отправка в прототипе не выполняется.</p><button className="button" onClick={onClose}>Закрыть</button></div> : <form onSubmit={submit} noValidate><h2 tabIndex={-1} ref={headingRef}>{title}</h2><div className="form-field"><label htmlFor="contact-name">Ваше имя</label><input id="contact-name" value={name} onChange={(event) => setName(event.target.value)} aria-describedby={attempted && !name.trim() ? 'name-error' : undefined} />{attempted && !name.trim() && <span id="name-error" className="field-error">Укажите имя</span>}</div>{mode === 'message' && <fieldset><legend>Как ответить</legend><div className="contact-dialog__reply"><label><input type="radio" name="reply" checked={reply === 'phone'} onChange={() => { setReply('phone'); setContact('') }} />Телефон</label><label><input type="radio" name="reply" checked={reply === 'email'} onChange={() => { setReply('email'); setContact('') }} />Email</label></div></fieldset>}<div className="form-field"><label htmlFor="contact-value">{mode === 'consultation' ? 'Телефон или электронная почта' : mode === 'message' && reply === 'email' ? 'Email для ответа' : 'Телефон'}</label><input id="contact-value" type={mode === 'message' && reply === 'email' ? 'email' : 'tel'} value={contact} onChange={(event) => setContact(event.target.value)} aria-describedby={attempted && !contactValid ? 'contact-error' : undefined} />{attempted && !contactValid && <span id="contact-error" className="field-error">{mode === 'message' && reply === 'email' ? 'Укажите корректный email' : 'Укажите корректный телефон'}</span>}</div>{mode === 'message' ? <><div className="form-field"><label htmlFor="contact-comment">Сообщение</label><textarea id="contact-comment" rows={4} value={message} onChange={(event) => setMessage(event.target.value)} />{attempted && !messageValid && <span className="field-error">Введите сообщение</span>}</div><label className="contact-dialog__consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />Согласен на обработку персональных данных в демонстрационном прототипе</label>{attempted && !consentValid && <span className="field-error">Подтвердите согласие</span>}</> : <div className="form-field"><label htmlFor="contact-comment">Комментарий</label><textarea id="contact-comment" rows={3} /></div>}<button className="button button--dark" type="submit" disabled={submitting}>{mode === 'message' ? 'Отправить сообщение' : 'Отправить запрос'}</button></form>}</section></div>
}
