import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("complete story, anchors, fragrance selection, product deep links and 404", async ({
  page,
  isMobile,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "A presencethat remains.",
  );
  await expect(page.locator("main>section")).toHaveCount(6);
  await page
    .getByRole("link", { name: "Discover the collection", exact: true })
    .click();
  await expect(page).toHaveURL(/#collection$/);
  await page.getByRole("button", { name: /Neroli/ }).click();
  await expect(page.locator("#collection")).toHaveAttribute(
    "data-variant",
    "neroli",
  );
  await expect(page.locator("#collection h3")).toHaveText("Neroli");
  await expect(page.locator(".hero-stage img")).toHaveAttribute(
    "alt",
    /Neroli/,
  );
  await expect(page.locator(".hero-bottom")).toContainText("NEROLI · NO. 02");
  await page
    .locator("#collection")
    .getByRole("link", { name: /Explore Neroli/ })
    .click();
  await expect(page).toHaveURL(/fragrances\/neroli-02$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Neroli");
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Neroli");
  if (isMobile) {
    await page.locator("summary").filter({ hasText: "heart notes" }).click();
    await expect(
      page.locator("details").filter({ hasText: "heart notes" }),
    ).toContainText("Jasmine & Orange blossom");
  } else {
    await page.getByRole("tab", { name: /heart/ }).click();
    await expect(page.getByRole("tabpanel")).toContainText(
      "Jasmine & Orange blossom",
    );
  }
  for (const [slug, name] of [
    ["obsidian-01", "Obsidian"],
    ["santal-03", "Santal"],
  ]) {
    await page.goto(`/fragrances/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(name);
  }
  await page.goto("/fragrances/not-a-fragrance");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "not found",
  );
  await page.getByRole("link", { name: /Return to the collection/ }).click();
  await expect(page).toHaveURL(/\/#collection$/);
  expect(errors).toEqual([]);
});

test("menu traps focus, closes with Escape and navigation, and restores focus", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open menu" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  const close = dialog.getByRole("button", { name: "Close menu" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("link", { name: /Collection/ })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole("link", { name: /Composition/ }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#composition$/);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("reduced motion preserves content, notes and all variant destinations without a canvas", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".story-canvas-shell")).toHaveCount(0);
  await expect(page.locator("#origin h2")).toBeVisible();
  if (isMobile) {
    await page.locator("summary").filter({ hasText: "base notes" }).click();
    await expect(
      page.locator("details").filter({ hasText: "base notes" }),
    ).toHaveAttribute("open", "");
    await expect(page.locator("details[open]")).toContainText(
      "Vetiver & Amberwood",
    );
  } else {
    const top = page.getByRole("tab", { name: /top/ });
    await top.focus();
    await page.keyboard.press("End");
    await expect(page.getByRole("tab", { name: /base/ })).toBeFocused();
    await expect(page.getByRole("tabpanel")).toContainText(
      "Vetiver & Amberwood",
    );
  }
  await page.getByRole("button", { name: /Santal/ }).click();
  await expect(
    page.locator("#collection").getByRole("link", { name: /Explore Santal/ }),
  ).toHaveAttribute("href", "/fragrances/santal-03");
  await expect(page.locator("#composition")).toContainText("Cardamom");
});

test("WebGL unavailable and model failures retain useful original posters", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value: function (type: string, ...args: unknown[]) {
        return type.startsWith("webgl")
          ? null
          : Reflect.apply(original, this, [type, ...args]);
      },
    });
  });
  await page.goto("/");
  await expect(page.locator(".story-canvas-shell")).toHaveCount(0);
  await expect(page.locator(".hero-stage img")).toBeVisible();
  await page.goto("/fragrances/obsidian-01");
  await expect(page.locator(".inspection-hint")).toContainText(
    "3D is unavailable",
  );
  await expect(page.locator(".product-poster img")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Obsidian",
  );
});

test("no horizontal overflow and no serious accessibility violations", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of ["/", "/fragrances/obsidian-01"]) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
    if (path === "/") {
      await page.getByRole("button", { name: /Neroli/ }).click();
      const selected = await new AxeBuilder({ page })
        .include("#collection")
        .withTags(["wcag2aa", "wcag21aa"])
        .analyze();
      expect(selected.violations).toEqual([]);
      await page.getByRole("button", { name: "Open menu" }).click();
      const menu = await new AxeBuilder({ page })
        .include("dialog")
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();
      expect(menu.violations).toEqual([]);
      await page.getByRole("button", { name: "Close menu" }).click();
    }
  }
  if (!isMobile) {
    await page.goto("/");
    await page.getByRole("link", { name: "Skip to content" }).focus();
    await expect(
      page.getByRole("link", { name: "Skip to content" }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  }
});

test("server content is usable without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "A presence",
  );
  await expect(page.locator("noscript p").first()).toContainText("Amberwood");
  await page
    .locator("noscript")
    .getByRole("link", { name: /Santal/ })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Santal");
  await context.close();
});
