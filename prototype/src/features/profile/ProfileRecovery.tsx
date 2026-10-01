import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

type RecoveryStage = 'phone' | 'code' | 'success'

export function ProfileRecovery() {
  const [stage, setStage] = useState<RecoveryStage>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const requestCode = (event: FormEvent) => { event.preventDefault(); if (!phone.trim()) return setError('Введите номер телефона'); setError(''); setStage('code') }
  const verify = (event: FormEvent) => { event.preventDefault(); if (code === '1234') { setError(''); setStage('success'); return } setError(code === '0000' ? 'Код истёк. Запросите новый код.' : 'Неверный код. Проверьте цифры и попробуйте ещё раз.') }
  const resend = () => { setCode(''); setError(''); setStatus('Новый код отправлен. Повторная отправка будет доступна через 00:30.') }
  return <div className="profile-section profile-auth profile-recovery">
    <header className="profile-section__heading"><h1>Восстановление доступа</h1></header>
    <div className="profile-auth__layout"><section className="profile-panel profile-auth__card">
      {stage === 'phone' && <form className="profile-form" onSubmit={requestCode}><div><h2>Подтвердите номер телефона</h2><p>Мы отправим демонстрационный код на подтверждённый номер.</p></div><label>Номер телефона<input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" placeholder="+7 900 000-00-00" /></label>{error && <p className="profile-message profile-message--error" role="alert">{error}</p>}<button className="profile-button profile-button--primary" type="submit">Получить код</button><Link to="/profile/help">Нет доступа к номеру</Link><Link to="/profile/auth">Вернуться ко входу</Link></form>}
      {stage === 'code' && <form className="profile-form" onSubmit={verify}><div><h2>Введите код из SMS</h2><p>Если номер связан с профилем, код отправлен. Мы не раскрываем наличие учётной записи.</p></div><label>Код подтверждения<input value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" /></label><small>Отправить повторно через 00:30</small>{error && <p className="profile-message profile-message--error" role="alert">{error}</p>}{status && <p className="profile-message profile-message--success" role="status">{status}</p>}<div className="profile-actions"><button className="profile-button profile-button--primary" type="submit">Подтвердить доступ</button><button className="profile-button" type="button" onClick={resend}>Отправить код повторно</button></div><Link to="/profile/help">Нет доступа к номеру</Link></form>}
      {stage === 'success' && <div className="profile-success" role="status"><span>✓</span><h2>Доступ подтверждён</h2><p>Можно продолжить работу с демонстрационным личным кабинетом.</p><Link className="profile-button profile-button--primary" to="/profile">Перейти в личный кабинет</Link></div>}
    </section><aside className="profile-auth__note"><strong>Восстановление без пароля</strong><p>В текущей модели вход связан с номером телефона, поэтому отдельный пароль не создаётся.</p><dl><div><dt>1234</dt><dd>успех</dd></div><div><dt>0000</dt><dd>истёк</dd></div></dl></aside></div>
  </div>
}
