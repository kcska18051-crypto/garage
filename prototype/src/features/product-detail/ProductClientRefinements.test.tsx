import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ProductCommunity } from './ProductCommunity'
import { CommercialProposal } from './CommercialProposal'
import { productDetail, money } from '../../data/productDetailData'
import { getCartPricing } from '../cart/cartPricing'

it('shows newest demo review first, moves carousel and reveals the shop answer', async()=>{
 const user=userEvent.setup();render(<MemoryRouter><ProductCommunity/></MemoryRouter>)
 expect(screen.getByText('Алексей · пример')).toBeInTheDocument()
 expect(screen.getByRole('button',{name:'Предыдущий отзыв'})).toBeDisabled()
 await user.click(screen.getByRole('button',{name:'Следующий отзыв'}))
 expect(screen.getByText('Марина · пример')).toBeInTheDocument()
 const question=screen.getByText('Как уточнить комплектацию выбранного варианта?').closest('details')!
 expect(question.open).toBe(false)
 await user.click(screen.getByText('Как уточнить комплектацию выбранного варианта?'))
 expect(question.open).toBe(true)
 expect(within(question).getByText('ГАРАЖ · пример ответа магазина')).toBeVisible()
})

it('validates the local feedback draft and requires explicit legal consent',async()=>{
 const user=userEvent.setup();render(<MemoryRouter><ProductCommunity/></MemoryRouter>)
 await user.click(screen.getByRole('button',{name:'Задать вопрос'}))
 const dialog=within(screen.getByRole('dialog',{name:'Задать вопрос'}))
 await user.click(dialog.getByRole('button',{name:'Сохранить черновик'}))
 expect(dialog.getByText('Укажите имя')).toBeInTheDocument()
 await user.type(dialog.getByLabelText('Ваше имя'),'Анна')
 await user.type(dialog.getByLabelText('Email для ответа'),'anna@example.ru')
 await user.type(dialog.getByLabelText('Ваш вопрос'),'Как уточнить состав поставки?')
 const phone=dialog.getByLabelText('Телефон (необязательно)')
 await user.type(phone,'123')
 for(const check of dialog.getAllByRole('checkbox')) await user.click(check)
 await user.click(dialog.getByRole('button',{name:'Сохранить черновик'}))
 expect(phone).toHaveFocus()
 expect(dialog.getByText('Укажите корректный телефон или оставьте поле пустым')).toBeInTheDocument()
 await user.clear(phone)
 await user.click(dialog.getByRole('button',{name:'Сохранить черновик'}))
 expect(dialog.getByText('Черновик готов')).toBeInTheDocument()
 expect(dialog.getByRole('status')).toHaveTextContent('Отправка и публикация появятся после подключения сервиса')
})

it('prints the selected variant, quantity and clickable product in the same email preview',async()=>{
 const user=userEvent.setup(),offer=productDetail.offers[2]
 render(<CommercialProposal offer={offer} quantity={3} onClose={()=>{}}/>)
 const dialog=within(screen.getByRole('dialog',{name:'Коммерческое предложение'}))
 expect(dialog.getByText(`Артикул: ${offer.sku}`)).toBeInTheDocument()
 expect(dialog.getByText('3 шт.')).toBeInTheDocument()
 expect(dialog.getAllByText(money(offer.price*3).replace(/\s/g,' '))).toHaveLength(2)
 expect(dialog.getByRole('link',{name:productDetail.name})).toHaveAttribute('href',expect.stringContaining(`/product/${offer.id}`))
 expect(dialog.getByText('Носит рекомендательный характер и не является публичной офертой.')).toBeInTheDocument()
 await user.click(dialog.getByRole('button',{name:'Отправить на e-mail'}))
 await user.type(dialog.getByLabelText('Email получателя'),'buyer@example.ru')
 await user.click(dialog.getByRole('button',{name:'Предпросмотр письма'}))
 expect(dialog.getByRole('status')).toHaveTextContent('Сервис отправки не подключён')
 expect(dialog.getByRole('link',{name:productDetail.name})).toBeInTheDocument()
})

it('uses cart pricing rows after promotion and excludes quote-only items',()=>{
 const lines=[{id:productDetail.offers[1].id,quantity:2},{id:'unknown-quote',quantity:1}]
 const pricing=getCartPricing(lines,'123')
 render(<CommercialProposal lines={lines} pricing={pricing} onClose={()=>{}}/>)
 const dialog=within(screen.getByRole('dialog',{name:'Коммерческое предложение'}))
 expect(dialog.getAllByText(money(pricing.totalCents/100).replace(/\s/g,' '))).toHaveLength(2)
 expect(dialog.getByText('Позиции с запросом цены не включены в сумму.')).toBeInTheDocument()
 expect(dialog.getByText(/учтён в суммах позиций/)).toBeInTheDocument()
})
