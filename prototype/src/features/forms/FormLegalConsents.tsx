import { useId } from 'react'
import { Link } from 'react-router-dom'
import './FormLegalConsents.css'

type FormLegalConsentsProps = {
  personalDataAccepted: boolean
  agreementAccepted: boolean
  onPersonalDataChange(checked: boolean): void
  onAgreementChange(checked: boolean): void
  showErrors: boolean
  required?: boolean
  className?: string
}

export function FormLegalConsents({ personalDataAccepted, agreementAccepted, onPersonalDataChange, onAgreementChange, showErrors, required = false, className = '' }: FormLegalConsentsProps) {
  const id = useId()
  const personalId = `${id}-personal-data`
  const agreementId = `${id}-agreement`
  const personalErrorId = `${id}-personal-data-error`
  const agreementErrorId = `${id}-agreement-error`

  return (
    <div className={`form-legal-consents ${className}`.trim()} role="group" aria-label="Обязательные согласия">
      <div className="form-legal-consents__item">
        <div className="form-legal-consents__check">
          <input id={personalId} name="personalDataConsent" type="checkbox" required={required} checked={personalDataAccepted} onChange={(event) => onPersonalDataChange(event.target.checked)} aria-invalid={showErrors && !personalDataAccepted} aria-describedby={showErrors && !personalDataAccepted ? personalErrorId : undefined} />
          <label htmlFor={personalId}>Даю <Link to="/personal-data-consent" target="_blank" rel="noreferrer">согласие на обработку персональных данных</Link></label>
        </div>
        {showErrors && !personalDataAccepted && <span id={personalErrorId} className="field-error" role="alert">Подтвердите согласие на обработку персональных данных</span>}
      </div>
      <div className="form-legal-consents__item">
        <div className="form-legal-consents__check">
          <input id={agreementId} name="userAgreement" type="checkbox" required={required} checked={agreementAccepted} onChange={(event) => onAgreementChange(event.target.checked)} aria-invalid={showErrors && !agreementAccepted} aria-describedby={showErrors && !agreementAccepted ? agreementErrorId : undefined} />
          <label htmlFor={agreementId}>Принимаю <Link to="/user-agreement" target="_blank" rel="noreferrer">пользовательское соглашение</Link></label>
        </div>
        {showErrors && !agreementAccepted && <span id={agreementErrorId} className="field-error" role="alert">Примите пользовательское соглашение</span>}
      </div>
    </div>
  )
}
