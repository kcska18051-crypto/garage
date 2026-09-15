import { expect, test } from '@playwright/test'

test('homepage exposes the approved sections and working product actions', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Оборудование и материалы')
  await expect(page.locator('.hero__slide:visible')).toHaveCount(1)
  await expect(page.getByRole('heading', { name: 'Популярные категории' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Подборки товаров' })).toBeVisible()
  await expect(page.getByText('Trommelberg', { exact: true })).toBeVisible()
  await expect(page.getByText('Русская техника', { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: /Добавить в корзину/ }).first().click()
  await expect(page.locator('[aria-label="Корзина: 1"]:visible')).toBeVisible()
  await page.getByRole('button', { name: 'Получить консультацию' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
})

test('homepage compact sections expose product and content tabs, promotions and three services', async ({ page }) => {
  await page.goto('/')

  const productTabs = page.getByRole('tablist', { name: 'Подборка товаров' })
  await expect(productTabs.getByRole('tab', { name: 'Новинки' })).toHaveAttribute('aria-selected', 'true')
  await productTabs.getByRole('tab', { name: 'Хиты продаж' }).click()
  await expect(productTabs.getByRole('tab', { name: 'Хиты продаж' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('.product-showcase .product-card')).toHaveCount(5)

  await expect(page.locator('.business-section')).toHaveCount(0)
  await expect(page.locator('.promo-strip a')).toHaveCount(3)
  await expect(page.getByRole('heading', { name: 'Акции' })).toBeVisible()
  await expect(page.locator('.promotion-card')).toHaveCount(3)
  await expect(page.locator('.promotion-card__deadline')).toHaveCount(3)

  const services = page.getByRole('region', { name: 'Основные услуги' })
  for (const name of ['Сервисный центр', 'Аренда оборудования', 'Подбор автоэмали']) {
    await expect(services.getByRole('heading', { name })).toBeVisible()
  }

  const contentTabs = page.getByRole('tablist', { name: 'Материалы' })
  for (const name of ['Новости', 'Статьи', 'Отзывы']) await expect(contentTabs.getByRole('tab', { name })).toBeVisible()
  await contentTabs.getByRole('tab', { name: 'Отзывы' }).click()
  await expect(page.getByRole('link', { name: 'Смотреть все отзывы' })).toBeVisible()
})

test('rail controls move brands and products without clipping card content', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  await page.goto('/')
  const brandRail = page.locator('.brand-grid')
  const before = await brandRail.evaluate((element) => element.scrollLeft)
  await page.getByRole('button', { name: 'Следующие бренды' }).click()
  await expect.poll(() => brandRail.evaluate((element) => element.scrollLeft)).toBeGreaterThan(before)

  const productRail = page.locator('.product-grid')
  const productBefore = await productRail.evaluate((element) => element.scrollLeft)
  await page.getByRole('button', { name: 'Следующие товары' }).click()
  await expect.poll(() => productRail.evaluate((element) => element.scrollLeft)).toBeGreaterThan(productBefore)

  await page.setViewportSize({ width: 390, height: 844 })
  const cardsFit = await page.locator('.category-card, .product-card, .promo-strip__item, .promotion-card, .service-cards article, .useful-grid > a').evaluateAll((cards) => cards.every((card) => card.scrollHeight <= card.clientHeight + 1))
  expect(cardsFit).toBe(true)
})

test('all hero slides keep the same outer dimensions', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    const hero = page.locator('.hero')
    const next = page.getByRole('button', { name: 'Следующий слайд' })
    await hero.hover()

    const baseline = await hero.boundingBox()
    expect(baseline).not.toBeNull()

    for (let index = 1; index < 3; index += 1) {
      await next.click()
      const current = await hero.boundingBox()
      expect(current).not.toBeNull()
      expect(Math.abs(current!.width - baseline!.width)).toBeLessThan(0.5)
      expect(Math.abs(current!.height - baseline!.height)).toBeLessThan(0.5)
    }
  }
})

test('dark CTA outline buttons stay legible and copy is layered above decoration', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  for (const selector of ['.final-cta button.button:not(.button--light)']) {
    const styles = await page.locator(selector).evaluate((element) => {
      const computed = getComputedStyle(element)
      return { background: computed.backgroundColor, color: computed.color }
    })
    expect(styles).toEqual({ background: 'rgba(0, 0, 0, 0)', color: 'rgb(255, 255, 255)' })
  }

  const layers = await page.locator('.final-cta').evaluate((section) => {
    const copy = section.querySelector(':scope > div:last-child')!
    const art = section.querySelector('.final-cta__art')!
    return {
      art: Number(getComputedStyle(art).zIndex),
      copy: Number(getComputedStyle(copy).zIndex),
    }
  })
  expect(layers.copy).toBeGreaterThan(layers.art)
})

test('hero heading leaves a safe area for its CTA and slider controls', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  const headingSize = await page.locator('.hero__slide:not([hidden]) h1').evaluate((heading) => parseFloat(getComputedStyle(heading).fontSize))
  const cta = await page.locator('.hero__slide:not([hidden]) .hero__copy .button').boundingBox()
  const controls = await page.locator('.hero__controls').boundingBox()
  expect(headingSize).toBeLessThanOrEqual(68)
  expect(cta).not.toBeNull()
  expect(controls).not.toBeNull()
  expect(cta!.y + cta!.height + 12).toBeLessThanOrEqual(controls!.y)
})

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`homepage keeps promotional media compact at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/')

    const limits = viewport.width < 768
      ? { hero: 400, category: 190, productMedia: 170, service: 200, about: 320, useful: 170 }
      : { hero: 500, category: 240, productMedia: 170, service: 220, about: 360, useful: 180 }
    const selectors = {
      hero: '.hero',
      category: '.category-card',
      productMedia: '.product-card__media',
      service: '.service-cards__art',
      about: '.about-section__art',
      useful: '.useful-grid__art',
    }

    for (const [name, selector] of Object.entries(selectors)) {
      const box = await page.locator(selector).first().boundingBox()
      expect(box, `${name} is rendered`).not.toBeNull()
      expect(box!.height, `${name} height at ${viewport.width}px`).toBeLessThanOrEqual(limits[name as keyof typeof limits])
    }

    const categoryHeading = await page.getByRole('heading', { name: 'Популярные категории' }).boundingBox()
    expect(categoryHeading).not.toBeNull()
    expect(categoryHeading!.y, 'the next navigation section starts within the first viewport').toBeLessThan(viewport.height)

    if (viewport.width < 768) {
      const columns = await page.locator('.category-grid').evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length)
      expect(columns).toBe(2)
    }
  })
}
