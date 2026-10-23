import { useId } from 'react'
import { Link } from 'react-router-dom'
import './FormLegalConsents.css'

type FormLegalConsentsProps = {
  personalDataAccepted: boolean
  agreementAccepted: boolean
  onPersonalDataChange(checked: boolean): void
  onAgreementChange(checked: boolean): void
  showErrors: boolean
  className?: string
}

export function FormLegalConsents({ personalDataAccepted, agreementAccepted, onPersonalDataChange, onAgreementChange, showErrors, className = '' }: FormLegalConsentsProps) {
  const id = useId()
  const personalId = `${id}-personal-data`
  const agreementId = `${id}-agreement`
  const personalErrorId = `${id}-personal-data-error`
  const agreementErrorId = `${id}-agreement-error`

  return (
    <div className={`form-legal-consents ${className}`.trim()} role="group" aria-label="Обязательные согласия">
      <div className="form-legal-consents__item">
        <div className="form-legal-consents__check">
          <input id={personalId} type="checkbox" checked={personalDataAccepted} onChange={(event) => onPersonalDataChange(event.target.checked)} aria-invalid={showErrors && !personalDataAccepted} aria-describedby={showErrors && !personalDataAccepted ? personalErrorId : undefined} />
          <label htmlFor={personalId}>Даю согласие на обработку персональных данных</label>
        </div>
        <div className="form-legal-consents__links"><Link to="/personal-data-consent" target="_blank" rel="noreferrer">Текст согласия</Link><Link to="/privacy" target="_blank" rel="noreferrer">Политика конфиденциальности</Link></div>
        {showErrors && !personalDataAccepted && <span id={personalErrorId} className="field-error" role="alert">Подтвердите согласие на обработку персональных данных</span>}
      </div>
      <div className="form-legal-consents__item">
        <div className="form-legal-consents__check">
          <input id={agreementId} type="checkbox" checked={agreementAccepted} onChange={(event) => onAgreementChange(event.target.checked)} aria-invalid={showErrors && !agreementAccepted} aria-describedby={showErrors && !agreementAccepted ? agreementErrorId : undefined} />
          <label htmlFor={agreementId}>Принимаю пользовательское соглашение</label>
        </div>
        <div className="form-legal-consents__links"><Link to="/user-agreement" target="_blank" rel="noreferrer">Пользовательское соглашение</Link></div>
        {showErrors && !agreementAccepted && <span id={agreementErrorId} className="field-error" role="alert">Примите пользовательское соглашение</span>}
      </div>
    </div>
  )
}
