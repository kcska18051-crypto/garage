import { addSearchHistory, clearSearchHistory, readSearchHistory } from './searchHistory'

describe('search history', () => {
  beforeEach(() => localStorage.clear())
  it('starts with demonstration requests, then keeps five newest unique requests', () => {
    expect(readSearchHistory()).toEqual(['Компрессор', 'Краскопульт', 'Набор инструмента'])
    ;['Компрессор', 'Краскопульт', 'Домкрат', 'Инструмент', 'Осушитель', 'Ресивер', 'Сварка', 'компрессор'].forEach(addSearchHistory)
    expect(readSearchHistory()).toEqual(['компрессор', 'Сварка', 'Ресивер', 'Осушитель', 'Инструмент'])
  })

  it('keeps an explicitly cleared history empty', () => {
    clearSearchHistory()
    expect(readSearchHistory()).toEqual([])
  })
})
