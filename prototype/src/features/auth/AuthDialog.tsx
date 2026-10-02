import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { AuthIntent } from '../../state/AuthState'
import './AuthDialog.css'

type Screen = 'login' | 'login-code' | 'forgot' | 'recovery-phone' | 'recovery-code' | 'recovery-password' | 'register' | 'register-code' | 'existing' | 'organization' | 'password-choice'
type Mode = 'login' | 'register'
type Method = 'sms' | 'password'

const digits = (value: string) => value.replace(/\D/g, '')
const isExistingPhone = (value: string) => digits(value) === '79000000000'

export function AuthDialog({ intent, onClose, onComplete }: { intent: AuthIntent; onClose(): void; onComplete(message: string): void }) {
  const navigate = useNavigate()
  const dialogRef = useRef<HTMLElement>(null)
  const [mode, setMode] = useState<Mode>(intent === 'register' ? 'register' : 'login')
  const [method, setMethod] = useState<Method>('sms')
  const [screen, setScreen] = useState<Screen>(intent === 'recovery' ? 'forgot' : intent === 'register' ? 'register' : 'login')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [personalConsent, setPersonalConsent] = useState(false)
  const [termsConsent, setTermsConsent] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [company, setCompany] = useState(false)
  const [inn, setInn] = useState('')
  const [organizationFound, setOrganizationFound] = useState(false)
  const [timer, setTimer] = useState(0)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    document.body.classList.add('auth-dialog-open')
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')]
      if (!focusable.length) return
      const first = focusable[0]; const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => { document.body.classList.remove('auth-dialog-open'); window.removeEventListener('keydown', onKeyDown) }
  }, [onClose])

  useEffect(() => {
    if (timer <= 0) return
    const id = window.setInterval(() => setTimer((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(id)
  }, [timer > 0])

  const clearFeedback = () => { setError(''); setStatus('') }
  const showMode = (next: Mode) => {
    setMode(next); setScreen(next === 'login' ? 'login' : 'register'); clearFeedback(); setPassword(''); setRepeatPassword('')
  }
  const startCode = (next: Screen) => { setCode(''); setTimer(30); clearFeedback(); setScreen(next) }
  const validatePhone = () => phone.trim() ? true : (setError('Введите номер телефона'), false)
  const verifyCode = (success: () => void) => {
    if (code === '1234') { clearFeedback(); success(); return }
    if (code === '0000') { setTimer(0); setError('Код истёк. Отправьте новый код.'); return }
    setError('Неверный код. Проверьте цифры и попробуйте ещё раз.')
  }
  const resend = () => { setCode(''); setTimer(30); setError(''); setStatus('Новый код отправлен. Повторная отправка будет доступна через 00:30.') }
  const toHelp = () => { onClose(); navigate('/profile/help') }
  const back = () => {
    clearFeedback(); setPassword(''); setRepeatPassword('')
    if (screen === 'login-code') setScreen('login')
    else if (screen === 'register-code') setScreen('register')
    else if (screen === 'organization') setScreen('register-code')
    else if (screen === 'password-choice') setScreen(company ? 'organization' : 'register-code')
    else if (screen === 'recovery-code') setScreen('recovery-phone')
    else if (screen === 'recovery-password') setScreen('recovery-code')
    else if (screen === 'forgot') { setMethod('password'); setScreen('login') }
  }

  const submitLogin = (event: FormEvent) => {
    event.preventDefault(); clearFeedback()
    if (!validatePhone()) return
    if (method === 'sms') { startCode('login-code'); return }
    if (password !== 'garage123') { setError('Неверный телефон или пароль'); return }
    onComplete('Вы вошли в демонстрационный профиль')
  }
  const submitRegistration = (event: FormEvent) => {
    event.preventDefault(); clearFeedback()
    if (!name.trim()) return setError('Введите имя')
    if (!validatePhone()) return
    if (!personalConsent || !termsConsent) return setError('Подтвердите обязательные согласия')
    startCode('register-code')
  }
  const submitRecoveryPhone = (event: FormEvent) => { event.preventDefault(); clearFeedback(); if (validatePhone()) startCode('recovery-code') }
  const saveRecoveredPassword = (event: FormEvent) => {
    event.preventDefault(); clearFeedback()
    if (password.length < 6) return setError('Пароль должен содержать не менее 6 символов')
    if (password !== repeatPassword) return setError('Пароли не совпадают')
    onComplete('Пароль обновлён, вход выполнен')
  }
  const finishRegistration = () => onComplete(company ? 'Компания подключена, регистрация завершена' : 'Регистрация завершена')
  const setOptionalPassword = (event: FormEvent) => {
    event.preventDefault(); clearFeedback()
    if (password.length < 6) return setError('Пароль должен содержать не менее 6 символов')
    if (password !== repeatPassword) return setError('Пароли не совпадают')
    finishRegistration()
  }

  const codeForm = (title: string, action: string, onVerify: () => void) => <form className="auth-form" onSubmit={(event) => { event.preventDefault(); verifyCode(onVerify) }}>
    <div><h2>{title}</h2><p>Код отправлен на {phone || 'указанный номер'}. Для демонстрации используйте 1234.</p></div>
    <label>Код подтверждения<input autoFocus value={code} onChange={(event) => setCode(digits(event.target.value).slice(0, 4))} inputMode="numeric" autoComplete="one-time-code" /></label>
    <p className="auth-timer">{timer > 0 ? `Отправить повторно через 00:${String(timer).padStart(2, '0')}` : 'Код можно отправить повторно'}</p>
    {error && <p className="auth-message auth-message--error" role="alert">{error}</p>}{status && <p className="auth-message" role="status">{status}</p>}
    <button className="profile-button profile-button--primary" type="submit">{action}</button>
    <button className="profile-button" type="button" disabled={timer > 0} onClick={resend}>Отправить код повторно</button>
    <button className="auth-link" type="button" onClick={back}>← Назад</button>
    <button className="auth-link" type="button" onClick={toHelp}>Нет доступа к телефону</button>
  </form>

  return <div className="auth-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section ref={dialogRef} className="auth-dialog" role="dialog" aria-modal="true" aria-label="Вход и регистрация">
      <header className="auth-dialog__header"><div><span>Личный кабинет</span><strong>ГАРАЖ</strong></div><button autoFocus type="button" aria-label="Закрыть" onClick={onClose}>×</button></header>
      <div className="auth-tabs" role="tablist" aria-label="Авторизация"><button role="tab" aria-selected={mode === 'login'} onClick={() => showMode('login')}>Вход</button><button role="tab" aria-selected={mode === 'register'} onClick={() => showMode('register')}>Регистрация</button></div>
      <div className="auth-dialog__body">
        {screen === 'login' && <form className="auth-form" onSubmit={submitLogin}>
          <div><h2>Войдите в профиль</h2><p>Заказы, документы и адреса будут доступны после входа.</p></div>
          <div className="auth-methods" role="group" aria-label="Способ входа"><button type="button" aria-pressed={method === 'sms'} onClick={() => { setMethod('sms'); clearFeedback(); setPassword('') }}>По SMS</button><button type="button" aria-pressed={method === 'password'} onClick={() => { setMethod('password'); clearFeedback(); setPassword('') }}>По паролю</button></div>
          <label>Номер телефона<input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" placeholder="+7 900 000-00-00" /></label>
          {method === 'password' && <label>Пароль<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>}
          {error && <p className="auth-message auth-message--error" role="alert">{error}</p>}
          <button className="profile-button profile-button--primary" type="submit">{method === 'sms' ? 'Получить код' : 'Войти'}</button>
          {method === 'password' && <button className="auth-link" type="button" onClick={() => { clearFeedback(); setPassword(''); setScreen('forgot') }}>Забыли пароль?</button>}
        </form>}
        {screen === 'login-code' && codeForm('Введите код из SMS', 'Войти', () => onComplete('Вы вошли в демонстрационный профиль'))}
        {screen === 'forgot' && <div className="auth-form"><div><h2>Восстановление доступа</h2><p>Можно войти по SMS без смены пароля или создать новый пароль.</p></div><button className="profile-button profile-button--primary" type="button" onClick={() => { setMethod('sms'); if (phone.trim()) startCode('login-code'); else { clearFeedback(); setScreen('login') } }}>Войти по SMS</button><button className="profile-button" type="button" onClick={() => { clearFeedback(); setScreen('recovery-phone') }}>Восстановить пароль</button><button className="auth-link" type="button" onClick={toHelp}>Нет доступа к телефону</button><button className="auth-link" type="button" onClick={back}>← Вернуться ко входу</button></div>}
        {screen === 'recovery-phone' && <form className="auth-form" onSubmit={submitRecoveryPhone}><div><h2>Подтвердите телефон</h2><p>Не сообщаем, зарегистрирован ли номер, до проверки кода.</p></div><label>Номер телефона<input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" /></label>{error && <p className="auth-message auth-message--error" role="alert">{error}</p>}<button className="profile-button profile-button--primary" type="submit">Получить код</button><button className="auth-link" type="button" onClick={back}>← Назад</button><button className="auth-link" type="button" onClick={toHelp}>Нет доступа к телефону</button></form>}
        {screen === 'recovery-code' && codeForm('Подтвердите восстановление', 'Подтвердить', () => { setPassword(''); setRepeatPassword(''); setScreen('recovery-password') })}
        {screen === 'recovery-password' && <form className="auth-form" onSubmit={saveRecoveredPassword}><div><h2>Создайте новый пароль</h2><p>В рабочей системе пароль будет безопасно обработан сервером.</p></div><label>Новый пароль<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" /></label><label>Повторите пароль<input type="password" value={repeatPassword} onChange={(event) => setRepeatPassword(event.target.value)} autoComplete="new-password" /></label>{error && <p className="auth-message auth-message--error" role="alert">{error}</p>}<button className="profile-button profile-button--primary" type="submit">Сохранить пароль и войти</button><button className="auth-link" type="button" onClick={back}>← Назад</button></form>}
        {screen === 'register' && <form className="auth-form" onSubmit={submitRegistration}><div><h2>Создайте профиль</h2><p>Поля сохранятся при возврате на этот шаг.</p></div><label>Имя<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="given-name" /></label><label>Номер телефона<input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" /></label><label className="profile-check"><input type="checkbox" checked={company} onChange={(event) => setCompany(event.target.checked)} />Для компании</label><label className="profile-check"><input type="checkbox" checked={personalConsent} onChange={(event) => setPersonalConsent(event.target.checked)} />Согласен на обработку персональных данных</label><label className="profile-check"><input type="checkbox" checked={termsConsent} onChange={(event) => setTermsConsent(event.target.checked)} />Принимаю условия сервиса</label><label className="profile-check"><input type="checkbox" checked={marketingConsent} onChange={(event) => setMarketingConsent(event.target.checked)} />Получать рекламные сообщения — необязательно</label>{error && <p className="auth-message auth-message--error" role="alert">{error}</p>}<button className="profile-button profile-button--primary" type="submit">Продолжить</button></form>}
        {screen === 'register-code' && codeForm('Подтвердите номер телефона', 'Подтвердить', () => isExistingPhone(phone) ? setScreen('existing') : company ? setScreen('organization') : setScreen('password-choice'))}
        {screen === 'existing' && <div className="auth-form"><div><h2>Аккаунт уже существует</h2><p>После подтверждения номера выберите удобный способ входа.</p></div><button className="profile-button profile-button--primary" type="button" onClick={() => startCode('login-code')}>Войти по SMS</button><button className="profile-button" type="button" onClick={() => { setMethod('password'); setScreen('login') }}>Войти по паролю</button></div>}
        {screen === 'organization' && <div className="auth-form"><div><h2>Подключите организацию</h2><p>Поиск по ИНН демонстрационный, без внешней интеграции.</p></div><label>ИНН организации<input value={inn} onChange={(event) => { setInn(digits(event.target.value).slice(0, 12)); setOrganizationFound(false) }} inputMode="numeric" /></label><button className="profile-button" type="button" onClick={() => { clearFeedback(); if (inn === '7600000028') setOrganizationFound(true); else setError('Организация не найдена в демонстрационных данных') }}>Найти организацию</button>{organizationFound && <article className="auth-organization"><strong>ООО «Гараж Профи»</strong><span>ИНН 7600000028 · данные демонстрационные</span></article>}{error && <p className="auth-message auth-message--error" role="alert">{error}</p>}<button className="profile-button profile-button--primary" type="button" disabled={!organizationFound} onClick={() => setScreen('password-choice')}>Подключить организацию</button><button className="auth-link" type="button" onClick={back}>← Назад</button></div>}
        {screen === 'password-choice' && <form className="auth-form" onSubmit={setOptionalPassword}><div><h2>Создайте пароль — по желанию</h2><p>Можно использовать вход по SMS и установить пароль позже.</p></div><label>Новый пароль<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" /></label><label>Повторите пароль<input type="password" value={repeatPassword} onChange={(event) => setRepeatPassword(event.target.value)} autoComplete="new-password" /></label>{error && <p className="auth-message auth-message--error" role="alert">{error}</p>}<button className="profile-button profile-button--primary" type="submit">Установить пароль</button><button className="profile-button" type="button" onClick={finishRegistration}>Продолжить без пароля</button><button className="auth-link" type="button" onClick={back}>← Назад</button></form>}
      </div>
      <footer className="auth-dialog__footer">Демонстрационный интерфейс: SMS и серверная безопасность не подключены.</footer>
    </section>
  </div>
}
