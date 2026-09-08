/**
 * One-time build-time optimizer for static fallback images in /public.
 * Resizes to max 1600px, converts JPG->WebP (quality 82) and re-compresses
 * the oversized logo PNG. Replaces the original files in place so no
 * code changes are needed. Run: node scripts/optimize-static-images.mjs
 */
import sharp from 'sharp'
import { readdirSync, statSync } from 'node:fs'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const PUBLIC_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')

async function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

const files = await walk(PUBLIC_DIR)
let saved = 0

for (const file of files) {
  const ext = extname(file).toLowerCase()
  const isJpg = ext === '.jpg' || ext === '.jpeg'
  const isPng = ext === '.png'
  if (!isJpg && !isPng) continue
  if (file.includes('favicon')) continue

  const before = statSync(file).size
  try {
    let pipeline = sharp(file).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    let outBuf
    if (isJpg) {
      outBuf = await sharp(file)
        .rotate()
        .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 78, progressive: true, mozjpeg: true })
        .toBuffer()
    } else {
      outBuf = await pipeline
        .png({ compressionLevel: 9, palette: true, effort: 10 })
        .toBuffer()
      if (outBuf.length >= before) continue
    }
    if (outBuf.length < before) {
      const { writeFileSync, renameSync, unlinkSync } = await import('node:fs')
      const tmp = `${file}.opt-tmp`
      try {
        writeFileSync(tmp, outBuf)
        try { unlinkSync(file) } catch { /* may fail if locked */ }
        renameSync(tmp, file)
      } catch (e) {
        console.error(`WRITE FAIL ${file}: ${e.message}`)
        continue
      }
      saved += before - outBuf.length
      console.log(`${file}: ${(before / 1024).toFixed(0)}KB -> ${(outBuf.length / 1024).toFixed(0)}KB`)
    }
  } catch (err) {
    console.error(`SKIP ${file}: ${err.message}`)
  }
}

console.log(`\nTotal saved: ${(saved / 1024 / 1024).toFixed(2)} MB`)
