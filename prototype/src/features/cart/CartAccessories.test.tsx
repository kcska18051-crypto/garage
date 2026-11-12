import {render,screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router-dom'
import {CommerceProvider} from '../../state/CommerceState'
import {CartAccessories} from './CartAccessories'

it('moves recommendations one measured card at a time in either direction and with the keyboard',async()=>{
 const user=userEvent.setup()
 const originalWidth=Object.getOwnPropertyDescriptor(HTMLElement.prototype,'scrollWidth')
 const originalClient=Object.getOwnPropertyDescriptor(HTMLElement.prototype,'clientWidth')
 Object.defineProperty(HTMLElement.prototype,'scrollWidth',{configurable:true,get:()=>1000})
 Object.defineProperty(HTMLElement.prototype,'clientWidth',{configurable:true,get:()=>500})
 const move=vi.fn()
 const originalScroll=HTMLElement.prototype.scrollBy
 HTMLElement.prototype.scrollBy=move
 const rect=vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockReturnValue({width:240,height:92,x:0,y:0,top:0,left:0,right:240,bottom:92,toJSON:()=>({})})
 try{
  render(<MemoryRouter><CommerceProvider><CartAccessories id="product-1" expanded featured/></CommerceProvider></MemoryRouter>)
  const rail=screen.getByRole('region',{name:'Сопутствующие товары'})
  rail.style.columnGap='12px'
  await user.click(screen.getByRole('button',{name:'Следующие сопутствующие товары'}))
  expect(move).toHaveBeenLastCalledWith({left:252,behavior:'smooth'})
  await user.click(screen.getByRole('button',{name:'Предыдущие сопутствующие товары'}))
  expect(move).toHaveBeenLastCalledWith({left:-252,behavior:'smooth'})
  rail.focus()
  await user.keyboard('{ArrowRight}')
  expect(move).toHaveBeenLastCalledWith({left:252,behavior:'smooth'})
 }finally{
  rect.mockRestore()
  HTMLElement.prototype.scrollBy=originalScroll
  if(originalWidth)Object.defineProperty(HTMLElement.prototype,'scrollWidth',originalWidth);else delete (HTMLElement.prototype as unknown as Record<string,unknown>).scrollWidth
  if(originalClient)Object.defineProperty(HTMLElement.prototype,'clientWidth',originalClient);else delete (HTMLElement.prototype as unknown as Record<string,unknown>).clientWidth
 }
})
