export default async function run(page, ui) {
  const imgs = await page.evaluate(() =>
    [...document.querySelectorAll(".news-img-cover,.featured-img")].map((i) => {
      const r = i.getBoundingClientRect();
      const cs = getComputedStyle(i);
      return {
        src: i.src.split("/").pop(),
        w: r.width,
        h: r.height,
        opacity: cs.opacity,
        natural: i.naturalWidth,
      };
    }),
  );
  await page.evaluate(() => document.querySelector("#news")?.scrollIntoView());
  await page.waitForTimeout(800);
  const el = await page.$("#news");
  await el.screenshot({ path: "d:/MY WORK/website/qa-news-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(800);
  await page.evaluate(() => document.querySelector("#news")?.scrollIntoView());
  await page.waitForTimeout(500);
  const el2 = await page.$("#news");
  await el2.screenshot({ path: "d:/MY WORK/website/qa-news-mobile.png" });
  return { imgs };
}
