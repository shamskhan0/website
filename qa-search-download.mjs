/**
 * Browser QA: mobile viewports content parity + website search + APK download UI.
 * Exports run(page) — driven by the browser-automation skill runner.
 */
const BASE = 'http://localhost:4173'

export default async function run(page) {
  const out = { viewports: {}, search: {}, download: {}, consoleErrors: [], failedRequests: [] }
  page.on('console', (m) => { if (m.type() === 'error') out.consoleErrors.push(m.text().slice(0, 160)) })
  page.on('response', (r) => { if (r.status() >= 400) out.failedRequests.push(`${r.status()} ${r.url().slice(0, 120)}`) })

  const snapshot = async () => ({
    sections: await page.evaluate(() =>
      ['top', 'app', 'news', 'contact'].map((id) => ({ id, present: !!document.getElementById(id) }))),
    heroTitle: await page.evaluate(() => document.querySelector('.hero-section h1')?.textContent?.trim() ?? null),
    downloadButtons: await page.evaluate(() =>
      [...document.querySelectorAll('a.button')].map((a) => a.textContent.trim().replace(/\s+/g, ' '))
        .filter((t) => /download/i.test(t))),
    newsCount: await page.evaluate(() => document.querySelectorAll('.news-card, article, .news-item').length),
    searchToggle: await page.evaluate(() => !!document.querySelector('.search-toggle')),
    horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
  })
  // 1) Desktop baseline
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(800)
  out.viewports.desktop = await snapshot()

  // 2) Mobile parity: 390x844 (iPhone) + 360x740 (Android)
  for (const [name, vp] of [['mobile390', { width: 390, height: 844 }], ['mobile360', { width: 360, height: 740 }]]) {
    await page.setViewportSize(vp)
    await page.waitForTimeout(600)
    out.viewports[name] = await snapshot()
  }

  // 3) Search: open via header toggle, type, count results, click first hit
  await page.setViewportSize({ width: 390, height: 844 })
  await page.click('.search-toggle')
  await page.waitForSelector('.search-window', { timeout: 5000 })
  await page.fill('.search-input', 'apk')
  await page.waitForTimeout(400)
  out.search.hitsForApk = await page.evaluate(() => document.querySelectorAll('.search-hit').length)
  await page.fill('.search-input', 'security')
  await page.waitForTimeout(400)
  out.search.hitsForSecurity = await page.evaluate(() => document.querySelectorAll('.search-hit').length)
  await page.fill('.search-input', 'zzqqxx')
  await page.waitForTimeout(400)
  out.search.emptyState = await page.evaluate(() => !!document.querySelector('.search-empty'))
  await page.fill('.search-input', 'apk')
  await page.waitForTimeout(300)
  await page.keyboard.press('Enter').catch(() => {})
  const first = await page.$('.search-hit')
  if (first) await first.click()
  await page.waitForTimeout(700)
  out.search.closedAfterSelect = await page.evaluate(() => !document.querySelector('.search-backdrop'))

  // 4) Download button + retry UI presence
  await page.evaluate(() => document.querySelector('#app')?.scrollIntoView())
  await page.waitForTimeout(500)
  out.download.buttonText = await page.evaluate(() =>
    document.querySelector('#app .button')?.textContent?.trim().replace(/\s+/g, ' ') ?? null)
  out.download.href = await page.evaluate(() => document.querySelector('#app .button')?.getAttribute('href') ?? null)
  const btn = await page.$('#app .button')
  if (btn) { await btn.click(); await page.waitForTimeout(5000) }
  out.download.retryVisible = await page.evaluate(() => !!document.querySelector('.apk-download-retry'))

  await page.setViewportSize({ width: 390, height: 844 })
  await page.evaluate(() => document.querySelector('#app')?.scrollIntoView())
  await page.waitForTimeout(400)
  const el = await page.$('#app')
  if (el) await el.screenshot({ path: 'd:/MY WORK/website/qa-download-mobile.png' })

  out.consoleErrors = out.consoleErrors.slice(0, 10)
  out.failedRequests = out.failedRequests.slice(0, 10)
  return out
}
