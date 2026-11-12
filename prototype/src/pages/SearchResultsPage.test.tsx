import {render,screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter,useLocation} from 'react-router-dom'
import {SearchResultsPage} from './SearchResultsPage'
import {CommerceProvider} from '../state/CommerceState'
import {searchCatalogProducts} from '../data/searchResults'
import {findSearchProducts} from '../data/productRegistry'
const Location=()=>{const location=useLocation();return <output data-testid="location">{location.search}</output>}
const open=(query='?q=компрессор')=>render(<MemoryRouter initialEntries={['/search'+query]}><CommerceProvider><SearchResultsPage/><Location/></CommerceProvider></MemoryRouter>)
beforeEach(()=>{localStorage.clear();HTMLElement.prototype.scrollIntoView=vi.fn()})
it('preserves every matching product and its destination, including exact SKU and non-catalog products',()=>{
 for(const query of ['компрессор','GR-0001','набор инструмента','SUP-01','стенд диагностический','шлифовальная машинка']){
  const original=findSearchProducts(query),adapted=searchCatalogProducts(query)
  expect(adapted.map(p=>p.id)).toEqual(original.map(p=>p.id))
  for(const product of adapted){
   const source=original.find(p=>p.id===product.id)!
   expect('/product/'+product.slug).toBe(source.href)
   if(['Нет в наличии','Снят с производства'].includes(source.availabilityStatus))expect(product.availabilityLabel).toBe(source.availabilityStatus)
  }
 }
})
it('sorts without filters and ignores filter parameters from older search URLs',async()=>{
 const user=userEvent.setup();open('?q=компрессор&brand=remeza&price-to=1&subcategory=receivers')
 expect(screen.queryByRole('complementary',{name:'Фильтры поиска'})).not.toBeInTheDocument()
 expect(screen.queryByRole('navigation',{name:'Уточнить раздел'})).not.toBeInTheDocument()
 expect(screen.getByRole('heading',{name:/Найдено/})).toHaveTextContent('Найдено '+searchCatalogProducts('компрессор').length)
 await user.selectOptions(screen.getByRole('combobox',{name:'Сортировка'}),'price-asc')
 expect(screen.getByTestId('location')).toHaveTextContent('q=')
 expect(screen.getByTestId('location')).toHaveTextContent('sort=price-asc')
 expect(screen.getByTestId('location')).not.toHaveTextContent('brand=')
})
it('paginates results while keeping query and returns focus to the result heading',async()=>{
 const user=userEvent.setup();open()
 const first=screen.getAllByRole('link',{name:/Открыть товар:/})[0].getAttribute('href')
 await user.click(screen.getByRole('button',{name:'Следующая страница'}))
 expect(screen.getByTestId('location')).toHaveTextContent('page=2')
 expect(screen.getByTestId('location')).toHaveTextContent('q=')
 expect(screen.getAllByRole('link',{name:/Открыть товар:/})).toHaveLength(15)
 expect(screen.getAllByRole('link',{name:/Открыть товар:/})[0]).not.toHaveAttribute('href',first)
 expect(screen.getByRole('heading',{name:/Найдено/})).toHaveFocus()
})
it('offers a new query and catalog navigation for an unmatched or blank search',async()=>{
 const user=userEvent.setup();open('?q=неттакоготовара')
 expect(screen.getByRole('heading',{name:'По вашему запросу ничего не найдено'})).toBeInTheDocument()
 expect(screen.getByRole('link',{name:'Перейти в каталог'})).toHaveAttribute('href','/catalog')
 const input=screen.getByRole('searchbox',{name:'Изменить поисковый запрос'})
 await user.clear(input)
 await user.click(screen.getByRole('button',{name:'Найти'}))
 expect(screen.getByRole('heading',{name:'Что вы ищете для мастерской?'})).toBeInTheDocument()
 await user.click(screen.getByRole('button',{name:'Remeza'}))
 expect(screen.getByTestId('location')).toHaveTextContent('q=Remeza')
 expect(screen.getAllByRole('link',{name:/Открыть товар:/}).length).toBeGreaterThan(0)
})
