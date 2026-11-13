import {render,screen,within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router-dom'
import {App} from '../app/App'
const open=(path:string)=>render(<MemoryRouter initialEntries={[path]}><App/></MemoryRouter>)
beforeEach(()=>{localStorage.clear();sessionStorage.clear()})
it('shares favorites between public and account routes and synchronizes removal with the header',async()=>{
 const user=userEvent.setup()
 localStorage.setItem('garage-favorites-v1',JSON.stringify(['product-1','compressor-30']))
 const view=open('/favorites')
 expect(document.querySelectorAll('.favorites-grid article')).toHaveLength(2)
 const first=screen.getByRole('link',{name:'Открыть товар: Домкрат подкатной профессиональный'}).closest('article')!
 expect(within(first).getByRole('img')).toHaveAttribute('src','/garage/style-check/review-assets/product-jack.jpg')
 await user.click(within(first).getByRole('button',{name:'Убрать из избранного: Домкрат подкатной профессиональный'}))
 expect(document.querySelectorAll('.favorites-grid article')).toHaveLength(1)
 expect(screen.getByRole('link',{name:'Избранное: 1'})).toBeInTheDocument()
 view.unmount();open('/profile/favorites')
 expect(document.querySelectorAll('.favorites-grid article')).toHaveLength(1)
})
it('keeps a clear path to the catalog after clearing favorites',async()=>{
 const user=userEvent.setup();open('/favorites')
 await user.click(screen.getByRole('button',{name:'Очистить избранное'}))
 expect(screen.getByRole('heading',{name:'В избранном пока пусто'})).toBeInTheDocument()
 expect(screen.getByRole('main').querySelectorAll('.favorites-grid article')).toHaveLength(0)
 expect(screen.getByRole('link',{name:'Перейти в каталог'})).toHaveAttribute('href','/catalog')
})
it('compares products selected outside the original demo set and does not refill a cleared comparison on return',async()=>{
 const user=userEvent.setup();open('/search?q=GR-0030')
 await user.click(screen.getByRole('button',{name:/Добавить в сравнение:/}))
 await user.click(screen.getByRole('link',{name:'Сравнение: 1'}))
 expect(screen.getAllByTestId('compare-product-card')).toHaveLength(1)
 expect(screen.getByRole('table',{name:'Сравнение характеристик'})).toHaveTextContent('GR-0030')
 await user.click(screen.getByRole('button',{name:'Очистить всё'}))
 await user.click(screen.getByRole('link',{name:'Перейти в каталог'}))
 await user.click(screen.getByRole('link',{name:'Сравнение'}))
 expect(screen.queryByTestId('compare-product-card')).not.toBeInTheDocument()
},15_000)
