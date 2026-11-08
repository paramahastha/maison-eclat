import { test, expect } from "@playwright/test";

test.beforeEach(async ({ browserName, page }) => {
  test.skip(
    browserName !== "chromium",
    "GPU lifecycle validation runs in Chromium; cross-browser content is covered separately.",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
});

test("one home canvas survives chapter changes and context loss reveals the poster", async ({
  page,
}) => {
  await page.goto("/");
  const shell = page.locator(".story-canvas-shell");
  await expect(shell).toHaveAttribute("data-ready", "true", {
    timeout: 30_000,
  });
  for (const poster of await page.locator("[data-scene-window] .bottle-poster").all())
    await expect(poster).toHaveCSS("visibility", "hidden");
  await expect(page.locator("#origin .bottle-poster")).toHaveCSS(
    "visibility",
    "visible",
  );
  await expect(page.locator("canvas")).toHaveCount(1);
  await page
    .locator("canvas")
    .evaluate((el) => el.setAttribute("data-test-original", "yes"));
  for (const id of [
    "origin",
    "composition",
    "collection",
    "ritual",
    "invitation",
  ]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect(page.locator("canvas")).toHaveAttribute(
      "data-test-original",
      "yes",
    );
  }
  await page
    .locator("canvas")
    .evaluate((el) =>
      el.dispatchEvent(new Event("webglcontextlost", { cancelable: true })),
    );
  await expect(shell).toHaveCount(0);
  await expect(page.locator("[data-scene-active]")).toHaveCount(0);
  await expect(page.locator(".invitation-stage .bottle-poster")).toHaveCSS(
    "visibility",
    "visible",
  );
  await expect(page.getByRole("status")).toContainText(
    "Static product artwork",
  );
});

test("the hero clears before the Origin still enters, including on reverse scroll", async ({ page }) => {
  await page.goto("/");
  const shell = page.locator(".story-canvas-shell");
  await expect(shell).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
  const origin = page.locator("#origin");
  const seam = await origin.evaluate(
    (element) => element.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2,
  );
  async function inspectSeam() {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), seam);
    await expect(shell).toHaveCSS("opacity", "0");
    await expect(origin.locator(".bottle-poster")).toHaveCSS("visibility", "visible");
  }
  await inspectSeam();
  await page.locator("#composition").evaluate((element) => {
    const rect = element.getBoundingClientRect();
    window.scrollTo({
      top: rect.top + window.scrollY + rect.height / 2 - window.innerHeight / 2,
      behavior: "instant",
    });
  });
  await expect.poll(async () => Number(await shell.evaluate((el) => getComputedStyle(el).opacity))).toBeGreaterThan(0.7);
  await inspectSeam();
});

test("Santal stays visible through the final held collection stop", async ({ page, isMobile }) => {
  test.skip(isMobile, "The held collection is a desktop composition.");
  await page.goto("/");
  const shell = page.locator(".story-canvas-shell");
  await expect(shell).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
  const gallery = page.locator("[data-scroll-gallery]");
  for (const progress of [0.85, 0.94, 1]) {
    await gallery.evaluate((element, value) => {
      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: top + (element.clientHeight - window.innerHeight) * value,
        behavior: "instant",
      });
    }, progress);
    await expect(page.locator("#collection")).toHaveAttribute("data-variant", "santal");
    await expect.poll(async () => Number(await shell.evaluate((element) => getComputedStyle(element).opacity))).toBeGreaterThan(0.95);
  }
  await gallery.evaluate((element) => {
    const top = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top + element.clientHeight - window.innerHeight + 650,
      behavior: "instant",
    });
  });
  await expect.poll(async () => Number(await shell.evaluate((element) => getComputedStyle(element).opacity))).toBeLessThan(0.5);
  await gallery.evaluate((element) => {
    const top = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top + (element.clientHeight - window.innerHeight) * 0.94,
      behavior: "instant",
    });
  });
  await expect.poll(async () => Number(await shell.evaluate((element) => getComputedStyle(element).opacity))).toBeGreaterThan(0.95);
});

test("Obsidian is visible from the first held collection frame and on reverse scroll", async ({ page, isMobile }) => {
  test.skip(isMobile, "The held collection is a desktop composition.");
  await page.goto("/");
  const shell = page.locator(".story-canvas-shell");
  await expect(shell).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
  const gallery = page.locator("[data-scroll-gallery]");
  for (const progress of [0, 0.1, 0.2, 0]) {
    await gallery.evaluate((element, value) => {
      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: top + (element.clientHeight - window.innerHeight) * value,
        behavior: "instant",
      });
    }, progress);
    await expect(page.locator("#collection")).toHaveAttribute("data-variant", "obsidian");
    await expect.poll(async () => Number(await shell.evaluate((element) => getComputedStyle(element).opacity))).toBeGreaterThan(0.95);
  }
});

test("bottle inspection supports controls, horizontal drag and reset", async ({
  page,
}) => {
  await page.goto("/fragrances/obsidian-01");
  const stage = page.locator(".product-inspector");
  await expect(stage).toHaveAttribute("data-ready", "true", {
    timeout: 30_000,
  });
  await page.getByRole("button", { name: "Rotate bottle right" }).click();
  await expect(stage).not.toHaveAttribute("data-angle", "-0.25");
  await page.getByRole("button", { name: "Reset view" }).click();
  await expect(stage).toHaveAttribute("data-angle", "-0.25");
  const bounds = await stage.boundingBox();
  await page.mouse.move(
    bounds!.x + bounds!.width / 2,
    bounds!.y + bounds!.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    bounds!.x + bounds!.width / 2 + 90,
    bounds!.y + bounds!.height / 2,
    { steps: 8 },
  );
  await page.mouse.up();
  await expect(stage).not.toHaveAttribute("data-angle", "-0.25");
  await page.getByRole("button", { name: "Reset view" }).click();
  await expect(stage).toHaveAttribute("data-angle", "-0.25");
  await expect(stage).toHaveCSS("touch-action", "pan-y");
});

test("failed model request falls back without losing the product page", async ({
  page,
}) => {
  await page.route("**/models/maison-bottle.glb", (route) => route.abort());
  await page.goto("/fragrances/neroli-02");
  await expect(page.locator(".inspection-hint")).toContainText(
    "3D inspection is unavailable",
    { timeout: 30_000 },
  );
  await expect(page.locator(".product-poster img")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Neroli");
});

test("product context loss stops the wet scene and restores its still artwork", async ({ page }) => {
  await page.goto("/fragrances/santal-03");
  await expect(page.locator(".product-inspector")).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
  await page.locator(".inspector-canvas canvas").evaluate((canvas) => {
    canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true }));
  });
  await expect(page.locator(".inspector-canvas")).toHaveCount(0);
  await expect(page.locator(".product-poster img")).toHaveCSS("opacity", "1");
  await expect(page.getByRole("status")).toContainText("3D inspection is unavailable");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Santal");
});
