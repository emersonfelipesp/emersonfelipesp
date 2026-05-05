import { test, expect } from "@playwright/test";

test("homepage loads with correct title and content", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/emersonfelipesp/);
  await expect(page.getByText("Emerson Felipe").first()).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Top navigation" })).toBeVisible();
});

test("/netbox-proxbox loads", async ({ page }) => {
  await page.goto("/netbox-proxbox");
  await expect(page).toHaveURL("/netbox-proxbox");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Top navigation" })).toBeVisible();
});

test("/netbox-sdk loads", async ({ page }) => {
  await page.goto("/netbox-sdk");
  await expect(page).toHaveURL("/netbox-sdk");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Top navigation" })).toBeVisible();
});

test("/proxmox-sdk loads", async ({ page }) => {
  await page.goto("/proxmox-sdk");
  await expect(page).toHaveURL("/proxmox-sdk");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Top navigation" })).toBeVisible();
});

test("/netbox-proxbox/developer loads", async ({ page }) => {
  await page.goto("/netbox-proxbox/developer");
  await expect(page).toHaveURL("/netbox-proxbox/developer");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Top navigation" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Project view" })).toBeVisible();
});

test("/proxbox-api/developer loads", async ({ page }) => {
  await page.goto("/proxbox-api/developer");
  await expect(page).toHaveURL("/proxbox-api/developer");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Top navigation" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Project view" })).toBeVisible();
});

test("/netbox-sdk/developer loads", async ({ page }) => {
  await page.goto("/netbox-sdk/developer");
  await expect(page).toHaveURL("/netbox-sdk/developer");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Top navigation" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Project view" })).toBeVisible();
});

test("/proxmox-sdk/developer loads", async ({ page }) => {
  await page.goto("/proxmox-sdk/developer");
  await expect(page).toHaveURL("/proxmox-sdk/developer");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Top navigation" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Project view" })).toBeVisible();
});
