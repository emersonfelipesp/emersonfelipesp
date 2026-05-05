import { test, expect } from "@playwright/test";

test("/netbox-proxbox/releases loads local release index", async ({ page }) => {
  await page.goto("/netbox-proxbox/releases");
  await expect(page).toHaveURL("/netbox-proxbox/releases");
  await expect(page.getByRole("heading", { name: /netbox-proxbox releases/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /v0\.0\.14/i }).first()).toBeVisible();
});

test("/proxbox-api/releases loads local release index", async ({ page }) => {
  await page.goto("/proxbox-api/releases");
  await expect(page).toHaveURL("/proxbox-api/releases");
  await expect(page.getByRole("heading", { name: /proxbox-api releases/i })).toBeVisible();
});

test("release detail renders notes and assets section", async ({ page }) => {
  await page.goto("/netbox-proxbox/releases/v0.0.14");
  await expect(page).toHaveURL("/netbox-proxbox/releases/v0.0.14");
  await expect(page.getByRole("heading", { name: /netbox-proxbox v0\.0\.14/i })).toBeVisible();
  await expect(page.getByText("Version 0.0.14").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /\[open on GitHub\]/i })).toBeVisible();
});

test("project release dropdown routes to local release page", async ({ page }) => {
  await page.goto("/netbox-proxbox");
  await page.getByRole("button", { name: /releases of netbox-proxbox/i }).click();
  await page.getByRole("option", { name: /all releases/i }).click();
  await expect(page).toHaveURL("/netbox-proxbox/releases");
});
