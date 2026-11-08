import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const base = process.env.BASE_URL || "http://127.0.0.1:3000";
const dir = process.env.CAPTURE_DIR || "docs/screenshots";
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({
  headless: process.env.HEADLESS !== "false",
});
for (const [width, height] of [
  [375, 812],
  [768, 1024],
  [1024, 900],
  [1440, 900],
  [1920, 1080],
]) {
  const page = await browser.newPage({
    viewport: { width, height },
    reducedMotion: process.env.MOTION === "on" ? "no-preference" : "reduce",
  });
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  if (process.env.MOTION === "on")
    await page.locator(".story-canvas-shell[data-ready=true]").waitFor();
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `${dir}/home-${width}.png`, fullPage: true });
  if (width === 1440 || width === 375)
    await page.screenshot({ path: `${dir}/hero-${width}.png` });
  await page.close();
}
await browser.close();
console.log(`Captured ${dir}`);
