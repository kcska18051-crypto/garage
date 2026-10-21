import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'
import { compareProducts } from '../data/compareData'

const open = (path:string) => render(<MemoryRouter initialEntries={[path]}><App/></MemoryRouter>)

describe('existing demo SKU journey A-D',()=>{
  it.each(['Remeza','ВК10','GR-0001'])('finds the existing Remeza product in full search for %s',query=>{
    open(`/search?q=${encodeURIComponent(query)}`)
    expect(screen.getAllByRole('link',{name:/Remeza/}).some(link=>link.getAttribute('href')==='/product/remeza-vk-10-gr-0001')).toBe(true)
  })
  it.each([
    ['product-1','Домкрат подкатной профессиональный','GR-0001','18 900 ₽'],
    ['product-2','Набор инструмента для мастерской','GR-0002','27 900 ₽'],
    ['product-5','Стенд диагностический','GR-0005','54 900 ₽'],
  ])('opens %s as its own product and adds its own SKU',async(id,name,sku,price)=>{
    const user=userEvent.setup();open(`/product/${id}`)
    expect(screen.getByRole('heading',{level:1,name})).toBeInTheDocument()
    expect(screen.getByText(`Артикул: ${sku}`)).toBeInTheDocument()
    expect(screen.getByRole('complementary',{name:'Покупка товара'})).toHaveTextContent(price)
    expect(screen.getByText(/Подробные характеристики пока не предоставлены/)).toBeInTheDocument()
    await user.click(screen.getByRole('button',{name:'Добавить в корзину'}))
    expect(JSON.parse(localStorage.getItem('garage-cart-v2')!)).toEqual([{id,quantity:1}])
  })
  it('uses the same demonstration performance in comparison and product data',()=>{
    expect(compareProducts.find(p=>p.id==='remeza-vk-10-gr-0001')?.specs['Производительность']).toBe('10 л/мин')
  })
  it.each(['mobile','gallery'])('keeps the selected quantity in the %s purchase action',async(surface)=>{
    const user=userEvent.setup();open('/product/remeza-vk-10-gr-0001')
    await user.click(screen.getByRole('button',{name:'220 В'}))
    const purchase=screen.getByRole('complementary',{name:'Покупка товара'})
    await user.click(within(purchase).getByRole('button',{name:'Увеличить количество'}))
    if(surface==='gallery') {
      await user.click(screen.getByRole('button',{name:'Увеличить изображение'}))
      await user.click(within(screen.getByRole('complementary',{name:'Покупка в увеличенном просмотре'})).getByRole('button',{name:'В корзину'}))
    } else {
      await user.click(within(document.querySelector('.product-mobile-purchase') as HTMLElement).getByRole('button',{name:'В корзину',hidden:true}))
    }
    expect(JSON.parse(localStorage.getItem('garage-cart-v2')!)).toEqual([{id:'remeza-vk-10-220-55',quantity:2}])
  })
  it('does not retain 380V in the selected 220V heading or proposal and adds the selected quantity',async()=>{
    const user=userEvent.setup();open('/product/remeza-vk-10-gr-0001')
    await user.click(screen.getByRole('button',{name:'220 В'}))
    expect(screen.getByRole('heading',{level:1})).not.toHaveTextContent('380 В')
    const purchase=screen.getByRole('complementary',{name:'Покупка товара'})
    await user.click(within(purchase).getByRole('button',{name:'Увеличить количество'}))
    await user.click(within(purchase).getByRole('button',{name:'Коммерческое предложение'}))
    const proposal=screen.getByRole('dialog',{name:'Коммерческое предложение'})
    expect(proposal).not.toHaveTextContent('380 В')
    expect(proposal).toHaveTextContent('220 В · 5,5 кВт')
    expect(proposal).toHaveTextContent('338 000 ₽')
    await user.click(within(proposal).getByRole('button',{name:'Закрыть коммерческое предложение'}))
    await user.click(within(purchase).getByRole('button',{name:'В корзину'}))
    expect(JSON.parse(localStorage.getItem('garage-cart-v2')!)).toEqual([{id:'remeza-vk-10-220-55',quantity:2}])
  })
})
