import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../../app/App'
import { seedDemoSession } from '../../test/auth'

const open = (path='/profile/services') => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
function login() {
 seedDemoSession()
 sessionStorage.setItem('garage-auth-demo-identity-v1',JSON.stringify({phone:'79000000000',phoneConfirmed:true}))
}
it('creates a repair request from the account and retains the exact request across reload', async () => {
 login(); const user=userEvent.setup(); let view=open()
 await user.click(screen.getByRole('link',{name:'Новая заявка'}))
 expect(screen.getByRole('heading',{level:1,name:'Новая заявка на услугу'})).toBeInTheDocument()
 expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
 expect(screen.queryByRole('button',{name:'Заполнить заявку'})).not.toBeInTheDocument()
 expect(screen.queryByLabelText('Модель оборудования')).not.toBeInTheDocument()
 await user.selectOptions(screen.getByLabelText('Услуга'),'screw')
 expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
 expect(screen.getByLabelText('Ваше имя')).toHaveValue('Алексей')
 expect(screen.getByLabelText('Телефон')).toHaveValue('+79000000000')
 await user.type(screen.getByLabelText('Модель оборудования'),'Remeza VK')
 await user.type(screen.getByLabelText('Описание неисправности'),'Не запускается')
 await user.dblClick(screen.getByRole('button',{name:'Отправить заявку'}))
 const records=JSON.parse(localStorage.getItem('garage-service-requests-v1')!).filter((r:{seed:boolean})=>!r.seed)
 expect(records).toHaveLength(1)
 expect(records[0]).toMatchObject({kind:'repair',itemId:'screw',ownerPhone:'79000000000'})
 await user.click(screen.getByRole('button',{name:'Посмотреть заявку в личном кабинете'}))
 expect(screen.getByRole('heading',{level:1,name:`Заявка № ${records[0].number}`})).toBeInTheDocument()
 expect(screen.getByText('Стоимость и сроки требуют согласования.')).toBeInTheDocument()
 view.unmount(); view=open(`/profile/services/request?id=${records[0].id}`)
 expect(screen.getByText('Remeza VK')).toBeInTheDocument()
 await user.click(screen.getByRole('link',{name:'Все заявки на услуги'}))
 expect(screen.getByText(new RegExp(records[0].number))).toBeInTheDocument()
},20_000)

it('resets the selected item when changing service direction and opens the correct form', async () => {
 login(); const user=userEvent.setup();open('/profile/services/new')
 await user.selectOptions(screen.getByLabelText('Услуга'),'screw')
 await user.click(screen.getByRole('button',{name:'Аренда оборудования'}))
 expect(screen.getByLabelText('Оборудование для аренды')).toHaveValue('')
 await user.selectOptions(screen.getByLabelText('Оборудование для аренды'),'hydraulic-jack')
 expect(screen.getByRole('heading',{name:'Заявка на аренду'})).toBeInTheDocument()
 expect(screen.getByLabelText('Дата начала')).toBeInTheDocument()
 await user.click(screen.getByRole('button',{name:'Подбор автоэмали'}))
 await user.selectOptions(screen.getByLabelText('Услуга'),'paint-automotive')
 expect(screen.getByLabelText('Марка авто')).toBeInTheDocument()
 expect(screen.queryByLabelText('Модель оборудования')).not.toBeInTheDocument()
},15_000)

it('preserves authentication protection on direct request creation URLs', () => {
 open('/profile/services/new')
 expect(screen.getByRole('heading',{name:'Войдите, чтобы открыть профиль'})).toBeInTheDocument()
 expect(screen.queryByLabelText('Услуга')).not.toBeInTheDocument()
})

it('retains guest contacts when switching service direction', async () => {
 const user=userEvent.setup(); open('/services/request?kind=repair&item=screw')
 await user.type(screen.getByLabelText('Ваше имя'),'Мария')
 await user.type(screen.getByLabelText('Телефон'),'+79001234567')
 await user.click(screen.getByRole('button',{name:'Изменить услугу'}))
 await user.click(screen.getByRole('button',{name:'Подбор автоэмали'}))
 await user.selectOptions(screen.getByLabelText('Услуга'),'paint-automotive')
 expect(screen.getByLabelText('Имя')).toHaveValue('Мария')
 expect(screen.getByLabelText('Телефон')).toHaveValue('+79001234567')
 await user.click(screen.getByRole('button',{name:'Аренда оборудования'}))
 await user.selectOptions(screen.getByLabelText('Оборудование для аренды'),'hydraulic-jack')
 expect(screen.getByLabelText('Ваше имя')).toHaveValue('Мария')
 expect(screen.getByLabelText('Телефон')).toHaveValue('+79001234567')
},15_000)
