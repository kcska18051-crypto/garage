import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

type Stage = 'phone' | 'code' | 'success'

export function ProfileAuth() {
  const [stage, setStage] = useState<Stage>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [personalConsent, setPersonalConsent] = useState(false)
  const [messagesConsent, setMessagesConsent] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  const requestCode = (event: FormEvent) => {
    event.preventDefault()
    if (!phone.trim()) return setError('Введите номер телефона')
    if (!personalConsent) return setError('Подтвердите согласие на обработку персональных данных')
    setError(''); setStatus(''); setStage('code')
  }
  const verify = (event: FormEvent) => {
    event.preventDefault()
    if (code === '1234') { setError(''); setStage('success'); return }
    setError(code === '0000' ? 'Код истёк. Запросите новый код.' : 'Неверный код. Проверьте цифры и попробуйте ещё раз.')
  }
  const resend = () => { setCode(''); setError(''); setStatus('Новый код отправлен. Таймер запущен повторно.') }

  return <div className="profile-section profile-auth">
    <header className="profile-section__heading"><h1>Войти / Зарегистрироваться</h1></header>
    <div className="profile-auth__layout">
      <div className="profile-panel profile-auth__card">
        {stage === 'phone' && <form className="profile-form" onSubmit={requestCode}>
          <div><span className="profile-step">Шаг 1 из 2</span><h2>Подтвердите номер телефона</h2><p>Номер станет идентификатором учётной записи. Будущий способ повторного входа пока уточняется.</p></div>
          <label>Номер телефона<input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+7 900 000-00-00" inputMode="tel" /></label>
          <label className="profile-check"><input type="checkbox" checked={personalConsent} onChange={(event) => setPersonalConsent(event.target.checked)} /><span>Согласен на обработку персональных данных</span></label>
          <label className="profile-check"><input type="checkbox" checked={messagesConsent} onChange={(event) => setMessagesConsent(event.target.checked)} /><span>Согласен получать информационные и рекламные сообщения</span></label>
          {error && <p className="profile-message profile-message--error" role="alert">{error}</p>}
          <button className="profile-button profile-button--primary" type="submit">Получить код</button>
        </form>}
        {stage === 'code' && <form className="profile-form" onSubmit={verify}>
          <div><span className="profile-step">Шаг 2 из 2</span><h2>Введите код из SMS</h2><p>Код отправлен на {phone}. Для демонстрации используйте 1234.</p></div>
          <label>Код подтверждения<input value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" autoComplete="one-time-code" /></label>
          <small>Отправить повторно через 00:30</small>
          {error && <p className="profile-message profile-message--error" role="alert">{error}</p>}
          {status && <p className="profile-message profile-message--success" role="status">{status}</p>}
          <div className="profile-actions"><button className="profile-button profile-button--primary" type="submit">Подтвердить</button><button className="profile-button" type="button" onClick={resend}>Отправить код повторно</button></div>
        </form>}
        {stage === 'success' && <div className="profile-success" role="status"><span aria-hidden="true">✓</span><h2>Номер подтверждён</h2><p>Демонстрационная учётная запись создана и привязана к {phone}.</p><Link className="profile-button profile-button--primary" to="/profile">Перейти в личный кабинет</Link></div>}
      </div>
      <aside className="profile-auth__note"><strong>Что демонстрирует экран</strong><p>Регистрацию и вход через подтверждение телефона, отдельные согласия и состояния SMS-кода — без подключения внешнего провайдера.</p><dl><div><dt>Код 1234</dt><dd>успех</dd></div><div><dt>Код 0000</dt><dd>истёк</dd></div><div><dt>Другой код</dt><dd>ошибка</dd></div></dl></aside>
    </div>
  </div>
}
