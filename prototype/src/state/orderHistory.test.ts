import { readOrderHistory, saveOrderHistory, orderHistoryStorageKey } from './orderHistory'

it('rejects malformed and unsupported order history instead of exposing partial records', () => {
  for (const value of ['{broken', JSON.stringify({version:2,records:[]}), JSON.stringify({version:1,records:[{ownerPhone:'79990000000',checkoutId:'bad',order:{}}]})]) {
    localStorage.setItem(orderHistoryStorageKey,value)
    expect(readOrderHistory()).toEqual([])
  }
})

it('falls back safely when browser storage cannot be read or written', () => {
  const read = vi.spyOn(Storage.prototype,'getItem').mockImplementation(() => { throw new Error('blocked') })
  const write = vi.spyOn(Storage.prototype,'setItem').mockImplementation(() => { throw new Error('blocked') })
  try {
    expect(readOrderHistory()).toEqual([])
    expect(() => saveOrderHistory([])).not.toThrow()
  } finally { read.mockRestore(); write.mockRestore() }
})
