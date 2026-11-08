import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.BASE_URL || "http://127.0.0.1:3009";
const out = "docs/screenshots/wet-study/final";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: process.env.HEADLESS === "true" });
const report = { layouts: [], handoffs: [], errors: [] };
try {
  for (const [name, width, height, reducedMotion] of [
    ["desktop", 1440, 900, "no-preference"],
    ["tablet", 768, 1024, "no-preference"],
    ["phone", 375, 812, "no-preference"],
    ["wide", 1920, 1080, "no-preference"],
    ["reduced", 375, 812, "reduce"],
  ]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion });
    page.on("pageerror", (error) => report.errors.push({ name, error: error.message }));
    page.on("console", (message) => {
      if (message.type() === "error") report.errors.push({ name, error: message.text() });
    });
    await page.goto(`${base}/fragrances/santal-03`);
    await page.evaluate(() => document.fonts.ready);
    if (reducedMotion === "no-preference") await page.locator('.product-inspector[data-ready="true"]').waitFor();
    await page.waitForTimeout(1100);
    await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
    report.layouts.push(await page.evaluate((name) => ({
      name, overflow: document.documentElement.scrollWidth > innerWidth,
      titleTop: document.querySelector("h1").getBoundingClientRect().top,
      canvases: document.querySelectorAll("canvas").length,
    }), name));
    if (name === "desktop") {
      await page.getByRole("button", { name: "Rotate bottle right" }).focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(400);
      await page.locator(".product-visual").screenshot({ path: `${out}/keyboard-turn.png` });
      for (const slug of ["obsidian-01", "neroli-02"]) {
        await page.goto(`${base}/fragrances/${slug}`);
        await page.locator('.product-inspector[data-ready="true"]').waitFor();
        await page.waitForTimeout(1100);
        await page.locator(".product-visual").screenshot({ path: `${out}/${slug}.png` });
      }
    }
    await page.close();
  }

  // Hold the model request to compare the fallback with its settled live pose.
  for (const [name, width, height] of [["desktop", 1440, 900], ["phone", 375, 812]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "no-preference" });
    let release;
    const gate = new Promise((resolve) => { release = resolve; });
    await page.route("**/models/maison-bottle.glb", async (route) => { await gate; await route.continue(); });
    await page.goto(`${base}/fragrances/santal-03`);
    await page.locator(".product-poster img").evaluate((image) => image.decode());
    const still = await page.locator(".product-inspector").screenshot({ path: `${out}/${name}-poster.png` });
    release();
    await page.locator('.product-inspector[data-ready="true"]').waitFor();
    await page.waitForTimeout(1100);
    const live = await page.locator(".product-inspector").screenshot({ path: `${out}/${name}-live.png` });
    const a = await sharp(still).removeAlpha().raw().toBuffer();
    const b = await sharp(live).removeAlpha().raw().toBuffer();
    report.handoffs.push({ name, meanChannelDifference: a.reduce((sum, value, i) => sum + Math.abs(value - b[i]), 0) / a.length });
    await page.close();
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference",
    recordVideo: { dir: `${out}/video`, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  await page.goto(`${base}/fragrances/santal-03`);
  await page.locator('.product-inspector[data-ready="true"]').waitFor();
  const start = Date.now();
  const bounds = await page.locator(".product-inspector").boundingBox();
  const files = [];
  for (const [index, milliseconds] of [1050, 1480, 1690, 1790, 1900, 2100, 2450, 2900, 3500].entries()) {
    await page.waitForTimeout(Math.max(0, milliseconds - (Date.now() - start)));
    const file = `${out}/water-${index}.png`;
    await page.screenshot({ path: file, clip: { x: bounds.x, y: bounds.y + bounds.height * .65, width: bounds.width, height: bounds.height * .35 } });
    files.push(file);
  }
  await page.waitForTimeout(5000);
  const video = page.video();
  await context.close();
  await video.saveAs(`${out}/water-motion.webm`);
  const tiles = await Promise.all(files.map((file) => sharp(file).resize(380, 130).png().toBuffer()));
  await sharp({ create: { width: 1140, height: 390, channels: 3, background: "#191c17" } })
    .composite(tiles.map((input, i) => ({ input, left: i % 3 * 380, top: Math.floor(i / 3) * 130 })))
    .png().toFile(`${out}/water-contact.png`);
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
