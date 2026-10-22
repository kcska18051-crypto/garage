import {fireEvent, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router-dom'
import {App} from '../app/App'

const open = (path: string) => render(<MemoryRouter initialEntries={[path]}><App/></MemoryRouter>)
beforeEach(() => {localStorage.clear(); sessionStorage.clear()})

it('shows two rental categories at the root, not a mixed item list', () => {
  open('/services/rental')
  expect(screen.getByRole('heading', {level: 1, name: 'Аренда оборудования и инструмента'})).toBeInTheDocument()
  const main = within(screen.getByRole('main'))
  expect(main.getByRole('link', {name: 'Аренда компрессоров'})).toHaveAttribute('href', '/services/rental/compressors')
  expect(main.getByRole('link', {name: 'Аренда инструмента'})).toHaveAttribute('href', '/services/rental/tools')
  expect(document.querySelectorAll('.services-grid article')).toHaveLength(2)
  expect(main.queryByRole('button', {name: /Арендовать/})).not.toBeInTheDocument()
  expect(main.queryByText('Компрессор поршневой', {exact: true})).not.toBeInTheDocument()
})

it.each([
  ['compressors', 'Компрессоры в аренду', ['piston-compressor', 'screw-compressor']],
  ['tools', 'Инструмент в аренду', ['hydraulic-jack', 'tool-set']],
] as const)('shows only the matching %s rental items with real detail links', (category, title, ids) => {
  open(`/services/rental/${category}`)
  expect(screen.getByRole('heading', {level: 1, name: title})).toBeInTheDocument()
  const cards = [...document.querySelectorAll('[data-rental-id]')]
  expect(cards.map(card => card.getAttribute('data-rental-id')).sort()).toEqual([...ids].sort())
  for (const id of ids) expect(document.querySelector(`a[href="/services/rental/${id}"]`)).toBeInTheDocument()
  expect(screen.getByRole('navigation', {name: 'Хлебные крошки'})).toHaveTextContent('Аренда оборудования и инструмента')
})

it('uses the approved sale → message → compressor category → direct form path without changing purchase cart', async () => {
  sessionStorage.setItem('garage-auth-demo-session-v1', 'active')
  sessionStorage.setItem('garage-auth-demo-identity-v1', JSON.stringify({phone: '79991234567', phoneConfirmed: true}))
  localStorage.setItem('garage-cart-v2', JSON.stringify([{id: 'product-2', quantity: 2}]))
  const user = userEvent.setup(); const view = open('/product/remeza-vk-10-gr-0001/')
  const before = localStorage.getItem('garage-cart-v2')
  const trigger = screen.getByRole('button', {name: 'Можно взять в аренду'})
  await user.click(trigger)
  const info = within(screen.getByRole('dialog', {name: 'Можно взять в аренду'}))
  expect(info.queryByLabelText('Дата начала')).not.toBeInTheDocument()
  expect(info.getByRole('link', {name: 'Компрессоры в аренду'})).toHaveAttribute('href', '/services/rental/compressors')
  await user.keyboard('{Escape}'); expect(trigger).toHaveFocus()
  await user.click(trigger)
  await user.click(within(screen.getByRole('dialog')).getByRole('link', {name: 'Компрессоры в аренду'}))
  const card = within(document.querySelector('[data-rental-id="screw-compressor"]') as HTMLElement)
  expect(card.getByText('380 В')).toBeInTheDocument()
  expect(card.getByText('7,5 кВт')).toBeInTheDocument()
  await user.click(card.getByRole('button', {name: /Арендовать/}))
  const form = within(screen.getByRole('dialog', {name: 'Заявка на аренду'}))
  expect(form.getByText('Винтовой компрессор Remeza ВК 10-8 с ременным приводом', {exact: true})).toBeInTheDocument()
  for (const [label, value] of [['Ваше имя', 'Демо аренда'], ['Телефон', '+79991234567']]) {await user.click(form.getByLabelText(label)); await user.paste(value)}
  for (const label of ['Дата начала', 'Дата окончания']) fireEvent.change(form.getByLabelText(label), {target: {value: '2099-01-01'}})
  await user.click(form.getByRole('button', {name: 'Отправить заявку'}))
  const record = JSON.parse(localStorage.getItem('garage-service-requests-v1')!).find((r: {seed: boolean}) => !r.seed)
  expect(record).toMatchObject({kind: 'rental', itemId: 'screw-compressor', title: 'Винтовой компрессор Remeza ВК 10-8 с ременным приводом', status: 'Ожидает подтверждения', ownerPhone: '79991234567'})
  expect(localStorage.getItem('garage-cart-v2')).toBe(before)
  await user.click(screen.getByRole('button', {name: 'Посмотреть заявку в личном кабинете'}))
  expect(screen.getByRole('heading', {name: `Заявка № ${record.number}`})).toBeInTheDocument()
  view.unmount(); open(`/profile/services/request/?id=${record.id}`)
  expect(screen.getByText('Ожидает подтверждения', {selector: 'p.profile-status'})).toBeInTheDocument()
  expect(localStorage.getItem('garage-cart-v2')).toBe(before)
}, 20000)

it.each(['product-3', 'remeza-vk-10-220-55'])('does not mark an unlinked sale SKU %s as available for rental', id => {
  open(`/product/${id}`)
  expect(screen.queryByRole('button', {name: 'Можно взять в аренду'})).not.toBeInTheDocument()
})

it.each([
  ['hydraulic-jack', 'Инструмент в аренду'], ['tool-set', 'Инструмент в аренду'], ['piston-compressor', 'Компрессоры в аренду'],
])('keeps the existing %s rental detail URL and correct category breadcrumb', (id, category) => {
  open(`/services/rental/${id}`)
  expect(screen.getByRole('navigation', {name: 'Хлебные крошки'})).toHaveTextContent(category)
  expect(screen.getByRole('button', {name: 'Арендовать'})).toBeInTheDocument()
})

it.each(['/services/rental/unknown', '/services/rental/compressors/unknown'])('keeps unknown rental routes as 404: %s', path => {
  open(path)
  expect(screen.getByRole('heading', {name: 'Страница не найдена'})).toBeInTheDocument()
})
