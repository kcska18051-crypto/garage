import { fireEvent, render, screen } from '@testing-library/react'
import { CommerceProvider, useCommerce } from '../../state/CommerceState'
import { ProductExtras } from './ProductExtras'
import { defaultOffer } from '../../data/productDetailData'
function Harness() { const {cartItems} = useCommerce();return <><ProductExtras/><output aria-label="Состав корзины">{JSON.stringify(cartItems)}</output></> }
describe('compact product extras', () => {
  it('adds the chosen quantity of an option with the parent product', () => {
    render(<CommerceProvider><Harness/></CommerceProvider>)
    fireEvent.click(screen.getByRole('checkbox',{name:'Выбрать опцию Модуль осушения воздуха'}))
    fireEvent.change(screen.getByRole('spinbutton',{name:'Количество Модуль осушения воздуха'}),{target:{value:'2'}})
    fireEvent.click(screen.getByRole('button',{name:'Добавить товар с выбранными опциями'}))
    const cart = JSON.parse(screen.getByLabelText('Состав корзины').textContent!)
    expect(cart).toEqual(expect.arrayContaining([expect.objectContaining({id:defaultOffer.id}),expect.objectContaining({id:'option-dryer',quantity:2})]))
  })
  it('adds a companion product independently', () => {
    render(<CommerceProvider><Harness/></CommerceProvider>)
    fireEvent.click(screen.getByRole('button',{name:'Добавить в корзину: Компрессорное масло'}))
    const cart = JSON.parse(screen.getByLabelText('Состав корзины').textContent!)
    expect(cart).toEqual(expect.arrayContaining([expect.objectContaining({id:'supply-oil',quantity:1})]))
  })
})
