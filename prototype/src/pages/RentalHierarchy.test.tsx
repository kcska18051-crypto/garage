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
  expect(within(screen.getByRole('region',{name:'Направления аренды'})).getAllByRole('article')).toHaveLength(2)
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

it.each([
 ['remeza-vk-10-gr-0001','380 В','7,5 кВт','GR-0001'],
 ['remeza-vk-10-380-55','380 В','5,5 кВт','GR-380-55'],
 ['remeza-vk-10-220-55','220 В','5,5 кВт','GR-220-55'],
])('rents the selected %s directly and retains it in account history', async (id, voltage, power, sku) => {
 sessionStorage.setItem('garage-auth-demo-session-v1','active')
 sessionStorage.setItem('garage-auth-demo-identity-v1',JSON.stringify({phone:'79991234567',phoneConfirmed:true}))
 localStorage.setItem('garage-cart-v2',JSON.stringify([{id:'product-2',quantity:2}]))
 const user=userEvent.setup(), view=open(`/product/${id}`), before=localStorage.getItem('garage-cart-v2')
 await user.click(screen.getByRole('button',{name:'Взять в аренду'}))
 expect(screen.queryByRole('combobox',{name:'Оборудование для аренды'})).not.toBeInTheDocument()
 expect(screen.getByRole('link',{name:'Вернуться к товару'})).toHaveAttribute('href',`/product/${id}`)
 const form=within(screen.getByRole('region',{name:'Заявка на аренду'}))
 expect(screen.getByRole('heading',{level:2,name:new RegExp(voltage+' · '+power)})).toBeInTheDocument()
 for(const [label,value] of [['Ваше имя','Демо аренда'],['Телефон','+79991234567'],['Город получения','Вологда']]) {await user.clear(form.getByLabelText(label));await user.click(form.getByLabelText(label));await user.paste(value)}
 for(const label of ['Дата начала','Дата окончания']) fireEvent.change(form.getByLabelText(label),{target:{value:'2099-01-01'}})
 await user.dblClick(form.getByRole('button',{name:'Отправить заявку на аренду'}))
 const records=JSON.parse(localStorage.getItem('garage-service-requests-v1')!).filter((r:{seed:boolean})=>!r.seed)
 expect(records).toHaveLength(1)
 const record=records[0]
 expect(record).toMatchObject({kind:'rental',itemId:id,status:'Ожидает подтверждения',ownerPhone:'79991234567',fields:{city:'Вологда',model:expect.stringContaining(sku)}})
 expect(localStorage.getItem('garage-cart-v2')).toBe(before)
 await user.click(screen.getByRole('button',{name:'Посмотреть заявку в личном кабинете'}))
 expect(screen.getByRole('heading',{name:`Заявка № ${record.number}`})).toBeInTheDocument()
 view.unmount();open(`/profile/services/request/?id=${record.id}`)
 expect(screen.getByText('Вологда')).toBeInTheDocument()
 expect(screen.getByText(new RegExp(sku))).toBeInTheDocument()
 expect(screen.getByText('Ожидает подтверждения',{selector:'p.profile-status'})).toBeInTheDocument()
},20000)

it.each(['product-3'])('does not mark an unlinked sale SKU %s as available for rental', id => {
  open(`/product/${id}`)
  expect(screen.queryByRole('button', {name: /^(Можно взять в аренду|Взять в аренду)$/})).not.toBeInTheDocument()
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
