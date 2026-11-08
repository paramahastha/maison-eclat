import { chromium } from '@playwright/test';
import { mkdir, rename } from 'node:fs/promises';
const base = process.env.BASE_URL || 'http://127.0.0.1:3002';
const dir = 'docs/motion-upgrade';
await mkdir(`${dir}/recording`, { recursive: true });
const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference', recordVideo: { dir: `${dir}/recording`, size: { width: 1440, height: 900 } } });
const page = await context.newPage();
await page.goto(base);
await page.evaluate(() => document.fonts.ready);
await page.locator('.story-canvas-shell[data-ready=true]').waitFor();
await page.waitForTimeout(1200);
await page.evaluate(async () => {
  const end = document.documentElement.scrollHeight - innerHeight;
  const start = performance.now();
  await new Promise(resolve => {
    function step() {
      const progress = Math.min(1, (performance.now() - start) / 24000);
      scrollTo({ top: end * progress, behavior: 'instant' });
      if (progress < 1) requestAnimationFrame(step); else resolve();
    }
    requestAnimationFrame(step);
  });
});
await page.waitForTimeout(600);
await page.getByRole('button', { name: /Neroli/ }).click();
await page.waitForTimeout(900);
await page.getByRole('button', { name: 'Next fragrance', exact: true }).click();
await page.waitForTimeout(900);
const video = page.video();
await context.close();
await rename(await video.path(), `${dir}/scroll-story.webm`);
await browser.close();
console.log(`${dir}/scroll-story.webm`);
