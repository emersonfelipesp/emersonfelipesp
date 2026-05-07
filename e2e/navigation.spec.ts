import { test, expect } from "@playwright/test";
import { gotoTopNavRoute } from "./_nav";

test("nav links navigate to project pages", async ({ page }) => {
  await page.goto("/");

  await gotoTopNavRoute(page, "/netbox-proxbox", "~/netbox-proxbox");
  await expect(page).toHaveURL("/netbox-proxbox");

  await gotoTopNavRoute(page, "/netbox-sdk", "~/netbox-sdk");
  await expect(page).toHaveURL("/netbox-sdk");

  await gotoTopNavRoute(page, "/proxmox-sdk", "~/proxmox-sdk");
  await expect(page).toHaveURL("/proxmox-sdk");
});

test("home nav link returns to /", async ({ page }) => {
  await page.goto("/netbox-proxbox");
  await gotoTopNavRoute(page, "/", "~/home");
  await expect(page).toHaveURL("/");
});
