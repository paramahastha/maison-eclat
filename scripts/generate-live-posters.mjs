import { chromium } from "@playwright/test";
import sharp from "sharp";

// Capture the actual home scene so its first paint matches the interactive bottle.
// Start a local server first, then run: BASE_URL=http://localhost:3001 node scripts/generate-live-posters.mjs
const baseURL = process.env.BASE_URL || "http://localhost:3001";
const browser = await chromium.launch({ headless: false });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
await page.emulateMedia({ reducedMotion: "no-preference" });

try {
  await page.goto(baseURL);
  await page.locator('.story-canvas-shell[data-ready="true"]').waitFor({
    state: "attached",
    timeout: 20_000,
  });
  for (const [index, name] of ["obsidian", "neroli", "santal"].entries()) {
    if (index) {
      await page.locator(".variant-selector button").nth(index).click();
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(700);
    }
    const active = await page.locator(".hero-stage .bottle-poster").getAttribute("alt");
    if (!active?.toLowerCase().includes(name))
      throw new Error(`Expected ${name} in the hero, found ${active}`);

    const isolation = await page.addStyleTag({
      content:
        "html,body,.home-story{background:transparent!important;background-image:none!important}" +
        ".home-story>.chapter,body>header,body>footer,body>.skip-link,nextjs-portal{visibility:hidden!important}",
    });
    const screenshot = await page.screenshot({ omitBackground: true });
    await isolation.evaluate((element) => element.remove());

    const { data, info } = await sharp(screenshot)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    let left = info.width;
    let top = info.height;
    let right = 0;
    let bottom = 0;
    // The bottle lives in the right half. Ignore any development badge or UI.
    for (let y = 80; y < Math.min(info.height, Math.round(info.height * 0.91)); y++) {
      for (let x = Math.round(info.width / 2); x < Math.round(info.width * 0.95); x++) {
        if (data[(y * info.width + x) * info.channels + 3] < 16) continue;
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      }
    }
    if (right <= left || bottom <= top)
      throw new Error(`No visible ${name} bottle found in the scene capture`);
    const bottle = await sharp(screenshot)
      .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
      .resize({ height: 970 })
      .png()
      .toBuffer();
    const { width } = await sharp(bottle).metadata();
    if (!width || width > 1000)
      throw new Error(`Unexpected ${name} bottle width: ${width}`);
    await sharp({
      create: {
        width: 1000,
        height: 1200,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: bottle, left: Math.round((1000 - width) / 2), top: 90 }])
      .webp({ quality: 94 })
      .toFile(`public/posters/${name}-live.webp`);
    console.log(`${name}: captured ${right - left + 1}×${bottom - top + 1}`);
  }
} finally {
  await browser.close();
}
