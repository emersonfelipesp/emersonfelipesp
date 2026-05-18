import { test, expect } from "@playwright/test";
import { gotoTopNavRoute, isMobile, openProxboxDropdown } from "./_nav";

test("nav links navigate to project pages", async ({ page }) => {
  await page.goto("/");

  await openProxboxDropdown(page);
  const nav = page.getByRole("navigation", { name: "Top navigation" });
  if (isMobile()) {
    await nav.getByRole("button", { name: /^Route:/ }).click();
    await page
      .getByRole("listbox", { name: /^(Route|Rota)$/ })
      .getByRole("option", { name: "~/netbox-proxbox", exact: true })
      .click();
  } else {
    await page.getByRole("menuitem", { name: "~/netbox-proxbox" }).first().click();
  }
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
