import { expect, test } from '@playwright/test'

test('homepage exposes the approved sections and working product actions', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Оборудование для автосервиса')
  await expect(page.locator('.hero__slide:visible')).toHaveCount(1)
  await expect(page.getByRole('heading', { name: 'Популярные категории' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Оборудование для автосервиса' })).toBeVisible()
  await expect(page.getByText('Trommelberg', { exact: true })).toBeVisible()
  await expect(page.getByText('Русская техника', { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: /Добавить в корзину/ }).first().click()
  await expect(page.locator('[aria-label="Корзина: 1"]:visible')).toBeVisible()
  await page.getByRole('button', { name: 'Получить консультацию' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
})

test('homepage alternates three product collections with two single divider banners', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('main > .hero + .popular-categories')).toHaveCount(1)
  await expect(page.locator('.popular-categories .category-card')).toHaveCount(6)
  await expect(page.locator('.product-showcase')).toHaveCount(3)
  await expect(page.locator('.product-showcase .product-card')).toHaveCount(15)
  await expect(page.locator('.divider-banner')).toHaveCount(2)

  const sequence = await page.locator('main > .product-showcase, main > .divider-banner').evaluateAll((items) => items.map((item) => item.classList.contains('divider-banner') ? 'banner' : 'products'))
  expect(sequence).toEqual(['products', 'banner', 'products', 'banner', 'products'])

  await expect(page.locator('.business-section')).toHaveCount(0)
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

test('brand products appear once between promotions and services', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 2, name: 'Товары Remeza' })).toHaveCount(1)
  await expect(page.locator('main > .promotions + .product-showcase + [aria-label="Основные услуги"]')).toHaveCount(1)
  await expect(page.locator('.promotions + .product-showcase .product-card')).toHaveCount(5)
  await expect(page.locator('.promotions + .product-showcase').getByRole('link', { name: 'Смотреть все' })).toHaveAttribute('href', '/brand/remeza')
})

test('rail controls move brands and products without clipping card content', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  await page.goto('/')
  const brandRail = page.locator('.brand-grid')
  const before = await brandRail.evaluate((element) => element.scrollLeft)
  await page.getByRole('button', { name: 'Следующие бренды' }).click()
  await expect.poll(() => brandRail.evaluate((element) => element.scrollLeft)).toBeGreaterThan(before)

  const productRail = page.locator('.product-grid').first()
  const productBefore = await productRail.evaluate((element) => element.scrollLeft)
  await page.getByRole('button', { name: 'Следующие товары: Оборудование для автосервиса' }).click()
  await expect.poll(() => productRail.evaluate((element) => element.scrollLeft)).toBeGreaterThan(productBefore)

  await page.setViewportSize({ width: 390, height: 844 })
  const cardsFit = await page.locator('.category-card, .product-card, .divider-banner, .promotion-card, .service-cards article, .useful-grid > a').evaluateAll((cards) => cards.every((card) => card.scrollHeight <= card.clientHeight + 1))
  expect(cardsFit).toBe(true)
})

test('all hero slides keep the same outer dimensions', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    const hero = page.locator('.hero')
    const dots = page.getByRole('button', { name: /Перейти к слайду/ })

    const baseline = await hero.boundingBox()
    expect(baseline).not.toBeNull()

    for (let index = 1; index < 3; index += 1) {
      await dots.nth(index).click()
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

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`hero keeps copy out and shows subtle pagination below at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/')

    await expect(page.locator('.hero__stage .hero__copy, .hero__stage a')).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Предыдущий слайд' })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Следующий слайд' })).toHaveCount(0)
    await expect(page.getByRole('button', { name: /автопрокрутку/ })).toHaveCount(0)
    await expect(page.getByRole('button', { name: /Перейти к слайду/ })).toHaveCount(3)

    const stage = await page.locator('.hero__stage').boundingBox()
    const pagination = await page.locator('.hero__pagination').boundingBox()
    expect(stage).not.toBeNull()
    expect(pagination).not.toBeNull()
    expect(pagination!.y).toBeGreaterThanOrEqual(stage!.y + stage!.height + 6)

    const dots = await page.locator('.hero__pagination button').evaluateAll((buttons) => buttons.map((button) => {
      const box = button.getBoundingClientRect()
      const style = getComputedStyle(button)
      return { width: box.width, height: box.height, radius: style.borderRadius }
    }))
    expect(dots.every((dot) => dot.width <= 14 && dot.height <= 14 && dot.radius === '50%')).toBe(true)
  })
}

for (const viewport of [{ width: 1440, height: 900, min: 200, max: 240 }, { width: 390, height: 844, min: 180, max: 220 }]) {
  test(`hero and category rhythm follows the compact layout at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/')

    const hero = await page.locator('.hero').boundingBox()
    expect(hero).not.toBeNull()
    expect(hero!.height).toBeGreaterThanOrEqual(viewport.min)
    expect(hero!.height).toBeLessThanOrEqual(viewport.max)

    const stage = await page.locator('.hero__stage').boundingBox()
    expect(stage).not.toBeNull()
    expect(stage!.width).toBeLessThanOrEqual(viewport.width - (viewport.width < 768 ? 32 : 64))
  })
}

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`homepage keeps promotional media compact at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/')

    const limits = viewport.width < 768
      ? { hero: 220, category: 190, productMedia: 170, service: 200, about: 320, useful: 170 }
      : { hero: 240, category: 240, productMedia: 170, service: 220, about: 360, useful: 180 }
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
    } else {
      const columns = await page.locator('.category-grid').evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length)
      expect(columns).toBe(6)
    }
  })
}
