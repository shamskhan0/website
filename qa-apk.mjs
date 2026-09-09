export default async function run(page, ui) {
  // Scroll to #app section and inspect the download button + its href
  const info = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('a.button, button.button')].map(a => ({ text: a.textContent.trim().slice(0, 40), href: a.getAttribute('href') })).filter(b => /apk|download/i.test(b.text))
    return btns
  })
  await page.evaluate(() => document.querySelector('#app')?.scrollIntoView())
  await page.waitForTimeout(500)
  // Listen for downloads / network
  const failed = []
  page.on('response', r => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url().slice(0, 120)) })
  let downloadInfo = null
  page.on('download', d => { downloadInfo = d.suggestedFilename() })
  // Click the app-release section download button
  const btn = await page.$('#app a.button, #app button.button-primary, #app .button')
  if (btn) { await btn.click(); await page.waitForTimeout(4000) }
  return { info, failed, downloadInfo }
}
