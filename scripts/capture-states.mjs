import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.BASE_URL || "http://127.0.0.1:3000";
const dir = "docs/screenshots/states";
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({
  headless: process.env.HEADLESS !== "false",
});
const consoleFindings = [];
for (const width of [375, 1440]) {
  const page = await browser.newPage({
    viewport: { width, height: width === 375 ? 812 : 900 },
    reducedMotion: "no-preference",
  });
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type()))
      consoleFindings.push({
        width,
        type: message.type(),
        text: message.text(),
      });
  });
  page.on("pageerror", (error) =>
    consoleFindings.push({ width, type: "pageerror", text: error.message }),
  );
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  await page.locator(".story-canvas-shell[data-ready=true]").waitFor();
  await page.waitForTimeout(1100);
  await page.screenshot({ path: `${dir}/encounter-${width}.png` });
  for (const id of ["origin", "composition", "ritual", "invitation"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${dir}/${id}-${width}.png` });
  }
  for (const name of ["Obsidian", "Neroli", "Santal"]) {
    await page.getByRole("button", { name: new RegExp(name) }).click();
    await page.locator(".collection-feature").scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await page.screenshot({
      path: `${dir}/collection-${name.toLowerCase()}-${width}.png`,
    });
  }
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.waitForTimeout(650);
  await page.screenshot({ path: `${dir}/menu-${width}.png` });
  await page.getByRole("button", { name: "Close menu" }).click();
  for (const slug of ["obsidian-01", "neroli-02", "santal-03"]) {
    await page.goto(`${base}/fragrances/${slug}`);
    await page.evaluate(() => document.fonts.ready);
    await page.locator(".product-inspector[data-ready=true]").waitFor();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `${dir}/product-${slug}-${width}.png`,
      fullPage: true,
    });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(base);
  await page.screenshot({ path: `${dir}/reduced-motion-${width}.png` });
  await page.goto(`${base}/style-guide`);
  await page.screenshot({
    path: `${dir}/style-guide-${width}.png`,
    fullPage: true,
  });
  await page.close();
}
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.route("**/models/maison-bottle.glb", (route) => route.abort());
await page.goto(`${base}/fragrances/obsidian-01`);
await page
  .locator(".inspection-hint")
  .filter({ hasText: "3D inspection is unavailable" })
  .waitFor();
await page.screenshot({ path: `${dir}/model-failure-1440.png` });
await browser.close();
await writeFile(
  "docs/browser-console.json",
  JSON.stringify(
    {
      normalStateFindings: consoleFindings,
      expectedModelFailureTestExcluded: true,
    },
    null,
    2,
  ),
);
console.log(
  `Captured chapter, variant, menu, product and fallback states in ${dir}`,
);
