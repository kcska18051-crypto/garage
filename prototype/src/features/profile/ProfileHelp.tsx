import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { helpCategories, helpQuestions } from '../../data/profileSupportData'

export function ProfileHelp() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<(typeof helpCategories)[number] | 'Все'>('Все')
  const [openId, setOpenId] = useState('faq-orders')
  const [formOpen, setFormOpen] = useState(false)
  const [topic, setTopic] = useState('Заказы')
  const [order, setOrder] = useState('')
  const [question, setQuestion] = useState('')
  const [reply, setReply] = useState('Телефон')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const questions = useMemo(() => helpQuestions.filter((item) => (category === 'Все' || item.category === category) && `${item.question} ${item.answer}`.toLocaleLowerCase('ru').includes(query.toLocaleLowerCase('ru'))), [category, query])
  const submit = () => {
    if (!question.trim()) { setMessage('Введите текст вопроса'); return }
    setMessage(''); setSubmitted(true)
  }
  return <div className="profile-section profile-help">
    <header className="profile-section__heading"><div><h1>Помощь</h1><p>Быстрые ответы и обращение в поддержку.</p></div></header>
    <label className="profile-help-search">Поиск<input type="search" aria-label="Поиск по вопросам" placeholder="Найти ответ" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
    <div className="profile-help-categories" aria-label="Категории помощи"><button aria-pressed={category === 'Все'} onClick={() => setCategory('Все')}>Все</button>{helpCategories.map((item) => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
    <div className="profile-help-layout"><section className="profile-faq" aria-label="Частые вопросы">{questions.map((item) => <article key={item.id}><button type="button" aria-expanded={openId === item.id} onClick={() => setOpenId(openId === item.id ? '' : item.id)}><span>{item.question}</span><b>{openId === item.id ? '−' : '+'}</b></button>{openId === item.id && <p>{item.answer}</p>}</article>)}{!questions.length && <div className="profile-empty profile-empty--compact"><h2>Ответ не найден</h2><p>Измените запрос или задайте вопрос поддержке.</p></div>}</section>
      <aside className="profile-panel profile-help-actions"><h2>Нужна помощь?</h2><button className="profile-button profile-button--primary" type="button" onClick={() => setFormOpen(true)}>Задать вопрос</button><button className="profile-button" type="button" onClick={() => { setFormOpen(true); setReply('Телефон') }}>Заказать звонок</button><button className="profile-button" type="button" onClick={() => { setFormOpen(true); setReply('Чат') }}>Написать в чат</button><p>Режим и контакты поддержки будут уточнены клиентом.</p></aside></div>
    {formOpen && <section className="profile-panel profile-help-form" aria-label="Форма обращения"><h2>Обращение в поддержку</h2>{submitted ? <div className="profile-success" role="status"><span>✓</span><h3>Спасибо! Ваше обращение отправлено</h3><p>Демонстрационный номер обращения: HELP-2026-014.</p><Link className="profile-button profile-button--primary" to="/profile/services">Перейти к обращениям</Link></div> : <div className="profile-form profile-form--grid"><label>Тема<select value={topic} onChange={(event) => setTopic(event.target.value)}>{helpCategories.map((item) => <option key={item}>{item}</option>)}</select></label><label>Номер заказа — необязательно<input value={order} onChange={(event) => setOrder(event.target.value)} /></label><label className="profile-form__wide">Текст вопроса<textarea value={question} onChange={(event) => setQuestion(event.target.value)} /></label><label>Предпочтительный способ ответа<select value={reply} onChange={(event) => setReply(event.target.value)}><option>Телефон</option><option>Электронная почта</option><option>Чат</option></select></label>{message && <p className="profile-message profile-message--error profile-form__wide" role="alert">{message}</p>}<button className="profile-button profile-button--primary" type="button" onClick={submit}>Отправить обращение</button></div>}</section>}
  </div>
}
