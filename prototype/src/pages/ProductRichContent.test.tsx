import {render,screen,within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router-dom'
import {App} from '../app/App'
import {productDetail} from '../data/productDetailData'
const open=()=>render(<MemoryRouter initialEntries={['/product/remeza-vk-10-gr-0001']}><App/></MemoryRouter>)
it('keeps anchor order identical to actual sections and includes an accessible description table and photos',async()=>{
 const user=userEvent.setup();open()
 const nav=screen.getByRole('navigation',{name:'Разделы товара'})
 const ids=within(nav).getAllByRole('link').map(link=>link.getAttribute('href')!.slice(1))
 const sections=[...document.querySelectorAll('.product-sections section[id]')].map(e=>e.id).filter(id=>ids.includes(id))
 expect(sections).toEqual(ids)
 const description=document.getElementById('description')!
 expect(description.querySelectorAll('figure img')).toHaveLength(2)
 expect(within(description).getByRole('table',{name:'Варианты Remeza ВК 10-8'})).toBeInTheDocument()
 expect(description.querySelector('tr[data-selected=true]')).toHaveTextContent('GR-0001')
 await user.click(screen.getByRole('button',{name:'220 В'}))
 expect(description.querySelector('tr[data-selected=true]')).toHaveTextContent('GR-220-55')
})
it('expands existing companions without duplicates and keeps adding them to the cart',async()=>{
 const user=userEvent.setup();open();const section=screen.getByRole('region',{name:'Сопутствующие товары'})
 expect(section.querySelectorAll('[data-companion-id]')).toHaveLength(4)
 await user.click(within(section).getByRole('button',{name:'Показать ещё 4'}))
 const ids=[...section.querySelectorAll('[data-companion-id]')].map(e=>e.getAttribute('data-companion-id'))
 expect(ids).toHaveLength(8);expect(new Set(ids).size).toBe(8)
 await user.click(within(section).getByRole('button',{name:'Добавить в корзину: Сварочная проволока'}))
 expect(JSON.parse(localStorage.getItem('garage-cart-v2')!)).toEqual(expect.arrayContaining([expect.objectContaining({id:'supply-welding',quantity:1})]))
 expect(within(section).getByRole('status')).toHaveTextContent('Добавлено в корзину: Сварочная проволока')
 await user.click(within(section).getByRole('button',{name:'Свернуть'}));expect(section.querySelectorAll('[data-companion-id]')).toHaveLength(4)
 expect(productDetail.sections[0].id).toBe('description')
})
