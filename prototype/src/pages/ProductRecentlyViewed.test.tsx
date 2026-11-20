import {render,screen,within,cleanup} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router-dom'
import {App} from '../app/App'
const open=(path='/product/remeza-vk-10-gr-0001')=>render(<MemoryRouter initialEntries={[path]}><App/></MemoryRouter>)
it('records selected offers, shows real history newest first and keeps it after reload',async()=>{
 const user=userEvent.setup();open()
 const viewed=()=>screen.getByRole('region',{name:'Вы недавно смотрели'})
 expect(within(viewed()).getAllByRole('article')).toHaveLength(1)
 await user.click(screen.getByRole('button',{name:'220 В'}))
 const cards=within(viewed()).getAllByRole('article')
 expect(cards).toHaveLength(2);expect(cards[0]).toHaveTextContent('GR-220-55');expect(cards[1]).toHaveTextContent('GR-0001')
 await user.click(within(cards[0]).getByRole('button',{name:/Добавить в корзину:/}))
 expect(JSON.parse(localStorage.getItem('garage-cart-v2')!)).toContainEqual({id:'remeza-vk-10-220-55',quantity:1})
 cleanup();open('/product/remeza-vk-10-220-55')
 expect(within(viewed()).getAllByRole('article')).toHaveLength(2)
 expect(JSON.parse(localStorage.getItem('garage-recent-products-v1')!)).toEqual(['remeza-vk-10-220-55','remeza-vk-10-gr-0001'])
 const previous=within(viewed()).getAllByRole('article')[1]
 await user.click(within(previous).getByRole('link',{name:/Открыть товар:/}))
 expect(within(viewed()).getAllByRole('article')[0]).toHaveTextContent('GR-0001')
},15000)
