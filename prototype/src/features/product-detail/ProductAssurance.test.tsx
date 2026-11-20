import {render,screen,within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router-dom'
import {ProductAssurance} from './ProductAssurance'
import {ProductDocumentRequest} from './ProductDocumentRequest'
import {productDetail} from '../../data/productDetailData'
it('requests documents for the selected offer and validates contact before confirming',async()=>{
 const user=userEvent.setup(),offer=productDetail.offers[2]
 render(<MemoryRouter><ProductAssurance offer={offer}/></MemoryRouter>)
 expect(screen.getByRole('complementary',{name:'Документы и гарантия'})).toHaveTextContent(offer.sku)
 expect(screen.getByRole('link',{name:'Условия гарантии'})).toHaveAttribute('href','/warranty')
 const trigger=screen.getByRole('button',{name:'Запросить документы'});await user.click(trigger)
 const form=within(screen.getByRole('dialog',{name:'Запросить документы'}))
 expect(form.getByLabelText('Выбранный товар')).toHaveTextContent(offer.sku)
 await user.type(form.getByLabelText('Ваше имя'),'Мария')
 await user.type(form.getByLabelText('Телефон или электронная почта'),'invalid')
 await user.click(form.getByRole('button',{name:'Отправить запрос'}))
 expect(form.getByLabelText('Телефон или электронная почта')).toHaveFocus()
 await user.clear(form.getByLabelText('Телефон или электронная почта'))
 await user.type(form.getByLabelText('Телефон или электронная почта'),'client@example.ru')
 for(const checkbox of form.getAllByRole('checkbox'))await user.click(checkbox)
 await user.click(form.getByRole('button',{name:'Отправить запрос'}))
 expect(form.getByRole('status')).toHaveTextContent('Запрос принят')
 expect(form.getByText(/Артикул:/)).toHaveTextContent(offer.sku)
 await user.click(form.getByRole('button',{name:'Закрыть'}));expect(trigger).toHaveFocus()
})
it('prefills the requested document and returns focus on Escape',async()=>{
 const user=userEvent.setup()
 render(<MemoryRouter><ProductDocumentRequest documentName="Паспорт изделия" label="Запросить паспорт"/></MemoryRouter>)
 const trigger=screen.getByRole('button',{name:'Запросить паспорт'});await user.click(trigger)
 expect(screen.getByLabelText('Комментарий (необязательно)')).toHaveValue('Паспорт изделия')
 await user.keyboard('{Escape}');expect(screen.queryByRole('dialog')).not.toBeInTheDocument();expect(trigger).toHaveFocus()
})
