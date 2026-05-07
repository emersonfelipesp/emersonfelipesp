import { expect, test, type Page } from "@playwright/test";
import { isMobile, languageTrigger, themeTrigger } from "./_nav";

const RESPONSIVE_ROUTES = [
  "/",
  "/netbox-proxbox",
  "/proxbox-api",
  "/netbox-sdk",
  "/proxmox-sdk",
  "/netbox-sdk/developer",
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    const viewportWidth = root.clientWidth;
    return Math.max(
      root.scrollWidth - viewportWidth,
      body.scrollWidth - viewportWidth,
      0,
    );
  });

  expect(overflow).toBeLessThanOrEqual(1);
}

test.describe("responsive layout", () => {
  for (const route of RESPONSIVE_ROUTES) {
    test(`${route} renders without horizontal overflow`, async ({ page }) => {
      await page.goto(route);

      await expect(page.locator("main")).toBeVisible();
      await expect(
        page.getByRole("navigation", { name: "Top navigation" }),
      ).toBeVisible();
      await expectNoHorizontalOverflow(page);
    });
  }

  test("global nav controls are usable", async ({ page }) => {
    await page.goto("/");

    const html = page.locator("html");
    await languageTrigger(page).click();
    await expect(page.getByRole("listbox", { name: "Language" })).toBeVisible();
    await page.getByRole("option", { name: "pt-br" }).click();
    await expect(html).toHaveAttribute("lang", "pt-BR");

    await themeTrigger(page).click();
    await expect(page.getByRole("listbox", { name: "Theme" })).toBeVisible();
    await page.getByRole("option", { name: "default-light" }).click();
    await expect(html).not.toHaveClass(/dark/);

    await expectNoHorizontalOverflow(page);
  });

  test("project view and releases controls are usable", async ({ page }) => {
    await page.goto("/netbox-proxbox");

    await page.getByRole("button", { name: /Project view:/ }).click();
    await expect(
      page.getByRole("listbox", { name: "Project view" }),
    ).toBeVisible();
    await page.getByRole("option", { name: "developer" }).click();
    await expect(page).toHaveURL("/netbox-proxbox/developer");
    await expectNoHorizontalOverflow(page);

    await page.goto("/netbox-proxbox");
    await page.getByRole("button", { name: /releases of netbox-proxbox/i }).click();
    await expect(
      page.getByRole("listbox", { name: /releases of netbox-proxbox/i }),
    ).toBeVisible();
    await page.getByRole("option", { name: /all releases/i }).click();
    await expect(page).toHaveURL("/netbox-proxbox/releases");
    await expectNoHorizontalOverflow(page);
  });

  test("mobile path picker switches routes", async ({ page }) => {
    test.skip(!isMobile(), "mobile-only layout");
    await page.goto("/");

    const pathTrigger = page.getByRole("button", { name: /^Route:/ });
    await expect(pathTrigger).toBeVisible();
    await pathTrigger.click();
    await expect(page.getByRole("listbox", { name: "Route" })).toBeVisible();
    await page
      .getByRole("option", { name: /netbox-proxbox/ })
      .first()
      .click();
    await expect(page).toHaveURL("/netbox-proxbox");
    await expect(
      page.getByRole("button", { name: /^Route: ~\/netbox-proxbox/ }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("mobile section picker scrolls to sections", async ({ page }) => {
    test.skip(!isMobile(), "mobile-only layout");
    await page.goto("/netbox-proxbox");

    const sectionTrigger = page.getByRole("button", { name: /^Section:/ });
    await expect(sectionTrigger).toBeVisible();
    await sectionTrigger.click();
    await expect(page.getByRole("listbox", { name: "Section" })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
