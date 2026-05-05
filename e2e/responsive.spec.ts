import { expect, test, type Page } from "@playwright/test";

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
    await page.getByRole("button", { name: /--lang=/ }).click();
    await expect(page.getByRole("listbox", { name: "Language" })).toBeVisible();
    await page.getByRole("option", { name: "pt-br" }).click();
    await expect(html).toHaveAttribute("lang", "pt-BR");

    await page.getByRole("button", { name: /--theme=/ }).click();
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
});
