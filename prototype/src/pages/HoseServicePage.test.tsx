import {render,screen,within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router-dom'
import {App} from '../app/App'
it('shows the client hose price list and opens an application for this service',async()=>{
 const user=userEvent.setup()
 render(<MemoryRouter initialEntries={['/services/service-center/pressure-washer-hoses']}><App/></MemoryRouter>)
 const main=within(screen.getByRole('main'))
 expect(main.getByRole('heading',{level:1,name:'Изготовление шлангов высокого давления для моек'})).toBeInTheDocument()
 expect(main.getByRole('table',{name:'Стоимость изготовления и ремонта шлангов'}).querySelectorAll('tbody tr')).toHaveLength(10)
 expect(main.getByText(/Гидравлические РВД для спецтехники не изготавливаем/)).toBeInTheDocument()
 await user.click(main.getByRole('link',{name:'Рассчитать стоимость'}))
 const form=within(screen.getByRole('region',{name:'Заявка на изготовление шланга'}))
 expect(form.getByLabelText('Модель мойки',{exact:true})).toBeInTheDocument()
 expect(form.getByLabelText('Длина и тип подключения',{exact:true})).toBeInTheDocument()
 expect(screen.getByRole('heading',{name:'Изготовление шлангов высокого давления для моек',level:2})).toBeInTheDocument()
 await user.click(screen.getByRole('link',{name:'Вернуться к услуге'}))
 expect(screen.getByRole('heading',{level:1,name:'Изготовление шлангов высокого давления для моек'})).toBeInTheDocument()
},15000)
