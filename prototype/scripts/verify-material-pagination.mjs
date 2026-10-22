import assert from 'node:assert/strict'

export async function verifyMaterialPagination(browser, { base, width, fixtures = false, expectedAsset, screenshotRoot }) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: width < 768 })
  try {
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    if (fixtures) {
      // Test-only data boundary on the local Vite server. No production files,
      // bundles, public records or user browser storage are modified.
      const records = ['news', 'article'].flatMap(kind => Array.from({ length: 10 }, (_, i) => ({
        kind, slug: `fixture-${kind}-${i + 1}`, title: `Тестовый материал ${kind} ${i + 1}`, category: kind === 'news' ? 'company' : 'guides', categoryLabel: 'Тестовая рубрика',
        date: `2026-10-${String(i + 1).padStart(2, '0')}`, dateLabel: `${i + 1} октября 2026`, summary: 'Только тестовый набор для проверки пагинации.', intro: 'Не опубликованный материал.', coverTone: i % 6, sections: [],
      })))
      await page.route(/\/src\/data\/materialsData\.ts(?:\?|$)/, async route => {
        const response = await route.fetch()
        await route.fulfill({ response, body: `${await response.text()}\nmaterials.splice(0, materials.length, ...materials.filter(item => item.kind === 'review'), ...${JSON.stringify(records)});` })
      })
    }
    const goto = async route => {
      const response = await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' })
      await page.locator('main h1').waitFor()
      if (expectedAsset) { assert.equal(response.status(), 200); assert((await page.locator('script[type=module]').getAttribute('src')).includes(expectedAsset)) }
    }
    const count = number => page.waitForFunction(number => document.querySelectorAll('[data-testid=material-card]').length === number, number)
    const overflow = async () => { assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Document overflow') }
    const shot = async state => { if (screenshotRoot) await page.screenshot({ path: `${screenshotRoot}/${state}-${width}.png`, fullPage: true }) }
    const aligned = async () => {
      await page.waitForFunction(() => {
        const heading = document.querySelector('.materials-heading').getBoundingClientRect()
        const pinned = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--catalog-pinned-header-height')) || 0
        return heading.top >= pinned && heading.top <= pinned + 40
      })
      // Verify settled geometry, not a transient frame during compact-header changes.
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve))))))
      const bounds = await page.evaluate(() => ({ top: document.querySelector('.materials-heading').getBoundingClientRect().top, scroll: scrollY, pinned: Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--catalog-pinned-header-height')) || 0 }))
      assert(bounds.top >= bounds.pinned && bounds.top <= bounds.pinned + 40, `Settled heading overlapped: ${JSON.stringify(bounds)}`)
    }
    for (const [path, kind, category, title] of [['/news/', 'news', 'company', 'Новости'], ['/articles/', 'article', 'guides', 'Статьи']]) {
      await goto(path)
      const total = fixtures ? 10 : 6
      await count(Math.min(9, total))
      assert.equal(await page.locator('main h1').innerText(), title)
      assert((await page.locator('.materials-controls').innerText()).includes(`${total} материалов`))
      await page.evaluate(() => document.fonts.ready)
      const tops = await page.getByTestId('material-card').evaluateAll(items => items.map(item => Math.round(item.getBoundingClientRect().top)))
      assert.equal(tops.filter(top => top === tops[0]).length, width >= 1200 ? 3 : width > 600 ? 2 : 1)
      await overflow(); await shot(`${kind}-first`)
      if (fixtures) {
        const first = await page.locator('.materials-grid h2 a').evaluateAll(links => links.map(link => link.href))
        const secondPage = page.getByRole('link', { name: 'Страница 2', exact: true })
        await secondPage.scrollIntoViewIfNeeded(); await secondPage.focus(); await page.keyboard.press('Enter')
        await count(1); await aligned()
        assert.equal(await page.getByRole('link', { name: 'Страница 2', exact: true }).getAttribute('aria-current'), 'page')
        const last = await page.locator('.materials-grid h2 a').getAttribute('href')
        assert(!first.some(href => href.endsWith(last)), 'Duplicate across pages')
        assert.equal(first.length + 1, 10)
        await shot(`${kind}-last`)
        await page.reload({ waitUntil: 'domcontentloaded' }); await count(1)
        assert.equal(new URL(page.url()).searchParams.get('page'), '2')
        await page.getByRole('link', { name: 'Страница 1', exact: true }).click(); await count(9)
        await page.goBack(); await count(1)
        await page.goForward(); await count(9)
        await page.getByRole('link', { name: 'Страница 2', exact: true }).click(); await count(1)
        await page.getByLabel('Сортировка').selectOption('oldest'); await count(9); await aligned()
        assert.equal(new URL(page.url()).searchParams.get('page'), null)
        assert((await page.locator('.materials-grid h2').first().innerText()).endsWith(' 1'))
        await page.getByRole('link', { name: 'Страница 2', exact: true }).click(); await count(1)
        assert.equal(new URL(page.url()).searchParams.get('sort'), 'oldest')
      } else assert.equal(await page.getByRole('navigation', { name: 'Пагинация материалов' }).count(), 0)
      await page.getByLabel('Рубрика').selectOption(category)
      assert.equal(new URL(page.url()).searchParams.get('page'), null)
      const filteredCount = fixtures ? 10 : 3
      await count(Math.min(9, filteredCount))
      if (fixtures) {
        await page.getByRole('link', { name: 'Страница 2', exact: true }).click(); await count(1)
        assert.equal(new URL(page.url()).searchParams.get('category'), category)
        assert.equal(new URL(page.url()).searchParams.get('sort'), 'oldest')
      } else assert.equal(await page.getByRole('navigation', { name: 'Пагинация материалов' }).count(), 0)
      const detail = page.locator('.materials-grid h2 a').first()
      const href = await detail.getAttribute('href')
      const name = await detail.innerText()
      await detail.click(); await page.getByRole('heading', { level: 1, name, exact: true }).waitFor()
      assert(new URL(page.url()).pathname.replace(/\/$/, '').endsWith(href.replace('/garage', '').replace(/\/$/, '')))
      await page.goBack(); await page.getByRole('heading', { level: 1, name: title, exact: true }).waitFor()
      for (const value of ['0', '1.5', 'NaN', '999']) {
        await goto(`${path}?page=${value}&sort=oldest&tracking=kept`)
        await page.waitForFunction(({ fixtures, value }) => new URL(location.href).searchParams.get('page') === (fixtures && value === '999' ? '2' : null), { fixtures, value })
        assert.equal(new URL(page.url()).searchParams.get('sort'), 'oldest')
        assert.equal(new URL(page.url()).searchParams.get('tracking'), 'kept')
      }
      await overflow()
    }
    await goto('/reviews/')
    await count(4)
    await page.getByRole('link', { name: 'Страница 2', exact: true }).click(); await count(2)
    await overflow(); assert.deepEqual(errors, [])
    return { width, fixtures, newsAndArticles: fixtures ? '9+1' : '6/no fake second page', reviews: '4+2 unchanged', errors }
  } finally { await context.close() }
}
