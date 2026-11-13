import { useAnimatedClose } from '../../hooks/useAnimatedClose'
import {PhoneHint,PHONE_PLACEHOLDER} from '../forms/PhoneHint'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { FormLegalConsents } from '../forms/FormLegalConsents'
import type { ServiceRequest } from '../../data/serviceTypes'
import { isServicePhoneValid, localDateString, validatePhoto, validateRental } from './serviceRequestValidation'
import './ServiceRequestDialog.css'
import {useNavigate} from 'react-router-dom'
import {useProfile} from '../../state/ProfileState'
import {useAuth} from '../../state/AuthState'
import {canViewServiceRequest,serviceRequestHref,type ProfileServiceRequest} from '../../state/serviceRequests'

const emptyFields = { name: '', phone: '', model: '', description: '', car: '', paintCode: '', comment: '', start: '', end: '', quantity: '1' }
type Field = keyof typeof emptyFields

export function ServiceRequestDialog({ request, onClose: onCloseImmediately, contact, inline = false, onCreated }: { request: ServiceRequest; onClose(): void; contact?: { name: string; phone: string }; inline?: boolean; onCreated?(): void }) {
  const onClose = useAnimatedClose(onCloseImmediately, () => dialogRef.current)
  const [fields, setFields] = useState(() => ({ ...emptyFields, ...contact }))
  const [personalDataAccepted,setPersonalDataAccepted]=useState(false)
  const [agreementAccepted,setAgreementAccepted]=useState(false)
  const [consentsAttempted,setConsentsAttempted]=useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [photo, setPhoto] = useState<string | null>(null)
  const [photoError, setPhotoError] = useState<string>()
  const [demoNumber, setDemoNumber] = useState<string>()
  const [created,setCreated]=useState<ProfileServiceRequest|null>(null)
  const [storageError,setStorageError]=useState('')
  const [submissionId]=useState(()=>crypto.randomUUID())
  const submitted=useRef(false)
  const {createServiceRequest}=useProfile()
  const {identity,openAuth}=useAuth()
  const navigate=useNavigate()
  const dialogRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const closeRef = useRef(onClose)
  const id = useId()
  const title = request.kind === 'repair' ? 'Заявка на ремонт' : request.kind === 'paint' ? 'Узнать стоимость' : 'Заявка на аренду'
  const today = localDateString()

  useEffect(() => { closeRef.current = onClose }, [onClose])
  useEffect(() => {
    if (inline) return
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.body.classList.add('service-dialog-open')
    headingRef.current?.focus()
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current(); return }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href], [tabindex="0"]')]
      const first = focusable[0], last = focusable.at(-1)
      if (!first || !last) { event.preventDefault(); dialogRef.current.focus(); return }
      const active = document.activeElement
      if (!focusable.includes(active as HTMLElement)) { event.preventDefault(); (event.shiftKey ? last : first).focus() }
      else if (event.shiftKey && active === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && active === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', keydown)
    return () => {
      window.removeEventListener('keydown', keydown)
      document.body.classList.remove('service-dialog-open')
      if (trigger?.isConnected) trigger.focus()
    }
  }, [inline])
  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo) }, [photo])
  useEffect(() => { if (demoNumber) headingRef.current?.focus() }, [demoNumber])

  const field = (key: Field, label: string, options: { type?: string; multiline?: boolean; optional?: boolean; min?: string; autoComplete?: string } = {}) => {
    const inputId = `${id}-${key}`
    const props = {
      id: inputId, name: key, value: fields[key], required: !options.optional,
      'aria-label': label,
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFields((current) => ({ ...current, [key]: event.target.value })),
      'aria-invalid': Boolean(errors[key]), 'aria-describedby': [key==='phone'?`${inputId}-hint`:null,errors[key]?`${inputId}-error`:null].filter(Boolean).join(' ') || undefined,
    }
    return <div className="form-field" key={key}>
      <label htmlFor={inputId}>{label}{request.kind==='paint'&&!options.optional&&<span aria-hidden="true"> *</span>}</label>
      {options.multiline ? <textarea {...props} rows={3} maxLength={4000} /> : <input {...props} maxLength={key==='name'?100:key==='phone'?64:200} placeholder={key==='phone'?PHONE_PLACEHOLDER:undefined} inputMode={key==='phone'?'tel':undefined} type={options.type ?? 'text'} min={options.min} step={options.type === 'number' ? '1' : undefined} autoComplete={options.autoComplete} />}
      {key==='phone'&&<PhoneHint id={`${inputId}-hint`}/>}
      {errors[key] && <span className="field-error" id={`${inputId}-error`}>{errors[key]}</span>}
    </div>
  }
  const removePhoto = () => {
    setPhoto(null); setPhotoError(undefined)
    if (photoInputRef.current) photoInputRef.current.value = ''
  }
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (submitted.current) return
    setStorageError('')
    const next: Record<string, string> = {}
    if (!fields.name.trim()) next.name = 'Укажите имя'
    if (!isServicePhoneValid(fields.phone)) next.phone = 'Укажите телефон: от 10 до 15 цифр, без букв'
    if (request.kind === 'repair') {
      if (!fields.model.trim()) next.model = 'Укажите модель оборудования'
      if (!fields.description.trim()) next.description = 'Опишите неисправность'
    } else if (request.kind === 'rental') Object.assign(next, validateRental(fields.start, fields.end, fields.quantity, localDateString()))
    if (photoError) next.photo = photoError
    if(request.kind==='paint'){
      setConsentsAttempted(true)
      if(!personalDataAccepted)next.personalDataConsent='Подтвердите согласие на обработку персональных данных'
      if(!agreementAccepted)next.userAgreement='Примите пользовательское соглашение'
    }
    setErrors(next)
    const first = Object.keys(next)[0]
    if (first) { (dialogRef.current?.querySelector<HTMLElement>(`[name="${first}"]`) ?? dialogRef.current?.querySelector<HTMLElement>('.form-legal-consents input[aria-invalid="true"]'))?.focus(); return }
    submitted.current=true
    const result=createServiceRequest({submissionId,request,fields,photoAttached:Boolean(photo)},identity?.phoneConfirmed?identity.phone:null)
    if(!result.ok){submitted.current=false;setStorageError(result.error);return}
    setCreated(result.record)
    setDemoNumber(result.record.number)
    onCreated?.()
    setFields(emptyFields)
    removePhoto()
  }

  const content = <>
      {!inline && <button className="dialog__close approved-dialog__close" aria-label="Закрыть форму" onClick={() => closeRef.current()}>×</button>}
      {demoNumber ? <div className="service-request-success">
        <h2 ref={headingRef} tabIndex={-1}>{inline ? 'Заявка оформлена' : 'Демонстрационная заявка'}</h2>
        <p role="status">{request.kind === 'rental' ? 'Заявка на аренду отправлена' : 'Демонстрационная заявка создана'}</p>
        <p className="service-request-number">Номер: {demoNumber}</p>
        <p>Статус: {created?.status}</p>
        {inline && <p className="service-request-next">{request.kind === 'repair' ? 'Следующий шаг — уточнение неисправности и согласование диагностики. Стоимость и сроки ремонта определяются после оценки оборудования.' : request.kind === 'paint' ? 'Следующий шаг — уточнение цвета, способа подбора и состава материалов. Затем согласуются стоимость и сроки.' : 'Следующий шаг — подтверждение доступности на выбранные даты, тарифа и условий передачи. До согласования оборудование не забронировано.'}</p>}
        <p>Реальная отправка менеджеру не выполняется. Текстовые данные сохранены локально в этом браузере и доступны в истории после входа в соответствующий демопрофиль.</p>
        {created?.photoAttached&&<p>Фото было приложено к форме, но сам файл не сохранён. После закрытия или перезагрузки предпросмотр недоступен.</p>}
        {request.kind === 'rental' && <p>Это демонстрация, не бронь. Доступность оборудования не изменяется.</p>}
        {!created?.ownerPhone&&<p>Для доступа подтвердите телефон, указанный в заявке. Используется демонстрационный код, это не безопасная реальная авторизация.</p>}
        <button className="button button--dark" type="button" onClick={()=>{
          if(!created)return
          const href=serviceRequestHref(created.id)
          closeRef.current();navigate(href)
          if(!canViewServiceRequest(created,identity))openAuth('login',{returnTo:href,requirePhoneConfirmation:true})
        }}>Посмотреть заявку в личном кабинете</button>
        <button className="button" onClick={() => inline ? navigate('/profile/services') : closeRef.current()}>{inline ? 'Все заявки' : 'Закрыть'}</button>
      </div> : <form onSubmit={submit} noValidate>
        <h2 ref={headingRef} tabIndex={-1}>{title}</h2>
        <p className="service-request-selection">{request.title}</p>
        {field('name', request.kind==='paint'?'Имя':'Ваше имя', { autoComplete: 'name' })}
        {field('phone', 'Телефон', { type: 'tel', autoComplete: 'tel' })}
        {request.kind === 'repair' && <>
          {field('model', 'Модель оборудования')}
          {field('description', 'Описание неисправности', { multiline: true })}
          <div className="form-field">
            <label htmlFor={`${id}-photo`}>Фото неисправности (необязательно)</label>
            <input id={`${id}-photo`} name="photo" ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" aria-invalid={Boolean(photoError)} aria-describedby={photoError ? `${id}-photo-error` : `${id}-photo-help`} onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ''
              if (!file) return
              const error = validatePhoto(file)
              setPhotoError(error)
              setPhoto(error ? null : URL.createObjectURL(file))
            }} />
            <small id={`${id}-photo-help`}>Одно фото JPEG, PNG или WebP, до 5 МиБ. Без загрузки на сервер. В истории останется только факт приложения: сам файл не сохраняется и после закрытия или перезагрузки недоступен.</small>
            {photoError && <span id={`${id}-photo-error`} className="field-error">{photoError}</span>}
            {photo && <img className="service-request-photo" src={photo} alt="Предпросмотр фото неисправности" />}
            {(photo || photoError) && <button className="service-request-remove" type="button" onClick={removePhoto}>Удалить фото</button>}
          </div>
        </>}
        {request.kind === 'paint' && <>{field('car', 'Марка авто', { optional: true })}{field('paintCode', 'Код краски', { optional: true })}{field('comment', 'Комментарий', { multiline: true, optional: true })}</>}
        {request.kind === 'rental' && <>
          <div className="service-request-dates">{field('start', 'Дата начала', { type: 'date', min: today })}{field('end', 'Дата окончания', { type: 'date', min: fields.start > today ? fields.start : today })}</div>
          {field('quantity', 'Количество', { type: 'number', min: '1' })}
          {field('comment', 'Комментарий', { multiline: true, optional: true })}
        </>}
        {request.kind==='paint'&&<FormLegalConsents required personalDataAccepted={personalDataAccepted} agreementAccepted={agreementAccepted} onPersonalDataChange={setPersonalDataAccepted} onAgreementChange={setAgreementAccepted} showErrors={consentsAttempted}/>}
        {storageError&&<p className="field-error" role="alert">{storageError}</p>}
        <button className="button button--dark" type="submit">{request.kind==='paint'&&!inline?'Узнать стоимость':'Отправить заявку'}</button>
      </form>}
  </>
  return inline ? <section className="service-request-inline service-request-dialog" role="region" aria-label={title} ref={dialogRef}>{content}</section> : <div className="overlay service-request-overlay" role="presentation" onMouseDown={event => { if(event.target === event.currentTarget) closeRef.current() }}><section className="dialog service-request-dialog approved-dialog" role="dialog" aria-modal="true" aria-label={title} ref={dialogRef} tabIndex={-1}>{content}</section></div>
}
