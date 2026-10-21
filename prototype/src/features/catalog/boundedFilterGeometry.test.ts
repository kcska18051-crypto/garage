import {expect,it} from 'vitest'
import {boundedFilterGeometry} from './boundedFilterGeometry'
const base={slotTop:-200,boundaryBottom:1600,headerBottom:70,viewportHeight:900,naturalHeight:1200,gap:12,minHeight:180}
it('pins under the actual header beyond the product-grid end',()=>{
  expect(boundedFilterGeometry(base)).toEqual({fixed:true,top:82,height:806,reserveHeight:806})
})
it('scrolls naturally before reaching the header',()=>{
  expect(boundedFilterGeometry({...base,slotTop:300})).toEqual({fixed:false,top:300,height:806,reserveHeight:806})
})
it('shrinks the internal viewport rather than disappearing as the footer approaches',()=>{
  expect(boundedFilterGeometry({...base,boundaryBottom:700})).toEqual({fixed:true,top:82,height:606,reserveHeight:806})
})
it('moves with the main boundary when even the minimum working area cannot fit',()=>{
  expect(boundedFilterGeometry({...base,boundaryBottom:200})).toEqual({fixed:true,top:8,height:180,reserveHeight:806})
})
it('does not stretch a naturally short filter',()=>{
  expect(boundedFilterGeometry({...base,naturalHeight:100,boundaryBottom:300})).toEqual({fixed:true,top:82,height:100,reserveHeight:100})
})
