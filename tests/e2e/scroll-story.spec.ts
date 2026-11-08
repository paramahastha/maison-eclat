import { test, expect } from "@playwright/test";

test("scroll unfolds the collection in both directions and controls seek the same story", async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const collection = page.locator("#collection");
  const stage = page.getByRole("region", { name: "Interactive fragrance gallery" });
  async function seek(progress: number) {
    await page.locator("[data-scroll-gallery]").evaluate((element, p) => {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY +
          Math.max(0, (element as HTMLElement).offsetHeight - window.innerHeight) * p,
        behavior: "instant",
      });
    }, progress);
  }
  if (!isMobile) {
    for (const [progress, name] of [[0.02, "obsidian"], [0.5, "neroli"], [0.98, "santal"], [0.5, "neroli"], [0.02, "obsidian"]] as const) {
      await seek(progress);
      await expect(collection).toHaveAttribute("data-variant", name);
    }
  } else {
    await stage.scrollIntoViewIfNeeded();
  }
  await page.getByRole("button", { name: "Next fragrance", exact: true }).click();
  await expect(collection).toHaveAttribute("data-variant", "neroli");
  await stage.focus();
  await page.keyboard.press("ArrowRight");
  await expect(collection).toHaveAttribute("data-variant", "santal");
  await page.keyboard.press("ArrowLeft");
  await expect(collection).toHaveAttribute("data-variant", "neroli");
  const box = await stage.boundingBox();
  await page.mouse.move(box!.x + box!.width * 0.65, box!.y + box!.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width * 0.25, box!.y + box!.height * 0.5, { steps: 10 });
  await page.mouse.up();
  await expect(collection).toHaveAttribute("data-variant", "santal");
  await expect(stage).toHaveCSS("touch-action", "pan-y");
  await expect(collection.getByRole("link", { name: "Explore Santal" })).toHaveAttribute("href", "/fragrances/santal-03");
});

test("short viewports and reduced motion have no held chapters", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 540 });
  await page.goto("/");
  await expect(page.locator(".hero-frame")).toHaveCSS("position", "relative");
  await expect(page.locator(".collection-exhibit")).toHaveCSS("position", "relative");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".hero-frame")).toHaveCSS("position", "relative");
  await expect(page.locator(".collection-exhibit")).toHaveCSS("position", "relative");
  await expect(page.locator(".story-canvas-shell")).toHaveCount(0);
});

test("animated composition stays within tablet width throughout its turn", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("#composition .botanical")).toBeAttached();
  for (const offset of [0, 0.5, 1]) {
    await page.locator("#composition").evaluate((element, progress) => {
      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top - window.innerHeight + (element.clientHeight + window.innerHeight) * progress, behavior: "instant" });
    }, offset);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(768);
  }
});
