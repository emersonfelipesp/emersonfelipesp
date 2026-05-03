import { test, expect } from "@playwright/test";

test("nav links navigate to project pages", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Top navigation" });

  await nav.getByRole("link", { name: "~/netbox-proxbox" }).first().click();
  await expect(page).toHaveURL("/netbox-proxbox");

  await nav.getByRole("link", { name: "~/netbox-sdk" }).first().click();
  await expect(page).toHaveURL("/netbox-sdk");

  await nav.getByRole("link", { name: "~/proxmox-sdk" }).first().click();
  await expect(page).toHaveURL("/proxmox-sdk");
});

test("home nav link returns to /", async ({ page }) => {
  await page.goto("/netbox-proxbox");
  const nav = page.getByRole("navigation", { name: "Top navigation" });
  await nav.getByRole("link", { name: "~/home" }).first().click();
  await expect(page).toHaveURL("/");
});
