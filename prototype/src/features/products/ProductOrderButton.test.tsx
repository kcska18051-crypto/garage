import {render,screen,within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router-dom'
import {ProductOrderButton} from './ProductOrderButton'
const product={id:'compressor-43',name:'Компрессор для заказа',sku:'GR-0043'}
it('opens the selected product, validates phone and consent, and confirms without charging',async()=>{
 const user=userEvent.setup();render(<MemoryRouter><ProductOrderButton product={product}/></MemoryRouter>)
 const opener=screen.getByRole('button',{name:'Под заказ'});await user.click(opener)
 const dialog=screen.getByRole('dialog',{name:'Под заказ'}),form=within(dialog)
 expect(form.getByLabelText('Выбранный товар')).toHaveValue(`${product.name} · Артикул: ${product.sku}`)
 expect(form.getByLabelText('Выбранный товар')).toHaveAttribute('readonly')
 await user.click(form.getByRole('button',{name:'Отправить заявку'}));expect(form.getByLabelText('Ваше имя')).toHaveFocus()
 await user.type(form.getByLabelText('Ваше имя'),'Мария');await user.type(form.getByLabelText('Телефон'),'incorrect')
 await user.click(form.getByRole('button',{name:'Отправить заявку'}));expect(form.getByLabelText('Телефон')).toHaveFocus()
 await user.clear(form.getByLabelText('Телефон'));await user.type(form.getByLabelText('Телефон'),'+79991234567')
 for(const checkbox of form.getAllByRole('checkbox'))await user.click(checkbox)
 await user.click(form.getByRole('button',{name:'Отправить заявку'}))
 expect(form.getByRole('status')).toHaveTextContent('Заявка принята. Уточним возможность поставки, стоимость и сроки.')
 expect(dialog).toHaveTextContent(product.sku)
 await user.click(form.getByRole('button',{name:'Закрыть'}))
 expect(screen.queryByRole('dialog')).not.toBeInTheDocument();expect(opener).toHaveFocus()
})
it('closes on Escape and restores its own trigger',async()=>{
 const user=userEvent.setup();render(<MemoryRouter><ProductOrderButton product={product}/></MemoryRouter>)
 const opener=screen.getByRole('button',{name:'Под заказ'});await user.click(opener)
 await user.keyboard('{Escape}');expect(screen.queryByRole('dialog')).not.toBeInTheDocument();expect(opener).toHaveFocus()
})
