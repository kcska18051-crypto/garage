import './PhoneHint.css'
export const PHONE_PLACEHOLDER = '+7 (___) ___-__-__'
export function PhoneHint({id,allowEmail=false}:{id:string;allowEmail?:boolean}) {
  return <span id={id} className="phone-format-hint">{allowEmail ? 'Для телефона — 10 цифр после +7. Можно указать email.' : '10 цифр после +7'}</span>
}
