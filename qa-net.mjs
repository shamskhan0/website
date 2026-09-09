export default async function run(page, ui) {
  const failed = []
  page.on('response', r => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()) })
  await page.evaluate(() => document.querySelector('#news')?.scrollIntoView())
  await page.waitForTimeout(3000)
  const imgs = await page.evaluate(() =>
    [...document.querySelectorAll('.news-img-cover,.featured-img')].map(i => ({ src: i.currentSrc, nat: i.naturalWidth, opacity: getComputedStyle(i).opacity }))
  )
  return { imgs, failed }
}
