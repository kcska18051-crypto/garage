import {chromium,expect} from '@playwright/test'
import {mkdir} from 'node:fs/promises'
const base='https://kcska18051-crypto.github.io/garage'
const version=process.argv[2]??'service-account'
const browser=await chromium.launch({headless:true})
const cases=[['repair','/services/service-center/compressor-repair/screw/','Оставить заявку','Публичный демопример модели'],['paint','/services/paint-matching/automotive/','Оставить заявку','Демоавтомобиль'],['rental','/services/rental/hydraulic-jack/','Арендовать','Демонстрационная аренда']]
async function form(page,kind,phone='+7 999 123-45-67'){
  await page.getByLabel('Ваше имя',{exact:true}).fill('Демонстрация')
  await page.getByLabel('Телефон',{exact:true}).fill(phone)
  if(kind==='repair'){
    await page.getByLabel('Модель оборудования').fill('Публичный демопример модели')
    await page.getByLabel('Описание неисправности').fill('Только проверка прототипа')
  }else if(kind==='paint'){
    await page.getByLabel('Автомобиль',{exact:true}).fill('Демоавтомобиль')
    await page.getByLabel('Комментарий',{exact:true}).fill('Демонстрационный подбор')
  }else{
    const today=await page.evaluate(()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`})
    await page.getByLabel('Дата начала',{exact:true}).fill(today)
    await page.getByLabel('Дата окончания',{exact:true}).fill(today)
    await page.getByLabel('Количество',{exact:true}).fill('2')
    await page.getByLabel('Комментарий',{exact:true}).fill('Демонстрационная аренда')
  }
  await page.getByRole('button',{name:'Отправить заявку'}).click()
}
async function confirm(page,phone){
  const dialog=page.getByRole('dialog',{name:'Вход и регистрация'})
  await expect(dialog.getByRole('button',{name:'По паролю'})).toHaveCount(0)
  await dialog.getByLabel('Номер телефона').fill(phone)
  await dialog.getByRole('button',{name:'Получить код'}).click()
  await dialog.getByLabel('Код подтверждения').fill('1234')
  await dialog.getByRole('button',{name:'Войти',exact:true}).click()
}
try{
  await mkdir('../docs/project-history/screenshots/services-account/public',{recursive:true})
  for(const width of [360,390,1440,1920]){
    const context=await browser.newContext({viewport:{width,height:900}})
    const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message))
    await page.goto(`${base}/services/?v=${version}`)
    await page.evaluate(()=>sessionStorage.setItem('garage-auth-demo-session-v1','active'))
    for(const [kind,route,cta,expected] of cases){
      await page.goto(`${base}${route}?v=${version}`)
      await page.getByRole('button',{name:cta,exact:true}).click();await form(page,kind)
      const number=await page.locator('.service-request-number').innerText()
      await expect(page.getByRole('dialog')).toContainText(kind==='rental'?'Ожидает подтверждения':'Новая заявка')
      await page.getByRole('button',{name:'Посмотреть заявку в личном кабинете'}).click()
      await expect(page.locator('main')).toContainText(expected)
      const detail=new URL(page.url()),id=detail.searchParams.get('id')
      for(const slash of ['', '/']){
        const response=await page.goto(`${base}/profile/services/request${slash}?id=${id}&v=${version}`)
        expect(response.status()).toBe(200)
        await expect(page.locator('main')).toContainText(expected)
      }
      expect((await page.reload()).status()).toBe(200)
      await expect(page.locator('main')).toContainText(number.replace('Номер: ',''))
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
      if(kind==='rental'&&[390,1440].includes(width))await page.screenshot({path:`../docs/project-history/screenshots/services-account/public/detail-${width}.png`,fullPage:true})
      await page.getByRole('link',{name:'Все заявки на услуги',exact:true}).click()
      await expect(page.locator('.profile-request').filter({hasText:number.replace('Номер: ','')})).toHaveCount(1)
    }
    expect(errors).toEqual([])
    console.log(`PASS public 3 forms/same record/list/detail/reload/slash/no-slash/overflow ${width}`)
    await context.close()
  }
  const context=await browser.newContext({viewport:{width:390,height:900}})
  const page=await context.newPage()
  await page.goto(`${base}/services/paint-matching/automotive/?v=${version}`)
  await page.getByRole('button',{name:'Оставить заявку'}).click();await form(page,'paint')
  await page.getByRole('button',{name:'Посмотреть заявку в личном кабинете'}).click()
  const detail=page.url()
  await confirm(page,'+7 900 111-22-33')
  await expect(page.locator('main h1')).toHaveText('Заявка недоступна')
  await expect(page.locator('main')).not.toContainText('Демоавтомобиль')
  await page.getByRole('button',{name:'Подтвердить телефон заявки'}).click()
  await confirm(page,'8 (999) 123-45-67')
  await expect(page).toHaveURL(detail)
  await expect(page.locator('main')).toContainText('Демоавтомобиль')
  expect((await page.reload()).status()).toBe(200)
  await expect(page.locator('main')).toContainText('Демоавтомобиль')
  await page.getByRole('button',{name:'Выйти',exact:true}).click()
  await expect(page.locator('main')).not.toContainText('Демоавтомобиль')
  expect((await page.reload()).status()).toBe(200)
  await expect(page.locator('main')).not.toContainText('Демоавтомобиль')
  console.log('PASS public guest mismatch/matching phone/exact intent/reload/logout privacy')
  await context.close()
}finally{await browser.close();console.log('Own browser closed')}
