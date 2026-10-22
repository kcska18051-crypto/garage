import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router-dom'
import {App} from '../app/App'
import {buildServiceRequest, readServiceRequests} from '../state/serviceRequests'

const open = (path: string) => render(<MemoryRouter initialEntries={[path]}><App/></MemoryRouter>)
const paint = [
  ['/services/paint-matching', 'paint-matching', 'Подбор автоэмали'],
  ['/services/paint-matching/automotive', 'paint-automotive', 'Подбор/колеровка автомобильных эмалей'],
  ['/services/paint-matching/polyurethane', 'paint-polyurethane', 'Подбор полиуретановых эмалей'],
] as const
const repair = [
  ['compressor-repair', 'Ремонт компрессоров'], ['impact-wrench-repair', 'Ремонт гайковёрта'],
  ['angle-grinder-repair', 'Ремонт болгарки'], ['polisher-repair', 'Ремонт полировальной машинки'],
  ['pressure-washer-repair', 'Ремонт аппарата высокого давления'],
] as const
beforeEach(() => {localStorage.clear(); sessionStorage.clear()})
const fill = async (user: ReturnType<typeof userEvent.setup>, label: string, value: string) => {
  await user.click(screen.getByLabelText(label, {exact: true})); await user.paste(value)
}

it.each(paint)('accepts only name and phone at %s, preserving the chosen direction', async (path, itemId, title) => {
  const user = userEvent.setup(); open(path)
  await user.click(screen.getByRole('button', {name: 'Узнать стоимость'}))
  const dialog = within(screen.getByRole('dialog', {name: 'Узнать стоимость'}))
  expect(dialog.getAllByRole('textbox')).toHaveLength(5)
  for (const label of ['Имя', 'Телефон']) expect(dialog.getByLabelText(label, {exact: true})).toBeRequired()
  for (const label of ['Марка авто', 'Код краски', 'Комментарий']) expect(dialog.getByLabelText(label, {exact: true})).not.toBeRequired()
  await user.click(dialog.getByRole('button', {name: 'Узнать стоимость'}))
  expect(dialog.getByLabelText('Имя', {exact: true})).toHaveFocus()
  await fill(user, 'Имя', 'Демо клиент'); await fill(user, 'Телефон', '8 (999) 123-45-67')
  await user.click(dialog.getByRole('button', {name: 'Узнать стоимость'}))
  expect(dialog.getByRole('status')).toHaveTextContent('Демонстрационная заявка создана')
  const record = JSON.parse(localStorage.getItem('garage-service-requests-v1')!).find((r: {seed: boolean}) => !r.seed)
  expect(record).toMatchObject({kind: 'paint', itemId, title, ownerPhone: null, fields: {name: 'Демо клиент', phone: '+79991234567', car: '', paintCode: '', comment: ''}})
}, 15000)

it('retains paint code and optional information in the exact account detail after remount', async () => {
  sessionStorage.setItem('garage-auth-demo-session-v1', 'active')
  sessionStorage.setItem('garage-auth-demo-identity-v1', JSON.stringify({phone: '79991234567', phoneConfirmed: true}))
  const user = userEvent.setup(); const view = open(paint[1][0])
  await user.click(screen.getByRole('button', {name: 'Узнать стоимость'}))
  for (const [label, value] of [['Имя', 'Тест'], ['Телефон', '+7 999 123-45-67'], ['Марка авто', 'Демо марка'], ['Код краски', 'DEMO-123'], ['Комментарий', 'Демонстрационный комментарий']]) await fill(user, label, value)
  await user.click(within(screen.getByRole('dialog')).getByRole('button', {name: 'Узнать стоимость'}))
  await user.click(screen.getByRole('button', {name: 'Посмотреть заявку в личном кабинете'}))
  expect(screen.getByText('DEMO-123')).toBeInTheDocument()
  expect(screen.getByText('Демо марка')).toBeInTheDocument()
  const record = JSON.parse(localStorage.getItem('garage-service-requests-v1')!).find((r: {seed: boolean}) => !r.seed)
  view.unmount(); open(`/profile/services/request/?id=${record.id}`)
  expect(screen.getByText('DEMO-123')).toBeInTheDocument()
  expect(screen.getByText('Демонстрационный комментарий')).toBeInTheDocument()
}, 15000)

it.each(repair)('opens and persists the selected repair direction %s without creating a new route', async (itemId, title) => {
  const user = userEvent.setup(); open('/services/service-center')
  await user.click(screen.getByRole('button', {name: `Оставить заявку: ${title}`}))
  const dialog = within(screen.getByRole('dialog', {name: 'Заявка на ремонт'}))
  expect(dialog.getByText(title, {exact: true})).toBeInTheDocument()
  expect(dialog.queryByLabelText('Марка авто')).not.toBeInTheDocument()
  expect(dialog.queryByLabelText('Код краски')).not.toBeInTheDocument()
  for (const [label, value] of [['Ваше имя', 'Демо клиент'], ['Телефон', '+79991234567'], ['Модель оборудования', 'Модель'], ['Описание неисправности', 'Не включается']]) await fill(user, label, value)
  await user.click(dialog.getByRole('button', {name: 'Отправить заявку'}))
  const record = JSON.parse(localStorage.getItem('garage-service-requests-v1')!).find((r: {seed: boolean}) => !r.seed)
  expect(record).toMatchObject({kind: 'repair', itemId, title, fields: {model: 'Модель', description: 'Не включается'}})
}, 15000)

it('loads older requests without the new optional paint-code property, preserving their payload', () => {
  const old = buildServiceRequest({submissionId: 'legacy-paint', request: {kind: 'paint', itemId: 'paint-automotive', title: 'Прежняя заявка'}, fields: {name: 'Демо', phone: '+79991234567', model: '', description: '', car: 'Прежняя марка', comment: 'Прежний текст', start: '', end: '', quantity: '1'}, photoAttached: false}, null)!
  delete old.fields.paintCode
  localStorage.setItem('garage-service-requests-v1', JSON.stringify([old]))
  const result = readServiceRequests()
  expect(result.error).toBe('')
  expect(result.records.find(r => r.id === old.id)?.fields).toMatchObject({car: 'Прежняя марка', comment: 'Прежний текст'})
})

it('rejects an oversized or malformed optional paint code rather than dropping a saved field', () => {
  const input = {submissionId: 'bad-code', request: {kind: 'paint' as const, itemId: 'paint-matching', title: 'Подбор автоэмали'}, fields: {name: 'Демо', phone: '+79991234567', model: '', description: '', car: '', comment: '', start: '', end: '', quantity: '1', paintCode: 'x'.repeat(201)}, photoAttached: false}
  expect(buildServiceRequest(input, null)).toBeNull()
  input.fields.paintCode = 'DEMO-200'
  const record = buildServiceRequest(input, null)!
  expect(record.fields.paintCode).toBe('DEMO-200')
  localStorage.setItem('garage-service-requests-v1', JSON.stringify([{...record, fields: {...record.fields, paintCode: 123}}]))
  const raw = localStorage.getItem('garage-service-requests-v1')
  expect(readServiceRequests().error).toMatch(/повреждена/)
  expect(localStorage.getItem('garage-service-requests-v1')).toBe(raw)
})
