import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const base = process.env.BASE_URL || "http://127.0.0.1:3000";
const headless = process.env.HEADLESS !== "false";
const browser = await chromium.launch({ headless });
const results = [];
for (const mobile of [false, true]) {
  const context = await browser.newContext({
    viewport: mobile
      ? { width: 375, height: 812 }
      : { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    const stats = {
      lcp: 0,
      cls: 0,
      eventDurations: [],
      gpuFrames: 0,
      drawCalls: 0,
    };
    window.__lab = stats;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) stats.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries())
        if (!e.hadRecentInput) stats.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries())
          stats.eventDurations.push({
            name: e.name,
            duration: e.duration,
            interactionId: e.interactionId,
            startTime: e.startTime,
          });
      }).observe({ type: "event", buffered: true, durationThreshold: 16 });
    } catch {}
    for (const type of [WebGLRenderingContext, WebGL2RenderingContext])
      for (const method of ["drawElements", "drawArrays"]) {
        const original = type.prototype[method];
        type.prototype[method] = function (...args) {
          stats.drawCalls++;
          return original.apply(this, args);
        };
      }
    const original = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (cb) =>
      original((time) => {
        const before = stats.drawCalls;
        cb(time);
        if (stats.drawCalls > before) stats.gpuFrames++;
      });
  });
  const cdp = await context.newCDPSession(page);
  if (mobile) {
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 100,
      downloadThroughput: 1_600_000 / 8,
      uploadThroughput: 750_000 / 8,
    });
  }
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  await page
    .locator(".story-canvas-shell[data-ready=true]")
    .waitFor({ timeout: 60000 });
  await page.waitForTimeout(1200);
  const initial = await page.evaluate(() => ({
    ...window.__lab,
    resources: performance.getEntriesByType("resource").map((e) => ({
      name: new URL(e.name).pathname,
      bytes: e.encodedBodySize,
      duration: e.duration,
    })),
    navigation: performance.getEntriesByType("navigation")[0].toJSON(),
  }));
  const sample = await page.evaluate(async () => {
    const start = performance.now(),
      framesBefore = window.__lab.gpuFrames,
      drawBefore = window.__lab.drawCalls;
    let last = 0;
    const intervals = [];
    await new Promise((resolve) => {
      function step(t) {
        if (last) intervals.push(t - last);
        last = t;
        const elapsed = performance.now() - start;
        window.scrollTo({
          top: Math.min(700, elapsed * 0.15),
          behavior: "instant",
        });
        if (elapsed < 4000) requestAnimationFrame(step);
        else resolve();
      }
      requestAnimationFrame(step);
    });
    const seconds = (performance.now() - start) / 1000;
    const gl = document.querySelector("canvas")?.getContext("webgl2");
    const ext = gl?.getExtension("WEBGL_debug_renderer_info");
    return {
      seconds,
      renderedFrames: window.__lab.gpuFrames - framesBefore,
      renderedFps: (window.__lab.gpuFrames - framesBefore) / seconds,
      drawCalls: window.__lab.drawCalls - drawBefore,
      rafMedianMs: intervals.sort((a, b) => a - b)[
        Math.floor(intervals.length / 2)
      ],
      renderer: ext
        ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
        : "unavailable",
    };
  });
  const gallerySample = await page.evaluate(async () => {
    const element = document.querySelector("[data-scroll-gallery]");
    const top = element.getBoundingClientRect().top + window.scrollY;
    const range = Math.max(150, element.offsetHeight - window.innerHeight);
    window.scrollTo({ top, behavior: "instant" });
    await new Promise((resolve) => setTimeout(resolve, 600));
    const start = performance.now();
    const before = window.__lab.gpuFrames;
    const draws = window.__lab.drawCalls;
    await new Promise((resolve) => {
      function step() {
        const elapsed = performance.now() - start;
        window.scrollTo({ top: top + range * Math.min(1, elapsed / 4000), behavior: "instant" });
        if (elapsed < 4000) requestAnimationFrame(step);
        else resolve();
      }
      requestAnimationFrame(step);
    });
    const seconds = (performance.now() - start) / 1000;
    return {
      seconds,
      renderedFrames: window.__lab.gpuFrames - before,
      renderedFps: (window.__lab.gpuFrames - before) / seconds,
      drawCalls: window.__lab.drawCalls - draws,
    };
  });
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("button", { name: "Close menu" }).click();
  await page.getByRole("button", { name: /Neroli/ }).click();
  await page.getByRole("button", { name: /Santal/ }).click();
  await page.waitForTimeout(200);
  const interactions = await page.evaluate(() => ({
    maxEventDurationMs: Math.max(
      0,
      ...window.__lab.eventDurations
        .filter((e) => e.interactionId > 0)
        .map((e) => e.duration),
    ),
    eventSamples: window.__lab.eventDurations.filter((e) => e.interactionId > 0)
      .length,
    events: window.__lab.eventDurations.filter((e) => e.interactionId > 0),
    cls: window.__lab.cls,
  }));
  results.push({
    profile: mobile ? "mobile-constrained" : "desktop",
    conditions: mobile
      ? "375x812, DPR1, 4x CPU, 100ms RTT, 1.6Mbps download"
      : "1440x900, DPR1, unthrottled local Chromium",
    initial,
    sample,
    gallerySample,
    interactions,
    errors,
  });
  await context.close();
}
await browser.close();
await writeFile(
  process.env.PERFORMANCE_OUTPUT || "docs/performance-lab.json",
  JSON.stringify(
    {
      at: new Date().toISOString(),
      base,
      production: process.env.PRODUCTION === "1",
      headless,
      results,
    },
    null,
    2,
  ),
);
console.log(
  JSON.stringify(
    results.map(({ profile, sample, gallerySample, interactions, initial }) => ({
      profile,
      lcp: initial.lcp,
      cls: interactions.cls,
      sample,
      gallerySample,
      interactions,
    })),
    null,
    2,
  ),
);
