// Existing prototype values only. Not a supplier specification.
export const performanceValues = ['10','11','15','30']
export const technicalLabels: Record<string,string> = { performance:'Производительность', voltage:'Напряжение', power:'Мощность', pressure:'Максимальное давление', receiver:'Ресивер', drive:'Тип привода', lubrication:'Тип смазки', noise:'Уровень шума', country:'Страна производства' }
const units: Record<string,string> = { performance:'л/мин', voltage:'В', power:'кВт', pressure:'бар', receiver:'л', noise:'дБ' }
const words: Record<string,string> = { belt:'Ременной',direct:'Прямой',oil:'Масляный','oil-free':'Безмасляный',belarus:'Беларусь',italy:'Италия',china:'Китай',russia:'Россия' }
export const formatTechnicalValue = (key:string,value:string) => key==='receiver' && value==='0' ? 'Без ресивера' : words[value] ?? `${value.replace('.',',')}${units[key] ? ` ${units[key]}` : ''}`
export const formatTechnicalSpecs = (specs:Record<string,string>) => Object.fromEntries(Object.entries(specs).map(([key,value])=>[technicalLabels[key]??key,formatTechnicalValue(key,value)]))
