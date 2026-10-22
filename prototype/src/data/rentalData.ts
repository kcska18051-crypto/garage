import {getDemoProduct} from './productRegistry'
import {defaultOffer, productDetail} from './productDetailData'

export const rentalCategories = [
  {id:'compressors',title:'Аренда компрессоров',heading:'Компрессоры в аренду',href:'/services/rental/compressors',text:'Демонстрационные компрессоры для временных задач мастерской.'},
  {id:'tools',title:'Аренда инструмента',heading:'Инструмент в аренду',href:'/services/rental/tools',text:'Примеры инструмента и оборудования рабочего поста.'},
]
export const rentalItems = [
  {id:'hydraulic-jack',sourceId:'product-1',categoryId:'tools',text:'Демонстрационный домкрат для знакомства с заявкой на временное использование.'},
  {id:'tool-set',sourceId:'product-2',categoryId:'tools',text:'Демонстрационный набор для знакомства с арендой инструмента для рабочего поста.'},
  {id:'piston-compressor',sourceId:'product-4',categoryId:'compressors',text:'Демонстрационный пример компрессорного оборудования для временных задач.'},
  {id:'screw-compressor',sourceId:defaultOffer.id,categoryId:'compressors',text:'Существующая демонстрационная модель Remeza. Параметры не подтверждены поставщиком.'},
].map((item,index)=>{
  const source=getDemoProduct(item.sourceId)!
  const isDetailed=item.sourceId===defaultOffer.id
  const specs:Array<[string,string]>=isDetailed
    ? [['Напряжение',defaultOffer.options.voltage],['Мощность',defaultOffer.options.power],...productDetail.keySpecs.slice(0,2)]
    : Object.entries(source.specs).slice(0,4)
  return {...item,title:isDetailed?productDetail.name:source.name,sku:source.sku,specs,href:`/services/rental/${item.id}`,art:index}
})

export const rentalForSaleProduct = (productId:string) => rentalItems.find(item=>item.sourceId===productId)
