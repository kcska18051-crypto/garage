import { catalogProducts, compressorSubcategories, catalogBrands } from './catalogData'
import { promotionPrice } from './promotionPricing'
import { checkoutProducts } from './checkoutData'
import { prototypeData } from './prototypeData'
import { productDetail } from './productDetailData'
describe('shared demo promotion data', () => {
  it('keeps 2–3 discounted examples in each populated compressor category and brand', () => {
    for (const id of compressorSubcategories.map(c=>c.id)) {
      const items = catalogProducts.filter(p=>p.subcategoryId===id)
      const count = items.filter(p=>promotionPrice(p.id,p.price,p.purchaseMode==='quote').oldPrice).length
      expect(count,id).toBeGreaterThanOrEqual(2); expect(count,id).toBeLessThanOrEqual(3)
    }
    for (const brand of catalogBrands) { const count = catalogProducts.filter(p=>p.brandId===brand.id && promotionPrice(p.id,p.price,p.purchaseMode==='quote').oldPrice).length; expect(count,brand.id).toBeGreaterThanOrEqual(2); expect(count,brand.id).toBeLessThanOrEqual(3) }
  })
  it('does not give quoted products fake discounts and preserves checkout prices', () => {
    for(const p of catalogProducts) {
      if(p.purchaseMode==='quote') expect(promotionPrice(p.id,p.price,true).oldPrice).toBeUndefined()
      expect(checkoutProducts.find(item=>item.id===p.id)?.price).toBe(p.price)
    }
    for(const p of prototypeData.products) expect(checkoutProducts.find(item=>item.id===p.id)?.price).toBe(Number(p.price.replace(/\D/g,'')))
    for(const offer of productDetail.offers) expect(promotionPrice(offer.id,offer.price).oldPrice).toBe(offer.oldPrice)
  })
})
