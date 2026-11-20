import {catalogProducts} from '../../data/catalogData'
import {formatTechnicalValue} from '../../data/productProperties'
import type {ProductOffer} from '../../data/productDetailData'
const model=catalogProducts[0]
const digits=(value:string)=>value.replace(',','.').replace(/[^0-9.]/g,'')
export function productSpecLink(name:string,value:string,offer?:ProductOffer){
 const params:Record<string,[string,string]>={
  'Производительность':['performance',model.specs.performance],
  'Максимальное давление':['pressure',model.specs.pressure],
  'Тип компрессора':['subcategory','screw-compressors'],
  'Тип привода':['drive',model.specs.drive],
  'Система смазки':['lubrication',model.specs.lubrication],
 }
 if(offer){params['Мощность двигателя']=['power',digits(offer.options.power)];params['Напряжение питания']=['voltage',digits(offer.options.voltage)]}
 const selection=params[name]
 if(!selection)return {value}
 const [key,raw]=selection
 const label=key==='power'||key==='voltage'?formatTechnicalValue(key,raw):value
 return {value:label,href:`/catalog/compressor-equipment?${new URLSearchParams({listing:'all',[key]:raw})}`}
}
