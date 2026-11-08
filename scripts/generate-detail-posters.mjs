import { chromium } from "@playwright/test";
import sharp from "sharp";

// Start a local server, then run with BASE_URL=http://localhost:3001.
// Opt into 3D under reduced motion to capture the deterministic dry opening frame, before the entry animation.
const baseURL = process.env.BASE_URL || "http://localhost:3001";
const browser = await chromium.launch({ headless: process.env.HEADLESS !== "false" });

try {
  for (const [suffix, viewport] of [
    ["", { width: 1440, height: 900 }],
    ["-mobile", { width: 375, height: 812 }],
  ]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const [name, slug] of [
      ["obsidian", "obsidian-01"],
      ["neroli", "neroli-02"],
      ["santal", "santal-03"],
    ]) {
      await page.goto(`${baseURL}/fragrances/${slug}`);
      await page.getByRole("button", { name: "Enable 3D inspection" }).click();
      await page.locator('.product-inspector[data-ready="true"]').waitFor({
        timeout: 30_000,
      });
      await page.locator(".inspector-canvas").evaluate((element) => {
        element.style.opacity = "1";
      });
      await page.locator(".product-poster").evaluate((element) => {
        element.style.visibility = "hidden";
      });
      await page.waitForTimeout(1100);
      const screenshot = await page.locator(".product-inspector").screenshot();
      await sharp(screenshot)
        .webp({ quality: 92, effort: 5 })
        .toFile(`public/posters/${name}-detail${suffix}.webp`);
      console.log(`${name}: ${suffix || "desktop"} detail poster captured`);
    }
    await page.close();
  }
} finally {
  await browser.close();
}
