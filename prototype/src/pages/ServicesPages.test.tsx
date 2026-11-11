import {render,screen,within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router-dom'
import {App} from '../app/App'

const open=(path:string)=>render(<MemoryRouter initialEntries={[path]}><App/></MemoryRouter>)
const base='/services/service-center/compressor-repair'
it.each([
  ['/services','Услуги'],['/services/service-center','Сервисный центр по ремонту'],[base,'Ремонт компрессоров'],
  [base+'/screw','Ремонт винтовых компрессоров'],[base+'/piston','Ремонт поршневых компрессоров'],[base+'/diesel','Ремонт дизельных компрессоров'],
  ['/services/paint-matching','Подбор автоэмали'],['/services/rental','Аренда оборудования и инструмента'],
  ['/services/rental/hydraulic-jack','Домкрат подкатной профессиональный'],['/services/rental/tool-set','Набор инструмента для мастерской'],['/services/rental/piston-compressor','Компрессор поршневой'],
])('opens the implemented service route %s', (path,title)=>{
  open(path)
  const main=screen.getByRole('main')
  expect(within(main).getByRole('heading',{level:1,name:title})).toBeInTheDocument()
  if(!['/services','/services/paint-matching','/services/service-center',base,base+'/screw',base+'/piston',base+'/diesel'].includes(path)) expect(main).toHaveTextContent(/демонстрационн/i)
  expect(main.querySelectorAll('.placeholder-page,a[href="#"]')).toHaveLength(0)
  expect(screen.getByRole('navigation',{name:'Хлебные крошки'})).toHaveTextContent('Услуги')
})
it('connects all repair levels through real links',()=>{
  open(base)
  for(const [slug,name] of [['screw','винтовых'],['piston','поршневых'],['diesel','дизельных']]) expect(within(screen.getByRole('main')).getByRole('link',{name:`Ремонт ${name} компрессоров`})).toHaveAttribute('href',`${base}/${slug}`)
})
it('keeps rental request separate from cart and identifies the selected item',async()=>{
  const user=userEvent.setup();open('/services/rental/hydraulic-jack')
  const before=localStorage.getItem('garage-cart-v2')
  await user.click(within(screen.getByRole('main')).getByRole('button',{name:'Арендовать'}))
  expect(screen.getByRole('dialog')).toHaveTextContent('Домкрат подкатной профессиональный')
  expect(localStorage.getItem('garage-cart-v2')).toBe(before)
})
it.each(['/services/rental/not-a-real-item',base+'/unknown','/services/unknown'])('uses actual 404 UI for %s',path=>{
  open(path)
  expect(screen.getByRole('heading',{name:'Страница не найдена'})).toBeInTheDocument()
})
it('preserves the old workshop link as a redirect, not a fourth direction',()=>{
  open('/services/workshop')
  expect(screen.getByRole('heading',{level:1,name:'Услуги'})).toBeInTheDocument()
  expect(screen.getByRole('main').querySelectorAll('.services-grid article')).toHaveLength(3)
})

it('keeps the service index as three named navigation cards with approved artwork',()=>{
  open('/services')
  const main=screen.getByRole('main')
  expect(main).toHaveClass('services-index-page')
  const cards=main.querySelectorAll('.service-direction-card')
  expect(cards).toHaveLength(3)
  for(const [title,href] of [
    ['Сервисный центр по ремонту','/services/service-center'],
    ['Подбор автоэмали','/services/paint-matching'],
    ['Аренда оборудования и инструмента','/services/rental'],
  ]) expect(within(main).getByRole('link',{name:title})).toHaveAttribute('href',href)
  expect(main.querySelectorAll('.services-art')).toHaveLength(0)
  expect(main).not.toHaveTextContent('Условия, стоимость и сроки уточняются при обращении.')
  expect(main.querySelectorAll('.service-direction-photo img')).toHaveLength(3)
  expect(main).not.toHaveTextContent('для обсуждения структуры')
})

it.each([['screw','Ремонт винтовых компрессоров'],['piston','Ремонт поршневых компрессоров'],['diesel','Ремонт дизельных компрессоров']])('opens the %s repair form with the selected equipment type',async(slug,title)=>{
  const user=userEvent.setup();open(base+'/'+slug)
  const main=screen.getByRole('main')
  await user.click(within(main).getByRole('button',{name:'Оставить заявку'}))
  const dialog=within(screen.getByRole('dialog',{name:'Заявка на ремонт'}))
  expect(dialog.getByText(title,{exact:true})).toBeInTheDocument()
  expect(dialog.getByLabelText('Модель оборудования',{exact:true})).toBeInTheDocument()
  expect(dialog.getByLabelText('Описание неисправности',{exact:true})).toBeInTheDocument()
})

it('keeps the screw repair showcase specific and opens its closing request action',async()=>{
  const user=userEvent.setup();open(base+'/screw')
  const main=screen.getByRole('main')
  expect(within(main).getByRole('img',{name:'Диагностика винтового компрессора с открытым сервисным отсеком'})).toHaveAttribute('src',expect.stringContaining('screw-compressor-diagnostics.png'))
  expect(within(main).getByRole('heading',{name:'Как проходит ремонт'})).toBeInTheDocument()
  expect(main).not.toHaveTextContent('Об услуге')
  await user.click(within(main).getByRole('button',{name:'Обсудить ремонт'}))
  const dialog=within(screen.getByRole('dialog',{name:'Заявка на ремонт'}))
  expect(dialog.getByText('Ремонт винтовых компрессоров',{exact:true})).toBeInTheDocument()
  expect(dialog.getByLabelText('Модель оборудования',{exact:true})).toBeInTheDocument()
})

it('uses piston-specific content and sends both request actions to piston repair',async()=>{
  const user=userEvent.setup();open(base+'/piston')
  const main=screen.getByRole('main')
  expect(within(main).getByRole('img',{name:'Осмотр поршневого компрессора с горизонтальным ресивером в сервисной мастерской'})).toHaveAttribute('src',expect.stringContaining('piston-compressor-diagnostics.png'))
  expect(within(main).getByRole('heading',{name:'Набор давления'})).toBeInTheDocument()
  expect(main).not.toHaveTextContent('Что указать в заявке')
  for(const name of ['Оставить заявку','Обсудить ремонт']) {
    await user.click(within(main).getByRole('button',{name}))
    expect(within(screen.getByRole('dialog')).getByText('Ремонт поршневых компрессоров',{exact:true})).toBeInTheDocument()
    await user.click(screen.getByRole('button',{name:'Закрыть форму'}))
  }
})

it('shows diesel-specific repair content and selects diesel in the closing request',async()=>{
  const user=userEvent.setup();open(base+'/diesel')
  const main=screen.getByRole('main')
  expect(within(main).getByRole('img',{name:'Осмотр передвижного дизельного компрессора с открытым сервисным отсеком'})).toHaveAttribute('src',expect.stringContaining('diesel-compressor-diagnostics.png'))
  expect(within(main).getByRole('heading',{name:'Запуск и работа двигателя'})).toBeInTheDocument()
  expect(main).not.toHaveTextContent('Демонстрационное наполнение')
  expect(main).not.toHaveTextContent('Что указать в заявке')
  await user.click(within(main).getByRole('button',{name:'Обсудить ремонт'}))
  expect(within(screen.getByRole('dialog')).getByText('Ремонт дизельных компрессоров',{exact:true})).toBeInTheDocument()
})

it('connects the service hub equipment types and keeps all five repair inquiries specific',async()=>{
  const user=userEvent.setup();open('/services/service-center')
  const main=screen.getByRole('main')
  for(const [name,slug] of [['Винтовые','screw'],['Поршневые','piston'],['Дизельные','diesel']]) expect(within(main).getByRole('link',{name})).toHaveAttribute('href',base+'/'+slug)
  expect(main.querySelectorAll('.service-hub__grid>article')).toHaveLength(5)
  for(const title of ['Ремонт компрессоров','Ремонт гайковёрта','Ремонт болгарки','Ремонт полировальной машинки','Ремонт аппарата высокого давления']) {
    await user.click(within(main).getByRole('button',{name:'Оставить заявку: '+title}))
    expect(within(screen.getByRole('dialog')).getByText(title,{exact:true})).toBeInTheDocument()
    await user.click(screen.getByRole('button',{name:'Закрыть форму'}))
  }
})

it('shows three compressor images and routes the general inquiry to compressor repair',async()=>{
  const user=userEvent.setup();open(base)
  const main=screen.getByRole('main')
  expect(main.querySelectorAll('.compressor-overview__card img')).toHaveLength(3)
  expect(main).not.toHaveTextContent('Что подготовить перед обращением')
  await user.click(within(main).getByRole('button',{name:'Оставить заявку'}))
  expect(within(screen.getByRole('dialog')).getByText('Ремонт компрессоров',{exact:true})).toBeInTheDocument()
  expect(screen.getByLabelText('Телефон')).toHaveAttribute('placeholder','+7 (___) ___-__-__')
})
