import {chromium} from '@playwright/test'

const base='https://kcska18051-crypto.github.io/garage'
const version=process.argv[2]??'services'
const paths=['/services','/services/service-center','/services/service-center/compressor-repair',...['screw','piston','diesel'].map(id=>`/services/service-center/compressor-repair/${id}`),'/services/paint-matching','/services/rental',...['hydraulic-jack','tool-set','piston-compressor'].map(id=>`/services/rental/${id}`),'/services/workshop']
const browser=await chromium.launch({headless:true})
const check=(condition,message)=>{if(!condition)throw new Error(message)}
try {
  const context=await browser.newContext({viewport:{width:1440,height:900}})
  const page=await context.newPage()
  const errors=[];page.on('pageerror',error=>errors.push(error.message))
  for(const path of paths) {
    for(const suffix of ['', '/']) {
      const response=await page.goto(`${base}${path}${suffix}?v=${version}`)
      check(response?.status()===200,`${path}${suffix}: HTTP ${response?.status()}`)
      await page.locator('main.services-page h1').waitFor()
    }
    check((await page.reload())?.status()===200,`${path}: reload`)
    await page.locator('main.services-page h1').waitFor()
    console.log(`PASS HTTP200 slash/no-slash/reload ${path}`)
  }
  const asset=await page.locator('script[type=module]').getAttribute('src')
  console.log(`Published asset: ${asset}`)
  for(const width of [360,390,1024,1440,1920,2560]) {
    await page.setViewportSize({width,height:900})
    for(const path of ['/services','/services/service-center/compressor-repair/screw','/services/paint-matching','/services/rental','/services/rental/hydraulic-jack']) {
      await page.goto(`${base}${path}/?v=${version}`)
      await page.locator('main.services-page h1').waitFor()
      check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width} ${path}`)
    }
    const trigger=page.getByRole('button',{name:'Арендовать',exact:true})
    await trigger.click()
    const dialog=page.getByRole('dialog')
    await dialog.getByLabel('Ваше имя',{exact:true}).fill('Демонстрация')
    await dialog.getByLabel('Телефон',{exact:true}).fill('+7 (999) 123-45-67')
    const today=await page.evaluate(()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`})
    await dialog.getByLabel('Дата начала',{exact:true}).fill(today)
    await dialog.getByLabel('Дата окончания',{exact:true}).fill(today)
    const submit=dialog.getByRole('button',{name:'Отправить заявку'})
    await submit.scrollIntoViewIfNeeded();await submit.click()
    await dialog.getByText('Заявка на аренду отправлена',{exact:true}).waitFor()
    check((await dialog.innerText()).includes('не бронь'),'missing demo disclaimer')
    await page.keyboard.press('Escape')
    check(await trigger.evaluate(el=>el===document.activeElement),'focus not restored')
    console.log(`PASS public layout/rental demo/focus ${width}`)
  }
  check(errors.length===0,`JS errors: ${errors.join('; ')}`)
  await context.close()
  console.log('PASS services public checks; own browser closing')
} finally {await browser.close()}
