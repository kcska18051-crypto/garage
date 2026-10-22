import {render, screen, within, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router-dom'
import {App} from '../../app/App'
import {buildServiceRequest, canViewServiceRequest} from '../../state/serviceRequests'

const login = (phone: string) => {
  sessionStorage.setItem('garage-auth-demo-session-v1', 'active')
  sessionStorage.setItem('garage-auth-demo-identity-v1', JSON.stringify({phone, phoneConfirmed: true}))
}
const open = (path: string) => render(<MemoryRouter initialEntries={[path]}><App/></MemoryRouter>)
const draft = {submissionId: 'isolation-check', request: {kind: 'paint' as const, title: 'Автомобильная эмаль', itemId: 'automotive'}, fields: {name: 'Тест проверки', phone: '+79000000000', car: 'Демоавтомобиль', comment: 'Приватный комментарий', model: '', description: '', start: '', end: '', quantity: '1'}, photoAttached: false}
beforeEach(() => {localStorage.clear(); sessionStorage.clear()})

it('uses the current authenticated phone in checkout rather than the profile fixture, including remount', () => {
  login('79991234567')
  const view = open('/checkout/review')
  expect(screen.getByLabelText('Подтверждённый телефон')).toHaveValue('+79991234567')
  view.unmount(); open('/checkout/review')
  expect(screen.getByLabelText('Подтверждённый телефон')).toHaveValue('+79991234567')
})

it('does not grant a mismatched or unconfirmed identity access to a service request', () => {
  const record = buildServiceRequest(draft, '79991234567')!
  expect(record.ownerPhone).toBeNull()
  const legacyMisbound = {...record, ownerPhone: '79991234567'}
  expect(canViewServiceRequest(legacyMisbound, {phone: '79991234567', phoneConfirmed: true})).toBe(false)
  expect(canViewServiceRequest({...record, ownerPhone: '79000000000'}, {phone: '79000000000', phoneConfirmed: false})).toBe(false)
})

it('protects the actual CTA, direct URL and remount, then permits matching confirmation without deleting history', async () => {
  login('79991234567'); const user = userEvent.setup()
  const view = open('/services/paint-matching/automotive')
  await user.click(screen.getByRole('button', {name: 'Оставить заявку'}))
  for (const [label,value] of [['Ваше имя',draft.fields.name],['Телефон',draft.fields.phone],['Автомобиль',draft.fields.car],['Комментарий',draft.fields.comment]]) {
    await user.click(screen.getByLabelText(label)); await user.paste(value)
  }
  await user.click(screen.getByRole('button', {name: 'Отправить заявку'}))
  await user.click(screen.getByRole('button', {name: 'Посмотреть заявку в личном кабинете'}))
  expect(screen.queryByText(draft.fields.comment)).not.toBeInTheDocument()
  expect(screen.getByRole('dialog', {name: 'Вход и регистрация'})).toBeInTheDocument()
  const records = JSON.parse(localStorage.getItem('garage-service-requests-v1')!)
  const record = records.find((r: {seed: boolean}) => !r.seed)
  view.unmount()
  // Also cover older locally saved records incorrectly assigned to the submitting account.
  record.ownerPhone = '79991234567'
  localStorage.setItem('garage-service-requests-v1', JSON.stringify(records))
  let detail = open(`/profile/services/request/?id=${record.id}`)
  expect(screen.getByRole('heading', {name: 'Заявка недоступна'})).toBeInTheDocument()
  expect(screen.queryByText(draft.fields.comment)).not.toBeInTheDocument()
  detail.unmount(); detail = open(`/profile/services/request/?id=${record.id}`)
  expect(screen.queryByText(draft.fields.comment)).not.toBeInTheDocument()
  await user.click(screen.getByRole('button', {name: 'Подтвердить телефон заявки'}))
  const dialog = within(screen.getByRole('dialog', {name: 'Вход и регистрация'}))
  await user.type(dialog.getByLabelText('Номер телефона'), '+79000000000')
  await user.click(dialog.getByRole('button', {name: 'Получить код'}))
  await user.type(dialog.getByLabelText('Код подтверждения'), '1234')
  await user.click(dialog.getByRole('button', {name: 'Войти'}))
  await waitFor(() => expect(screen.getByText(draft.fields.comment)).toBeInTheDocument())
  expect(JSON.parse(localStorage.getItem('garage-service-requests-v1')!).length).toBe(records.length)
  await user.click(screen.getByRole('button', {name: 'Выйти'}))
  expect(screen.queryByText(draft.fields.comment)).not.toBeInTheDocument()
}, 15000)
