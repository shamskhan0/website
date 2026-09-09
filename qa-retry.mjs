export default async function run(page) {
  // Block all APK fetches -> HEAD probes fail -> bucket fallback fails -> retry UI
  await page.route('**/media/apk/**', (route) => route.abort())
  await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1500)
  await page.evaluate(() => document.querySelector('#app')?.scrollIntoView())
  const btn = await page.$('#app .button')
  await btn.click()
  await page.waitForTimeout(4000)
  const retry = await page.evaluate(() => {
    const el = document.querySelector('.apk-download-retry')
    return el ? { text: el.textContent.trim().slice(0, 90), hasBtn: !!el.querySelector('.apk-retry-btn') } : null
  })
  return { retry }
}
