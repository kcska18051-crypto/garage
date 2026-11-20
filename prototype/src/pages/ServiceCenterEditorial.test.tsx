import {render,screen,within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router-dom'
import {App} from '../app/App'
it('explains the full service process and preserves the chosen additional repair direction',async()=>{
 const user=userEvent.setup();render(<MemoryRouter initialEntries={['/services/service-center']}><App/></MemoryRouter>)
 const main=within(screen.getByRole('main'))
 expect(main.getByRole('heading',{name:'Специалист по вашей технике'})).toBeInTheDocument()
 expect(main.getByRole('region',{name:'Как проходит ремонт'}).querySelectorAll('ol li')).toHaveLength(5)
 await user.click(main.getByText('Аккумуляторный инструмент',{exact:true}))
 await user.click(main.getByRole('link',{name:'Оставить заявку: Аккумуляторный инструмент'}))
 expect(screen.getByRole('heading',{level:2,name:'Ремонт аккумуляторного инструмента'})).toBeInTheDocument()
 await user.click(screen.getByRole('link',{name:'Вернуться к услуге'}))
 expect(within(screen.getByRole('main')).getByRole('link',{name:/Шланги для моек высокого давления/})).toHaveAttribute('href','/services/service-center/pressure-washer-hoses')
},15000)
